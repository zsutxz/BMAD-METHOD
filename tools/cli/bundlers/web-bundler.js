const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { DependencyResolver } = require('../installers/lib/core/dependency-resolver');
const { XmlHandler } = require('../lib/xml-handler');
const { AgentPartyGenerator } = require('../lib/agent-party-generator');
const xml2js = require('xml2js');
const { getProjectRoot, getSourcePath, getModulePath } = require('../lib/project-root');

class WebBundler {
  constructor(sourceDir = null, outputDir = 'web-bundles') {
    this.sourceDir = sourceDir || getSourcePath();
    this.outputDir = path.isAbsolute(outputDir) ? outputDir : path.join(getProjectRoot(), outputDir);
    this.modulesPath = getSourcePath('modules');
    this.utilityPath = getSourcePath('utility');

    this.dependencyResolver = new DependencyResolver();
    this.xmlHandler = new XmlHandler();

    // Cache for resolved dependencies to avoid duplicates
    this.dependencyCache = new Map();

    // Discovered agents and teams for manifest generation
    this.discoveredAgents = [];
    this.discoveredTeams = [];

    // Temporary directory for generated manifests
    this.tempDir = path.join(process.cwd(), '.bundler-temp');
    this.tempManifestDir = path.join(this.tempDir, 'bmad', '_cfg');

    // Bundle statistics
    this.stats = {
      totalAgents: 0,
      bundledAgents: 0,
      skippedAgents: 0,
      failedAgents: 0,
      invalidXml: 0,
      warnings: [],
    };
  }

  /**
   * Main entry point to bundle all modules
   */
  async bundleAll() {
    console.log(chalk.cyan.bold('═══════════════════════════════════════════════'));
    console.log(chalk.cyan.bold('         🚀 Web Bundle Generation'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════════════\n'));

    try {
      // Pre-discover all modules to generate complete manifests
      const modules = await this.discoverModules();
      for (const module of modules) {
        await this.preDiscoverModule(module);
      }

      // Create temporary manifest files
      await this.createTempManifests();

      // Process all modules
      for (const module of modules) {
        await this.bundleModule(module);
      }

      // Display summary
      this.displaySummary();
    } finally {
      // Clean up temp files
      await this.cleanupTempFiles();
    }
  }

  /**
   * Bundle a specific module
   */
  async bundleModule(moduleName) {
    const modulePath = path.join(this.modulesPath, moduleName);

    if (!(await fs.pathExists(modulePath))) {
      console.log(chalk.yellow(`Module ${moduleName} not found`));
      return { module: moduleName, agents: [], teams: [] };
    }

    console.log(chalk.bold(`\n📦 Bundling module: ${moduleName}`));

    const results = {
      module: moduleName,
      agents: [],
      teams: [],
    };

    // Pre-discover all agents and teams for manifest generation
    await this.preDiscoverModule(moduleName);

    // Ensure temp manifests exist (might not exist if called directly)
    if (!(await fs.pathExists(this.tempManifestDir))) {
      await this.createTempManifests();
    }

    // Process agents
    const agents = await this.discoverAgents(modulePath);
    for (const agent of agents) {
      try {
        await this.bundleAgent(moduleName, agent, false); // false = don't track again
        results.agents.push(agent);
      } catch (error) {
        console.error(`    Failed to bundle agent ${agent}:`, error.message);
      }
    }

    // Process teams (Phase 4 - to be implemented)
    // const teams = await this.discoverTeams(modulePath);
    // for (const team of teams) {
    //   try {
    //     await this.bundleTeam(moduleName, team);
    //     results.teams.push(team);
    //   } catch (error) {
    //     console.error(`    Failed to bundle team ${team}:`, error.message);
    //   }
    // }

    return results;
  }

  /**
   * Bundle a single agent
   */
  async bundleAgent(moduleName, agentFile, shouldTrack = true) {
    const agentName = path.basename(agentFile, '.md');
    this.stats.totalAgents++;

    console.log(chalk.dim(`  → Processing: ${agentName}`));

    const agentPath = path.join(this.modulesPath, moduleName, 'agents', agentFile);

    // Check if agent file exists
    if (!(await fs.pathExists(agentPath))) {
      this.stats.failedAgents++;
      console.log(chalk.red(`    ✗ Agent file not found`));
      throw new Error(`Agent file not found: ${agentPath}`);
    }

    // Read agent file
    const content = await fs.readFile(agentPath, 'utf8');

    // Extract agent XML from markdown
    let agentXml = this.extractAgentXml(content);

    if (!agentXml) {
      this.stats.failedAgents++;
      console.log(chalk.red(`    ✗ No agent XML found in ${agentFile}`));
      return;
    }

    // Check if agent has bundle="false" attribute
    if (this.shouldSkipBundling(agentXml)) {
      this.stats.skippedAgents++;
      console.log(chalk.gray(`    ⊘ Skipped (bundle="false")`));
      return;
    }

    // Process {project-root} references in agent XML
    agentXml = this.processProjectRootReferences(agentXml);

    // Track for manifest generation BEFORE generating manifests (if not pre-discovered)
    if (shouldTrack) {
      const agentDetails = AgentPartyGenerator.extractAgentDetails(content, moduleName, agentName);
      if (agentDetails) {
        this.discoveredAgents.push(agentDetails);
      }
    }

    // Resolve dependencies with warning tracking
    const dependencyWarnings = [];
    const dependencies = await this.resolveAgentDependencies(agentXml, moduleName, dependencyWarnings);

    if (dependencyWarnings.length > 0) {
      this.stats.warnings.push({ agent: agentName, warnings: dependencyWarnings });
    }

    // Build the bundle (no manifests for individual agents)
    const bundle = this.buildAgentBundle(agentXml, dependencies);

    // Validate XML
    const isValid = await this.validateXml(bundle);
    if (!isValid) {
      this.stats.invalidXml++;
      console.log(chalk.red(`    ⚠ Invalid XML generated!`));
    }

    // Write bundle to output
    const outputPath = path.join(this.outputDir, moduleName, 'agents', `${agentName}.xml`);
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, bundle, 'utf8');

    this.stats.bundledAgents++;
    const statusIcon = isValid ? chalk.green('✓') : chalk.yellow('⚠');
    console.log(`    ${statusIcon} Bundled: ${agentName}.xml${isValid ? '' : chalk.yellow(' (invalid XML)')}`);
  }

  /**
   * Pre-discover all agents and teams in a module for manifest generation
   */
  async preDiscoverModule(moduleName) {
    const modulePath = path.join(this.modulesPath, moduleName);

    // Clear any previously discovered agents for this module
    this.discoveredAgents = this.discoveredAgents.filter((a) => a.module !== moduleName);

    // Discover agents
    const agentsPath = path.join(modulePath, 'agents');
    if (await fs.pathExists(agentsPath)) {
      const files = await fs.readdir(agentsPath);
      for (const file of files) {
        if (file.endsWith('.md') && !file.toLowerCase().includes('readme')) {
          const agentPath = path.join(agentsPath, file);
          const content = await fs.readFile(agentPath, 'utf8');
          const agentXml = this.extractAgentXml(content);

          if (agentXml) {
            // Skip agents with bundle="false"
            if (this.shouldSkipBundling(agentXml)) {
              continue;
            }

            const agentName = path.basename(file, '.md');
            // Use the shared generator to extract agent details (pass full content)
            const agentDetails = AgentPartyGenerator.extractAgentDetails(content, moduleName, agentName);
            if (agentDetails) {
              this.discoveredAgents.push(agentDetails);
            }
          }
        }
      }
    }

    // TODO: Discover teams when implemented
  }

  /**
   * Extract agent XML from markdown content
   */
  extractAgentXml(content) {
    // Try 4 backticks first (can contain 3 backtick blocks inside)
    let match = content.match(/````xml\s*([\s\S]*?)````/);
    if (!match) {
      // Fall back to 3 backticks if no 4-backtick block found
      match = content.match(/```xml\s*([\s\S]*?)```/);
    }

    if (match) {
      const xmlContent = match[1];
      const agentMatch = xmlContent.match(/<agent[^>]*>[\s\S]*?<\/agent>/);
      return agentMatch ? agentMatch[0] : null;
    }

    // Fall back to direct extraction
    match = content.match(/<agent[^>]*>[\s\S]*?<\/agent>/);
    return match ? match[0] : null;
  }

  /**
   * Resolve all dependencies for an agent
   */
  async resolveAgentDependencies(agentXml, moduleName, warnings = []) {
    const dependencies = new Map();
    const processed = new Set();

    // Extract file references from agent XML
    const fileRefs = this.extractFileReferences(agentXml);

    // Process each file reference
    for (const ref of fileRefs) {
      await this.processFileDependency(ref, dependencies, processed, moduleName, warnings);
    }

    return dependencies;
  }

  /**
   * Extract file references from agent XML
   */
  extractFileReferences(xml) {
    const refs = new Set();

    // Match various file reference patterns
    const patterns = [
      /exec="([^"]+)"/g, // Command exec paths
      /tmpl="([^"]+)"/g, // Template paths
      /data="([^"]+)"/g, // Data file paths
      /file="([^"]+)"/g, // Generic file refs
      /src="([^"]+)"/g, // Source paths
      /system-prompts="([^"]+)"/g,
      /tools="([^"]+)"/g,
      /workflows="([^"]+)"/g,
      /knowledge="([^"]+)"/g,
      /{project-root}\/([^"'\s<>]+)/g,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(xml)) !== null) {
        let filePath = match[1];
        // Remove {project-root} prefix if present
        filePath = filePath.replace(/^{project-root}\//, '');
        if (filePath) {
          refs.add(filePath);
        }
      }
    }

    return [...refs];
  }

  /**
   * Process a file dependency recursively
   */
  async processFileDependency(filePath, dependencies, processed, moduleName, warnings = []) {
    // Skip if already processed
    if (processed.has(filePath)) {
      return;
    }
    processed.add(filePath);

    // Handle wildcard patterns
    if (filePath.includes('*')) {
      await this.processWildcardDependency(filePath, dependencies, processed, moduleName, warnings);
      return;
    }

    // Resolve actual file path
    const actualPath = this.resolveFilePath(filePath, moduleName);

    if (!actualPath || !(await fs.pathExists(actualPath))) {
      warnings.push(filePath);
      return;
    }

    // Read file content
    let content = await fs.readFile(actualPath, 'utf8');

    // Process {project-root} references
    content = this.processProjectRootReferences(content);

    // Extract dependencies from frontmatter if present
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      // Look for dependencies in frontmatter
      const depMatch = frontmatter.match(/dependencies:\s*\[(.*?)\]/);
      if (depMatch) {
        const deps = depMatch[1].match(/['"]([^'"]+)['"]/g);
        if (deps) {
          for (const dep of deps) {
            const depPath = dep.replaceAll(/['"]/g, '').replace(/^{project-root}\//, '');
            if (depPath && !processed.has(depPath)) {
              await this.processFileDependency(depPath, dependencies, processed, moduleName, warnings);
            }
          }
        }
      }
      // Look for template references
      const templateMatch = frontmatter.match(/template:\s*\[(.*?)\]/);
      if (templateMatch) {
        const templates = templateMatch[1].match(/['"]([^'"]+)['"]/g);
        if (templates) {
          for (const template of templates) {
            const templatePath = template.replaceAll(/['"]/g, '').replace(/^{project-root}\//, '');
            if (templatePath && !processed.has(templatePath)) {
              await this.processFileDependency(templatePath, dependencies, processed, moduleName, warnings);
            }
          }
        }
      }
    }

    // Extract XML from markdown if applicable
    const ext = path.extname(actualPath).toLowerCase();
    let processedContent = content;

    switch (ext) {
      case '.md': {
        // Try to extract XML from markdown - handle both 3 and 4 backtick blocks
        // First try 4 backticks (which can contain 3 backtick blocks inside)
        let xmlMatches = [...content.matchAll(/````xml\s*([\s\S]*?)````/g)];

        // If no 4-backtick blocks, try 3 backticks
        if (xmlMatches.length === 0) {
          xmlMatches = [...content.matchAll(/```xml\s*([\s\S]*?)```/g)];
        }

        const xmlBlocks = [];

        for (const match of xmlMatches) {
          if (match[1]) {
            xmlBlocks.push(match[1].trim());
          }
        }

        if (xmlBlocks.length > 0) {
          // For XML content, just include it directly (it's already valid XML)
          processedContent = xmlBlocks.join('\n\n');
        } else {
          // No XML blocks found, skip non-XML markdown files
          return;
        }

        break;
      }
      case '.csv': {
        // CSV files need special handling - convert to XML file-index
        const lines = content.split('\n').filter((line) => line.trim());
        if (lines.length === 0) return;

        const headers = lines[0].split(',').map((h) => h.trim());
        const rows = lines.slice(1);

        const indexParts = [`<file-index id="${filePath}">`];
        indexParts.push('  <items>');

        // Track files referenced in CSV for additional bundling
        const referencedFiles = new Set();

        for (const row of rows) {
          const values = row.split(',').map((v) => v.trim());
          if (values.every((v) => !v)) continue;

          indexParts.push('    <item>');
          for (const [i, header] of headers.entries()) {
            const value = values[i] || '';
            const tagName = header.toLowerCase().replaceAll(/[^a-z0-9]/g, '_');
            indexParts.push(`      <${tagName}>${value}</${tagName}>`);

            // Track referenced files
            if (header.toLowerCase().includes('file') && value.endsWith('.md')) {
              // Build path relative to CSV location
              const csvDir = path.dirname(actualPath);
              const refPath = path.join(csvDir, value);
              if (fs.existsSync(refPath)) {
                const refId = filePath.replace('index.csv', value);
                referencedFiles.add(refId);
              }
            }
          }
          indexParts.push('    </item>');
        }

        indexParts.push('  </items>', '</file-index>');

        // Store the XML version
        dependencies.set(filePath, indexParts.join('\n'));

        // Process referenced files from CSV
        for (const refId of referencedFiles) {
          if (!processed.has(refId)) {
            await this.processFileDependency(refId, dependencies, processed, moduleName, warnings);
          }
        }

        return;
      }
      case '.xml': {
        // XML files can be included directly
        processedContent = content;
        break;
      }
      default: {
        // For other non-XML file types, skip them
        return;
      }
    }

    // Store the processed content
    dependencies.set(filePath, processedContent);

    // Recursively scan for more dependencies
    const nestedRefs = this.extractFileReferences(processedContent);
    for (const ref of nestedRefs) {
      await this.processFileDependency(ref, dependencies, processed, moduleName, warnings);
    }
  }

  /**
   * Process wildcard dependency patterns
   */
  async processWildcardDependency(pattern, dependencies, processed, moduleName, warnings = []) {
    // Remove {project-root} prefix
    pattern = pattern.replace(/^{project-root}\//, '');

    // Get directory and file pattern
    const lastSlash = pattern.lastIndexOf('/');
    const dirPath = pattern.slice(0, Math.max(0, lastSlash));
    const filePattern = pattern.slice(Math.max(0, lastSlash + 1));

    // Resolve directory path without checking file existence
    let dir;
    if (dirPath.startsWith('bmad/')) {
      // Remove bmad/ prefix
      const actualPath = dirPath.replace(/^bmad\//, '');

      // Try different path mappings for directories
      const possibleDirs = [
        // Try as module path: bmad/cis/... -> src/modules/cis/...
        path.join(this.sourceDir, 'modules', actualPath),
        // Try as direct path: bmad/core/... -> src/core/...
        path.join(this.sourceDir, actualPath),
      ];

      for (const testDir of possibleDirs) {
        if (fs.existsSync(testDir)) {
          dir = testDir;
          break;
        }
      }
    }

    if (!dir) {
      warnings.push(`${pattern} (could not resolve directory)`);
      return;
    }
    if (!(await fs.pathExists(dir))) {
      warnings.push(pattern);
      return;
    }

    // Read directory and match files
    const files = await fs.readdir(dir);
    let matchedFiles = [];

    if (filePattern === '*.*') {
      matchedFiles = files;
    } else if (filePattern.startsWith('*.')) {
      const ext = filePattern.slice(1);
      matchedFiles = files.filter((f) => f.endsWith(ext));
    } else {
      // Simple glob matching
      const regex = new RegExp('^' + filePattern.replace('*', '.*') + '$');
      matchedFiles = files.filter((f) => regex.test(f));
    }

    // Process each matched file
    for (const file of matchedFiles) {
      const fullPath = dirPath + '/' + file;
      if (!processed.has(fullPath)) {
        await this.processFileDependency(fullPath, dependencies, processed, moduleName, warnings);
      }
    }
  }

  /**
   * Resolve file path relative to project
   */
  resolveFilePath(filePath, moduleName) {
    // Remove {project-root} prefix
    filePath = filePath.replace(/^{project-root}\//, '');

    // Check temp directory first for _cfg files
    if (filePath.startsWith('bmad/_cfg/')) {
      const filename = filePath.split('/').pop();
      const tempPath = path.join(this.tempManifestDir, filename);
      if (fs.existsSync(tempPath)) {
        return tempPath;
      }
    }

    // Handle different path patterns for bmad files
    // bmad/cis/tasks/brain-session.md -> src/modules/cis/tasks/brain-session.md
    // bmad/core/tasks/create-doc.md -> src/core/tasks/create-doc.md
    // bmad/bmm/templates/brief.md -> src/modules/bmm/templates/brief.md

    let actualPath = filePath;

    if (filePath.startsWith('bmad/')) {
      // Remove bmad/ prefix
      actualPath = filePath.replace(/^bmad\//, '');

      // Check if it's a module-specific file (cis, bmm, etc) or core file
      const parts = actualPath.split('/');
      const firstPart = parts[0];

      // Try different path mappings
      const possiblePaths = [
        // Try in temp directory first
        path.join(this.tempDir, filePath),
        // Try as module path: bmad/cis/... -> src/modules/cis/...
        path.join(this.sourceDir, 'modules', actualPath),
        // Try as direct path: bmad/core/... -> src/core/...
        path.join(this.sourceDir, actualPath),
        // Try without any prefix in src
        path.join(this.sourceDir, parts.slice(1).join('/')),
        // Try in project root
        path.join(this.sourceDir, '..', actualPath),
        // Try original with bmad
        path.join(this.sourceDir, '..', filePath),
      ];

      for (const testPath of possiblePaths) {
        if (fs.existsSync(testPath)) {
          return testPath;
        }
      }
    }

    // Try standard paths for non-bmad files
    const basePaths = [
      this.sourceDir, // src directory
      path.join(this.modulesPath, moduleName), // Current module
      path.join(this.sourceDir, '..'), // Project root
    ];

    for (const basePath of basePaths) {
      const fullPath = path.join(basePath, actualPath);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    return null;
  }

  /**
   * Process and remove {project-root} references
   */
  processProjectRootReferences(content) {
    // Remove {project-root}/ prefix (with slash)
    content = content.replaceAll('{project-root}/', '');
    // Also remove {project-root} without slash
    content = content.replaceAll('{project-root}', '');
    return content;
  }

  /**
   * Escape special XML characters in text content
   */
  escapeXmlText(text) {
    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&apos;');
  }

  /**
   * Escape XML content while preserving XML tags
   */
  escapeXmlContent(content) {
    const tagPattern = /<([^>]+)>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = tagPattern.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(this.escapeXmlText(content.slice(lastIndex, match.index)));
      }
      parts.push('<' + match[1] + '>');
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(this.escapeXmlText(content.slice(lastIndex)));
    }

    return parts.join('');
  }

  /**
   * Build the final agent bundle XML
   */
  buildAgentBundle(agentXml, dependencies) {
    const parts = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<agent-bundle>',
      '  <!-- Agent Definition -->',
      '  ' + agentXml.replaceAll('\n', '\n  '),
    ];

    // Add dependencies without wrapper tags
    if (dependencies && dependencies.size > 0) {
      parts.push('\n  <!-- Dependencies -->');
      for (const [id, content] of dependencies) {
        // Escape XML content while preserving tags
        const escapedContent = this.escapeXmlContent(content);
        // Indent properly
        const indentedContent = escapedContent
          .split('\n')
          .map((line) => '  ' + line)
          .join('\n');
        parts.push(indentedContent);
      }
    }

    parts.push('</agent-bundle>');

    return parts.join('\n');
  }

  /**
   * Discover all modules
   */
  async discoverModules() {
    const modules = [];

    if (!(await fs.pathExists(this.modulesPath))) {
      console.log(chalk.yellow('No modules directory found'));
      return modules;
    }

    const entries = await fs.readdir(this.modulesPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        modules.push(entry.name);
      }
    }

    return modules;
  }

  /**
   * Discover agents in a module
   */
  async discoverAgents(modulePath) {
    const agents = [];
    const agentsPath = path.join(modulePath, 'agents');

    if (!(await fs.pathExists(agentsPath))) {
      return agents;
    }

    const files = await fs.readdir(agentsPath);

    for (const file of files) {
      if (file.endsWith('.md') && !file.toLowerCase().includes('readme')) {
        agents.push(file);
      }
    }

    return agents;
  }

  /**
   * Discover all teams in a module
   */
  async discoverTeams(modulePath) {
    const teams = [];
    const teamsPath = path.join(modulePath, 'teams');

    if (!(await fs.pathExists(teamsPath))) {
      return teams;
    }

    const files = await fs.readdir(teamsPath);

    for (const file of files) {
      if (file.endsWith('.md')) {
        teams.push(file);
      }
    }

    return teams;
  }

  /**
   * Extract agent name from XML
   */
  getAgentName(xml) {
    const match = xml.match(/<agent[^>]*name="([^"]+)"/);
    return match ? match[1] : 'Unknown';
  }

  /**
   * Extract agent description from XML
   */
  getAgentDescription(xml) {
    const match = xml.match(/<description>([^<]+)<\/description>/);
    return match ? match[1] : '';
  }

  /**
   * Check if agent should be skipped for bundling
   */
  shouldSkipBundling(xml) {
    // Check for bundle="false" attribute in the agent tag
    const match = xml.match(/<agent[^>]*bundle="false"[^>]*>/);
    return match !== null;
  }

  /**
   * Create temporary manifest files
   */
  async createTempManifests() {
    // Ensure temp directory exists
    await fs.ensureDir(this.tempManifestDir);

    // Generate agent-party.xml using shared generator
    const agentPartyPath = path.join(this.tempManifestDir, 'agent-party.xml');
    await AgentPartyGenerator.writeAgentParty(agentPartyPath, this.discoveredAgents, { forWeb: true });

    console.log(chalk.dim('  ✓ Created temporary manifest files'));
  }

  /**
   * Clean up temporary files
   */
  async cleanupTempFiles() {
    if (await fs.pathExists(this.tempDir)) {
      await fs.remove(this.tempDir);
      console.log(chalk.dim('\n✓ Cleaned up temporary files'));
    }
  }

  /**
   * Validate XML content
   */
  async validateXml(xmlContent) {
    try {
      await xml2js.parseStringPromise(xmlContent, {
        strict: true,
        explicitArray: false,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Display summary statistics
   */
  displaySummary() {
    console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════'));
    console.log(chalk.cyan.bold('                 SUMMARY'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════════════\n'));

    console.log(chalk.bold('Bundle Statistics:'));
    console.log(`  Total agents found:    ${this.stats.totalAgents}`);
    console.log(`  Successfully bundled:  ${chalk.green(this.stats.bundledAgents)}`);
    console.log(`  Skipped (bundle=false): ${chalk.gray(this.stats.skippedAgents)}`);

    if (this.stats.failedAgents > 0) {
      console.log(`  Failed to bundle:      ${chalk.red(this.stats.failedAgents)}`);
    }

    if (this.stats.invalidXml > 0) {
      console.log(`  Invalid XML bundles:   ${chalk.yellow(this.stats.invalidXml)}`);
    }

    // Display warnings summary
    if (this.stats.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠ Missing Dependencies by Agent:'));

      // Group and display warnings by agent
      for (const agentWarning of this.stats.warnings) {
        if (agentWarning.warnings.length > 0) {
          console.log(chalk.bold(`\n  ${agentWarning.agent}:`));
          // Display unique warnings for this agent
          const uniqueWarnings = [...new Set(agentWarning.warnings)];
          for (const warning of uniqueWarnings) {
            console.log(chalk.dim(`    • ${warning}`));
          }
        }
      }
    }

    // Final status
    if (this.stats.invalidXml > 0) {
      console.log(chalk.yellow('\n⚠ Some bundles have invalid XML. Please review the output.'));
    } else if (this.stats.failedAgents > 0) {
      console.log(chalk.yellow('\n⚠ Some agents failed to bundle. Please review the errors.'));
    } else {
      console.log(chalk.green('\n✨ All bundles generated successfully!'));
    }

    console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════\n'));
  }
}

module.exports = { WebBundler };
