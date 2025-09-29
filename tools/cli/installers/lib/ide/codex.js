const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Codex setup handler (supports both CLI and Web)
 * Creates comprehensive AGENTS.md file in project root
 */
class CodexSetup extends BaseIdeSetup {
  constructor() {
    super('codex', 'Codex', true); // preferred IDE
    this.agentsFile = 'AGENTS.md';
  }

  /**
   * Collect configuration choices before installation
   * @param {Object} options - Configuration options
   * @returns {Object} Collected configuration
   */
  async collectConfiguration(options = {}) {
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'Select Codex deployment mode:',
        choices: [
          { name: 'CLI (Command-line interface)', value: 'cli' },
          { name: 'Web (Browser-based interface)', value: 'web' },
        ],
        default: 'cli',
      },
    ]);

    return { codexMode: response.mode };
  }

  /**
   * Setup Codex configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Use pre-collected configuration if available
    const config = options.preCollectedConfig || {};
    const mode = config.codexMode || options.codexMode || 'cli';

    // Get agents and tasks
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir);

    // Create AGENTS.md content
    const content = this.createAgentsDocument(agents, tasks, mode);

    // Write AGENTS.md file
    const agentsPath = path.join(projectDir, this.agentsFile);
    await this.writeFile(agentsPath, content);

    // Handle mode-specific setup
    if (mode === 'web') {
      await this.setupWebMode(projectDir);
    } else {
      await this.setupCliMode(projectDir);
    }

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - Mode: ${mode === 'web' ? 'Web' : 'CLI'}`));
    console.log(chalk.dim(`  - ${agents.length} agents documented`));
    console.log(chalk.dim(`  - ${tasks.length} tasks documented`));
    console.log(chalk.dim(`  - Agents file: ${this.agentsFile}`));

    return {
      success: true,
      mode,
      agents: agents.length,
      tasks: tasks.length,
    };
  }

  /**
   * Select Codex mode (CLI or Web)
   */
  async selectMode() {
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: 'Select Codex deployment mode:',
        choices: [
          { name: 'CLI (Command-line interface)', value: 'cli' },
          { name: 'Web (Browser-based interface)', value: 'web' },
        ],
        default: 'cli',
      },
    ]);

    return response.mode;
  }

  /**
   * Create comprehensive agents document
   */
  createAgentsDocument(agents, tasks, mode) {
    let content = `# BMAD Method - Agent Directory

This document contains all available BMAD agents and tasks for use with Codex ${mode === 'web' ? 'Web' : 'CLI'}.

## Quick Start

${
  mode === 'web'
    ? `Access agents through the web interface:
1. Navigate to the Agents section
2. Select an agent to activate
3. The agent persona will be active for your session`
    : `Activate agents in CLI:
1. Reference agents using \`@{agent-name}\`
2. Execute tasks using \`@task-{task-name}\`
3. Agents remain active for the conversation`
}

---

## Available Agents

`;

    // Group agents by module
    const agentsByModule = {};
    for (const agent of agents) {
      if (!agentsByModule[agent.module]) {
        agentsByModule[agent.module] = [];
      }
      agentsByModule[agent.module].push(agent);
    }

    // Document each module's agents
    for (const [module, moduleAgents] of Object.entries(agentsByModule)) {
      content += `### ${module.toUpperCase()} Module\n\n`;

      for (const agent of moduleAgents) {
        const agentContent = this.readFileSync(agent.path);
        const titleMatch = agentContent.match(/title="([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

        const iconMatch = agentContent.match(/icon="([^"]+)"/);
        const icon = iconMatch ? iconMatch[1] : '🤖';

        const whenToUseMatch = agentContent.match(/whenToUse="([^"]+)"/);
        const whenToUse = whenToUseMatch ? whenToUseMatch[1] : `Use for ${title} tasks`;

        content += `#### ${icon} ${title} (\`@${agent.name}\`)\n\n`;
        content += `**When to use:** ${whenToUse}\n\n`;
        content += `**Activation:** Type \`@${agent.name}\` to activate this agent.\n\n`;
      }
    }

    content += `---

## Available Tasks

`;

    // Group tasks by module
    const tasksByModule = {};
    for (const task of tasks) {
      if (!tasksByModule[task.module]) {
        tasksByModule[task.module] = [];
      }
      tasksByModule[task.module].push(task);
    }

    // Document each module's tasks
    for (const [module, moduleTasks] of Object.entries(tasksByModule)) {
      content += `### ${module.toUpperCase()} Module Tasks\n\n`;

      for (const task of moduleTasks) {
        const taskContent = this.readFileSync(task.path);
        const nameMatch = taskContent.match(/<name>([^<]+)<\/name>/);
        const taskName = nameMatch ? nameMatch[1] : this.formatTitle(task.name);

        content += `- **${taskName}** (\`@task-${task.name}\`)\n`;
      }
      content += '\n';
    }

    content += `---

## Usage Guidelines

1. **One agent at a time**: Activate a single agent for focused assistance
2. **Task execution**: Tasks are one-time workflows, not persistent personas
3. **Module organization**: Agents and tasks are grouped by their source module
4. **Context preservation**: ${mode === 'web' ? 'Sessions maintain agent context' : 'Conversations maintain agent context'}

---

*Generated by BMAD Method installer for Codex ${mode === 'web' ? 'Web' : 'CLI'}*
`;

    return content;
  }

  /**
   * Read file synchronously (for document generation)
   */
  readFileSync(filePath) {
    const fs = require('node:fs');
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch {
      return '';
    }
  }

  /**
   * Setup for CLI mode
   */
  async setupCliMode(projectDir) {
    // CLI mode - ensure .gitignore includes AGENTS.md if needed
    const fs = require('fs-extra');
    const gitignorePath = path.join(projectDir, '.gitignore');

    if (await fs.pathExists(gitignorePath)) {
      const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('AGENTS.md')) {
        // User can decide whether to track this file
        console.log(chalk.dim('  Note: Consider adding AGENTS.md to .gitignore if desired'));
      }
    }
  }

  /**
   * Setup for Web mode
   */
  async setupWebMode(projectDir) {
    // Web mode - add to .gitignore to avoid committing
    const fs = require('fs-extra');
    const gitignorePath = path.join(projectDir, '.gitignore');

    if (await fs.pathExists(gitignorePath)) {
      const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('AGENTS.md')) {
        await fs.appendFile(gitignorePath, '\n# Codex Web agents file\nAGENTS.md\n');
        console.log(chalk.dim('  Added AGENTS.md to .gitignore for web deployment'));
      }
    }
  }

  /**
   * Cleanup Codex configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const agentsPath = path.join(projectDir, this.agentsFile);

    if (await fs.pathExists(agentsPath)) {
      await fs.remove(agentsPath);
      console.log(chalk.dim('Removed AGENTS.md file'));
    }
  }
}

module.exports = { CodexSetup };
