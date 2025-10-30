const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const { getAgentsFromBmad, getTasksFromBmad } = require('./shared/bmad-artifacts');

/**
 * Qwen Code setup handler
 * Creates TOML command files in .qwen/commands/BMad/
 */
class QwenSetup extends BaseIdeSetup {
  constructor() {
    super('qwen', 'Qwen Code');
    this.configDir = '.qwen';
    this.commandsDir = 'commands';
    this.bmadDir = 'bmad';
  }

  /**
   * Setup Qwen Code configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .qwen/commands/BMad directory structure
    const qwenDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(qwenDir, this.commandsDir);
    const bmadCommandsDir = path.join(commandsDir, this.bmadDir);

    await this.ensureDir(bmadCommandsDir);

    // Update existing settings.json if present
    await this.updateSettings(qwenDir);

    // Clean up old configuration if exists
    await this.cleanupOldConfig(qwenDir);

    // Get agents, tasks, tools, and workflows (standalone only for tools/workflows)
    const agents = await getAgentsFromBmad(bmadDir, options.selectedModules || []);
    const tasks = await getTasksFromBmad(bmadDir, options.selectedModules || []);
    const tools = await this.getTools(bmadDir, true);
    const workflows = await this.getWorkflows(bmadDir, true);

    // Create directories for each module (including standalone)
    const modules = new Set();
    for (const item of [...agents, ...tasks, ...tools, ...workflows]) modules.add(item.module);

    for (const module of modules) {
      await this.ensureDir(path.join(bmadCommandsDir, module));
      await this.ensureDir(path.join(bmadCommandsDir, module, 'agents'));
      await this.ensureDir(path.join(bmadCommandsDir, module, 'tasks'));
      await this.ensureDir(path.join(bmadCommandsDir, module, 'tools'));
      await this.ensureDir(path.join(bmadCommandsDir, module, 'workflows'));
    }

    // Create TOML files for each agent
    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readAndProcess(agent.path, {
        module: agent.module,
        name: agent.name,
      });

      const targetPath = path.join(bmadCommandsDir, agent.module, 'agents', `${agent.name}.toml`);

      await this.writeFile(targetPath, content);

      agentCount++;
      console.log(chalk.green(`  ✓ Added agent: /bmad:${agent.module}:agents:${agent.name}`));
    }

    // Create TOML files for each task
    let taskCount = 0;
    for (const task of tasks) {
      const content = await this.readAndProcess(task.path, {
        module: task.module,
        name: task.name,
      });

      const targetPath = path.join(bmadCommandsDir, task.module, 'tasks', `${task.name}.toml`);

      await this.writeFile(targetPath, content);

      taskCount++;
      console.log(chalk.green(`  ✓ Added task: /bmad:${task.module}:tasks:${task.name}`));
    }

    // Create TOML files for each tool
    let toolCount = 0;
    for (const tool of tools) {
      const content = await this.readAndProcess(tool.path, {
        module: tool.module,
        name: tool.name,
      });

      const targetPath = path.join(bmadCommandsDir, tool.module, 'tools', `${tool.name}.toml`);

      await this.writeFile(targetPath, content);

      toolCount++;
      console.log(chalk.green(`  ✓ Added tool: /bmad:${tool.module}:tools:${tool.name}`));
    }

    // Create TOML files for each workflow
    let workflowCount = 0;
    for (const workflow of workflows) {
      const content = await this.readAndProcess(workflow.path, {
        module: workflow.module,
        name: workflow.name,
      });

      const targetPath = path.join(bmadCommandsDir, workflow.module, 'workflows', `${workflow.name}.toml`);

      await this.writeFile(targetPath, content);

      workflowCount++;
      console.log(chalk.green(`  ✓ Added workflow: /bmad:${workflow.module}:workflows:${workflow.name}`));
    }

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents configured`));
    console.log(chalk.dim(`  - ${taskCount} tasks configured`));
    console.log(chalk.dim(`  - ${toolCount} tools configured`));
    console.log(chalk.dim(`  - ${workflowCount} workflows configured`));
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, bmadCommandsDir)}`));

    return {
      success: true,
      agents: agentCount,
      tasks: taskCount,
      tools: toolCount,
      workflows: workflowCount,
    };
  }

  /**
   * Update settings.json to remove old agent references
   */
  async updateSettings(qwenDir) {
    const fs = require('fs-extra');
    const settingsPath = path.join(qwenDir, 'settings.json');

    if (await fs.pathExists(settingsPath)) {
      try {
        const settingsContent = await fs.readFile(settingsPath, 'utf8');
        const settings = JSON.parse(settingsContent);
        let updated = false;

        // Remove agent file references from contextFileName
        if (settings.contextFileName && Array.isArray(settings.contextFileName)) {
          const originalLength = settings.contextFileName.length;
          settings.contextFileName = settings.contextFileName.filter(
            (fileName) => !fileName.startsWith('agents/') && !fileName.startsWith('bmad-method/'),
          );

          if (settings.contextFileName.length !== originalLength) {
            updated = true;
          }
        }

        if (updated) {
          await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
          console.log(chalk.green('  ✓ Updated .qwen/settings.json'));
        }
      } catch (error) {
        console.warn(chalk.yellow('  ⚠ Could not update settings.json:'), error.message);
      }
    }
  }

  /**
   * Clean up old configuration directories
   */
  async cleanupOldConfig(qwenDir) {
    const fs = require('fs-extra');
    const agentsDir = path.join(qwenDir, 'agents');
    const bmadMethodDir = path.join(qwenDir, 'bmad-method');
    const bmadDir = path.join(qwenDir, 'bmadDir');

    if (await fs.pathExists(agentsDir)) {
      await fs.remove(agentsDir);
      console.log(chalk.green('  ✓ Removed old agents directory'));
    }

    if (await fs.pathExists(bmadMethodDir)) {
      await fs.remove(bmadMethodDir);
      console.log(chalk.green('  ✓ Removed old bmad-method directory'));
    }

    if (await fs.pathExists(bmadDir)) {
      await fs.remove(bmadDir);
      console.log(chalk.green('  ✓ Removed old BMad directory'));
    }
  }

  /**
   * Read and process file content
   */
  async readAndProcess(filePath, metadata) {
    const fs = require('fs-extra');
    const content = await fs.readFile(filePath, 'utf8');
    return this.processContent(content, metadata);
  }

  /**
   * Override processContent to add TOML metadata header for Qwen
   * @param {string} content - File content
   * @param {Object} metadata - File metadata
   * @returns {string} Processed content with Qwen template
   */
  processContent(content, metadata = {}) {
    // First apply base processing (includes activation injection for agents)
    let prompt = super.processContent(content, metadata);

    // Determine the type and description based on content
    const isAgent = content.includes('<agent');
    const isTask = content.includes('<task');
    const isTool = content.includes('<tool');
    const isWorkflow = content.includes('workflow:') || content.includes('name:');

    let description = '';

    if (isAgent) {
      // Extract agent title if available
      const titleMatch = content.match(/title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : metadata.name;
      description = `BMAD ${metadata.module.toUpperCase()} Agent: ${title}`;
    } else if (isTask) {
      // Extract task name if available
      const nameMatch = content.match(/name="([^"]+)"/);
      const taskName = nameMatch ? nameMatch[1] : metadata.name;
      description = `BMAD ${metadata.module.toUpperCase()} Task: ${taskName}`;
    } else if (isTool) {
      // Extract tool name if available
      const nameMatch = content.match(/name="([^"]+)"/);
      const toolName = nameMatch ? nameMatch[1] : metadata.name;
      description = `BMAD ${metadata.module.toUpperCase()} Tool: ${toolName}`;
    } else if (isWorkflow) {
      // Workflow
      description = `BMAD ${metadata.module.toUpperCase()} Workflow: ${metadata.name}`;
    } else {
      description = `BMAD ${metadata.module.toUpperCase()}: ${metadata.name}`;
    }

    return `description = "${description}"
prompt = """
${prompt}
"""
`;
  }

  /**
   * Format name as title
   */
  formatTitle(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Cleanup Qwen configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const bmadCommandsDir = path.join(projectDir, this.configDir, this.commandsDir, this.bmadDir);
    const oldBmadMethodDir = path.join(projectDir, this.configDir, 'bmad-method');
    const oldBMadDir = path.join(projectDir, this.configDir, 'BMad');

    if (await fs.pathExists(bmadCommandsDir)) {
      await fs.remove(bmadCommandsDir);
      console.log(chalk.dim(`Removed BMAD configuration from Qwen Code`));
    }

    if (await fs.pathExists(oldBmadMethodDir)) {
      await fs.remove(oldBmadMethodDir);
      console.log(chalk.dim(`Removed old BMAD configuration from Qwen Code`));
    }

    if (await fs.pathExists(oldBMadDir)) {
      await fs.remove(oldBMadDir);
      console.log(chalk.dim(`Removed old BMAD configuration from Qwen Code`));
    }
  }
}

module.exports = { QwenSetup };
