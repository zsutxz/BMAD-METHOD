# Expanded Documentation

## Quick Start Guide

Choose your path based on what you want to do:

### 🚀 Path 1: Use Pre-built Web Bundles (Easiest - No Installation)

Want to use BMAD agents with Gemini or ChatGPT? Just grab a pre-built bundle:

1. **Navigate to `/web-bundles/`** in this repository
   - Team bundles: `/web-bundles/teams/` (full agile teams)
   - Individual agents: `/web-bundles/agents/` (specific roles)
2. **Upload to your AI platform**
   - Gemini: Create a new Gem, upload the bundle file
   - ChatGPT: Create a custom GPT, attach the bundle file
3. **Start using immediately!**

**No Node.js, no npm, no build process needed!**

### 💻 Path 2: IDE-Only Usage (No Installation)

Just need agents in your IDE (Cursor, Windsurf)?

1. **Copy the bmad-core folder** to your project root:
   ```bash
   cp -r /path/to/BMAD-METHOD/bmad-core /your-project-root/
   ```
2. **Use IDE agents directly**:
   - Most common: `sm.ide.md` (story generation) and `dev.ide.md` (development)
   - Find them in `bmad-core/ide-agents/`
   - Copy content into your IDE's custom agent settings

**That's it! No build process required.**

### 🛠️ Path 3: Customize & Build Your Own (Installation Required)

Want to modify agents or create custom bundles?

1. **Copy bmad-core** to your project
2. **Install dependencies**: `npm install`
3. **Customize** agents in `/agents/`, team bundles in `/agent-teams/`, or resources in `/bmad-core/`
4. **Build**: `npm run build`

## When Do You Need npm install?

**You DON'T need it if:**
- Using pre-built bundles from `/web-bundles/`
- Only using IDE agents as-is
- Not modifying configurations

**You DO need it if:**
- Customizing agent YAML files
- Creating new team bundles
- Modifying bmad-core and rebuilding

## IDE Project Quickstart

For the fastest IDE setup:

1. Copy `bmad-core` to your project root
2. Set up `sm.ide.md` and `dev.ide.md` as custom agents
3. Start building!

The agents expect:
- Docs in `(project-root)/docs/`
- Stories in `(project-root)/docs/stories/`

For other agents, use the [IDE orchestrator](../bmad-core/utils/agent-switcher.ide.md) - one agent that can become any role!

[Detailed Setup Instructions](./instruction.md) | [IDE Setup Guide](./ide-setup.md)

## Advancing AI-Driven Development

Welcome to the BMAD Method v4! This latest version represents a complete architectural redesign with powerful new features while maintaining the ease of use you expect.

## What's New in v4?

### 🏗️ Complete Architectural Redesign
- **Modular build system** with dependency resolution and optimization
- **Pre-built bundles** ready to use - no installation required
- **Dual environment support** - optimized for both web UIs and IDEs
- **Bundle optimization** automatically deduplicates shared resources

### 🤖 Enhanced Agent System
- All IDE agents optimized to under 6K characters (Windsurf compatible)
- **BMAD Orchestrator** - one agent that can transform into any role
- **Slash commands** for quick agent switching (`/pm`, `/architect`, etc.)
- **Configurable agents** - customize who does what in your workflow

### 📈 Advanced Features
- **Dependency graphs** to visualize agent relationships
- **Validation system** ensures all configurations are correct
- **YAML-based configuration** for easy customization
- **Task system** keeps agents lean while providing on-demand functionality

### 🚀 Improved Workflow
- **Pre-built web bundles** in `/web-bundles/` - just upload and use
- **Better prompting techniques** for more accurate artifacts
- **Flexible methodology** - define Agile your way

Get started with the default setup or customize everything - the choice is yours! See the [detailed instructions](./instruction.md) for configuration options.

## What is the BMad Method?

The BMad Method is a revolutionary approach that elevates "vibe coding" to advanced project planning to ensure your developer agents can start and completed advanced projects with very explicit guidance. It provides a structured yet flexible framework to plan, execute, and manage software projects using a team of specialized AI agents.

This method and tooling is so much more than just a task runner - this is a refined tool that will help you bring out your best ideas, define what you really are to build, and execute on it! From ideation, to PRD creation, to the technical decision making - this will help you do it all with the power of advanced LLM guidance.

The method is designed to be tool-agnostic in principle, with agent instructions and workflows adaptable to various AI platforms and IDEs.

## Agile Agents

Agents are programmed either directly self contained to drop right into an agent config in the ide - or they can be configured as programmable entities the orchestrating agent can become.

### Web Agents

Gemini 2.5 or Open AI customGPTs are created by running the node build script to generate output to a build folder. This output is the full package to create the orchestrator web agent.

See the detailed [Web Orchestration Setup and Usage Instructions](./instruction.md#setting-up-web-agent-orchestrator)

### IDE Agents

There are dedicated self contained agents that are stand alone, and also an IDE version of an orchestrator. For there standalone, there are:

- [Dev IDE Agent](../bmad-core/personas/dev.ide.md)
- [Story Generating SM Agent](../bmad-core/personas/sm.ide.md)

If you want to use the other agents, you can use the other agents from that folder - but some will be larger than Windsurf allows - and there are many agents. So its recommended to either use 1 off tasks - OR even better - use the IDE Orchestrator Agent. See these [set up and Usage instructions for IDE Orchestrator](./instruction.md#ide-agent-setup-and-usage).

## Tasks

Located in `bmad-core/tasks/`, these self-contained instruction sets allow IDE agents or the orchestrators configured agents to perform specific jobs. These also can be used as one off commands with a vanilla agent in the ide by just referencing the task and asking the agent to perform it.

**Purpose:**

- **Reduce Agent Bloat:** Avoid adding rarely used instructions to primary agents.
- **On-Demand Functionality:** Instruct any capable IDE agent to execute a task by providing the task file content.
- **Versatility:** Handles specific functions like running checklists, creating stories, sharding documents, indexing libraries, etc.

Think of tasks as specialized mini-agents callable by your main IDE agents.
