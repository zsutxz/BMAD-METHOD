const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * KiloCode IDE setup handler
 * Creates custom modes in .kilocodemodes file (similar to Roo)
 */
class KiloSetup extends BaseIdeSetup {
  constructor() {
    super('kilo', 'Kilo Code');
    this.configFile = '.kilocodemodes';
  }

  /**
   * Setup KiloCode IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Check for existing .kilocodemodes file
    const kiloModesPath = path.join(projectDir, this.configFile);
    let existingModes = [];
    let existingContent = '';

    if (await this.pathExists(kiloModesPath)) {
      existingContent = await this.readFile(kiloModesPath);
      // Parse existing modes
      const modeMatches = existingContent.matchAll(/- slug: ([\w-]+)/g);
      for (const match of modeMatches) {
        existingModes.push(match[1]);
      }
      console.log(chalk.yellow(`Found existing .kilocodemodes file with ${existingModes.length} modes`));
    }

    // Get agents
    const agents = await this.getAgents(bmadDir);

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
      const modeEntry = this.createModeEntry(agent, content, projectDir);

      newModesContent += modeEntry;
      addedCount++;
    }

    // Build final content
    let finalContent = '';
    if (existingContent) {
      finalContent = existingContent.trim() + '\n' + newModesContent;
    } else {
      finalContent = 'customModes:\n' + newModesContent;
    }

    // Write .kilocodemodes file
    await this.writeFile(kiloModesPath, finalContent);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${addedCount} modes added`));
    if (skippedCount > 0) {
      console.log(chalk.dim(`  - ${skippedCount} modes skipped (already exist)`));
    }
    console.log(chalk.dim(`  - Configuration file: ${this.configFile}`));
    console.log(chalk.dim('\n  Modes will be available when you open this project in KiloCode'));

    return {
      success: true,
      modes: addedCount,
      skipped: skippedCount,
    };
  }

  /**
   * Create a mode entry for an agent
   */
  createModeEntry(agent, content, projectDir) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    const iconMatch = content.match(/icon="([^"]+)"/);
    const icon = iconMatch ? iconMatch[1] : '🤖';

    const whenToUseMatch = content.match(/whenToUse="([^"]+)"/);
    const whenToUse = whenToUseMatch ? whenToUseMatch[1] : `Use for ${title} tasks`;

    const roleDefinitionMatch = content.match(/roleDefinition="([^"]+)"/);
    const roleDefinition = roleDefinitionMatch
      ? roleDefinitionMatch[1]
      : `You are a ${title} specializing in ${title.toLowerCase()} tasks.`;

    // Get relative path
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    // Build mode entry (KiloCode uses same schema as Roo)
    const slug = `bmad-${agent.module}-${agent.name}`;
    let modeEntry = ` - slug: ${slug}\n`;
    modeEntry += `   name: '${icon} ${title}'\n`;
    modeEntry += `   roleDefinition: ${roleDefinition}\n`;
    modeEntry += `   whenToUse: ${whenToUse}\n`;
    modeEntry += `   customInstructions: CRITICAL Read the full YAML from ${relativePath} start activation to alter your state of being follow startup section instructions stay in this being until told to exit this mode\n`;
    modeEntry += `   groups:\n`;
    modeEntry += `    - read\n`;
    modeEntry += `    - edit\n`;

    return modeEntry;
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
   * Cleanup KiloCode configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const kiloModesPath = path.join(projectDir, this.configFile);

    if (await fs.pathExists(kiloModesPath)) {
      const content = await fs.readFile(kiloModesPath, 'utf8');

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

      await fs.writeFile(kiloModesPath, filteredLines.join('\n'));
      console.log(chalk.dim(`Removed ${removedCount} BMAD modes from .kilocodemodes`));
    }
  }
}

module.exports = { KiloSetup };
