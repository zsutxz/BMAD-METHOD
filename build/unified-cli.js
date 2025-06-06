#!/usr/bin/env node

/**
 * BMAD v5 Unified Build CLI
 * Works with unified agent configurations
 */

const { program } = require('commander');
const UnifiedWebBuilder = require('./builders/unified-web-builder');
const UnifiedDependencyResolver = require('./lib/unified-dependency-resolver');

// Initialize resolver
const resolver = new UnifiedDependencyResolver();

program
    .name('bmad-unified-build')
    .description('BMAD v5 Unified Build System')
    .version('5.0.0');

// Build all web outputs
program
    .command('build:web')
    .description('Build all web outputs from unified configurations')
    .action(async () => {
        try {
            const builder = new UnifiedWebBuilder();
            const results = await builder.buildAll();
            
            if (results.errors.length > 0) {
                console.log('\\n⚠️  Build completed with errors:');
                results.errors.forEach(error => {
                    console.log(`   ${error.type}: ${error.name} - ${error.error}`);
                });
                process.exit(1);
            } else {
                console.log('\\n🎉 All builds completed successfully!');
            }
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    });

// Build specific agent
program
    .command('build:agent')
    .description('Build a specific standalone agent')
    .requiredOption('-a, --agent <id>', 'Agent ID')
    .action(async (options) => {
        try {
            const builder = new UnifiedWebBuilder();
            const result = await builder.buildStandaloneAgent(options.agent);
            
            console.log(`✅ Built agent: ${result.name}`);
            console.log(`   File: ${result.outputs[0]}`);
            console.log(`   Size: ${result.size} characters`);
        } catch (error) {
            console.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    });

// List available agents
program
    .command('list:agents')
    .description('List all available agents from unified configs')
    .action(() => {
        try {
            const agents = resolver.getAvailableAgents();
            console.log('📋 Available agents:');
            
            agents.forEach(agentId => {
                try {
                    const config = resolver.loadUnifiedAgentConfig(agentId);
                    const webCompatible = config.environments.web?.available !== false;
                    const ideOnly = config.environments.ide?.ide_only === true;
                    const hasBmadKb = config.dependencies.data?.includes('bmad-kb');
                    
                    console.log(`   ${agentId}: ${config.agent.name} (${config.agent.title})`);
                    console.log(`      ${config.agent.description}`);
                    console.log(`      Environments: ${webCompatible ? 'web' : ''}${webCompatible && !ideOnly ? ', ' : ''}${!ideOnly ? 'ide' : 'ide-only'}`);
                    if (hasBmadKb) {
                        console.log(`      🔑 Has BMAD-KB access`);
                    }
                    console.log('');
                } catch (error) {
                    console.log(`   ${agentId}: Error loading config - ${error.message}`);
                }
            });
        } catch (error) {
            console.error('❌ Failed to list agents:', error.message);
            process.exit(1);
        }
    });

// Validate configurations
program
    .command('validate')
    .description('Validate all unified configurations')
    .action(() => {
        try {
            console.log('🔍 Validating unified configurations...');
            
            const results = resolver.validateAllConfigurations();
            
            console.log(`\\n📊 Validation Results:`);
            console.log(`   Valid: ${results.valid.length}`);
            console.log(`   Invalid: ${results.invalid.length}`);
            console.log(`   BMAD-KB Violations: ${results.bmadKbViolations.length}`);
            
            if (results.invalid.length > 0) {
                console.log('\\n❌ Invalid Configurations:');
                results.invalid.forEach(item => {
                    console.log(`   ${item.agentId}: ${item.error}`);
                });
            }
            
            if (results.bmadKbViolations.length > 0) {
                console.log('\\n🚨 CRITICAL: BMAD-KB Security Violations:');
                results.bmadKbViolations.forEach(agentId => {
                    console.log(`   ${agentId}: Has bmad-kb access but only BMAD should have it!`);
                });
            }
            
            if (results.invalid.length > 0 || results.bmadKbViolations.length > 0) {
                process.exit(1);
            } else {
                console.log('\\n✅ All configurations valid and secure!');
            }
        } catch (error) {
            console.error('❌ Validation failed:', error.message);
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
                console.log(`📊 Dependencies for ${deps.config.agent.name} (${deps.agentId}):`);
                Object.entries(deps.resources).forEach(([type, resources]) => {
                    if (resources.length > 0) {
                        console.log(`   ${type}: ${resources.map(r => r.id).join(', ')}`);
                    }
                });
                
                // Check for BMAD-KB access
                const hasBmadKb = deps.resources.data?.some(r => r.id === 'bmad-kb');
                if (hasBmadKb) {
                    console.log(`   🔑 Has BMAD-KB access: ${deps.agentId === 'bmad' ? 'AUTHORIZED' : '⚠️  VIOLATION!'}`);
                }
            } else if (options.graph) {
                const graph = resolver.generateDependencyGraph();
                console.log('📈 Dependency Graph:');
                console.log(`   Nodes: ${graph.nodes.length}`);
                console.log(`   Edges: ${graph.edges.length}`);
                console.log('\\n   Agents:');
                graph.nodes.filter(n => n.type === 'agent').forEach(n => {
                    const bmadKbIndicator = n.hasBmadKb ? ' 🔑' : '';
                    console.log(`     ${n.id}: ${n.label} (${n.title})${bmadKbIndicator}`);
                });
            } else {
                const agents = resolver.getAvailableAgents();
                console.log('📊 All Agent Dependencies:');
                agents.forEach(agentId => {
                    try {
                        const deps = resolver.resolveAgentDependencies(agentId, 'web');
                        const totalDeps = Object.values(deps.resources).reduce((sum, arr) => sum + arr.length, 0);
                        const hasBmadKb = deps.resources.data?.some(r => r.id === 'bmad-kb') ? ' 🔑' : '';
                        console.log(`   ${agentId}: ${totalDeps} total dependencies${hasBmadKb}`);
                    } catch (error) {
                        console.log(`   ${agentId}: Error resolving dependencies - ${error.message}`);
                    }
                });
            }
        } catch (error) {
            console.error('❌ Analysis failed:', error.message);
            process.exit(1);
        }
    });

// Handle unknown commands
program.on('command:*', () => {
    console.error('Invalid command: %s\\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}