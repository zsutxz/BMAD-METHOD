const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');
const chalk = require('chalk');

/**
 * Generates Claude Code command files for each workflow in the manifest
 */
class WorkflowCommandGenerator {
  constructor() {
    this.templatePath = path.join(__dirname, 'workflow-command-template.md');
  }

  /**
   * Generate workflow commands from the manifest CSV
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   */
  async generateWorkflowCommands(projectDir, bmadDir) {
    const manifestPath = path.join(bmadDir, '_cfg', 'workflow-manifest.csv');

    if (!(await fs.pathExists(manifestPath))) {
      console.log(chalk.yellow('Workflow manifest not found. Skipping command generation.'));
      return { generated: 0 };
    }

    // Read and parse the CSV manifest
    const csvContent = await fs.readFile(manifestPath, 'utf8');
    const workflows = csv.parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Base commands directory
    const baseCommandsDir = path.join(projectDir, '.claude', 'commands', 'bmad');

    let generatedCount = 0;

    // Generate a command file for each workflow, organized by module
    for (const workflow of workflows) {
      // Create module directory structure: commands/bmad/{module}/workflows/
      const moduleWorkflowsDir = path.join(baseCommandsDir, workflow.module, 'workflows');
      await fs.ensureDir(moduleWorkflowsDir);

      // Use just the workflow name as filename (no prefix)
      const commandContent = await this.generateCommandContent(workflow, bmadDir);
      const commandPath = path.join(moduleWorkflowsDir, `${workflow.name}.md`);

      await fs.writeFile(commandPath, commandContent);
      generatedCount++;
    }

    // Also create a workflow launcher README in each module
    await this.createModuleWorkflowLaunchers(baseCommandsDir, workflows, bmadDir);

    return { generated: generatedCount };
  }

  /**
   * Generate command content for a workflow
   */
  async generateCommandContent(workflow, bmadDir) {
    // Load the template
    const template = await fs.readFile(this.templatePath, 'utf8');

    // Convert source path to installed path
    // From: /Users/.../src/modules/bmm/workflows/.../workflow.yaml
    // To: {project-root}/bmad/bmm/workflows/.../workflow.yaml
    let workflowPath = workflow.path;

    // Extract the relative path from source
    if (workflowPath.includes('/src/modules/')) {
      const match = workflowPath.match(/\/src\/modules\/(.+)/);
      if (match) {
        workflowPath = `{project-root}/bmad/${match[1]}`;
      }
    } else if (workflowPath.includes('/src/core/')) {
      const match = workflowPath.match(/\/src\/core\/(.+)/);
      if (match) {
        workflowPath = `{project-root}/bmad/core/${match[1]}`;
      }
    }

    // Replace template variables
    return template
      .replaceAll('{{name}}', workflow.name)
      .replaceAll('{{module}}', workflow.module)
      .replaceAll('{{description}}', workflow.description)
      .replaceAll('{{workflow_path}}', workflowPath)
      .replaceAll('{{interactive}}', workflow.interactive)
      .replaceAll('{{author}}', workflow.author || 'BMAD');
  }

  /**
   * Create workflow launcher files for each module
   */
  async createModuleWorkflowLaunchers(baseCommandsDir, workflows, bmadDir) {
    // Group workflows by module
    const workflowsByModule = {};
    for (const workflow of workflows) {
      if (!workflowsByModule[workflow.module]) {
        workflowsByModule[workflow.module] = [];
      }

      // Convert path for display
      let workflowPath = workflow.path;
      if (workflowPath.includes('/src/modules/')) {
        const match = workflowPath.match(/\/src\/modules\/(.+)/);
        if (match) {
          workflowPath = `{project-root}/bmad/${match[1]}`;
        }
      } else if (workflowPath.includes('/src/core/')) {
        const match = workflowPath.match(/\/src\/core\/(.+)/);
        if (match) {
          workflowPath = `{project-root}/bmad/core/${match[1]}`;
        }
      }

      workflowsByModule[workflow.module].push({
        ...workflow,
        displayPath: workflowPath,
      });
    }

    // Create a launcher file for each module
    for (const [module, moduleWorkflows] of Object.entries(workflowsByModule)) {
      let content = `# ${module.toUpperCase()} Workflows

## Available Workflows in ${module}

`;

      for (const workflow of moduleWorkflows) {
        content += `**${workflow.name}**\n`;
        content += `- Path: \`${workflow.displayPath}\`\n`;
        content += `- ${workflow.description}\n\n`;
      }

      content += `
## Execution

When running any workflow:
1. LOAD {project-root}/bmad/core/tasks/workflow.xml
2. Pass the workflow path as 'workflow-config' parameter
3. Follow workflow.xml instructions EXACTLY
4. Save outputs after EACH section

## Modes
- Normal: Full interaction
- #yolo: Skip optional steps
`;

      // Write module-specific launcher
      const moduleWorkflowsDir = path.join(baseCommandsDir, module, 'workflows');
      await fs.ensureDir(moduleWorkflowsDir);
      const launcherPath = path.join(moduleWorkflowsDir, 'README.md');
      await fs.writeFile(launcherPath, content);
    }
  }
}

module.exports = { WorkflowCommandGenerator };
