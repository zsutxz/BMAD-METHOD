const path = require("path");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");
const fileManager = require("./file-manager");
const configLoader = require("./config-loader");
const ideSetup = require("./ide-setup");

class Installer {
  async install(config) {
    const spinner = ora("Analyzing installation directory...").start();

    try {
      // Resolve installation directory
      const installDir = path.resolve(config.directory);

      // Detect current state
      const state = await this.detectInstallationState(installDir);

      // Handle different states
      switch (state.type) {
        case "clean":
          return await this.performFreshInstall(config, installDir, spinner);

        case "v4_existing":
          return await this.handleExistingV4Installation(
            config,
            installDir,
            state,
            spinner
          );

        case "v3_existing":
          return await this.handleV3Installation(
            config,
            installDir,
            state,
            spinner
          );

        case "unknown_existing":
          return await this.handleUnknownInstallation(
            config,
            installDir,
            state,
            spinner
          );
      }
    } catch (error) {
      spinner.fail("Installation failed");
      throw error;
    }
  }

  async detectInstallationState(installDir) {
    const state = {
      type: "clean",
      hasV4Manifest: false,
      hasV3Structure: false,
      hasBmadCore: false,
      hasOtherFiles: false,
      manifest: null,
    };

    // Check if directory exists
    if (!(await fileManager.pathExists(installDir))) {
      return state; // clean install
    }

    // Check for V4 installation (has .bmad-core with manifest)
    const bmadCorePath = path.join(installDir, ".bmad-core");
    const manifestPath = path.join(bmadCorePath, "install-manifest.yml");

    if (await fileManager.pathExists(manifestPath)) {
      state.type = "v4_existing";
      state.hasV4Manifest = true;
      state.hasBmadCore = true;
      state.manifest = await fileManager.readManifest(installDir);
      return state;
    }

    // Check for V3 installation (has bmad-agent directory)
    const bmadAgentPath = path.join(installDir, "bmad-agent");
    if (await fileManager.pathExists(bmadAgentPath)) {
      state.type = "v3_existing";
      state.hasV3Structure = true;
      return state;
    }

    // Check for .bmad-core without manifest (broken V4 or manual copy)
    if (await fileManager.pathExists(bmadCorePath)) {
      state.type = "unknown_existing";
      state.hasBmadCore = true;
      return state;
    }

    // Check if directory has other files
    const glob = require("glob");
    const files = glob.sync("**/*", {
      cwd: installDir,
      nodir: true,
      ignore: ["**/.git/**", "**/node_modules/**"],
    });

    if (files.length > 0) {
      state.type = "unknown_existing";
      state.hasOtherFiles = true;
      return state;
    }

    return state; // clean install
  }

  async performFreshInstall(config, installDir, spinner) {
    spinner.text = "Installing BMAD Method...";

    let files = [];

    if (config.installType === "full") {
      // Full installation - copy entire .bmad-core folder as a subdirectory
      spinner.text = "Copying complete .bmad-core folder...";
      const sourceDir = configLoader.getBmadCorePath();
      const bmadCoreDestDir = path.join(installDir, ".bmad-core");
      await fileManager.copyDirectory(sourceDir, bmadCoreDestDir);

      // Get list of all files for manifest
      const glob = require("glob");
      files = glob
        .sync("**/*", {
          cwd: bmadCoreDestDir,
          nodir: true,
          ignore: ["**/.git/**", "**/node_modules/**"],
        })
        .map((file) => path.join(".bmad-core", file));
    } else if (config.installType === "single-agent") {
      // Single agent installation
      spinner.text = `Installing ${config.agent} agent...`;

      // Copy agent file
      const agentPath = configLoader.getAgentPath(config.agent);
      const destAgentPath = path.join(
        installDir,
        "agents",
        `${config.agent}.md`
      );
      await fileManager.copyFile(agentPath, destAgentPath);
      files.push(`agents/${config.agent}.md`);

      // Copy dependencies
      const dependencies = await configLoader.getAgentDependencies(
        config.agent
      );
      const sourceBase = configLoader.getBmadCorePath();

      for (const dep of dependencies) {
        spinner.text = `Copying dependency: ${dep}`;

        if (dep.includes("*")) {
          // Handle glob patterns
          const copiedFiles = await fileManager.copyGlobPattern(
            dep.replace(".bmad-core/", ""),
            sourceBase,
            installDir
          );
          files.push(...copiedFiles);
        } else {
          // Handle single files
          const sourcePath = path.join(
            sourceBase,
            dep.replace(".bmad-core/", "")
          );
          const destPath = path.join(
            installDir,
            dep.replace(".bmad-core/", "")
          );

          if (await fileManager.copyFile(sourcePath, destPath)) {
            files.push(dep.replace(".bmad-core/", ""));
          }
        }
      }
    }

    // Set up IDE integration if requested
    if (config.ide) {
      spinner.text = `Setting up ${config.ide} integration...`;
      await ideSetup.setup(config.ide, installDir, config.agent);
    }

    // Create manifest
    spinner.text = "Creating installation manifest...";
    await fileManager.createManifest(installDir, config, files);

    spinner.succeed("Installation complete!");
    this.showSuccessMessage(config, installDir);
  }

  async handleExistingV4Installation(config, installDir, state, spinner) {
    spinner.stop();

    console.log(chalk.yellow("\n🔍 Found existing BMAD v4 installation"));
    console.log(`   Directory: ${installDir}`);
    console.log(`   Version: ${state.manifest.version}`);
    console.log(
      `   Installed: ${new Date(
        state.manifest.installed_at
      ).toLocaleDateString()}`
    );

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Update existing installation", value: "update" },
          { name: "Reinstall (overwrite)", value: "reinstall" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);

    switch (action) {
      case "update":
        return await this.performUpdate(config, installDir, state.manifest, spinner);
      case "reinstall":
        return await this.performReinstall(config, installDir, spinner);
      case "cancel":
        console.log("Installation cancelled.");
        return;
    }
  }

  async handleV3Installation(config, installDir, state, spinner) {
    spinner.stop();

    console.log(
      chalk.yellow("\n🔍 Found BMAD v3 installation (bmad-agent/ directory)")
    );
    console.log(`   Directory: ${installDir}`);

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Upgrade from v3 to v4 (recommended)", value: "upgrade" },
          { name: "Install v4 alongside v3", value: "alongside" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);

    switch (action) {
      case "upgrade":
        console.log(chalk.cyan("\n📦 Starting v3 to v4 upgrade process..."));
        const V3ToV4Upgrader = require("../../upgraders/v3-to-v4-upgrader");
        const upgrader = new V3ToV4Upgrader();
        return await upgrader.upgrade({ projectPath: installDir });
      case "alongside":
        return await this.performFreshInstall(config, installDir, spinner);
      case "cancel":
        console.log("Installation cancelled.");
        return;
    }
  }

  async handleUnknownInstallation(config, installDir, state, spinner) {
    spinner.stop();

    console.log(chalk.yellow("\n⚠️  Directory contains existing files"));
    console.log(`   Directory: ${installDir}`);

    if (state.hasBmadCore) {
      console.log("   Found: .bmad-core directory (but no manifest)");
    }
    if (state.hasOtherFiles) {
      console.log("   Found: Other files in directory");
    }

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Install anyway (may overwrite files)", value: "force" },
          { name: "Choose different directory", value: "different" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);

    switch (action) {
      case "force":
        return await this.performFreshInstall(config, installDir, spinner);
      case "different":
        const { newDir } = await inquirer.prompt([
          {
            type: "input",
            name: "newDir",
            message: "Enter new installation directory:",
            default: path.join(path.dirname(installDir), "bmad-project"),
          },
        ]);
        config.directory = newDir;
        return await this.install(config);
      case "cancel":
        console.log("Installation cancelled.");
        return;
    }
  }

  async performUpdate(newConfig, installDir, manifest, spinner) {
    spinner.start("Checking for updates...");

    try {
      // Check for modified files
      spinner.text = "Checking for modified files...";
      const modifiedFiles = await fileManager.checkModifiedFiles(
        installDir,
        manifest
      );

      if (modifiedFiles.length > 0) {
        spinner.warn("Found modified files");
        console.log(chalk.yellow("\nThe following files have been modified:"));
        modifiedFiles.forEach((file) => console.log(`  - ${file}`));

        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: "How would you like to proceed?",
            choices: [
              { name: "Backup and overwrite modified files", value: "backup" },
              { name: "Skip modified files", value: "skip" },
              { name: "Cancel update", value: "cancel" },
            ],
          },
        ]);

        if (action === "cancel") {
          console.log("Update cancelled.");
          return;
        }

        if (action === "backup") {
          spinner.start("Backing up modified files...");
          for (const file of modifiedFiles) {
            const filePath = path.join(installDir, file);
            const backupPath = await fileManager.backupFile(filePath);
            console.log(
              chalk.dim(`  Backed up: ${file} → ${path.basename(backupPath)}`)
            );
          }
        }
      }

      // Perform update by re-running installation
      spinner.text = "Updating files...";
      const config = {
        installType: manifest.install_type,
        agent: manifest.agent,
        directory: installDir,
        ide: newConfig.ide || manifest.ide_setup, // Use new IDE choice if provided
      };

      await this.performFreshInstall(config, installDir, spinner);
    } catch (error) {
      spinner.fail("Update failed");
      throw error;
    }
  }

  async performReinstall(config, installDir, spinner) {
    spinner.start("Reinstalling BMAD Method...");

    // Remove existing .bmad-core
    const bmadCorePath = path.join(installDir, ".bmad-core");
    if (await fileManager.pathExists(bmadCorePath)) {
      await fileManager.removeDirectory(bmadCorePath);
    }

    return await this.performFreshInstall(config, installDir, spinner);
  }

  showSuccessMessage(config, installDir) {
    console.log(chalk.green("\n✓ BMAD Method installed successfully!\n"));

    if (config.ide) {
      const ideConfig = configLoader.getIdeConfiguration(config.ide);
      if (ideConfig && ideConfig.instructions) {
        console.log(
          chalk.bold("To use BMAD agents in " + ideConfig.name + ":")
        );
        console.log(ideConfig.instructions);
      }
    } else {
      console.log(chalk.yellow("No IDE configuration was set up."));
      console.log(
        "You can manually configure your IDE using the agent files in:",
        installDir
      );
    }

    if (config.installType === "single-agent") {
      console.log(
        chalk.dim(
          "\nNeed other agents? Run: npx bmad-method install --agent=<name>"
        )
      );
      console.log(
        chalk.dim("Need everything? Run: npx bmad-method install --full")
      );
    }
  }

  // Legacy method for backward compatibility
  async update(options) {
    console.log(chalk.yellow('The "update" command is deprecated.'));
    console.log(
      'Please use "install" instead - it will detect and offer to update existing installations.'
    );

    const installDir = await this.findInstallation();
    if (installDir) {
      const config = {
        installType: "full",
        directory: path.dirname(installDir),
        ide: null,
      };
      return await this.install(config);
    } else {
      console.log(chalk.red("No BMAD installation found."));
    }
  }

  async listAgents() {
    const agents = await configLoader.getAvailableAgents();

    console.log(chalk.bold("\nAvailable BMAD Agents:\n"));

    agents.forEach((agent) => {
      console.log(chalk.cyan(`  ${agent.id.padEnd(20)}`), agent.description);
    });

    console.log(
      chalk.dim("\nInstall with: npx bmad-method install --agent=<id>\n")
    );
  }

  async showStatus() {
    const installDir = await this.findInstallation();

    if (!installDir) {
      console.log(
        chalk.yellow("No BMAD installation found in current directory tree")
      );
      return;
    }

    const manifest = await fileManager.readManifest(installDir);

    if (!manifest) {
      console.log(chalk.red("Invalid installation - manifest not found"));
      return;
    }

    console.log(chalk.bold("\nBMAD Installation Status:\n"));
    console.log(`  Directory:      ${installDir}`);
    console.log(`  Version:        ${manifest.version}`);
    console.log(
      `  Installed:      ${new Date(
        manifest.installed_at
      ).toLocaleDateString()}`
    );
    console.log(`  Type:           ${manifest.install_type}`);

    if (manifest.agent) {
      console.log(`  Agent:          ${manifest.agent}`);
    }

    if (manifest.ide_setup) {
      console.log(`  IDE Setup:      ${manifest.ide_setup}`);
    }

    console.log(`  Total Files:    ${manifest.files.length}`);

    // Check for modifications
    const modifiedFiles = await fileManager.checkModifiedFiles(
      installDir,
      manifest
    );
    if (modifiedFiles.length > 0) {
      console.log(chalk.yellow(`  Modified Files: ${modifiedFiles.length}`));
    }

    console.log("");
  }

  async getAvailableAgents() {
    return configLoader.getAvailableAgents();
  }

  async findInstallation() {
    // Look for .bmad-core in current directory or parent directories
    let currentDir = process.cwd();

    while (currentDir !== path.dirname(currentDir)) {
      const bmadDir = path.join(currentDir, ".bmad-core");
      const manifestPath = path.join(bmadDir, "install-manifest.yml");

      if (await fileManager.pathExists(manifestPath)) {
        return bmadDir;
      }

      currentDir = path.dirname(currentDir);
    }

    // Also check if we're inside a .bmad-core directory
    if (path.basename(process.cwd()) === ".bmad-core") {
      const manifestPath = path.join(process.cwd(), "install-manifest.yml");
      if (await fileManager.pathExists(manifestPath)) {
        return process.cwd();
      }
    }

    return null;
  }
}

module.exports = new Installer();
