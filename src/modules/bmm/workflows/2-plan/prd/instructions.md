# PRD Workflow - Unified Instructions (Level 2-4)

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is the UNIFIED instruction set for Level 2-4 projects - scale-adaptive PRD</critical>
<critical>Level 0-1 use tech-spec workflow - this workflow is ONLY for Level 2-4</critical>
<critical>Uses prd_template for PRD output, epics_template for epics.md output</critical>
<critical>NO TECH-SPEC in this workflow - architecture/solutioning handled by specialist workflows</critical>
<critical>If users mention technical details, append to technical_preferences</critical>

<!-- TEMPLATE OUTPUT SYNTAX GUIDE -->
<syntax-guide>
**Understanding template-output tags:**

`<template-output>section_name</template-output>`
→ Fills a SECTION within the PRD template (creates/updates PRD.md)
→ Example: <template-output>goals</template-output> fills the "Goals" section in PRD.md

`<template-output file="filename.md">content_description</template-output>`
→ Creates a SEPARATE PHYSICAL FILE using the specified template structure
→ This is NOT optional - you MUST create this file
→ Example: <template-output file="epics.md">epic_details</template-output> creates a new file called epics.md

**Critical:** When you see `file="filename.md"`, you must physically create that file - it is a required deliverable!
</syntax-guide>

<step n="1" goal="Load context, determine level, and handle continuation">

<action>Load bmm-workflow-status.md</action>
<action>Confirm project_level is 2, 3, or 4</action>

<check if="level < 2">
  <error>This workflow is for Level 2-4 only. Level 0-1 should use tech-spec workflow.</error>
  <action>Exit and redirect to tech-spec workflow</action>
</check>

<check if="continuation_mode == true">
  <action>Load existing PRD.md and check completion status</action>
  <ask>Found existing work. Would you like to:

1. Review what's done and continue
2. Modify existing sections
3. Start fresh
   </ask>
   <action>If continuing, skip to first incomplete section</action>
   </check>

<check if="new or starting fresh">
  Check `output_folder` for existing docs.

  <check if="level >= 3">
    <critical>Product Brief is STRONGLY recommended for Level 3-4</critical>
  </check>

  <check if="level == 2">
    <action>Ask if they have a Product Brief (optional but helpful)</action>
  </check>

<action>Load prd_template from workflow.yaml</action>

  <check if="level == 2">
    <action>Discuss to get core idea of what they're building</action>
  </check>

  <check if="level >= 3">
    <action>Get comprehensive description of the project vision</action>
  </check>

<template-output>description</template-output>
</check>

</step>

<step n="2" goal="Define deployment intent and goals">

<ask>What is the deployment intent?

<check if="level == 2">
- Demo/POC
- MVP for early users
- Production app
</check>

<check if="level >= 3">
- MVP for early users
- Production SaaS/application
- Enterprise system
- Platform/ecosystem
</check>
</ask>

<template-output>deployment_intent</template-output>

**Goal Guidelines (scale-adaptive):**

- **Level 2:** 2-3 primary goals
- **Level 3:** 3-5 strategic goals (measurable, outcome-focused)
- **Level 4:** 5-7 strategic goals (measurable, outcome-focused)

<check if="level >= 3">
  <critical>Each goal should be measurable and outcome-focused</critical>
</check>

<template-output>goals</template-output>

</step>

<step n="3" goal="Context - scale-adaptive depth">

<check if="level == 2">
  **Keep it brief:** 1 paragraph on why this matters now.
  Focus: Immediate problem and solution value
</check>

<check if="level >= 3">
  **Comprehensive context:** 1-2 paragraphs on problem, current situation, why now.
  Focus: Strategic positioning and market context
</check>

<template-output>context</template-output>

<check if="level >= 3">
  <invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
</check>

</step>

<step n="4" goal="Functional requirements - scale-adaptive">

**FR Guidelines (scale-adaptive):**

- **Level 2:** 8-15 FRs (focused set - what's essential to launch)
- **Level 3:** 12-20 FRs (comprehensive - complete product vision)
- **Level 4:** 20-30 FRs (comprehensive - full platform capabilities)

<check if="level == 2">
  Group related features by capability area.
  Focus on core functionality needed for MVP.
</check>

<check if="level >= 3">
  Group features logically across all domains.
  Cover complete product vision with clear categorization.
</check>

**Format:** `FR001: [user capability]`

<template-output>functional_requirements</template-output>
<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="5" goal="Non-functional requirements - scale-adaptive">

**NFR Guidelines (scale-adaptive):**

- **Level 2:** 3-5 NFRs (critical only - essential for deployment)
- **Level 3:** 8-12 NFRs (comprehensive - matched to deployment intent)
- **Level 4:** 8-12 NFRs (comprehensive - enterprise-grade requirements)

<check if="level == 2">
  Focus on critical NFRs only (performance, security, availability basics).
</check>

<check if="level >= 3">
  Match NFRs to deployment intent. Include scalability, monitoring, compliance, etc.
</check>

<template-output>non_functional_requirements</template-output>

</step>

<step n="6" goal="User journeys - scale-adaptive" optional="level == 2">

**Journey Guidelines (scale-adaptive):**

- **Level 2:** 0-1 simple journey (optional - primary use case happy path)
- **Level 3:** 2-3 detailed journeys (required - complete flows with decision points)
- **Level 4:** 3-5 comprehensive journeys (required - all personas and edge cases)

<check if="level == 2">
  <ask>Would you like to document a user journey for the primary use case? (recommended but optional)</ask>
  <check if="yes">
    Create 1 simple journey showing the happy path.
  </check>
</check>

<check if="level >= 3">
  <critical>User journeys are REQUIRED for Level 3-4</critical>
  Map complete user flows with decision points, alternatives, and edge cases.
</check>

<template-output>user_journeys</template-output>

<check if="level >= 3">
  <invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
</check>

</step>

<step n="7" goal="UX principles - scale-adaptive" optional="level == 2">

**UX Principles Guidelines (scale-adaptive):**

- **Level 2:** 3-5 key principles (optional - if UI-heavy)
- **Level 3:** 8-10 principles (required - guiding all interface decisions)
- **Level 4:** 8-10 principles (required - comprehensive design system guidance)

<check if="level == 2">
  <ask>Does this project have significant UI components? If so, document 3-5 key UX principles.</ask>
</check>

<check if="level >= 3">
  <critical>UX principles are REQUIRED for Level 3-4</critical>
  Document 8-10 comprehensive principles guiding all interface decisions.
</check>

<template-output>ux_principles</template-output>

</step>

<step n="8" goal="Epic structure summary for PRD">

**Epic Guidelines (scale-adaptive):**

- **Level 2:** 1-2 epics with 5-15 stories total
- **Level 3:** 2-5 epics with 12-40 stories total
- **Level 4:** 5+ epics with 40+ stories total

<check if="level == 2">
  Focus: Get to implementation quickly with simple epic grouping.
  Create simple epic list showing how work is organized.
</check>

<check if="level >= 3">
  Focus: Comprehensive planning for phased rollout.
  Each epic should deliver significant value and be independently deployable where possible.
</check>

**Create epic summary list for PRD:**

- Epic name
- Epic goal (1-2 sentences)
- Story count estimate
- Priority/sequence

<template-output>epics</template-output>

<check if="level >= 3">
  <invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
</check>

<check if="level == 2">
  <invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
</check>

</step>

<step n="9" goal="Generate detailed epic breakdown in epics.md">

<critical>REQUIRED FOR ALL LEVELS: Create separate epics.md with full story hierarchy</critical>
<critical>This is a SEPARATE FILE from PRD.md - you MUST physically create this file</critical>

<action>Load epics_template from workflow.yaml: {installed_path}/epics-template.md</action>

<critical>USE THIS TEMPLATE to create {epics_output_file} (epics.md) with the following structure:

- Header with project metadata (project_name, user_name, date, project_level, target_scale)
- Epic Overview section (high-level summary of all epics and delivery strategy)
- Epic Details section (one subsection per epic with full story breakdown)
  </critical>

**Content Requirements (scale-adaptive):**

<check if="level == 2">
  **Level 2 - Basic story structure:**

For each epic, include:

- Epic name and goal
- Story list with: - User story format: "As a [user], I want [goal], so that [benefit]" - Basic acceptance criteria (2-3 per story) - Story dependencies (if any)
  </check>

<check if="level >= 3">
  **Level 3-4 - Comprehensive story structure:**

For each epic, include:

- Epic name, goal, and expanded description
- Success criteria for the epic
- Story list with: - User story format: "As a [user], I want [goal], so that [benefit]" - Prerequisites and dependencies - Detailed acceptance criteria (3-8 per story) - Technical notes (high-level implementation considerations) - Priority and effort estimate (if known)
  </check>

<template-output file="epics.md">
**Structure to use:**

# {{project_name}} - Epic Breakdown

**Author:** {{user_name}}
**Date:** {{date}}
**Project Level:** {{project_level}}
**Target Scale:** {{target_scale}}

---

## Epic Overview

[High-level summary of all epics, delivery strategy, and phasing]

---

## Epic Details

### Epic 1: [Epic Name]

**Goal:** [Epic goal statement]

<check if="level >= 3">
**Success Criteria:**
- [Epic-level success criteria]
</check>

**Stories:**

#### Story 1.1: [Story Title]

**User Story:** As a [user], I want [goal], so that [benefit]

<check if="level >= 3">
**Prerequisites:**
- [Dependencies or setup needed]
</check>

**Acceptance Criteria:**

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

<check if="level >= 3">
**Technical Notes:**
- [High-level implementation considerations]

**Priority:** [High/Medium/Low]
**Estimated Effort:** [S/M/L/XL or story points]
</check>

[Repeat for all stories in epic]

---

[Repeat Epic Details section for all epics]

</template-output>

<check if="level >= 3">
  <invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>
</check>

<action>Verify epics.md was created in {output_folder}</action>

<ask>Epic breakdown file created at {epics_output_file}.

<check if="level == 2">
Generated {{epic_count}} epic(s) with approximately {{story_count}} stories.
</check>

<check if="level >= 3">
Generated {{epic_count}} epics with approximately {{story_count}} stories across all epics.
</check>

Would you like to review the epic structure before continuing? (y/n)</ask>

</step>

<step n="10" goal="Document out of scope" optional="level == 2">

<check if="level == 2">
  <ask>Any features or ideas to preserve for future phases? (optional but recommended)</ask>
</check>

<check if="level >= 3">
  <critical>Document features/ideas preserved for future phases</critical>
</check>

List features, capabilities, or ideas that are explicitly out of scope for this phase but valuable for future consideration.

<template-output>out_of_scope</template-output>

</step>

<step n="11" goal="Document assumptions and dependencies" optional="level == 2">

<check if="level == 2">
  <action>Only document ACTUAL assumptions that came up in discussion (optional)</action>
</check>

<check if="level >= 3">
  <critical>Document all assumptions and dependencies</critical>
  Include:
  - Technical assumptions
  - Business assumptions
  - External dependencies
  - Resource assumptions
</check>

<template-output>assumptions_and_dependencies</template-output>

</step>

<step n="12" goal="Validate outputs before handoff">

<action>Verify all required files were created:</action>

- [ ] PRD.md exists at {default_output_file}
- [ ] epics.md exists at {epics_output_file}

<check if="missing files">
  <error>CRITICAL: Required files missing!</error>
  <action>Return to appropriate step and create missing files</action>
</check>

<ask>All required documents created successfully. Would you like to run a validation check before proceeding to next phase? (y/n)</ask>

<check if="yes">
  <action>Validate PRD completeness:</action>
  - All required sections filled
  - Epic count matches project level expectations
  - Story count aligns with project level scale
  - Cross-references between PRD and epics.md are consistent

<action>Generate brief validation summary with any warnings or suggestions</action>
</check>

</step>

<step n="13" goal="Generate handoff and next steps checklist">

## Next Steps for {{project_name}}

<check if="level == 2">
Since this is a Level 2 project, you need **solutioning** before implementation.

**Start new chat with solutioning workflow and provide:**

1. This PRD: `{{default_output_file}}`
2. Epic structure: `{{epics_output_file}}`
3. Input documents: {{input_documents}}

**Ask solutioning workflow to:**

- Run `3-solutioning` workflow
- Generate solution-architecture.md
- Create per-epic tech specs as needed

## Complete Next Steps Checklist

### Phase 1: Solution Architecture and Design

- [ ] **Run solutioning workflow** (REQUIRED)
  - Command: `workflow solution-architecture`
  - Input: PRD.md, epics.md
  - Output: solution-architecture.md, tech-spec-epic-N.md files (as needed)

<check if="project has significant UX/UI components">
- [ ] **Run UX specification workflow** (HIGHLY RECOMMENDED for user-facing systems)
  - Command: `workflow plan-project` then select "UX specification"
  - Or continue within this workflow if UI-heavy
  - Input: PRD.md, epics.md, solution-architecture.md (once available)
  - Output: ux-specification.md
  - Optional: AI Frontend Prompt for rapid prototyping
  - Note: Creates comprehensive UX/UI spec including IA, user flows, components

<action>Update workflow status file to mark ux-spec as potential next step</action>
</check>

### Phase 2: Detailed Planning

- [ ] **Generate detailed user stories** (if not already comprehensive)
  - Command: `workflow generate-stories`
  - Input: epics.md + solution-architecture.md
  - Output: user-stories.md with full acceptance criteria

- [ ] **Create technical design documents**
  - Database schema
  - API specifications
  - Integration points

### Phase 3: Development Preparation

- [ ] **Set up development environment**
  - Repository structure
  - CI/CD pipeline
  - Development tools

- [ ] **Create sprint plan**
  - Story prioritization
  - Sprint boundaries
  - Resource allocation

<ask>Project Planning Complete! Next immediate action:

1. Start solutioning workflow
2. Create UX specification (if UI-heavy project)
3. Generate AI Frontend Prompt (if UX complete)
4. Review all outputs with stakeholders
5. Begin detailed story generation
6. Exit workflow

Which would you like to proceed with?</ask>

<check if="user selects option 2">
  <invoke-workflow>{project-root}/bmad/bmm/workflows/2-plan/ux/workflow.yaml</invoke-workflow>
  <action>Pass mode="integrated" with Level 2 context</action>
</check>

<check if="user selects option 3">
  <invoke-task>{project-root}/bmad/bmm/tasks/ai-fe-prompt.md</invoke-task>
</check>
</check>

<check if="level >= 3">
Since this is a Level {{project_level}} project, you need **solutioning** before stories.

**Start new chat with solutioning workflow and provide:**

1. This PRD: `{{default_output_file}}`
2. Epic structure: `{{epics_output_file}}`
3. Input documents: {{input_documents}}

**Ask solutioning workflow to:**

- Run `solution-architecture` workflow
- Consider reference architectures and technology patterns
- Generate solution-architecture.md
- Create per-epic tech specs

## Complete Next Steps Checklist

### Phase 1: Solution Architecture and Design

- [ ] **Run solutioning workflow** (REQUIRED)
  - Command: `workflow solution-architecture`
  - Input: PRD.md, epics.md
  - Output: solution-architecture.md, tech-spec-epic-N.md files

<check if="project has significant UX/UI components (Level 3-4 typically does)">
- [ ] **Run UX specification workflow** (HIGHLY RECOMMENDED for user-facing systems)
  - Command: `workflow plan-project` then select "UX specification"
  - Or continue within this workflow if UI-heavy
  - Input: PRD.md, epics.md, solution-architecture.md (once available)
  - Output: ux-specification.md
  - Optional: AI Frontend Prompt for rapid prototyping
  - Note: Creates comprehensive UX/UI spec including IA, user flows, components

<action>Update workflow status file to mark ux-spec as next step</action>
<action>In status file, set next_action: "Run UX specification workflow"</action>
<action>In status file, set next_command: "ux-spec"</action>
<action>In status file, set next_agent: "PM"</action>
<action>Add to decisions log: "PRD complete. UX workflow required due to UI components."</action>
</check>

### Phase 2: Detailed Planning

- [ ] **Generate detailed user stories**
  - Command: `workflow generate-stories`
  - Input: epics.md + solution-architecture.md
  - Output: user-stories.md with full acceptance criteria

- [ ] **Create technical design documents**
  - Database schema
  - API specifications
  - Integration points

- [ ] **Define testing strategy**
  - Unit test approach
  - Integration test plan
  - UAT criteria

### Phase 3: Development Preparation

- [ ] **Set up development environment**
  - Repository structure
  - CI/CD pipeline
  - Development tools

- [ ] **Create sprint plan**
  - Story prioritization
  - Sprint boundaries
  - Resource allocation

- [ ] **Establish monitoring and metrics**
  - Success metrics from PRD
  - Technical monitoring
  - User analytics

<ask>Project Planning Complete! Next immediate action:

1. Start solutioning workflow (solution-architecture) in a new context window
2. Create UX specification (if UI-heavy project)
3. Generate AI Frontend Prompt (if UX complete)
4. Review all outputs with stakeholders
5. Begin detailed story generation
6. Exit workflow

Which would you like to proceed with?</ask>

<check if="user selects option 2">
  <invoke-workflow>{project-root}/bmad/bmm/workflows/2-plan/ux/workflow.yaml</invoke-workflow>
  <action>Pass mode="integrated" with Level 3-4 context</action>
</check>

<check if="user selects option 3">
  <invoke-task>{project-root}/bmad/bmm/tasks/ai-fe-prompt.md</invoke-task>
</check>
</check>

</step>

</workflow>
