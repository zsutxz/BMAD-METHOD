#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Simple version bumping script for BMAD-METHOD
 * Usage: node tools/version-bump.js [patch|minor|major]
 */

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function bumpVersion(type = 'patch') {
  const validTypes = ['patch', 'minor', 'major'];
  if (!validTypes.includes(type)) {
    console.error(chalk.red(`Invalid version type: ${type}. Use: ${validTypes.join(', ')}`));
    process.exit(1);
  }

  console.log(chalk.blue(`🔄 Bumping ${type} version...`));
  
  // Use npm version to bump and create git tag
  try {
    const newVersion = execSync(`npm version ${type} --no-git-tag-version`, { encoding: 'utf8' }).trim();
    console.log(chalk.green(`✅ Version bumped to ${newVersion}`));
    
    // Stage the package.json change
    execSync('git add package.json');
    
    // Create commit and tag
    execSync(`git commit -m "chore: bump version to ${newVersion}"`);
    execSync(`git tag -a ${newVersion} -m "Release ${newVersion}"`);
    
    console.log(chalk.green(`✅ Created git tag: ${newVersion}`));
    console.log(chalk.yellow(`💡 Run 'git push && git push --tags' to publish`));
    
    return newVersion;
  } catch (error) {
    console.error(chalk.red('❌ Version bump failed:'), error.message);
    process.exit(1);
  }
}

function main() {
  const type = process.argv[2] || 'patch';
  const currentVersion = getCurrentVersion();
  
  console.log(chalk.blue(`Current version: ${currentVersion}`));
  
  // Check if working directory is clean
  try {
    execSync('git diff-index --quiet HEAD --');
  } catch (error) {
    console.error(chalk.red('❌ Working directory is not clean. Commit your changes first.'));
    process.exit(1);
  }
  
  const newVersion = bumpVersion(type);
  
  console.log(chalk.green(`\n🎉 Version bump complete!`));
  console.log(chalk.blue(`📦 ${currentVersion} → ${newVersion}`));
}

if (require.main === module) {
  main();
}

module.exports = { bumpVersion, getCurrentVersion };