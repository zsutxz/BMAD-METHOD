#!/usr/bin/env node

const { Command } = require('commander');
const WebBuilder = require('./builders/web-builder');
const path = require('path');

const program = new Command();

program
  .name('bmad-build')
  .description('BMAD-METHOD build tool for creating web bundles')
  .version('4.0.0');

program
  .command('build')
  .description('Build web bundles for agents and teams')
  .option('-a, --agents-only', 'Build only agent bundles')
  .option('-t, --teams-only', 'Build only team bundles')
  .option('--no-clean', 'Skip cleaning output directories')
  .action(async (options) => {
    const builder = new WebBuilder({
      rootDir: process.cwd()
    });

    try {
      if (options.clean) {
        console.log('Cleaning output directories...');
        await builder.cleanOutputDirs();
      }

      if (!options.teamsOnly) {
        console.log('Building agent bundles...');
        await builder.buildAgents();
      }

      if (!options.agentsOnly) {
        console.log('Building team bundles...');
        await builder.buildTeams();
      }

      console.log('Build completed successfully!');
    } catch (error) {
      console.error('Build failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('list:agents')
  .description('List all available agents')
  .action(async () => {
    const builder = new WebBuilder({ rootDir: process.cwd() });
    const agents = await builder.resolver.listAgents();
    console.log('Available agents:');
    agents.forEach(agent => console.log(`  - ${agent}`));
  });

program
  .command('validate')
  .description('Validate agent and team configurations')
  .action(async () => {
    const builder = new WebBuilder({ rootDir: process.cwd() });
    try {
      // Validate by attempting to build all agents and teams
      const agents = await builder.resolver.listAgents();
      const teams = await builder.resolver.listTeams();
      
      console.log('Validating agents...');
      for (const agent of agents) {
        await builder.resolver.resolveAgentDependencies(agent);
        console.log(`  ✓ ${agent}`);
      }
      
      console.log('\nValidating teams...');
      for (const team of teams) {
        await builder.resolver.resolveTeamDependencies(team);
        console.log(`  ✓ ${team}`);
      }
      
      console.log('\nAll configurations are valid!');
    } catch (error) {
      console.error('Validation failed:', error.message);
      process.exit(1);
    }
  });

program.parse();