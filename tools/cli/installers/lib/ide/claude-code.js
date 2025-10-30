const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { getProjectRoot, getSourcePath, getModulePath } = require('../../../lib/project-root');
const { WorkflowCommandGenerator } = require('./workflow-command-generator');
const { TaskToolCommandGenerator } = require('./task-tool-command-generator');
const {
  loadModuleInjectionConfig,
  shouldApplyInjection,
  filterAgentInstructions,
  resolveSubagentFiles,
} = require('./shared/module-injections');
const { getAgentsFromBmad, getAgentsFromDir } = require('./shared/bmad-artifacts');

/**
 * Claude Code IDE setup handler
 */
class ClaudeCodeSetup extends BaseIdeSetup {
  constructor() {
    super('claude-code', 'Claude Code', true); // preferred IDE
    this.configDir = '.claude';
    this.commandsDir = 'commands';
    this.agentsDir = 'agents';
  }

  /**
   * Collect configuration choices before installation
   * @param {Object} options - Configuration options
   * @returns {Object} Collected configuration
   */
  async collectConfiguration(options = {}) {
    const config = {
      subagentChoices: null,
      installLocation: null,
    };

    const sourceModulesPath = getSourcePath('modules');
    const modules = options.selectedModules || [];

    for (const moduleName of modules) {
      // Check for Claude Code sub-module injection config in SOURCE directory
      const injectionConfigPath = path.join(sourceModulesPath, moduleName, 'sub-modules', 'claude-code', 'injections.yaml');

      if (await this.exists(injectionConfigPath)) {
        const fs = require('fs-extra');
        const yaml = require('js-yaml');

        try {
          // Load injection configuration
          const configContent = await fs.readFile(injectionConfigPath, 'utf8');
          const injectionConfig = yaml.load(configContent);

          // Ask about subagents if they exist and we haven't asked yet
          if (injectionConfig.subagents && !config.subagentChoices) {
            config.subagentChoices = await this.promptSubagentInstallation(injectionConfig.subagents);

            if (config.subagentChoices.install !== 'none') {
              // Ask for installation location
              const inquirer = require('inquirer');
              const locationAnswer = await inquirer.prompt([
                {
                  type: 'list',
                  name: 'location',
                  message: 'Where would you like to install Claude Code subagents?',
                  choices: [
                    { name: 'Project level (.claude/agents/)', value: 'project' },
                    { name: 'User level (~/.claude/agents/)', value: 'user' },
                  ],
                  default: 'project',
                },
              ]);
              config.installLocation = locationAnswer.location;
            }
          }
        } catch (error) {
          console.log(chalk.yellow(`  Warning: Failed to process ${moduleName} features: ${error.message}`));
        }
      }
    }

    return config;
  }

  /**
   * Setup Claude Code IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    // Store project directory for use in processContent
    this.projectDir = projectDir;

    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .claude/commands directory structure
    const claudeDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(claudeDir, this.commandsDir);
    const bmadCommandsDir = path.join(commandsDir, 'bmad');

    await this.ensureDir(bmadCommandsDir);

    // Get agents from INSTALLED bmad/ directory
    // Base installer has already built .md files from .agent.yaml sources
    const agents = await getAgentsFromBmad(bmadDir, options.selectedModules || []);

    // Create directories for each module (including standalone)
    const modules = new Set();
    for (const item of agents) modules.add(item.module);

    for (const module of modules) {
      await this.ensureDir(path.join(bmadCommandsDir, module));
      await this.ensureDir(path.join(bmadCommandsDir, module, 'agents'));
    }

    // Copy agents from bmad/ to .claude/commands/
    let agentCount = 0;
    for (const agent of agents) {
      const sourcePath = agent.path;
      const targetPath = path.join(bmadCommandsDir, agent.module, 'agents', `${agent.name}.md`);

      const content = await this.readAndProcess(sourcePath, {
        module: agent.module,
        name: agent.name,
      });

      await this.writeFile(targetPath, content);
      agentCount++;
    }

    // Process Claude Code specific injections for installed modules
    // Use pre-collected configuration if available, or skip if already configured
    if (options.preCollectedConfig && options.preCollectedConfig._alreadyConfigured) {
      // IDE is already configured from previous installation, skip prompting
      // Just process with default/existing configuration
      await this.processModuleInjectionsWithConfig(projectDir, bmadDir, options, {});
    } else if (options.preCollectedConfig) {
      await this.processModuleInjectionsWithConfig(projectDir, bmadDir, options, options.preCollectedConfig);
    } else {
      await this.processModuleInjections(projectDir, bmadDir, options);
    }

    // Skip CLAUDE.md creation - let user manage their own CLAUDE.md file
    // await this.createClaudeConfig(projectDir, modules);

    // Generate workflow commands from manifest (if it exists)
    const workflowGen = new WorkflowCommandGenerator();
    const workflowResult = await workflowGen.generateWorkflowCommands(projectDir, bmadDir);

    // Generate task and tool commands from manifests (if they exist)
    const taskToolGen = new TaskToolCommandGenerator();
    const taskToolResult = await taskToolGen.generateTaskToolCommands(projectDir, bmadDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents installed`));
    if (workflowResult.generated > 0) {
      console.log(chalk.dim(`  - ${workflowResult.generated} workflow commands generated`));
    }
    if (taskToolResult.generated > 0) {
      console.log(
        chalk.dim(
          `  - ${taskToolResult.generated} task/tool commands generated (${taskToolResult.tasks} tasks, ${taskToolResult.tools} tools)`,
        ),
      );
    }
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, bmadCommandsDir)}`));

    return {
      success: true,
      agents: agentCount,
    };
  }

  // Method removed - CLAUDE.md file management left to user

  /**
   * Read and process file content
   */
  async readAndProcess(filePath, metadata) {
    const fs = require('fs-extra');
    const content = await fs.readFile(filePath, 'utf8');
    return this.processContent(content, metadata);
  }

  /**
   * Override processContent to keep {project-root} placeholder
   */
  processContent(content, metadata = {}) {
    // Use the base class method WITHOUT projectDir to preserve {project-root} placeholder
    return super.processContent(content, metadata);
  }

  /**
   * Get agents from source modules (not installed location)
   */
  async getAgentsFromSource(sourceDir, selectedModules) {
    const fs = require('fs-extra');
    const agents = [];

    // Add core agents
    const corePath = getModulePath('core');
    if (await fs.pathExists(path.join(corePath, 'agents'))) {
      const coreAgents = await getAgentsFromDir(path.join(corePath, 'agents'), 'core');
      agents.push(...coreAgents);
    }

    // Add module agents
    for (const moduleName of selectedModules) {
      const modulePath = path.join(sourceDir, moduleName);
      const agentsPath = path.join(modulePath, 'agents');

      if (await fs.pathExists(agentsPath)) {
        const moduleAgents = await getAgentsFromDir(agentsPath, moduleName);
        agents.push(...moduleAgents);
      }
    }

    return agents;
  }

  /**
   * Process module injections with pre-collected configuration
   */
  async processModuleInjectionsWithConfig(projectDir, bmadDir, options, preCollectedConfig) {
    // Get list of installed modules
    const modules = options.selectedModules || [];
    const { subagentChoices, installLocation } = preCollectedConfig;

    // Get the actual source directory (not the installation directory)
    await this.processModuleInjectionsInternal({
      projectDir,
      modules,
      handler: 'claude-code',
      subagentChoices,
      installLocation,
      interactive: false,
    });
  }

  /**
   * Process Claude Code specific injections for installed modules
   * Looks for injections.yaml in each module's claude-code sub-module
   */
  async processModuleInjections(projectDir, bmadDir, options) {
    // Get list of installed modules
    const modules = options.selectedModules || [];
    let subagentChoices = null;
    let installLocation = null;

    // Get the actual source directory (not the installation directory)
    const { subagentChoices: updatedChoices, installLocation: updatedLocation } = await this.processModuleInjectionsInternal({
      projectDir,
      modules,
      handler: 'claude-code',
      subagentChoices,
      installLocation,
      interactive: true,
    });

    if (updatedChoices) {
      subagentChoices = updatedChoices;
    }
    if (updatedLocation) {
      installLocation = updatedLocation;
    }
  }

  async processModuleInjectionsInternal({ projectDir, modules, handler, subagentChoices, installLocation, interactive = false }) {
    let choices = subagentChoices;
    let location = installLocation;

    for (const moduleName of modules) {
      const configData = await loadModuleInjectionConfig(handler, moduleName);

      if (!configData) {
        continue;
      }

      const { config, handlerBaseDir } = configData;

      if (interactive) {
        console.log(chalk.cyan(`\nConfiguring ${moduleName} ${handler.replace('-', ' ')} features...`));
      }

      if (interactive && config.subagents && !choices) {
        choices = await this.promptSubagentInstallation(config.subagents);

        if (choices.install !== 'none') {
          const inquirer = require('inquirer');
          const locationAnswer = await inquirer.prompt([
            {
              type: 'list',
              name: 'location',
              message: 'Where would you like to install Claude Code subagents?',
              choices: [
                { name: 'Project level (.claude/agents/)', value: 'project' },
                { name: 'User level (~/.claude/agents/)', value: 'user' },
              ],
              default: 'project',
            },
          ]);
          location = locationAnswer.location;
        }
      }

      if (config.injections && choices && choices.install !== 'none') {
        for (const injection of config.injections) {
          if (shouldApplyInjection(injection, choices)) {
            await this.injectContent(projectDir, injection, choices);
          }
        }
      }

      if (config.subagents && choices && choices.install !== 'none') {
        await this.copySelectedSubagents(projectDir, handlerBaseDir, config.subagents, choices, location || 'project');
      }
    }

    return { subagentChoices: choices, installLocation: location };
  }

  /**
   * Prompt user for subagent installation preferences
   */
  async promptSubagentInstallation(subagentConfig) {
    const inquirer = require('inquirer');

    // First ask if they want to install subagents
    const { install } = await inquirer.prompt([
      {
        type: 'list',
        name: 'install',
        message: 'Would you like to install Claude Code subagents for enhanced functionality?',
        choices: [
          { name: 'Yes, install all subagents', value: 'all' },
          { name: 'Yes, let me choose specific subagents', value: 'selective' },
          { name: 'No, skip subagent installation', value: 'none' },
        ],
        default: 'all',
      },
    ]);

    if (install === 'selective') {
      // Show list of available subagents with descriptions
      const subagentInfo = {
        'market-researcher.md': 'Market research and competitive analysis',
        'requirements-analyst.md': 'Requirements extraction and validation',
        'technical-evaluator.md': 'Technology stack evaluation',
        'epic-optimizer.md': 'Epic and story breakdown optimization',
        'document-reviewer.md': 'Document quality review',
      };

      const { selected } = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selected',
          message: 'Select subagents to install:',
          choices: subagentConfig.files.map((file) => ({
            name: `${file.replace('.md', '')} - ${subagentInfo[file] || 'Specialized assistant'}`,
            value: file,
            checked: true,
          })),
        },
      ]);

      return { install: 'selective', selected };
    }

    return { install };
  }

  /**
   * Inject content at specified point in file
   */
  async injectContent(projectDir, injection, subagentChoices = null) {
    const fs = require('fs-extra');
    const targetPath = path.join(projectDir, injection.file);

    if (await this.exists(targetPath)) {
      let content = await fs.readFile(targetPath, 'utf8');
      const marker = `<!-- IDE-INJECT-POINT: ${injection.point} -->`;

      if (content.includes(marker)) {
        let injectionContent = injection.content;

        // Filter content if selective subagents chosen
        if (subagentChoices && subagentChoices.install === 'selective' && injection.point === 'pm-agent-instructions') {
          injectionContent = filterAgentInstructions(injection.content, subagentChoices.selected);
        }

        content = content.replace(marker, injectionContent);
        await fs.writeFile(targetPath, content);
        console.log(chalk.dim(`    Injected: ${injection.point} → ${injection.file}`));
      }
    }
  }

  /**
   * Copy selected subagents to appropriate Claude agents directory
   */
  async copySelectedSubagents(projectDir, handlerBaseDir, subagentConfig, choices, location) {
    const fs = require('fs-extra');
    const os = require('node:os');

    // Determine target directory based on user choice
    let targetDir;
    if (location === 'user') {
      targetDir = path.join(os.homedir(), '.claude', 'agents');
      console.log(chalk.dim(`  Installing subagents globally to: ~/.claude/agents/`));
    } else {
      targetDir = path.join(projectDir, '.claude', 'agents');
      console.log(chalk.dim(`  Installing subagents to project: .claude/agents/`));
    }

    // Ensure target directory exists
    await this.ensureDir(targetDir);

    const resolvedFiles = await resolveSubagentFiles(handlerBaseDir, subagentConfig, choices);

    let copiedCount = 0;
    for (const resolved of resolvedFiles) {
      try {
        const sourcePath = resolved.absolutePath;

        const subFolder = path.dirname(resolved.relativePath);
        let targetPath;
        if (subFolder && subFolder !== '.') {
          const targetSubDir = path.join(targetDir, subFolder);
          await this.ensureDir(targetSubDir);
          targetPath = path.join(targetSubDir, path.basename(resolved.file));
        } else {
          targetPath = path.join(targetDir, path.basename(resolved.file));
        }

        await fs.copyFile(sourcePath, targetPath);
        console.log(chalk.green(`    ✓ Installed: ${subFolder === '.' ? '' : `${subFolder}/`}${path.basename(resolved.file, '.md')}`));
        copiedCount++;
      } catch (error) {
        console.log(chalk.yellow(`    ⚠ Error copying ${resolved.file}: ${error.message}`));
      }
    }

    if (copiedCount > 0) {
      console.log(chalk.dim(`  Total subagents installed: ${copiedCount}`));
    }
  }
}

module.exports = { ClaudeCodeSetup };
