const path = require('node:path');
const { BaseIdeSetup } = require('./_base-ide');
const chalk = require('chalk');

/**
 * Qwen Code setup handler
 * Creates concatenated QWEN.md file in .qwen/bmad-method/ (similar to Gemini)
 */
class QwenSetup extends BaseIdeSetup {
  constructor() {
    super('qwen', 'Qwen Code');
    this.configDir = '.qwen';
    this.bmadDir = 'bmad-method';
  }

  /**
   * Setup Qwen Code configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Create .qwen/bmad-method directory
    const qwenDir = path.join(projectDir, this.configDir);
    const bmadMethodDir = path.join(qwenDir, this.bmadDir);
    await this.ensureDir(bmadMethodDir);

    // Update existing settings.json if present
    await this.updateSettings(qwenDir);

    // Clean up old agents directory if exists
    await this.cleanupOldAgents(qwenDir);

    // Get agents
    const agents = await this.getAgents(bmadDir);

    // Create concatenated content for all agents
    let concatenatedContent = `# BMAD Method - Qwen Code Configuration

This file contains all BMAD agents configured for use with Qwen Code.
Agents can be activated by typing \`*{agent-name}\` in your prompts.

---

`;

    let agentCount = 0;
    for (const agent of agents) {
      const content = await this.readFile(agent.path);
      const agentSection = this.createAgentSection(agent, content, projectDir);

      concatenatedContent += agentSection;
      concatenatedContent += '\n\n---\n\n';
      agentCount++;

      console.log(chalk.green(`  ✓ Added agent: *${agent.name}`));
    }

    // Write QWEN.md
    const qwenMdPath = path.join(bmadMethodDir, 'QWEN.md');
    await this.writeFile(qwenMdPath, concatenatedContent);

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${agentCount} agents configured`));
    console.log(chalk.dim(`  - Configuration file: ${path.relative(projectDir, qwenMdPath)}`));
    console.log(chalk.dim(`  - Agents activated with: *{agent-name}`));

    return {
      success: true,
      agents: agentCount,
    };
  }

  /**
   * Update settings.json to remove old agent references
   */
  async updateSettings(qwenDir) {
    const fs = require('fs-extra');
    const settingsPath = path.join(qwenDir, 'settings.json');

    if (await fs.pathExists(settingsPath)) {
      try {
        const settingsContent = await fs.readFile(settingsPath, 'utf8');
        const settings = JSON.parse(settingsContent);
        let updated = false;

        // Remove agent file references from contextFileName
        if (settings.contextFileName && Array.isArray(settings.contextFileName)) {
          const originalLength = settings.contextFileName.length;
          settings.contextFileName = settings.contextFileName.filter((fileName) => !fileName.startsWith('agents/'));

          if (settings.contextFileName.length !== originalLength) {
            updated = true;
          }
        }

        if (updated) {
          await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
          console.log(chalk.green('  ✓ Updated .qwen/settings.json'));
        }
      } catch (error) {
        console.warn(chalk.yellow('  ⚠ Could not update settings.json:'), error.message);
      }
    }
  }

  /**
   * Clean up old agents directory
   */
  async cleanupOldAgents(qwenDir) {
    const fs = require('fs-extra');
    const agentsDir = path.join(qwenDir, 'agents');

    if (await fs.pathExists(agentsDir)) {
      await fs.remove(agentsDir);
      console.log(chalk.green('  ✓ Removed old agents directory'));
    }
  }

  /**
   * Create agent section for concatenated file
   */
  createAgentSection(agent, content, projectDir) {
    // Extract metadata
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : this.formatTitle(agent.name);

    // Extract YAML content
    const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
    const yamlContent = yamlMatch ? yamlMatch[1] : content;

    // Get relative path
    const relativePath = path.relative(projectDir, agent.path).replaceAll('\\', '/');

    let section = `# ${agent.name.toUpperCase()} Agent Rule

This rule is triggered when the user types \`*${agent.name}\` and activates the ${title} agent persona.

## Agent Activation

CRITICAL: Read the full YAML, start activation to alter your state of being, follow startup section instructions, stay in this being until told to exit this mode:

\`\`\`yaml
${yamlContent}
\`\`\`

## File Reference

The complete agent definition is available in [${relativePath}](${relativePath}).

## Usage

When the user types \`*${agent.name}\`, activate this ${title} persona and follow all instructions defined in the YAML configuration above.

## Module

Part of the BMAD ${agent.module.toUpperCase()} module.`;

    return section;
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
   * Cleanup Qwen configuration
   */
  async cleanup(projectDir) {
    const fs = require('fs-extra');
    const bmadMethodDir = path.join(projectDir, this.configDir, this.bmadDir);

    if (await fs.pathExists(bmadMethodDir)) {
      await fs.remove(bmadMethodDir);
      console.log(chalk.dim(`Removed BMAD configuration from Qwen Code`));
    }
  }
}

module.exports = { QwenSetup };
