#!/usr/bin/env node

/**
 * BMad Method CLI - Direct execution wrapper for npx
 * This file ensures proper execution when run via npx from GitHub or npm registry
 */

// Simply delegate to the CLI tool
require('./cli/bmad-cli.js');
