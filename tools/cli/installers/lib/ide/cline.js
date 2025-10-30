const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { BaseIdeSetup } = require('./_base-ide');
const { WorkflowCommandGenerator } = require('./workflow-command-generator');
const { getAgentsFromBmad, getTasksFromBmad } = require('./shared/bmad-artifacts');

/**
 * Cline IDE setup handler
 * Installs BMAD artifacts to .clinerules/workflows with flattened naming
 */
class ClineSetup extends BaseIdeSetup {
  constructor() {
    super('cline', 'Cline', true); // preferred IDE
    this.configDir = '.clinerules';
    this.workflowsDir = 'workflows';
  }

  /**
   * Setup Cline IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .clinerules/workflows directory
    const clineDir = path.join(projectDir, this.configDir);
    const workflowsDir = path.join(clineDir, this.workflowsDir);

    await this.ensureDir(workflowsDir);

    // Clear old BMAD files
    await this.clearOldBmadFiles(workflowsDir);

    // Collect all artifacts
    const { artifacts, counts } = await this.collectClineArtifacts(projectDir, bmadDir, options);

    // Write flattened files
    const written = await this.flattenAndWriteArtifacts(artifacts, workflowsDir);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${counts.agents} agents installed`));
    console.log(chalk.dim(`  - ${counts.tasks} tasks installed`));
    console.log(chalk.dim(`  - ${counts.workflows} workflow commands installed`));
    if (counts.workflowLaunchers > 0) {
      console.log(chalk.dim(`  - ${counts.workflowLaunchers} workflow launchers installed`));
    }
    console.log(chalk.dim(`  - ${written} files written to ${path.relative(projectDir, workflowsDir)}`));

    // Usage instructions
    console.log(chalk.yellow('\n  ⚠️  How to Use Cline Workflows'));
    console.log(chalk.cyan('  BMAD workflows are available as slash commands in Cline'));
    console.log(chalk.dim('  Usage:'));
    console.log(chalk.dim('    - Type / to see available commands'));
    console.log(chalk.dim('    - All BMAD items start with "bmad-"'));
    console.log(chalk.dim('    - Example: /bmad-bmm-agents-pm'));

    return {
      success: true,
      agents: counts.agents,
      tasks: counts.tasks,
      workflows: counts.workflows,
      workflowLaunchers: counts.workflowLaunchers,
      written,
    };
  }

  /**
   * Detect Cline installation by checking for .clinerules/workflows directory
   */
  async detect(projectDir) {
    const workflowsDir = path.join(projectDir, this.configDir, this.workflowsDir);

    if (!(await fs.pathExists(workflowsDir))) {
      return false;
    }

    const entries = await fs.readdir(workflowsDir);
    return entries.some((entry) => entry.startsWith('bmad-'));
  }

  /**
   * Collect all artifacts for Cline export
   */
  async collectClineArtifacts(projectDir, bmadDir, options = {}) {
    const selectedModules = options.selectedModules || [];
    const artifacts = [];

    // Get agents
    const agents = await getAgentsFromBmad(bmadDir, selectedModules);
    for (const agent of agents) {
      const content = await this.readAndProcessWithProject(
        agent.path,
        {
          module: agent.module,
          name: agent.name,
        },
        projectDir,
      );

      artifacts.push({
        type: 'agent',
        module: agent.module,
        sourcePath: agent.path,
        relativePath: path.join(agent.module, 'agents', `${agent.name}.md`),
        content,
      });
    }

    // Get tasks
    const tasks = await getTasksFromBmad(bmadDir, selectedModules);
    for (const task of tasks) {
      const content = await this.readAndProcessWithProject(
        task.path,
        {
          module: task.module,
          name: task.name,
        },
        projectDir,
      );

      artifacts.push({
        type: 'task',
        module: task.module,
        sourcePath: task.path,
        relativePath: path.join(task.module, 'tasks', `${task.name}.md`),
        content,
      });
    }

    // Get workflows
    const workflowGenerator = new WorkflowCommandGenerator();
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);
    artifacts.push(...workflowArtifacts);

    return {
      artifacts,
      counts: {
        agents: agents.length,
        tasks: tasks.length,
        workflows: workflowCounts.commands,
        workflowLaunchers: workflowCounts.launchers,
      },
    };
  }

  /**
   * Flatten file path to bmad-module-type-name.md format
   */
  flattenFilename(relativePath) {
    const sanitized = relativePath.replaceAll(/[\\/]/g, '-');
    return `bmad-${sanitized}`;
  }

  /**
   * Write all artifacts with flattened names
   */
  async flattenAndWriteArtifacts(artifacts, destDir) {
    let written = 0;

    for (const artifact of artifacts) {
      const flattenedName = this.flattenFilename(artifact.relativePath);
      const targetPath = path.join(destDir, flattenedName);
      await fs.writeFile(targetPath, artifact.content);
      written++;
    }

    return written;
  }

  /**
   * Clear old BMAD files from the workflows directory
   */
  async clearOldBmadFiles(destDir) {
    if (!(await fs.pathExists(destDir))) {
      return;
    }

    const entries = await fs.readdir(destDir);

    for (const entry of entries) {
      if (!entry.startsWith('bmad-')) {
        continue;
      }

      const entryPath = path.join(destDir, entry);
      const stat = await fs.stat(entryPath);
      if (stat.isFile()) {
        await fs.remove(entryPath);
      } else if (stat.isDirectory()) {
        await fs.remove(entryPath);
      }
    }
  }

  /**
   * Read and process file with project-specific paths
   */
  async readAndProcessWithProject(filePath, metadata, projectDir) {
    const content = await fs.readFile(filePath, 'utf8');
    return super.processContent(content, metadata, projectDir);
  }

  /**
   * Cleanup Cline configuration
   */
  async cleanup(projectDir) {
    const workflowsDir = path.join(projectDir, this.configDir, this.workflowsDir);
    await this.clearOldBmadFiles(workflowsDir);
    console.log(chalk.dim(`Removed ${this.name} BMAD configuration`));
  }

  /**
   * Utility: Ensure directory exists
   */
  async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }
}

module.exports = { ClineSetup };
