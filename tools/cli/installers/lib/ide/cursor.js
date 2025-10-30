const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Cursor IDE setup handler
 */
class CursorSetup extends BaseIdeSetup {
  constructor() {
    super('cursor', 'Cursor', true); // preferred IDE
    this.configDir = '.cursor';
    this.rulesDir = 'rules';
  }

  /**
   * Setup Cursor IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .cursor/rules directory structure
    const cursorDir = path.join(projectDir, this.configDir);
    const rulesDir = path.join(cursorDir, this.rulesDir);
    const bmadRulesDir = path.join(rulesDir, 'bmad');

    await this.ensureDir(bmadRulesDir);

    // Get agents, tasks, tools, and workflows (standalone only)
    const agents = await this.getAgents(bmadDir);
    const tasks = await this.getTasks(bmadDir, true);
    const tools = await this.getTools(bmadDir, true);
    const workflows = await this.getWorkflows(bmadDir, true);

    // Create directories for each module
    const modules = new Set();
    for (const item of [...agents, ...tasks, ...tools, ...workflows]) modules.add(item.module);

    for (const module of modules) {
      await this.ensureDir(path.join(bmadRulesDir, module));
      await this.ensureDir(path.join(bmadRulesDir, module, 'agents'));
      await this.ensureDir(path.join(bmadRulesDir, module, 'tasks'));
      await this.ensureDir(path.join(bmadRulesDir, module, 'tools'));
      await this.ensureDir(path.join(bmadRulesDir, module, 'workflows'));
    }

    // Process and copy agents
    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readAndProcess(agent.path, {
        module: agent.module,
        name: agent.name,
      });

      const targetPath = path.join(bmadRulesDir, agent.module, 'agents', `${agent.name}.mdc`);

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

      const targetPath = path.join(bmadRulesDir, task.module, 'tasks', `${task.name}.mdc`);

      await this.writeFile(targetPath, content);
      taskCount++;
    }

    // Process and copy tools
    let toolCount = 0;
    for (const tool of tools) {
      const content = await this.readAndProcess(tool.path, {
        module: tool.module,
        name: tool.name,
      });

      const targetPath = path.join(bmadRulesDir, tool.module, 'tools', `${tool.name}.mdc`);

      await this.writeFile(targetPath, content);
      toolCount++;
    }

    // Process and copy workflows
    let workflowCount = 0;
    for (const workflow of workflows) {
      const content = await this.readAndProcess(workflow.path, {
        module: workflow.module,
        name: workflow.name,
      });

      const targetPath = path.join(bmadRulesDir, workflow.module, 'workflows', `${workflow.name}.mdc`);

      await this.writeFile(targetPath, content);
      workflowCount++;
    }

    // Create BMAD index file (but NOT .cursorrules - user manages that)
    await this.createBMADIndex(bmadRulesDir, agents, tasks, tools, workflows, modules);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents installed`));
    console.log(chalk.dim(`  - ${taskCount} tasks installed`));
    console.log(chalk.dim(`  - ${toolCount} tools installed`));
    console.log(chalk.dim(`  - ${workflowCount} workflows installed`));
    console.log(chalk.dim(`  - Rules directory: ${path.relative(projectDir, bmadRulesDir)}`));

    return {
      success: true,
      agents: agentCount,
      tasks: taskCount,
      tools: toolCount,
      workflows: workflowCount,
    };
  }

  /**
   * Create BMAD index file for easy navigation
   */
  async createBMADIndex(bmadRulesDir, agents, tasks, tools, workflows, modules) {
    const indexPath = path.join(bmadRulesDir, 'index.mdc');

    let content = `---
description: BMAD Method - Master Index
globs:
alwaysApply: true
---

# BMAD Method - Cursor Rules Index

This is the master index for all BMAD agents, tasks, tools, and workflows available in your project.

## Installation Complete!

BMAD rules have been installed to: \`.cursor/rules/bmad/\`

**Note:** BMAD does not modify your \`.cursorrules\` file. You manage that separately.

## How to Use

- Reference specific agents: @bmad/{module}/agents/{agent-name}
- Reference specific tasks: @bmad/{module}/tasks/{task-name}
- Reference specific tools: @bmad/{module}/tools/{tool-name}
- Reference specific workflows: @bmad/{module}/workflows/{workflow-name}
- Reference entire modules: @bmad/{module}
- Reference this index: @bmad/index

## Available Modules

`;

    for (const module of modules) {
      content += `### ${module.toUpperCase()}\n\n`;

      // List agents for this module
      const moduleAgents = agents.filter((a) => a.module === module);
      if (moduleAgents.length > 0) {
        content += `**Agents:**\n`;
        for (const agent of moduleAgents) {
          content += `- @bmad/${module}/agents/${agent.name} - ${agent.name}\n`;
        }
        content += '\n';
      }

      // List tasks for this module
      const moduleTasks = tasks.filter((t) => t.module === module);
      if (moduleTasks.length > 0) {
        content += `**Tasks:**\n`;
        for (const task of moduleTasks) {
          content += `- @bmad/${module}/tasks/${task.name} - ${task.name}\n`;
        }
        content += '\n';
      }

      // List tools for this module
      const moduleTools = tools.filter((t) => t.module === module);
      if (moduleTools.length > 0) {
        content += `**Tools:**\n`;
        for (const tool of moduleTools) {
          content += `- @bmad/${module}/tools/${tool.name} - ${tool.name}\n`;
        }
        content += '\n';
      }

      // List workflows for this module
      const moduleWorkflows = workflows.filter((w) => w.module === module);
      if (moduleWorkflows.length > 0) {
        content += `**Workflows:**\n`;
        for (const workflow of moduleWorkflows) {
          content += `- @bmad/${module}/workflows/${workflow.name} - ${workflow.name}\n`;
        }
        content += '\n';
      }
    }

    content += `
## Quick Reference

- All BMAD rules are Manual type - reference them explicitly when needed
- Agents provide persona-based assistance with specific expertise
- Tasks are reusable workflows for common operations
- Tools provide specialized functionality
- Workflows orchestrate multi-step processes
- Each agent includes an activation block for proper initialization

## Configuration

BMAD rules are configured as Manual rules (alwaysApply: false) to give you control
over when they're included in your context. Reference them explicitly when you need
specific agent expertise, task workflows, tools, or guided workflows.
`;

    await this.writeFile(indexPath, content);
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
   * Override processContent to add MDC metadata header for Cursor
   * @param {string} content - File content
   * @param {Object} metadata - File metadata
   * @returns {string} Processed content with MDC header
   */
  processContent(content, metadata = {}) {
    // First apply base processing (includes activation injection for agents)
    let processed = super.processContent(content, metadata);

    // Determine the type and description based on content
    const isAgent = content.includes('<agent');
    const isTask = content.includes('<task');
    const isTool = content.includes('<tool');
    const isWorkflow = content.includes('workflow:') || content.includes('name:');

    let description = '';
    let globs = '';

    if (isAgent) {
      // Extract agent title if available
      const titleMatch = content.match(/title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : metadata.name;
      description = `BMAD ${metadata.module.toUpperCase()} Agent: ${title}`;
      globs = '';
    } else if (isTask) {
      // Extract task name if available
      const nameMatch = content.match(/name="([^"]+)"/);
      const taskName = nameMatch ? nameMatch[1] : metadata.name;
      description = `BMAD ${metadata.module.toUpperCase()} Task: ${taskName}`;
      globs = '';
    } else if (isTool) {
      // Extract tool name if available
      const nameMatch = content.match(/name="([^"]+)"/);
      const toolName = nameMatch ? nameMatch[1] : metadata.name;
      description = `BMAD ${metadata.module.toUpperCase()} Tool: ${toolName}`;
      globs = '';
    } else if (isWorkflow) {
      // Workflow
      description = `BMAD ${metadata.module.toUpperCase()} Workflow: ${metadata.name}`;
      globs = '';
    } else {
      description = `BMAD ${metadata.module.toUpperCase()}: ${metadata.name}`;
      globs = '';
    }

    // Create MDC metadata header
    const mdcHeader = `---
description: ${description}
globs: ${globs}
alwaysApply: false
---

`;

    // Add the MDC header to the processed content
    return mdcHeader + processed;
  }
}

module.exports = { CursorSetup };
