#!/usr/bin/env node

/**
 * BMad Method CLI - Direct execution wrapper for npx
 * This file ensures proper execution when run via npx from GitHub or npm registry
 * Supports version selection between stable (v4) and beta (v6)
 */

const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Check if we're running in an npx temporary directory
const isNpxExecution = __dirname.includes('_npx') || __dirname.includes('.npm');

async function promptVersionSelection() {
  const inquirer = require('inquirer');
  const chalk = require('chalk');

  console.log(
    chalk.cyan(`
    ██████╗ ███╗   ███╗ █████╗ ██████╗ ™
    ██╔══██╗████╗ ████║██╔══██╗██╔══██╗
    ██████╔╝██╔████╔██║███████║██║  ██║
    ██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║
    ██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝
    ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝
  `),
  );

  console.log(chalk.dim('    Build More, Architect Dreams\n'));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'version',
      message: 'Which version would you like to install?',
      choices: [
        {
          name: chalk.green('Stable (v4.x) - Production Ready'),
          value: 'stable',
          short: 'Stable v4.x',
        },
        {
          name: chalk.yellow('Beta (v6.0.0-beta) - Latest Features (Early Access)'),
          value: 'beta',
          short: 'Beta v6.0.0-beta',
        },
      ],
      default: 'stable',
    },
  ]);

  return answers.version;
}

async function installStableVersion(args) {
  const chalk = require('chalk');

  console.log(chalk.cyan('\n📦 Installing BMad Method v4 (Stable)...\n'));

  // Use npx to install the stable version from npm registry
  // The @4 tag will fetch the latest v4.x.x version
  const npxCommand = `npx bmad-method@4 ${args.join(' ')}`;

  try {
    execSync(npxCommand, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error(chalk.red('Failed to install stable version'));
    process.exit(error.status || 1);
  }
}

async function installBetaVersion(args) {
  const chalk = require('chalk');

  console.log(chalk.yellow('\n📦 Installing BMad Method v6 Beta (Early Access)...\n'));

  // Use the v6 installer from the current installation
  const bmadCliPath = path.join(__dirname, 'cli', 'bmad-cli.js');

  if (!fs.existsSync(bmadCliPath)) {
    console.error(chalk.red('Error: Could not find bmad-cli.js at'), bmadCliPath);
    console.error(chalk.dim('Current directory:'), __dirname);
    process.exit(1);
  }

  try {
    execSync(`node "${bmadCliPath}" ${args.join(' ')}`, {
      stdio: 'inherit',
      cwd: path.dirname(__dirname),
    });
  } catch (error) {
    process.exit(error.status || 1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Check if user wants to skip version prompt
  const skipPrompt = args.includes('--skip-version-prompt');
  const filteredArgs = args.filter((arg) => arg !== '--skip-version-prompt');

  if (isNpxExecution && !skipPrompt) {
    // Running via npx - prompt for version selection unless skipped
    const selectedVersion = await promptVersionSelection();

    if (selectedVersion === 'stable') {
      await installStableVersion(filteredArgs);
    } else {
      await installBetaVersion(filteredArgs);
    }
  } else {
    // Local execution or skipped prompt - use the v6 installer directly
    require('./cli/bmad-cli.js');
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
