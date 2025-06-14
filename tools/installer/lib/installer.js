const chalk = require("chalk");
const ora = require("ora");
const path = require("path");
const configLoader = require("./config-loader");
const fileManager = require("./file-manager");
const ideSetup = require("./ide-setup");

class Installer {
  async install(config) {
    const spinner = ora("Installing BMAD Method...").start();

    try {
      // Resolve installation directory
      const installDir = path.resolve(config.directory);

      // Check if directory already exists
      if (await fileManager.pathExists(installDir)) {
        const manifest = await fileManager.readManifest(installDir);
        if (manifest) {
          spinner.fail("BMAD is already installed in this directory");
          console.log(
            chalk.yellow(
              '\nUse "bmad update" to update the existing installation'
            )
          );
          return;
        }
      }

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
        // For full installations, IDE rules should be in the root install dir, not .bmad-core
        await ideSetup.setup(config.ide, installDir, config.agent);
      }

      // Create manifest
      spinner.text = "Creating installation manifest...";
      await fileManager.createManifest(installDir, config, files);

      spinner.succeed("Installation complete!");

      // Show success message
      console.log(chalk.green("\n✓ BMAD Method installed successfully!\n"));

      if (config.ide) {
        const ideConfig = await configLoader.getIdeConfiguration(config.ide);
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
    } catch (error) {
      spinner.fail("Installation failed");
      throw error;
    }
  }

  async update(options) {
    const spinner = ora("Checking for updates...").start();

    try {
      // Find existing installation
      const installDir = await this.findInstallation();
      if (!installDir) {
        spinner.fail("No BMAD installation found");
        return;
      }

      const manifest = await fileManager.readManifest(installDir);
      if (!manifest) {
        spinner.fail("Invalid installation - manifest not found");
        return;
      }

      // Check for modified files
      spinner.text = "Checking for modified files...";
      const modifiedFiles = await fileManager.checkModifiedFiles(
        installDir,
        manifest
      );

      if (modifiedFiles.length > 0 && !options.force) {
        spinner.warn("Found modified files");
        console.log(chalk.yellow("\nThe following files have been modified:"));
        modifiedFiles.forEach((file) => console.log(`  - ${file}`));

        if (!options.dryRun) {
          console.log(
            chalk.yellow("\nUse --force to overwrite modified files")
          );
          console.log(chalk.yellow("or manually backup your changes first"));
        }
        return;
      }

      if (options.dryRun) {
        spinner.info("Dry run - no changes will be made");
        console.log("\nFiles that would be updated:");
        manifest.files.forEach((file) => console.log(`  - ${file.path}`));
        return;
      }

      // Perform update
      spinner.text = "Updating files...";

      // Backup modified files if forcing
      if (modifiedFiles.length > 0 && options.force) {
        for (const file of modifiedFiles) {
          const filePath = path.join(installDir, file);
          const backupPath = await fileManager.backupFile(filePath);
          console.log(
            chalk.dim(`  Backed up: ${file} → ${path.basename(backupPath)}`)
          );
        }
      }

      // Re-run installation with same config
      const config = {
        installType: manifest.install_type,
        agent: manifest.agent,
        directory: installDir,
        ide: manifest.ide_setup,
      };

      await this.install(config);
    } catch (error) {
      spinner.fail("Update failed");
      throw error;
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
