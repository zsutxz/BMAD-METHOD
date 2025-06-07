/**
 * BMAD v4 Web Builder
 * Builds optimized web bundles and standalone agents
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const DependencyResolver = require('../lib/dependency-resolver');
const BundleOptimizer = require('../lib/bundle-optimizer');

class WebBuilder {
    constructor(rootPath = process.cwd()) {
        this.rootPath = rootPath;
        this.agentsPath = path.join(rootPath, 'agents');
        this.outputPath = path.join(rootPath, 'dist');
        this.resolver = new DependencyResolver(rootPath);
        this.optimizer = new BundleOptimizer(rootPath);
    }

    /**
     * Build all web bundles
     */
    async buildAll() {
        console.log('🚀 Building all web bundles...');
        
        const results = {
            bundles: [],
            agents: [],
            errors: []
        };

        try {
            // Ensure output directory exists
            this.ensureOutputDirectory();

            // Build orchestrator bundles
            const bundleConfigs = this.loadBundleConfigs();
            for (const config of bundleConfigs) {
                try {
                    const result = await this.buildBundle(config);
                    results.bundles.push(result);
                    console.log(`✅ Built bundle: ${config.name}`);
                } catch (error) {
                    console.error(`❌ Failed to build bundle ${config.name}:`, error.message);
                    results.errors.push({ type: 'bundle', name: config.name, error: error.message });
                }
            }

            // Build all individual agents as standalone bundles
            const availableAgents = this.resolver.getAvailableAgents();
            
            // Filter out team bundles and include all non-team agents
            const individualAgents = availableAgents.filter(agentId => {
                // Skip team bundles
                if (agentId.startsWith('team-')) {
                    return false;
                }
                
                try {
                    const config = this.resolver.loadAgentConfig(agentId);
                    // Build all agents that don't explicitly disable web
                    return config.environments?.web?.available !== false;
                } catch {
                    return false;
                }
            });

            for (const agentId of individualAgents) {
                try {
                    const result = await this.buildStandaloneAgent(agentId);
                    results.agents.push(result);
                    console.log(`✅ Built agent bundle: ${agentId}`);
                } catch (error) {
                    console.error(`❌ Failed to build agent ${agentId}:`, error.message);
                    results.errors.push({ type: 'agent', name: agentId, error: error.message });
                }
            }

            console.log(`\n📊 Build Summary:`);
            console.log(`   Bundles: ${results.bundles.length} built, ${results.errors.filter(e => e.type === 'bundle').length} failed`);
            console.log(`   Agents: ${results.agents.length} built, ${results.errors.filter(e => e.type === 'agent').length} failed`);

            return results;

        } catch (error) {
            console.error('❌ Build failed:', error);
            throw error;
        }
    }

    /**
     * Build a specific bundle
     */
    async buildBundle(bundleConfig) {
        console.log(`📦 Building bundle: ${bundleConfig.name}`);

        // Ensure agents is an array of strings
        const agentIds = Array.isArray(bundleConfig.agents) ? bundleConfig.agents : [];
        
        // Resolve dependencies
        const agentDependencies = this.resolver.resolveBundleDependencies(
            agentIds,
            bundleConfig.target_environment,
            bundleConfig.optimize !== false
        );

        // Optimize bundle
        const optimizedBundle = this.optimizer.optimizeBundle(bundleConfig, agentDependencies);

        // Validate bundle
        const validation = this.optimizer.validateBundle(optimizedBundle, {
            maxBundleSize: bundleConfig.max_bundle_size
        });

        if (!validation.valid) {
            throw new Error(`Bundle validation failed: ${validation.issues.map(i => i.message).join(', ')}`);
        }

        // Write output files
        const outputDir = path.join(this.outputPath, 'teams');
        this.ensureDirectory(outputDir);

        const outputs = [];

        // Default to single_file format if not specified
        const outputFormat = bundleConfig.output?.format || 'single_file';
        const outputFilename = bundleConfig.output?.filename || bundleConfig.filename || `${bundleConfig.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
        
        if (outputFormat === 'single_file') {
            // Create single bundle file
            const bundleContent = this.createBundleContent(optimizedBundle, bundleConfig);
            const bundleFile = path.join(outputDir, outputFilename);
            
            fs.writeFileSync(bundleFile, bundleContent);
            outputs.push(bundleFile);

            // For single_file format, everything is in the bundle file
            // No need for separate orchestrator files
        }

        return {
            name: bundleConfig.name,
            type: 'bundle',
            outputs: outputs,
            statistics: optimizedBundle.statistics,
            validation: validation
        };
    }

    /**
     * Build a standalone agent
     */
    async buildStandaloneAgent(agentId) {
        console.log(`👤 Building standalone agent: ${agentId}`);

        const optimizedBundle = this.optimizer.createStandaloneAgent(agentId, 'web');

        // Write standalone agent file
        const outputDir = path.join(this.outputPath, 'agents');
        this.ensureDirectory(outputDir);

        const agentFile = path.join(outputDir, `${agentId}.txt`);
        fs.writeFileSync(agentFile, optimizedBundle.standaloneContent);

        return {
            name: agentId,
            type: 'standalone_agent',
            outputs: [agentFile],
            statistics: optimizedBundle.statistics
        };
    }

    /**
     * Create bundle content for single file output
     */
    createBundleContent(bundle, config) {
        // For a truly self-contained bundle, start with the orchestrator prompt
        let content = this.createOrchestratorPrompt(bundle, config);
        
        content += '\n\n';
        
        // Add bundle metadata as a comment
        content += `<!-- Bundle: ${bundle.metadata.name} -->\n`;
        content += `<!-- Generated: ${bundle.metadata.generatedAt} -->\n`;
        content += `<!-- Environment: ${bundle.metadata.environment} -->\n\n`;

        // Add agent configurations section
        content += `==================== START: agent-config ====================\n`;
        content += yaml.dump({
            name: bundle.metadata.name,
            version: bundle.metadata.version,
            agents: bundle.agents,
            commands: config.output?.orchestrator_commands || []
        });
        content += `==================== END: agent-config ====================\n\n`;

        // Add resource sections
        bundle.sections.forEach(section => {
            content += section.content + '\n\n';
        });

        return content;
    }

    /**
     * Create orchestrator files (agent-prompt.txt and agent-config.txt)
     */
    createOrchestratorFiles(bundle, config) {
        const files = [];
        const outputDir = path.join(this.outputPath, 'teams');

        // Create agent-config.txt
        const agentConfigContent = yaml.dump({
            name: bundle.metadata.name,
            version: bundle.metadata.version,
            environment: bundle.metadata.environment,
            agents: bundle.agents,
            commands: config.output?.orchestrator_commands || [],
            metadata: {
                generatedAt: bundle.metadata.generatedAt,
                totalResources: bundle.statistics.totalResources,
                optimization: bundle.metadata.optimization
            }
        });

        files.push({
            path: path.join(outputDir, 'agent-config.txt'),
            content: agentConfigContent
        });

        // Create agent-prompt.txt (orchestrator instructions)
        const promptContent = this.createOrchestratorPrompt(bundle, config);
        files.push({
            path: path.join(outputDir, 'agent-prompt.txt'),
            content: promptContent
        });

        // Create individual section files
        bundle.sections.forEach(section => {
            files.push({
                path: path.join(outputDir, section.filename),
                content: section.content
            });
        });

        return files;
    }

    /**
     * Create orchestrator prompt content
     */
    createOrchestratorPrompt(bundle, config) {
        // Use the actual BMAD orchestrator agent prompt
        const orchestratorPaths = [
            path.join(this.rootPath, '_old', 'web-bmad-orchestrator-agent.md'),
            path.join(this.rootPath, 'bmad-agent', 'web-bmad-orchestrator-agent.md')
        ];
        
        for (const orchestratorPath of orchestratorPaths) {
            if (fs.existsSync(orchestratorPath)) {
                return fs.readFileSync(orchestratorPath, 'utf8');
            }
        }
        
        // Fallback to basic prompt if orchestrator file not found
        console.warn('Warning: web-bmad-orchestrator-agent.md not found, using fallback prompt');
        
        let prompt = `# BMAD ${bundle.metadata.name} Orchestrator\n\n`;
        prompt += `You are the BMAD orchestrator for the ${bundle.metadata.name}. `;
        prompt += `You can transform into any of the following specialized agents:\n\n`;

        // List available agents
        Object.entries(bundle.agents).forEach(([id, agent]) => {
            prompt += `## ${agent.name} (${config.output?.orchestrator_commands?.find(cmd => cmd.includes(id)) || `/${id}`})\n`;
            prompt += `${agent.description}\n\n`;
            if (agent.capabilities && agent.capabilities.length > 0) {
                prompt += `**Capabilities:**\n`;
                agent.capabilities.forEach(cap => prompt += `- ${cap}\n`);
                prompt += '\n';
            }
        });

        prompt += `## Usage\n\n`;
        prompt += `To transform into a specific agent, use the corresponding command:\n`;
        (config.output?.orchestrator_commands || []).forEach(cmd => {
            prompt += `- \`${cmd}\` - Transform into the corresponding agent\n`;
        });

        prompt += `\n## Resources Available\n\n`;
        prompt += `This bundle includes ${bundle.statistics.totalResources} resources:\n`;
        Object.entries(bundle.statistics.resourcesByType).forEach(([type, count]) => {
            prompt += `- ${count} ${type}\n`;
        });

        return prompt;
    }

    /**
     * Load all bundle configurations
     */
    loadBundleConfigs() {
        const configs = [];
        const agentFiles = this.findAgentFiles(this.agentsPath);

        agentFiles.forEach(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const config = yaml.load(content);
                const filename = path.basename(file);
                
                // Check if this is a team bundle (team-*.yml) with bundle config
                if (filename.startsWith('team-') && config.bundle) {
                    // Only include web bundles (exclude IDE-specific bundles)
                    if (config.bundle.target_environment === 'web') {
                        // Merge agents list from root level into bundle config
                        const bundleConfig = { ...config.bundle };
                        if (config.agents && !bundleConfig.agents) {
                            bundleConfig.agents = config.agents;
                        }
                        configs.push(bundleConfig);
                    }
                }
            } catch (error) {
                console.warn(`Warning: Failed to load config ${file}:`, error.message);
            }
        });

        return configs;
    }

    /**
     * Find all agent configuration files
     */
    findAgentFiles(dir) {
        const files = [];
        
        if (!fs.existsSync(dir)) {
            return files;
        }

        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                files.push(...this.findAgentFiles(itemPath));
            } else if (item.endsWith('.yml') || item.endsWith('.yaml')) {
                files.push(itemPath);
            }
        });

        return files;
    }

    /**
     * Ensure directory exists
     */
    ensureDirectory(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    /**
     * Ensure output directory exists
     */
    ensureOutputDirectory() {
        this.ensureDirectory(this.outputPath);
        this.ensureDirectory(path.join(this.outputPath, 'teams'));
        this.ensureDirectory(path.join(this.outputPath, 'agents'));
    }
}

module.exports = WebBuilder;