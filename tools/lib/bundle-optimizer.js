/**
 * BMAD v4 Bundle Optimizer
 * Optimizes bundles by deduplicating resources and minimizing size
 */

const fs = require('fs');
const path = require('path');

class BundleOptimizer {
    constructor(rootPath = process.cwd()) {
        this.rootPath = rootPath;
        this.corePath = path.join(rootPath, 'bmad-core');
    }

    /**
     * Optimize a bundle by loading and processing resources
     */
    optimizeBundle(bundleConfig, agentDependencies) {
        const optimizedBundle = {
            metadata: {
                name: bundleConfig.name,
                version: bundleConfig.version,
                environment: 'web',
                generatedAt: new Date().toISOString(),
                optimization: bundleConfig.optimize || false
            },
            agents: {},
            resources: {
                personas: {},
                tasks: {},
                templates: {},
                checklists: {},
                data: {},
                utils: {}
            },
            sections: [],
            statistics: {}
        };

        // Process each agent
        agentDependencies.agents.forEach(agentDep => {
            optimizedBundle.agents[agentDep.agent] = {
                name: agentDep.config.name,
                id: agentDep.config.id,
                title: agentDep.config.title,
                description: agentDep.config.description,
                persona: agentDep.config.persona,
                customize: agentDep.config.customize || '',
                capabilities: agentDep.config.capabilities || [],
                workflow: agentDep.config.workflow || []
            };
        });

        // Load and process resources
        this.loadResources(optimizedBundle, agentDependencies.bundleResources, agentDependencies.agents);

        // Create optimized sections for web output
        this.createWebSections(optimizedBundle, bundleConfig);

        // Calculate statistics
        optimizedBundle.statistics = this.calculateBundleStats(optimizedBundle, agentDependencies);

        return optimizedBundle;
    }

    /**
     * Load resources from core directory
     */
    loadResources(bundle, resourceLists, agentDeps = []) {
        const resourceTypes = ['tasks', 'templates', 'checklists', 'data', 'utils'];
        
        resourceTypes.forEach(type => {
            const resourceDir = path.join(this.corePath, type);
            
            (resourceLists[type] || []).forEach(resourceName => {
                const content = this.loadResourceFile(resourceDir, resourceName);
                if (content) {
                    bundle.resources[type][resourceName] = {
                        name: resourceName,
                        content: content,
                        size: content.length
                    };
                }
            });
        });

        // Load personas for agents
        const personaDir = path.join(this.corePath, 'personas');
        agentDeps.forEach(agentDep => {
            const agentId = agentDep.agent;
            const personaName = agentDep.config.persona || agentId;
            const personaContent = this.loadResourceFile(personaDir, personaName);
            if (personaContent) {
                bundle.resources.personas[agentId] = {
                    name: personaName,
                    content: personaContent,
                    size: personaContent.length
                };
            }
        });
    }

    /**
     * Load a resource file from disk
     */
    loadResourceFile(dir, name) {
        const extensions = ['.md', '.yml', '.yaml'];
        
        for (const ext of extensions) {
            const filePath = path.join(dir, `${name}${ext}`);
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath, 'utf8');
            }
        }
        
        console.warn(`Resource file not found: ${name} in ${dir}`);
        return null;
    }

    /**
     * Create web-formatted sections with markers
     */
    createWebSections(bundle, bundleConfig) {
        const sections = [];

        // Create personas section
        // For team bundles, exclude BMAD from personas since it's already the orchestrator
        if (Object.keys(bundle.resources.personas).length > 0) {
            const personasContent = Object.entries(bundle.resources.personas)
                .filter(([id, persona]) => id !== 'bmad')  // Exclude BMAD from personas section
                .map(([id, persona]) => 
                    `==================== START: personas#${id} ====================\n` +
                    persona.content +
                    `\n==================== END: personas#${id} ====================`
                ).join('\n\n');
            
            if (personasContent) {  // Only add section if there's content after filtering
                sections.push({
                    name: 'personas',
                    filename: 'personas.txt',
                    content: personasContent,
                    size: personasContent.length
                });
            }
        }

        // Create other resource sections
        ['tasks', 'templates', 'checklists', 'data', 'utils'].forEach(type => {
            const resources = bundle.resources[type];
            if (Object.keys(resources).length > 0) {
                const sectionContent = Object.entries(resources)
                    .map(([name, resource]) =>
                        `==================== START: ${type}#${name} ====================\n` +
                        resource.content +
                        `\n==================== END: ${type}#${name} ====================`
                    ).join('\n\n');
                
                sections.push({
                    name: type,
                    filename: `${type}.txt`,
                    content: sectionContent,
                    size: sectionContent.length
                });
            }
        });

        bundle.sections = sections;
    }

    /**
     * Create standalone agent bundle
     */
    createStandaloneAgent(agentId, environment = 'web') {
        const DependencyResolver = require('./dependency-resolver');
        const resolver = new DependencyResolver(this.rootPath);
        
        const agentDep = resolver.resolveAgentDependencies(agentId, environment);
        const bundleConfig = {
            name: `${agentDep.config.name} Standalone`,
            version: agentDep.config.version || '1.0.0',
            // Environment is always 'web' for standalone agents
            optimize: true
        };

        // Create bundle with just this agent
        const agentDependencies = {
            agents: [agentDep],
            bundleResources: agentDep.resources
        };

        const optimizedBundle = this.optimizeBundle(bundleConfig, agentDependencies);

        // For standalone agents, create a single combined content
        if (environment === 'web') {
            optimizedBundle.standaloneContent = this.createStandaloneContent(optimizedBundle, agentId);
        }

        return optimizedBundle;
    }

    /**
     * Create single-file content for standalone agent
     */
    createStandaloneContent(bundle, agentId) {
        const agent = bundle.agents[agentId];
        const persona = bundle.resources.personas[agentId];
        
        let content = `# ${agent.name}\n\n`;
        content += `${agent.description}\n\n`;
        
        if (persona) {
            content += `==================== START: personas#${agentId} ====================\n`;
            content += `${persona.content}\n`;
            content += `==================== END: personas#${agentId} ====================\n\n`;
        }

        // Add required resources inline
        const resourceTypes = ['tasks', 'templates', 'checklists', 'data', 'utils'];
        resourceTypes.forEach(type => {
            const resources = bundle.resources[type];
            if (Object.keys(resources).length > 0) {
                Object.entries(resources).forEach(([name, resource]) => {
                    content += `==================== START: ${type}#${name} ====================\n`;
                    content += `${resource.content}\n`;
                    content += `==================== END: ${type}#${name} ====================\n\n`;
                });
            }
        });

        return content;
    }

    /**
     * Calculate bundle statistics
     */
    calculateBundleStats(bundle, agentDependencies) {
        const stats = {
            agents: Object.keys(bundle.agents).length,
            totalResources: 0,
            resourcesByType: {},
            totalSize: 0,
            sizeByType: {},
            averageResourceSize: 0
        };

        // Count resources and calculate sizes
        Object.entries(bundle.resources).forEach(([type, resources]) => {
            const count = Object.keys(resources).length;
            stats.resourcesByType[type] = count;
            stats.totalResources += count;

            const typeSize = Object.values(resources).reduce((sum, r) => sum + (r.size || 0), 0);
            stats.sizeByType[type] = typeSize;
            stats.totalSize += typeSize;
        });

        if (stats.totalResources > 0) {
            stats.averageResourceSize = Math.round(stats.totalSize / stats.totalResources);
        }

        // Add web-specific stats
        if (bundle.sections) {
            stats.webSections = bundle.sections.length;
            stats.webTotalSize = bundle.sections.reduce((sum, s) => sum + s.size, 0);
        }

        return stats;
    }

    /**
     * Validate bundle against size constraints
     */
    validateBundle(bundle, constraints = {}) {
        const issues = [];
        const stats = bundle.statistics;

        // Check max bundle size
        if (constraints.maxBundleSize && stats.totalSize > constraints.maxBundleSize) {
            issues.push({
                type: 'size_exceeded',
                message: `Bundle size ${stats.totalSize} exceeds limit ${constraints.maxBundleSize}`,
                severity: 'error'
            });
        }

        // Check web section sizes
        if (bundle.sections) {
            bundle.sections.forEach(section => {
                if (constraints.maxSectionSize && section.size > constraints.maxSectionSize) {
                    issues.push({
                        type: 'section_size_exceeded',
                        message: `Section ${section.name} size ${section.size} exceeds limit ${constraints.maxSectionSize}`,
                        severity: 'warning'
                    });
                }
            });
        }

        return {
            valid: issues.filter(i => i.severity === 'error').length === 0,
            issues: issues
        };
    }
}

module.exports = BundleOptimizer;