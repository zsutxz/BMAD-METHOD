const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { getSourcePath, getModulePath } = require('../../../lib/project-root');

/**
 * Generates manifest files for installed workflows, agents, and tasks
 */
class ManifestGenerator {
  constructor() {
    this.workflows = [];
    this.agents = [];
    this.tasks = [];
    this.modules = [];
    this.files = [];
  }

  /**
   * Generate all manifests for the installation
   * @param {string} bmadDir - BMAD installation directory
   * @param {Array} selectedModules - Selected modules for installation
   */
  async generateManifests(bmadDir, selectedModules) {
    // Create _cfg directory if it doesn't exist
    const cfgDir = path.join(bmadDir, '_cfg');
    await fs.ensureDir(cfgDir);

    // Store modules list
    this.modules = ['core', ...selectedModules];

    // Collect workflow data
    await this.collectWorkflows(selectedModules);

    // Collect agent data
    await this.collectAgents(selectedModules);

    // Collect task data
    await this.collectTasks(selectedModules);

    // Write manifest files
    await this.writeMainManifest(cfgDir);
    await this.writeWorkflowManifest(cfgDir);
    await this.writeAgentManifest(cfgDir);
    await this.writeTaskManifest(cfgDir);
    await this.writeFilesManifest(cfgDir);

    return {
      workflows: this.workflows.length,
      agents: this.agents.length,
      tasks: this.tasks.length,
      files: this.files.length,
    };
  }

  /**
   * Collect all workflows from core and selected modules
   */
  async collectWorkflows(selectedModules) {
    this.workflows = [];

    // Get core workflows
    const corePath = getModulePath('core');
    const coreWorkflows = await this.getWorkflowsFromPath(corePath, 'core');
    this.workflows.push(...coreWorkflows);

    // Get module workflows
    for (const moduleName of selectedModules) {
      const modulePath = getSourcePath(`modules/${moduleName}`);
      const moduleWorkflows = await this.getWorkflowsFromPath(modulePath, moduleName);
      this.workflows.push(...moduleWorkflows);
    }
  }

  /**
   * Recursively find and parse workflow.yaml files
   */
  async getWorkflowsFromPath(basePath, moduleName) {
    const workflows = [];
    const workflowsPath = path.join(basePath, 'workflows');

    if (!(await fs.pathExists(workflowsPath))) {
      return workflows;
    }

    // Recursively find workflow.yaml files
    const findWorkflows = async (dir, relativePath = '') => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recurse into subdirectories
          const newRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
          await findWorkflows(fullPath, newRelativePath);
        } else if (entry.name === 'workflow.yaml') {
          // Parse workflow file
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const workflow = yaml.load(content);

            // Skip template workflows (those with placeholder values)
            if (workflow.name && workflow.name.includes('{') && workflow.name.includes('}')) {
              continue;
            }

            if (workflow.name && workflow.description) {
              // Build relative path for installation
              const installPath =
                moduleName === 'core'
                  ? `bmad/core/workflows/${relativePath}/workflow.yaml`
                  : `bmad/${moduleName}/workflows/${relativePath}/workflow.yaml`;

              workflows.push({
                name: workflow.name,
                description: workflow.description.replaceAll('"', '""'), // Escape quotes for CSV
                module: moduleName,
                path: installPath,
              });

              // Add to files list
              this.files.push({
                type: 'workflow',
                name: workflow.name,
                module: moduleName,
                path: installPath,
              });
            }
          } catch (error) {
            console.warn(`Warning: Failed to parse workflow at ${fullPath}: ${error.message}`);
          }
        }
      }
    };

    await findWorkflows(workflowsPath);
    return workflows;
  }

  /**
   * Collect all agents from core and selected modules
   */
  async collectAgents(selectedModules) {
    this.agents = [];

    // Get core agents
    const corePath = getModulePath('core');
    const coreAgentsPath = path.join(corePath, 'agents');
    if (await fs.pathExists(coreAgentsPath)) {
      const coreAgents = await this.getAgentsFromDir(coreAgentsPath, 'core');
      this.agents.push(...coreAgents);
    }

    // Get module agents
    for (const moduleName of selectedModules) {
      const modulePath = getSourcePath(`modules/${moduleName}`);
      const agentsPath = path.join(modulePath, 'agents');

      if (await fs.pathExists(agentsPath)) {
        const moduleAgents = await this.getAgentsFromDir(agentsPath, moduleName);
        this.agents.push(...moduleAgents);
      }
    }
  }

  /**
   * Get agents from a directory
   */
  async getAgentsFromDir(dirPath, moduleName) {
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

        // Extract agent metadata from content if possible
        const nameMatch = content.match(/name="([^"]+)"/);
        const descMatch = content.match(/<objective>([^<]+)<\/objective>/);

        // Build relative path for installation
        const installPath = moduleName === 'core' ? `bmad/core/agents/${file}` : `bmad/${moduleName}/agents/${file}`;

        const agentName = file.replace('.md', '');
        agents.push({
          name: agentName,
          displayName: nameMatch ? nameMatch[1] : agentName,
          description: descMatch ? descMatch[1].trim().replaceAll('"', '""') : '',
          module: moduleName,
          path: installPath,
        });

        // Add to files list
        this.files.push({
          type: 'agent',
          name: agentName,
          module: moduleName,
          path: installPath,
        });
      }
    }

    return agents;
  }

  /**
   * Collect all tasks from core and selected modules
   */
  async collectTasks(selectedModules) {
    this.tasks = [];

    // Get core tasks
    const corePath = getModulePath('core');
    const coreTasksPath = path.join(corePath, 'tasks');
    if (await fs.pathExists(coreTasksPath)) {
      const coreTasks = await this.getTasksFromDir(coreTasksPath, 'core');
      this.tasks.push(...coreTasks);
    }

    // Get module tasks
    for (const moduleName of selectedModules) {
      const modulePath = getSourcePath(`modules/${moduleName}`);
      const tasksPath = path.join(modulePath, 'tasks');

      if (await fs.pathExists(tasksPath)) {
        const moduleTasks = await this.getTasksFromDir(tasksPath, moduleName);
        this.tasks.push(...moduleTasks);
      }
    }
  }

  /**
   * Get tasks from a directory
   */
  async getTasksFromDir(dirPath, moduleName) {
    const tasks = [];
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(dirPath, file);
        const content = await fs.readFile(filePath, 'utf8');

        // Extract task metadata from content if possible
        const nameMatch = content.match(/name="([^"]+)"/);
        const objMatch = content.match(/<objective>([^<]+)<\/objective>/);

        // Build relative path for installation
        const installPath = moduleName === 'core' ? `bmad/core/tasks/${file}` : `bmad/${moduleName}/tasks/${file}`;

        const taskName = file.replace('.md', '');
        tasks.push({
          name: taskName,
          displayName: nameMatch ? nameMatch[1] : taskName,
          description: objMatch ? objMatch[1].trim().replaceAll('"', '""') : '',
          module: moduleName,
          path: installPath,
        });

        // Add to files list
        this.files.push({
          type: 'task',
          name: taskName,
          module: moduleName,
          path: installPath,
        });
      }
    }

    return tasks;
  }

  /**
   * Write main manifest as YAML with installation info only
   */
  async writeMainManifest(cfgDir) {
    const manifestPath = path.join(cfgDir, 'manifest.yaml');

    const manifest = {
      installation: {
        version: '6.0.0-alpha.0',
        installDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      modules: this.modules.map((name) => ({
        name,
        version: '',
        shortTitle: '',
      })),
      ides: ['claude-code'],
    };

    const yamlStr = yaml.dump(manifest, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });

    await fs.writeFile(manifestPath, yamlStr);
  }

  /**
   * Write workflow manifest CSV
   */
  async writeWorkflowManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'workflow-manifest.csv');

    // Create CSV header
    let csv = 'name,description,module,path\n';

    // Add rows
    for (const workflow of this.workflows) {
      csv += `"${workflow.name}","${workflow.description}","${workflow.module}","${workflow.path}"\n`;
    }

    await fs.writeFile(csvPath, csv);
  }

  /**
   * Write agent manifest CSV
   */
  async writeAgentManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'agent-manifest.csv');

    // Create CSV header
    let csv = 'name,displayName,description,module,path\n';

    // Add rows
    for (const agent of this.agents) {
      csv += `"${agent.name}","${agent.displayName}","${agent.description}","${agent.module}","${agent.path}"\n`;
    }

    await fs.writeFile(csvPath, csv);
  }

  /**
   * Write task manifest CSV
   */
  async writeTaskManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'task-manifest.csv');

    // Create CSV header
    let csv = 'name,displayName,description,module,path\n';

    // Add rows
    for (const task of this.tasks) {
      csv += `"${task.name}","${task.displayName}","${task.description}","${task.module}","${task.path}"\n`;
    }

    await fs.writeFile(csvPath, csv);
  }

  /**
   * Write files manifest CSV
   */
  async writeFilesManifest(cfgDir) {
    const csvPath = path.join(cfgDir, 'files-manifest.csv');

    // Create CSV header
    let csv = 'type,name,module,path\n';

    // Sort files by type, then module, then name
    this.files.sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      if (a.module !== b.module) return a.module.localeCompare(b.module);
      return a.name.localeCompare(b.name);
    });

    // Add rows
    for (const file of this.files) {
      csv += `"${file.type}","${file.name}","${file.module}","${file.path}"\n`;
    }

    await fs.writeFile(csvPath, csv);
  }
}

module.exports = { ManifestGenerator };
