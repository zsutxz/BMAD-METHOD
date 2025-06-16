# Roo Code Custom Modes for BMAD-METHOD

This directory contains custom mode configurations for Roo Code to enable BMAD agent personalities.

## Setup

The `.roomodes` file defines all BMAD agents as custom modes using the proper `customModes:` structure. Modes are automatically available in Roo Code when you open this project.

## Available Modes



## Usage

In Roo Code:
1. Open the mode selector (usually in the status bar)
2. Select any BMAD agent mode
3. The AI will adopt that agent's personality and expertise

## File Permissions

Each agent has specific file access permissions:
- **Analysts, PM, PO, SM**: Limited to documentation files (.md, .txt)
- **Architect**: Architecture docs and configs (.md, .txt, .yml, .yaml, .json)
- **QA**: Test files and documentation
- **UX Expert**: Design-related files (.md, .css, .scss, .html, .jsx, .tsx)
- **Developer, Orchestrator, Master**: Full edit access to all files
