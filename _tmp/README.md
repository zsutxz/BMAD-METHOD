# BMAD Method Documentation

This directory contains documentation for the BMAD Method workflow, which is a comprehensive approach to software development using AI agents.

## Directory Structure

- **agents/**: Contains definitions for each agent role in the BMAD Method workflow
- **docs/templates/**: Contains templates for various documentation artifacts
- **gems-and-gpts/**: Contains GPT configurations and templates

## Agent Roles

The BMAD Method workflow involves the following agent roles:

1. **Analyst**: Market & Business Analyst who specializes in market research and collaborative ideation.
2. **Product Manager (PM)**: Translates ideas to detailed requirements and structures work into epics/stories.
3. **Architect**: Translates requirements into robust technical designs optimized for AI agent development.
4. **Product Owner (PO)**: Validates and approves the complete MVP plan before development.
5. **Scrum Master (SM)**: Prepares clear, detailed, self-contained instructions for developer agents.
6. **Developer**: Implements requirements from story files while following project standards.
7. **Documentation**: Manages, scaffolds, and audits technical documentation for software projects.

## Workflow Phases

The BMAD Method workflow consists of these phases:

1. **Brainstorming & Analysis**: Use the Analyst agent to explore ideas and create a Project Brief.
2. **Product Definition**: Use the PM agent to create detailed PRD and epic files.
3. **Architecture Design**: Use the Architect agent to create technical architecture documents.
4. **Validation**: Use the PO agent to validate the complete plan before development.
5. **Story Generation**: Use the SM agent to create detailed story files for development.
6. **Implementation**: Use the Dev agent to implement the stories.
7. **Documentation**: Use the Documentation agent to manage technical documentation throughout the project.

## Documentation Agent

The Documentation agent is responsible for managing, scaffolding, and auditing technical documentation for software projects. It operates based on a dispatch system using specific commands:

### Supported Commands

- `scaffold new` - Create a new documentation structure
- `scaffold existing` - Organize existing documentation
- `scaffold {path}` - Scaffold documentation for a specific path
- `update {path|feature|keyword}` - Update documentation for a specific area
- `audit` - Perform a full documentation audit
- `audit prd` - Audit documentation against product requirements
- `audit {component}` - Audit documentation for a specific component

See `agents/docs-agent.md` for more details on the Documentation agent.

## Agent Configuration

See `agents/instructions.md` for details on how to configure these agents in various IDEs.
