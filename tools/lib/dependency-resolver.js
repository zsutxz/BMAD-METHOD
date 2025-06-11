const fs = require('fs').promises;
const path = require('path');
const yaml = require('js-yaml');

class DependencyResolver {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.bmadCore = path.join(rootDir, 'bmad-core');
    this.cache = new Map();
  }

  async resolveAgentDependencies(agentId) {
    const agentPath = path.join(this.bmadCore, 'agents', `${agentId}.yml`);
    const agentContent = await fs.readFile(agentPath, 'utf8');
    const agentConfig = yaml.load(agentContent);
    
    const dependencies = {
      agent: {
        id: agentId,
        path: `agents#${agentId}`,
        content: agentContent,
        config: agentConfig
      },
      resources: []
    };

    // Resolve persona
    if (agentConfig.dependencies?.persona) {
      const personaId = agentConfig.dependencies.persona;
      const resource = await this.loadResource('personas', personaId);
      if (resource) dependencies.resources.push(resource);
    }

    // Resolve other dependencies
    const depTypes = ['tasks', 'templates', 'checklists', 'data', 'utils'];
    for (const depType of depTypes) {
      const deps = agentConfig.dependencies?.[depType] || [];
      for (const depId of deps) {
        const resource = await this.loadResource(depType, depId);
        if (resource) dependencies.resources.push(resource);
      }
    }

    return dependencies;
  }

  async resolveTeamDependencies(teamId) {
    const teamPath = path.join(this.bmadCore, 'agent-teams', `${teamId}.yml`);
    const teamContent = await fs.readFile(teamPath, 'utf8');
    const teamConfig = yaml.load(teamContent);
    
    const dependencies = {
      team: {
        id: teamId,
        path: `agent-teams#${teamId}`,
        content: teamContent,
        config: teamConfig
      },
      agents: [],
      resources: new Map() // Use Map to deduplicate resources
    };

    // Always add bmad agent first if it's a team
    const bmadAgent = await this.resolveAgentDependencies('bmad');
    dependencies.agents.push(bmadAgent.agent);
    bmadAgent.resources.forEach(res => {
      dependencies.resources.set(res.path, res);
    });

    // Resolve all agents in the team
    let agentsToResolve = teamConfig.agents || [];
    
    // Handle wildcard "*" - include all agents
    if (agentsToResolve.includes('*')) {
      const allAgents = await this.listAgents();
      // Remove wildcard and add all agents except those already in the list
      agentsToResolve = agentsToResolve.filter(a => a !== '*');
      for (const agent of allAgents) {
        if (!agentsToResolve.includes(agent)) {
          agentsToResolve.push(agent);
        }
      }
    }
    
    for (const agentId of agentsToResolve) {
      if (agentId === 'bmad') continue; // Already added
      const agentDeps = await this.resolveAgentDependencies(agentId);
      dependencies.agents.push(agentDeps.agent);
      
      // Add resources with deduplication
      agentDeps.resources.forEach(res => {
        dependencies.resources.set(res.path, res);
      });
    }

    // Resolve workflows
    for (const workflowId of teamConfig.workflows || []) {
      const resource = await this.loadResource('workflows', workflowId);
      if (resource) dependencies.resources.set(resource.path, resource);
    }

    // Convert Map back to array
    dependencies.resources = Array.from(dependencies.resources.values());

    return dependencies;
  }

  async loadResource(type, id) {
    const cacheKey = `${type}#${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const extensions = ['.md', '.yml', '.yaml'];
      let content = null;
      let filePath = null;

      for (const ext of extensions) {
        try {
          filePath = path.join(this.bmadCore, type, `${id}${ext}`);
          content = await fs.readFile(filePath, 'utf8');
          break;
        } catch (e) {
          // Try next extension
        }
      }

      if (!content) {
        console.warn(`Resource not found: ${type}/${id}`);
        return null;
      }

      const resource = {
        type,
        id,
        path: `${type}#${id}`,
        content
      };

      this.cache.set(cacheKey, resource);
      return resource;
    } catch (error) {
      console.error(`Error loading resource ${type}/${id}:`, error.message);
      return null;
    }
  }

  async listAgents() {
    try {
      const files = await fs.readdir(path.join(this.bmadCore, 'agents'));
      return files
        .filter(f => f.endsWith('.yml'))
        .map(f => f.replace('.yml', ''));
    } catch (error) {
      return [];
    }
  }

  async listTeams() {
    try {
      const files = await fs.readdir(path.join(this.bmadCore, 'agent-teams'));
      return files
        .filter(f => f.endsWith('.yml'))
        .map(f => f.replace('.yml', ''));
    } catch (error) {
      return [];
    }
  }
}

module.exports = DependencyResolver;