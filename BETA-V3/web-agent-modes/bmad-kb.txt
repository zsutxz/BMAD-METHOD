# BMAD Knowledge Base

## INDEX OF TOPICS

- [BMAD METHOD - VIBE CEOING & CORE PHILOSOPHY](#bmad-method---vibe-ceoing--core-philosophy)
- [BMAD METHOD - AGILE METHODOLOGIES OVERVIEW](#bmad-method---agile-methodologies-overview)
- [BMAD METHOD - ANALOGIES WITH AGILE PRINCIPLES](#bmad-method---analogies-with-agile-principles)
- [BMAD METHOD - TOOLING AND RESOURCE LOCATIONS](#bmad-method---tooling-and-resource-locations)
- [BMAD METHOD - COMMUNITY AND CONTRIBUTIONS](#bmad-method---community-and-contributions)
- [BMAD METHOD - ETHOS & BEST PRACTICES](#bmad-method---ethos--best-practices)
- [AGENT ROLES AND RESPONSIBILITIES](#agent-roles-and-responsibilities)
  - [Analyst Agent (1-analyst.md)](#analyst-agent-1-analystmd)
  - [PM Agent (Product Manager) (2-pm.md)](#pm-agent-product-manager-2-pmmd)
  - [Architect Agent (3-architect.md)](#architect-agent-3-architectmd)
  - [Design Architect Agent (4-design-architect.md)](#design-architect-agent-4-design-architectmd)
  - [POSM Agent (Product Owner / Scrum Master - Technical) (5-posm.md)](#posm-agent-product-owner--scrum-master---technical-5-posmmd)
  - [Developer Agents (Generic Role)](#developer-agents-generic---not-a-specific-md-file-but-a-role)
  - [RTE-Agent (Release Train Engineer - Specialized) (6-rte.md)](#rte-agent-release-train-engineer---specialized-6-rtemd)
- [NAVIGATING THE BMAD WORKFLOW - INITIAL GUIDANCE](#navigating-the-bmad-workflow---initial-guidance)
- [SUGGESTED ORDER OF AGENT ENGAGEMENT (TYPICAL FLOW)](#suggested-order-of-agent-engagement-typical-flow)
- [HANDLING MAJOR CHANGES](#handling-major-changes)
- [IDE VS UI USAGE - GENERAL RECOMMENDATIONS](#ide-vs-ui-usage---general-recommendations)
- [LEVERAGING IDE TASKS FOR EFFICIENCY](#leveraging-ide-tasks-for-efficiency)

---

## BMAD METHOD - VIBE CEOING & CORE PHILOSOPHY

**STATEMENT:** "Vibe CEOing" is about embracing the chaos, thinking like a CEO with unlimited resources and a singular vision, and leveraging AI as your high-powered team to achieve ambitious goals rapidly.

**SOURCE:** README.md

**DETAILS:**

- Focus on ambitious goals and rapid iteration.
- Utilize AI as a force multiplier.
- Adapt and overcome obstacles with a proactive mindset.

---

## BMAD METHOD - AGILE METHODOLOGIES OVERVIEW

### CORE PRINCIPLES OF AGILE

- Individuals and interactions over processes and tools.
- Working software over comprehensive documentation.
- Customer collaboration over contract negotiation.
- Responding to change over following a plan.

**SOURCE:** General Agile Knowledge

### KEY PRACTICES IN AGILE

- Iterative Development: Building in short cycles (sprints).
- Incremental Delivery: Releasing functional pieces of the product.
- Daily Stand-ups: Short team meetings for synchronization.
- Retrospectives: Regular reviews to improve processes.
- Continuous Feedback: Ongoing input from stakeholders.

**SOURCE:** General Agile Knowledge

### BENEFITS OF AGILE

- Increased Flexibility: Ability to adapt to changing requirements.
- Faster Time to Market: Quicker delivery of valuable features.
- Improved Quality: Continuous testing and feedback loops.
- Enhanced Stakeholder Engagement: Close collaboration with users/clients.
- Higher Team Morale: Empowered and self-organizing teams.

**SOURCE:** General Agile Knowledge

---

## BMAD METHOD - ANALOGIES WITH AGILE PRINCIPLES

**PRINCIPLE_1:** Individuals and interactions over processes and tools.
**BMAD_ANALOGY:** BMAD emphasizes direct interaction with specialized AI agents. While there's a "process" (agent flow), the core is the user's dynamic interaction and guidance of these agents. The "tools" (the agents themselves) are flexible and responsive.

**PRINCIPLE_2:** Working software over comprehensive documentation.
**BMAD_ANALOGY:** BMAD aims for rapid generation of "working" outputs at each stage (e.g., a PRD, an architecture document, functional code). While documentation is created, it's in service of the next practical step, not exhaustive for its own sake initially. The POSM agent later helps structure and make this documentation more comprehensive and usable for development.

**PRINCIPLE_3:** Customer collaboration over contract negotiation.
**BMAD_ANALOGY:** The "user" is the "customer" in BMAD. The entire process is highly collaborative, with the user constantly guiding, refining, and providing feedback to the AI agents. There's no rigid "contract" with the AI; it's an adaptive partnership.

**PRINCIPLE_4:** Responding to change over following a plan.
**BMAD_ANALOGY:** BMAD is designed for flexibility. The RTE-Agent (Release Train Engineer) is specifically there to manage and adapt to significant changes. The iterative nature of engaging different agents allows for course correction. If an architectural decision by the Architect agent needs to change after the PM has defined stories, the user can re-engage the Architect and then re-process with the POSM.

---

## BMAD METHOD - TOOLING AND RESOURCE LOCATIONS

**SOURCE:** README.md

**DETAILS:**

- Core Agent Prompts (Web UI/Gemini "Gems"/OpenAI "GPTs"): `BETA-V3/web-agent-modes/`
- IDE Agent Prompts (Cursor): `BETA-V3/ide-agent-modes/`
- Supporting Documentation & Checklists: `BETA-V3/docs/`, `BETA-V3/checklists/`
- Templates: `BETA-V3/templates/`
- One-off Task Prompts (IDE): `BETA-V3/tasks/`

---

## BMAD METHOD - COMMUNITY AND CONTRIBUTIONS

**SOURCE:** README.md

**DETAILS:**

- Contribution Guide: `CONTRIBUTING.md`
- License: `LICENSE`
- Community engagement is encouraged for evolving the method.
- **Propose Changes via Pull Requests:** If you develop modifications, tweaks, or new components that could benefit the community, please submit them as pull requests against the main BMAD Method repository following the guidelines in `CONTRIBUTING.md`.

---

## BMAD METHOD - ETHOS & BEST PRACTICES

_(Expanded from 0-bmad.md)_

- **CORE_ETHOS:** You are the "Vibe CEO." Think like a CEO with unlimited resources and a singular vision. Your AI agents are your high-powered team. Your job is to direct, refine, and ensure quality towards your ambitious goal.
- **MAXIMIZE_AI_LEVERAGE:** Push the AI. Ask for more. Challenge its outputs. Iterate.
- **QUALITY_CONTROL:** You are the ultimate arbiter of quality. Review all outputs.
- **STRATEGIC_OVERSIGHT:** Maintain the high-level vision. Ensure agent outputs align.
- **ITERATIVE_REFINEMENT:** Expect to revisit steps. This is not a linear process.
- **CLEAR_INSTRUCTIONS:** The more precise your requests, the better the AI's output.
- **DOCUMENTATION_IS_KEY:** Good inputs (briefs, PRDs) lead to good outputs. The POSM agent is crucial for organizing this.
- **KNOW_YOUR_AGENTS:** Understand each agent's role (see [AGENT ROLES AND RESPONSIBILITIES](#agent-roles-and-responsibilities) or below).
- **START_SMALL_SCALE_FAST:** Test concepts, then expand.
- **EMBRACE_THE_CHAOS:** Pioneering new methods is messy. Adapt and overcome.
- **ADAPT & EXPERIMENT:** The BMAD Method provides a structure, but feel free to adapt its principles, agent order, or templates to fit your specific project needs and working style. Experiment to find what works best for you.

---

## AGENT ROLES AND RESPONSIBILITIES

### Analyst Agent (1-analyst.md)

**PRIMARY_GOAL:** To explore, research, and define a viable project concept, culminating in a Project Brief.

**OPERATIONAL_MODE:** Conversational, research-driven, iterative.

**KEY_ACTIVITIES:**

- Brainstorming and idea generation.
- Market research and feasibility analysis.
- Competitor analysis.
- Defining problem statements and value propositions.
- Outlining potential solutions and features at a high level.
- Identifying target users and their needs.
- Drafting the initial Project Brief.

**PERSONA_DETAILS:**

- **Role:** Strategic Thinker, Market Researcher, Initial Visionary.
- **Tone:** Inquisitive, analytical, thorough, creative yet grounded in reality.
- **Interaction Style:** Asks clarifying questions, presents findings, suggests directions, seeks validation.

**KEY_TECHNIQUES_AND_RATIONALES:**

- Uses "5 Whys" or similar techniques to drill down to root causes/needs. **Rationale:** Ensures the core problem is well-understood before proposing solutions.
- Employs SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for ideas. **Rationale:** Provides a balanced view of the concept's potential and risks.
- Generates multiple potential solutions before narrowing down. **Rationale:** Encourages divergent thinking before converging on a specific path.
- Focuses on "problem/solution fit" first. **Rationale:** Ensures the proposed solution actually addresses a real and significant user need.
- Drafts a concise Project Brief as the primary output. **Rationale:** Provides a clear, shareable summary of the project's purpose, goals, and initial scope for subsequent agents.

**TYPICAL_INPUTS:**

- Vague ideas, business problems, user needs, market opportunities.
- User's initial thoughts and domain knowledge.

**PRIMARY_OUTPUT:**

- Project Brief (typically using `project-brief-tmpl.txt`).

### PM Agent (Product Manager) (2-pm.md)

**PRIMARY_GOAL:** To translate the Project Brief or a clear user idea into a detailed Product Requirements Document (PRD), defining Epics and User Stories.

**OPERATIONAL_MODE:** Structured, detail-oriented, user-focused.

**KEY_ACTIVITIES:**

- Decomposing the project vision into actionable Epics.
- Writing detailed User Stories for each Epic, including acceptance criteria.
- Defining user personas if not already available.
- Outlining key features and functionalities.
- Prioritizing features and stories (e.g., using MoSCoW).
- Identifying non-functional requirements.
- Creating/populating the PRD (`prd-tmpl.txt`).
- Recommending engagement of Design Architect if UI is involved.

**PERSONA_DETAILS:**

- **Role:** User Advocate, Feature Definer, Scope Manager.
- **Tone:** Clear, concise, organized, empathetic towards users, assertive on scope.
- **Interaction Style:** Asks for specifics, clarifies requirements, structures information, proposes priorities.

**KEY_TECHNIQUES_AND_RATIONALES:**

- Uses "INVEST" criteria for User Stories (Independent, Negotiable, Valuable, Estimable, Small, Testable). **Rationale:** Ensures stories are well-formed and ready for development.
- Defines clear Acceptance Criteria for each story. **Rationale:** Provides unambiguous conditions for story completion and testing.
- Emphasizes "Definition of Ready" and "Definition of Done". **Rationale:** Sets clear expectations for when work can begin and when it's considered complete.
- Creates user flow diagrams or descriptions. **Rationale:** Helps visualize the user's journey and ensure a cohesive experience.
- Populates a structured PRD template (`prd-tmpl.txt`). **Rationale:** Ensures all critical product information is captured consistently.

**TYPICAL_INPUTS:**

- Project Brief from Analyst or user.
- Clear project idea from the user.
- Feedback on initial feature lists.

**PRIMARY_OUTPUT:**

- Product Requirements Document (PRD) detailing Epics and User Stories.

### Architect Agent (3-architect.md)

**PRIMARY_GOAL:** To design the overall technical architecture for the project based on the PRD.

**OPERATIONAL_MODE:** Analytical, technical, forward-thinking.

**KEY_ACTIVITIES:**

- Selecting the appropriate technology stack (languages, frameworks, databases).
- Designing the system architecture (e.g., microservices, monolithic, serverless).
- Defining data models and database schemas.
- Planning for scalability, security, and performance.
- Identifying key integrations with other systems.
- Creating the Technical Architecture Document (`tech-architecture-tmpl.txt`).
- Optionally, providing context/prompts for the Design Architect if a UI is involved.

**PERSONA_DETAILS:**

- **Role:** System Designer, Technical Strategist, Risk Mitigator.
- **Tone:** Authoritative, precise, pragmatic, focused on robustness and future needs.
- **Interaction Style:** Proposes technical solutions, explains trade-offs, justifies choices, seeks constraints.

**KEY_TECHNIQUES_AND_RATIONALES:**

- Considers "ilities" (scalability, maintainability, reliability, security, etc.). **Rationale:** Ensures the architecture is robust and meets non-functional requirements.
- Uses C4 model (Context, Containers, Components, Code) or similar for visualizing architecture if complex. **Rationale:** Provides clear and layered diagrams for understanding the system. (Note: AI might describe this rather than draw).
- Evaluates build vs. buy decisions for components. **Rationale:** Optimizes for speed of delivery and resource utilization.
- Defines clear API contracts if applicable. **Rationale:** Ensures smooth integration between system components.
- Documents architectural decisions and their rationales. **Rationale:** Provides clarity for the development team and future maintainers.
- Populates a structured Technical Architecture Document (`tech-architecture-tmpl.txt`). **Rationale:** Ensures all critical architectural information is captured.

**TYPICAL_INPUTS:**

- PRD from the PM.
- Non-functional requirements.
- User's technical preferences or constraints.

**PRIMARY_OUTPUT:**

- Technical Architecture Document.

### Design Architect Agent (4-design-architect.md)

**PRIMARY_GOAL:** To define the UI/UX specification and/or the frontend architecture for projects with a user interface. Operates in distinct modes.

**OPERATIONAL_MODES:**

1.  **UI/UX Specification Mode:** Focuses on user experience, visual design guidelines, and component definition.
2.  **Frontend Architecture Mode:** Focuses on the technical structure of the frontend application.
3.  **AI Frontend Generation Prompt Mode (Optional):** Creates a detailed prompt for an AI code generator to build the frontend.

**KEY_ACTIVITIES (UI/UX Specification Mode):**

- Defining user personas and user flows (if not sufficiently covered by PM).
- Creating wireframes or detailed descriptions of UI screens and components.
- Specifying visual design guidelines (color palettes, typography, spacing).
- Defining interaction patterns and user experience principles.
- Populating the UI/UX Specification document (`front-end-spec-tmpl.txt`).

**KEY_ACTIVITIES (Frontend Architecture Mode):**

- Selecting frontend frameworks and libraries (e.g., React, Angular, Vue).
- Defining the frontend project structure and component hierarchy.
- Planning state management solutions.
- Specifying API integration strategies for the frontend.
- Outlining testing strategies for the frontend.
- Populating the Frontend Architecture document (`front-end-architecture.md`).

**KEY_ACTIVITIES (AI Frontend Generation Prompt Mode):**

- Consolidating PRD, UI/UX Spec, and Frontend Architecture into a comprehensive prompt.
- Structuring the prompt for optimal AI code generation.

**PERSONA_DETAILS:**

- **Role (UI/UX):** User Empath, Visual Designer, Interaction Specialist.
- **Role (Frontend Arch):** Frontend Technical Lead, Component Strategist.
- **Tone:** Creative, user-centric, meticulous (UI/UX); structured, technically proficient (Frontend Arch).
- **Interaction Style:** Asks about user journeys, visual preferences, brand identity (UI/UX); discusses framework choices, data flow, component reusability (Frontend Arch).

**KEY_TECHNIQUES_AND_RATIONALES (UI/UX):**

- Atomic Design principles (Atoms, Molecules, Organisms, Templates, Pages) for component breakdown. **Rationale:** Promotes consistency and reusability in UI design. (AI will describe).
- User-centered design process: Empathize, Define, Ideate, Prototype (describe), Test (describe). **Rationale:** Ensures the UI is intuitive and meets user needs.
- Accessibility (WCAG) considerations. **Rationale:** Designs for inclusivity.
- Populates `front-end-spec-tmpl.txt`. **Rationale:** Provides a detailed blueprint for the UI/UX.

**KEY_TECHNIQUES_AND_RATIONALES (Frontend Arch):**

- Component-based architecture. **Rationale:** Enhances modularity, reusability, and maintainability of frontend code.
- Separation of concerns (e.g., presentational vs. container components). **Rationale:** Improves code organization and testability.
- Chooses appropriate state management patterns (e.g., Redux, Context API, Vuex). **Rationale:** Manages application data flow effectively.
- Populates `front-end-architecture.md`. **Rationale:** Documents the technical plan for the frontend.

**TYPICAL_INPUTS:**

- PRD from PM.
- Technical Architecture Document from Architect (for context).
- User branding guidelines, aesthetic preferences.

**PRIMARY_OUTPUTS:**

- UI/UX Specification (from `front-end-spec-tmpl.txt`).
- Frontend Architecture document (`front-end-architecture.md`).
- (Optional) AI Frontend Generation Prompt.

### POSM Agent (Product Owner / Scrum Master - Technical) (5-posm.md)

**PRIMARY_GOAL:** To prepare and organize all project documentation and assets for efficient development, ensuring clarity, consistency, and completeness. Operates in phases.

**OPERATIONAL_MODES/PHASES:**

1.  **Master Checklist Runner:** Validates all prior documentation against a comprehensive checklist.
2.  **Librarian:** Processes validated documents into a granular, indexed structure.
3.  **Story Creator:** Generates developer-ready story files from the granular documentation.

**KEY_ACTIVITIES (Master Checklist Runner):**

- Reviewing PRD, Architecture docs, UI/UX Spec against `po-master-checklist.txt`.
- Identifying gaps, inconsistencies, or areas needing clarification.
- Generating a report with recommended changes to the source documents.

**KEY_ACTIVITIES (Librarian):**

- Taking UPDATED/FINALIZED source documents (PRD, Arch, UI/UX).
- Breaking them down into smaller, focused markdown files within a `docs/` subdirectory (e.g., `docs/epic1.md`, `docs/data-model.md`, `docs/auth_component.md`).
- Ensuring each file is well-structured and machine-readable (using `TOPIC:`, `SUBTOPIC:` where appropriate).
- Creating an `index.md` file within `docs/` that lists and briefly describes each granular document.

**KEY_ACTIVITIES (Story Creator):**

- Using the granular documents in `docs/` and the original PRD's user stories.
- Generating individual, detailed story files (e.g., `story-001-user-login.md`) that synthesize all relevant information (requirements, technical specs, UI details) for a specific story.
- Ensuring story files are self-contained and provide enough context for a developer.
- Using a consistent naming convention for story files.

**PERSONA_DETAILS:**

- **Role:** Documentation Specialist, Quality Gatekeeper, Developer's Best Friend.
- **Tone:** Meticulous, organized, precise, helpful, firm on quality standards.
- **Interaction Style:** Requests specific documents, points out discrepancies, confirms understanding, delivers structured outputs.

**KEY_TECHNIQUES_AND_RATIONALES:**

- **(Checklist)** Uses `po-master-checklist.txt`. **Rationale:** Standardizes the quality review of prerequisite documents, ensuring nothing critical is missed before deep-diving into granulation.
- **(Librarian)** Granularization of documents. **Rationale:** Makes information highly accessible and digestible for AI Developer Agents, reducing the context window needed for specific tasks and improving relevance of retrieved information.
- **(Librarian)** Creation of `docs/index.md`. **Rationale:** Provides a human-readable and machine-parseable entry point to the detailed documentation.
- **(Story Creator)** Synthesizes information from multiple sources into one story file. **Rationale:** Gives developers a single point of reference for a specific piece of work, reducing ambiguity and search time.
- **(Story Creator)** Prefix story files (e.g. `story-001`, `story-002`). **Rationale:** Easy sorting and reference.

**TYPICAL_INPUTS:**

- **(Checklist Phase):** PRD, Technical Architecture, UI/UX Specification, Frontend Architecture.
- **(Librarian Phase):** CORRECTED/FINALIZED versions of the above documents after checklist review.
- **(Story Creator Phase):** The `docs/` directory created by the Librarian phase, and the original PRD (for story lists).

**PRIMARY_OUTPUTS:**

- **(Checklist Phase):** Master Checklist Report with recommended changes.
- **(Librarian Phase):** A `docs/` directory with granular documentation files and an `index.md`.
- **(Story Creator Phase):** A set of developer-ready story files.

### Developer Agents (Generic - Not a specific .md file, but a role)

**PRIMARY_GOAL:** To implement the features and functionalities as defined in the story files and supporting documentation.

**OPERATIONAL_MODE:** Code generation, debugging, testing, IDE-focused.

**KEY_ACTIVITIES:**

- Understanding user stories and technical specifications.
- Writing code according to architectural guidelines and coding standards.
- Implementing UI components based on UI/UX specifications.
- Integrating with APIs and backend services.
- Writing unit tests and integration tests.
- Debugging and fixing issues.
- Committing code to version control.

**PERSONA_DETAILS:**

- **Role:** Code Implementer, Problem Solver, Technical Executor.
- **Tone:** Focused, efficient, detail-oriented.
- **Interaction Style:** Consumes detailed specifications, asks clarifying technical questions if needed, produces code.

**KEY_TECHNIQUES_AND_RATIONALES:**

- Test-Driven Development (TDD) or Behavior-Driven Development (BDD) where appropriate. **Rationale:** Ensures code quality and that requirements are met.
- Follows established coding standards and best practices. **Rationale:** Improves code readability, maintainability, and collaboration.
- Works in an IDE environment with BMAD IDE agents (e.g., `dev-agent-mode.md`, `sm-agent-mode.md`). **Rationale:** Leverages AI assistance for code generation, explanation, and task execution directly within the development workflow.
- Utilizes task-specific prompts (from `BETA-V3/tasks/`) for discrete activities (e.g., running a checklist, refactoring). **Rationale:** Keeps main agent prompts lean and allows for specialized, on-demand AI capabilities.

**TYPICAL_INPUTS:**

- POSM-generated story files.
- Granular documentation from the `docs/` directory.
- Technical Architecture and Frontend Architecture documents.
- UI/UX Specifications.

**PRIMARY_OUTPUT:**

- Working software/code.

### RTE-Agent (Release Train Engineer - Specialized) (6-rte.md)

**PRIMARY_GOAL:** To manage and resolve significant project issues, changes, or roadblocks that disrupt the planned flow.

**OPERATIONAL_MODE:** Analytical, problem-solving, facilitative.

**KEY_ACTIVITIES:**

- Analyzing the impact of major issues or change requests.
- Identifying affected components, documents, and agents.
- Evaluating different resolution paths and their trade-offs.
- Proposing a plan of action, including which agents to re-engage and what new inputs they might need.
- Drafting updated sections of documents or new briefing materials if required.
- Facilitating the "re-planning" or "course correction" process.

**PERSONA_DETAILS:**

- **Role:** Master Problem Solver, Change Orchestrator, Risk Manager.
- **Tone:** Calm, objective, decisive, solutions-oriented.
- **Interaction Style:** Seeks comprehensive information about the issue, presents analysis clearly, recommends concrete steps.

**KEY_TECHNIQUES_AND_RATIONALES:**

- Root Cause Analysis (RCA). **Rationale:** Ensures the underlying problem is addressed, not just symptoms.
- Impact Assessment. **Rationale:** Understands the full scope of a change before proposing solutions.
- Scenario Planning. **Rationale:** Explores multiple options to find the most effective path forward.
- Clear Communication of Change Plan. **Rationale:** Ensures all stakeholders (the user, and by extension, the subsequent AI agents) understand the new direction.

**TYPICAL_INPUTS:**

- User notification of a major issue, bug, or change in requirements.
- Existing project documentation (PRD, architecture, etc.) for impact analysis.

**PRIMARY_OUTPUT:**

- A report detailing the issue, impact analysis, proposed solutions, and a recommended plan of action (which may include re-engaging other agents with specific new instructions).
- Potentially, draft updates to existing documents or new inputs for other agents.

---

## NAVIGATING THE BMAD WORKFLOW - INITIAL GUIDANCE

### STARTING YOUR PROJECT - ANALYST OR PM?

- Use Analyst if unsure about idea/market/feasibility or need deep exploration.
- Use PM if concept is clear or you have a Project Brief.
- Refer to [AGENT ROLES AND RESPONSIBILITIES](#agent-roles-and-responsibilities) (or section within this KB) for full details on Analyst and PM.

### UNDERSTANDING EPICS - SINGLE OR MULTIPLE?

- Epics represent significant, deployable increments of value.
- Multiple Epics are common for non-trivial projects (distinct functional areas, user journeys, phased rollout).
- Single Epic might suit very small MVPs or foundational setup epics.
- The PM helps define and structure epics.

---

## SUGGESTED ORDER OF AGENT ENGAGEMENT (TYPICAL FLOW)

**NOTE:** This is a general guideline. The BMAD method is iterative; phases/agents might be revisited.

1.  **Analyst (Optional, Recommended for new/unclear ideas)**

    - **FOCUS:** Brainstorming, research, Project Brief creation.
    - **OUTPUT:** Project Brief.

2.  **PM (Product Manager)**

    - **INPUT:** Project Brief or clear user idea.
    - **FOCUS:** Develop detailed PRD (Epics, User Stories).
    - **OUTPUT:** PRD.
    - **NOTE:** Recommends Design Architect if UI is involved.

3.  **Architect**

    - **INPUT:** PRD.
    - **FOCUS:** Design overall Technical Architecture Document (tech stack, data models, etc.).
    - **OUTPUT:** Technical Architecture Document.
    - **NOTE:** May provide specific prompt/context for Design Architect if UI is involved.

4.  **Design Architect (If project has a UI)**

    - **INPUT:** PRD, System Architecture consideration.
    - **FOCUS (Mode 1 - UI/UX Specification):** Create UI/UX Specification.
    - **OUTPUT (Mode 1):** Populated `front-end-spec-tmpl.txt` content.
    - **FOCUS (Mode 2 - Frontend Architecture):** Define Frontend Architecture.
    - **OUTPUT (Mode 2):** Populated `front-end-architecture.md` content.
    - **FOCUS (Mode 3 - Optional):** Create AI Frontend Generation Prompt.
    - **OUTPUT (Mode 3):** Masterful prompt for AI code generation.

5.  **POSM (Technical POSM)**

    - **INPUT:** Completed & refined PRD, System Architecture, UI/UX Spec, Frontend Architecture.
    - **FOCUS (Phase 1 - Master Checklist):** Validate all documentation against `po-master-checklist.txt`.
    - **OUTPUT (Phase 1):** Master Checklist Report with recommended changes.
    - --- **USER ACTION:** Incorporate recommended changes into source documents ---
    - **FOCUS (Phase 2 - Librarian):** Process UPDATED documents into granular files in `docs/` and create `docs/index.md`.
    - **OUTPUT (Phase 2):** Granular `docs/` files, `docs/index.md`.
    - **FOCUS (Phase 3 - Story Creator):** Generate developer-ready story files using granular docs.
    - **OUTPUT (Phase 3):** Developer-ready story files.

6.  **Developer Agents**

    - **INPUT:** POSM-generated story files, granular documentation, architectures.
    - **FOCUS:** Implement the solution.
    - **ENVIRONMENT:** Typically IDE.

7.  **Ongoing Advisory**
    - **Architect (Master Architect Advisory mode):** For ongoing technical guidance, challenges, architectural changes.
    - **PM (Product Advisor Mode):** For product/PRD questions or updates.

---

## HANDLING MAJOR CHANGES

- Engage the RTE-Agent when a significant issue requires substantial change.
- RTE-Agent analyzes impact, evaluates paths, drafts proposed updates.
- Refer to [AGENT ROLES AND RESPONSIBILITIES](#agent-roles-and-responsibilities) (or section within this KB) for full details on RTE-Agent.

---

## IDE VS UI USAGE - GENERAL RECOMMENDATIONS

### CONCEPTUAL AND PLANNING PHASES

- **AGENTS:** Analyst, PM, Initial Architect Drafts, Design Architect UI/UX Specification.
- **RECOMMENDED_ENVIRONMENT:** Web-based UIs (e.g., Gemini Web as a Gem, OpenAI as custom GPT).
- **REASONING:**
  - Excel at conversational interaction, document generation (Project Briefs, PRDs, initial architectural outlines, UI/UX specs), and iterative refinement.
  - Can be more cost-effective for intensive back-and-forth compared to direct LLM usage in IDE for every interaction.
  - Markdown-based agent instructions (e.g., `1-analyst.md`) are designed for clarity in UI environments.

### TECHNICAL DESIGN, DOCUMENTATION MANAGEMENT & IMPLEMENTATION PHASES

- **AGENTS:** Detailed Architect Work, Design Architect Frontend Architecture, POSM Librarian & Story Creator, Developer Agents.
- **RECOMMENDED_ENVIRONMENT:** IDE offers increasing benefits as work becomes code-centric or involves direct file system manipulation.
- **SPECIFIC_NOTES:**
  - **Architect & Design Architect (Technical Definition):** Initial outlining might occur in UI, but detailed technical specs, configurations, initial code/scaffolding best handled/finalized in IDE.
  - **POSM (Librarian Phase):** HIGHLY RECOMMENDED in IDE for direct file system access. UI possible but less efficient.
  - **POSM (Story Creator Phase):** Can operate in either, but IDE allows easier cross-referencing with codebase if needed.
  - **Developer Agents:** Primarily operate within an IDE for implementation, testing, debugging.

### BMAD METHOD FILES (\*.MD IN GEMS-AND-GPTS)

- **PURPOSE:** Operational prompts for the agents.
- **MODIFICATION:** Typically an advanced user/developer action, best performed in an IDE or capable plain text editor handling markdown well.

---

## LEVERAGING IDE TASKS FOR EFFICIENCY

**CONTEXT:** For IDE users, BMAD Method V3 introduces Tasks (located in `BETA-V3/tasks/`).

**DEFINITION:** Self-contained instruction sets for specific, often one-off jobs.

### PURPOSE OF IDE TASKS

- **Reduce Agent Bloat:** Avoid adding numerous, rarely used instructions to primary IDE agent modes (Dev Agent, SM Agent). Keeps agents lean, beneficial for IDEs with limits on custom agent complexity/numbers.
- **On-Demand Functionality:** Instruct active IDE agent to perform a task by providing the content of the relevant task file (e.g., `checklist-run-task.md`) as a prompt.
- **Versatility:** Any sufficiently capable agent can be asked to execute a task.

### EXAMPLES OF TASK FUNCTIONALITY

- Running a chosen checklist against a document (e.g., `checklist-run-task.md`).
- Generating the next story file based on an epic (e.g., `create-next-story-task.md`).
- Breaking down (sharding) a large document into smaller pieces (e.g., `doc-sharding-task.md`).
- Indexing key information from a library or documents (e.g., `library-indexing-task.md`).

**CONCEPT:** Think of tasks as specialized, callable mini-agents that main IDE agents can invoke on demand, keeping primary agent definitions streamlined.
