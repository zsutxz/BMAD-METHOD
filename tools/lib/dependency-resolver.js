/**
 * BMAD-METHOD 依赖解析器
 *
 * 架构概述：
 *
 * DependencyResolver 负责解析和加载 BMAD 代理和团队的依赖项。
 * 它处理 BMAD-METHOD 框架的复杂依赖关系图，包括：
 *
 * 1. 代理依赖：
 *    - 每个代理都在带有 YAML 前置内容的 Markdown 文件中定义
 *    - 代理可以依赖任务、模板、检查清单、数据文件和实用程序
 *    - 代理依赖项以递归方式解析
 *
 * 2. 团队依赖：
 *    - 团队是在 YAML 配置文件中定义的代理集合
 *    - 团队也可以依赖工作流程
 *    - 团队会自动包含 bmad-orchestrator 代理
 *    - 团队支持通配符 "*" 来包含所有代理（bmad-master 除外）
 *
 * 3. 资源解析：
 *    - 资源首先从 bmad-core 加载，然后从 common 目录加载
 *    - 资源会被缓存以避免重复加载
 *    - 资源包括任务、模板、检查清单、数据文件、实用程序和工作流程
 *
 * 4. 缓存：
 *    - 所有已解析的资源都会在内存中缓存以提高性能
 *    - 缓存键的格式为 `${type}#${id}` 以确保唯一性
 *
 * 解析器由构建系统使用，将代理和团队及其所有依赖项打包
 * 用于在 IDE 和 Web UI 环境中的分发。
 */

const fs = require('node:fs').promises;
const path = require('node:path');
const yaml = require('js-yaml');
const { extractYamlFromAgent } = require('./yaml-utils');

class DependencyResolver {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.bmadCore = path.join(rootDir, 'bmad-core');
    this.common = path.join(rootDir, 'common');
    this.cache = new Map();
  }

  async resolveAgentDependencies(agentId) {
    const agentPath = path.join(this.bmadCore, 'agents', `${agentId}.md`);
    const agentContent = await fs.readFile(agentPath, 'utf8');

    // 从 Markdown 内容中提取 YAML 并清理命令
    const yamlContent = extractYamlFromAgent(agentContent, true);
    if (!yamlContent) {
      throw new Error(`No YAML configuration found in agent ${agentId}`);
    }

    const agentConfig = yaml.load(yamlContent);

    const dependencies = {
      agent: {
        id: agentId,
        path: agentPath,
        content: agentContent,
        config: agentConfig,
      },
      resources: [],
    };

    // 人物角色现在嵌入在代理配置中，无需单独解析

    // 解析其他依赖项
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
    const teamPath = path.join(this.bmadCore, 'agent-teams', `${teamId}.yaml`);
    const teamContent = await fs.readFile(teamPath, 'utf8');
    const teamConfig = yaml.load(teamContent);

    const dependencies = {
      team: {
        id: teamId,
        path: teamPath,
        content: teamContent,
        config: teamConfig,
      },
      agents: [],
      resources: new Map(), // 使用 Map 去重资源
    };

    // 如果是团队，始终首先添加 bmad-orchestrator 代理
    const bmadAgent = await this.resolveAgentDependencies('bmad-orchestrator');
    dependencies.agents.push(bmadAgent.agent);
    for (const res of bmadAgent.resources) {
      dependencies.resources.set(res.path, res);
    }

    // 解析团队中的所有代理
    let agentsToResolve = teamConfig.agents || [];

    // 处理通配符 "*" - 包含所有代理（bmad-master 除外）
    if (agentsToResolve.includes('*')) {
      const allAgents = await this.listAgents();
      // 移除通配符并添加所有代理，除了列表中已有的和 bmad-master
      agentsToResolve = agentsToResolve.filter((a) => a !== '*');
      for (const agent of allAgents) {
        if (!agentsToResolve.includes(agent) && agent !== 'bmad-master') {
          agentsToResolve.push(agent);
        }
      }
    }

    for (const agentId of agentsToResolve) {
      if (agentId === 'bmad-orchestrator' || agentId === 'bmad-master') continue; // Already added or excluded
      const agentDeps = await this.resolveAgentDependencies(agentId);
      dependencies.agents.push(agentDeps.agent);

      // Add resources with deduplication
      for (const res of agentDeps.resources) {
        dependencies.resources.set(res.path, res);
      }
    }

    // Resolve workflows
    for (const workflowId of teamConfig.workflows || []) {
      const resource = await this.loadResource('workflows', workflowId);
      if (resource) dependencies.resources.set(resource.path, resource);
    }

    // Convert Map back to array
    dependencies.resources = [...dependencies.resources.values()];

    return dependencies;
  }

  async loadResource(type, id) {
    const cacheKey = `${type}#${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let content = null;
      let filePath = null;

      // First try bmad-core
      try {
        filePath = path.join(this.bmadCore, type, id);
        content = await fs.readFile(filePath, 'utf8');
      } catch {
        // If not found in bmad-core, try common folder
        try {
          filePath = path.join(this.common, type, id);
          content = await fs.readFile(filePath, 'utf8');
        } catch {
          // File not found in either location
        }
      }

      if (!content) {
        console.warn(`Resource not found: ${type}/${id}`);
        return null;
      }

      const resource = {
        type,
        id,
        path: filePath,
        content,
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
      return files.filter((f) => f.endsWith('.md')).map((f) => f.replace('.md', ''));
    } catch {
      return [];
    }
  }

  async listTeams() {
    try {
      const files = await fs.readdir(path.join(this.bmadCore, 'agent-teams'));
      return files.filter((f) => f.endsWith('.yaml')).map((f) => f.replace('.yaml', ''));
    } catch {
      return [];
    }
  }
}

module.exports = DependencyResolver;
