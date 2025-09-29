const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Crush IDE setup handler
 * Creates commands in .crush/commands/ directory structure
 */
class CrushSetup extends BaseIdeSetup {
  constructor() {
    super('crush', 'Crush');
    this.configDir = '.crush';
    this.commandsDir = 'commands';
  }

  /**
   * Setup Crush IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .crush/commands/bmad directory structure
    const crushDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(crushDir, this.commandsDir, 'bmad');
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
      const commandContent = this.createAgentCommand(agent, content, projectDir);

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

    // Create module-specific subdirectories for better organization
    await this.organizeByModule(commandsDir, agents, tasks, bmadDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agent commands created`));
    console.log(chalk.dim(`  - ${taskCount} task commands created`));
    console.log(chalk.dim(`  - Commands directory: ${path.relative(projectDir, commandsDir)}`));
    console.log(chalk.dim('\n  Commands can be accessed via Crush command palette'));

    return {
      success: true,
      agents: agentCount,
      tasks: taskCount,
    };
  }

  /**
   * Organize commands by module
   */
  async organizeByModule(commandsDir, agents, tasks, bmadDir) {
    // Get unique modules
    const modules = new Set();
    for (const agent of agents) modules.add(agent.module);
    for (const task of tasks) modules.add(task.module);

    // Create module directories
    for (const module of modules) {
      const moduleDir = path.join(commandsDir, module);
      const moduleAgentsDir = path.join(moduleDir, 'agents');
      const moduleTasksDir = path.join(moduleDir, 'tasks');

      await this.ensureDir(moduleAgentsDir);
      await this.ensureDir(moduleTasksDir);

      // Copy module-specific agents
      const moduleAgents = agents.filter((a) => a.module === module);
      for (const agent of moduleAgents) {
        const content = await this.readFile(agent.path);
        const commandContent = this.createAgentCommand(agent, content, bmadDir);
        const targetPath = path.join(moduleAgentsDir, `${agent.name}.md`);
        await this.writeFile(targetPath, commandContent);
      }

      // Copy module-specific tasks
      const moduleTasks = tasks.filter((t) => t.module === module);
      for (const task of moduleTasks) {
        const content = await this.readFile(task.path);
        const commandContent = this.createTaskCommand(task, content);
        const targetPath = path.join(moduleTasksDir, `${task.name}.md`);
        await this.writeFile(targetPath, commandContent);
      }
    }
  }

  /**
   * Create agent command content
   */
  createAgentCommand(agent, content, projectDir) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    // Get relative path
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    let commandContent = `# /${agent.name} Command

When this command is used, adopt the following agent persona:

## ${icon} ${title} Agent

${content}

## Command Usage

This command activates the ${title} agent from the BMAD ${agent.module.toUpperCase()} module.

## File Reference

Complete agent definition: [${relativePath}](${relativePath})

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

## Command Usage

This command executes the ${taskName} task from the BMAD ${task.module.toUpperCase()} module.

## Module

Part of the BMAD ${task.module.toUpperCase()} module.
`;

    return commandContent;
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
   * Cleanup Crush configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const bmadCommandsDir = path.join(projectDir, this.configDir, this.commandsDir, 'bmad');

    if (await fs.pathExists(bmadCommandsDir)) {
      await fs.remove(bmadCommandsDir);
      console.log(chalk.dim(`Removed BMAD commands from Crush`));
    }
  }
}

module.exports = { CrushSetup };
