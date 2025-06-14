const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

class ConfigLoader {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'config', 'install.config.yml');
    this.config = null;
  }

  async load() {
    if (this.config) return this.config;
    
    try {
      const configContent = await fs.readFile(this.configPath, 'utf8');
      this.config = yaml.load(configContent);
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  async getInstallationOptions() {
    const config = await this.load();
    return config['installation-options'] || {};
  }

  async getAvailableAgents() {
    const config = await this.load();
    return config['available-agents'] || [];
  }

  async getAgentDependencies(agentId) {
    const config = await this.load();
    const dependencies = config['agent-dependencies'] || {};
    
    // Always include core files
    const coreFiles = dependencies['core-files'] || [];
    
    // Add agent-specific dependencies
    const agentDeps = dependencies[agentId] || [];
    
    return [...coreFiles, ...agentDeps];
  }

  async getIdeConfiguration(ide) {
    const config = await this.load();
    const ideConfigs = config['ide-configurations'] || {};
    return ideConfigs[ide] || null;
  }

  getBmadCorePath() {
    // Get the path to .bmad-core relative to the installer (now under tools)
    return path.join(__dirname, '..', '..', '..', '.bmad-core');
  }

  getAgentPath(agentId) {
    return path.join(this.getBmadCorePath(), 'agents', `${agentId}.md`);
  }
}

module.exports = new ConfigLoader();