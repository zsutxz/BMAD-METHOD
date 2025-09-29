const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { getProjectRoot, getSourcePath, getModulePath } = require('../../../lib/project-root');
const { WorkflowCommandGenerator } = require('./workflow-command-generator');

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

    // Get agents and tasks from SOURCE, not installed location
    // This ensures we process files with {project-root} placeholders intact
    const sourceDir = getSourcePath('modules');
    const agents = await this.getAgentsFromSource(sourceDir, options.selectedModules || []);
    const tasks = await this.getTasksFromSource(sourceDir, options.selectedModules || []);

    // Create directories for each module
    const modules = new Set();
    for (const item of [...agents, ...tasks]) modules.add(item.module);

    for (const module of modules) {
      await this.ensureDir(path.join(bmadCommandsDir, module));
      await this.ensureDir(path.join(bmadCommandsDir, module, 'agents'));
      await this.ensureDir(path.join(bmadCommandsDir, module, 'tasks'));
    }

    // Process and copy agents
    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readAndProcess(agent.path, {
        module: agent.module,
        name: agent.name,
      });

      const targetPath = path.join(bmadCommandsDir, agent.module, 'agents', `${agent.name}.md`);

      await this.writeFile(targetPath, content);
      agentCount++;
    }

    // Process and copy tasks
    let taskCount = 0;
    for (const task of tasks) {
      const content = await this.readAndProcess(task.path, {
        module: task.module,
        name: task.name,
      });

      const targetPath = path.join(bmadCommandsDir, task.module, 'tasks', `${task.name}.md`);

      await this.writeFile(targetPath, content);
      taskCount++;
    }

    // Process Claude Code specific injections for installed modules
    // Use pre-collected configuration if available
    if (options.preCollectedConfig) {
      await this.processModuleInjectionsWithConfig(projectDir, bmadDir, options, options.preCollectedConfig);
    } else {
      await this.processModuleInjections(projectDir, bmadDir, options);
    }

    // Skip CLAUDE.md creation - let user manage their own CLAUDE.md file
    // await this.createClaudeConfig(projectDir, modules);

    // Generate workflow commands from manifest (if it exists)
    const workflowGen = new WorkflowCommandGenerator();
    const workflowResult = await workflowGen.generateWorkflowCommands(projectDir, bmadDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents installed`));
    console.log(chalk.dim(`  - ${taskCount} tasks installed`));
    if (workflowResult.generated > 0) {
      console.log(chalk.dim(`  - ${workflowResult.generated} workflow commands generated`));
    }
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, bmadCommandsDir)}`));

    return {
      success: true,
      agents: agentCount,
      tasks: taskCount,
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
   * Override processContent to use the actual project directory path
   */
  processContent(content, metadata = {}) {
    // Use the base class method with the actual project directory
    return super.processContent(content, metadata, this.projectDir);
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
      const coreAgents = await this.getAgentsFromDir(path.join(corePath, 'agents'), 'core');
      agents.push(...coreAgents);
    }

    // Add module agents
    for (const moduleName of selectedModules) {
      const modulePath = path.join(sourceDir, moduleName);
      const agentsPath = path.join(modulePath, 'agents');

      if (await fs.pathExists(agentsPath)) {
        const moduleAgents = await this.getAgentsFromDir(agentsPath, moduleName);
        agents.push(...moduleAgents);
      }
    }

    return agents;
  }

  /**
   * Get tasks from source modules (not installed location)
   */
  async getTasksFromSource(sourceDir, selectedModules) {
    const fs = require('fs-extra');
    const tasks = [];

    // Add core tasks
    const corePath = getModulePath('core');
    if (await fs.pathExists(path.join(corePath, 'tasks'))) {
      const coreTasks = await this.getTasksFromDir(path.join(corePath, 'tasks'), 'core');
      tasks.push(...coreTasks);
    }

    // Add module tasks
    for (const moduleName of selectedModules) {
      const modulePath = path.join(sourceDir, moduleName);
      const tasksPath = path.join(modulePath, 'tasks');

      if (await fs.pathExists(tasksPath)) {
        const moduleTasks = await this.getTasksFromDir(tasksPath, moduleName);
        tasks.push(...moduleTasks);
      }
    }

    return tasks;
  }

  /**
   * Get agents from a specific directory
   */
  async getAgentsFromDir(dirPath, moduleName) {
    const fs = require('fs-extra');
    const agents = [];

    const files = await fs.readdir(dirPath);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Skip web-only agents
        if (content.includes('localskip="true"')) {
          continue;
        }

        agents.push({
          path: filePath,
          name: file.replace('.md', ''),
          module: moduleName,
        });
      }
    }

    return agents;
  }

  /**
   * Get tasks from a specific directory
   */
  async getTasksFromDir(dirPath, moduleName) {
    const fs = require('fs-extra');
    const tasks = [];

    const files = await fs.readdir(dirPath);
    for (const file of files) {
      if (file.endsWith('.md')) {
        tasks.push({
          path: path.join(dirPath, file),
          name: file.replace('.md', ''),
          module: moduleName,
        });
      }
    }

    return tasks;
  }

  /**
   * Process module injections with pre-collected configuration
   */
  async processModuleInjectionsWithConfig(projectDir, bmadDir, options, preCollectedConfig) {
    const fs = require('fs-extra');
    const yaml = require('js-yaml');

    // Get list of installed modules
    const modules = options.selectedModules || [];
    const { subagentChoices, installLocation } = preCollectedConfig;

    // Get the actual source directory (not the installation directory)
    const sourceModulesPath = getSourcePath('modules');

    for (const moduleName of modules) {
      // Check for Claude Code sub-module injection config in SOURCE directory
      const injectionConfigPath = path.join(sourceModulesPath, moduleName, 'sub-modules', 'claude-code', 'injections.yaml');

      if (await this.exists(injectionConfigPath)) {
        try {
          // Load injection configuration
          const configContent = await fs.readFile(injectionConfigPath, 'utf8');
          const config = yaml.load(configContent);

          // Process content injections based on user choices
          if (config.injections && subagentChoices && subagentChoices.install !== 'none') {
            for (const injection of config.injections) {
              // Check if this injection is related to a selected subagent
              if (this.shouldInject(injection, subagentChoices)) {
                await this.injectContent(projectDir, injection, subagentChoices);
              }
            }
          }

          // Copy selected subagents
          if (config.subagents && subagentChoices && subagentChoices.install !== 'none') {
            await this.copySelectedSubagents(
              projectDir,
              path.dirname(injectionConfigPath),
              config.subagents,
              subagentChoices,
              installLocation,
            );
          }
        } catch (error) {
          console.log(chalk.yellow(`  Warning: Failed to process ${moduleName} features: ${error.message}`));
        }
      }
    }
  }

  /**
   * Process Claude Code specific injections for installed modules
   * Looks for injections.yaml in each module's claude-code sub-module
   */
  async processModuleInjections(projectDir, bmadDir, options) {
    const fs = require('fs-extra');
    const yaml = require('js-yaml');
    const inquirer = require('inquirer');

    // Get list of installed modules
    const modules = options.selectedModules || [];
    let subagentChoices = null;
    let installLocation = null;

    // Get the actual source directory (not the installation directory)
    const sourceModulesPath = getSourcePath('modules');

    for (const moduleName of modules) {
      // Check for Claude Code sub-module injection config in SOURCE directory
      const injectionConfigPath = path.join(sourceModulesPath, moduleName, 'sub-modules', 'claude-code', 'injections.yaml');

      if (await this.exists(injectionConfigPath)) {
        console.log(chalk.cyan(`\nConfiguring ${moduleName} Claude Code features...`));

        try {
          // Load injection configuration
          const configContent = await fs.readFile(injectionConfigPath, 'utf8');
          const config = yaml.load(configContent);

          // Ask about subagents if they exist and we haven't asked yet
          if (config.subagents && !subagentChoices) {
            subagentChoices = await this.promptSubagentInstallation(config.subagents);

            if (subagentChoices.install !== 'none') {
              // Ask for installation location
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
              installLocation = locationAnswer.location;
            }
          }

          // Process content injections based on user choices
          if (config.injections && subagentChoices && subagentChoices.install !== 'none') {
            for (const injection of config.injections) {
              // Check if this injection is related to a selected subagent
              if (this.shouldInject(injection, subagentChoices)) {
                await this.injectContent(projectDir, injection, subagentChoices);
              }
            }
          }

          // Copy selected subagents
          if (config.subagents && subagentChoices && subagentChoices.install !== 'none') {
            await this.copySelectedSubagents(
              projectDir,
              path.dirname(injectionConfigPath),
              config.subagents,
              subagentChoices,
              installLocation,
            );
          }
        } catch (error) {
          console.log(chalk.yellow(`  Warning: Failed to process ${moduleName} features: ${error.message}`));
        }
      }
    }
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
   * Check if an injection should be applied based on user choices
   */
  shouldInject(injection, subagentChoices) {
    // If user chose no subagents, no injections
    if (subagentChoices.install === 'none') {
      return false;
    }

    // If user chose all subagents, all injections apply
    if (subagentChoices.install === 'all') {
      return true;
    }

    // For selective installation, check the 'requires' field
    if (subagentChoices.install === 'selective') {
      // If injection requires 'any' subagent and user selected at least one
      if (injection.requires === 'any' && subagentChoices.selected.length > 0) {
        return true;
      }

      // Check if the required subagent was selected
      if (injection.requires) {
        const requiredAgent = injection.requires + '.md';
        return subagentChoices.selected.includes(requiredAgent);
      }

      // Fallback: check if injection mentions a selected agent
      const selectedAgentNames = subagentChoices.selected.map((f) => f.replace('.md', ''));
      for (const agentName of selectedAgentNames) {
        if (injection.point && injection.point.includes(agentName)) {
          return true;
        }
      }
    }

    return false;
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
          injectionContent = this.filterAgentInstructions(injection.content, subagentChoices.selected);
        }

        content = content.replace(marker, injectionContent);
        await fs.writeFile(targetPath, content);
        console.log(chalk.dim(`    Injected: ${injection.point} → ${injection.file}`));
      }
    }
  }

  /**
   * Filter agent instructions to only include selected subagents
   */
  filterAgentInstructions(content, selectedFiles) {
    const selectedAgents = selectedFiles.map((f) => f.replace('.md', ''));
    const lines = content.split('\n');
    const filteredLines = [];

    let includeNextLine = true;
    for (const line of lines) {
      // Always include structural lines
      if (line.includes('<llm') || line.includes('</llm>')) {
        filteredLines.push(line);
        includeNextLine = true;
      }
      // Check if line mentions a subagent
      else if (line.includes('subagent')) {
        let shouldInclude = false;
        for (const agent of selectedAgents) {
          if (line.includes(agent)) {
            shouldInclude = true;
            break;
          }
        }
        if (shouldInclude) {
          filteredLines.push(line);
        }
      }
      // Include general instructions
      else if (line.includes('When creating PRDs') || line.includes('ACTIVELY delegate')) {
        filteredLines.push(line);
      }
    }

    // Only return content if we have actual instructions
    if (filteredLines.length > 2) {
      // More than just llm tags
      return filteredLines.join('\n');
    }
    return ''; // Return empty if no relevant content
  }

  /**
   * Copy selected subagents to appropriate Claude agents directory
   */
  async copySelectedSubagents(projectDir, moduleClaudeDir, subagentConfig, choices, location) {
    const fs = require('fs-extra');
    const sourceDir = path.join(moduleClaudeDir, subagentConfig.source);

    // Determine target directory based on user choice
    let targetDir;
    if (location === 'user') {
      targetDir = path.join(require('node:os').homedir(), '.claude', 'agents');
      console.log(chalk.dim(`  Installing subagents globally to: ~/.claude/agents/`));
    } else {
      targetDir = path.join(projectDir, '.claude', 'agents');
      console.log(chalk.dim(`  Installing subagents to project: .claude/agents/`));
    }

    // Ensure target directory exists
    await this.ensureDir(targetDir);

    // Determine which files to copy
    let filesToCopy = [];
    if (choices.install === 'all') {
      filesToCopy = subagentConfig.files;
    } else if (choices.install === 'selective') {
      filesToCopy = choices.selected;
    }

    // Copy selected subagent files
    for (const file of filesToCopy) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);

      if (await this.exists(sourcePath)) {
        await fs.copyFile(sourcePath, targetPath);
        console.log(chalk.green(`    ✓ Installed: ${file.replace('.md', '')}`));
      }
    }

    if (filesToCopy.length > 0) {
      console.log(chalk.dim(`  Total subagents installed: ${filesToCopy.length}`));
    }
  }
}

module.exports = { ClaudeCodeSetup };
