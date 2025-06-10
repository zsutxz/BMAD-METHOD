/**
 * BMAD v4 Dependency Resolver
 * Analyzes agent configurations and resolves resource dependencies
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class DependencyResolver {
    constructor(rootPath = process.cwd()) {
        this.rootPath = rootPath;
        this.agentsPath = path.join(rootPath, 'bmad-core', 'agents');
        this.corePath = path.join(rootPath, 'bmad-core');
        this.cache = new Map();
    }

    /**
     * Load and parse an agent configuration
     */
    loadAgentConfig(agentId) {
        if (this.cache.has(agentId)) {
            return this.cache.get(agentId);
        }

        const configPath = path.join(this.agentsPath, `${agentId}.yml`);
        
        if (!fs.existsSync(configPath)) {
            throw new Error(`Agent configuration not found: ${configPath}`);
        }

        const configContent = fs.readFileSync(configPath, 'utf8');
        const rawConfig = yaml.load(configContent);
        
        // Extract agent config from nested structure if present
        const config = rawConfig.agent || rawConfig;
        
        // Merge other root-level fields that might be needed
        if (rawConfig.dependencies) {
            config.dependencies = rawConfig.dependencies;
        }
        
        // Validate required fields
        this.validateAgentConfig(config, agentId);
        
        this.cache.set(agentId, config);
        return config;
    }

    /**
     * Validate agent configuration structure
     */
    validateAgentConfig(config, agentId) {
        const required = ['name', 'id'];
        
        for (const field of required) {
            if (!config[field]) {
                throw new Error(`Missing required field '${field}' in agent ${agentId}`);
            }
        }

        if (config.id !== agentId) {
            throw new Error(`Agent ID mismatch: expected '${agentId}', got '${config.id}'`);
        }
        
        // Ensure persona exists
        if (!config.persona) {
            // Default to agent id if no persona specified
            config.persona = config.id;
        }
        
        // Ensure dependencies exist with defaults
        if (!config.dependencies) {
            config.dependencies = {
                tasks: [],
                templates: [],
                checklists: [],
                data: []
            };
        }
    }

    /**
     * Resolve dependencies for a single agent
     */
    resolveAgentDependencies(agentId, environment = 'web') {
        const config = this.loadAgentConfig(agentId);

        const dependencies = {
            agent: agentId,
            config: config,
            resources: {
                tasks: config.dependencies?.tasks || [],
                templates: config.dependencies?.templates || [],
                checklists: config.dependencies?.checklists || [],
                data: config.dependencies?.data || [],
                utils: config.dependencies?.utils || []
            }
        };

        // Validate that all required resources exist
        this.validateResourceExistence(dependencies.resources);

        return dependencies;
    }

    /**
     * Resolve dependencies for multiple agents (bundle)
     */
    resolveBundleDependencies(agentIds, environment = 'web', optimize = true) {
        const agentDependencies = [];
        const allResources = {
            tasks: new Set(),
            templates: new Set(),
            checklists: new Set(),
            data: new Set(),
            utils: new Set()
        };

        // Collect dependencies for each agent
        for (const agentId of agentIds) {
            const deps = this.resolveAgentDependencies(agentId, environment);
            agentDependencies.push(deps);

            // Aggregate all resources
            Object.keys(allResources).forEach(type => {
                deps.resources[type].forEach(resource => {
                    allResources[type].add(resource);
                });
            });
        }

        const result = {
            agents: agentDependencies,
            bundleResources: {
                tasks: Array.from(allResources.tasks),
                templates: Array.from(allResources.templates),
                checklists: Array.from(allResources.checklists),
                data: Array.from(allResources.data),
                utils: Array.from(allResources.utils)
            },
            optimized: optimize
        };

        if (optimize) {
            result.statistics = this.calculateOptimizationStats(agentDependencies, result.bundleResources);
        }

        return result;
    }

    /**
     * Calculate optimization statistics
     */
    calculateOptimizationStats(agentDeps, bundleResources) {
        const totalAgents = agentDeps.length;
        const totalResources = Object.values(bundleResources).reduce((sum, arr) => sum + arr.length, 0);
        
        // Calculate how many resources would be needed without optimization
        const unoptimizedTotal = agentDeps.reduce((sum, agent) => {
            return sum + Object.values(agent.resources).reduce((agentSum, arr) => agentSum + arr.length, 0);
        }, 0);

        const savings = unoptimizedTotal - totalResources;
        const savingsPercentage = unoptimizedTotal > 0 ? (savings / unoptimizedTotal * 100).toFixed(1) : 0;

        return {
            totalAgents,
            totalUniqueResources: totalResources,
            unoptimizedResourceCount: unoptimizedTotal,
            resourcesSaved: savings,
            optimizationPercentage: savingsPercentage
        };
    }

    /**
     * Validate that all required resources exist in core
     */
    validateResourceExistence(resources) {
        const resourceTypes = ['tasks', 'templates', 'checklists', 'data', 'utils'];
        
        for (const type of resourceTypes) {
            const resourceDir = path.join(this.corePath, type);
            
            for (const resource of resources[type] || []) {
                const resourcePath = path.join(resourceDir, `${resource}.md`);
                const altPath = path.join(resourceDir, `${resource}.yml`);
                
                if (!fs.existsSync(resourcePath) && !fs.existsSync(altPath)) {
                    throw new Error(`Resource not found: ${type}/${resource} (checked .md and .yml)`);
                }
            }
        }
    }

    /**
     * Get all available agents
     */
    getAvailableAgents() {
        if (!fs.existsSync(this.agentsPath)) {
            return [];
        }

        return fs.readdirSync(this.agentsPath)
            .filter(file => {
                return (file.endsWith('.yml') || file.endsWith('.yaml')) && 
                       fs.statSync(path.join(this.agentsPath, file)).isFile();
            })
            .map(file => path.basename(file, path.extname(file)));
    }

    /**
     * Generate dependency graph for visualization
     */
    generateDependencyGraph(agentIds = null) {
        const agents = agentIds || this.getAvailableAgents();
        const graph = {
            nodes: [],
            edges: []
        };

        for (const agentId of agents) {
            const config = this.loadAgentConfig(agentId);
            
            // Add agent node
            graph.nodes.push({
                id: agentId,
                type: 'agent',
                label: config.name,
                description: config.description
            });

            // Add resource nodes and edges
            Object.entries(config.requires).forEach(([type, resources]) => {
                resources.forEach(resource => {
                    const resourceId = `${type}:${resource}`;
                    
                    // Add resource node if not exists
                    if (!graph.nodes.find(n => n.id === resourceId)) {
                        graph.nodes.push({
                            id: resourceId,
                            type: type,
                            label: resource,
                            category: type
                        });
                    }

                    // Add edge
                    graph.edges.push({
                        from: agentId,
                        to: resourceId,
                        type: 'requires'
                    });
                });
            });
        }

        return graph;
    }
}

module.exports = DependencyResolver;