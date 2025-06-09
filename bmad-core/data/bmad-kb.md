# BMAD Knowledge Base

## Table of Contents

- [Overview](#overview)
- [Core Philosophy](#core-philosophy)
- [V4 Architecture](#v4-architecture)
  - [Build System](#build-system)
  - [Agent Configuration](#agent-configuration)
  - [Bundle System](#bundle-system)
  - [Web vs IDE Agents](#web-vs-ide-agents)
- [Getting Started](#getting-started)
  - [Initial Setup](#initial-setup)
  - [Build Commands](#build-commands)
  - [IDE Agent Setup](#ide-agent-setup)
- [Agent Roles](#agent-roles)
  - [Orchestrator (BMAD)](#orchestrator-bmad)
  - [Business Analyst](#business-analyst)
  - [Product Manager](#product-manager)
  - [Architect](#architect)
  - [UI Architect](#ui-architect)
  - [Product Owner](#product-owner)
  - [Scrum Master](#scrum-master)
  - [Developer](#developer)
  - [QA Engineer](#qa-engineer)
- [Workflow Guide](#workflow-guide)
  - [Typical Project Flow](#typical-project-flow)
  - [Document Management](#document-management)
  - [Story Generation](#story-generation)
- [Best Practices](#best-practices)
  - [When to Use Web vs IDE](#when-to-use-web-vs-ide)
  - [Handling Major Changes](#handling-major-changes)
  - [Task Management](#task-management)
- [Technical Reference](#technical-reference)
  - [File Structure](#file-structure)
  - [Slash Commands](#slash-commands)
  - [Task System](#task-system)
- [Agile Principles in BMAD](#agile-principles-in-bmad)
- [Contributing](#contributing)

## Overview

BMAD-METHOD (Breakthrough Method of Agile AI-driven Development) is a framework that combines AI agents with Agile development methodologies. The v4 system introduces a modular architecture with improved dependency management, bundle optimization, and support for both web and IDE environments.

### Key Features

- **Modular Agent System**: Specialized AI agents for each Agile role
- **V4 Build System**: Automated dependency resolution and optimization
- **Dual Environment Support**: Optimized for both web UIs and IDEs
- **Reusable Resources**: Portable templates, tasks, and checklists
- **Slash Command Integration**: Quick agent switching and control

## Core Philosophy

### Vibe CEO'ing

You are the "Vibe CEO" - thinking like a CEO with unlimited resources and a singular vision. Your AI agents are your high-powered team, and your role is to:

- **Direct**: Provide clear instructions and objectives
- **Refine**: Iterate on outputs to achieve quality
- **Oversee**: Maintain strategic alignment across all agents

### Core Principles

1. **MAXIMIZE_AI_LEVERAGE**: Push the AI to deliver more. Challenge outputs and iterate.
2. **QUALITY_CONTROL**: You are the ultimate arbiter of quality. Review all outputs.
3. **STRATEGIC_OVERSIGHT**: Maintain the high-level vision and ensure alignment.
4. **ITERATIVE_REFINEMENT**: Expect to revisit steps. This is not a linear process.
5. **CLEAR_INSTRUCTIONS**: Precise requests lead to better outputs.
6. **DOCUMENTATION_IS_KEY**: Good inputs (briefs, PRDs) lead to good outputs.
7. **START_SMALL_SCALE_FAST**: Test concepts, then expand.
8. **EMBRACE_THE_CHAOS**: Adapt and overcome challenges.

## V4 Architecture

The v4 system represents a complete architectural redesign focused on modularity, portability, and optimization.

### Build System

#### Core Components

- **CLI Tool** (`tools/cli.js`): Main command-line interface
- **Dependency Resolver** (`tools/lib/dependency-resolver.js`): Resolves and validates agent dependencies
- **Bundle Optimizer** (`tools/lib/bundle-optimizer.js`): Deduplicates shared resources
- **Web Builder** (`tools/builders/web-builder.js`): Generates web-compatible bundles

#### Build Process

1. **Dependency Resolution**

   - Loads agent YAML configurations
   - Resolves required resources (tasks, templates, checklists, data)
   - Validates resource existence
   - Builds dependency graphs

2. **Bundle Optimization**

   - Identifies shared resources across agents
   - Deduplicates content
   - Calculates optimization statistics

3. **Output Generation**
   - Creates optimized bundles in `/dist/`
   - Generates orchestrator configurations
   - Produces both single-file and multi-file outputs

### Agent Configuration

Agents are defined using YAML files in the `/agents/` directory:

```yaml
agent:
  name: John # Display name
  id: pm # Unique identifier
  title: Product Manager # Role title
  description: >- # Role description
    Creates and maintains PRDs...
  persona: pm # References bmad-core/personas/pm.md
  customize: "" # Optional customizations

dependencies:
  tasks: # From bmad-core/tasks/
    - create-prd
    - correct-course
  templates: # From bmad-core/templates/
    - prd-tmpl
  checklists: # From bmad-core/checklists/
    - pm-checklist
    - change-checklist
  data: # From bmad-core/data/
    - technical-preferences
```

### Bundle System

Bundles group related agents for specific use cases:

```yaml
bundle:
  name: Full Team Bundle
  description: Complete development team
  target_environment: web

agents:
  - bmad # Orchestrator
  - analyst # Business Analyst
  - pm # Product Manager
  - architect # System Architect
  - po # Product Owner
  - sm # Scrum Master
  - dev # Developer
  - qa # QA Engineer
```

### Web vs IDE Agents

#### Web Agents

- **Built from**: YAML configurations
- **Optimized for**: Large context windows (Gemini, ChatGPT)
- **Features**: Full dependency inclusion, slash commands
- **Output**: Bundled files in `/dist/teams/` or `/dist/agents/`

#### IDE Agents

- **Format**: Self-contained `.ide.md` files
- **Optimized for**: Limited context windows (<6K characters)
- **Features**: File references, specialized commands
- **Location**: `/bmad-core/ide-agents/`

## Getting Started

### Quick Start Paths

Choose the path that best fits your needs:

#### Path 1: Use Pre-built Web Bundles (No Installation Required)

For users who want to use BMAD agents as-is with web UIs (Gemini, ChatGPT):

1. **Use Pre-built Bundles** from `/web-bundles/`

   - Team bundles: `/web-bundles/teams/`
   - Individual agents: `/web-bundles/agents/`
   - These are ready-to-use and updated with each release
   - No Node.js or npm installation required

2. **Upload to Your AI Platform**
   - For Gemini: Create a new Gem and upload the bundle file
   - For ChatGPT: Create a custom GPT and attach the bundle file

#### Path 2: IDE-Only Usage (No Installation Required)

For users who only need IDE agents (Cursor, Windsurf):

1. **Copy bmad-core to Your Project**

   ```bash
   cp -r /path/to/BMAD-METHOD/bmad-core /your-project-root/
   ```

2. **Use IDE Agents Directly**
   - Find agents in `bmad-core/ide-agents/`
   - Copy agent content into your IDE's custom agent/mode settings
   - No build process needed

#### Path 3: Custom Builds (Installation Required)

For users who want to customize agents or create new bundles:

1. **Clone or Fork BMAD-METHOD Repository**

   ```bash
   git clone https://github.com/your-org/BMAD-METHOD.git
   cd BMAD-METHOD
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Modify Agents or Bundles**

   - Edit YAML files in `/agents/`
   - Update resources in `/bmad-core/`

4. **Build Your Custom Bundles**

   ```bash
   npm run build
   ```

   - Creates output in `/dist/` directory
   - Copy built files to use in your AI web platform of choice such as Gemini Gem's or ChatGPT custom GPT's

5. **Copy bmad-core to Your Project** (for IDE usage)

   ```bash
   cp -r ./bmad-core /your-project-root/
   ```

### When Do You Need npm install?

**You DON'T need npm install if you're:**

- Using pre-built web bundles from `/web-bundles/`
- Only using IDE agents from `bmad-core/ide-agents/`
- Not modifying any agent configurations

**You DO need npm install if you're:**

- Creating or Customizing agents and teams in the `/agents/` folder
- Modifying bmad-core resources and rebuilding
- Running build commands like `npm run build`

**Important:** Building always happens in the BMAD-METHOD repository folder, not in your project. Your project only contains the `bmad-core` folder for IDE agent usage.

### Build Commands (For Custom Builds Only)

Run these commands in the BMAD-METHOD repository folder:

```bash
# Build all bundles and agents
npm run build

# Build with sample update (outputs to web-bundles too)
npm run build:sample-update

# List available agents
npm run list:agents

# Analyze dependencies
npm run analyze:deps

# Validate configurations
npm run validate
```

### IDE Agent Setup

#### For IDEs with Agent/Mode Support (Cursor, Windsurf)

1. **Using Individual IDE Agents**

   - Copy content from `bmad-core/ide-agents/{agent}.ide.md`
   - Create as custom agent/mode in your IDE
   - Most commonly used: `sm.ide.md` and `dev.ide.md`

2. **Using Agent Switcher**
   - Copy content from `bmad-core/utils/agent-switcher.ide.md`
   - Create as a single agent mode
   - Access all agents through slash commands

#### Slash Commands for IDE Agents

- `/agent-list` - List available agents
- `/analyst` or `/mary` - Switch to Analyst
- `/pm` or `/john` - Switch to Product Manager
- `/architect` or `/fred` - Switch to Architect
- `/exit-agent` - Return to orchestrator

## Agent Roles

### Orchestrator (BMAD)

**Purpose**: Master coordinator that can embody any specialized agent role

**Key Features**:

- Dynamic agent switching
- Access to all agent capabilities
- Handles general BMAD queries

**When to Use**:

- Initial project guidance
- When unsure which specialist is needed
- Managing agent transitions

### Business Analyst

**Name**: Mary (Web) / Larry (IDE)  
**Purpose**: Research, requirements gathering, and project brief creation

**Outputs**:

- Project Brief
- Market Analysis
- Requirements Documentation

**Key Tasks**:

- Brainstorming sessions
- Deep research prompt generation
- Stakeholder analysis

### Product Manager

**Name**: John (Web) / Jack (IDE)  
**Purpose**: Product planning and PRD creation

**Outputs**:

- Product Requirements Document (PRD)
- Epic definitions
- High-level user stories

**Key Tasks**:

- PRD creation and maintenance
- Product ideation
- Feature prioritization

### Architect

**Name**: Fred (Web) / Mo (IDE)  
**Purpose**: System design and technical architecture

**Outputs**:

- Architecture Document
- Technical Specifications
- System Design Diagrams

**Key Tasks**:

- Architecture design
- Technology selection
- Integration planning

### UI Architect

**Name**: Jane (Web) / Millie (IDE)  
**Purpose**: UI/UX and frontend architecture

**Outputs**:

- UX/UI Specification
- Frontend Architecture
- AI UI Generation Prompts

**Key Tasks**:

- UI/UX design specifications
- Frontend technical architecture
- Component library planning

### Product Owner

**Name**: Sarah (Web) / Curly (IDE)  
**Purpose**: Backlog management and story refinement

**Outputs**:

- Refined User Stories
- Acceptance Criteria
- Sprint Planning

**Key Tasks**:

- Story validation
- Backlog prioritization
- Stakeholder alignment

### Scrum Master

**Name**: Bob (Web) / SallySM (IDE)  
**Purpose**: Agile process facilitation and story generation

**Outputs**:

- Detailed User Stories
- Sprint Plans
- Process Improvements

**Key Tasks**:

- Story generation
- Sprint facilitation
- Team coordination

### Developer

**Name**: Dana (Web) / Dev (IDE)  
**Purpose**: Story implementation

**Outputs**:

- Implemented Code
- Technical Documentation
- Test Coverage

**Specializations**:

- Frontend Developer
- Backend Developer
- Full Stack Developer
- DevOps Engineer

### QA Engineer

**Name**: Quinn  
**Purpose**: Quality assurance and testing

**Outputs**:

- Test Plans
- Bug Reports
- Quality Metrics

**Key Tasks**:

- Test case creation
- Automated testing
- Performance testing

## Workflow Guide

### Typical Project Flow

1. **Discovery Phase**

   - Analyst: Create project brief
   - PM: Initial market research

2. **Planning Phase**

   - PM: Create PRD with epics
   - Design Architect: UX/UI specifications (if applicable)

3. **Technical Design**

   - Architect: System architecture
   - Design Architect: Frontend architecture (if applicable)

4. **Validation**

   - PO: Run master checklist
   - PO: Validate document alignment

5. **Implementation**
   - SM: Generate detailed stories
   - Developer: Implement stories one by one
   - QA: Test implementations

### Document Management

#### Exporting from Web UIs

**From Gemini**:

1. Click `...` menu on response
2. Select "Copy" (copies as Markdown)
3. Save to `docs/` folder in project

**From ChatGPT**:

1. Copy generated Markdown directly
2. Save to `docs/` folder in project

#### Document Sharding

For large documents (PRD, Architecture):

```bash
# Use shard-doc task to break down large files
# This makes them easier for agents to process
```

### Story Generation

**Best Practice**: Generate stories one at a time

1. Complete current story implementation
2. Use SM agent to generate next story
3. Include context from completed work
4. Validate against architecture and PRD

## IDE Development Workflow

### Post-Planning Phase: Transition to Implementation

Once you have completed the planning phase and have your core documents saved in your project's `docs/` folder, you're ready to begin the implementation cycle in your IDE environment.

#### Required Documents

Before starting implementation, ensure you have these documents in your `docs/` folder:

- `prd.md` - Product Requirements Document with epics and stories
- `fullstack-architecture.md` OR both `architecture.md` and `front-end-architecture.md`
- `project-brief.md` (reference)
- `front-end-spec.md` (if applicable)

#### Step 1: Document Sharding

Large documents need to be broken down for IDE agents to work with effectively:

1. **Use BMAD Agent to Shard Documents**
   ```
   Please shard the docs/prd.md document using the shard-doc task
   ```
2. **Shard Architecture Documents**

   ```
   Please shard the docs/fullstack-architecture.md document using the shard-doc task
   ```

3. **Expected Folder Structure After Sharding**
   ```
   docs/
   ├── prd.md                    # Original PRD
   ├── fullstack-architecture.md # Original architecture
   ├── prd/                      # Sharded PRD content
   │   ├── epic-1.md            # Individual epic files
   │   ├── epic-2.md
   │   └── epic-N.md
   ├── fullstack-architecture/   # Sharded architecture content
   │   ├── tech-stack.md
   │   ├── data-models.md
   │   ├── components.md
   │   └── [other-sections].md
   └── stories/                  # Generated story files
       ├── epic-1/
       │   ├── story-1-1.md
       │   └── story-1-2.md
       └── epic-2/
           └── story-2-1.md
   ```

#### Step 2: SM ↔ DEV Implementation Cycle

The core development workflow follows a strict SM (Scrum Master) to DEV (Developer) cycle:

##### Story Creation (SM Agent)

1. **Switch to SM Agent**

   ```
   /sm
   ```

2. **Create Next Story**

   ```
   Please create the next story for this project
   ```

   - SM agent will check existing stories in `docs/stories/`
   - Identifies what's complete vs in-progress
   - Determines the next logical story from the epics
   - Creates a new story file with proper sequencing

3. **Manual Story Selection** (if needed)
   ```
   Please create story 1.1 from epic 1 (the first story)
   ```

##### Story Review and Approval

1. **Review Generated Story**

   - Check story file in `docs/stories/epic-X/story-X-Y.md`
   - Verify acceptance criteria are clear
   - Ensure story aligns with architecture

2. **Approve Story**
   - Edit the story file
   - Change status from `Draft` to `Approved`
   - Save the file

##### Story Development (DEV Agent)

1. **Switch to DEV Agent**

   ```
   /dev
   ```

2. **Develop Next Story**

   ```
   Please develop the next approved story
   ```

   - DEV agent will find the next `Approved` story
   - Implements code according to story requirements
   - References architecture documents from sharded folders
   - Updates story status to `InProgress` then `Review`

3. **Manual Story Selection** (if needed)
   ```
   Please develop story 1.1
   ```

##### Story Completion

1. **Verify Implementation**

   - Test the implemented functionality
   - Ensure acceptance criteria are met
   - Validate against architecture requirements

2. **Mark Story Complete**

   - Edit the story file
   - Change status from `Review` to `Done`
   - Save the file

3. **Return to SM for Next Story**
   - SM agent will now see this story as complete
   - Can proceed to create the next sequential story

#### Sequential Development Best Practices

1. **Follow Epic Order**: Complete Epic 1 before Epic 2, etc.
2. **Sequential Stories**: Complete Story 1.1 before Story 1.2
3. **One Story at a Time**: Never have multiple stories `InProgress`
4. **Clear Status Management**: Keep story statuses current
5. **Architecture Alignment**: Regularly reference sharded architecture docs

#### Story Status Flow

```
Draft → Approved → InProgress → Review → Done
  ↑         ↑          ↑          ↑       ↑
 SM      User       DEV       DEV     User
creates  approves  starts   completes verifies
```

#### Troubleshooting Common Issues

- **SM can't find next story**: Ensure current story is marked `Done`
- **DEV can't find approved story**: Check story status is `Approved`
- **Architecture conflicts**: Re-shard updated architecture documents
- **Missing context**: Reference original docs in `docs/` folder

This cycle continues until all epics and stories are complete, delivering your fully implemented project according to the planned architecture and requirements.

## Best Practices

### When to Use Web vs IDE

#### Use Web UI For

- Initial planning and strategy
- Document generation (Brief, PRD, Architecture)
- Multi-agent collaboration needs
- When you need the full orchestrator

#### Use IDE For

- Story generation (SM agent)
- Development (Dev agent)
- Quick task execution
- When working with code

### Handling Major Changes

1. **Assess Impact**

   - Which documents need updating?
   - What's the ripple effect?

2. **Re-engage Agents**

   - PM: Update PRD if scope changes
   - Architect: Revise architecture if needed
   - PO: Re-validate alignment

3. **Use Course Correction**
   - Execute `correct-course` task
   - Document changes and rationale

### Task Management

Tasks are reusable instruction sets that keep agents lean:

- **Location**: `bmad-core/tasks/`
- **Purpose**: Extract rarely-used functionality
- **Usage**: Reference or include in agent prompts

Common tasks:

- `create-prd` - PRD generation
- `shard-doc` - Document splitting
- `execute-checklist` - Run quality checks
- `create-next-story` - Story generation

## Technical Reference

### File Structure

```text
bmad-core/
├── personas/          # Agent personality definitions
├── tasks/            # Reusable instruction sets
├── templates/        # Document templates
├── checklists/       # Quality assurance tools
├── data/            # Knowledge bases and preferences
└── ide-agents/      # Standalone IDE agent files

agents/              # Individual agent YAML configurations
agent-teams/         # Team bundle configurations (team-*.yml)
tools/              # Build tooling and scripts
dist/               # Build output
```

### Slash Commands

#### Orchestrator Commands

- `/help` - Get help
- `/agent-list` - List available agents
- `/{agent-id}` - Switch to agent (e.g., `/pm`)
- `/{agent-name}` - Switch by name (e.g., `/john`)
- `/exit-agent` - Return to orchestrator
- `/party-mode` - Group chat with all agents
- `/yolo` - Toggle YOLO mode

#### IDE Agent Commands (with \* prefix)

- `*help` - Agent-specific help
- `*create` - Create relevant artifact
- `*list-templates` - Show available templates
- Agent-specific commands (e.g., `*create-prd`)

### Task System

Tasks provide on-demand functionality:

1. **Reduce Agent Size**: Keep core agents under 6K characters
2. **Modular Capabilities**: Add features as needed
3. **Reusability**: Share across multiple agents

Example task usage:

```text
Please execute the create-prd task from bmad-core/tasks/create-prd.md
```

## Agile Principles in BMAD

### Mapping to Agile Values

1. **Individuals and Interactions**

   - BMAD: Active direction of AI agents
   - Focus on clear communication with agents

2. **Working Software**

   - BMAD: Rapid iteration and implementation
   - Stories implemented one at a time

3. **Customer Collaboration**

   - BMAD: Vibe CEO as primary stakeholder
   - Continuous review and refinement

4. **Responding to Change**
   - BMAD: Embrace chaos and adapt
   - Iterative refinement built-in

### Agile Practices in BMAD

- **Sprint Planning**: PO and SM manage stories
- **Daily Standups**: Progress tracking via agents
- **Retrospectives**: Built into iteration cycles
- **Continuous Integration**: Dev agents implement incrementally

## Contributing

### Getting Involved

1. **GitHub Discussions**: Share ideas and use cases
2. **Issue Reporting**: Check existing issues first
3. **Feature Requests**: Explain value proposition

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Follow existing conventions
4. Write clear commit messages
5. Submit PR against main branch

### License

MIT License - See LICENSE file for details

---

**Remember**: You are the Vibe CEO. Think big, iterate fast, and leverage your AI team to achieve ambitious goals!
