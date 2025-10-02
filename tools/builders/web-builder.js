/**
 * BMAD-METHOD Web Builder
 *
 * 此模块负责构建BMAD代理和团队的Web兼容包。
 * 它将代理、其依赖项和团队配置打包成单个文本文件，
 * 可用于基于Web的AI接口，如ChatGPT、Claude或Gemini。
 *
 * 架构概述:
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                           WebBuilder                                │
 * │                                                                     │
 * │  ┌─────────────────┐    ┌────────────────────┐    ┌─────────────┐  │
 * │  │ buildAgents()   │───▶│ buildAgentBundle() │───▶│ formatAgent()│  │
 * │  └─────────────────┘    └────────────────────┘    └─────────────┘  │
 * │                              │                                     │
 * │                              ▼                                     │
 * │                     ┌────────────────────┐                         │
 * │                     │ resolveAgentDeps() │                         │
 * │                     └────────────────────┘                         │
 * │                              │                                     │
 * │                              ▼                                     │
 * │  ┌─────────────────┐    ┌────────────────────┐    ┌─────────────┐  │
 * │  │ buildTeams()    │───▶│ buildTeamBundle()  │───▶│ formatTeam()│  │
 * │  └─────────────────┘    └────────────────────┘    └─────────────┘  │
 * │                              │                                     │
 * │                              ▼                                     │
 * │                     ┌────────────────────┐                         │
 * │                     │resolveTeamDeps()   │                         │
 * │                     └────────────────────┘                         │
 * │                              │                                     │
 * │                              ▼                                     │
 * │  ┌─────────────────┐    ┌────────────────────┐                     │
 * │  │buildExpansion() │───▶│buildExpansionPack()│                     │
 * │  └─────────────────┘    └────────────────────┘                     │
 * └─────────────────────────────────────────────────────────────────────┘
 *            │
 *            ▼
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                      Output Directories                             │
 * │  dist/                                                              │
 * │  ├── agents/     ← 单个代理包                                       │
 * │  ├── teams/      ← 包含所有代理的团队包                             │
 * │  └── expansion-packs/ ← 扩展包                                      │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * 关键组件:
 * - DependencyResolver: 解析代理和团队依赖关系
 * - YAML Utilities: 从代理文件中提取和处理YAML
 * - Path Conversion: 将文件路径转换为Web兼容路径
 * - Content Formatting: 用START/END标记包装内容以便Web导航
 *
 * 工作原理:
 * 1. 解析代理和团队的依赖关系
 * 2. 将所有相关资源打包成单个文本文件
 * 3. 使用特殊标记分隔不同资源，便于在Web环境中导航
 * 4. 生成可在Web AI接口中直接使用的包
 */

const fs = require('node:fs').promises;
const path = require('node:path');
const DependencyResolver = require('../lib/dependency-resolver');
const yamlUtilities = require('../lib/yaml-utils');

class WebBuilder {
  /**
   * 创建一个新的WebBuilder实例
   * @param {Object} options - 配置选项
   * @param {string} options.rootDir - BMAD项目的根目录
   * @param {string[]} options.outputDirs - 构建包的输出目录数组
   */
  constructor(options = {}) {
    // 项目根目录，默认为当前工作目录
    this.rootDir = options.rootDir || process.cwd();
    // 输出目录数组，默认为dist目录
    this.outputDirs = options.outputDirs || [path.join(this.rootDir, 'dist')];
    // 依赖解析器实例
    this.resolver = new DependencyResolver(this.rootDir);
    // Web代理启动说明模板路径
    this.templatePath = path.join(
      this.rootDir,
      'tools',
      'md-assets',
      'web-agent-startup-instructions.md',
    );
  }

  parseYaml(content) {
    const yaml = require('js-yaml');
    return yaml.load(content);
  }

  /**
   * 将绝对文件路径转换为带点前缀的Web兼容路径
   * 用于在Web包中创建一致的路径引用
   * @param {string} filePath - 要转换的绝对文件路径
   * @param {string} bundleRoot - 包的根名称（默认：'bmad-core'）
   * @returns {string} 带点前缀的Web兼容路径
   */
  convertToWebPath(filePath, bundleRoot = 'bmad-core') {
    // 将绝对路径转换为带点前缀的Web包路径
    // 所有资源都安装在包根目录下，因此使用该路径
    const relativePath = path.relative(this.rootDir, filePath);
    const pathParts = relativePath.split(path.sep);

    let resourcePath;
    if (pathParts[0] === 'expansion-packs') {
      // 对于扩展包，移除'expansion-packs/packname'并使用剩余部分
      resourcePath = pathParts.slice(2).join('/');
    } else {
      // 对于bmad-core、common等，移除第一部分
      resourcePath = pathParts.slice(1).join('/');
    }

    return `.${bundleRoot}/${resourcePath}`;
  }

  /**
   * 生成Web代理包的使用说明
   * 根据包类型生成动态的Web说明
   * @param {string} bundleType - 包类型 ('agent', 'team', 'expansion-agent', 'expansion-team')
   * @param {string|null} packName - 扩展包名称（如果适用）
   * @returns {string} 格式化的Web说明文本
   */
  generateWebInstructions(bundleType, packName = null) {
    // 根据包类型生成动态的Web说明
    const rootExample = packName ? `.${packName}` : '.bmad-core';
    const examplePath = packName
      ? `.${packName}/folder/filename.md`
      : '.bmad-core/folder/filename.md';
    const personasExample = packName
      ? `.${packName}/personas/analyst.md`
      : '.bmad-core/personas/analyst.md';
    const tasksExample = packName
      ? `.${packName}/tasks/create-story.md`
      : '.bmad-core/tasks/create-story.md';
    const utilitiesExample = packName
      ? `.${packName}/utils/template-format.md`
      : '.bmad-core/utils/template-format.md';
    const tasksReference = packName
      ? `.${packName}/tasks/create-story.md`
      : '.bmad-core/tasks/create-story.md';

    return `# Web Agent Bundle Instructions

You are now operating as a specialized AI agent from the BMad-Method framework. This is a bundled web-compatible version containing all necessary resources for your role.

## Important Instructions

1. **Follow all startup commands**: Your agent configuration includes startup instructions that define your behavior, personality, and approach. These MUST be followed exactly.

2. **Resource Navigation**: This bundle contains all resources you need. Resources are marked with tags like:

- \`==================== START: ${examplePath} ====================\`
- \`==================== END: ${examplePath} ====================\`

When you need to reference a resource mentioned in your instructions:

- Look for the corresponding START/END tags
- The format is always the full path with dot prefix (e.g., \`${personasExample}\`, \`${tasksExample}\`)
- If a section is specified (e.g., \`{root}/tasks/create-story.md#section-name\`), navigate to that section within the file

**Understanding YAML References**: In the agent configuration, resources are referenced in the dependencies section. For example:

\`\`\`yaml
dependencies:
  utils:
    - template-format
  tasks:
    - create-story
\`\`\`

These references map directly to bundle sections:

- \`utils: template-format\` → Look for \`==================== START: ${utilitiesExample} ====================\`
- \`tasks: create-story\` → Look for \`==================== START: ${tasksReference} ====================\`

3. **Execution Context**: You are operating in a web environment. All your capabilities and knowledge are contained within this bundle. Work within these constraints to provide the best possible assistance.

4. **Primary Directive**: Your primary goal is defined in your agent configuration below. Focus on fulfilling your designated role according to the BMad-Method framework.

---

`;
  }

  /**
   * 清理输出目录
   * 删除所有输出目录中的内容，为新的构建做准备
   * @returns {Promise<void>}
   */
  async cleanOutputDirs() {
    for (const dir of this.outputDirs) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
        console.log(`Cleaned: ${path.relative(this.rootDir, dir)}`);
      } catch (error) {
        console.debug(`Failed to clean directory ${dir}:`, error.message);
        // Directory might not exist, that's fine
      }
    }
  }

  /**
   * 构建所有代理包
   * 遍历所有代理并为每个代理创建Web兼容的包
   * @returns {Promise<void>}
   */
  async buildAgents() {
    const agents = await this.resolver.listAgents();

    for (const agentId of agents) {
      console.log(`  Building agent: ${agentId}`);
      const bundle = await this.buildAgentBundle(agentId);

      // 写入所有输出目录
      for (const outputDir of this.outputDirs) {
        const outputPath = path.join(outputDir, 'agents');
        await fs.mkdir(outputPath, { recursive: true });
        const outputFile = path.join(outputPath, `${agentId}.txt`);
        await fs.writeFile(outputFile, bundle, 'utf8');
      }
    }

    console.log(`Built ${agents.length} agent bundles in ${this.outputDirs.length} locations`);
  }

  /**
   * 构建所有团队包
   * 遍历所有团队并为每个团队创建Web兼容的包
   * @returns {Promise<void>}
   */
  async buildTeams() {
    const teams = await this.resolver.listTeams();

    for (const teamId of teams) {
      console.log(`  Building team: ${teamId}`);
      const bundle = await this.buildTeamBundle(teamId);

      // 写入所有输出目录
      for (const outputDir of this.outputDirs) {
        const outputPath = path.join(outputDir, 'teams');
        await fs.mkdir(outputPath, { recursive: true });
        const outputFile = path.join(outputPath, `${teamId}.txt`);
        await fs.writeFile(outputFile, bundle, 'utf8');
      }
    }

    console.log(`Built ${teams.length} team bundles in ${this.outputDirs.length} locations`);
  }

  /**
   * 构建单个代理包
   * 解析代理的依赖关系并将其所有依赖项打包成单个Web兼容文件
   * @param {string} agentId - 代理ID
   * @returns {Promise<string>} 格式化的代理包内容
   */
  async buildAgentBundle(agentId) {
    const dependencies = await this.resolver.resolveAgentDependencies(agentId);
    const template = this.generateWebInstructions('agent');

    const sections = [template];

    // 添加代理配置
    const agentPath = this.convertToWebPath(dependencies.agent.path, 'bmad-core');
    sections.push(this.formatSection(agentPath, dependencies.agent.content, 'bmad-core'));

    // 添加所有依赖项
    for (const resource of dependencies.resources) {
      const resourcePath = this.convertToWebPath(resource.path, 'bmad-core');
      sections.push(this.formatSection(resourcePath, resource.content, 'bmad-core'));
    }

    return sections.join('\n');
  }

  /**
   * 构建单个团队包
   * 解析团队的依赖关系并将其所有代理和依赖项打包成单个Web兼容文件
   * @param {string} teamId - 团队ID
   * @returns {Promise<string>} 格式化的团队包内容
   */
  async buildTeamBundle(teamId) {
    const dependencies = await this.resolver.resolveTeamDependencies(teamId);
    const template = this.generateWebInstructions('team');

    const sections = [template];

    // 添加团队配置
    const teamPath = this.convertToWebPath(dependencies.team.path, 'bmad-core');
    sections.push(this.formatSection(teamPath, dependencies.team.content, 'bmad-core'));

    // 添加所有代理
    for (const agent of dependencies.agents) {
      const agentPath = this.convertToWebPath(agent.path, 'bmad-core');
      sections.push(this.formatSection(agentPath, agent.content, 'bmad-core'));
    }

    // 添加所有去重的资源
    for (const resource of dependencies.resources) {
      const resourcePath = this.convertToWebPath(resource.path, 'bmad-core');
      sections.push(this.formatSection(resourcePath, resource.content, 'bmad-core'));
    }

    return sections.join('\n');
  }

  /**
   * 处理代理内容
   * 清理代理内容，移除不必要的属性并格式化YAML
   * @param {string} content - 原始代理内容
   * @returns {string} 处理后的代理内容
   */
  processAgentContent(content) {
    // 首先，用模板替换YAML之前的内容
    const yamlContent = yamlUtilities.extractYamlFromAgent(content);
    if (!yamlContent) return content;

    const yamlMatch = content.match(/```ya?ml\n([\s\S]*?)\n```/);
    if (!yamlMatch) return content;

    const yamlStartIndex = content.indexOf(yamlMatch[0]);
    const yamlEndIndex = yamlStartIndex + yamlMatch[0].length;

    // 解析YAML并移除root和IDE-FILE-RESOLUTION属性
    try {
      const yaml = require('js-yaml');
      const parsed = yaml.load(yamlContent);

      // 如果在根级别存在则移除这些属性
      delete parsed.root;
      delete parsed['IDE-FILE-RESOLUTION'];
      delete parsed['REQUEST-RESOLUTION'];

      // 如果存在，也从activation-instructions中移除
      if (parsed['activation-instructions'] && Array.isArray(parsed['activation-instructions'])) {
        parsed['activation-instructions'] = parsed['activation-instructions'].filter(
          (instruction) => {
            return (
              typeof instruction === 'string' &&
              !instruction.startsWith('IDE-FILE-RESOLUTION:') &&
              !instruction.startsWith('REQUEST-RESOLUTION:')
            );
          },
        );
      }

      // 重新构建YAML
      const cleanedYaml = yaml.dump(parsed, { lineWidth: -1 });

      // 从YAML中获取代理名称用于标题
      const agentName = parsed.agent?.id || 'agent';

      // 构建新内容，仅包含代理标题和YAML
      const newHeader = `# ${agentName}\n\nCRITICAL: Read the full YAML, start activation to alter your state of being, follow startup section instructions, stay in this being until told to exit this mode:\n\n`;
      const afterYaml = content.slice(Math.max(0, yamlEndIndex));

      return newHeader + '```yaml\n' + cleanedYaml.trim() + '\n```' + afterYaml;
    } catch (error) {
      console.warn('Failed to process agent YAML:', error.message);
      // 如果解析失败，返回原始内容
      return content;
    }
  }

  formatSection(path, content, bundleRoot = 'bmad-core') {
    const separator = '====================';

    // Process agent content if this is an agent file
    if (path.includes('/agents/')) {
      content = this.processAgentContent(content);
    }

    // Replace {root} references with the actual bundle root
    content = this.replaceRootReferences(content, bundleRoot);

    return [
      `${separator} START: ${path} ${separator}`,
      content.trim(),
      `${separator} END: ${path} ${separator}`,
      '',
    ].join('\n');
  }

  replaceRootReferences(content, bundleRoot) {
    // Replace {root} with the appropriate bundle root path
    return content.replaceAll('{root}', `.${bundleRoot}`);
  }

  async validate() {
    console.log('Validating agent configurations...');
    const agents = await this.resolver.listAgents();
    for (const agentId of agents) {
      try {
        await this.resolver.resolveAgentDependencies(agentId);
        console.log(`  ✓ ${agentId}`);
      } catch (error) {
        console.log(`  ✗ ${agentId}: ${error.message}`);
        throw error;
      }
    }

    console.log('\nValidating team configurations...');
    const teams = await this.resolver.listTeams();
    for (const teamId of teams) {
      try {
        await this.resolver.resolveTeamDependencies(teamId);
        console.log(`  ✓ ${teamId}`);
      } catch (error) {
        console.log(`  ✗ ${teamId}: ${error.message}`);
        throw error;
      }
    }
  }

  async buildAllExpansionPacks(options = {}) {
    const expansionPacks = await this.listExpansionPacks();

    for (const packName of expansionPacks) {
      console.log(`  Building expansion pack: ${packName}`);
      await this.buildExpansionPack(packName, options);
    }

    console.log(`Built ${expansionPacks.length} expansion pack bundles`);
  }

  async buildExpansionPack(packName, options = {}) {
    const packDir = path.join(this.rootDir, 'expansion-packs', packName);
    const outputDirectories = [path.join(this.rootDir, 'dist', 'expansion-packs', packName)];

    // Clean output directories if requested
    if (options.clean !== false) {
      for (const outputDir of outputDirectories) {
        try {
          await fs.rm(outputDir, { recursive: true, force: true });
        } catch {
          // Directory might not exist, that's fine
        }
      }
    }

    // Build individual agents first
    const agentsDir = path.join(packDir, 'agents');
    try {
      const agentFiles = await fs.readdir(agentsDir);
      const agentMarkdownFiles = agentFiles.filter((f) => f.endsWith('.md'));

      if (agentMarkdownFiles.length > 0) {
        console.log(`    Building individual agents for ${packName}:`);

        for (const agentFile of agentMarkdownFiles) {
          const agentName = agentFile.replace('.md', '');
          console.log(`      - ${agentName}`);

          // Build individual agent bundle
          const bundle = await this.buildExpansionAgentBundle(packName, packDir, agentName);

          // Write to all output directories
          for (const outputDir of outputDirectories) {
            const agentsOutputDir = path.join(outputDir, 'agents');
            await fs.mkdir(agentsOutputDir, { recursive: true });
            const outputFile = path.join(agentsOutputDir, `${agentName}.txt`);
            await fs.writeFile(outputFile, bundle, 'utf8');
          }
        }
      }
    } catch {
      console.debug(`    No agents directory found for ${packName}`);
    }

    // Build team bundle
    const agentTeamsDir = path.join(packDir, 'agent-teams');
    try {
      const teamFiles = await fs.readdir(agentTeamsDir);
      const teamFile = teamFiles.find((f) => f.endsWith('.yaml'));

      if (teamFile) {
        console.log(`    Building team bundle for ${packName}`);
        const teamConfigPath = path.join(agentTeamsDir, teamFile);

        // Build expansion pack as a team bundle
        const bundle = await this.buildExpansionTeamBundle(packName, packDir, teamConfigPath);

        // Write to all output directories
        for (const outputDir of outputDirectories) {
          const teamsOutputDir = path.join(outputDir, 'teams');
          await fs.mkdir(teamsOutputDir, { recursive: true });
          const outputFile = path.join(teamsOutputDir, teamFile.replace('.yaml', '.txt'));
          await fs.writeFile(outputFile, bundle, 'utf8');
          console.log(`    ✓ Created bundle: ${path.relative(this.rootDir, outputFile)}`);
        }
      } else {
        console.warn(`    ⚠ No team configuration found in ${packName}/agent-teams/`);
      }
    } catch {
      console.warn(`    ⚠ No agent-teams directory found for ${packName}`);
    }
  }

  async buildExpansionAgentBundle(packName, packDir, agentName) {
    const template = this.generateWebInstructions('expansion-agent', packName);
    const sections = [template];

    // Add agent configuration
    const agentPath = path.join(packDir, 'agents', `${agentName}.md`);
    const agentContent = await fs.readFile(agentPath, 'utf8');
    const agentWebPath = this.convertToWebPath(agentPath, packName);
    sections.push(this.formatSection(agentWebPath, agentContent, packName));

    // Resolve and add agent dependencies
    const yamlContent = yamlUtilities.extractYamlFromAgent(agentContent);
    if (yamlContent) {
      try {
        const yaml = require('js-yaml');
        const agentConfig = yaml.load(yamlContent);

        if (agentConfig.dependencies) {
          // Add resources, first try expansion pack, then core
          for (const [resourceType, resources] of Object.entries(agentConfig.dependencies)) {
            if (Array.isArray(resources)) {
              for (const resourceName of resources) {
                let found = false;

                // Try expansion pack first
                const resourcePath = path.join(packDir, resourceType, resourceName);
                try {
                  const resourceContent = await fs.readFile(resourcePath, 'utf8');
                  const resourceWebPath = this.convertToWebPath(resourcePath, packName);
                  sections.push(this.formatSection(resourceWebPath, resourceContent, packName));
                  found = true;
                } catch {
                  // Not in expansion pack, continue
                }

                // If not found in expansion pack, try core
                if (!found) {
                  const corePath = path.join(this.rootDir, 'bmad-core', resourceType, resourceName);
                  try {
                    const coreContent = await fs.readFile(corePath, 'utf8');
                    const coreWebPath = this.convertToWebPath(corePath, packName);
                    sections.push(this.formatSection(coreWebPath, coreContent, packName));
                    found = true;
                  } catch {
                    // Not in core either, continue
                  }
                }

                // If not found in core, try common folder
                if (!found) {
                  const commonPath = path.join(this.rootDir, 'common', resourceType, resourceName);
                  try {
                    const commonContent = await fs.readFile(commonPath, 'utf8');
                    const commonWebPath = this.convertToWebPath(commonPath, packName);
                    sections.push(this.formatSection(commonWebPath, commonContent, packName));
                    found = true;
                  } catch {
                    // Not in common either, continue
                  }
                }

                if (!found) {
                  console.warn(
                    `    ⚠ Dependency ${resourceType}#${resourceName} not found in expansion pack or core`,
                  );
                }
              }
            }
          }
        }
      } catch (error) {
        console.debug(`Failed to parse agent YAML for ${agentName}:`, error.message);
      }
    }

    return sections.join('\n');
  }

  async buildExpansionTeamBundle(packName, packDir, teamConfigPath) {
    const template = this.generateWebInstructions('expansion-team', packName);

    const sections = [template];

    // Add team configuration and parse to get agent list
    const teamContent = await fs.readFile(teamConfigPath, 'utf8');
    const teamFileName = path.basename(teamConfigPath, '.yaml');
    const teamConfig = this.parseYaml(teamContent);
    const teamWebPath = this.convertToWebPath(teamConfigPath, packName);
    sections.push(this.formatSection(teamWebPath, teamContent, packName));

    // Get list of expansion pack agents
    const expansionAgents = new Set();
    const agentsDir = path.join(packDir, 'agents');
    try {
      const agentFiles = await fs.readdir(agentsDir);
      for (const agentFile of agentFiles.filter((f) => f.endsWith('.md'))) {
        const agentName = agentFile.replace('.md', '');
        expansionAgents.add(agentName);
      }
    } catch {
      console.warn(`    ⚠ No agents directory found in ${packName}`);
    }

    // Build a map of all available expansion pack resources for override checking
    const expansionResources = new Map();
    const resourceDirectories = ['templates', 'tasks', 'checklists', 'workflows', 'data'];
    for (const resourceDir of resourceDirectories) {
      const resourcePath = path.join(packDir, resourceDir);
      try {
        const resourceFiles = await fs.readdir(resourcePath);
        for (const resourceFile of resourceFiles.filter(
          (f) => f.endsWith('.md') || f.endsWith('.yaml'),
        )) {
          expansionResources.set(`${resourceDir}#${resourceFile}`, true);
        }
      } catch {
        // Directory might not exist, that's fine
      }
    }

    // Process all agents listed in team configuration
    const agentsToProcess = teamConfig.agents || [];

    // Ensure bmad-orchestrator is always included for teams
    if (!agentsToProcess.includes('bmad-orchestrator')) {
      console.warn(`    ⚠ Team ${teamFileName} missing bmad-orchestrator, adding automatically`);
      agentsToProcess.unshift('bmad-orchestrator');
    }

    // Track all dependencies from all agents (deduplicated)
    const allDependencies = new Map();

    for (const agentId of agentsToProcess) {
      if (expansionAgents.has(agentId)) {
        // Use expansion pack version (override)
        const agentPath = path.join(agentsDir, `${agentId}.md`);
        const agentContent = await fs.readFile(agentPath, 'utf8');
        const expansionAgentWebPath = this.convertToWebPath(agentPath, packName);
        sections.push(this.formatSection(expansionAgentWebPath, agentContent, packName));

        // Parse and collect dependencies from expansion agent
        const agentYaml = agentContent.match(/```yaml\n([\s\S]*?)\n```/);
        if (agentYaml) {
          try {
            const agentConfig = this.parseYaml(agentYaml[1]);
            if (agentConfig.dependencies) {
              for (const [resourceType, resources] of Object.entries(agentConfig.dependencies)) {
                if (Array.isArray(resources)) {
                  for (const resourceName of resources) {
                    const key = `${resourceType}#${resourceName}`;
                    if (!allDependencies.has(key)) {
                      allDependencies.set(key, { type: resourceType, name: resourceName });
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.debug(`Failed to parse agent YAML for ${agentId}:`, error.message);
          }
        }
      } else {
        // Use core BMad version
        try {
          const coreAgentPath = path.join(this.rootDir, 'bmad-core', 'agents', `${agentId}.md`);
          const coreAgentContent = await fs.readFile(coreAgentPath, 'utf8');
          const coreAgentWebPath = this.convertToWebPath(coreAgentPath, packName);
          sections.push(this.formatSection(coreAgentWebPath, coreAgentContent, packName));

          // Parse and collect dependencies from core agent
          const yamlContent = yamlUtilities.extractYamlFromAgent(coreAgentContent, true);
          if (yamlContent) {
            try {
              const agentConfig = this.parseYaml(yamlContent);
              if (agentConfig.dependencies) {
                for (const [resourceType, resources] of Object.entries(agentConfig.dependencies)) {
                  if (Array.isArray(resources)) {
                    for (const resourceName of resources) {
                      const key = `${resourceType}#${resourceName}`;
                      if (!allDependencies.has(key)) {
                        allDependencies.set(key, { type: resourceType, name: resourceName });
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.debug(`Failed to parse agent YAML for ${agentId}:`, error.message);
            }
          }
        } catch {
          console.warn(`    ⚠ Agent ${agentId} not found in core or expansion pack`);
        }
      }
    }

    // Add all collected dependencies from agents
    // Always prefer expansion pack versions if they exist
    for (const [key, dep] of allDependencies) {
      let found = false;

      // Always check expansion pack first, even if the dependency came from a core agent
      if (expansionResources.has(key)) {
        // We know it exists in expansion pack, find and load it
        const expansionPath = path.join(packDir, dep.type, dep.name);
        try {
          const content = await fs.readFile(expansionPath, 'utf8');
          const expansionWebPath = this.convertToWebPath(expansionPath, packName);
          sections.push(this.formatSection(expansionWebPath, content, packName));
          console.log(`      ✓ Using expansion override for ${key}`);
          found = true;
        } catch {
          // Try next extension
        }
      }

      // If not found in expansion pack (or doesn't exist there), try core
      if (!found) {
        const corePath = path.join(this.rootDir, 'bmad-core', dep.type, dep.name);
        try {
          const content = await fs.readFile(corePath, 'utf8');
          const coreWebPath = this.convertToWebPath(corePath, packName);
          sections.push(this.formatSection(coreWebPath, content, packName));
          found = true;
        } catch {
          // Not in core either, continue
        }
      }

      // If not found in core, try common folder
      if (!found) {
        const commonPath = path.join(this.rootDir, 'common', dep.type, dep.name);
        try {
          const content = await fs.readFile(commonPath, 'utf8');
          const commonWebPath = this.convertToWebPath(commonPath, packName);
          sections.push(this.formatSection(commonWebPath, content, packName));
          found = true;
        } catch {
          // Not in common either, continue
        }
      }

      if (!found) {
        console.warn(`    ⚠ Dependency ${key} not found in expansion pack or core`);
      }
    }

    // Add remaining expansion pack resources not already included as dependencies
    for (const resourceDir of resourceDirectories) {
      const resourcePath = path.join(packDir, resourceDir);
      try {
        const resourceFiles = await fs.readdir(resourcePath);
        for (const resourceFile of resourceFiles.filter(
          (f) => f.endsWith('.md') || f.endsWith('.yaml'),
        )) {
          const filePath = path.join(resourcePath, resourceFile);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const fileName = resourceFile.replace(/\.(md|yaml)$/, '');

          // Only add if not already included as a dependency
          const resourceKey = `${resourceDir}#${fileName}`;
          if (!allDependencies.has(resourceKey)) {
            const fullResourcePath = path.join(resourcePath, resourceFile);
            const resourceWebPath = this.convertToWebPath(fullResourcePath, packName);
            sections.push(this.formatSection(resourceWebPath, fileContent, packName));
          }
        }
      } catch {
        // Directory might not exist, that's fine
      }
    }

    return sections.join('\n');
  }

  async listExpansionPacks() {
    const expansionPacksDir = path.join(this.rootDir, 'expansion-packs');
    try {
      const entries = await fs.readdir(expansionPacksDir, { withFileTypes: true });
      return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
      console.warn('No expansion-packs directory found');
      return [];
    }
  }

  listAgents() {
    return this.resolver.listAgents();
  }
}

module.exports = WebBuilder;
