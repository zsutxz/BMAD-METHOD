# BMAD-METHOD

AI agent orchestration framework for software development. Provides specialized AI agents that function as a complete Agile development team.

## Overview

BMAD-METHOD (Breakthrough Method of AgileAI Driven Development) transforms software development workflows by providing 10 specialized AI agents that handle different aspects of the development lifecycle.

## Features

### Specialized Agents

- Business Analyst: Requirements gathering and project briefs
- Product Manager: Product roadmaps and PRDs
- UX Expert: User experience design and UI specifications
- Solution Architect: System design and technical architecture
- Product Owner: Story validation and backlog management
- Scrum Master: Story generation and sprint planning
- Developer: Code implementation
- QA Specialist: Testing and quality assurance
- BMAD Orchestrator: Role transformation via slash commands and BMAD Method Tutor
- BMAD Master: Universal executor of all capabilities without role switching

### Team Configurations

- Team All: Complete agile team with all roles
- Team Fullstack: Full-stack application development focus
- Team No-UI: Backend/service development without UX roles

### Structured Workflows

- Greenfield: New project workflows (fullstack, service, UI)
- Brownfield: Existing project workflows (fullstack, service, UI)
- Decision guidance for complex and simple project paths

## Installation

### Option 1: Web Bundles (No Installation)

1. Download pre-built bundles from `.bmad-core/web-bundles/`
2. Upload to ChatGPT or Gemini
3. Set instructions: "Your critical operating instructions are attached, you ARE the BMad Agent..."
4. Start with `/help` command if unsure what to do!

### Option 2: IDE Integration

1. Copy `.bmad-core/` to project root
2. Use agents from `.bmad-core/agents/`
3. Configure IDE slash commands

### Option 3: Build Custom Bundles

```bash
git clone [repository]
npm install
npm run build
```

Find bundles in `dist/`

## Build Commands

```bash
npm run build          # Build all bundles
npm run build:agents   # Build agent bundles only
npm run build:teams    # Build team bundles only
npm run list:agents    # List available agents
npm run validate       # Validate configurations
```

## Project Structure

```
.bmad-core/
├── agents/          # Individual agent definitions
├── agent-teams/     # Team configurations
├── workflows/       # Development workflows
├── templates/       # Document templates
├── tasks/          # Reusable task definitions
├── checklists/     # Quality checklists
├── data/           # Knowledge base
└── web-bundles/    # Pre-built bundles

expansion-packs/     # Modular extensions
tools/              # Build and CLI tools
```

## Technical Details

- Language: JavaScript
- Runtime: Node.js 14.0.0+
- Configuration: YAML-based
- License: [MIT](LICENSE)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Author

Brian (BMad) Madison

## Version

4.0.0

See [versions.md](docs/versions.md) for previous versions and history.
