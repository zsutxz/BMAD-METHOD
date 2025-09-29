const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * iFlow CLI setup handler
 * Creates commands in .iflow/commands/ directory structure
 */
class IFlowSetup extends BaseIdeSetup {
  constructor() {
    super('iflow', 'iFlow CLI');
    this.configDir = '.iflow';
    this.commandsDir = 'commands';
  }

  /**
   * Setup iFlow CLI configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .iflow/commands/bmad directory structure
    const iflowDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(iflowDir, this.commandsDir, 'bmad');
    const agentsDir = path.join(commandsDir, 'agents');
    const tasksDir = path.join(commandsDir, 'tasks');

    await this.ensureDir(agentsDir);
    await this.ensureDir(tasksDir);

    // Get agents and tasks
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir);

    // Setup agents as commands
    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const commandContent = this.createAgentCommand(agent, content);

      const targetPath = path.join(agentsDir, `${agent.module}-${agent.name}.md`);
      await this.writeFile(targetPath, commandContent);
      agentCount++;
    }

    // Setup tasks as commands
    let taskCount = 0;
    for (const task of tasks) {
      const content = await this.readFile(task.path);
      const commandContent = this.createTaskCommand(task, content);

      const targetPath = path.join(tasksDir, `${task.module}-${task.name}.md`);
      await this.writeFile(targetPath, commandContent);
      taskCount++;
    }

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agent commands created`));
    console.log(chalk.dim(`  - ${taskCount} task commands created`));
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, commandsDir)}`));

    return {
      success: true,
      agents: agentCount,
      tasks: taskCount,
    };
  }

  /**
   * Create agent command content
   */
  createAgentCommand(agent, content) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    let commandContent = `# /${agent.name} Command

When this command is used, adopt the following agent persona:

## ${title} Agent

${content}

## Usage

This command activates the ${title} agent from the BMAD ${agent.module.toUpperCase()} module.

## Module

Part of the BMAD ${agent.module.toUpperCase()} module.
`;

    return commandContent;
  }

  /**
   * Create task command content
   */
  createTaskCommand(task, content) {
    // Extract task name
    const nameMatch = content.match(/<name>([^<]+)<\/name>/);
    const taskName = nameMatch ? nameMatch[1] : this.formatTitle(task.name);

    let commandContent = `# /task-${task.name} Command

When this command is used, execute the following task:

## ${taskName} Task

${content}

## Usage

This command executes the ${taskName} task from the BMAD ${task.module.toUpperCase()} module.

## Module

Part of the BMAD ${task.module.toUpperCase()} module.
`;

    return commandContent;
  }

  /**
   * Cleanup iFlow configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const bmadCommandsDir = path.join(projectDir, this.configDir, this.commandsDir, 'bmad');

    if (await fs.pathExists(bmadCommandsDir)) {
      await fs.remove(bmadCommandsDir);
      console.log(chalk.dim(`Removed BMAD commands from iFlow CLI`));
    }
  }
}

module.exports = { IFlowSetup };
