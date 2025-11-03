# Changelog

## [Unreleased]

## [6.0.0-alpha.4]

**Release: November 2, 2025**

This alpha release represents a major leap forward in documentation, workflow intelligence, and usability. The BMM module now features professional documentation, context-aware planning workflows, and universal document management capabilities.

### 📚 Complete Documentation Overhaul

**New Documentation Hub** (`src/modules/bmm/docs/`)

- Created centralized documentation system with 18 comprehensive guides (7000+ lines)
- Clear learning paths for greenfield, brownfield, and quick spec flows
- Professional technical writing standards throughout all documentation
- Reading time estimates and cross-referenced navigation

**New Documentation Files:**

- `README.md` - Complete documentation hub with topic navigation
- `quick-start.md` - 15-minute getting started guide
- `agents-guide.md` - Comprehensive 12-agent reference (45 min read)
- `party-mode.md` - Multi-agent collaboration guide (20 min read)
- `scale-adaptive-system.md` - Deep dive on Levels 0-4 (42 min read)
- `brownfield-guide.md` - Existing codebase development (53 min read)
- `quick-spec-flow.md` - Rapid Level 0-1 development (26 min read)
- `workflows-analysis.md` - Phase 1 workflows deep-dive (12 min read)
- `workflows-planning.md` - Phase 2 workflows deep-dive (19 min read)
- `workflows-solutioning.md` - Phase 3 workflows deep-dive (13 min read)
- `workflows-implementation.md` - Phase 4 workflows deep-dive (33 min read)
- `workflows-testing.md` - Testing & QA workflows (29 min read)
- `workflow-architecture-reference.md` - Architecture workflow technical reference
- `workflow-document-project-reference.md` - Document-project workflow technical reference
- `enterprise-agentic-development.md` - Team collaboration patterns
- `faq.md` - Comprehensive Q&A covering all common questions
- `glossary.md` - Complete BMM terminology reference
- `troubleshooting.md` - Common issues and solutions guide

**Documentation Improvements:**

- Removed version/date footers (git handles versioning automatically)
- Agent customization docs now include full rebuild process
- Consistent professional formatting and structure across all docs
- Better separation of user documentation vs developer reference

### 🤖 New Agent: Paige (Documentation Guide)

Introduced Paige, a specialized technical documentation agent:

- **Expertise:** Professional technical writing, information architecture, documentation structure
- **Integration:** Available across all BMM phases for continuous documentation support
- **Customizable:** Like all BMM agents, can be customized via sidecar files
- **Status:** Work in progress - will evolve as documentation needs grow

### 🚀 Quick Spec Flow - Intelligent Level 0-1 Planning

**Major Tech-Spec Workflow Transformation:**

- Transformed from template-filling into context-aware intelligent planning system
- Ideal for bug fixes, single endpoint additions, and small isolated changes
- Auto-detects project stack (package.json, requirements.txt, etc.)
- Analyzes brownfield codebases for conventions and patterns
- Integrates WebSearch for current framework versions and best practices

**Context-Aware Intelligence:**

- Interactive level detection (Level 0 vs Level 1)
- Brownfield convention detection with user confirmation
- Comprehensive context discovery (stack, patterns, dependencies, test frameworks)
- Auto-validation with quality scoring (no manual checklist needed)
- UX/UI considerations capture for user-facing changes

**Enhanced Tech-Spec Template:**

- Expanded from 8 to 23 sections for complete planning context
- New sections: Development Context, UX/UI Considerations, Integration Points
- Developer Resources section with file paths and testing guidance
- All sections populated via template-output tags during workflow

**Story Generation Improvements:**

- Level 0: Extract single story from comprehensive tech-spec
- Level 1: Story sequence validation with acceptance criteria quality checks
- User Story Template includes Dev Agent Record sections for implementation tracking
- Complete epic template rewrite with proper variable structure

**Phase 4 Integration:**

- Story Context and Create Story workflows now recognize tech-spec as authoritative source
- Seamless integration between Quick Spec Flow and traditional BMM workflows
- Tech-spec provides brownfield analysis, framework details, and existing patterns

### 📦 Universal Document Sharding

**New Capability: Shard-Doc Workflow**

- Split large markdown documents into organized, smaller files based on sections
- Dual-strategy loading: include individual shards OR single large document
- Configurable section level (default: level 2 headings)
- Automatic index.md generation with navigation links
- Ideal for large guides, API documentation, and knowledge bases

**Use Cases:**

- Breaking down massive planning documents for better context management
- Creating navigable documentation hierarchies
- Managing agent knowledge bases efficiently
- Optimizing context window usage during development

**Integration:**

- Available as BMad Core workflow: `/bmad:core:tools:shard-doc`
- Works with any markdown document in your project
- Preserves original file with automatic backups
- Generated shards maintain formatting and structure

### 🔧 Planning Workflow Enhancements

**Intent-Driven Discovery (Product Brief & PRD):**

- Transformed from rigid template-filling to natural conversational discovery
- Adaptive questioning based on project context (hobby/startup/enterprise)
- Real-time document building instead of end-of-session generation
- Skill-level aware facilitation (expert/intermediate/beginner)
- Context detection from user responses to guide exploration depth

**Product Brief Workflow (96% BMAD v6 compliance):**

- Intent-driven facilitation with context-appropriate probing
- Living document approach with continuous template updates
- Enhanced discovery areas: problem exploration, solution vision, user understanding
- Ruthless MVP scope management with feature prioritization
- Template improvements with context-aware conditional sections

**PRD Workflow (improved from 65% to 85%+ compliance):**

- Fixed critical config issues (missing date variable, status file extension mismatch)
- Scale-adaptive intelligence with project type detection (API/Web App/Mobile/SaaS)
- Domain complexity mapping (14 domain types with specialized considerations)
- Enhanced requirements coverage: project-type specific sections, domain considerations
- Separated epic planning into dedicated create-epics-and-stories child workflow

**Architecture Workflow:**

- Better integration with PRD outputs
- Domain complexity context support
- Enhanced technical decision capture framework

### 🛠️ Research Workflow Improvements

**Enhanced Research Capabilities:**

- Updated to use web search more frequently for current information
- Better understanding of current date context for finding latest documentation
- Improved deep research prompt generation options
- More accurate and up-to-date research results

### 🎨 User Experience Improvements

**Installer Updates:**

- Improved installation notes and guidance
- Better command examples (shard-doc uses npx command pattern)

**Workflow Cleanup:**

- Removed unused voice hooks functionality
- Cleaned up backup and temporary files
- Better workflow naming consistency

### 📋 Infrastructure & Quality

**Agent & Workflow Manifests:**

- Added Paige to agent manifest
- Updated workflow manifest with new and restructured workflows
- Better workflow-to-agent mappings across all documentation
- Updated files manifest with all new documentation

**Module Organization:**

- Streamlined BMM README to lean signpost format
- Polished root README with better hierarchy and clear CTAs
- Moved documentation from root `docs/` to module-specific locations
- Better separation of user docs vs developer reference

**Data Infrastructure:**

- New CSV data files for project types and domain complexity
- Enhanced workflow configuration with runtime variables
- Better template variable mapping and tracking

### 🔄 Breaking Changes

**File Removals:**

- Removed `src/modules/bmm/workflows/2-plan-workflows/prd/epics-template.md` (replaced by create-epics-and-stories child workflow)

**Workflow Trigger Changes:**

- PM agent: `prd` → `create-prd`
- New workflow triggers: `create-epics-and-stories`, `validate-prd`
- Game Designer agent triggers renamed for consistency

### 📖 What's Next (Beta Roadmap)

- Knowledge base integration for enhanced context management
- Web bundle functionality completion
- Additional specialized agents based on community feedback
- Enhanced multi-agent collaboration patterns
- Performance optimizations for large projects

---

### Installation

```bash
npx bmad-method@6.0.0-alpha.4 install
```

For upgrading from alpha.3:

```bash
# Backup your customizations first
npx bmad-method@6.0.0-alpha.4 install
```

### Migration Notes

If upgrading from v6.0.0-alpha.3:

1. New documentation is available in `bmad/bmm/docs/` - review the README.md for navigation
2. Tech-spec workflow now has enhanced capabilities - review `docs/quick-spec-flow.md`
3. Product Brief and PRD workflows have new conversational approaches
4. Paige agent is now available for documentation tasks
5. No breaking changes to existing project structures

---

## [6.0.0-alpha.3]

### Codex Installer

- Codex installer uses custom prompts in `.codex/prompts/`, instead of `AGENTS.md`

## [6.0.0-alpha.0]

**Release: September 28, 2025**

Initial alpha release of a major rewrite and overhaul improvement of past versions.

### Major New Features

- **Lean Core**: The core of BMad is very simple - common tasks that apply to any future module or agents, along with common agents that will be added to any modules - bmad-web-orchestrator and bmad-master.
- **BMad Method**: The new BMad Method (AKA bmm) is a complete overhaul of the v4 method, now a fully scale adaptive rewrite. The workflow now scales from small enhancements to massive undertakings across multiple services or architectures, supporting a new vast array of project type, including a full subclass of game development specifics.
- **BoMB**: The BMad Builder (AKA BoMB) now is able to fully automate creation and conversion of expansion packs from v6 to modules in v6 along with the net new ideation and brainstorming through implementation and testing of net new Modules, Workflows (were tasks and templates), Module Agents, and Standalone Personal Agents
- **CIS**: The Creative Intelligence Suite (AKA CIS)

## [v6.0.0] - SKIPPED

**Note**: Version 5.0.0 was skipped due to NPX registry issues that corrupted the version. Development continues with v6.0.0-alpha.0.

## [v4.43.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.43.0)

**Release: August-September 2025 (v4.31.0 - v4.43.1)**

Focus on stability, ecosystem growth, and professional tooling.

### Major Integrations

- **Codex CLI & Web**: Full Codex integration with web and CLI modes
- **Auggie CLI**: Augment Code integration
- **iFlow CLI**: iFlow support in installer
- **Gemini CLI Custom Commands**: Enhanced Gemini CLI capabilities

### Expansion Packs

- **Godot Game Development**: Complete game dev workflow
- **Creative Writing**: Professional writing agent system
- **Agent System Templates**: Template expansion pack (Part 2)

### Advanced Features

- **AGENTS.md Generation**: Auto-generated agent documentation
- **NPM Script Injection**: Automatic package.json updates
- **File Exclusion**: `.bmad-flattenignore` support for flattener
- **JSON-only Integration**: Compact integration mode

### Quality & Stability

- **PR Validation Workflow**: Automated contribution checks
- **Fork-Friendly CI/CD**: Opt-in mechanism for forks
- **Code Formatting**: Prettier integration with pre-commit hooks
- **Update Checker**: `npx bmad-method update-check` command

### Flattener Improvements

- Detailed statistics with emoji-enhanced `.stats.md`
- Improved project root detection
- Modular component architecture
- Binary directory exclusions (venv, node_modules, etc.)

### Documentation & Community

- Brownfield document naming consistency fixes
- Architecture template improvements
- Trademark and licensing clarity
- Contributing guidelines refinement

### Developer Experience

- Version synchronization scripts
- Manual release workflow enhancements
- Automatic release notes generation
- Changelog file path configuration

[View v4.43.1 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.43.1)

## [v4.30.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.30.0)

**Release: July 2025 (v4.21.0 - v4.30.4)**

Introduction of advanced IDE integrations and command systems.

### Claude Code Integration

- **Slash Commands**: Native Claude Code slash command support for agents
- **Task Commands**: Direct task invocation via slash commands
- **BMad Subdirectory**: Organized command structure
- **Nested Organization**: Clean command hierarchy

### Agent Enhancements

- BMad-master knowledge base loading
- Improved brainstorming facilitation
- Better agent task following with cost-saving model combinations
- Direct commands in agent definitions

### Installer Improvements

- Memory-efficient processing
- Clear multi-select IDE prompts
- GitHub Copilot support with improved UX
- ASCII logo (because why not)

### Platform Support

- Windows compatibility improvements (regex fixes, newline handling)
- Roo modes configuration
- Support for multiple CLI tools simultaneously

### Expansion Ecosystem

- 2D Unity Game Development expansion pack
- Improved expansion pack documentation
- Better isolated expansion pack installations

[View v4.30.4 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.30.4)

## [v4.20.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.20.0)

**Release: June 2025 (v4.11.0 - v4.20.0)**

Major focus on documentation quality and expanding QA agent capabilities.

### Documentation Overhaul

- **Workflow Diagrams**: Visual explanations of planning and development cycles
- **QA Role Expansion**: QA agent transformed into senior code reviewer
- **User Guide Refresh**: Complete rewrite with clearer explanations
- **Contributing Guidelines**: Clarified principles and contribution process

### QA Agent Transformation

- Elevated from simple tester to senior developer/code reviewer
- Code quality analysis and architectural feedback
- Pre-implementation review capabilities
- Integration with dev cycle for quality gates

### IDE Ecosystem Growth

- **Cline IDE Support**: Added configuration for Cline
- **Gemini CLI Integration**: Native Gemini CLI support
- **Expansion Pack Installation**: Automated expansion agent setup across IDEs

### New Capabilities

- Markdown-tree integration for document sharding
- Quality gates to prevent task completion with failures
- Enhanced brownfield workflow documentation
- Team-based agent bundling improvements

### Developer Tools

- Better expansion pack isolation
- Automatic rule generation for all supported IDEs
- Common files moved to shared locations
- Hardcoded dependencies removed from installer

[View v4.20.0 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.20.0)

## [v4.10.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.10.0)

**Release: June 2025 (v4.3.0 - v4.10.3)**

This release focused on making BMAD more configurable and adaptable to different project structures.

### Configuration System

- **Optional Core Config**: Document sharding and core configuration made optional
- **Flexible File Resolution**: Support for non-standard document structures
- **Debug Logging**: Configurable debug mode for agent troubleshooting
- **Fast Update Mode**: Quick updates without breaking customizations

### Agent Improvements

- Clearer file resolution instructions for all agents
- Fuzzy task resolution for better agent autonomy
- Web orchestrator knowledge base expansion
- Better handling of deviant PRD/Architecture structures

### Installation Enhancements

- V4 early detection for improved update flow
- Prevented double installation during updates
- Better handling of YAML manifest files
- Expansion pack dependencies properly included

### Bug Fixes

- SM agent file resolution issues
- Installer upgrade path corrections
- Bundle build improvements
- Template formatting fixes

[View v4.10.3 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.10.3)

## [v4.0.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v4.0.0)

**Release: June 20, 2025 (v4.0.0 - v4.2.0)**

Version 4 represented a complete architectural overhaul, transforming BMAD from a collection of prompts into a professional, distributable framework.

### Framework Transformation

- **NPM Package**: Professional distribution and simple installation via `npx bmad-method install`
- **Modular Architecture**: Move to `.bmad-core` hidden folder structure
- **Multi-IDE Support**: Unified support for Claude Code, Cursor, Roo, Windsurf, and many more
- **Schema Standardization**: YAML-based agent and team definitions
- **Automated Installation**: One-command setup with upgrade detection

### Agent System Overhaul

- Agent team workflows (fullstack, no-ui, all agents)
- Web bundle generation for platform-agnostic deployment
- Task-based architecture (separate task definitions from agents)
- IDE-specific agent activation (slash commands for Claude Code, rules for Cursor, etc.)

### New Capabilities

- Brownfield project support (existing codebases)
- Greenfield project workflows (new projects)
- Expansion pack architecture for domain specialization
- Document sharding for better context management
- Automatic semantic versioning and releases

### Developer Experience

- Automatic upgrade path from v3 to v4
- Backup creation for user customizations
- VSCode settings and markdown linting
- Comprehensive documentation restructure

[View v4.2.0 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v4.2.0)

## [v3.0.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v3.0.0)

**Release: May 20, 2025**

Version 3 introduced the revolutionary orchestrator concept, creating a unified agent experience.

### Major Features

- **BMad Orchestrator**: Uber-agent that orchestrates all specialized agents
- **Web-First Approach**: Streamlined web setup with pre-compiled agent bundles
- **Simplified Onboarding**: Complete setup in minutes with clear quick-start guide
- **Build System**: Scripts to compile web agents from modular components

### Architecture Changes

- Consolidated agent system with centralized orchestration
- Web build sample folder with ready-to-deploy configurations
- Improved documentation structure with visual setup guides
- Better separation between web and IDE workflows

### New Capabilities

- Single agent interface (`/help` command system)
- Brainstorming and ideation support
- Integrated method explanation within the agent itself
- Cross-platform consistency (Gemini Gems, Custom GPTs)

[View V3 Branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V3)

## [v2.0.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v2.0.0)

**Release: April 17, 2025**

Version 2 addressed the major shortcomings of V1 by introducing separation of concerns and quality validation mechanisms.

### Major Improvements

- **Template Separation**: Templates decoupled from agent definitions for greater flexibility
- **Quality Checklists**: Advanced elicitation checklists to validate document quality
- **Web Agent Discovery**: Recognition of Gemini Gems and Custom GPTs power for structured planning
- **Granular Web Agents**: Simplified, clearly-defined agent roles optimized for web platforms
- **Installer**: A project installer that copied the correct files to a folder at the destination

### Key Features

- Separated template files from agent personas
- Introduced forced validation rounds through checklists
- Cost-effective structured planning workflow using web platforms
- Self-contained agent personas with external template references

### Known Issues

- Duplicate templates/checklists for web vs IDE versions
- Manual export/import workflow between agents
- Creating each web agent separately was tedious

[View V2 Branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V2)

## [v1.0.0](https://github.com/bmad-code-org/BMAD-METHOD/releases/tag/v1.0.0)

**Initial Release: April 6, 2025**

The original BMAD Method was a tech demo showcasing how different custom agile personas could be used to build out artifacts for planning and executing complex applications from scratch. This initial version established the foundation of the AI-driven agile development approach.

### Key Features

- Introduction of specialized AI agent personas (PM, Architect, Developer, etc.)
- Template-based document generation for planning artifacts
- Emphasis on planning MVP scope with sufficient detail to guide developer agents
- Hard-coded custom mode prompts integrated directly into agent configurations
- The OG of Context Engineering in a structured way

### Limitations

- Limited customization options
- Web usage was complicated and not well-documented
- Rigid scope and purpose with templates coupled to agents
- Not optimized for IDE integration

[View V1 Branch](https://github.com/bmad-code-org/BMAD-METHOD/tree/V1)

## Installation

```bash
npx bmad-method
```

For detailed release notes, see the [GitHub releases page](https://github.com/bmad-code-org/BMAD-METHOD/releases).
