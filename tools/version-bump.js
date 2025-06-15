#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Dynamic import for ES module
let chalk;

// Initialize ES modules
async function initializeModules() {
  if (!chalk) {
    chalk = (await import('chalk')).default;
  }
}

/**
 * Simple version bumping script for BMAD-METHOD
 * Usage: node tools/version-bump.js [patch|minor|major]
 */

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

async function bumpVersion(type = 'patch') {
  await initializeModules();
  
  const validTypes = ['patch', 'minor', 'major'];
  if (!validTypes.includes(type)) {
    console.error(chalk.red(`Invalid version type: ${type}. Use: ${validTypes.join(', ')}`));
    process.exit(1);
  }

  console.log(chalk.blue(`🔄 Bumping ${type} version...`));
  
  // Use npm version to bump and create git tag
  try {
    const newVersion = execSync(`npm version ${type} --no-git-tag-version`, { encoding: 'utf8' }).trim();
    console.log(chalk.green(`✅ Main package.json version bumped to ${newVersion}`));
    
    // Also update installer package.json
    const installerPackageJsonPath = path.join('tools', 'installer', 'package.json');
    if (fs.existsSync(installerPackageJsonPath)) {
      const installerPackageJson = JSON.parse(fs.readFileSync(installerPackageJsonPath, 'utf8'));
      installerPackageJson.version = newVersion.replace('v', ''); // Remove 'v' prefix if present
      fs.writeFileSync(installerPackageJsonPath, JSON.stringify(installerPackageJson, null, 2) + '\n');
      console.log(chalk.green(`✅ Installer package.json version bumped to ${newVersion}`));
    }
    
    // Stage both package.json files
    execSync('git add package.json');
    execSync(`git add ${installerPackageJsonPath}`);
    
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

async function main() {
  await initializeModules();
  
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
  
  const newVersion = await bumpVersion(type);
  
  console.log(chalk.green(`\n🎉 Version bump complete!`));
  console.log(chalk.blue(`📦 ${currentVersion} → ${newVersion}`));
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { bumpVersion, getCurrentVersion };