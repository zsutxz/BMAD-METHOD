# BMAD Method Agents

This directory contains the agent definitions for the BMAD Method workflow. Each agent has a specific role in the development process.

## Available Agents

1. **Analyst** (`analyst.md`): Market & Business Analyst who specializes in market research and collaborative ideation.
2. **Product Manager** (`pm-agent.md`): Translates ideas to detailed requirements and structures work into epics/stories.
3. **Architect** (`architect-agent.md`): Translates requirements into robust technical designs optimized for AI agent development.
4. **Product Owner** (`po.md`): Validates and approves the complete MVP plan before development.
5. **Developer** (`dev-agent.md`): Implements requirements from story files while following project standards.
6. **Scrum Master** (`sm-agent.md`): Prepares clear, detailed, self-contained instructions for developer agents.
7. **Documentation** (`docs-agent.md`): Manages, scaffolds, and audits technical documentation for software projects.

## Workflow Phases

The BMAD Method workflow consists of these phases:

1. **Brainstorming & Analysis**: Use the Analyst agent to explore ideas and create a Project Brief.
2. **Product Definition**: Use the PM agent to create detailed PRD and epic files.
3. **Architecture Design**: Use the Architect agent to create technical architecture documents.
4. **Validation**: Use the PO agent to validate the complete plan before development.
5. **Story Generation**: Use the SM agent to create detailed story files for development.
6. **Implementation**: Use the Dev agent to implement the stories.
7. **Documentation**: Use the Documentation agent to manage technical documentation throughout the project.

## Documentation Agent Commands

The Documentation agent supports the following commands:

- `scaffold new` - Create a new documentation structure
- `scaffold existing` - Organize existing documentation
- `scaffold {path}` - Scaffold documentation for a specific path
- `update {path|feature|keyword}` - Update documentation for a specific area
- `audit` - Perform a full documentation audit
- `audit prd` - Audit documentation against product requirements
- `audit {component}` - Audit documentation for a specific component

## Agent Configuration

See `instructions.md` for details on how to configure these agents in various IDEs.
