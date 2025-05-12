# The BMAD-Method (Breakthrough Method of Agile (ai-driven) Development) - BETA-V3

If you want to jump right in, here are the [Setup Instructions](./instruction.md) For IDE, WEB and Task setup.

## BETA-V3: Advancing AI-Driven Development

Welcome to **BETA-V3** of the BMAD Method! This version represents a significant evolution, building upon the foundations of V2 and introducing a more refined and comprehensive suite of agents, templates, and processes. The `BETA-V3` folder contains the latest implementation, designed to enhance collaboration, documentation, and the overall efficiency of developing projects with AI.

While `LEGACY-V1` and `CURRENT-V2` folders exist for historical reference, **BETA-V3** is the focus of ongoing development and represents the most advanced iteration of the BMAD Method.

## Custom Modes and Welcome Contributions

The BMAD community's input is invaluable! We encourage you to contribute by submitting Pull Requests for custom agent modes, new templates, or checklist enhancements tailored for the `BETA-V3` system. Whether for Web UIs (like Gemini Gems/Custom GPTs) or IDE custom modes, your contributions help expand our AI team's capabilities.

The Custom Agents in `BETA-V3` continue to follow best practices for LLM prompting (e.g., clear roles, instructions, and context) ensuring they work effectively across various AI platforms.

## 🔥 Demonstration Walkthrough 🔥

While a dedicated BETA-V3 video walkthrough is planned, the principles of interactive, phased agent collaboration are well-illustrated in the [V2 Video Walkthrough](https://youtu.be/p0barbrWgQA?si=PD1RyWNVDpdF3QJf). The [`V2-FULL-DEMO-WALKTHROUGH`](../V2-FULL-DEMO-WALKTHROUGH/demo.md) folder (relative to the root) showcases the power of the BMAD Method's step-by-step, human-in-the-loop approach. BETA-V3 further refines this interactivity and documentation linkage.

## What's New in BETA-V3?

BETA-V3 introduces several key enhancements to streamline your AI-driven development lifecycle:

- **Enhanced Agent Roles & Phases:** The core agents (Analyst, PM, Architect) have more clearly defined operational phases, inputs, and outputs, leading to smoother transitions.
- **New Specialized Agents:**
  - **Design Architect:** A dedicated agent for projects with User Interfaces, handling UI/UX Specification and Frontend Technical Architecture in distinct modes.
  - **Technical POSM (Product Owner & Scrum Master):** A unified agent with critical new capabilities:
    - **Master Checklist Phase:** Validates all project documentation against a comprehensive checklist (`po-master-checklist.txt`).
    - **Librarian Phase:** Decomposes large documents into a granular, indexed (`docs/index.md`) documentation ecosystem within your project's `docs/` folder, optimizing for AI agent consumption and human navigability.
    - **Story Creator Phase:** Autonomously generates detailed, developer-ready story files using the granular documentation.
- **Comprehensive & Updated Templates:** New and revised templates support the expanded agent capabilities, including:
  - `architecture-tmpl.txt` (for System Architecture)
  - `front-end-spec-tmpl.txt` (for UI/UX Specifications)
  - `front-end-architecture-tmpl.txt` (for Frontend Technical Architecture)
  - `story-tmpl.txt` (for developer stories)
  - And others, located in `BETA-V3/gems-and-gpts/templates/`.
- **Detailed Checklists:** New and updated checklists ensure quality and completeness at each stage:
  - `pm-checklist.txt`
  - `architect-checklist.txt`
  - `frontend-architecture-checklist.txt`
  - `po-master-checklist.txt` (used by the POSM)
  - Located in `BETA-V3/gems-and-gpts/checklists/`.
- **Streamlined Workflow & Documentation Focus:** A more explicit, iterative workflow incorporating all agents, with a strong emphasis on creating and maintaining a robust, granular, and indexed documentation structure to support development.
- **Clear Agent Handoffs:** Improved clarity on what each agent produces and what the subsequent agent expects as input.
- **Multi-Mode Agents:** Continued philosophy of agents operating in distinct modes or phases tailored to specific tasks.
- **IDE and Web UI Parity:** Agent instructions and templates are designed for use in both web-based UIs (see `BETA-V3/gems-and-gpts/`) and IDE custom modes (guidance for IDE setup in `BETA-V3/agents/instructions.md` - _path to be confirmed or created_).

## Guiding Principles

- **No Rules Required (Flexibility):** The BMad Method agents are designed to be self-contained or reference project-specific documents, minimizing reliance on proprietary AI platform rule systems. This promotes flexibility and avoids platform lock-in.
- **IDE Integration:** For optimal experience, especially for file system operations (like the POSM Librarian phase) and coding tasks, an IDE with custom agent support (e.g., Cursor, RooCode) is recommended. Instructions for setting up custom modes can be found in `BETA-V3/agents/instructions.md` (_path to be confirmed/created_).
- **Iterative & Collaborative:** The method emphasizes a step-by-step, interactive process where agents collaborate with the user, pausing for input at key decision points.

## What is the BMad Method?

The BMad Method is a revolutionary approach that elevates "vibe coding" to "Vibe CEOing." It provides a structured yet flexible framework to plan, execute, and manage software projects using a team of specialized AI agents. BETA-V3 represents the latest advancement, enabling users to build faster, cheaper, and more effectively by leveraging AI from ideation through to implementation-ready developer stories.

The method is designed to be tool-agnostic in principle, with agent instructions and workflows adaptable to various AI platforms and IDEs.

Join the [Community Discussion Forum](https://github.com/bmadcode/BMAD-METHOD/discussions) to contribute and evolve these ideas.

## BETA-V3 Agent Overview

The `BETA-V3` system features a refined team of specialized AI agents:

### 0. BMAD Method Advisor (`0-bmad.md`)

The primary guide to understanding and navigating the BMAD Method, explaining agent roles, workflows, and best practices.

### 1. Analyst (`1-analyst.md`)

The starting point for new or unclear ideas.

- **Phases:** Brainstorming, Deep Research (broad market/feasibility), Project Briefing.
- **Key Output:** A **Project Brief** to inform the PM.

### 2. Product Manager (PM) (`2-pm.md`)

Transforms ideas/briefs into detailed product plans.

- **Phases:** Deep Research (focused product strategy validation), PRD Generation (with Epics, User Stories, technical assumptions), Product Advisor.
- **Key Output:** A comprehensive **Product Requirements Document (PRD)** for the Architect & Design Architect.

### 3. Architect (`3-architect.md`)

Defines the overall technical blueprint of the system.

- **Phases:** Deep Research Prompt Generation (for technical unknowns), Architecture Creation (defining tech stack, data models, services), Master Architect Advisory (ongoing guidance).
- **Key Output:** The **Technical Architecture Document**.

### 4. Design Architect (`4-design-architect.md`)

Specializes in UI/UX and frontend technical strategy for projects with a user interface.

- **Modes:** UI/UX Specification (defining user experience, flows, visual guidelines), Frontend Architecture (defining frontend tech stack, components, state management), AI Frontend Generation Prompt (crafting prompts for AI code generators).
- **Key Outputs:** **UI/UX Specification Document** (`front-end-spec-tmpl.txt` based) and **Frontend Architecture Document** (`front-end-architecture-tmpl.txt` based).

### 5. Technical POSM (`5-posm.md`)

Ensures documentation quality and prepares for development.

- **Phases:**
  - **Master Checklist Phase:** Validates all project docs against `po-master-checklist.txt`. Output: **Checklist Report**.
  - **Librarian Phase:** Decomposes large documents into granular files in `docs/`, creating/maintaining `docs/index.md`. Output: **Organized granular documentation**.
  - **Story Creator Phase:** Autonomously generates developer-ready **story files** from granular docs and PRD.
- **Crucial for:** Documentation integrity and preparing actionable tasks for developers.

### 6. Developer Agents (e.g., `X-coder.md`, `Y-code-reviewer.md`)

(Specific prompts for these agents reside in `BETA-V3/agents/` or `BETA-V3/gems-and-gpts/`)
Implement features based on stories from the POSM, adhering to defined architectures and coding standards.

## BETA-V3 Step-by-Step Process (Typical Flow)

1.  **Analyst (`1-analyst.md`):** (Optional) Brainstorming, research -> **Project Brief**.
2.  **PM (`2-pm.md`):** Project Brief/idea -> **PRD** (Epics, Stories). Recommends Design Architect if UI.
3.  **Architect (`3-architect.md`):** PRD -> **System Architecture Document**.
4.  **Design Architect (`4-design-architect.md`):** (If UI) PRD, System Arch -> **UI/UX Spec**, then **Frontend Architecture Doc**. Optionally, an AI Frontend Generation Prompt.
5.  **POSM (`5-posm.md`) - Master Checklist Phase:** Validates all docs -> **Master Checklist Report**.
6.  _(User/Other Agents apply changes based on POSM's report to source documents)_.
7.  **POSM (`5-posm.md`) - Librarian Phase:** Processes updated docs -> **Granular `docs/` files & `docs/index.md`**.
8.  **POSM (`5-posm.md`) - Story Creator Phase:** Granular docs & PRD -> **Developer Story Files**.
9.  **Developer Agents:** Implement stories.
10. **Ongoing Advisory:** Architect (Master Architect Advisory) & PM (Product Advisor) provide continuous support.

_This is a guideline; the BMAD method is iterative._

## Template & Tooling Information (BETA-V3)

- **Templates:** Core templates for agent outputs (Project Brief, PRD, Architecture, Frontend Specs, Stories, etc.) are located in `BETA-V3/gems-and-gpts/templates/`.
- **Checklists:** Detailed checklists for various phases are in `BETA-V3/gems-and-gpts/checklists/`.
- **Web UI (Gems/GPTs):** Agent instructions optimized for web UIs (Gemini Gems, Custom GPTs) are in `BETA-V3/gems-and-gpts/`. Attach templates from the `templates` folder to these. See `BETA-V3/gems-and-gpts/instruction.md`.
- **IDE Custom Modes:** Guidance for setting up agents in IDEs can be found in `BETA-V3/agents/instructions.md` (This path is an example; actual IDE-specific prompts might be directly within `BETA-V3/gems-and-gpts/` or a dedicated `BETA-V3/agents/` folder if it's created for distinct IDE versions).

## License

[License](./LICENSE) (Assuming license is in root and applies)

## Contributing

Interested in improving the BMAD Method BETA-V3? See our [contributing guidelines](./CONTRIBUTING.md). (Assuming contributing guide is in root)
