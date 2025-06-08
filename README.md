# The BMAD-Method V4 (Breakthrough Method of AgileAI Driven Development)

## 🚀 Quick Start (No Installation Required!)

### Option 1: Use Pre-built Web Bundles (Easiest)

**No Node.js needed! Just download and use:**

1. Go to the [`/web-bundles/`](web-bundles/) folder in this repo
2. Download a bundle file:
   - **Team bundles** in [`/web-bundles/teams/`](web-bundles/teams/) - Full agile teams with all roles
   - **Individual agents** in [`/web-bundles/agents/`](web-bundles/agents/) - Single role agents
3. Upload to your AI platform:
   - **Gemini**: Create a new Gem → Upload the bundle file → Start using!
   - **ChatGPT**: Create a custom GPT → Attach as knowledge → Start using!

That's it! You're ready to use BMAD agents. 🎉

### Option 2: IDE Agents (Also No Installation)

For Cursor, Windsurf, or other IDEs:

1. Copy the `bmad-core/` folder to your project root
2. Use agents from `bmad-core/ide-agents/`
3. Set up slash commands (see examples in `.cursor/` or `.claude/commands/`)

## What is BMAD?

BMAD is a framework that gives you a complete Agile development team powered by AI. Each agent specializes in a specific role:

- **🧠 Business Analyst** - Requirements gathering and project briefs
- **📋 Product Manager** - PRDs and product planning
- **👁️ UX Expert** - User experience design and UI specifications
- **🏗️ Architect** - System design and technical architecture
- **🔄 Fullstack Architect** - Holistic full-stack system design
- **🎨 Design Architect** - UI/UX and frontend architecture
- **✅ Product Owner** - Story validation and backlog management
- **📝 Scrum Master** - Story generation and sprint planning
- **💻 Developer** - Code implementation
- **🧪 QA Engineer** - Testing and quality assurance

The **BMAD Orchestrator** can transform into any role using slash commands!

## 🛠️ Advanced: Build Custom Bundles

Only needed if you want to customize agents:

1. Clone this repository
2. Install Node.js and run `npm install`
3. Modify agents in `/agents/` folder
4. Run `npm run build`
5. Find your custom bundles in `/dist/`

### Configuring Custom Agents

- Edit YAML files in `/agents/` to customize behavior
- Create new team combinations in `team-*.yml` files
- All configuration is now YAML-based for easy editing

### IDE Slash Commands

For Cursor, Windsurf, VSCode, and Claude Code: Check the `.cursor/` or `.claude/commands/` folders for example slash command setups. These let you quickly switch between agents in your IDE!

## 📚 Documentation

- [Detailed Setup Guide](docs/instruction.md)
- [IDE Setup Guide](docs/ide-setup.md)
- [BMAD Knowledge Base](bmad-core/data/bmad-kb.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

## Previous Versions

- [Version 3](https://github.com/bmadcode/BMAD-METHOD/tree/V3)
- [Version 2](https://github.com/bmadcode/BMAD-METHOD/tree/V2)
- [Version 1](https://github.com/bmadcode/BMAD-METHOD/tree/V1)

---

Thank you and enjoy! - BMad

[MIT License](docs/LICENSE)
