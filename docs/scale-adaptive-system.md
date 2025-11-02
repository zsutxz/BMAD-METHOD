# BMad Method Scale Adaptive System

**Automatically adapts workflows to project complexity - from bug fixes to enterprise systems**

---

## Overview

The **Scale Adaptive System** is BMad Method's intelligent workflow orchestration that automatically adjusts planning depth, documentation requirements, and implementation processes based on project size and complexity.

### The Problem It Solves

Traditional methodologies apply the same process to every project:

- ❌ **Overkill:** Bug fix requires full design docs
- ❌ **Insufficient:** Enterprise system built with minimal planning
- ❌ **One-Size-Fits-None:** Same process for 1 story and 100 stories

### The Solution

BMad Method **adapts workflows to match project scale**:

- ✅ **Level 0 (1 story):** Tech-spec only, implement immediately
- ✅ **Level 2 (10 stories):** PRD + Architecture, structured approach
- ✅ **Level 4 (100+ stories):** Full enterprise planning, comprehensive docs

**Result:** Right amount of planning for every project - no more, no less.

---

## Key Terminology

### Analysis Phase

**What it is:** Discovery and research phase that informs planning decisions.

**Activities:**

- **Brainstorming:** Ideation and creative exploration
- **Research:** Market analysis, technical investigation, user research
- **Product Brief:** High-level vision and requirements capture

**When used:**

- Optional for Level 0-1 (quick changes)
- Recommended for Level 2 (provides context)
- Required for Level 3-4 (critical for complex systems)

---

### Tech-Spec (Technical Specification)

**What it is:** Comprehensive technical plan for implementing changes or features. Serves as the **primary planning document** for Level 0-1 projects.

**Contents:**

- Problem statement and solution approach
- Source tree changes (specific files)
- Technical implementation details
- Detected stack and conventions (brownfield)
- UX/UI considerations (if user-facing)
- Testing strategy
- Developer resources

**When used:**

- **Level 0:** Single story technical plan
- **Level 1:** Feature technical plan with epic
- **Level 2-4:** Not used (PRD + Architecture instead)

**Replacement at Level 2+:** Tech-spec is **replaced by PRD + Architecture** for proper product and system planning.

---

### Epic-Tech-Spec (Epic Technical Specification)

**What it is:** Detailed technical planning document created **during implementation** for each epic in Level 2-4 projects.

**Difference from Tech-Spec:**

- **Tech-spec (Level 0-1):** Created upfront, serves as primary planning doc
- **Epic-tech-spec (Level 2-4):** Created just-before-implementation per epic, supplements PRD + Architecture

**Contents:**

- Epic-specific technical details
- Detailed implementation approach for this epic
- Code-level design decisions
- Epic-scoped testing strategy
- Integration points with other epics

**When used:**

- **Recommended** for Level 2-4 during implementation phase
- Created as each epic is worked on
- Particularly important for:
  - Complex epics with many stories
  - Novel technical approaches
  - Integration-heavy epics
  - Performance-critical features

---

### Architecture Document

**What it is:** System-wide design document that defines structure, components, and interactions.

**Scale-Adaptive:**

- **Level 0-1:** Not used
- **Level 2:** Optional - lightweight architecture if needed
- **Level 3:** Required - comprehensive system architecture
- **Level 4:** Required - enterprise-grade architecture

**Contents:**

- System components and their responsibilities
- Data models and schemas
- Integration patterns
- Security architecture
- Performance considerations
- Deployment architecture
- **Scales in complexity** with project level

**Note:** Architecture document takes the place of tech-spec for system-level planning in Level 2-4 projects.

---

### Document-Project Workflow

**What it is:** Brownfield codebase analysis workflow that creates comprehensive documentation of existing code.

**Output:** `docs/index.md` with sharded sections covering:

- Project structure
- Key modules and services
- Existing patterns
- Dependencies
- Configuration

**Critical for Brownfield:**
🚨 **Run document-project BEFORE starting any brownfield project (Level 0-4)**

**Why it matters:**

- Tech-spec workflow uses this for brownfield analysis
- PRD workflow references it for context
- Architecture workflow builds on existing structure
- Epic-tech-specs reference existing code

**When to run:**

- Before workflow-init for brownfield projects
- When joining an existing codebase
- After major refactors (to update docs)

---

## The Five Levels

### Level 0: Single Atomic Change

**Examples:** Bug fixes, typos, single-file changes

| Aspect              | Details                                          |
| ------------------- | ------------------------------------------------ |
| **Stories**         | 1 story                                          |
| **Planning Docs**   | Tech-spec only                                   |
| **Architecture**    | None                                             |
| **Best For**        | Bug fixes, small patches, quick updates          |
| **Brownfield Prep** | Run document-project first (if not already done) |

**Workflow:**

```
(Brownfield: document-project first)
↓
Analysis (optional) → Tech-Spec → Implement
```

**Keywords:** fix, bug, typo, small change, quick update, patch

---

### Level 1: Small Feature

**Examples:** OAuth login, search feature, user profile page

| Aspect              | Details                                             |
| ------------------- | --------------------------------------------------- |
| **Stories**         | 1-10 stories (typically 2-3)                        |
| **Planning Docs**   | Tech-spec with epic                                 |
| **Architecture**    | None                                                |
| **UX Design**       | Optional - can be included in tech-spec or separate |
| **Best For**        | Small coherent features, rapid prototyping          |
| **Brownfield Prep** | Run document-project first (if not already done)    |

**Workflow:**

```
(Brownfield: document-project first)
↓
Analysis (optional) → Tech-Spec + Epic → (Optional UX Design) → Implement
```

**UX Note:** Level 1 tech-spec can include UX/UI considerations inline, or you can optionally run separate UX Design workflow if the UI is complex.

**Keywords:** simple, basic, small feature, add, minor

---

### Level 2: Medium Project

**Examples:** Admin dashboard, customer portal, reporting system

| Aspect              | Details                                                     |
| ------------------- | ----------------------------------------------------------- |
| **Stories**         | 5-15 stories across multiple epics                          |
| **Planning Docs**   | PRD + Epics                                                 |
| **Architecture**    | Optional - lightweight architecture if system design needed |
| **UX Design**       | Optional - recommended for UI-heavy projects                |
| **Epic-Tech-Specs** | Recommended during implementation per epic                  |
| **Best For**        | Multiple related features, focused products                 |
| **Brownfield Prep** | Run document-project first (if not already done)            |

**Workflow:**

```
(Brownfield: document-project first)
↓
Analysis (recommended) → PRD + Epics → (Optional) UX Design → (Optional) Architecture → Implement
                                                                                            ↓
                                                                           Epic-Tech-Spec per epic (recommended)
                                                                                            ↓
                                                                           Retrospective after each epic (if >1 epic)
```

**Architecture Note:** Level 2 uses optional **Architecture document** (not tech-spec) if system design is needed. For projects that don't need architecture, PRD + Epics are sufficient.

**Epic-Tech-Specs:** As you implement each epic, create epic-tech-spec for detailed technical guidance. If you have 3 epics, you'll create 3 epic-tech-specs during implementation.

**Retrospectives:** After completing each epic (when there are multiple), run retrospective to capture learnings before starting the next epic.

**Keywords:** dashboard, several features, admin panel, medium

---

### Level 3: Complex System

**Examples:** E-commerce platform, SaaS product, multi-module system

| Aspect              | Details                                            |
| ------------------- | -------------------------------------------------- |
| **Stories**         | 12-40 stories with subsystems                      |
| **Planning Docs**   | PRD + Epics + System Architecture                  |
| **Architecture**    | Required - comprehensive system design             |
| **UX Design**       | Recommended for user-facing systems                |
| **Epic-Tech-Specs** | Recommended during implementation per epic         |
| **Gate Checks**     | Required - validate cohesion before implementation |
| **Best For**        | Complex integrations, multi-subsystem products     |
| **Brownfield Prep** | Run document-project first (if not already done)   |

**Workflow:**

```
(Brownfield: document-project first)
↓
Analysis + Research → PRD + Epics → (Recommended) UX Design → Architecture (required) → Gate Check → Implement
                                                                                                      ↓
                                                                                     Epic-Tech-Spec per epic (recommended)
                                                                                                      ↓
                                                                                     Retrospective after each epic
```

**Gate Check:** Validates PRD + UX + Architecture cohesion before starting implementation. Prevents costly rework.

**Epic-Tech-Specs:** For complex epics, create detailed epic-tech-spec before implementation. These provide code-level design decisions that Architecture doesn't cover.

**Additional Detail Docs:** For very novel or complex subsystems, you may create additional technical design documents beyond epic-tech-specs. These are created as-needed, not upfront.

**Keywords:** platform, integration, complex, system, architecture

---

### Level 4: Enterprise Scale

**Examples:** Multi-product suite, enterprise ecosystem, platform with multiple apps

| Aspect              | Details                                                        |
| ------------------- | -------------------------------------------------------------- |
| **Stories**         | 40+ stories across products                                    |
| **Planning Docs**   | Comprehensive PRD + Epics + Enterprise Architecture            |
| **Architecture**    | Required - enterprise-grade system design                      |
| **UX Design**       | Recommended - design system and patterns                       |
| **Epic-Tech-Specs** | Recommended during implementation per epic                     |
| **Gate Checks**     | Required - multiple validation gates                           |
| **Best For**        | Multi-tenant systems, product ecosystems, enterprise platforms |
| **Brownfield Prep** | Run document-project first (if not already done)               |

**Workflow:**

```
(Brownfield: document-project first)
↓
Analysis + Research → PRD + Epics → UX Design → Enterprise Architecture → Gate Check → Implement
                                                                                          ↓
                                                                         Epic-Tech-Spec per epic (recommended)
                                                                                          ↓
                                                                         Additional design docs for complex subsystems
                                                                                          ↓
                                                                         Retrospective after each epic
```

**Enterprise Architecture:** More comprehensive than Level 3, includes:

- Multi-tenancy design
- Security architecture
- Scalability planning
- Integration architecture
- Data architecture
- Deployment architecture

**Additional Design Documents:** For enterprise complexity, you may need supplementary technical documents:

- Detailed subsystem designs
- Integration specifications
- Performance optimization plans
- Security implementation guides

These are created **during implementation** as needed, not all upfront.

**Keywords:** enterprise, multi-tenant, multiple products, ecosystem, scale

---

## Workflow Comparison

| Level | Analysis    | Planning         | Architecture | Epic-Tech-Specs   | Stories | Retrospectives          |
| ----- | ----------- | ---------------- | ------------ | ----------------- | ------- | ----------------------- |
| **0** | Optional    | Tech-spec        | None         | N/A (no epics)    | 1       | N/A                     |
| **1** | Optional    | Tech-spec + Epic | None         | N/A (single epic) | 2-3     | N/A                     |
| **2** | Recommended | PRD              | Optional     | Recommended       | 5-15    | After each epic (if >1) |
| **3** | Required    | PRD              | Required     | Recommended       | 12-40   | After each epic         |
| **4** | Required    | PRD              | Required     | Recommended       | 40+     | After each epic         |

---

## Documentation Progression

### Level 0-1: Tech-Spec as Primary Doc

**Why tech-spec for Level 0-1?**

- Changes are focused and atomic
- Context is specific to implementation
- Speed is priority
- Full product planning is overkill

**Tech-spec contents:**

- Technical approach
- File-level changes
- Implementation guide
- Testing strategy
- **Includes UX considerations** if user-facing

**Created:** Upfront, serves as complete planning doc

---

### Level 2: PRD + Optional Architecture

**Why PRD instead of tech-spec?**

- Multiple features need coordination
- Product vision and requirements matter
- Stakeholder alignment needed
- Feature interdependencies exist

**PRD contents:**

- Product vision and goals
- Feature requirements
- Epics and story breakdown
- Success criteria
- User experience considerations

**Architecture (optional):**

- Only if system design needed
- Lightweight architectural decisions
- Component interactions
- Data models

**Epic-tech-specs (recommended during implementation):**

- Created as each epic is worked on
- Detailed technical guidance per epic
- Supplements PRD with implementation details

**Created:** PRD upfront, epic-tech-specs during implementation

---

### Level 3-4: PRD + Architecture + Epic-Tech-Specs

**Why comprehensive planning?**

- Complex integrations
- Multiple subsystems
- Long-term maintainability
- Risk management
- Team coordination

**PRD contents:**

- Comprehensive product vision
- Detailed requirements
- Business objectives
- Market considerations
- Complete epic breakdown

**Architecture (required):**

- System design
- Component architecture
- Data models
- Integration patterns
- Security design
- Performance requirements
- **Scales with complexity** (Level 3 vs Level 4)

**Epic-tech-specs (recommended during implementation):**

- Created before implementing each epic
- Code-level design decisions
- Epic-specific implementation approach
- Detailed testing strategy

**Additional design docs (as-needed):**

- For novel or complex subsystems
- Created during implementation
- Not all created upfront
- Examples: detailed integration specs, performance optimization plans

**Created:** PRD + Architecture upfront, epic-tech-specs and detail docs during implementation

---

## Brownfield Projects: Document-Project First

### Critical Workflow Step

🚨 **For ALL brownfield projects (Level 0-4):**

**BEFORE running any workflow:**

1. Run `document-project` workflow
2. This analyzes your codebase and creates `docs/index.md`
3. Output includes sharded documentation of:
   - Project structure
   - Key modules
   - Existing patterns
   - Dependencies
   - Configuration

**Why it's critical:**

- **Tech-spec workflow** (Level 0-1) uses this for auto-detection
- **PRD workflow** (Level 2-4) references existing code
- **Architecture workflow** (Level 3-4) builds on existing structure
- **Epic-tech-specs** reference existing implementations

### Brownfield Workflow Pattern

```
Step 1: document-project (FIRST!)
         ↓
         Creates docs/index.md with codebase analysis
         ↓
Step 2: workflow-init OR tech-spec directly
         ↓
         Uses docs/index.md for context
         ↓
Step 3: Continue with level-appropriate workflows
```

**Without document-project:**

- Workflows can't detect existing patterns
- Convention analysis won't work
- Integration planning is incomplete
- You'll miss existing code to reuse

---

## Tech-Spec vs Epic-Tech-Spec

### When to Use Each

| Document           | Level | Created When             | Purpose                                         |
| ------------------ | ----- | ------------------------ | ----------------------------------------------- |
| **Tech-Spec**      | 0-1   | Upfront (Planning Phase) | Primary planning doc for small changes/features |
| **Epic-Tech-Spec** | 2-4   | During Implementation    | Detailed technical guidance per epic            |

### Tech-Spec (Level 0-1)

**Characteristics:**

- Created in Planning Phase
- Serves as primary/only planning document
- Comprehensive for the entire change/feature
- Includes all context needed for implementation
- Can include UX considerations inline

**Workflow context:**

```
Planning Phase: Tech-Spec created here
                     ↓
Implementation Phase: Stories implemented using tech-spec
```

### Epic-Tech-Spec (Level 2-4)

**Characteristics:**

- Created in Implementation Phase
- Supplements PRD + Architecture
- Focused on single epic
- Detailed code-level design
- References architecture decisions

**Workflow context:**

```
Planning Phase: PRD + Architecture created here
                     ↓
Implementation Phase:
  - Epic 1 starts
  - Create epic-tech-spec-1 (just-before-implementation)
  - Implement stories for epic 1
  - Retrospective
  - Epic 2 starts
  - Create epic-tech-spec-2
  - Implement stories for epic 2
  - Retrospective
  - ...
```

**Why not created upfront?**

- Implementation learnings inform later epic-tech-specs
- Avoids over-planning details that may change
- Keeps specs fresh and relevant
- Retrospectives provide input for next epic-tech-spec

---

## Level 2 Architecture vs Tech-Spec

### The Question

"What takes the place of architecture with Level 2 since there is no tech-spec?"

### The Answer

Level 2 uses **Architecture document (optional)** instead of tech-spec for system-level planning.

**Comparison:**

| Aspect       | Tech-Spec (Level 0-1)                | Architecture (Level 2)             |
| ------------ | ------------------------------------ | ---------------------------------- |
| **Purpose**  | Implementation plan for small change | System design for medium project   |
| **Scope**    | Single change or small feature       | Multiple epics and features        |
| **Focus**    | Code-level details                   | System-level design                |
| **When**     | Replaces need for PRD+Arch           | Supplements PRD                    |
| **Required** | Yes (primary doc)                    | Optional (if system design needed) |

**Level 2 Documentation Options:**

**Option A: PRD Only (no architecture)**

- For projects that don't need system design
- Features are independent
- No complex integrations
- Example: Admin dashboard with CRUD screens

**Option B: PRD + Architecture**

- For projects needing system design
- Components interact
- Integrations exist
- Example: Customer portal with notifications, webhooks, reporting

**Plus Epic-Tech-Specs (recommended):**

- Created during implementation
- One per epic
- Detailed technical guidance
- References Architecture decisions (if architecture exists)

---

## Retrospectives in Multi-Epic Projects

### When to Run Retrospectives

**Trigger:** After completing each epic in Level 2-4 projects **when there are multiple epics**

**Example:**

- Level 2 project with 3 epics
- Complete Epic 1 → Retrospective
- Complete Epic 2 → Retrospective
- Complete Epic 3 → Final retrospective

**Purpose:**

- Capture learnings from completed epic
- Identify improvements for next epic
- Adjust approach based on what worked/didn't
- Feed insights into next epic-tech-spec

### Retrospective Contents

- What went well?
- What could be improved?
- Technical insights gained
- Process adjustments needed
- Input for next epic planning

**Output feeds into:**

- Next epic-tech-spec
- Architecture refinements
- Team process improvements

---

## How Level Detection Works

### Automatic Detection (workflow-init)

When you run `workflow-init`, it analyzes your project description using:

#### 1. **Keyword Analysis**

Scans for level-specific keywords:

**Level 0 Keywords:**

- fix, bug, typo, small change, quick update, patch

**Level 1 Keywords:**

- simple, basic, small feature, add, minor

**Level 2 Keywords:**

- dashboard, several features, admin panel, medium

**Level 3 Keywords:**

- platform, integration, complex, system, architecture

**Level 4 Keywords:**

- enterprise, multi-tenant, multiple products, ecosystem, scale

#### 2. **Story Count Estimation**

Asks about expected scope:

| Level   | Story Range   |
| ------- | ------------- |
| Level 0 | 1 story       |
| Level 1 | 1-10 stories  |
| Level 2 | 5-15 stories  |
| Level 3 | 12-40 stories |
| Level 4 | 40+ stories   |

#### 3. **Complexity Indicators**

- Multiple teams involved?
- External integrations?
- Compliance requirements?
- Multi-tenant needs?
- Existing system modifications? (triggers brownfield)

### Manual Override

You can always override the detected level if workflow-init gets it wrong. The system is a guide, not a constraint.

---

## Field Types: Greenfield vs Brownfield

Each level has **two workflow paths**:

### Greenfield (New Project)

- Starting from scratch
- No existing codebase
- Establishing new patterns
- Freedom to choose stack

**Special Features:**

- Starter template recommendations
- Modern best practices via WebSearch
- Convention establishment

**Workflow:**

```
workflow-init → Level detection → Greenfield path
```

### Brownfield (Existing Project)

- Adding to existing code
- Working with established patterns
- Integration with current systems
- Stack already chosen

**Special Features:**

- Auto-detects existing conventions
- Analyzes current patterns
- Confirms before deviating
- Respects established standards

**Workflow:**

```
document-project (FIRST!) → workflow-init → Level detection → Brownfield path
```

**Critical difference:** Brownfield requires document-project BEFORE any other workflow.

---

## Common Scenarios

### Scenario 1: Bug Fix (Level 0)

**Input:** "Fix email validation bug in login form"

**Detection:**

- Keywords: "fix", "bug"
- Estimated stories: 1

**Result:** Level 0 → Greenfield-level-0.yaml

**Workflow:**

1. (Optional) Brief analysis
2. Tech-spec with single story
3. Implement immediately

---

### Scenario 2: Small Feature (Level 1)

**Input:** "Add OAuth social login (Google, GitHub, Facebook)"

**Detection:**

- Keywords: "add", "feature"
- Estimated stories: 2-3

**Result:** Level 1 → Greenfield-level-1.yaml

**Workflow:**

1. (Optional) Research OAuth providers
2. Tech-spec with epic + 3 stories
3. (Optional) UX Design if UI is complex
4. Implement story-by-story

---

### Scenario 3: Customer Portal (Level 2)

**Input:** "Build customer portal with dashboard, tickets, billing"

**Detection:**

- Keywords: "portal", "dashboard"
- Estimated stories: 10-12

**Result:** Level 2 → Greenfield-level-2.yaml

**Workflow:**

1. Product Brief (recommended)
2. PRD with epics
3. (Optional) UX Design
4. (Optional) Architecture if system design needed
5. Implement with sprint planning
6. Create epic-tech-spec for each epic as you implement
7. Run retrospective after each epic

---

### Scenario 4: E-commerce Platform (Level 3)

**Input:** "Build full e-commerce platform with products, cart, checkout, admin, analytics"

**Detection:**

- Keywords: "platform", "full"
- Estimated stories: 30-35

**Result:** Level 3 → Greenfield-level-3.yaml

**Workflow:**

1. Research + Product Brief
2. Comprehensive PRD
3. UX Design (recommended)
4. System Architecture (required)
5. Gate check
6. Implement with phased approach
7. Create epic-tech-spec per epic before implementing
8. Run retrospective after each epic
9. Create additional design docs as needed for complex subsystems

---

### Scenario 5: Adding Feature to Existing App (Brownfield)

**Input:** "Add search functionality to existing product catalog"

**Detection:**

- Keywords: "add", "existing"
- Estimated stories: 3-4
- Field type: Brownfield

**Result:** Level 1 → Brownfield-level-1.yaml

**Critical First Step:**

1. **Run document-project** to analyze existing codebase

**Then Workflow:** 2. Tech-spec (uses document-project output for analysis) 3. Auto-detects existing patterns 4. Confirms conventions 5. Implement following existing patterns

---

## Workflow Paths Configuration

BMad Method stores workflow paths in YAML configuration files:

### Path File Structure

```
src/modules/bmm/workflows/workflow-status/paths/
├── greenfield-level-0.yaml
├── greenfield-level-1.yaml
├── greenfield-level-2.yaml
├── greenfield-level-3.yaml
├── greenfield-level-4.yaml
├── brownfield-level-0.yaml
├── brownfield-level-1.yaml
├── brownfield-level-2.yaml
├── brownfield-level-3.yaml
├── brownfield-level-4.yaml
├── game-design.yaml
└── project-levels.yaml (source of truth)
```

### Path File Format

Each path file defines:

```yaml
project_type: 'software'
level: 2
field_type: 'greenfield'
description: 'Medium project - multiple epics'

phases:
  - phase: 1
    name: 'Analysis'
    optional: true
    workflows:
      - id: 'brainstorm-project'
        optional: true
        agent: 'analyst'
        command: 'brainstorm-project'

  - phase: 2
    name: 'Planning'
    required: true
    workflows:
      - id: 'prd'
        required: true
        agent: 'pm'
        command: 'prd'
        output: 'Creates PRD with epics and stories'
```

### Phase Structure

Each level defines **4 phases**:

1. **Analysis Phase**
   - Brainstorming
   - Research
   - Product Brief
   - Complexity: Increases with level

2. **Planning Phase**
   - Level 0-1: Tech-spec
   - Level 2-4: PRD + (optional/required) Architecture

3. **Solutioning Phase**
   - Level 0-2: Skipped or optional architecture
   - Level 3-4: Required architecture + gate checks

4. **Implementation Phase**
   - Sprint planning
   - Story-by-story development
   - Epic-tech-specs created per epic (Level 2-4)
   - Retrospectives after each epic (Level 2-4)

---

## Best Practices

### 1. **Document-Project First for Brownfield**

Always run document-project before starting any brownfield workflow. This is critical for context.

### 2. **Trust the Detection**

If workflow-init suggests Level 2, there's probably complexity you haven't considered. Review before overriding.

### 3. **Start Small, Upgrade Later**

Uncertain between Level 1 and 2? Start with Level 1. You can always run PRD creation later if needed.

### 4. **Don't Skip Gate Checks**

For Level 3-4, gate checks prevent costly mistakes. Invest the time upfront.

### 5. **Create Epic-Tech-Specs Just-Before-Implementation**

For Level 2-4, create epic-tech-spec right before implementing each epic. Don't create all upfront.

### 6. **Run Retrospectives Between Epics**

Capture learnings after each epic. Feed insights into next epic-tech-spec.

### 7. **Optional UX for Level 1**

If your Level 1 feature has complex UI, run separate UX Design. Otherwise, include UX notes in tech-spec.

### 8. **Architecture Scales**

Level 2 architecture is lighter than Level 3, which is lighter than Level 4. Don't over-architect.

---

## FAQ

### Q: What's the difference between tech-spec and epic-tech-spec?

**A:**

- **Tech-spec (Level 0-1):** Created upfront in Planning Phase, serves as primary planning doc
- **Epic-tech-spec (Level 2-4):** Created during Implementation Phase per epic, supplements PRD + Architecture

### Q: Why no tech-spec at Level 2+?

**A:** At Level 2+, you need product-level planning (PRD) and optionally system-level design (Architecture). Tech-spec is too narrow. Instead, use epic-tech-specs during implementation for detailed technical guidance per epic.

### Q: Do I always need Architecture at Level 2?

**A:** No, it's optional. Only create Architecture if you need system-level design. Many Level 2 projects can work with just PRD + epic-tech-specs.

### Q: What if I forget to run document-project on brownfield?

**A:** Workflows will lack context about existing code. Run document-project and restart your workflow to get proper brownfield analysis.

### Q: Can Level 1 include UX Design?

**A:** Yes! You can either:

- Include UX considerations in the tech-spec (simpler)
- Run separate UX Design workflow (complex UI)

### Q: When do I create additional design documents?

**A:** Create them during implementation as-needed for:

- Very novel technical approaches
- Complex subsystems needing detailed design
- Integration specifications
- Performance optimization plans

Don't create them all upfront - create just-before-needed.

### Q: Can I change levels mid-project?

**A:** Yes! If you started at Level 1 but realize it's Level 2, you can run `create-prd` to add proper planning docs. The system is flexible.

---

## Summary

The Scale Adaptive System ensures:

✅ **Level 0-1:** Fast, lean, tech-spec only → Quick Spec Flow
✅ **Level 2:** Structured, PRD-driven, optional architecture, epic-tech-specs during implementation
✅ **Level 3-4:** Comprehensive, PRD + Architecture required, epic-tech-specs per epic, gate checks

**Key Principles:**

- Match planning depth to project complexity
- Tech-spec for Level 0-1, PRD + Architecture for Level 2-4
- Epic-tech-specs supplement Level 2-4 during implementation
- Document-project FIRST for all brownfield projects
- Create detailed docs just-before-needed, not all upfront

**Result:** Right amount of ceremony for every project, maximum efficiency at every scale.

---

## Learn More

- **Quick Spec Flow (Level 0-1):** [docs/quick-spec-flow.md](./quick-spec-flow.md)
- **Full BMM Workflows (Level 2-4):** [src/modules/bmm/workflows/README.md](../src/modules/bmm/workflows/README.md)
- **Document-Project Workflow:** Ask SM agent to run document-project
- **Run workflow-init:** Load PM agent and ask to run workflow-init
- **Path Configuration:** `src/modules/bmm/workflows/workflow-status/paths/`
- **Level Definitions:** `src/modules/bmm/workflows/workflow-status/project-levels.yaml`

---

_Scale Adaptive System - Because one size doesn't fit all._
