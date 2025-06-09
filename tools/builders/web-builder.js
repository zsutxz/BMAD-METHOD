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
        this.teamsPath = path.join(rootPath, 'agent-teams');
        this.outputPath = path.join(rootPath, 'dist');
        this.sampleUpdatePath = path.join(rootPath, 'web-bundles');
        this.resolver = new DependencyResolver(rootPath);
        this.optimizer = new BundleOptimizer(rootPath);
        this.sampleUpdateEnabled = false;
    }

    /**
     * Enable sample update mode to output to web-bundles directory as well
     */
    enableSampleUpdate() {
        this.sampleUpdateEnabled = true;
    }

    /**
     * Build all web bundles
     */
    async buildAll() {
        console.log('🚀 Building all bundles...');
        
        const results = {
            teams: [],
            bundles: [],
            agents: [],
            errors: []
        };

        try {
            // Ensure output directories exist
            this.ensureOutputDirectory();
            if (this.sampleUpdateEnabled) {
                this.ensureSampleUpdateDirectory();
            }

            // Build orchestrator bundles
            const bundleConfigs = this.loadBundleConfigs();
            for (const config of bundleConfigs) {
                try {
                    const result = await this.buildBundle(config);
                    const isTeamBundle = config.name.toLowerCase().includes('team');
                    if (isTeamBundle) {
                        results.teams.push(result);
                    } else {
                        results.bundles.push(result);
                    }
                    const bundleType = isTeamBundle ? 'team bundle' : 'bundle';
                    console.log(`✅ Built ${bundleType}: ${config.name}`);
                } catch (error) {
                    const isTeamBundle = config.name.toLowerCase().includes('team');
                    const bundleType = isTeamBundle ? 'team bundle' : 'bundle';
                    const errorType = isTeamBundle ? 'team' : 'bundle';
                    console.error(`❌ Failed to build ${bundleType} ${config.name}:`, error.message);
                    results.errors.push({ type: errorType, name: config.name, error: error.message });
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
            console.log(`   Teams: ${results.teams.length} built, ${results.errors.filter(e => e.type === 'team').length} failed`);
            if (results.bundles.length > 0 || results.errors.filter(e => e.type === 'bundle').length > 0) {
                console.log(`   Bundles: ${results.bundles.length} built, ${results.errors.filter(e => e.type === 'bundle').length} failed`);
            }
            console.log(`   Agents: ${results.agents.length} built, ${results.errors.filter(e => e.type === 'agent').length} failed`);

            return results;

        } catch (error) {
            console.error('❌ Build failed:', error);
            throw error;
        }
    }

    /**
     * Expand agent wildcards in the list
     * If the list contains '*', it will be replaced with all available agents
     */
    expandAgentWildcards(agentIds) {
        // Check if wildcard is present
        const wildcardIndex = agentIds.indexOf('*');
        if (wildcardIndex === -1) {
            return agentIds;
        }

        // Get all available agents
        const allAgents = this.resolver.getAvailableAgents()
            .filter(agentId => {
                // Exclude team bundles
                if (agentId.startsWith('team-')) {
                    return false;
                }
                
                try {
                    const config = this.resolver.loadAgentConfig(agentId);
                    // Include all agents that don't explicitly disable web
                    return config.environments?.web?.available !== false;
                } catch {
                    return false;
                }
            });

        // Create expanded list
        const expandedList = [...agentIds];
        
        // Replace wildcard with all agents not already in the list
        const existingAgents = new Set(agentIds.filter(id => id !== '*'));
        const agentsToAdd = allAgents.filter(agent => !existingAgents.has(agent));
        
        // Replace the wildcard with the missing agents
        expandedList.splice(wildcardIndex, 1, ...agentsToAdd);
        
        console.log(`   Expanded wildcard to include: ${agentsToAdd.join(', ')}`);
        
        return expandedList;
    }

    /**
     * Build a specific bundle
     */
    async buildBundle(bundleConfig) {
        const isTeamBundle = bundleConfig.name.toLowerCase().includes('team');
        const emoji = isTeamBundle ? '👥' : '📦';
        const bundleType = isTeamBundle ? 'team bundle' : 'bundle';
        console.log(`${emoji} Building ${bundleType}: ${bundleConfig.name}`);

        // Ensure agents is an array of strings
        let agentIds = Array.isArray(bundleConfig.agents) ? bundleConfig.agents : [];
        
        // Expand wildcards
        agentIds = this.expandAgentWildcards(agentIds);
        
        // Resolve dependencies
        const agentDependencies = this.resolver.resolveBundleDependencies(
            agentIds,
            'web',
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

            // Also write to web-bundles if sample update is enabled
            if (this.sampleUpdateEnabled) {
                const sampleOutputDir = path.join(this.sampleUpdatePath, 'teams');
                this.ensureDirectory(sampleOutputDir);
                const sampleBundleFile = path.join(sampleOutputDir, outputFilename);
                fs.writeFileSync(sampleBundleFile, bundleContent);
            }

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

        // Get agent config to extract name
        const agentConfig = this.resolver.loadAgentConfig(agentId);
        const agentName = agentConfig.name || agentId;
        
        // Create lowercase-dashcase filename with format: {id}-{name}.txt
        const filename = `${agentId}-${agentName.toLowerCase().replace(/\s+/g, '-')}.txt`;

        // Write standalone agent file
        const outputDir = path.join(this.outputPath, 'agents');
        this.ensureDirectory(outputDir);

        const agentFile = path.join(outputDir, filename);
        fs.writeFileSync(agentFile, optimizedBundle.standaloneContent);

        // Also write to web-bundles if sample update is enabled
        if (this.sampleUpdateEnabled) {
            const sampleOutputDir = path.join(this.sampleUpdatePath, 'agents');
            this.ensureDirectory(sampleOutputDir);
            const sampleAgentFile = path.join(sampleOutputDir, filename);
            fs.writeFileSync(sampleAgentFile, optimizedBundle.standaloneContent);
        }

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
        content += `<!-- Environment: web -->\n\n`;

        // Add agent configurations section
        content += `==================== START: agent-config ====================\n`;
        content += yaml.dump({
            name: bundle.metadata.name,
            version: bundle.metadata.version || '1.0.0',
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
            version: bundle.metadata.version || '1.0.0',
            environment: 'web',
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
        // Try to use the bmad persona as the orchestrator base
        const bmadPersonaPath = path.join(this.rootPath, 'bmad-core', 'personas', 'bmad.md');
        
        if (fs.existsSync(bmadPersonaPath)) {
            const bmadContent = fs.readFileSync(bmadPersonaPath, 'utf8');
            // Append bundle-specific agent information
            let prompt = bmadContent + '\n\n';
            prompt += `## Available Agents in ${bundle.metadata.name}\n\n`;
            
            Object.entries(bundle.agents).forEach(([id, agent]) => {
                const command = config.output?.orchestrator_commands?.find(cmd => cmd.includes(id)) || `/${id}`;
                prompt += `### ${agent.name} (${command})\n`;
                prompt += `- **Role:** ${agent.title}\n`;
                prompt += `- **Description:** ${agent.description}\n`;
                if (agent.customize) {
                    prompt += `- **Customization:** ${agent.customize}\n`;
                }
                prompt += '\n';
            });
            
            return prompt;
        }
        
        // Fallback to basic prompt if bmad persona not found
        
        let prompt = `# BMAD ${bundle.metadata.name} Orchestrator\n\n`;
        prompt += `You are the BMAD orchestrator for the ${bundle.metadata.name}. `;
        prompt += `You can transform into any of the following specialized agents:\n\n`;

        // List available agents
        Object.entries(bundle.agents).forEach(([id, agent]) => {
            prompt += `## ${agent.name} (${config.output?.orchestrator_commands?.find(cmd => cmd.includes(id)) || `/${id}`})\n`;
            prompt += `**Role:** ${agent.title}\n`;
            prompt += `${agent.description}\n`;
            if (agent.customize) {
                prompt += `**Customization:** ${agent.customize}\n`;
            }
            prompt += '\n';
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
        
        // Load team configurations from agent-teams directory
        const teamFiles = this.findAgentFiles(this.teamsPath);
        teamFiles.forEach(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const config = yaml.load(content);
                
                // Check if this has bundle config
                if (config.bundle) {
                    // Merge agents list from root level into bundle config
                    const bundleConfig = { ...config.bundle };
                    if (config.agents && !bundleConfig.agents) {
                        bundleConfig.agents = config.agents;
                    }
                    configs.push(bundleConfig);
                }
            } catch (error) {
                console.warn(`Warning: Failed to load config ${file}:`, error.message);
            }
        });
        
        // For backward compatibility, also check agents directory for team-*.yml files
        const agentFiles = this.findAgentFiles(this.agentsPath);
        agentFiles.forEach(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const config = yaml.load(content);
                const filename = path.basename(file);
                
                // Check if this is a team bundle (team-*.yml) with bundle config
                if (filename.startsWith('team-') && config.bundle) {
                    // Merge agents list from root level into bundle config
                    const bundleConfig = { ...config.bundle };
                    if (config.agents && !bundleConfig.agents) {
                        bundleConfig.agents = config.agents;
                    }
                    configs.push(bundleConfig);
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

    /**
     * Ensure sample update directory exists
     */
    ensureSampleUpdateDirectory() {
        this.ensureDirectory(this.sampleUpdatePath);
        this.ensureDirectory(path.join(this.sampleUpdatePath, 'teams'));
        this.ensureDirectory(path.join(this.sampleUpdatePath, 'agents'));
    }
}

module.exports = WebBuilder;