#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

// Handle both execution contexts (from root via npx or from installer directory)
let version;
let installer;
try {
  // Try installer context first (when run from tools/installer/)
  version = require('../package.json').version;
  installer = require('../lib/installer');
} catch (e) {
  // Fall back to root context (when run via npx from GitHub)
  console.log(chalk.yellow(`Installer context not found (${e.message}), trying root context...`));
  try {
    version = require('../../../package.json').version;
    installer = require('../../../tools/installer/lib/installer');
  } catch (e2) {
    console.error(chalk.red('Error: Could not load required modules. Please ensure you are running from the correct directory.'));
    console.error(chalk.yellow('Debug info:'), {
      __dirname,
      cwd: process.cwd(),
      error: e2.message
    });
    process.exit(1);
  }
}

program
  .version(version)
  .description('BMAD Method installer - AI-powered Agile development framework');

program
  .command('install')
  .description('Install BMAD Method agents and tools')
  .option('-f, --full', 'Install complete .bmad-core folder')
  .option('-a, --agent <agent>', 'Install specific agent with dependencies')
  .option('-d, --directory <path>', 'Installation directory (default: .bmad-core)')
  .option('-i, --ide <ide>', 'Configure for specific IDE (cursor, claude-code, windsurf, roo)')
  .action(async (options) => {
    try {
      if (!options.full && !options.agent) {
        // Interactive mode
        const answers = await promptInstallation();
        await installer.install(answers);
      } else {
        // Direct mode
        const config = {
          installType: options.full ? 'full' : 'single-agent',
          agent: options.agent,
          directory: options.directory || '.bmad-core',
          ide: options.ide
        };
        await installer.install(config);
      }
    } catch (error) {
      console.error(chalk.red('Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update existing BMAD installation')
  .option('--force', 'Force update, overwriting modified files')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(async () => {
    try {
      await installer.update();
    } catch (error) {
      console.error(chalk.red('Update failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available agents')
  .action(async () => {
    try {
      await installer.listAgents();
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show installation status')
  .action(async () => {
    try {
      await installer.showStatus();
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

async function promptInstallation() {
  console.log(chalk.bold.blue(`\nWelcome to BMAD Method Installer v${version}\n`));

  const answers = {};

  // Ask for installation directory
  const { directory } = await inquirer.prompt([
    {
      type: 'input',
      name: 'directory',
      message: 'Where would you like to install BMAD?',
      default: '.bmad-core'
    }
  ]);
  answers.directory = directory;

  // Ask for installation type
  const { installType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'installType',
      message: 'How would you like to install BMAD?',
      choices: [
        {
          name: 'Complete installation (recommended) - All agents and tools',
          value: 'full'
        },
        {
          name: 'Single agent - Choose one agent to install',
          value: 'single-agent'
        }
      ]
    }
  ]);
  answers.installType = installType;

  // If single agent, ask which one
  if (installType === 'single-agent') {
    const agents = await installer.getAvailableAgents();
    const { agent } = await inquirer.prompt([
      {
        type: 'list',
        name: 'agent',
        message: 'Select an agent to install:',
        choices: agents.map(a => ({
          name: `${a.id} - ${a.name} (${a.description})`,
          value: a.id
        }))
      }
    ]);
    answers.agent = agent;
  }

  // Ask for IDE configuration
  const { ide } = await inquirer.prompt([
    {
      type: 'list',
      name: 'ide',
      message: 'Which IDE are you using?',
      choices: [
        { name: 'Cursor', value: 'cursor' },
        { name: 'Claude Code', value: 'claude-code' },
        { name: 'Windsurf', value: 'windsurf' },
        { name: 'Roo Code', value: 'roo' },
        { name: 'Other/Manual setup', value: null }
      ]
    }
  ]);
  answers.ide = ide;

  return answers;
}

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}