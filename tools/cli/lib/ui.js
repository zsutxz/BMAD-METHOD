const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const { CLIUtils } = require('./cli-utils');

/**
 * UI utilities for the installer
 */
class UI {
  constructor() {}

  /**
   * Prompt for installation configuration
   * @returns {Object} Installation configuration
   */
  async promptInstall() {
    CLIUtils.displayLogo();
    CLIUtils.displaySection('BMAD™ Setup', 'Build More, Architect Dreams');

    const confirmedDirectory = await this.getConfirmedDirectory();

    // Check if there's an existing BMAD installation
    const fs = require('fs-extra');
    const path = require('node:path');
    const bmadDir = path.join(confirmedDirectory, 'bmad');
    const hasExistingInstall = await fs.pathExists(bmadDir);

    // Track action type (only set if there's an existing installation)
    let actionType;

    // Only show action menu if there's an existing installation
    if (hasExistingInstall) {
      const promptResult = await inquirer.prompt([
        {
          type: 'list',
          name: 'actionType',
          message: 'What would you like to do?',
          choices: [
            { name: 'Quick Update (Settings Preserved)', value: 'quick-update' },
            { name: 'Modify BMAD Installation (Confirm or change each setting)', value: 'update' },
            { name: 'Remove BMad Folder and Reinstall (Full clean install - BMad Customization Will Be Lost)', value: 'reinstall' },
            { name: 'Compile Agents (Quick rebuild of all agent .md files)', value: 'compile' },
            { name: 'Cancel', value: 'cancel' },
          ],
          default: 'quick-update',
        },
      ]);

      // Extract actionType from prompt result
      actionType = promptResult.actionType;

      // Handle quick update separately
      if (actionType === 'quick-update') {
        return {
          actionType: 'quick-update',
          directory: confirmedDirectory,
        };
      }

      // Handle agent compilation separately
      if (actionType === 'compile') {
        return {
          actionType: 'compile',
          directory: confirmedDirectory,
        };
      }

      // Handle cancel
      if (actionType === 'cancel') {
        return {
          actionType: 'cancel',
          directory: confirmedDirectory,
        };
      }

      // Handle reinstall - DON'T return early, let it flow through configuration collection
      // The installer will handle deletion when it sees actionType === 'reinstall'
      // For now, just note that we're in reinstall mode and continue below

      // If actionType === 'update' or 'reinstall', continue with normal flow below
    }

    // Collect IDE tool selection EARLY (before module configuration)
    // This allows users to make all decisions upfront before file copying begins
    const toolSelection = await this.promptToolSelection(confirmedDirectory, []);

    const { installedModuleIds } = await this.getExistingInstallation(confirmedDirectory);
    const coreConfig = await this.collectCoreConfig(confirmedDirectory);
    const moduleChoices = await this.getModuleChoices(installedModuleIds);
    const selectedModules = await this.selectModules(moduleChoices);

    console.clear();
    CLIUtils.displayLogo();
    CLIUtils.displayModuleComplete('core', false); // false = don't clear the screen again

    return {
      actionType: actionType || 'update', // Preserve reinstall or update action
      directory: confirmedDirectory,
      installCore: true, // Always install core
      modules: selectedModules,
      // IDE selection collected early, will be configured later
      ides: toolSelection.ides,
      skipIde: toolSelection.skipIde,
      coreConfig: coreConfig, // Pass collected core config to installer
    };
  }

  /**
   * Prompt for tool/IDE selection (called after module configuration)
   * @param {string} projectDir - Project directory to check for existing IDEs
   * @param {Array} selectedModules - Selected modules from configuration
   * @returns {Object} Tool configuration
   */
  async promptToolSelection(projectDir, selectedModules) {
    // Check for existing configured IDEs
    const { Detector } = require('../installers/lib/core/detector');
    const detector = new Detector();
    const bmadDir = path.join(projectDir || process.cwd(), 'bmad');
    const existingInstall = await detector.detect(bmadDir);
    const configuredIdes = existingInstall.ides || [];

    // Get IDE manager to fetch available IDEs dynamically
    const { IdeManager } = require('../installers/lib/ide/manager');
    const ideManager = new IdeManager();

    const preferredIdes = ideManager.getPreferredIdes();
    const otherIdes = ideManager.getOtherIdes();

    // Build IDE choices array with separators
    const ideChoices = [];
    const processedIdes = new Set();

    // First, add previously configured IDEs at the top, marked with ✅
    if (configuredIdes.length > 0) {
      ideChoices.push(new inquirer.Separator('── Previously Configured ──'));
      for (const ideValue of configuredIdes) {
        // Skip empty or invalid IDE values
        if (!ideValue || typeof ideValue !== 'string') {
          continue;
        }

        // Find the IDE in either preferred or other lists
        const preferredIde = preferredIdes.find((ide) => ide.value === ideValue);
        const otherIde = otherIdes.find((ide) => ide.value === ideValue);
        const ide = preferredIde || otherIde;

        if (ide) {
          ideChoices.push({
            name: `${ide.name} ✅`,
            value: ide.value,
            checked: true, // Previously configured IDEs are checked by default
          });
          processedIdes.add(ide.value);
        } else {
          // Warn about unrecognized IDE (but don't fail)
          console.log(chalk.yellow(`⚠️  Previously configured IDE '${ideValue}' is no longer available`));
        }
      }
    }

    // Add preferred tools (excluding already processed)
    const remainingPreferred = preferredIdes.filter((ide) => !processedIdes.has(ide.value));
    if (remainingPreferred.length > 0) {
      ideChoices.push(new inquirer.Separator('── Recommended Tools ──'));
      for (const ide of remainingPreferred) {
        ideChoices.push({
          name: `${ide.name} ⭐`,
          value: ide.value,
          checked: false,
        });
        processedIdes.add(ide.value);
      }
    }

    // Add other tools (excluding already processed)
    const remainingOther = otherIdes.filter((ide) => !processedIdes.has(ide.value));
    if (remainingOther.length > 0) {
      ideChoices.push(new inquirer.Separator('── Additional Tools ──'));
      for (const ide of remainingOther) {
        ideChoices.push({
          name: ide.name,
          value: ide.value,
          checked: false,
        });
      }
    }

    CLIUtils.displaySection('Tool Integration', 'Select AI coding assistants and IDEs to configure');

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'ides',
        message: 'Select tools to configure:',
        choices: ideChoices,
        pageSize: 15,
      },
    ]);

    return {
      ides: answers.ides || [],
      skipIde: !answers.ides || answers.ides.length === 0,
    };
  }

  /**
   * Prompt for update configuration
   * @returns {Object} Update configuration
   */
  async promptUpdate() {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'backupFirst',
        message: 'Create backup before updating?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'preserveCustomizations',
        message: 'Preserve local customizations?',
        default: true,
      },
    ]);

    return answers;
  }

  /**
   * Prompt for module selection
   * @param {Array} modules - Available modules
   * @returns {Array} Selected modules
   */
  async promptModules(modules) {
    const choices = modules.map((mod) => ({
      name: `${mod.name} - ${mod.description}`,
      value: mod.id,
      checked: false,
    }));

    const { selectedModules } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedModules',
        message: 'Select modules to add:',
        choices,
        validate: (answer) => {
          if (answer.length === 0) {
            return 'You must choose at least one module.';
          }
          return true;
        },
      },
    ]);

    return selectedModules;
  }

  /**
   * Confirm action
   * @param {string} message - Confirmation message
   * @param {boolean} defaultValue - Default value
   * @returns {boolean} User confirmation
   */
  async confirm(message, defaultValue = false) {
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message,
        default: defaultValue,
      },
    ]);

    return confirmed;
  }

  /**
   * Display installation summary
   * @param {Object} result - Installation result
   */
  showInstallSummary(result) {
    CLIUtils.displaySection('Installation Complete', 'BMAD™ has been successfully installed');

    const summary = [
      `📁 Installation Path: ${result.path}`,
      `📦 Modules Installed: ${result.modules?.length > 0 ? result.modules.join(', ') : 'core only'}`,
      `🔧 Tools Configured: ${result.ides?.length > 0 ? result.ides.join(', ') : 'none'}`,
    ];

    CLIUtils.displayBox(summary.join('\n\n'), {
      borderColor: 'green',
      borderStyle: 'round',
    });

    console.log('\n' + chalk.green.bold('✨ BMAD is ready to use!'));
  }

  /**
   * Get confirmed directory from user
   * @returns {string} Confirmed directory path
   */
  async getConfirmedDirectory() {
    let confirmedDirectory = null;
    while (!confirmedDirectory) {
      const directoryAnswer = await this.promptForDirectory();
      await this.displayDirectoryInfo(directoryAnswer.directory);

      if (await this.confirmDirectory(directoryAnswer.directory)) {
        confirmedDirectory = directoryAnswer.directory;
      }
    }
    return confirmedDirectory;
  }

  /**
   * Get existing installation info and installed modules
   * @param {string} directory - Installation directory
   * @returns {Object} Object with existingInstall and installedModuleIds
   */
  async getExistingInstallation(directory) {
    const { Detector } = require('../installers/lib/core/detector');
    const detector = new Detector();
    const bmadDir = path.join(directory, 'bmad');
    const existingInstall = await detector.detect(bmadDir);
    const installedModuleIds = new Set(existingInstall.modules.map((mod) => mod.id));

    return { existingInstall, installedModuleIds };
  }

  /**
   * Collect core configuration
   * @param {string} directory - Installation directory
   * @returns {Object} Core configuration
   */
  async collectCoreConfig(directory) {
    const { ConfigCollector } = require('../installers/lib/core/config-collector');
    const configCollector = new ConfigCollector();
    // Load existing configs first if they exist
    await configCollector.loadExistingConfig(directory);
    // Now collect with existing values as defaults (false = don't skip loading, true = skip completion message)
    await configCollector.collectModuleConfig('core', directory, false, true);

    return configCollector.collectedConfig.core;
  }

  /**
   * Get module choices for selection
   * @param {Set} installedModuleIds - Currently installed module IDs
   * @returns {Array} Module choices for inquirer
   */
  async getModuleChoices(installedModuleIds) {
    const { ModuleManager } = require('../installers/lib/modules/manager');
    const moduleManager = new ModuleManager();
    const availableModules = await moduleManager.listAvailable();

    const isNewInstallation = installedModuleIds.size === 0;
    return availableModules.map((mod) => ({
      name: mod.name,
      value: mod.id,
      checked: isNewInstallation ? mod.defaultSelected || false : installedModuleIds.has(mod.id),
    }));
  }

  /**
   * Prompt for module selection
   * @param {Array} moduleChoices - Available module choices
   * @returns {Array} Selected module IDs
   */
  async selectModules(moduleChoices) {
    CLIUtils.displaySection('Module Selection', 'Choose the BMAD modules to install');

    const moduleAnswer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'modules',
        message: 'Select modules to install:',
        choices: moduleChoices,
      },
    ]);

    return moduleAnswer.modules || [];
  }

  /**
   * Prompt for directory selection
   * @returns {Object} Directory answer from inquirer
   */
  async promptForDirectory() {
    return await inquirer.prompt([
      {
        type: 'input',
        name: 'directory',
        message: `Installation directory:`,
        default: process.cwd(),
        validate: async (input) => this.validateDirectory(input),
        filter: (input) => {
          // If empty, use the default
          if (!input || input.trim() === '') {
            return process.cwd();
          }
          return this.expandUserPath(input);
        },
      },
    ]);
  }

  /**
   * Display directory information
   * @param {string} directory - The directory path
   */
  async displayDirectoryInfo(directory) {
    console.log(chalk.cyan('\nResolved installation path:'), chalk.bold(directory));

    const dirExists = await fs.pathExists(directory);
    if (dirExists) {
      // Show helpful context about the existing path
      const stats = await fs.stat(directory);
      if (stats.isDirectory()) {
        const files = await fs.readdir(directory);
        if (files.length > 0) {
          console.log(
            chalk.gray(`Directory exists and contains ${files.length} item(s)`) +
              (files.includes('bmad') ? chalk.yellow(' including existing bmad installation') : ''),
          );
        } else {
          console.log(chalk.gray('Directory exists and is empty'));
        }
      }
    } else {
      const existingParent = await this.findExistingParent(directory);
      console.log(chalk.gray(`Will create in: ${existingParent}`));
    }
  }

  /**
   * Confirm directory selection
   * @param {string} directory - The directory path
   * @returns {boolean} Whether user confirmed
   */
  async confirmDirectory(directory) {
    const dirExists = await fs.pathExists(directory);

    if (dirExists) {
      const confirmAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: `Install to this directory?`,
          default: true,
        },
      ]);

      if (!confirmAnswer.proceed) {
        console.log(chalk.yellow("\nLet's try again with a different path.\n"));
      }

      return confirmAnswer.proceed;
    } else {
      // Ask for confirmation to create the directory
      const createConfirm = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'create',
          message: `The directory '${directory}' doesn't exist. Would you like to create it?`,
          default: false,
        },
      ]);

      if (!createConfirm.create) {
        console.log(chalk.yellow("\nLet's try again with a different path.\n"));
      }

      return createConfirm.create;
    }
  }

  /**
   * Validate directory path for installation
   * @param {string} input - User input path
   * @returns {string|true} Error message or true if valid
   */
  async validateDirectory(input) {
    // Allow empty input to use the default
    if (!input || input.trim() === '') {
      return true; // Empty means use default
    }

    let expandedPath;
    try {
      expandedPath = this.expandUserPath(input.trim());
    } catch (error) {
      return error.message;
    }

    // Check if the path exists
    const pathExists = await fs.pathExists(expandedPath);

    if (!pathExists) {
      // Find the first existing parent directory
      const existingParent = await this.findExistingParent(expandedPath);

      if (!existingParent) {
        return 'Cannot create directory: no existing parent directory found';
      }

      // Check if the existing parent is writable
      try {
        await fs.access(existingParent, fs.constants.W_OK);
        // Path doesn't exist but can be created - will prompt for confirmation later
        return true;
      } catch {
        // Provide a detailed error message explaining both issues
        return `Directory '${expandedPath}' does not exist and cannot be created: parent directory '${existingParent}' is not writable`;
      }
    }

    // If it exists, validate it's a directory and writable
    const stat = await fs.stat(expandedPath);
    if (!stat.isDirectory()) {
      return `Path exists but is not a directory: ${expandedPath}`;
    }

    // Check write permissions
    try {
      await fs.access(expandedPath, fs.constants.W_OK);
    } catch {
      return `Directory is not writable: ${expandedPath}`;
    }

    return true;
  }

  /**
   * Find the first existing parent directory
   * @param {string} targetPath - The path to check
   * @returns {string|null} The first existing parent directory, or null if none found
   */
  async findExistingParent(targetPath) {
    let currentPath = path.resolve(targetPath);

    // Walk up the directory tree until we find an existing directory
    while (currentPath !== path.dirname(currentPath)) {
      // Stop at root
      const parent = path.dirname(currentPath);
      if (await fs.pathExists(parent)) {
        return parent;
      }
      currentPath = parent;
    }

    return null; // No existing parent found (shouldn't happen in practice)
  }

  /**
   * Expands the user-provided path: handles ~ and resolves to absolute.
   * @param {string} inputPath - User input path.
   * @returns {string} Absolute expanded path.
   */
  expandUserPath(inputPath) {
    if (typeof inputPath !== 'string') {
      throw new TypeError('Path must be a string.');
    }

    let expanded = inputPath.trim();

    // Handle tilde expansion
    if (expanded.startsWith('~')) {
      if (expanded === '~') {
        expanded = os.homedir();
      } else if (expanded.startsWith('~' + path.sep)) {
        const pathAfterHome = expanded.slice(2); // Remove ~/ or ~\
        expanded = path.join(os.homedir(), pathAfterHome);
      } else {
        const restOfPath = expanded.slice(1);
        const separatorIndex = restOfPath.indexOf(path.sep);
        const username = separatorIndex === -1 ? restOfPath : restOfPath.slice(0, separatorIndex);
        if (username) {
          throw new Error(`Path expansion for ~${username} is not supported. Please use an absolute path or ~${path.sep}`);
        }
      }
    }

    // Resolve to the absolute path relative to the current working directory
    return path.resolve(expanded);
  }
}

module.exports = { UI };
