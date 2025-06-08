#!/usr/bin/env node

/**
 * BMAD v4 Build CLI
 * Command line interface for building agents and bundles
 */

const { program } = require('commander');
const WebBuilder = require('./builders/web-builder');
const DependencyResolver = require('./lib/dependency-resolver');

// Initialize resolver
const resolver = new DependencyResolver();

program
    .name('bmad-build')
    .description('BMAD v4 Build System')
    .version('4.0.0');

// Build all web bundles and agents
program
    .command('build')
    .alias('build:web')
    .description('Build all web bundles and standalone agents')
    .action(async () => {
        try {
            const builder = new WebBuilder();
            const results = await builder.buildAll();
            
            if (results.errors.length > 0) {
                console.log('\n⚠️  Build completed with errors:');
                results.errors.forEach(error => {
                    console.log(`   ${error.type}: ${error.name} - ${error.error}`);
                });
                process.exit(1);
            } else {
                console.log('\n🎉 All builds completed successfully!');
            }
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    });

// Build specific bundle
program
    .command('build:bundle')
    .description('Build a specific bundle')
    .requiredOption('-n, --name <name>', 'Bundle name')
    .action(async (options) => {
        try {
            const builder = new WebBuilder();
            const configs = builder.loadBundleConfigs();
            const config = configs.find(c => c.name.toLowerCase().includes(options.name.toLowerCase()));
            
            if (!config) {
                console.error(`❌ Bundle not found: ${options.name}`);
                process.exit(1);
            }

            const result = await builder.buildBundle(config);
            console.log(`✅ Built bundle: ${result.name}`);
            console.log(`   Files: ${result.outputs.length}`);
            console.log(`   Size: ${result.statistics.totalSize} characters`);
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    });

// Build standalone agent
program
    .command('build:agent')
    .description('Build a standalone agent')
    .requiredOption('-a, --agent <id>', 'Agent ID')
    .action(async (options) => {
        try {
            const builder = new WebBuilder();
            const result = await builder.buildStandaloneAgent(options.agent);
            
            console.log(`✅ Built agent: ${result.name}`);
            console.log(`   File: ${result.outputs[0]}`);
            console.log(`   Size: ${result.statistics.totalSize} characters`);
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    });

// List available agents
program
    .command('list:agents')
    .description('List all available agents')
    .action(() => {
        try {
            const agents = resolver.getAvailableAgents();
            console.log('📋 Available agents:');
            
            agents.forEach(agentId => {
                try {
                    const config = resolver.loadAgentConfig(agentId);
                    const webCompatible = config.environments.web?.available !== false;
                    const ideOnly = config.environments.ide?.ide_only === true;
                    
                    console.log(`   ${agentId}: ${config.name}`);
                    console.log(`      ${config.description}`);
                    console.log(`      Environments: ${webCompatible ? 'web' : ''}${webCompatible && !ideOnly ? ', ' : ''}${!ideOnly ? 'ide' : 'ide-only'}`);
                    console.log('');
                } catch (error) {
                    console.log(`   ${agentId}: Error loading config`);
                }
            });
        } catch (error) {
            console.error('❌ Failed to list agents:', error.message);
            process.exit(1);
        }
    });

// Analyze dependencies
program
    .command('analyze:deps')
    .description('Analyze agent dependencies')
    .option('-a, --agent <id>', 'Specific agent ID')
    .option('-g, --graph', 'Generate dependency graph')
    .action((options) => {
        try {
            if (options.agent) {
                const deps = resolver.resolveAgentDependencies(options.agent, 'web');
                console.log(`📊 Dependencies for ${deps.config.name}:`);
                Object.entries(deps.resources).forEach(([type, resources]) => {
                    if (resources.length > 0) {
                        console.log(`   ${type}: ${resources.join(', ')}`);
                    }
                });
            } else if (options.graph) {
                const graph = resolver.generateDependencyGraph();
                console.log('📈 Dependency Graph:');
                console.log(`   Nodes: ${graph.nodes.length}`);
                console.log(`   Edges: ${graph.edges.length}`);
                console.log('\n   Agents:');
                graph.nodes.filter(n => n.type === 'agent').forEach(n => {
                    console.log(`     ${n.id}: ${n.label}`);
                });
            } else {
                const agents = resolver.getAvailableAgents();
                console.log('📊 All Agent Dependencies:');
                agents.forEach(agentId => {
                    try {
                        const deps = resolver.resolveAgentDependencies(agentId, 'web');
                        const totalDeps = Object.values(deps.resources).reduce((sum, arr) => sum + arr.length, 0);
                        console.log(`   ${agentId}: ${totalDeps} total dependencies`);
                    } catch (error) {
                        console.log(`   ${agentId}: Error resolving dependencies`);
                    }
                });
            }
        } catch (error) {
            console.error('❌ Analysis failed:', error.message);
            process.exit(1);
        }
    });

// Validate configuration
program
    .command('validate')
    .description('Validate all configurations')
    .action(() => {
        try {
            const agents = resolver.getAvailableAgents();
            let errors = 0;
            
            console.log('🔍 Validating configurations...');
            
            agents.forEach(agentId => {
                try {
                    const deps = resolver.resolveAgentDependencies(agentId, 'web');
                    console.log(`   ✅ ${agentId}: Valid`);
                } catch (error) {
                    console.log(`   ❌ ${agentId}: ${error.message}`);
                    errors++;
                }
            });
            
            if (errors > 0) {
                console.log(`\n❌ Validation failed: ${errors} errors found`);
                process.exit(1);
            } else {
                console.log('\n✅ All configurations valid!');
            }
        } catch (error) {
            console.error('❌ Validation failed:', error.message);
            process.exit(1);
        }
    });

// Handle unknown commands
program.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}