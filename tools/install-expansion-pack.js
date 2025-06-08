#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  console.error(`${colors.red}❌ Error: ${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

async function installExpansionPack(packName) {
  const expansionPackPath = path.join(__dirname, '..', 'expansion-packs', packName);
  const manifestPath = path.join(expansionPackPath, 'manifest.yml');

  // Check if expansion pack exists
  if (!fs.existsSync(expansionPackPath)) {
    error(`Expansion pack '${packName}' not found`);
    log('\nAvailable expansion packs:', 'cyan');
    const packsDir = path.join(__dirname, '..', 'expansion-packs');
    const packs = fs.readdirSync(packsDir)
      .filter(f => fs.statSync(path.join(packsDir, f)).isDirectory())
      .filter(f => f !== 'README.md');
    packs.forEach(pack => log(`  - ${pack}`, 'cyan'));
    process.exit(1);
  }

  // Load manifest
  if (!fs.existsSync(manifestPath)) {
    error(`Manifest file not found for expansion pack '${packName}'`);
    process.exit(1);
  }

  let manifest;
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    manifest = yaml.load(manifestContent);
  } catch (e) {
    error(`Failed to parse manifest: ${e.message}`);
    process.exit(1);
  }

  log(`\n${colors.bright}Installing ${manifest.name} v${manifest.version}${colors.reset}`, 'bright');
  log(`${manifest.description}\n`, 'cyan');

  // Create directories if needed
  const projectRoot = path.join(__dirname, '..');
  const bmadCore = path.join(projectRoot, 'bmad-core');

  // Install files
  let installedCount = 0;
  let skippedCount = 0;

  for (const fileMapping of manifest.files) {
    const sourcePath = path.join(expansionPackPath, fileMapping.source);
    const destPath = path.join(projectRoot, fileMapping.destination);
    const destDir = path.dirname(destPath);

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      info(`Created directory: ${path.relative(projectRoot, destDir)}`);
    }

    // Check if file already exists
    if (fs.existsSync(destPath)) {
      const response = await promptUser(`File ${path.relative(projectRoot, destPath)} already exists. Overwrite? (y/N): `);
      if (response.toLowerCase() !== 'y') {
        info(`Skipped: ${fileMapping.source}`);
        skippedCount++;
        continue;
      }
    }

    // Copy file
    try {
      fs.copyFileSync(sourcePath, destPath);
      success(`Installed: ${fileMapping.source} → ${path.relative(projectRoot, destPath)}`);
      installedCount++;
    } catch (e) {
      error(`Failed to install ${fileMapping.source}: ${e.message}`);
    }
  }

  // Update team configurations
  if (manifest.team_updates && manifest.team_updates.length > 0) {
    log('\nUpdating team configurations...', 'yellow');
    
    for (const update of manifest.team_updates) {
      const teamPath = path.join(projectRoot, 'agents', update.team);
      
      if (fs.existsSync(teamPath)) {
        try {
          let teamConfig = yaml.load(fs.readFileSync(teamPath, 'utf8'));
          
          if (!teamConfig.agents) {
            teamConfig.agents = [];
          }
          
          if (!teamConfig.agents.includes(update.add_agent)) {
            teamConfig.agents.push(update.add_agent);
            fs.writeFileSync(teamPath, yaml.dump(teamConfig));
            success(`Updated ${update.team} with ${update.add_agent} agent`);
          } else {
            info(`${update.team} already includes ${update.add_agent} agent`);
          }
        } catch (e) {
          error(`Failed to update ${update.team}: ${e.message}`);
        }
      }
    }
  }

  // Show summary
  log(`\n${colors.bright}Installation Summary${colors.reset}`, 'bright');
  log(`Files installed: ${installedCount}`, 'green');
  if (skippedCount > 0) {
    log(`Files skipped: ${skippedCount}`, 'yellow');
  }

  // Show post-install message
  if (manifest.post_install_message) {
    log(`\n${colors.bright}Next Steps:${colors.reset}`, 'bright');
    log(manifest.post_install_message, 'cyan');
  }

  // Remind to rebuild
  log('\nRemember to rebuild bundles:', 'yellow');
  log('  npm run build', 'yellow');
}

function promptUser(question) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Main execution
const packName = process.argv[2];

if (!packName) {
  log(`${colors.bright}BMAD Method Expansion Pack Installer${colors.reset}\n`, 'bright');
  log('Usage: node install-expansion-pack.js <pack-name>', 'yellow');
  log('\nExample:', 'cyan');
  log('  node install-expansion-pack.js infrastructure', 'cyan');
  
  log('\nAvailable expansion packs:', 'cyan');
  const packsDir = path.join(__dirname, '..', 'expansion-packs');
  if (fs.existsSync(packsDir)) {
    const packs = fs.readdirSync(packsDir)
      .filter(f => fs.statSync(path.join(packsDir, f)).isDirectory())
      .filter(f => f !== 'README.md');
    packs.forEach(pack => {
      const manifestPath = path.join(packsDir, pack, 'manifest.yml');
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = yaml.load(fs.readFileSync(manifestPath, 'utf8'));
          log(`  - ${pack}: ${manifest.description}`, 'cyan');
        } catch (e) {
          log(`  - ${pack}`, 'cyan');
        }
      }
    });
  }
  process.exit(0);
}

installExpansionPack(packName).catch(err => {
  error(`Installation failed: ${err.message}`);
  process.exit(1);
});