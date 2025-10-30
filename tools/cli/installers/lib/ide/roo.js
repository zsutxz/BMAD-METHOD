const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');
const inquirer = require('inquirer');

/**
 * Roo IDE setup handler
 * Creates custom modes in .roomodes file
 */
class RooSetup extends BaseIdeSetup {
  constructor() {
    super('roo', 'Roo Code');
    this.configFile = '.roomodes';
    this.defaultPermissions = {
      dev: {
        description: 'Development files',
        fileRegex: String.raw`.*\.(js|jsx|ts|tsx|py|java|cpp|c|h|cs|go|rs|php|rb|swift)$`,
      },
      config: {
        description: 'Configuration files',
        fileRegex: String.raw`.*\.(json|yaml|yml|toml|xml|ini|env|config)$`,
      },
      docs: {
        description: 'Documentation files',
        fileRegex: String.raw`.*\.(md|mdx|rst|txt|doc|docx)$`,
      },
      styles: {
        description: 'Style and design files',
        fileRegex: String.raw`.*\.(css|scss|sass|less|stylus)$`,
      },
      all: {
        description: 'All files',
        fileRegex: '.*',
      },
    };
  }

  /**
   * Collect configuration choices before installation
   * @param {Object} options - Configuration options
   * @returns {Object} Collected configuration
   */
  async collectConfiguration(options = {}) {
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'permissions',
        message: 'Select default file edit permissions for BMAD agents:',
        choices: [
          { name: 'Development files only (js, ts, py, etc.)', value: 'dev' },
          { name: 'Configuration files only (json, yaml, xml, etc.)', value: 'config' },
          { name: 'Documentation files only (md, txt, doc, etc.)', value: 'docs' },
          { name: 'All files (unrestricted access)', value: 'all' },
          { name: 'Custom per agent (will be configured individually)', value: 'custom' },
        ],
        default: 'dev',
      },
    ]);

    return { permissions: response.permissions };
  }

  /**
   * Setup Roo IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Check for existing .roomodes file
    const roomodesPath = path.join(projectDir, this.configFile);
    let existingModes = [];
    let existingContent = '';

    if (await this.pathExists(roomodesPath)) {
      existingContent = await this.readFile(roomodesPath);
      // Parse existing modes to avoid duplicates
      const modeMatches = existingContent.matchAll(/- slug: ([\w-]+)/g);
      for (const match of modeMatches) {
        existingModes.push(match[1]);
      }
      console.log(chalk.yellow(`Found existing .roomodes file with ${existingModes.length} modes`));
    }

    // Get agents
    const agents = await this.getAgents(bmadDir);

    // Use pre-collected configuration if available
    const config = options.preCollectedConfig || {};
    let permissionChoice = config.permissions || options.permissions || 'dev';

    // Create modes content
    let newModesContent = '';
    let addedCount = 0;
    let skippedCount = 0;

    for (const agent of agents) {
      const slug = `bmad-${agent.module}-${agent.name}`;

      // Skip if already exists
      if (existingModes.includes(slug)) {
        console.log(chalk.dim(`  Skipping ${slug} - already exists`));
        skippedCount++;
        continue;
      }

      const content = await this.readFile(agent.path);
      const modeEntry = this.createModeEntry(agent, content, permissionChoice, projectDir);

      newModesContent += modeEntry;
      addedCount++;
      console.log(chalk.green(`  ✓ Added mode: ${slug}`));
    }

    // Build final content
    let finalContent = '';
    if (existingContent) {
      // Append to existing content
      finalContent = existingContent.trim() + '\n' + newModesContent;
    } else {
      // Create new .roomodes file
      finalContent = 'customModes:\n' + newModesContent;
    }

    // Write .roomodes file
    await this.writeFile(roomodesPath, finalContent);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${addedCount} modes added`));
    if (skippedCount > 0) {
      console.log(chalk.dim(`  - ${skippedCount} modes skipped (already exist)`));
    }
    console.log(chalk.dim(`  - Configuration file: ${this.configFile}`));
    console.log(chalk.dim(`  - Permission level: ${permissionChoice}`));
    console.log(chalk.dim('\n  Modes will be available when you open this project in Roo Code'));

    return {
      success: true,
      modes: addedCount,
      skipped: skippedCount,
    };
  }

  /**
   * Ask user about permission configuration
   */
  async askPermissions() {
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'permissions',
        message: 'Select default file edit permissions for BMAD agents:',
        choices: [
          { name: 'Development files only (js, ts, py, etc.)', value: 'dev' },
          { name: 'Configuration files only (json, yaml, xml, etc.)', value: 'config' },
          { name: 'Documentation files only (md, txt, doc, etc.)', value: 'docs' },
          { name: 'All files (unrestricted access)', value: 'all' },
          { name: 'Custom per agent (will be configured individually)', value: 'custom' },
        ],
        default: 'dev',
      },
    ]);

    return response.permissions;
  }

  /**
   * Create a mode entry for an agent
   */
  createModeEntry(agent, content, permissionChoice, projectDir) {
    // Extract metadata from agent content
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    const whenToUseMatch = content.match(/whenToUse="([^"]+)"/);
    const whenToUse = whenToUseMatch ? whenToUseMatch[1] : `Use for ${title} tasks`;

    const roleDefinitionMatch = content.match(/roleDefinition="([^"]+)"/);
    const roleDefinition = roleDefinitionMatch
      ? roleDefinitionMatch[1]
      : `You are a ${title} specializing in ${title.toLowerCase()} tasks and responsibilities.`;

    // Get relative path
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    // Determine permissions
    const permissions = this.getPermissionsForAgent(agent, permissionChoice);

    // Build mode entry
    const slug = `bmad-${agent.module}-${agent.name}`;
    let modeEntry = ` - slug: ${slug}\n`;
    modeEntry += `   name: '${icon} ${title}'\n`;

    if (permissions && permissions.description) {
      modeEntry += `   description: '${permissions.description}'\n`;
    }

    modeEntry += `   roleDefinition: ${roleDefinition}\n`;
    modeEntry += `   whenToUse: ${whenToUse}\n`;
    modeEntry += `   customInstructions: CRITICAL Read the full YAML from ${relativePath} start activation to alter your state of being follow startup section instructions stay in this being until told to exit this mode\n`;
    modeEntry += `   groups:\n`;
    modeEntry += `    - read\n`;

    if (permissions && permissions.fileRegex) {
      modeEntry += `    - - edit\n`;
      modeEntry += `      - fileRegex: ${permissions.fileRegex}\n`;
      modeEntry += `        description: ${permissions.description}\n`;
    } else {
      modeEntry += `    - edit\n`;
    }

    return modeEntry;
  }

  /**
   * Get permissions configuration for an agent
   */
  getPermissionsForAgent(agent, permissionChoice) {
    if (permissionChoice === 'custom') {
      // Custom logic based on agent name/module
      if (agent.name.includes('dev') || agent.name.includes('code')) {
        return this.defaultPermissions.dev;
      } else if (agent.name.includes('doc') || agent.name.includes('write')) {
        return this.defaultPermissions.docs;
      } else if (agent.name.includes('config') || agent.name.includes('setup')) {
        return this.defaultPermissions.config;
      } else if (agent.name.includes('style') || agent.name.includes('css')) {
        return this.defaultPermissions.styles;
      }
      // Default to all for custom agents
      return this.defaultPermissions.all;
    }

    return this.defaultPermissions[permissionChoice] || null;
  }

  /**
   * Format name as title
   */
  formatTitle(name) {
    return name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Cleanup Roo configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const roomodesPath = path.join(projectDir, this.configFile);

    if (await fs.pathExists(roomodesPath)) {
      const content = await fs.readFile(roomodesPath, 'utf8');

      // Remove BMAD modes only
      const lines = content.split('\n');
      const filteredLines = [];
      let skipMode = false;
      let removedCount = 0;

      for (const line of lines) {
        if (/^\s*- slug: bmad-/.test(line)) {
          skipMode = true;
          removedCount++;
        } else if (skipMode && /^\s*- slug: /.test(line)) {
          skipMode = false;
        }

        if (!skipMode) {
          filteredLines.push(line);
        }
      }

      // Write back filtered content
      await fs.writeFile(roomodesPath, filteredLines.join('\n'));
      console.log(chalk.dim(`Removed ${removedCount} BMAD modes from .roomodes`));
    }
  }
}

module.exports = { RooSetup };
