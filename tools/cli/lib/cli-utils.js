const chalk = require('chalk');
const boxen = require('boxen');
const wrapAnsi = require('wrap-ansi');
const figlet = require('figlet');

const CLIUtils = {
  /**
   * Display BMAD logo
   */
  displayLogo() {
    console.clear();

    // ASCII art logo
    const logo = `
    ██████╗ ███╗   ███╗ █████╗ ██████╗ ™
    ██╔══██╗████╗ ████║██╔══██╗██╔══██╗
    ██████╔╝██╔████╔██║███████║██║  ██║
    ██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║
    ██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝
    ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝`;

    console.log(chalk.cyan(logo));
    console.log(chalk.dim('    Build More, Architect Dreams\n'));
  },

  /**
   * Display section header
   * @param {string} title - Section title
   * @param {string} subtitle - Optional subtitle
   */
  displaySection(title, subtitle = null) {
    console.log('\n' + chalk.cyan('═'.repeat(80)));
    console.log(chalk.cyan.bold(` ${title}`));
    if (subtitle) {
      console.log(chalk.dim(` ${subtitle}`));
    }
    console.log(chalk.cyan('═'.repeat(80)) + '\n');
  },

  /**
   * Display info box
   * @param {string|Array} content - Content to display
   * @param {Object} options - Box options
   */
  displayBox(content, options = {}) {
    const defaultOptions = {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      ...options,
    };

    // Handle array content
    let text = content;
    if (Array.isArray(content)) {
      text = content.join('\n\n');
    }

    // Wrap text to prevent overflow
    const wrapped = wrapAnsi(text, 76, { hard: true, wordWrap: true });

    console.log(boxen(wrapped, defaultOptions));
  },

  /**
   * Display prompt section
   * @param {string|Array} prompts - Prompts to display
   */
  displayPromptSection(prompts) {
    const promptArray = Array.isArray(prompts) ? prompts : [prompts];

    const formattedPrompts = promptArray.map((p) => wrapAnsi(p, 76, { hard: true, wordWrap: true }));

    this.displayBox(formattedPrompts, {
      borderColor: 'yellow',
      borderStyle: 'double',
    });
  },

  /**
   * Display step indicator
   * @param {number} current - Current step
   * @param {number} total - Total steps
   * @param {string} description - Step description
   */
  displayStep(current, total, description) {
    const progress = `[${current}/${total}]`;
    console.log('\n' + chalk.cyan(progress) + ' ' + chalk.bold(description));
    console.log(chalk.dim('─'.repeat(80 - progress.length - 1)) + '\n');
  },

  /**
   * Display completion message
   * @param {string} message - Completion message
   */
  displayComplete(message) {
    console.log(
      '\n' +
        boxen(chalk.green('✨ ' + message), {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green',
        }),
    );
  },

  /**
   * Display error message
   * @param {string} message - Error message
   */
  displayError(message) {
    console.log(
      '\n' +
        boxen(chalk.red('✗ ' + message), {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'red',
        }),
    );
  },

  /**
   * Format list for display
   * @param {Array} items - Items to display
   * @param {string} prefix - Item prefix
   */
  formatList(items, prefix = '•') {
    return items.map((item) => `  ${prefix} ${item}`).join('\n');
  },

  /**
   * Clear previous lines
   * @param {number} lines - Number of lines to clear
   */
  clearLines(lines) {
    for (let i = 0; i < lines; i++) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(1);
    }
  },

  /**
   * Display table
   * @param {Array} data - Table data
   * @param {Object} options - Table options
   */
  displayTable(data, options = {}) {
    const Table = require('cli-table3');
    const table = new Table({
      style: {
        head: ['cyan'],
        border: ['dim'],
      },
      ...options,
    });

    for (const row of data) table.push(row);
    console.log(table.toString());
  },

  /**
   * Display module completion message
   * @param {string} moduleName - Name of the completed module
   * @param {boolean} clearScreen - Whether to clear the screen first
   */
  displayModuleComplete(moduleName, clearScreen = true) {
    if (clearScreen) {
      console.clear();
      this.displayLogo();
    }

    let message;

    // Special messages for specific modules
    if (moduleName.toLowerCase() === 'bmm') {
      message = `Thank you for configuring the BMAD™ Method Module (BMM)!

Your responses have been saved and will be used to configure your installation.`;
    } else if (moduleName.toLowerCase() === 'cis') {
      message = `Thank you for choosing the BMAD™ Creative Innovation Suite, an early beta
release with much more planned!

With this BMAD™ Creative Innovation Suite Configuration, remember that all
paths are relative to project root, with no leading slash.`;
    } else if (moduleName.toLowerCase() === 'core') {
      message = `Thank you for choosing the BMAD™ Method, your gateway to dreaming, planning
and building with real world proven techniques.

All paths are relative to project root, with no leading slash.`;
    } else {
      message = `Thank you for configuring the BMAD™ ${moduleName.toUpperCase()} module!

Your responses have been saved and will be used to configure your installation.`;
    }

    this.displayBox(message, {
      borderColor: 'yellow',
      borderStyle: 'double',
      padding: 1,
      margin: 1,
    });
  },
};

module.exports = { CLIUtils };
