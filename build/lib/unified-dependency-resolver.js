/**
 * BMAD v5 Unified Dependency Resolver
 * Works with unified agent configurations that can generate both IDE and web outputs
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class UnifiedDependencyResolver {
    constructor(rootPath = process.cwd()) {
        this.rootPath = rootPath;
        this.agentsPath = path.join(rootPath, 'agents');
        this.corePath = path.join(rootPath, 'bmad-core');
        this.cache = new Map();
    }

    /**
     * Load and parse a unified agent configuration
     */
    loadUnifiedAgentConfig(agentId) {
        if (this.cache.has(agentId)) {
            return this.cache.get(agentId);
        }

        const configPath = path.join(this.agentsPath, `${agentId}.yml`);
        
        if (!fs.existsSync(configPath)) {
            throw new Error(`Unified agent configuration not found: ${configPath}`);
        }

        try {
            const content = fs.readFileSync(configPath, 'utf8');
            const config = yaml.load(content);
            
            // Validate unified config structure
            this.validateUnifiedConfig(config, agentId);
            
            this.cache.set(agentId, config);
            return config;
        } catch (error) {
            throw new Error(`Failed to load unified agent config ${agentId}: ${error.message}`);
        }
    }

    /**
     * Validate unified configuration structure
     */
    validateUnifiedConfig(config, agentId) {
        if (!config.agent || !config.agent.id || !config.agent.name) {
            throw new Error(`Invalid unified config for ${agentId}: missing agent identity`);
        }

        if (!config.dependencies) {
            throw new Error(`Invalid unified config for ${agentId}: missing dependencies`);
        }

        if (!config.environments || !config.environments.web || !config.environments.ide) {
            throw new Error(`Invalid unified config for ${agentId}: missing environment configurations`);
        }

        // CRITICAL: Ensure ONLY BMAD has bmad-kb access
        const hasBmadKb = (
            config.dependencies.data?.includes('bmad-kb') ||
            config.environments.ide.dependencies?.data?.includes('bmad-kb') ||
            config.environments.web.dependencies?.data?.includes('bmad-kb')
        );

        if (hasBmadKb && agentId !== 'bmad') {
            throw new Error(`SECURITY VIOLATION: Agent ${agentId} has bmad-kb access but only BMAD should have it!`);
        }

        if (!hasBmadKb && agentId === 'bmad') {
            throw new Error(`Configuration error: BMAD agent missing required bmad-kb access`);
        }
    }

    /**
     * Resolve dependencies for an agent in a specific environment
     */
    resolveAgentDependencies(agentId, environment = 'web', bundleContext = null) {
        const config = this.loadUnifiedAgentConfig(agentId);
        
        // Start with base dependencies
        const baseDeps = {
            tasks: [...(config.dependencies.tasks || [])],
            templates: [...(config.dependencies.templates || [])],
            checklists: [...(config.dependencies.checklists || [])],
            data: [...(config.dependencies.data || [])]
        };

        // Apply environment-specific overrides
        const envConfig = config.environments[environment];
        if (envConfig && envConfig.dependencies) {
            Object.keys(envConfig.dependencies).forEach(type => {
                if (envConfig.dependencies[type]) {
                    baseDeps[type] = [...new Set([...baseDeps[type], ...envConfig.dependencies[type]])];
                }
            });
        }

        // Special handling for team bundles containing BMAD
        if (bundleContext && bundleContext.agents && bundleContext.agents.includes('bmad')) {
            // Only add bmad-kb if this IS the BMAD agent
            if (agentId === 'bmad') {
                if (!baseDeps.data.includes('bmad-kb')) {
                    baseDeps.data.push('bmad-kb');
                }
            }
        }

        // Resolve file paths and validate existence
        const resolvedDeps = {};
        Object.keys(baseDeps).forEach(type => {
            resolvedDeps[type] = baseDeps[type].map(dep => {
                const filePath = this.resolveResourcePath(type, dep);
                if (!fs.existsSync(filePath)) {
                    throw new Error(`Resource not found: ${filePath} (required by ${agentId})`);
                }
                return {
                    id: dep,
                    path: filePath,
                    content: fs.readFileSync(filePath, 'utf8')
                };
            });
        });

        return {
            config: config,
            agentId: agentId,
            environment: environment,
            resources: resolvedDeps
        };
    }

    /**
     * Resolve path for a resource
     */
    resolveResourcePath(type, resourceId) {
        const resourceMap = {
            'tasks': 'tasks',
            'templates': 'templates', 
            'checklists': 'checklists',
            'data': 'data',
            'personas': 'personas',
            'utils': 'utils'
        };

        const subdir = resourceMap[type];
        if (!subdir) {
            throw new Error(`Unknown resource type: ${type}`);
        }

        return path.join(this.corePath, subdir, `${resourceId}.md`);
    }

    /**
     * Get all available agents
     */
    getAvailableAgents() {
        if (!fs.existsSync(this.agentsPath)) {
            return [];
        }

        return fs.readdirSync(this.agentsPath)
            .filter(file => file.endsWith('.yml'))
            .map(file => path.basename(file, '.yml'))
            .sort();
    }

    /**
     * Generate dependency graph for all agents
     */
    generateDependencyGraph() {
        const agents = this.getAvailableAgents();
        const nodes = [];
        const edges = [];
        
        // Add agent nodes
        agents.forEach(agentId => {
            try {
                const config = this.loadUnifiedAgentConfig(agentId);
                nodes.push({
                    id: agentId,
                    type: 'agent',
                    label: config.agent.name,
                    title: config.agent.title,
                    hasBmadKb: config.dependencies.data?.includes('bmad-kb') || false
                });
            } catch (error) {
                console.warn(`Skipping ${agentId}: ${error.message}`);
            }
        });

        // Add resource nodes and edges
        agents.forEach(agentId => {
            try {
                const deps = this.resolveAgentDependencies(agentId, 'web');
                Object.entries(deps.resources).forEach(([type, resources]) => {
                    resources.forEach(resource => {
                        const resourceNodeId = `${type}:${resource.id}`;
                        
                        // Add resource node if not exists
                        if (!nodes.find(n => n.id === resourceNodeId)) {
                            nodes.push({
                                id: resourceNodeId,
                                type: 'resource',
                                resourceType: type,
                                label: resource.id
                            });
                        }
                        
                        // Add edge from agent to resource
                        edges.push({
                            from: agentId,
                            to: resourceNodeId,
                            type: 'requires'
                        });
                    });
                });
            } catch (error) {
                console.warn(`Failed to analyze dependencies for ${agentId}: ${error.message}`);
            }
        });

        return { nodes, edges };
    }

    /**
     * Validate all configurations
     */
    validateAllConfigurations() {
        const agents = this.getAvailableAgents();
        const results = {
            valid: [],
            invalid: [],
            bmadKbViolations: []
        };

        agents.forEach(agentId => {
            try {
                const deps = this.resolveAgentDependencies(agentId, 'web');
                results.valid.push(agentId);
                
                // Check for bmad-kb violations
                const hasBmadKb = deps.resources.data?.some(d => d.id === 'bmad-kb');
                if (hasBmadKb && agentId !== 'bmad') {
                    results.bmadKbViolations.push(agentId);
                }
            } catch (error) {
                results.invalid.push({
                    agentId: agentId,
                    error: error.message
                });
            }
        });

        return results;
    }
}

module.exports = UnifiedDependencyResolver;