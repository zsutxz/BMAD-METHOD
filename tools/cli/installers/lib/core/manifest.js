const path = require('node:path');
const fs = require('fs-extra');

class Manifest {
  /**
   * Create a new manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {Object} data - Manifest data
   * @param {Array} installedFiles - List of installed files to track
   */
  async create(bmadDir, data, installedFiles = []) {
    const manifestPath = path.join(bmadDir, '_cfg', 'manifest.csv');

    // Ensure _cfg directory exists
    await fs.ensureDir(path.dirname(manifestPath));

    // Load module configs to get module metadata
    // If core is installed, add it to modules list
    const allModules = [...(data.modules || [])];
    if (data.core) {
      allModules.unshift('core'); // Add core at the beginning
    }
    const moduleConfigs = await this.loadModuleConfigs(allModules);

    // Parse installed files to extract metadata - pass bmadDir for relative paths
    const fileMetadata = await this.parseInstalledFiles(installedFiles, bmadDir);

    // Don't store installation path in manifest

    // Generate CSV content
    const csvContent = this.generateManifestCsv({ ...data, modules: allModules }, fileMetadata, moduleConfigs);

    await fs.writeFile(manifestPath, csvContent, 'utf8');
    return { success: true, path: manifestPath, filesTracked: fileMetadata.length };
  }

  /**
   * Read existing manifest
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Object|null} Manifest data or null if not found
   */
  async read(bmadDir) {
    const csvPath = path.join(bmadDir, '_cfg', 'manifest.csv');

    if (await fs.pathExists(csvPath)) {
      try {
        const content = await fs.readFile(csvPath, 'utf8');
        return this.parseManifestCsv(content);
      } catch (error) {
        console.error('Failed to read CSV manifest:', error.message);
      }
    }

    return null;
  }

  /**
   * Update existing manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {Object} updates - Fields to update
   * @param {Array} installedFiles - Updated list of installed files
   */
  async update(bmadDir, updates, installedFiles = null) {
    const manifest = (await this.read(bmadDir)) || {};

    // Merge updates
    Object.assign(manifest, updates);
    manifest.lastUpdated = new Date().toISOString();

    // If new file list provided, reparse metadata
    let fileMetadata = manifest.files || [];
    if (installedFiles) {
      fileMetadata = await this.parseInstalledFiles(installedFiles);
    }

    const manifestPath = path.join(bmadDir, '_cfg', 'manifest.csv');
    await fs.ensureDir(path.dirname(manifestPath));

    const csvContent = this.generateManifestCsv({ ...manifest, ...updates }, fileMetadata);
    await fs.writeFile(manifestPath, csvContent, 'utf8');

    return { ...manifest, ...updates, files: fileMetadata };
  }

  /**
   * Add a module to the manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name to add
   */
  async addModule(bmadDir, moduleName) {
    const manifest = await this.read(bmadDir);
    if (!manifest) {
      throw new Error('No manifest found');
    }

    if (!manifest.modules) {
      manifest.modules = [];
    }

    if (!manifest.modules.includes(moduleName)) {
      manifest.modules.push(moduleName);
      await this.update(bmadDir, { modules: manifest.modules });
    }
  }

  /**
   * Remove a module from the manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name to remove
   */
  async removeModule(bmadDir, moduleName) {
    const manifest = await this.read(bmadDir);
    if (!manifest || !manifest.modules) {
      return;
    }

    const index = manifest.modules.indexOf(moduleName);
    if (index !== -1) {
      manifest.modules.splice(index, 1);
      await this.update(bmadDir, { modules: manifest.modules });
    }
  }

  /**
   * Add an IDE configuration to the manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} ideName - IDE name to add
   */
  async addIde(bmadDir, ideName) {
    const manifest = await this.read(bmadDir);
    if (!manifest) {
      throw new Error('No manifest found');
    }

    if (!manifest.ides) {
      manifest.ides = [];
    }

    if (!manifest.ides.includes(ideName)) {
      manifest.ides.push(ideName);
      await this.update(bmadDir, { ides: manifest.ides });
    }
  }

  /**
   * Parse installed files to extract metadata
   * @param {Array} installedFiles - List of installed file paths
   * @param {string} bmadDir - Path to bmad directory for relative paths
   * @returns {Array} Array of file metadata objects
   */
  async parseInstalledFiles(installedFiles, bmadDir) {
    const fileMetadata = [];

    for (const filePath of installedFiles) {
      const fileExt = path.extname(filePath).toLowerCase();
      // Make path relative to parent of bmad directory, starting with 'bmad/'
      const relativePath = 'bmad' + filePath.replace(bmadDir, '').replaceAll('\\', '/');

      // Handle markdown files - extract XML metadata
      if (fileExt === '.md') {
        try {
          if (await fs.pathExists(filePath)) {
            const content = await fs.readFile(filePath, 'utf8');
            const metadata = this.extractXmlNodeAttributes(content, filePath, relativePath);

            if (metadata) {
              fileMetadata.push(metadata);
            }
          }
        } catch (error) {
          console.warn(`Warning: Could not parse ${filePath}:`, error.message);
        }
      }
      // Handle other file types (CSV, JSON, etc.)
      else {
        fileMetadata.push({
          file: relativePath,
          type: fileExt.slice(1), // Remove the dot
          name: path.basename(filePath, fileExt),
          title: null,
        });
      }
    }

    return fileMetadata;
  }

  /**
   * Extract XML node attributes from MD file content
   * @param {string} content - File content
   * @param {string} filePath - File path for context
   * @param {string} relativePath - Relative path starting with 'bmad/'
   * @returns {Object|null} Extracted metadata or null
   */
  extractXmlNodeAttributes(content, filePath, relativePath) {
    // Look for XML blocks in code fences
    const xmlBlockMatch = content.match(/```xml\s*([\s\S]*?)```/);
    if (!xmlBlockMatch) {
      return null;
    }

    const xmlContent = xmlBlockMatch[1];

    // Extract root XML node (agent, task, template, etc.)
    const rootNodeMatch = xmlContent.match(/<(\w+)([^>]*)>/);
    if (!rootNodeMatch) {
      return null;
    }

    const nodeType = rootNodeMatch[1];
    const attributes = rootNodeMatch[2];

    // Extract name and title attributes (id not needed since we have path)
    const nameMatch = attributes.match(/name="([^"]*)"/);
    const titleMatch = attributes.match(/title="([^"]*)"/);

    return {
      file: relativePath,
      type: nodeType,
      name: nameMatch ? nameMatch[1] : null,
      title: titleMatch ? titleMatch[1] : null,
    };
  }

  /**
   * Generate CSV manifest content
   * @param {Object} data - Manifest data
   * @param {Array} fileMetadata - File metadata array
   * @param {Object} moduleConfigs - Module configuration data
   * @returns {string} CSV content
   */
  generateManifestCsv(data, fileMetadata, moduleConfigs = {}) {
    const timestamp = new Date().toISOString();
    let csv = [];

    // Header section
    csv.push(
      '# BMAD Manifest',
      `# Generated: ${timestamp}`,
      '',
      '## Installation Info',
      'Property,Value',
      `Version,${data.version}`,
      `InstallDate,${data.installDate || timestamp}`,
      `LastUpdated,${data.lastUpdated || timestamp}`,
    );
    if (data.language) {
      csv.push(`Language,${data.language}`);
    }
    csv.push('');

    // Modules section
    if (data.modules && data.modules.length > 0) {
      csv.push('## Modules', 'Name,Version,ShortTitle');
      for (const moduleName of data.modules) {
        const config = moduleConfigs[moduleName] || {};
        csv.push([moduleName, config.version || '', config['short-title'] || ''].map((v) => this.escapeCsv(v)).join(','));
      }
      csv.push('');
    }

    // IDEs section
    if (data.ides && data.ides.length > 0) {
      csv.push('## IDEs', 'IDE');
      for (const ide of data.ides) {
        csv.push(this.escapeCsv(ide));
      }
      csv.push('');
    }

    // Files section
    if (fileMetadata.length > 0) {
      csv.push('## Files', 'Type,Path,Name,Title');
      for (const file of fileMetadata) {
        csv.push([file.type || '', file.file || '', file.name || '', file.title || ''].map((v) => this.escapeCsv(v)).join(','));
      }
    }

    return csv.join('\n');
  }

  /**
   * Parse CSV manifest content back to object
   * @param {string} csvContent - CSV content to parse
   * @returns {Object} Parsed manifest data
   */
  parseManifestCsv(csvContent) {
    const result = {
      modules: [],
      ides: [],
      files: [],
    };

    const lines = csvContent.split('\n');
    let section = '';

    for (const line_ of lines) {
      const line = line_.trim();

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) {
        // Check for section headers
        if (line.startsWith('## ')) {
          section = line.slice(3).toLowerCase();
        }
        continue;
      }

      // Parse based on current section
      switch (section) {
        case 'installation info': {
          // Skip header row
          if (line === 'Property,Value') continue;

          const [property, ...valueParts] = line.split(',');
          const value = this.unescapeCsv(valueParts.join(','));

          switch (property) {
            // Path no longer stored in manifest
            case 'Version': {
              result.version = value;
              break;
            }
            case 'InstallDate': {
              result.installDate = value;
              break;
            }
            case 'LastUpdated': {
              result.lastUpdated = value;
              break;
            }
            case 'Language': {
              result.language = value;
              break;
            }
          }

          break;
        }
        case 'modules': {
          // Skip header row
          if (line === 'Name,Version,ShortTitle') continue;

          const parts = this.parseCsvLine(line);
          if (parts[0]) {
            result.modules.push(parts[0]);
          }

          break;
        }
        case 'ides': {
          // Skip header row
          if (line === 'IDE') continue;

          result.ides.push(this.unescapeCsv(line));

          break;
        }
        case 'files': {
          // Skip header row
          if (line === 'Type,Path,Name,Title') continue;

          const parts = this.parseCsvLine(line);
          if (parts.length >= 2) {
            result.files.push({
              type: parts[0] || '',
              file: parts[1] || '',
              name: parts[2] || null,
              title: parts[3] || null,
            });
          }

          break;
        }
        // No default
      }
    }

    return result;
  }

  /**
   * Parse a CSV line handling quotes and commas
   * @param {string} line - CSV line to parse
   * @returns {Array} Array of values
   */
  parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(this.unescapeCsv(current));
        current = '';
      } else {
        current += char;
      }
    }

    // Add the last field
    result.push(this.unescapeCsv(current));

    return result;
  }

  /**
   * Escape CSV special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeCsv(text) {
    if (!text) return '';
    const str = String(text);

    // If contains comma, newline, or quote, wrap in quotes and escape quotes
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return '"' + str.replaceAll('"', '""') + '"';
    }

    return str;
  }

  /**
   * Unescape CSV field
   * @param {string} text - Text to unescape
   * @returns {string} Unescaped text
   */
  unescapeCsv(text) {
    if (!text) return '';

    // Remove surrounding quotes if present
    if (text.startsWith('"') && text.endsWith('"')) {
      text = text.slice(1, -1);
      // Unescape doubled quotes
      text = text.replaceAll('""', '"');
    }

    return text;
  }

  /**
   * Load module configuration files
   * @param {Array} modules - List of module names
   * @returns {Object} Module configurations indexed by name
   */
  async loadModuleConfigs(modules) {
    const configs = {};

    for (const moduleName of modules) {
      // Handle core module differently - it's in src/core not src/modules/core
      const configPath =
        moduleName === 'core'
          ? path.join(process.cwd(), 'src', 'core', 'config.yaml')
          : path.join(process.cwd(), 'src', 'modules', moduleName, 'config.yaml');

      try {
        if (await fs.pathExists(configPath)) {
          const yaml = require('js-yaml');
          const content = await fs.readFile(configPath, 'utf8');
          configs[moduleName] = yaml.load(content);
        }
      } catch (error) {
        console.warn(`Could not load config for module ${moduleName}:`, error.message);
      }
    }

    return configs;
  }
}

module.exports = { Manifest };
