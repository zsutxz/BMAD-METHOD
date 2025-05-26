==================== START: checklist-mappings ====================
architect-checklist:
  checklist_file: docs/checklists/architect-checklist.md
  required_docs:
    - architecture.md
  default_locations:
    - docs/architecture.md

frontend-architecture-checklist:
  checklist_file: docs/checklists/frontend-architecture-checklist.md
  required_docs:
    - frontend-architecture.md
  default_locations:
    - docs/frontend-architecture.md
    - docs/fe-architecture.md

pm-checklist:
  checklist_file: docs/checklists/pm-checklist.md
  required_docs:
    - prd.md
  default_locations:
    - docs/prd.md

po-master-checklist:
  checklist_file: docs/checklists/po-master-checklist.md
  required_docs:
    - prd.md
    - architecture.md
  optional_docs:
    - frontend-architecture.md
  default_locations:
    - docs/prd.md
    - docs/frontend-architecture.md
    - docs/architecture.md

story-draft-checklist:
  checklist_file: docs/checklists/story-draft-checklist.md
  required_docs:
    - story.md
  default_locations:
    - docs/stories/*.md

story-dod-checklist:
  checklist_file: docs/checklists/story-dod-checklist.md
  required_docs:
    - story.md
  default_locations:
    - docs/stories/*.md

==================== END: checklist-mappings ====================


==================== START: checklist-run-task ====================
# Checklist Validation Task

This task provides instructions for validating documentation against checklists. The agent should follow these instructions to ensure thorough and systematic validation of documents.

## Context

The BMAD Method uses various checklists to ensure quality and completeness of different artifacts. The mapping between checklists and their required documents is defined in `checklist-mappings`. This allows for easy addition of new checklists without modifying this task.

## Instructions

1. **Initial Assessment**

   - Check `checklist-mappings` for available checklists
   - If user provides a checklist name:
     - Look for exact match in checklist-mappings.yml
     - If no exact match, try fuzzy matching (e.g. "architecture checklist" -> "architect-checklist")
     - If multiple matches found, ask user to clarify
     - Once matched, use the checklist_file path from the mapping
   - If no checklist specified:
     - Ask the user which checklist they want to use
     - Present available options from checklist-mappings.yml
   - Confirm if they want to work through the checklist:
     - Section by section (interactive mode)
     - All at once (YOLO mode)

2. **Document Location**

   - Look up the required documents and default locations in `checklist-mappings`
   - For each required document:
     - Check all default locations specified in the mapping
     - If not found, ask the user for the document location
   - Verify all required documents are accessible

3. **Checklist Processing**

   If in interactive mode:

   - Work through each section of the checklist one at a time
   - For each section:
     - Review all items in the section
     - Check each item against the relevant documentation
     - Present findings for that section
     - Get user confirmation before proceeding to next section

   If in YOLO mode:

   - Process all sections at once
   - Create a comprehensive report of all findings
   - Present the complete analysis to the user

4. **Validation Approach**

   For each checklist item:

   - Read and understand the requirement
   - Look for evidence in the documentation that satisfies the requirement
   - Consider both explicit mentions and implicit coverage
   - Mark items as:
     - ✅ PASS: Requirement clearly met
     - ❌ FAIL: Requirement not met or insufficient coverage
     - ⚠️ PARTIAL: Some aspects covered but needs improvement
     - N/A: Not applicable to this case

5. **Section Analysis**

   For each section:

   - Calculate pass rate
   - Identify common themes in failed items
   - Provide specific recommendations for improvement
   - In interactive mode, discuss findings with user
   - Document any user decisions or explanations

6. **Final Report**

   Prepare a summary that includes:

   - Overall checklist completion status
   - Pass rates by section
   - List of failed items with context
   - Specific recommendations for improvement
   - Any sections or items marked as N/A with justification

## Special Considerations

1. **Architecture Checklist**

   - Focus on technical completeness and clarity
   - Verify all system components are addressed
   - Check for security and scalability considerations
   - Ensure deployment and operational aspects are covered

2. **Frontend Architecture Checklist**

   - Validate UI/UX specifications
   - Check component structure and organization
   - Verify state management approach
   - Ensure responsive design considerations

3. **PM Checklist**

   - Focus on product requirements clarity
   - Verify user stories and acceptance criteria
   - Check market and user research coverage
   - Ensure technical feasibility is addressed

4. **Story Checklists**
   - Verify clear acceptance criteria
   - Check for technical context and dependencies
   - Ensure testability is addressed
   - Validate user value is clearly stated

## Success Criteria

The checklist validation is complete when:

1. All applicable items have been assessed
2. Clear pass/fail status for each item
3. Specific recommendations provided for failed items
4. User has reviewed and acknowledged findings
5. Final report documents all decisions and rationales

## Example Interaction

Agent: "Let me check the available checklists... According to checklist-mappings.yml, we have several options. Which would you like to use?"

User: "The architect checklist"

Agent: "Would you like to work through it section by section (interactive) or get a complete analysis all at once (YOLO mode)?"

User: "Interactive please"

Agent: "According to the mappings, I need to check for architecture.md. The default location is docs/architecture.md. Should I look there?"

[Continue interaction based on user responses...]

==================== END: checklist-run-task ====================


==================== START: core-dump ====================
# Core Dump Task

## Purpose

To create a concise memory recording file (`.ai/core-dump-n.md`) that captures the essential context of the current agent session, enabling seamless continuation of work in future agent sessions. This task ensures persistent context across agent conversations while maintaining minimal token usage for efficient context loading.

## Inputs for this Task

- Current session conversation history and accomplishments
- Files created, modified, or deleted during the session
- Key decisions made and procedures followed
- Current project state and next logical steps
- User requests and agent responses that shaped the session

## Task Execution Instructions

### 0. Check Existing Core Dump

Before proceeding, check if `.ai/core-dump.md` already exists:

- If file exists, ask user: "Core dump file exists. Should I: 1. Overwrite, 2. Update, 3. Append or 4. Create new?"
- **Overwrite**: Replace entire file with new content
- **Update**: Merge new session info with existing content, updating relevant sections
- **Append**: Add new session as a separate entry while preserving existing content
- **Create New**: Create a new file, appending the next possible -# to the file, such as core-dump-3.md if 1 and 2 already exist.
- If file doesn't exist, proceed with creation of `core-dump-1.md`

### 1. Analyze Session Context

- Review the entire conversation to identify key accomplishments
- Note any specific tasks, procedures, or workflows that were executed
- Identify important decisions made or problems solved
- Capture the user's working style and preferences observed during the session

### 2. Document What Was Accomplished

- **Primary Actions**: List the main tasks completed concisely
- **Story Progress**: For story work, use format "Tasks Complete: 1-6, 8. Next Task Pending: 7, 9"
- **Problem Solving**: Document any challenges encountered and how they were resolved
- **User Communications**: Summarize key user requests, preferences, and discussion points

### 3. Record File System Changes (Concise Format)

- **Files Created**: `filename.ext` (brief purpose/size)
- **Files Modified**: `filename.ext` (what changed)
- **Files Deleted**: `filename.ext` (why removed)
- Focus on essential details, avoid verbose descriptions

### 4. Capture Current Project State

- **Project Progress**: Where the project stands after this session
- **Current Issues**: Any blockers or problems that need resolution
- **Next Logical Steps**: What would be the natural next actions to take

### 5. Create/Update Core Dump File

Based on user's choice from step 0, handle the file accordingly:

### 6. Optimize for Minimal Context

- Keep descriptions concise but informative
- Use abbreviated formats where possible (file sizes, task numbers)
- Focus on actionable information rather than detailed explanations
- Avoid redundant information that can be found in project documentation
- Prioritize information that would be lost without this recording
- Ensure the file can be quickly scanned and understood

### 7. Validate Completeness

- Verify all significant session activities are captured
- Ensure a future agent could understand the current state
- Check that file changes are accurately recorded
- Confirm next steps are clear and actionable
- Verify user communication style and preferences are noted

==================== END: core-dump ====================


==================== START: correct-course ====================
# Correct Course Task

## Purpose

- Guide a structured response to a change trigger using the `change-checklist`.
- Analyze the impacts of the change on epics, project artifacts, and the MVP, guided by the checklist's structure.
- Explore potential solutions (e.g., adjust scope, rollback elements, rescope features) as prompted by the checklist.
- Draft specific, actionable proposed updates to any affected project artifacts (e.g., epics, user stories, PRD sections, architecture document sections) based on the analysis.
- Produce a consolidated "Sprint Change Proposal" document that contains the impact analysis and the clearly drafted proposed edits for user review and approval.
- Ensure a clear handoff path if the nature of the changes necessitates fundamental replanning by other core agents (like PM or Architect).

## Instructions

### 1. Initial Setup & Mode Selection

- **Acknowledge Task & Inputs:**
  - Confirm with the user that the "Correct Course Task" (Change Navigation & Integration) is being initiated.
  - Verify the change trigger and ensure you have the user's initial explanation of the issue and its perceived impact.
  - Confirm access to all relevant project artifacts (e.g., PRD, Epics/Stories, Architecture Documents, UI/UX Specifications) and, critically, the `change-checklist` (e.g., `change-checklist`).
- **Establish Interaction Mode:**
  - Ask the user their preferred interaction mode for this task:
    - **"Incrementally (Default & Recommended):** Shall we work through the `change-checklist` section by section, discussing findings and collaboratively drafting proposed changes for each relevant part before moving to the next? This allows for detailed, step-by-step refinement."
    - **"YOLO Mode (Batch Processing):** Or, would you prefer I conduct a more batched analysis based on the checklist and then present a consolidated set of findings and proposed changes for a broader review? This can be quicker for initial assessment but might require more extensive review of the combined proposals."
  - Request the user to select their preferred mode.
  - Once the user chooses, confirm the selected mode (e.g., "Okay, we will proceed in Incremental mode."). This chosen mode will govern how subsequent steps in this task are executed.
- **Explain Process:** Briefly inform the user: "We will now use the `change-checklist` to analyze the change and draft proposed updates. I will guide you through the checklist items based on our chosen interaction mode."
  <rule>When asking multiple questions or presenting multiple points for user input at once, number them clearly (e.g., 1., 2a., 2b.) to make it easier for the user to provide specific responses.</rule>

### 2. Execute Checklist Analysis (Iteratively or Batched, per Interaction Mode)

- Systematically work through Sections 1-4 of the `change-checklist` (typically covering Change Context, Epic/Story Impact Analysis, Artifact Conflict Resolution, and Path Evaluation/Recommendation).
- For each checklist item or logical group of items (depending on interaction mode):
  - Present the relevant prompt(s) or considerations from the checklist to the user.
  - Request necessary information and actively analyze the relevant project artifacts (PRD, epics, architecture documents, story history, etc.) to assess the impact.
  - Discuss your findings for each item with the user.
  - Record the status of each checklist item (e.g., `[x] Addressed`, `[N/A]`, `[!] Further Action Needed`) and any pertinent notes or decisions.
  - Collaboratively agree on the "Recommended Path Forward" as prompted by Section 4 of the checklist.

### 3. Draft Proposed Changes (Iteratively or Batched)

- Based on the completed checklist analysis (Sections 1-4) and the agreed "Recommended Path Forward" (excluding scenarios requiring fundamental replans that would necessitate immediate handoff to PM/Architect):
  - Identify the specific project artifacts that require updates (e.g., specific epics, user stories, PRD sections, architecture document components, diagrams).
  - **Draft the proposed changes directly and explicitly for each identified artifact.** Examples include:
    - Revising user story text, acceptance criteria, or priority.
    - Adding, removing, reordering, or splitting user stories within epics.
    - Proposing modified architecture diagram snippets (e.g., providing an updated Mermaid diagram block or a clear textual description of the change to an existing diagram).
    - Updating technology lists, configuration details, or specific sections within the PRD or architecture documents.
    - Drafting new, small supporting artifacts if necessary (e.g., a brief addendum for a specific decision).
  - If in "Incremental Mode," discuss and refine these proposed edits for each artifact or small group of related artifacts with the user as they are drafted.
  - If in "YOLO Mode," compile all drafted edits for presentation in the next step.

### 4. Generate "Sprint Change Proposal" with Edits

- Synthesize the complete `change-checklist` analysis (covering findings from Sections 1-4) and all the agreed-upon proposed edits (from Instruction 3) into a single document titled "Sprint Change Proposal." This proposal should align with the structure suggested by Section 5 of the `change-checklist` (Proposal Components).
- The proposal must clearly present:
  - **Analysis Summary:** A concise overview of the original issue, its analyzed impact (on epics, artifacts, MVP scope), and the rationale for the chosen path forward.
  - **Specific Proposed Edits:** For each affected artifact, clearly show or describe the exact changes (e.g., "Change Story X.Y from: [old text] To: [new text]", "Add new Acceptance Criterion to Story A.B: [new AC]", "Update Section 3.2 of Architecture Document as follows: [new/modified text or diagram description]").
- Present the complete draft of the "Sprint Change Proposal" to the user for final review and feedback. Incorporate any final adjustments requested by the user.

### 5. Finalize & Determine Next Steps

- Obtain explicit user approval for the "Sprint Change Proposal," including all the specific edits documented within it.
- Provide the finalized "Sprint Change Proposal" document to the user.
- **Based on the nature of the approved changes:**
  - **If the approved edits sufficiently address the change and can be implemented directly or organized by a PO/SM:** State that the "Correct Course Task" is complete regarding analysis and change proposal, and the user can now proceed with implementing or logging these changes (e.g., updating actual project documents, backlog items). Suggest handoff to a PO/SM agent for backlog organization if appropriate.
  - **If the analysis and proposed path (as per checklist Section 4 and potentially Section 6) indicate that the change requires a more fundamental replan (e.g., significant scope change, major architectural rework):** Clearly state this conclusion. Advise the user that the next step involves engaging the primary PM or Architect agents, using the "Sprint Change Proposal" as critical input and context for that deeper replanning effort.

## Output Deliverables

- **Primary:** A "Sprint Change Proposal" document (in markdown format). This document will contain:
  - A summary of the `change-checklist` analysis (issue, impact, rationale for the chosen path).
  - Specific, clearly drafted proposed edits for all affected project artifacts.
- **Implicit:** An annotated `change-checklist` (or the record of its completion) reflecting the discussions, findings, and decisions made during the process.

==================== END: correct-course ====================


==================== START: create-ai-frontend-prompt ====================
# Create AI Frontend Prompt Task

## Purpose

To generate a masterful, comprehensive, and optimized prompt that can be used with AI-driven frontend development tools (e.g., Lovable, Vercel v0, or similar) to scaffold or generate significant portions of the frontend application.

## Inputs

- Completed UI/UX Specification (`front-end-spec-tmpl`)
- Completed Frontend Architecture Document (`front-end-architecture`)
- Main System Architecture Document (`architecture` - for API contracts and tech stack)
- Primary Design Files (Figma, Sketch, etc. - for visual context if the tool can accept it or if descriptions are needed)

## Key Activities & Instructions

1.  **Confirm Target AI Generation Platform:**

    - Ask the user to specify which AI frontend generation tool/platform they intend to use (e.g., "Lovable.ai", "Vercel v0", "GPT-4 with direct code generation instructions", etc.).
    - Explain that prompt optimization might differ slightly based on the platform's capabilities and preferred input format.

2.  **Synthesize Inputs into a Structured Prompt:**

    - **Overall Project Context:**
      - Briefly state the project's purpose (from brief/PRD).
      - Specify the chosen frontend framework, core libraries, and UI component library (from `front-end-architecture` and main `architecture`).
      - Mention the styling approach (e.g., Tailwind CSS, CSS Modules).
    - **Design System & Visuals:**
      - Reference the primary design files (e.g., Figma link).
      - If the tool doesn't directly ingest design files, describe the overall visual style, color palette, typography, and key branding elements (from `front-end-spec-tmpl`).
      - List any global UI components or design tokens that should be defined or adhered to.
    - **Application Structure & Routing:**
      - Describe the main pages/views and their routes (from `front-end-architecture` - Routing Strategy).
      - Outline the navigation structure (from `front-end-spec-tmpl`).
    - **Key User Flows & Page-Level Interactions:**
      - For a few critical user flows (from `front-end-spec-tmpl`):
        - Describe the sequence of user actions and expected UI changes on each relevant page.
        - Specify API calls to be made (referencing API endpoints from the main `architecture`) and how data should be displayed or used.
    - **Component Generation Instructions (Iterative or Key Components):**
      - Based on the chosen AI tool's capabilities, decide on a strategy:
        - **Option 1 (Scaffolding):** Prompt for the generation of main page structures, layouts, and placeholders for components.
        - **Option 2 (Key Component Generation):** Select a few critical or complex components from the `front-end-architecture` (Component Breakdown) and provide detailed specifications for them (props, state, basic behavior, key UI elements).
        - **Option 3 (Holistic, if tool supports):** Attempt to describe the entire application structure and key components more broadly.
      - <important_note>Advise the user that generating an entire complex application perfectly in one go is rare. Iterative prompting or focusing on sections/key components is often more effective.</important_note>
    - **State Management (High-Level Pointers):**
      - Mention the chosen state management solution (e.g., "Use Redux Toolkit").
      - For key pieces of data, indicate if they should be managed in global state.
    - **API Integration Points:**
      - For pages/components that fetch or submit data, clearly state the relevant API endpoints (from `architecture`) and the expected data shapes (can reference schemas in `data-models` or `api-reference` sections of the architecture doc).
    - **Critical "Don'ts" or Constraints:**
      - e.g., "Do not use deprecated libraries." "Ensure all forms have basic client-side validation."
    - **Platform-Specific Optimizations:**
      - If the chosen AI tool has known best practices for prompting (e.g., specific keywords, structure, level of detail), incorporate them. (This might require the agent to have some general knowledge or to ask the user if they know any such specific prompt modifiers for their chosen tool).

3.  **Present and Refine the Master Prompt:**
    - Output the generated prompt in a clear, copy-pasteable format (e.g., a large code block).
    - Explain the structure of the prompt and why certain information was included.
    - Work with the user to refine the prompt based on their knowledge of the target AI tool and any specific nuances they want to emphasize.
    - <important_note>Remind the user that the generated code from the AI tool will likely require review, testing, and further refinement by developers.</important_note>

==================== END: create-ai-frontend-prompt ====================


==================== START: create-architecture ====================
# Architecture Creation Task

## Purpose

- To design a complete, robust, and well-documented technical architecture based on the project requirements (PRD, epics, brief), research findings, and user input.
- To make definitive technology choices and articulate the rationale behind them, leveraging the architecture template as a structural guide.
- To produce all necessary technical artifacts, ensuring the architecture is optimized for efficient implementation, particularly by AI developer agents, and validated against the `architect-checklist`.

## Instructions

1.  **Input Analysis & Dialogue Establishment:**

    - Ensure you have all necessary inputs: PRD document (specifically checking for the 'Technical Assumptions' and 'Initial Architect Prompt' sections for the decided repository and service architecture), project brief, any deep research reports, and optionally a `technical-preferences.md`. Request any missing critical documents.
    - Thoroughly review all inputs.
    - Summarize key technical requirements, constraints, NFRs (Non-Functional Requirements), and the decided repository/service architecture derived from the inputs. Present this summary to the user for confirmation and to ensure mutual understanding.
    - Share initial architectural observations, potential challenges, or areas needing clarification based on the inputs.
      **Establish Interaction Mode for Architecture Creation:**
      - Ask the user: "How would you like to proceed with creating the architecture for this project? We can work:
        A. **Incrementally (Default & Recommended):** We'll go through each architectural decision, document section, or design point step-by-step. I'll present drafts, and we'll seek your feedback and confirmation before moving to the next part. This is best for complex decisions and detailed refinement.
        B. **"YOLO" Mode:** I can produce a more comprehensive initial draft of the architecture (or significant portions) for you to review more broadly first. We can then iterate on specific sections based on your feedback. This can be quicker for generating initial ideas but is generally not recommended if detailed collaboration at each step is preferred."
      - Request the user to select their preferred mode (e.g., "Please let me know if you'd prefer A or B.").
      - Once the user chooses, confirm the selected mode (e.g., "Okay, we will proceed in Incremental mode."). This chosen mode will govern how subsequent steps in this task are executed.

2.  **Resolve Ambiguities & Gather Missing Information:**

    - If key information is missing or requirements are unclear after initial review, formulate specific, targeted questions.
    - **External API Details:** If the project involves integration with external APIs, especially those that are less common or where you lack high confidence in your training data regarding their specific request/response schemas, and if a "Deep Research" phase was not conducted for these APIs:
      - Proactively ask the user to provide precise details. This includes:
        - Links to the official API documentation.
        - Example request structures (e.g., cURL commands, JSON payloads).
        - Example response structures (e.g., JSON responses for typical scenarios, including error responses).
      - Explain that this information is crucial for accurately defining API interaction contracts within the architecture, for creating robust facades/adapters, and for enabling accurate technical planning (e.g., for technical stories or epic refinements).
    - Present questions to the user (batched logically if multiple) and await their input.
    - Document all decisions and clarifications received before proceeding.

3.  **Iterative Technology Selection & Design (Interactive, if not YOLO mode):**

    - For each major architectural component or decision point (e.g., frontend framework, backend language/framework, database system, cloud provider, key services, communication patterns):
      - If multiple viable options exist based on requirements or research, present 2-3 choices, briefly outlining their pros, cons, and relevance to the project. Consider any preferences stated in `technical-preferences.md` when formulating these options and your recommendation.
      - State your recommended choice, providing a clear rationale based on requirements, research findings, user preferences (if known), and best practices (e.g., scalability, cost, team familiarity, ecosystem).
      - Ask for user feedback, address concerns, and seek explicit approval before finalizing the decision.
      - Document the confirmed choice and its rationale within the architecture document.
    - **Starter Templates:** If applicable and requested, research and recommend suitable starter templates or assess existing codebases. Explain alignment with project goals and seek user confirmation.

4.  **Create Technical Artifacts (Incrementally, unless YOLO mode, guided by `architecture-tmpl`):**

    - For each artifact or section of the main Architecture Document:

      - **Explain Purpose:** Briefly describe the artifact/section's importance and what it will cover.
      - **Draft Section-by-Section:** Present a draft of one logical section at a time.
        - Ensure the 'High-Level Overview' and 'Component View' sections accurately reflect and detail the repository/service architecture decided in the PRD.
        - Ensure that documented Coding Standards (either as a dedicated section or referenced) and the 'Testing Strategy' section clearly define:
          - The convention for unit test file location (e.g., co-located with source files, or in a separate folder like `tests/` or `__tests__/`).
          - The naming convention for unit test files (e.g., `*.test.js`, `*.spec.ts`, `test_*.py`).
        - When discussing Coding Standards, inform the user that these will serve as firm rules for the AI developer agent. Emphasize that these standards should be kept to the minimum necessary to prevent undesirable or messy code from the agent. Guide the user to understand that overly prescriptive or obvious standards (e.g., "use SOLID principles," which well-trained LLMs should already know) should be avoided, as the user, knowing the specific agents and tools they will employ, can best judge the appropriate level of detail.
        - **Incorporate Feedback:** Discuss the draft with the user, incorporate their feedback, and iterate as needed.
        - [Offer Advanced Self-Refinement & Elicitation Options](#offer-advanced-self-refinement--elicitation-options)
        - **Seek Approval:** Obtain explicit user approval for the section before moving to the next, or for the entire artifact if drafted holistically (in YOLO mode).

5.  **Identify Missing Technical Stories / Refine Epics (Interactive):**

    - Based on the designed architecture, identify any necessary technical stories/tasks that are not yet captured in the PRD or epics (e.g., "Set up CI/CD pipeline for frontend deployment," "Implement authentication module using JWT," "Create base Docker images for backend services," "Configure initial database schema based on data models").
    - Explain the importance of these technical stories for enabling the functional requirements and successful project execution.
    - Collaborate with the user to refine these stories (clear description, acceptance criteria) and suggest adding them to the project backlog or relevant epics.
    - Review existing epics/stories from the PRD and suggest technical considerations or acceptance criteria refinements to ensure they are implementable based on the chosen architecture. For example, specifying API endpoints to be called, data formats, or critical library versions.
    - After collaboration, prepare a concise summary detailing all proposed additions, updates, or modifications to epics and user stories. If no changes are identified, explicitly state this.

6.  **Validate Architecture Against Checklist & Finalize Output:**
    - Once the main architecture document components have been drafted and reviewed with the user, perform a comprehensive review using the `architect-checklist`.
    - Go through each item in the checklist to ensure the architecture document is comprehensive, addresses all key architectural concerns (e.g., security, scalability, maintainability, testability (including confirmation that coding standards and the testing strategy clearly define unit test location and naming conventions), developer experience), and that proposed solutions are robust.
    - For each checklist item, confirm its status (e.g., \[x] Completed, \[ ] N/A, \[!] Needs Attention).
    - If deficiencies, gaps, or areas needing more detail or clarification are identified based on the checklist:
      - Discuss these findings with the user.
      - Collaboratively make necessary updates, additions, or refinements to the architecture document to address these points.
    - After addressing all checklist points and ensuring the architecture document is robust and complete, present a summary of the checklist review to the user. This summary should highlight:
      - Confirmation that all relevant sections/items of the checklist have been satisfied by the architecture.
      - Any items marked N/A, with a brief justification.
      - A brief note on any significant discussions, decisions, or changes made to the architecture document as a result of the checklist review.
    - **Offer Design Architect Prompt (If Applicable):**
      - If the architecture includes UI components, ask the user if they would like to include a dedicated prompt for a "Design Architect" at the end of the main architecture document.
      - Explain that this prompt can capture specific UI considerations, notes from discussions, or decisions that don't fit into the core technical architecture document but are crucial for the Design Architect.
      - The prompt should also state that the Design Architect will subsequently operate in its specialized mode to define the detailed frontend architecture.
      - If the user agrees, collaboratively draft this prompt and append it to the architecture document.
    - Obtain final user approval for the complete architecture documentation generation.
    - **Recommend Next Steps for UI (If Applicable):**
      - After the main architecture document is finalized and approved:
      - If the project involves a user interface (as should be evident from the input PRD and potentially the architecture document itself mentioning UI components or referencing outputs from a Design Architect's UI/UX Specification phase):
        - Strongly recommend to the user that the next critical step for the UI is to engage the **Design Architect** agent.
        - Specifically, advise them to use the Design Architect's **'Frontend Architecture Mode'**.
        - Explain that the Design Architect will use the now-completed main Architecture Document and the detailed UI/UX specifications (e.g., `front-end-spec-tmpl.txt` or enriched PRD) as primary inputs to define the specific frontend architecture, select frontend libraries/frameworks (if not already decided), structure frontend components, and detail interaction patterns.

### Output Deliverables for Architecture Creation Phase

- A comprehensive Architecture Document, structured according to the `architecture-tmpl` (which is all markdown) or an agreed-upon format, including all sections detailed above.
- Clear Mermaid diagrams for architecture overview, data models, etc.
- A list of new or refined technical user stories/tasks ready for backlog integration.
- A summary of any identified changes (additions, updates, modifications) required for existing epics or user stories, or an explicit confirmation if no such changes are needed.
- A completed `architect-checklist` (or a summary of its validation).
- Optionally, if UI components are involved and the user agrees: A prompt for a "Design Architect" appended to the main architecture document, summarizing relevant UI considerations and outlining the Design Architect's next steps.

## Offer Advanced Self-Refinement & Elicitation Options

(This section is called when needed prior to this)

Present the user with the following list of 'Advanced Reflective, Elicitation & Brainstorming Actions'. Explain that these are optional steps to help ensure quality, explore alternatives, and deepen the understanding of the current section before finalizing it and moving on. The user can select an action by number, or choose to skip this and proceed to finalize the section.

"To ensure the quality of the current section: **[Specific Section Name]** and to ensure its robustness, explore alternatives, and consider all angles, I can perform any of the following actions. Please choose a number (8 to finalize and proceed):

**Advanced Reflective, Elicitation & Brainstorming Actions I Can Take:**

{Instruction for AI Agent: Display the title of each numbered item below. If the user asks what a specific option means, provide a brief explanation of the action you will take, drawing from detailed descriptions tailored for the context.}

1.  **Critical Self-Review & User Goal Alignment**
2.  **Generate & Evaluate Alternative Design Solutions**
3.  **User Journey & Interaction Stress Test (Conceptual)**
4.  **Deep Dive into Design Assumptions & Constraints**
5.  **Usability & Accessibility Audit Review & Probing Questions**
6.  **Collaborative Ideation & UI Feature Brainstorming**
7.  **Elicit 'Unforeseen User Needs' & Future Interaction Questions**
8.  **Finalize this Section and Proceed.**

After I perform the selected action, we can discuss the outcome and decide on any further revisions for this section."

REPEAT by Asking the user if they would like to perform another Reflective, Elicitation & Brainstorming Action UNIT the user indicates it is time to proceed ot the next section (or selects #8)

==================== END: create-architecture ====================


==================== START: create-deep-research-prompt ====================
## Deep Research Phase

Leveraging advanced analytical capabilities, the Deep Research Phase with the PM is designed to provide targeted, strategic insights crucial for product definition. Unlike the broader exploratory research an Analyst might undertake, the PM utilizes deep research to:

- **Validate Product Hypotheses:** Rigorously test assumptions about market need, user problems, and the viability of specific product concepts.
- **Refine Target Audience & Value Proposition:** Gain a nuanced understanding of specific user segments, their precise pain points, and how the proposed product delivers unique value to them.
- **Focused Competitive Analysis:** Analyze competitors through the lens of a specific product idea to identify differentiation opportunities, feature gaps to exploit, and potential market positioning challenges.
- **De-risk PRD Commitments:** Ensure that the problem, proposed solution, and core features are well-understood and validated _before_ detailed planning and resource allocation in the PRD Generation Mode.

Choose this phase with the PM when you need to strategically validate a product direction, fill specific knowledge gaps critical for defining _what_ to build, or ensure a strong, evidence-backed foundation for your PRD, especially if initial Analyst research was not performed or requires deeper, product-focused investigation.

### Purpose

- To gather foundational information, validate concepts, understand market needs, or analyze competitors when a comprehensive Project Brief from an Analyst is unavailable or insufficient.
- To ensure the PM has a solid, data-informed basis for defining a valuable and viable product before committing to PRD specifics.
- To de-risk product decisions by grounding them in targeted research, especially if the user is engaging the PM directly without prior Analyst work or if the initial brief lacks necessary depth.

### Instructions

<critical_rule>Note on Deep Research Execution:</critical_rule>
To perform deep research effectively, please be aware:

- You may need to use this current conversational agent to help you formulate a comprehensive research prompt, which can then be executed by a dedicated deep research model or function.
- Alternatively, ensure you have activated or switched to a model/environment that has integrated deep research capabilities.
  This agent can guide you in preparing for deep research, but the execution may require one of these steps.

1.  **Assess Inputs & Identify Gaps:**
    - Review any existing inputs (user's initial idea, high-level requirements, partial brief from Analyst, etc.).
    - Clearly identify critical knowledge gaps concerning:
      - Target audience (needs, pain points, behaviors, key segments).
      - Market landscape (size, trends, opportunities, potential saturation).
      - Competitive analysis (key direct/indirect competitors, their offerings, strengths, weaknesses, market positioning, potential differentiators for this product).
      - Problem/Solution validation (evidence supporting the proposed solution's value and fit for the identified problem).
      - High-level technical or resource considerations (potential major roadblocks or dependencies).
2.  **Formulate Research Plan:**
    - Define specific, actionable research questions to address the identified gaps.
    - Propose targeted research activities (e.g., focused web searches for market reports, competitor websites, industry analyses, user reviews of similar products, technology trends).
    - <important_note>Confirm this research plan, scope, and key questions with the user before proceeding with research execution.</important_note>
3.  **Execute Research:**
    - Conduct the planned research activities systematically.
    - Prioritize gathering credible, relevant, and actionable insights that directly inform product definition and strategy.
4.  **Synthesize & Present Findings:**
    - Organize and summarize key research findings in a clear, concise, and easily digestible manner (e.g., bullet points, brief summaries per research question).
    - Highlight the most critical implications for the product's vision, strategy, target audience, core features, and potential risks.
    - Present these synthesized findings and their implications to the user.
5.  **Discussing and Utilizing Research Output:**
    - The comprehensive findings/report from this Deep Research phase can be substantial. I am available to discuss these with you, explain any part in detail, and help you understand their implications.
    - **Options for Utilizing These Findings for PRD Generation:**
      1.  **Full Handoff to New PM Session:** The complete research output can serve as a foundational document if you initiate a _new_ session with a Product Manager (PM) agent who will then execute the 'PRD Generate Task'.
      2.  **Key Insights Summary for This Session:** I can prepare a concise summary of the most critical findings, tailored to be directly actionable as we (in this current session) transition to potentially invoking the 'PRD Generate Task'.
    - <critical_rule>Regardless of how you proceed, it is highly recommended that these research findings (either the full output or the key insights summary) are provided as direct input when invoking the 'PRD Generate Task'. This ensures the PRD is built upon a solid, evidence-based foundation.</critical_rule>
6.  **Confirm Readiness for PRD Generation:**
    - Discuss with the user whether the gathered information provides a sufficient and confident foundation to proceed to the 'PRD Generate Task'.
    - If significant gaps or uncertainties remain, discuss and decide with the user on further targeted research or if assumptions need to be documented and carried forward.
    - Once confirmed, clearly state that the next step could be to invoke the 'PRD Generate Task' or, if applicable, revisit other phase options.

==================== END: create-deep-research-prompt ====================


==================== START: create-frontend-architecture ====================
# Create Frontend Architecture Task

## Purpose

To define the technical architecture for the frontend application. This includes selecting appropriate patterns, structuring the codebase, defining component strategy, planning state management, outlining API interactions, and setting up testing and deployment approaches, all while adhering to the guidelines in `front-end-architecture-tmpl` template.

## Inputs

- Product Requirements Document (PRD) (`prd-tmpl` or equivalent)
- Completed UI/UX Specification (`front-end-spec-tmpl` or equivalent)
- Main System Architecture Document (`architecture` or equivalent) - The agent executing this task should particularly note the overall system structure (Monorepo/Polyrepo, backend service architecture) detailed here, as it influences frontend patterns.
- Primary Design Files (Figma, Sketch, etc., linked from UI/UX Spec)

## Key Activities & Instructions

### 1. Confirm Interaction Mode

- Ask the user: "How would you like to proceed with creating the frontend architecture? We can work:
  A. **Incrementally (Default & Recommended):** We'll go through each architectural decision and document section step-by-step. I'll present drafts, and we'll seek your feedback and confirmation before moving to the next part. This is best for complex decisions and detailed refinement.
  B. **"YOLO" Mode:** I can produce a more comprehensive initial draft of the frontend architecture for you to review more broadly first. We can then iterate on specific sections based on your feedback. This can be quicker for generating initial ideas but is generally not recommended if detailed collaboration at each step is preferred."
- Request the user to select their preferred mode (e.g., "Please let me know if you'd prefer A or B.").
- Once the user chooses, confirm the selected mode (e.g., "Okay, we will proceed in Incremental mode."). This chosen mode will govern how subsequent steps are executed.

### 2. Review Inputs & Establish Context

- Thoroughly review the inputs, including the UI/UX Specification and the main Architecture Document (especially "Definitive Tech Stack Selections", API contracts, and the documented overall system structure like monorepo/polyrepo choices).
- Ask clarifying questions to bridge any gaps between the UI/UX vision and the overall system architecture.

### 3. Define Overall Frontend Philosophy & Patterns (for `front-end-architecture`)

- Based on the main architecture's tech stack and overall system structure (monorepo/polyrepo, backend service details), confirm and detail:
  - Framework & Core Libraries choices.
  - High-level Component Architecture strategy.
  - High-level State Management Strategy.
  - Data Flow principles.
  - Styling Approach.
  - Key Design Patterns to be employed.

### 4. Specify Detailed Frontend Directory Structure (for `front-end-architecture`)

- Collaboratively define or refine the frontend-specific directory structure, ensuring it aligns with the chosen framework and promotes modularity and scalability.

### 5. Outline Component Strategy & Conventions (for `front-end-architecture`)

- Define Component Naming & Organization conventions.
- Establish the "Template for Component Specification" (as per `front-end-architecture`), emphasizing that most components will be detailed emergently but must follow this template.
- Optionally, specify a few absolutely foundational/shared UI components (e.g., a generic Button or Modal wrapper if the chosen UI library needs one, or if no UI library is used).

### 6. Detail State Management Setup & Conventions (for `front-end-architecture`)

- Based on the high-level strategy, detail:
  - Chosen Solution and core setup.
  - Conventions for Store Structure / Slices (e.g., "feature-based slices"). Define any genuinely global/core slices (e.g., session/auth).
  - Conventions for Selectors and Actions/Reducers/Thunks. Provide templates or examples.

### 7. Plan API Interaction Layer (for `front-end-architecture`)

- Define the HTTP Client Setup.
- Establish patterns for Service Definitions (how API calls will be encapsulated).
- Outline frontend Error Handling & Retry strategies for API calls.

### 8. Define Routing Strategy (for `front-end-architecture`)

- Confirm the Routing Library.
- Collaboratively define the main Route Definitions and any Route Guards.

### 9. Specify Build, Bundling, and Deployment Details (for `front-end-architecture`)

- Outline the frontend-specific Build Process & Scripts.
- Discuss and document Key Bundling Optimizations.
- Confirm Deployment to CDN/Hosting details relevant to the frontend.

### 10. Refine Frontend Testing Strategy (for `front-end-architecture`)

- Elaborate on the main testing strategy with specifics for: Component Testing, UI Integration/Flow Testing, and E2E UI Testing scope and tools.

### 11. Outline Performance Considerations (for `front-end-architecture`)

- List key frontend-specific performance strategies to be employed.

### 12. Document Drafting & Confirmation (Guided by `front-end-architecture-tmpl`)

- **If "Incremental Mode" was selected:**

  - For each relevant section of the `front-end-architecture` (as outlined in steps 3-11 above, covering topics from Overall Philosophy to Performance Considerations):

    - **a. Explain Purpose & Draft Section:** Explain the purpose of the section and present a draft for that section.
    - **b. Initial Discussion & Feedback:** Discuss the draft with the user, incorporate their feedback, and iterate as needed for initial revisions.
    - **c. [Offer Advanced Self-Refinement & Elicitation Options](#offer-advanced-self-refinement--elicitation-options)**

    - **d. Final Approval & Documentation:** Obtain explicit user approval for the section. Ensure all placeholder links and references are correctly noted within each section. Then proceed to the next section.

  - Once all sections are individually approved through this process, confirm with the user that the overall `front-end-architecture` document is populated and ready for Step 13 (Epic/Story Impacts) and then the checklist review (Step 14).

- **If "YOLO Mode" was selected:**
  - Collaboratively populate all relevant sections of the `front-end-architecture-tmpl` (as outlined in steps 3-11 above) to create a comprehensive first draft.
  - Present the complete draft of `front-end-architecture` to the user for a holistic review.
  - <important_note>After presenting the full draft in YOLO mode, you MAY still offer a condensed version of the 'Advanced Reflective & Elicitation Options' menu, perhaps focused on a few key overarching review actions (e.g., overall requirements alignment, major risk assessment) if the user wishes to perform a structured deep dive before detailed section-by-section feedback.</important_note>
  - Obtain explicit user approval for the entire `front-end-architecture` document before proceeding to Step 13 (Epic/Story Impacts) and then the checklist review (Step 14).

### 13. Identify & Summarize Epic/Story Impacts (Frontend Focus)

- After the `front-end-architecture` is confirmed, review it in context of existing epics and user stories (if provided or known).
- Identify any frontend-specific technical tasks that might need to be added as new stories or sub-tasks (e.g., "Implement responsive layout for product details page based on defined breakpoints," "Set up X state management slice for user profile," "Develop reusable Y component as per specification").
- Identify if any existing user stories require refinement of their acceptance criteria due to frontend architectural decisions (e.g., specifying interaction details, component usage, or performance considerations for UI elements).
- Collaborate with the user to define these additions or refinements.
- Prepare a concise summary detailing all proposed additions, updates, or modifications to epics and user stories related to the frontend. If no changes are identified, explicitly state this (e.g., "No direct impacts on existing epics/stories were identified from the frontend architecture").

### 14. Checklist Review and Finalization

- Once the `front-end-architecture` has been populated and reviewed with the user, and epic/story impacts have been summarized, use the `frontend-architecture-checklist`.
- Go through each item in the checklist to ensure the `front-end-architecture` is comprehensive and all sections are adequately addressed - for each checklist item you MUST consider if it is really complete or deficient.
- For each checklist section, confirm its status (e.g., \[x] Completed, \[ ] N/A, \[!] Needs Attention).
- If deficiencies or areas needing more detail are identified with a section:
  - Discuss these with the user.
  - Collaboratively make necessary updates or additions to the `front-end-architecture`.
- After addressing all points and ensuring the document is robust, present a summary of the checklist review to the user. This summary should highlight:
  - Confirmation that all relevant sections of the checklist have been satisfied.
  - Any items marked N/A and a brief reason.
  - A brief note on any significant discussions or changes made as a result of the checklist review.
- The goal is to ensure the `front-end-architecture` is a complete and actionable document.

## Offer Advanced Self-Refinement & Elicitation Options

(This section is called when needed prior to this)

Present the user with the following list of 'Advanced Reflective, Elicitation & Brainstorming Actions'. Explain that these are optional steps to help ensure quality, explore alternatives, and deepen the understanding of the current section before finalizing it and moving on. The user can select an action by number, or choose to skip this and proceed to finalize the section.

"To ensure the quality of the current section: **[Specific Section Name]** and to ensure its robustness, explore alternatives, and consider all angles, I can perform any of the following actions. Please choose a number (8 to finalize and proceed):

**Advanced Reflective, Elicitation & Brainstorming Actions I Can Take:**

{Instruction for AI Agent: Display the title of each numbered item below. If the user asks what a specific option means, provide a brief explanation of the action you will take, drawing from detailed descriptions tailored for the context.}

1.  **Critical Self-Review & User Goal Alignment**
2.  **Generate & Evaluate Alternative Design Solutions**
3.  **User Journey & Interaction Stress Test (Conceptual)**
4.  **Deep Dive into Design Assumptions & Constraints**
5.  **Usability & Accessibility Audit Review & Probing Questions**
6.  **Collaborative Ideation & UI Feature Brainstorming**
7.  **Elicit 'Unforeseen User Needs' & Future Interaction Questions**
8.  **Finalize this Section and Proceed.**

After I perform the selected action, we can discuss the outcome and decide on any further revisions for this section."

REPEAT by Asking the user if they would like to perform another Reflective, Elicitation & Brainstorming Action UNIT the user indicates it is time to proceed ot the next section (or selects #8)

==================== END: create-frontend-architecture ====================


==================== START: create-next-story-task ====================
# Create Next Story Task

## Purpose

To identify the next logical story based on project progress and epic definitions, and then to prepare a comprehensive, self-contained, and actionable story file using the `Story Template`. This task ensures the story is enriched with all necessary technical context, requirements, and acceptance criteria, making it ready for efficient implementation by a Developer Agent with minimal need for additional research.

## Inputs for this Task

- Access to the project's documentation repository, specifically:
  - `docs/index.md` (hereafter "Index Doc")
  - All Epic files (e.g., `docs/epic-{n}.md` - hereafter "Epic Files")
  - Existing story files in `docs/stories/`
  - Main PRD (hereafter "PRD Doc")
  - Main Architecture Document (hereafter "Main Arch Doc")
  - Frontend Architecture Document (hereafter "Frontend Arch Doc," if relevant)
  - Project Structure Guide (`docs/project-structure.md`)
  - Operational Guidelines Document (`docs/operational-guidelines.md`)
  - Technology Stack Document (`docs/tech-stack.md`)
  - Data Models Document (as referenced in Index Doc)
  - API Reference Document (as referenced in Index Doc)
  - UI/UX Specifications, Style Guides, Component Guides (if relevant, as referenced in Index Doc)
- The `bmad-agent/templates/story-tmpl.md` (hereafter "Story Template")
- The `bmad-agent/checklists/story-draft-checklist.md` (hereafter "Story Draft Checklist")
- User confirmation to proceed with story identification and, if needed, to override warnings about incomplete prerequisite stories.

## Task Execution Instructions

### 1. Identify Next Story for Preparation

- Review `docs/stories/` to find the highest-numbered story file.
- **If a highest story file exists (`{lastEpicNum}.{lastStoryNum}.story.md`):**

  - Verify its `Status` is 'Done' (or equivalent).
  - If not 'Done', present an alert to the user:

    ```
    ALERT: Found incomplete story:
    File: {lastEpicNum}.{lastStoryNum}.story.md
    Status: [current status]

    Would you like to:
    1. View the incomplete story details (instructs user to do so, agent does not display)
    2. Cancel new story creation at this time
    3. Accept risk & Override to create the next story in draft

    Please choose an option (1/2/3):
    ```

  - Proceed only if user selects option 3 (Override) or if the last story was 'Done'.
  - If proceeding: Check the Epic File for `{lastEpicNum}` for a story numbered `{lastStoryNum + 1}`. If it exists and its prerequisites (per Epic File) are met, this is the next story.
  - Else (story not found or prerequisites not met): The next story is the first story in the next Epic File (e.g., `docs/epic-{lastEpicNum + 1}.md`, then `{lastEpicNum + 2}.md`, etc.) whose prerequisites are met.

- **If no story files exist in `docs/stories/`:**
  - The next story is the first story in `docs/epic-1.md` (then `docs/epic-2.md`, etc.) whose prerequisites are met.
- If no suitable story with met prerequisites is found, report to the user that story creation is blocked, specifying what prerequisites are pending. HALT task.
- Announce the identified story to the user: "Identified next story for preparation: {epicNum}.{storyNum} - {Story Title}".

### 2. Gather Core Story Requirements (from Epic File)

- For the identified story, open its parent Epic File.
- Extract: Exact Title, full Goal/User Story statement, initial list of Requirements, all Acceptance Criteria (ACs), and any predefined high-level Tasks.
- Keep a record of this original epic-defined scope for later deviation analysis.

### 3. Gather & Synthesize In-Depth Technical Context for Dev Agent

- <critical_rule>Systematically use the Index Doc (`docs/index.md`) as your primary guide to discover paths to ALL detailed documentation relevant to the current story's implementation needs.</critical_rule>
- Thoroughly review the PRD Doc, Main Arch Doc, and Frontend Arch Doc (if a UI story).
- Guided by the Index Doc and the story's needs, locate, analyze, and synthesize specific, relevant information from sources such as:
  - Data Models Doc (structure, validation rules).
  - API Reference Doc (endpoints, request/response schemas, auth).
  - Applicable architectural patterns or component designs from Arch Docs.
  - UI/UX Specs, Style Guides, Component Guides (for UI stories).
  - Specifics from Tech Stack Doc if versions or configurations are key for this story.
  - Relevant sections of the Operational Guidelines Doc (e.g., story-specific error handling nuances, security considerations for data handled in this story).
- The goal is to collect all necessary details the Dev Agent would need, to avoid them having to search extensively. Note any discrepancies between the epic and these details for "Deviation Analysis."

### 4. Verify Project Structure Alignment

- Cross-reference the story's requirements and anticipated file manipulations with the Project Structure Guide (and frontend structure if applicable).
- Ensure any file paths, component locations, or module names implied by the story align with defined structures.
- Document any structural conflicts, necessary clarifications, or undefined components/paths in a "Project Structure Notes" section within the story draft.

### 5. Populate Story Template with Full Context

- Create a new story file: `docs/stories/{epicNum}.{storyNum}.story.md`.
- Use the Story Template to structure the file.
- Fill in:
  - Story `{EpicNum}.{StoryNum}: {Short Title Copied from Epic File}`
  - `Status: Draft`
  - `Story` (User Story statement from Epic)
  - `Acceptance Criteria (ACs)` (from Epic, to be refined if needed based on context)
- **`Dev Technical Guidance` section (CRITICAL):**
  - Based on all context gathered (Step 3 & 4), embed concise but critical snippets of information, specific data structures, API endpoint details, precise references to _specific sections_ in other documents (e.g., "See `Data Models Doc#User-Schema-ValidationRules` for details"), or brief explanations of how architectural patterns apply to _this story_.
  - If UI story, provide specific references to Component/Style Guides relevant to _this story's elements_.
  - The aim is to make this section the Dev Agent's primary source for _story-specific_ technical context.
- **`Tasks / Subtasks` section:**
  - Generate a detailed, sequential list of technical tasks and subtasks the Dev Agent must perform to complete the story, informed by the gathered context.
  - Link tasks to ACs where applicable (e.g., `Task 1 (AC: 1, 3)`).
- Add notes on project structure alignment or discrepancies found in Step 4.
- Prepare content for the "Deviation Analysis" based on discrepancies noted in Step 3.

==================== END: create-next-story-task ====================


==================== START: create-prd ====================
# PRD Generate Task

## Purpose

- Transform inputs into core product definition documents conforming to the `prd-tmpl` template.
- Define clear MVP scope focused on essential functionality.
- Provide foundation for Architect and eventually AI dev agents.

Remember as you follow the upcoming instructions:

- Your documents form the foundation for the entire development process.
- Output will be directly used by the Architect to create an architecture document and solution designs to make definitive technical decisions.
- Your epics/stories will ultimately be transformed into development tasks.
- While you focus on the "what" not "how", be precise enough to support a logical sequential order of operations that once later further details can logically be followed where a story will complete what is needed.

## Instructions

### 1. Define Project Workflow Context

- Before PRD generation, ask the user to choose their intended workflow:

  A. **Outcome Focused (Default):** (Agent defines outcome-focused User Stories, leaving detailed technical "how" for Architect/Scrum Master. Capture nuances as "Notes for Architect/Scrum Master in the Prompt for Architect.")

  B. **Very Technical (Not Recommended):** (Agent adopts a "solution-aware" stance, providing more detailed, implementation-aware Acceptance Criteria to bridge to development, potentially with no architect involved at all, instead filling in all of the technical details. \<important_note\>When this workflow is selected, you are also responsible for collaboratively defining and documenting key technical foundations—such as technology stack choices and proposed application structure—directly within a new, dedicated section of the PRD template titled '[OPTIONAL: For Simplified PM-to-Development Workflow Only] Core Technical Decisions & Application Structure'.\</important_note\>)

- Explain this choice sets a default detail level, which can be fine-tuned later per story/epic.

### 2. Determine Interaction Mode (for PRD Structure & Detail)

- Confirm with the user their preferred interaction style for creating the PRD if unknown - INCREMENTAL or YOLO?:
  - **Incrementally (Default):** Address PRD sections sequentially, seeking feedback on each. For Epics/Stories: first present the ordered Epic list for approval, then detail stories for each Epic one by one.
  - **"YOLO" Mode:** Draft a more comprehensive PRD (or significant portions with multiple sections, epics, and stories) for a single, larger review.

### 3. Review inputs provided

Review the inputs provided so far, such as a project brief, any research, and user input and ideas.

### 4. Process PRD Sections

Inform the user we will work through the PRD sections in order 1 at a time (if not YOLO) - the template contains your instructions for each section. After presenting the section to the user, also [Offer Advanced Self-Refinement & Elicitation Options](#offer-advanced-self-refinement--elicitation-options)

<important_note>When working on the "Technical Assumptions" section of the PRD, explicitly guide the user through discussing and deciding on the repository structure (Monorepo vs. Polyrepo) and the high-level service architecture (e.g., Monolith, Microservices, Serverless functions within a Monorepo). Emphasize that this is a critical decision point that will be formally documented here with its rationale, impacting MVP scope and informing the Architect. Ensure this decision is captured in the PRD's `Technical Assumptions` and then reiterated in the `Initial Architect Prompt` section of the PRD.</important_note>

<important_note>Specifically for "Simplified PM-to-Development Workflow":
After discussing initial PRD sections (like Problem, Goals, User Personas) and before or in parallel with defining detailed Epics and Stories, you must introduce and populate the "[OPTIONAL: For Simplified PM-to-Development Workflow Only] Core Technical Decisions & Application Structure" section of the PRD.

    When doing so, first check if a `docs/technical-preferences.md` file exists or has been provided. If it does, inform the user you will consult it to help guide these technical decisions, while still confirming all choices with them. Ask targeted questions such as:

1.  "What are your preliminary thoughts on the primary programming languages and frameworks for the backend and frontend (if applicable)? (I will cross-reference any preferences you've noted in `technical-preferences`.)"
2.  "Which database system are you considering? (Checking preferences...)"
3.  "Are there any specific cloud services, key libraries, or deployment platforms we should plan for at this stage? (Checking preferences...)"
4.  "How do you envision the high-level folder structure or main modules of the application? Could you describe the key components and their responsibilities? (I'll consider any structural preferences noted.)"
5.  "Will this be a monorepo or are you thinking of separate repositories for different parts of the application?"
    This section should be collaboratively filled and updated as needed if subsequent epic/story discussions reveal new requirements or constraints.

</important_note\>

<important_note>

For the Epic and Story Section (if in Incremental mode for these), prepare in memory what you think the initial epic and story list so we can work through this incrementally, use all of the information you have learned that has been provided thus far to follow the guidelines in the section below [Guiding Principles for Epic and User Story Generation](https://www.google.com/search?q=%23guiding-principles-for-epic-and-user-story-generation).

</important_note>

#### 4A. Epic Presentation and Drafting Strategy

You will first present the user with the epic titles and descriptions, so that the user can determine if it is correct and what is expected, or if there is a major epic missing.

#### 4B. Story Generation and Review within Epics (Incremental Mode)

**Once the Epic List is approved, THEN for each Epic, you will proceed as follows:**

i. **Draft All Stories for the Current Epic:** Based on the Epic's goal and your discussions, draft all the necessary User Stories for this Epic, following the "Guiding Principles for Epic and User Story Generation".
ii. **Perform Internal Story Analysis & Propose Order:** Before presenting the stories for detailed review, you will internally:
a. **Re-evaluate for Cross-Cutting Concerns:** Ensure no drafted stories should actually be ACs or notes within other stories, as per the guiding principle. Make necessary adjustments.
b. **Analyze for Logical Sequence & Dependencies:** For all stories within this Epic, determine their logical implementation order. Identify any direct prerequisite stories (e.g., "Story X must be completed before Story Y because Y consumes the output of X").
c. **Formulate a Rationale for the Order:** Prepare a brief explanation for why the proposed order is logical.
iii. **Present Proposed Story Set & Order for the Epic:** Present to the user:
a. The complete list of (potentially revised) User Stories for the Epic.
b. The proposed sequence for these stories.
c. Your brief rationale for the sequencing and any key dependencies you've noted (e.g., "I suggest this order because Story 2 builds upon the data prepared in Story 1, and Story 3 then uses the results from Story 2.").
iv. **Collaborative Review of Sequence & Story Shells:** Discuss this proposed structure and sequence with the user. Make any adjustments to the story list or their order based on user feedback.
v. Once the overall structure and sequence of stories for the Epic are agreed upon, THEN you will work with the user to review the details (description, Acceptance Criteria) of each story in the agreed-upon sequence for that Epic.
vi. [Offer Advanced Self-Refinement & Elicitation Options](#offer-advanced-self-refinement--elicitation-options)

#### 4C. Present Complete Draft

Present the user with the complete full draft once all sections are completed (or as per YOLO mode interaction).

#### 4D. UI Component Handoff Note

If there is a UI component to this PRD, you can inform the user that the Design Architect should take this final output.

### 5\. Checklist Assessment

- Use the `pm-checklist` to consider each item in the checklist is met (or n/a) against the PRD.
- Document completion status for each item.
- Present the user with summary of each section of the checklist before going to the next section.
- Address deficiencies with user for input or suggested updates or corrections.
- Once complete and address, output the final checklist with all the checked items or skipped items, the section summary table, and any final notes. The checklist should have any findings that were discuss and resolved or ignored also. This will be a nice artifact for the user to keep.

### 6\. Produce the PRD

Produce the PRD with PM Prompt per the `prd-tmpl` utilizing the following guidance:

**General Presentation & Content:**

- Present Project Briefs (drafts or final) in a clean, full format.
- Crucially, DO NOT truncate information that has not changed from a previous version.
- For complete documents, begin directly with the content (no introductory text is needed).

<important_note>
**Next Steps for UI/UX Specification (If Applicable):**

- If the product described in this PRD includes a user interface:

  1.  **Include Design Architect Prompt in PRD:** You will add a dedicated section in the PRD document you are producing, specifically at the location marked `(END Checklist START Design Architect UI/UX Specification Mode Prompt)` (as per the `prd-tmpl` structure). This section will contain a prompt for the **Design Architect** agent.

      - The prompt should clearly state that the Design Architect is to operate in its **'UI/UX Specification Mode'**.

      - It should instruct the Design Architect to use this PRD as primary input to collaboratively define and document detailed UI/UX specifications. This might involve creating/populating a `front-end-spec-tmpl` and ensuring key UI/UX considerations are integrated or referenced back into the PRD to enrich it.

      - Example prompt text to insert:

        ```markdown
        ## Prompt for Design Architect (UI/UX Specification Mode)

        **Objective:** Elaborate on the UI/UX aspects of the product defined in this PRD.
        **Mode:** UI/UX Specification Mode
        **Input:** This completed PRD document.
        **Key Tasks:**

        1. Review the product goals, user stories, and any UI-related notes herein.
        2. Collaboratively define detailed user flows, wire-frames (conceptual), and key screen mockups/descriptions.
        3. Specify usability requirements and accessibility considerations.
        4. Populate or create the `front-end-spec-tmpl` document.
        5. Ensure that this PRD is updated or clearly references the detailed UI/UX specifications derived from your work, so that it provides a comprehensive foundation for subsequent architecture and development phases.

        Please guide the user through this process to enrich the PRD with detailed UI/UX specifications.
        ```

  2.  **Recommend User Workflow:** After finalizing this PRD (with the included prompt for the Design Architect), strongly recommend to the user the following sequence:
      a. First, engage the **Design Architect** agent (using the prompt you've embedded in the PRD) to operate in **'UI/UX Specification Mode'**. Explain that this step is crucial for detailing the user interface and experience, and the output (e.g., a populated `front-end-spec-tmpl` and potentially updated PRD sections) will be vital.
      b. Second, _after_ the Design Architect has completed its UI/UX specification work, the user should then proceed to engage the **Architect** agent (using the 'Initial Architect Prompt' also contained in this PRD). The PRD, now enriched with UI/UX details, will provide a more complete basis for technical architecture design.

- If the product does not include a user interface, you will simply recommend proceeding to the Architect agent using the 'Initial Architect Prompt' in the PRD.
  </important_note>

## Guiding Principles for Epic and User Story Generation

### I. Strategic Foundation: Define Core Value & MVP Scope Rigorously

Understand & Clarify Core Needs: Start by deeply understanding and clarifying the core problem this product solves, the essential needs of the defined User Personas (or system actors), and the key business objectives for the Minimum Viable Product (MVP).
Challenge Scope Relentlessly: Actively challenge all requested features and scope at every stage. For each potential feature or story, rigorously ask, "Does this directly support the core MVP goals and provide significant value to a target User Persona?" Clearly identify and defer non-essential functionalities to a Post-MVP backlog.

### II. Structuring the Work: Value-Driven Epics & Logical Sequencing

Organize into Deployable, Value-Driven Epics: Structure the MVP scope into Epics. Each Epic must be designed to deliver a significant, end-to-end, and fully deployable increment of testable functionality that provides tangible value to the user or business. Epics should represent logical functional blocks or coherent user journeys.

Logical Epic Sequencing & Foundational Work:
Ensure the sequence of Epics follows a logical implementation order, making dependencies between Epics clear and explicitly managed.
The first Epic must always establish the foundational project infrastructure (e.g., initial app setup, Git repository, CI/CD pipeline, core cloud service configurations, basic user authentication shell if needed universally) necessary to support its own deployable functionality and that of subsequent Epics.
Ensure Logical Story Sequencing and Dependency Awareness within Epics:
After initially drafting all User Stories for an Epic, but before detailed review with the user, you (the AI Agent executing this task) must explicitly perform an internal review to establish a logical sequence for these stories.
For each story, identify if it has direct prerequisite stories within the same Epic or from already completed Epics.
Propose a clear story order to the user, explaining the rationale based on these dependencies (e.g., "Story X needs to be done before Story Y because..."). Make significant dependencies visible, perhaps as a note within the story description.

### III. Crafting Effective User Stories: Vertical Slices Focused on Value & Clarity

Define Stories as "Vertical Slices": Within each Epic, define User Stories as "vertical slices". This means each story must deliver a complete piece of functionality that achieves a specific user or system goal, potentially cutting through all necessary layers (e.g., UI, API, business logic, database).
Focus on "What" and "Why," Not "How":
Stories will primarily focus on the functional outcome, the user value ("what"), and the reason ("why"). Avoid detailing technical implementation ("how") in the story's main description.
The "As a {specific User Persona/system actor}, I want {to perform an action / achieve a goal} so that {I can realize a benefit / achieve a reason}" format is standard. Be precise and consistent when defining the '{specific User Persona/system actor}', ensuring it aligns with defined personas.
Ensure User Value, Not Just Technical Tasks: User Stories must articulate clear user or business value. Avoid creating stories that are purely technical tasks (e.g., "Set up database," "Refactor module X"), unless they are part of the foundational infrastructure Epic or are essential enabling tasks that are explicitly linked to, and justified by, a user-facing story that delivers value.
Appropriate Sizing & Strive for Independence:
Ensure User Stories are appropriately sized for a typical development iteration (i.e., can be completed by the team in one sprint/iteration).
If a vertically sliced story is too large or complex, work with the user to split it into smaller, still valuable, and still vertically sliced increments.
Where feasible, define stories so they can be developed, tested, and potentially delivered independently of others. If dependencies are unavoidable, they must be clearly identified and managed through sequencing.

### IV. Detailing Stories: Comprehensive Acceptance Criteria & Developer Enablement

Clear, Comprehensive, and Testable Acceptance Criteria (ACs):
Every User Story will have detailed, unambiguous, and testable Acceptance Criteria.
ACs precisely define what "done" means for that story from a functional perspective and serve as the basis for verification.
Where a specific Non-Functional Requirement (NFR) from the PRD (e.g., a particular performance target for a specific action, a security constraint for handling certain data) is critical to a story, ensure it is explicitly captured or clearly referenced within its Acceptance Criteria.
Integrate Developer Enablement & Iterative Design into Stories:
Local Testability (CLI): For User Stories involving backend processing or data components, ensure the ACs consider or specify the ability for developers to test that functionality locally (e.g., via CLI commands, local service instances).
Iterative Schema Definition: Database schema changes (new tables, columns) should be introduced iteratively within the User Stories that functionally require them, rather than defining the entire schema upfront.
Upfront UI/UX Standards (if UI applicable): For User Stories with a UI component, ACs should explicitly state requirements regarding look and feel, responsiveness, and adherence to chosen frameworks/libraries (e.g., Tailwind CSS, shadcn/ui) from the start.

### V. Managing Complexity: Addressing Cross-Cutting Concerns Effectively

Critically Evaluate for Cross-Cutting Concerns:
Before finalizing a User Story, evaluate if the described functionality is truly a discrete, user-facing piece of value or if it represents a cross-cutting concern (e.g., a specific logging requirement, a UI theme element used by many views, a core technical enabler for multiple other stories, a specific aspect of error handling).
If a piece of functionality is identified as a cross-cutting concern:
a. Avoid creating a separate User Story for it unless it delivers standalone, testable user value.
b. Instead, integrate the requirement as specific Acceptance Criteria within all relevant User Stories it impacts.
c. Alternatively, if it's a pervasive technical enabler or a non-functional requirement that applies broadly, document it clearly within the relevant PRD section (e.g., 'Non Functional Requirements', 'Technical Assumptions'), or as a note for the Architect within the story descriptions if highly specific.

Your aim is to ensure User Stories remain focused on delivering measurable user value, while still capturing all necessary technical and functional details appropriately.

### VI. Ensuring Quality & Smooth Handoff

Maintain Clarity for Handoff and Architectural Freedom: User Stories, their descriptions, and Acceptance Criteria must be detailed enough to provide the Architect with a clear and comprehensive understanding of "what is required," while allowing for architectural flexibility on the "how."
Confirm "Ready" State: Before considering an Epic's stories complete, ensure each story is effectively "ready" for subsequent architectural review or development planning – meaning it's clear, understandable, testable, its dependencies are noted, and any foundational work (like from the first epic) is accounted for.

## Offer Advanced Self-Refinement & Elicitation Options

(This section is called when needed prior to this)

Present the user with the following list of 'Advanced Reflective, Elicitation & Brainstorming Actions'. Explain that these are optional steps to help ensure quality, explore alternatives, and deepen the understanding of the current section before finalizing it and moving on. The user can select an action by number, or choose to skip this and proceed to finalize the section.

"To ensure the quality of the current section: **[Specific Section Name]** and to ensure its robustness, explore alternatives, and consider all angles, I can perform any of the following actions. Please choose a number (8 to finalize and proceed):

**Advanced Reflective, Elicitation & Brainstorming Actions I Can Take:**

{Instruction for AI Agent: Display the title of each numbered item below. If the user asks what a specific option means, provide a brief explanation of the action you will take, drawing from detailed descriptions tailored for the context.}

1.  **Critical Self-Review & User Goal Alignment**
2.  **Generate & Evaluate Alternative Design Solutions**
3.  **User Journey & Interaction Stress Test (Conceptual)**
4.  **Deep Dive into Design Assumptions & Constraints**
5.  **Usability & Accessibility Audit Review & Probing Questions**
6.  **Collaborative Ideation & UI Feature Brainstorming**
7.  **Elicit 'Unforeseen User Needs' & Future Interaction Questions**
8.  **Finalize this Section and Proceed.**

After I perform the selected action, we can discuss the outcome and decide on any further revisions for this section."

REPEAT by Asking the user if they would like to perform another Reflective, Elicitation & Brainstorming Action UNIT the user indicates it is time to proceed ot the next section (or selects #8)

==================== END: create-prd ====================


==================== START: create-uxui-spec ====================
# Create UI/UX Specification Task

## Purpose

To collaboratively work with the user to define and document the User Interface (UI) and User Experience (UX) specifications for the project. This involves understanding user needs, defining information architecture, outlining user flows, and ensuring a solid foundation for visual design and frontend development. The output will populate a new document called `front-end-spec.md` following the `front-end-spec-tmpl` template.

## Inputs

- Project Brief (`project-brief.md` or equivalent)
- Product Requirements Document (PRD) (`prd.md` or equivalent)
- User feedback or research (if available)

## Key Activities & Instructions

### 1. Understand Core Requirements

- Review Project Brief and PRD to grasp project goals, target audience, key features, and any existing constraints.
- Ask clarifying questions about user needs, pain points, and desired outcomes.

### 2. Define Overall UX Goals & Principles (for `front-end-spec-tmpl`)

- Collaboratively establish and document:
  - Target User Personas (elicit details or confirm existing ones).
  - Key Usability Goals.
  - Core Design Principles for the project.

### 3. Develop Information Architecture (IA) (for `front-end-spec-tmpl`)

- Work with the user to create a Site Map or Screen Inventory.
- Define the primary and secondary Navigation Structure.
- Use Mermaid diagrams or lists as appropriate for the template.

### 4. Outline Key User Flows (for `front-end-spec-tmpl`)

- Identify critical user tasks from the PRD/brief.
- For each flow:
  - Define the user's goal.
  - Collaboratively map out the steps (use Mermaid diagrams or detailed step-by-step descriptions).
  - Consider edge cases and error states.

### 5. Discuss Wireframes & Mockups Strategy (for `front-end-spec-tmpl`)

- Clarify where detailed visual designs will be created (e.g., Figma, Sketch) and ensure the `front-end-spec-tmpl` correctly links to these primary design files.
- If low-fidelity wireframes are needed first, offer to help conceptualize layouts for key screens.

### 6. Define Component Library / Design System Approach (for `front-end-spec-tmpl`)

- Discuss if an existing design system will be used or if a new one needs to be developed.
- If new, identify a few foundational components to start with (e.g., Button, Input, Card) and their key states/behaviors at a high level. Detailed technical specs will be in `front-end-architecture`.

### 7. Establish Branding & Style Guide Basics (for `front-end-spec-tmpl`)

- If a style guide exists, link to it.
- If not, collaboratively define placeholders for: Color Palette, Typography, Iconography, Spacing.

### 8. Specify Accessibility (AX) Requirements (for `front-end-spec-tmpl`)

- Determine the target compliance level (e.g., WCAG 2.1 AA).
- List any known specific AX requirements.

### 9. Define Responsiveness Strategy (for `front-end-spec-tmpl`)

- Discuss and document key Breakpoints.
- Describe the general Adaptation Strategy.

### 10. Output Generation & Iterative Refinement (Guided by `front-end-spec-tmpl`)

- **a. Draft Section:** Incrementally populate one logical section of the `front-end-spec-tmpl` file based on your discussions.
- **b. Present & Incorporate Initial Feedback:** Present the drafted section to the user for review. Discuss, explain and incorporate their initial feedback and revisions directly.
- **c. [Offer Advanced Self-Refinement & Elicitation Options](#offer-advanced-self-refinement--elicitation-options)**

## Offer Advanced Self-Refinement & Elicitation Options

(This section is called when needed prior to this)

Present the user with the following list of 'Advanced Reflective, Elicitation & Brainstorming Actions'. Explain that these are optional steps to help ensure quality, explore alternatives, and deepen the understanding of the current section before finalizing it and moving on. The user can select an action by number, or choose to skip this and proceed to finalize the section.

"To ensure the quality of the current section: **[Specific Section Name]** and to ensure its robustness, explore alternatives, and consider all angles, I can perform any of the following actions. Please choose a number (8 to finalize and proceed):

**Advanced Reflective, Elicitation & Brainstorming Actions I Can Take:**

{Instruction for AI Agent: Display the title of each numbered item below. If the user asks what a specific option means, provide a brief explanation of the action you will take, drawing from detailed descriptions tailored for the context.}

1.  **Critical Self-Review & User Goal Alignment**
2.  **Generate & Evaluate Alternative Design Solutions**
3.  **User Journey & Interaction Stress Test (Conceptual)**
4.  **Deep Dive into Design Assumptions & Constraints**
5.  **Usability & Accessibility Audit Review & Probing Questions**
6.  **Collaborative Ideation & UI Feature Brainstorming**
7.  **Elicit 'Unforeseen User Needs' & Future Interaction Questions**
8.  **Finalize this Section and Proceed.**

After I perform the selected action, we can discuss the outcome and decide on any further revisions for this section."

REPEAT by Asking the user if they would like to perform another Reflective, Elicitation & Brainstorming Action UNIT the user indicates it is time to proceed ot the next section (or selects #8)

==================== END: create-uxui-spec ====================


==================== START: doc-sharding-task ====================
# Doc Sharding Task

You are a Technical Documentation Librarian tasked with granulating large project documents into smaller, organized files. Your goal is to transform monolithic documentation into a well-structured, navigable documentation system.

## Your Task

Transform large project documents into smaller, granular files within the `docs/` directory following the `doc-sharding-tmpl.txt` plan. Create and maintain `docs/index.md` as a central catalog for easier reference and context injection.

## Execution Process

1. If not provided, ask the user which source documents they wish to process (PRD, Main Architecture, Front-End Architecture)
2. Validate prerequisites:

   - Provided `doc-sharding-tmpl.txt` or access to `bmad-agent/doc-sharding-tmpl.txt`
   - Location of source documents to process
   - Write access to the `docs/` directory
   - Output method (file system or chat interface)

3. For each selected document:

   - Follow the structure in `doc-sharding-tmpl.txt`, processing only relevant sections
   - Extract content verbatim without summarization or reinterpretation
   - Create self-contained markdown files for each section or output to chat
   - Use consistent file naming as specified in the plan

4. For `docs/index.md` when working with the file system:

   - Create if absent
   - Add descriptive titles with relative markdown links
   - Organize content logically with brief descriptions
   - Ensure comprehensive cataloging

5. Maintain creation log and provide final report

## Rules

1. Never modify source content during extraction
2. Create files exactly as specified in the sharding plan
3. Seek approval when consolidating content from multiple sources
4. Maintain original context and meaning
5. Keep file names consistent with the plan
6. Update `index.md` for every new file

## Required Input

1. **Source Document Paths** - Path to document(s) to process (PRD, Architecture, or Front-End Architecture)
2. **Documents to Process** - Which documents to shard in this session
3. **Sharding Plan** - Confirm `docs/templates/doc-sharding-tmpl.txt` exists or `doc-sharding-tmpl.txt` has been provided
4. **Output Location** - Confirm Target directory (default: `docs/`) and index.md or in memory chat output

Would you like to proceed with document sharding? Please provide the required input.

==================== END: doc-sharding-task ====================


==================== START: library-indexing-task ====================
# Library Indexing Task

## Purpose

This task maintains the integrity and completeness of the `docs/index.md` file by scanning all documentation files and ensuring they are properly indexed with descriptions.

## Task Instructions

You are now operating as a Documentation Indexer. Your goal is to ensure all documentation files are properly cataloged in the central index.

### Required Steps

1. First, locate and scan:

   - The `docs/` directory and all subdirectories
   - The existing `docs/index.md` file (create if absent)
   - All markdown (`.md`) and text (`.txt`) files in the documentation structure

2. For the existing `docs/index.md`:

   - Parse current entries
   - Note existing file references and descriptions
   - Identify any broken links or missing files
   - Keep track of already-indexed content

3. For each documentation file found:

   - Extract the title (from first heading or filename)
   - Generate a brief description by analyzing the content
   - Create a relative markdown link to the file
   - Check if it's already in the index
   - If missing or outdated, prepare an update

4. For any missing or non-existent files found in index:

   - Present a list of all entries that reference non-existent files
   - For each entry:
     - Show the full entry details (title, path, description)
     - Ask for explicit confirmation before removal
     - Provide option to update the path if file was moved
     - Log the decision (remove/update/keep) for final report

5. Update `docs/index.md`:
   - Maintain existing structure and organization
   - Add missing entries with descriptions
   - Update outdated entries
   - Remove only entries that were confirmed for removal
   - Ensure consistent formatting throughout

### Index Entry Format

Each entry in `docs/index.md` should follow this format:

```markdown
### [Document Title](relative/path/to/file.md)

Brief description of the document's purpose and contents.
```

### Rules of Operation

1. NEVER modify the content of indexed files
2. Preserve existing descriptions in index.md when they are adequate
3. Maintain any existing categorization or grouping in the index
4. Use relative paths for all links
5. Ensure descriptions are concise but informative
6. NEVER remove entries without explicit confirmation
7. Report any broken links or inconsistencies found
8. Allow path updates for moved files before considering removal

### Process Output

The task will provide:

1. A summary of changes made to index.md
2. List of newly indexed files
3. List of updated entries
4. List of entries presented for removal and their status:
   - Confirmed removals
   - Updated paths
   - Kept despite missing file
5. Any other issues or inconsistencies found

### Handling Missing Files

For each file referenced in the index but not found in the filesystem:

1. Present the entry:

   ```markdown
   Missing file detected:
   Title: [Document Title]
   Path: relative/path/to/file.md
   Description: Existing description

   Options:

   1. Remove this entry
   2. Update the file path
   3. Keep entry (mark as temporarily unavailable)

   Please choose an option (1/2/3):
   ```

2. Wait for user confirmation before taking any action
3. Log the decision for the final report

## Required Input

Please provide:

1. Location of the `docs/` directory
2. Confirmation of write access to `docs/index.md`
3. Any specific categorization preferences
4. Any files or directories to exclude from indexing

Would you like to proceed with library indexing? Please provide the required input above.

==================== END: library-indexing-task ====================


