# Instructions

> **📚 Note:** This documentation covers both legacy v3 and modern v4 systems. For new projects, use the v4 system with `bmad-core/` resources and the new build CLI.

- [V4 Build System (Recommended)](#v4-build-system-recommended)
- [Setting up Web Agent Orchestrator (V3 Legacy)](#setting-up-web-agent-orchestrator-v3-legacy)
- [IDE Agent Setup and Usage](#ide-agent-setup-and-usage)
- [Tasks Setup and Usage](#tasks)

## V4 Build System (Recommended)

The v4 system uses modular configurations and optimized dependency resolution:

```bash
# Build all web bundles
node tools/cli.js build:web

# List available agents
node tools/cli.js list:agents

# Build specific bundle
node tools/cli.js build:bundle --name "planning"
```

**Key Resources:**

- `bmad-core/`: Portable resources for copying to your projects
- `agents/`: Individual agent configurations
- `bundles/`: Bundle configurations for different use cases
- `dist/`: Optimized build outputs

## Setting up Web Agent Orchestrator

The BMAD v4 build system provides a powerful, modular approach to creating agent bundles for web-based AI platforms. It features automatic dependency resolution, resource optimization, and support for both team bundles and individual agents.

### Overview

The v4 build process is managed by the CLI tool in `tools/cli.js`. This uses a modular architecture with dependency resolution and bundle optimization to create web-compatible agent bundles.

### Quick Start Options

1. **Use Pre-built Bundles** (No installation required)
   - Find ready-to-use bundles in `/web-bundles/`
   - Upload directly to Gemini or ChatGPT

2. **Build Custom Bundles** (Requires Node.js)
   - Clone the repository
   - Run `npm install`
   - Run `npm run build`

### Prerequisites (For Custom Builds Only)

- **Node.js**: Version 14 or higher
- **npm**: Comes with Node.js

### Configuration (YAML-based)

Agents are configured using YAML files in the `/agents/` directory:

```yaml
agent:
  name: John               # Display name
  id: pm                   # Unique identifier
  title: Product Manager   # Role title
  persona: pm              # References bmad-core/personas/pm.md
  
dependencies:
  tasks:                   # From bmad-core/tasks/
    - create-prd
    - correct-course
  templates:               # From bmad-core/templates/
    - prd-tmpl
  checklists:              # From bmad-core/checklists/
    - pm-checklist
```

Team bundles are defined in the `/agent-teams/` directory as `team-*.yml` files:

```yaml
bundle:
  name: Full Team Bundle
  
agents:
  - bmad
  - analyst
  - pm
  - architect
  - po
  - sm
  - dev
  - qa
```

### Directory Structure

The BMAD v4 system uses this structure:

```
BMAD-METHOD/
├── agents/              # Individual agent YAML configurations
├── agent-teams/         # Team bundle YAML configurations
├── bmad-core/          # Core resources
│   ├── personas/       # Agent personality definitions
│   ├── tasks/         # Reusable task instructions
│   ├── templates/     # Document templates
│   ├── checklists/    # Quality checklists
│   └── data/          # Knowledge bases
├── tools/             # Build tooling
├── dist/              # Build output (gitignored)
└── web-bundles/       # Pre-built bundles (in source control)
```

### Running the Build

From the BMAD-METHOD repository root:

```bash
# Build all bundles and agents
npm run build

# Build with sample update (also outputs to web-bundles)
npm run build:sample-update

# List available agents
npm run list:agents

# Validate configurations
npm run validate
```

The build system automatically:
- Resolves all dependencies
- Optimizes shared resources
- Validates configurations
- Creates self-contained bundles

### Build Output

The build creates files in `/dist/`:

- **`/dist/teams/`**: Team bundle files
  - `full-organization-team-bundle.txt`
  - `development-team-bundle.txt`
  - etc.
  
- **`/dist/agents/`**: Individual agent files  
  - `pm.txt`
  - `architect.txt`
  - `dev.txt`
  - etc.

Each file is self-contained and ready to upload to your AI platform.

### Uploading to AI Platforms

#### For Gemini:
1. Create a new Gem
2. Upload the bundle file from `/dist/teams/` or `/dist/agents/`
3. The bundle contains everything needed - no additional files required

#### For ChatGPT:
1. Create a custom GPT
2. Attach the bundle file as knowledge
3. The GPT will have access to all agents and resources

### How the Orchestrator Works

The BMAD Orchestrator can transform into any agent defined in your bundle. It uses:
- The BMAD persona as its base personality
- Slash commands for agent switching (`/pm`, `/architect`, etc.)
- Access to all bundled resources (tasks, templates, checklists)

### Customizing Agents

To create or modify agents:

1. **Create/Edit YAML Configuration** in `/agents/`:

```yaml
agent:
  name: YourAgentName
  id: your-agent
  title: Your Agent Title
  description: What this agent does
  persona: your-persona    # References bmad-core/personas/your-persona.md
  customize: "Optional personality tweaks"

dependencies:
  tasks: 
    - task-name
  templates:
    - template-name
  checklists:
    - checklist-name
  data:
    - data-file
```

2. **Create Required Resources** in `bmad-core/`:
   - Add persona file to `personas/`
   - Add any new tasks to `tasks/`
   - Add templates to `templates/`

3. **Build and Test**:
   ```bash
   npm run validate
   npm run build
   ```

## IDE Agent Setup and Usage

The IDE Agents in V3 are designed for optimal performance within IDE environments like Windsurf and Cursor, with a focus on smaller agent sizes and efficient context management.

### Standalone IDE Agents

You can use specialized standalone IDE agents, such as the `sm.ide.md` (Scrum Master) and `dev.ide.md` (Developer), for specific roles like story generation or development tasks. These, or any general IDE agent, can also directly reference and execute tasks by providing the agent with the task definition from your `docs/tasks/` folder.

### IDE Agent Orchestrator (`ide-bmad-orchestrator.md`)

A powerful alternative is the `ide-bmad-orchestrator.md`. This agent provides the flexibility of the web orchestrator—allowing a single IDE agent to embody multiple personas—but **without requiring any build step.** It dynamically loads its configuration and all associated resources.

#### How the IDE Orchestrator Works

1. **Configuration (`ide-bmad-orchestrator.cfg.md`):**
   The orchestrator's behavior is primarily driven by a Markdown configuration file (e.g., `bmad-core/ide-bmad-orchestrator.cfg.md`, the path to which is specified within the `ide-bmad-orchestrator.md` itself). This config file has two main parts:

   - **Data Resolution:**
     Located at the top of the config file, this section defines key-value pairs for base paths. These paths tell the orchestrator where to find different types of asset files (personas, tasks, checklists, templates, data).

     ```markdown
     # Configuration for IDE Agents

     ## Data Resolution

     agent-root: (project-root)/bmad-core
     checklists: (agent-root)/checklists
     data: (agent-root)/data
     personas: (agent-root)/personas
     tasks: (agent-root)/tasks
     templates: (agent-root)/templates

     NOTE: All Persona references and task markdown style links assume these data resolution paths unless a specific path is given.
     Example: If above cfg has `agent-root: root/foo/` and `tasks: (agent-root)/tasks`, then below [Create PRD](create-prd.md) would resolve to `root/foo/tasks/create-prd.md`
     ```

     The `(project-root)` placeholder is typically interpreted as the root of your current workspace.

   - **Agent Definitions:**
     Following the `Data Resolution` section, the file lists definitions for each specialized agent the orchestrator can become. Each agent is typically introduced with a `## Title:` Markdown heading.
     Key attributes for each agent include:

     - `Name`: The specific name of the agent (e.g., `- Name: Larry`).
     - `Customize`: A string providing specific personality traits or behavioral overrides for the agent (e.g., `- Customize: "You are a bit of a know-it-all..."`).
     - `Description`: A brief summary of the agent's role and capabilities.
     - `Persona`: The filename of the Markdown file containing the agent's core persona definition (e.g., `- Persona: "analyst.md"`). This file is located using the `personas:` path from the `Data Resolution` section.
     - `Tasks`: A list of tasks the agent can perform. Each task is a Markdown link:

       - The link text is the user-friendly task name (e.g., `[Create PRD]`).
       - The link target is either a Markdown filename for an external task definition (e.g., `(create-prd.md)`), resolved using the `tasks:` path, or a special string like `(In Analyst Memory Already)` indicating the task logic is part of the persona's main definition.
         Example:

       ```markdown
       ## Title: Product Owner AKA PO

       - Name: Curly
       - Persona: "po.md"
       - Tasks:
         - [Create PRD](create-prd.md)
         - [Create Next Story](create-next-story.md)
       ```

2. **Operational Workflow (inside `ide-bmad-orchestrator.md`):**
   - **Initialization:** Upon activation in your IDE, the `ide-bmad-orchestrator.md` first loads and parses its specified configuration file (`ide-bmad-orchestrator.cfg.md`). If this fails, it will inform you and halt.
   - **Greeting & Persona Listing:** It will greet you. If your initial instruction isn't clear or if you ask, it will list the available specialist personas (by `Title`, `Name`, and `Description`) and the `Tasks` each can perform, all derived from the loaded configuration.
   - **Persona Activation:** When you request a specific persona (e.g., "Become the Analyst" or "I need Larry to help with research"), the orchestrator:
     - Finds the persona in its configuration.
     - Loads the corresponding persona file (e.g., `analyst.md`).
     - Applies any `Customize:` instructions.
     - Announces the activation (e.g., "Activating Analyst (Larry)...").
     - **The orchestrator then fully embodies the chosen agent.** Its original orchestrator persona becomes dormant.
   - **Task Execution:** Once a persona is active, it will try to match your request to one of its configured `Tasks`.
     - If the task references an external file (e.g., `create-prd.md`), that file is loaded and its instructions are followed. The active persona will use the `Data Resolution` paths from the main config to find any dependent files like templates or checklists mentioned in the task file.
     - If a task is marked as "In Memory" (or similar), the active persona executes it based on its internal definition.
   - **Context and Persona Switching:** The orchestrator embodies only one persona at a time. If you ask to switch to a different persona while one is active, it will typically advise starting a new chat session to maintain clear context. However, it allows an explicit "override safety protocol" command if you insist on switching personas within the same chat. This terminates the current persona and re-initializes with the new one.

#### Usage Instructions for IDE Orchestrator

1. **Set up your configuration (`ide-bmad-orchestrator.cfg.md`):**
   - Ensure you have an `ide-bmad-orchestrator.cfg.md` file. You can use the one located in `bmad-core/` as a template or starting point.
   - Verify that the `Data Resolution` paths at the top correctly point to your asset folders (personas, tasks, templates, checklists, data) relative to your project structure.
   - Define your desired agents with their `Title`, `Name`, `Customize` instructions, `Persona` file, and `Tasks`. Ensure the referenced persona and task files exist in the locations specified by your `Data Resolution` paths.
2. **Set up your persona and task files:**
   - Create the Markdown files for each persona (e.g., `analyst.md`, `po.md`) in your `personas` directory.
   - Create the Markdown files for each task (e.g., `create-prd.md`) in your `tasks` directory.
3. **Activate the Orchestrator:**
   - In your IDE (e.g., Cursor), select the `ide-bmad-orchestrator.md` file/agent as your active AI assistant.
4. **Interact with the Orchestrator:**
   - **Initial Interaction:**
     - The orchestrator will greet you and confirm it has loaded its configuration.
     - You can ask: "What agents are available?" or "List personas and tasks."
   - **Activating a Persona:**
     - Tell the orchestrator which persona you want: "I want to work with the Product Owner," or "Activate Curly," or "Become the PO."
   - **Performing a Task:**
     - Once a persona is active, state the task: "Create a PRD," or if the persona is "Curly" (the PO), you might say "Curly, create the next story."
     - You can also combine persona activation and task request: "Curly, I need you to create a PRD."
   - **Switching Personas:**
     - If you need to switch: "I need to talk to the Architect now."
     - The orchestrator will advise a new chat. If you want to switch in the current chat, you'll need to give an explicit override command when prompted (e.g., "Override safety protocol and switch to Architect").
   - **Follow Persona Instructions:** Once a persona is active, it will guide you based on its definition and the task it's performing. Remember that resource files like templates or checklists referenced by a task will be resolved using the global `Data Resolution` paths in the `ide-bmad-orchestrator.cfg.md`.

This setup allows for a highly flexible and dynamically configured multi-persona agent directly within your IDE, streamlining various development and project management workflows.

## Tasks

The Tasks can be copied into your project docs/tasks folder, along with the checklists and templates. The tasks are meant to reduce the amount of 1 off IDE agents - you can just drop a task into chat with any agent and it will perform the 1 off task. There will be full workflow + task coming post V3 that will expand on this - but tasks and workflows are a powerful concept that will allow us to build in a lot of capabilities for our agents, without having to bloat their overall programming and context in the IDE - especially useful for tasks that are not used frequently - similar to seldom used ide rules files.
