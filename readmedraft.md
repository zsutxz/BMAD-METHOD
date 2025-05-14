# The BMAD-Method (Breakthrough Method of Agile (ai-driven) Development)

**Welcome to the BMAD Method! This repository documents the V2 methodology (stable) and introduces the BETA-V3 (experimental).**

- **Stable Version (V2):** Resources located in `CURRENT-V2/`. This is the recommended version for general use.
- **Experimental Beta (V3):** Resources located in `BETA-V3/`. Contains new features and agents currently under testing.

Quick Links:

- [V2 Setup Instructions](./CURRENT-V2/instructions.md) (For IDEs/Gems/GPTs)
- [BETA-V3 Setup Instructions](./BETA-V3/instruction.md) (For IDEs/Web/Tasks)
- [Community Discussion Forum](https://github.com/bmadcode/BMAD-METHOD/discussions)
- [Contributing Guidelines](CONTRIBUTING.md)
- [License](./LICENSE)

_Legacy V1 has been archived._

## What is the BMad Method?

The BMad Method is a revolutionary approach that elevates "vibe coding" to **"Vibe CEOing."** Unlike the spontaneity of pure vibe coding for quick prototypes, this method provides a structured yet flexible framework to plan, execute, and manage software projects using a team of specialized AI agents. It helps you build faster, cheaper, and more effectively by leveraging AI-driven processes throughout the entire product development lifecycle.

The **V2 release (in `CURRENT-V2/`)** established a robust workflow with distinct agent roles, standardized templates, and comprehensive checklists. **BETA-V3 (in `BETA-V3/`)** builds upon this foundation, refining processes and introducing new capabilities currently under evaluation.

The comprehensive, step-by-step approach transforms a product idea into a fully implemented application by:

1.  Structuring the development process into distinct AI persona-based phases.
2.  Generating detailed, high-quality artifacts at each phase.
3.  Using a sequential workflow with clear handoffs.
4.  Enabling AI to code the application based on well-defined specifications.

## Guiding Principles

These principles apply across versions, with V3 enhancing certain aspects:

- **Environment Recommendations:** Generally, initial planning phases (Analyst, PM, early Architect work) are often well-suited for Web UIs (Gems/Custom GPTs) due to their conversational nature and cost-effectiveness. Technical implementation, file management (like V3's POSM Librarian), specialized tasks (like V3's RTE-Agent or IDE Tasks), and development are typically better suited for an IDE environment with custom agent support.
- **No Rules Required (Flexibility):** Agents primarily reference project documents (PRDs, architecture docs, coding standards, etc.) rather than relying heavily on proprietary AI platform rules.
- **Iterative & Collaborative:** Emphasizes a step-by-step, interactive process where agents collaborate with the user, pausing for input and validation at key decision points.
- **Documentation Focus (Enhanced in V3):** V3 places a stronger emphasis on creating a granular, indexed `docs/` structure to improve context for AI agents and human developers.

## Agent Overview (V2 Core Agents)

The `CURRENT-V2/` system features a team of specialized AI agents. See `CURRENT-V2/agents/` for IDE modes and `CURRENT-V2/gems-and-gpts/` for Web UI versions.

### Analyst (Business Analyst, Research Assistant, Brainstorming Coach)

Starting point for new/unclear ideas. Transforms concepts into a structured **Project Brief**.

### Product Manager (PM)

Transforms ideas/briefs into detailed product plans. Creates the **Product Requirements Document (PRD)** with Epics and User Stories. V2 includes checklists for validation.

### Architect

Defines the overall technical blueprint based on the PRD. Creates the **Technical Architecture Document**.

### Product Owner (PO)

Validates the MVP plan (PRD, Architecture, Epics) against a checklist before development begins.

### Scrum Master (SM)

Technical bridge generating detailed, executable **Story Files** from approved plans, one at a time, ready for development.

### Developer Agent (Dev)

Implements features based on assigned Story Files, adhering to project architecture and standards.

## New/Enhanced Agents in BETA-V3

BETA-V3 (in `BETA-V3/`) introduces new roles and enhances existing ones:

### 0. BMAD Method Advisor (`0-bmad.md`)

A dedicated guide explaining V3 concepts, including the new agents, IDE Tasks, and workflow nuances.

### 4. Design Architect (`4-design-architect.md`)

(Engage if project has a UI)
Specializes in UI/UX (**UI/UX Spec**) and frontend technical strategy (**Frontend Architecture Doc**).

### 5. Technical POSM (`5-posm.md`)

Replaces the separate V2 PO and SM with enhanced capabilities:
**Phases:**

1.  **Master Checklist:** Validates all planning/design docs.
2.  **Librarian:** Creates granular `docs/` structure & `index.md` (IDE Recommended).
3.  **Story Creator:** Generates developer-ready **Story Files**.

### 6. Release Train Engineer (RTE-Agent) (`6-rte.md`)

Manages significant mid-project changes/pivots. Uses `rte-checklist.md` for analysis and drafts artifact updates, outputting a **Sprint Change Proposal**.

_(Note: The V3 PM and Architect agents also have refined phases and use updated V3 templates/checklists.)_

## Step-by-Step Process (V2 Typical Flow)

1.  **Analyst:** (Optional) -> **Project Brief**.
2.  **PM:** Project Brief/idea -> **PRD** (Epics, Stories).
3.  **Architect:** PRD -> **System Architecture Document**.
4.  **PO:** Validates PRD, Architecture, Epics -> **Validation Report/Approval**.
5.  **SM:** Approved plans -> Generates **Story File** (one at a time).
6.  **Developer Agent:** Implements approved story.
7.  Repeat 5 & 6 until MVP complete.
8.  **Ongoing Advisory:** Architect & PM provide support.

## BETA-V3 Process Modifications

BETA-V3 refines the flow, particularly after initial planning:

- The **Design Architect** is inserted after the Architect if a UI is required.
- The **POSM** replaces the PO and SM:
  - After planning docs are ready (PRD, Arch, Design Arch docs), **POSM (Master Checklist Phase)** validates everything.
  - After validation/updates, **POSM (Librarian Phase)** organizes the `docs/` structure.
  - Then, **POSM (Story Creator Phase)** can (but not recommended from the ide) generates stories one by one for for a full epic for the stories folder and dev agent pick up.
- The **RTE-Agent** can be engaged _at any point after story development begins_ if a major issue or pivot occurs - the RTE (Release Train Engineer) can help figure out what needs to change and how to proceed, and help update all artifacts - best run from the ide since we are mid project.

(Refer to the `BETA-V3` agent definitions for detailed flows).

## IDE Tasks (BETA-V3 Feature)

Located in `BETA-V3/tasks/`, these self-contained instruction sets allow IDE agents (in V3 mode) to perform specific one-off jobs on demand (e.g., run checklist, create next story, shard docs), reducing the need for complex agent modes.

## Tooling & Setup

### V2 (Stable - in `CURRENT-V2/`)

- **Templates:** `CURRENT-V2/docs/templates/`
- **Checklists:** `CURRENT-V2/docs/checklists/`
- **Web UI Agents (Gems/GPTs):** `CURRENT-V2/gems-and-gpts/`
- **IDE Agents:** `CURRENT-V2/agents/`
- **Setup Instructions:** `CURRENT-V2/instructions.md`

### BETA-V3 (Experimental - in `BETA-V3/`)

- **Templates:** `BETA-V3/templates/`
- **Checklists:** `BETA-V3/checklists/`
- **Web UI Agents:** `BETA-V3/web-agent-modes/`
- **IDE Agents:** `BETA-V3/ide-agent-modes/`
- **Tasks:** `BETA-V3/tasks/`
- **Setup Instructions:** `BETA-V3/instruction.md`

## Demonstration Walkthrough

The effectiveness of the BMAD Method's interactive approach is demonstrated in the [V2 Video Walkthrough](https://youtu.be/p0barbrWgQA?si=PD1RyWNVDpdF3QJf). The [`V2-FULL-DEMO-WALKTHROUGH`](./V2-FULL-DEMO-WALKTHROUGH/demo.md) folder contains the full transcripts and artifacts.

A BETA-V3 specific walkthrough is planned along with multiple sample projects.
