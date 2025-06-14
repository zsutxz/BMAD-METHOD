#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * YAML Formatter and Linter for BMAD-METHOD
 * Formats and validates YAML files and YAML embedded in Markdown
 */

function formatYamlContent(content, filename) {
  try {
    // First try to fix common YAML issues
    let fixedContent = content
      // Fix "commands :" -> "commands:"
      .replace(/^(\s*)(\w+)\s+:/gm, '$1$2:')
      // Fix inconsistent list indentation
      .replace(/^(\s*)-\s{3,}/gm, '$1- ');
    
    // Skip auto-fixing for .roomodes files - they have special nested structure
    if (!filename.includes('.roomodes')) {
      fixedContent = fixedContent
        // Fix unquoted list items that contain special characters or multiple parts
        .replace(/^(\s*)-\s+(.*)$/gm, (match, indent, content) => {
          // Skip if already quoted
          if (content.startsWith('"') && content.endsWith('"')) {
            return match;
          }
          // If the content contains special YAML characters or looks complex, quote it
          // BUT skip if it looks like a proper YAML key-value pair (like "key: value")
          if ((content.includes(':') || content.includes('-') || content.includes('{') || content.includes('}')) && 
              !content.match(/^\w+:\s/)) {
            // Remove any existing quotes first, escape internal quotes, then add proper quotes
            const cleanContent = content.replace(/^["']|["']$/g, '').replace(/"/g, '\\"');
            return `${indent}- "${cleanContent}"`;
          }
          return match;
        });
    }
    
    // Debug: show what we're trying to parse
    if (fixedContent !== content) {
      console.log(chalk.blue(`🔧 Applied YAML fixes to ${filename}`));
    }
    
    // Parse and re-dump YAML to format it
    const parsed = yaml.load(fixedContent);
    const formatted = yaml.dump(parsed, {
      indent: 2,
      lineWidth: -1, // Disable line wrapping
      noRefs: true,
      sortKeys: false // Preserve key order
    });
    return formatted;
  } catch (error) {
    console.error(chalk.red(`❌ YAML syntax error in ${filename}:`), error.message);
    console.error(chalk.yellow(`💡 Try manually fixing the YAML structure first`));
    return null;
  }
}

function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;

  // Fix untyped code blocks by adding 'text' type
  // Match ``` at start of line followed by newline, but only if it's an opening fence
  newContent = newContent.replace(/^```\n([\s\S]*?)\n```$/gm, '```text\n$1\n```');
  if (newContent !== content) {
    modified = true;
    console.log(chalk.blue(`🔧 Added 'text' type to untyped code blocks in ${filePath}`));
  }

  // Find YAML code blocks
  const yamlBlockRegex = /```ya?ml\n([\s\S]*?)\n```/g;
  
  newContent = newContent.replace(yamlBlockRegex, (match, yamlContent) => {
    const formatted = formatYamlContent(yamlContent, filePath);
    if (formatted === null) {
      return match; // Keep original if parsing failed
    }
    
    // Remove trailing newline that js-yaml adds
    const trimmedFormatted = formatted.replace(/\n$/, '');
    
    if (trimmedFormatted !== yamlContent) {
      modified = true;
    }
    
    return `\`\`\`yml\n${trimmedFormatted}\n\`\`\``;
  });

  if (modified) {
    fs.writeFileSync(filePath, newContent);
    return true;
  }
  return false;
}

function processYamlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const formatted = formatYamlContent(content, filePath);
  
  if (formatted === null) {
    return false; // Syntax error
  }
  
  if (formatted !== content) {
    fs.writeFileSync(filePath, formatted);
    return true;
  }
  return false;
}

function lintYamlFile(filePath) {
  try {
    // Use yaml-lint for additional validation
    execSync(`npx yaml-lint "${filePath}"`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ YAML lint error in ${filePath}:`));
    console.error(error.stdout?.toString() || error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const glob = require('glob');
  
  if (args.length === 0) {
    console.error('Usage: node yaml-format.js <file1> [file2] ...');
    process.exit(1);
  }

  let hasErrors = false;
  let hasChanges = false;
  let filesProcessed = [];

  // Expand glob patterns and collect all files
  const allFiles = [];
  for (const arg of args) {
    if (arg.includes('*')) {
      // It's a glob pattern
      const matches = glob.sync(arg);
      allFiles.push(...matches);
    } else {
      // It's a direct file path
      allFiles.push(arg);
    }
  }

  for (const filePath of allFiles) {
    if (!fs.existsSync(filePath)) {
      // Skip silently for glob patterns that don't match anything
      if (!args.some(arg => arg.includes('*') && filePath === arg)) {
        console.error(chalk.red(`❌ File not found: ${filePath}`));
        hasErrors = true;
      }
      continue;
    }

    const ext = path.extname(filePath).toLowerCase();
    const basename = path.basename(filePath).toLowerCase();
    
    try {
      let changed = false;
      if (ext === '.md') {
        changed = processMarkdownFile(filePath);
      } else if (ext === '.yml' || ext === '.yaml' || basename.includes('roomodes') || basename.includes('.yml') || basename.includes('.yaml')) {
        // Handle YAML files and special cases like .roomodes
        changed = processYamlFile(filePath);
        
        // Also run linting
        const lintPassed = lintYamlFile(filePath);
        if (!lintPassed) hasErrors = true;
      } else {
        // Skip silently for unsupported files
        continue;
      }
      
      if (changed) {
        hasChanges = true;
        filesProcessed.push(filePath);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Error processing ${filePath}:`), error.message);
      hasErrors = true;
    }
  }

  if (hasChanges) {
    console.log(chalk.green(`\n✨ YAML formatting completed! Modified ${filesProcessed.length} files:`));
    filesProcessed.forEach(file => console.log(chalk.blue(`  📝 ${file}`)));
  }

  if (hasErrors) {
    console.error(chalk.red('\n💥 Some files had errors. Please fix them before committing.'));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { formatYamlContent, processMarkdownFile, processYamlFile };