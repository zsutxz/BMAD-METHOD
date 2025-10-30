# BMAD Installation & Module System Reference

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Modules](#modules)
5. [Configuration System](#configuration-system)
6. [Platform Integration](#platform-integration)
7. [Development Guide](#development-guide)
8. [Troubleshooting](#troubleshooting)

## Overview

BMad Core is a modular AI agent framework with intelligent installation, platform-agnostic support, and configuration inheritance.

### Key Features

- **Modular Design**: Core + optional modules (BMB, BMM, CIS)
- **Smart Installation**: Interactive configuration with dependency resolution
- **Clean Architecture**: Centralized `bmad/` directory add to project, no source pollution with multiple folders added

## Architecture

### Directory Structure upon installation

```
project-root/
├── bmad/                      # Centralized installation
│   ├── _cfg/                  # Configuration
│   │   ├── agents/            # Agent configs
│   │   └── agent-manifest.csv # Agent manifest
│   ├── core/                  # Core module
│   │   ├── agents/
│   │   ├── tasks/
│   │   └── config.yaml
│   ├── bmm/                   # BMad Method module
│   │   ├── agents/
│   │   ├── tasks/
│   │   ├── workflows/
│   │   └── config.yaml
│   └── cis/                   # Creative Innovation Studio
│       └── ...
└── .claude/                   # Platform-specific (example)
    └── agents/
```

### Installation Flow

1. **Detection**: Check existing installation
2. **Selection**: Choose modules interactively or via CLI
3. **Configuration**: Collect module-specific settings
4. **Installation**: Compile Process and copy files
5. **Generation**: Create config files with inheritance
6. **Post-Install**: Run module installers
7. **Manifest**: Track installed components

### Key Exclusions

- `_module-installer/` directories are never copied to destination
- `localskip="true"` agents are filtered out
- Source `config.yaml` templates are replaced with generated configs

## Modules

### Core Module (Required)

Foundation framework with C.O.R.E. (Collaboration Optimized Reflection Engine)

- **Components**: Base agents, activation system, advanced elicitation
- **Config**: `user_name`, `communication_language`

### BMM Module

BMad Method for software development workflows

- **Components**: PM agent, dev tasks, PRD templates, story generation
- **Config**: `project_name`, `tech_docs`, `output_folder`, `story_location`
- **Dependencies**: Core

### CIS Module

Creative Innovation Studio for design workflows

- **Components**: Design agents, creative tasks
- **Config**: `output_folder`, design preferences
- **Dependencies**: Core

### Module Structure

```
src/modules/{module}/
├── _module-installer/       # Not copied to destination
│   ├── installer.js        # Post-install logic
│   └── install-config.yaml
├── agents/
├── tasks/
├── templates/
└── sub-modules/            # Platform-specific content
    └── {platform}/
        ├── injections.yaml
        └── sub-agents/
```

## Configuration System

### Collection Process

Modules define prompts in `install-config.yaml`:

```yaml
project_name:
  prompt: 'Project title?'
  default: 'My Project'
  result: '{value}'

output_folder:
  prompt: 'Output location?'
  default: 'docs'
  result: '{project-root}/{value}'

tools:
  prompt: 'Select tools:'
  multi-select:
    - 'Tool A'
    - 'Tool B'
```

### Configuration Inheritance

Core values cascade to ALL modules automatically:

```yaml
# core/config.yaml
user_name: "Jane"
communication_language: "English"

# bmm/config.yaml (generated)
project_name: "My App"
tech_docs: "/path/to/docs"
# Core Configuration Values (inherited)
user_name: "Jane"
communication_language: "English"
```

**Reserved Keys**: Core configuration keys cannot be redefined by other modules.

### Path Placeholders

- `{project-root}`: Project directory path
- `{value}`: User input
- `{module}`: Module name
- `{core:field}`: Reference core config value

### Config Generation Rules

1. ALL installed modules get a `config.yaml` (even without prompts)
2. Core values are ALWAYS included in module configs
3. Module-specific values come first, core values appended
4. Source templates are never copied, only generated configs

## Platform Integration

### Supported Platforms

**Preferred** (Full Integration):

- Claude Code
- Cursor
- Windsurf

**Additional**:
Cline, Roo, Auggie, GitHub Copilot, Codex, Gemini, Qwen, Trae, Kilo, Crush, iFlow

### Platform Features

1. **Setup Handler** (`tools/cli/installers/lib/ide/{platform}.js`)
   - Directory creation
   - Configuration generation
   - Agent processing

2. **Content Injection** (`sub-modules/{platform}/injections.yaml`)

   ```yaml
   injections:
     - file: 'bmad/bmm/agents/pm.md'
       point: 'pm-agent-instructions'
       content: |
         <i>Platform-specific instruction</i>

   subagents:
     source: 'sub-agents'
     target: '.claude/agents'
     files: ['agent.md']
   ```

3. **Interactive Config**
   - Subagent selection
   - Installation scope (project/user)
   - Feature toggles

### Injection System

Platform-specific content without source modification:

- Inject points marked in source: `<!-- IDE-INJECT-POINT:name -->`
- Content added during installation only
- Source files remain clean

## Development Guide

### Creating a Module

1. **Structure**

   ```
   src/modules/mymod/
   ├── _module-installer/
   │   ├── installer.js
   │   └── install-config.yaml
   ├── agents/
   └── tasks/
   ```

2. **Configuration** (`install-config.yaml`)

   ```yaml
   code: mymod
   name: 'My Module'
   prompt: 'Welcome message'

   setting_name:
     prompt: 'Configure X?'
     default: 'value'
   ```

3. **Installer** (`installer.js`)
   ```javascript
   async function install(options) {
     const { projectRoot, config, installedIDEs, logger } = options;
     // Custom logic
     return true;
   }
   module.exports = { install };
   ```

### Adding Platform Support

1. Create handler: `tools/cli/installers/lib/ide/myplatform.js`
2. Extend `BaseIdeSetup` class
3. Add sub-module: `src/modules/{mod}/sub-modules/myplatform/`
4. Define injections and platform agents

### Agent Configuration

Extractable config nodes:

```xml
<agent>
  <setting agentConfig="true">
    Default value
  </setting>
</agent>
```

Generated in: `bmad/_cfg/agents/{module}-{agent}.md`

## Troubleshooting

### Common Issues

| Issue                     | Solution                            |
| ------------------------- | ----------------------------------- |
| Existing installation     | Use `bmad update` or remove `bmad/` |
| Module not found          | Check `src/modules/` exists         |
| Config not applied        | Verify `bmad/{module}/config.yaml`  |
| Missing config.yaml       | Fixed: All modules now get configs  |
| Agent unavailable         | Check for `localskip="true"`        |
| \_module-installer copied | Fixed: Now excluded from copy       |

### Debug Commands

```bash
bmad install -v     # Verbose installation
bmad status -v      # Detailed status
```

### Best Practices

1. Run from project root
2. Backup `bmad/_cfg/` before updates
3. Use interactive mode for guidance
4. Review generated configs post-install

## Migration from v4

| v4                  | v6                  |
| ------------------- | ------------------- |
| Scattered files     | Centralized `bmad/` |
| Monolithic          | Modular             |
| Manual config       | Interactive setup   |
| Limited IDE support | 15+ platforms       |
| Source modification | Clean injection     |

## Technical Notes

### Dependency Resolution

- Direct dependencies (module → module)
- Agent references (cross-module)
- Template dependencies
- Partial module installation (only required files)

### File Processing

- Filters `localskip="true"` agents
- Excludes `_module-installer/` directories
- Replaces path placeholders at runtime
- Injects activation blocks

### Web Bundling

```bash
bmad bundle --web           # Filter for web deployment
npm run validate:bundles    # Validate bundles
```
