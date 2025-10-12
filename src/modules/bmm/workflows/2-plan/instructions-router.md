# PRD Workflow Router Instructions

<workflow>

<critical>This is the INITIAL ASSESSMENT phase - determines which instruction set to load</critical>
<critical>ALWAYS check for existing project-workflow-status.md first</critical>
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>

<step n="1" goal="Check for existing workflow status or create new versioned file">

<action>Check if any project-workflow-status\*.md files exist in {output_folder}/</action>

<check if="exists">
  <action>Find the most recent project-workflow-status-YYYY-MM-DD.md file</action>
  <action>Load the status file</action>
  <action>Check for existing workflow outputs based on level in status file:</action>

- Level 0: Check for tech-spec.md
- Level 1-2: Check for PRD.md, epic-stories.md, tech-spec.md
- Level 3-4: Check for PRD.md, epics.md

<ask>Found existing workflow status file: project-workflow-status-{{file_date}}.md (Level {{project_level}})

**Existing documents detected:**
{{list_existing_docs}}

Options:

1. Continue with this workflow (will update existing status file)
2. Start new workflow (will create new dated status file: project-workflow-status-{{today}}.md)
3. Review and modify previous status
4. I'm working on something else (ignore this file)

   </ask>

  <check if='option == "1"'>
    <action>Set status_file_path = existing file path</action>
    <action>Set continuation_mode = true</action>
  </check>

  <check if='option == "2"'>
    <action>Set status_file_path = "{output_folder}/project-workflow-status-{{today}}.md"</action>
    <action>Archive old status file to: "{output_folder}/archive/project-workflow-status-{{old_date}}.md"</action>
    <action>Set continuation_mode = false</action>
    <action>Proceed to new assessment</action>
  </check>

  <check if='option == "4"'>
    <action>Do not use status file for this session</action>
    <action>Proceed with user's requested workflow</action>
    <action>Exit router (user is not using BMM planning workflow)</action>
  </check>

</check>

<check if="not exists">
  <action>Create new versioned status file</action>
  <action>Set status_file_path = "{output_folder}/project-workflow-status-{{today}}.md"</action>
  <action>Set start_date = {{today}}</action>
  <action>Proceed to assessment</action>
</check>

</step>

<step n="2" goal="Determine workflow path">

<ask>What type of planning do you need?

**Quick Selection:**

1. Full project planning (PRD, Tech Spec, etc.)
2. UX/UI specification only
3. Tech spec only (for small changes)
4. Generate AI Frontend Prompt from existing specs

Select an option or describe your needs:
</ask>

<action>Capture user selection as {{planning_type}}</action>

<check if='{{planning_type}} == "2" OR "UX/UI specification only"'>
  <invoke-workflow>{installed_path}/ux/workflow.yaml</invoke-workflow>
  <action>Pass mode="standalone" to UX workflow</action>
  <action>Exit router workflow (skip remaining steps)</action>
</check>

<check if='{{planning_type}} == "4" OR "Generate AI Frontend Prompt"'>
  <action>Check for existing UX spec or PRD</action>
  <invoke-task>{project-root}/bmad/bmm/tasks/ai-fe-prompt.md</invoke-task>
  <action>Exit router workflow after prompt generation</action>
</check>

<action if='{{planning_type}} == "1" OR "3" OR "Tech spec only" OR "Full project planning"'>Continue to step 3 for project assessment</action>

</step>

<step n="3" goal="Project context assessment" if="not_ux_only">

<ask>Let's understand your project needs:

**1. Project Type:**

1. Game
2. Web application
3. Mobile application
4. Desktop application
5. Backend service/API
6. Library/package
7. Other - Please specify

**2. Project Context:**

a. New project (greenfield)
b. Adding to existing clean codebase (brownfield - well documented)
c. Working with messy/legacy code (brownfield - needs documentation)

**3. What are you building?** (brief description)
</ask>

<action>Capture field_type = "greenfield" or "brownfield"</action>

<check if='field_type == "brownfield" AND (project_context == "c" OR project_context == "Working with messy/legacy code")'>
  <action>Check for {project-root}/docs/index.ts or {project-root}/docs/index.md</action>

  <check if="not exists">
    <ask>This brownfield project needs codebase documentation for effective planning.

**Documentation Status:** No index.ts or index.md found in docs/

**Options:**

1. Generate docs now (run document-project workflow - ~10-15 min, recommended)
2. I'll provide context through questions during planning
3. Continue anyway (may need more context later during implementation)

**Recommendation for Level 0-1:** Option 1 or 2 ensures faster, more accurate planning

Choose option (1-3):</ask>

    <check if='option == "1"'>
      <action>Set needs_documentation = true</action>
      <action>Will invoke document-project after assessment</action>
    </check>

    <check if='option == "2"'>
      <action>Set gather_context_via_questions = true</action>
      <action>Will ask detailed questions during tech-spec generation</action>
    </check>

    <check if='option == "3"'>
      <action>Set proceed_without_docs = true</action>
      <action>Note: May require additional context gathering during implementation</action>
    </check>

  </check>

  <check if="exists">
    <action>Set has_documentation = true</action>
    <action>Will reference docs/index.ts during planning</action>
  </check>
</check>

<action>Detect if project_type == "game"</action>

<check if='project_type == "game"'>
  <action>Set workflow_type = "gdd"</action>
  <action>Skip level classification (GDD workflow handles all game project levels)</action>
  <action>Jump to step 5 for GDD-specific assessment</action>
</check>

<action>Else, based on their description, analyze and suggest scope level:</action>

Examples:

- "Fix login bug" → Suggests Level 0 (single atomic change)
- "Add OAuth to existing app" → Suggests Level 1 (coherent feature)
- "Build internal admin dashboard" → Suggests Level 2 (small system)
- "Create customer portal with payments" → Suggests Level 3 (full product)
- "Multi-tenant SaaS platform" → Suggests Level 4 (platform)

<ask>Based on your description, this appears to be a **{{suggested_level}}** project.

**3. Quick Scope Guide - Please confirm or adjust:**

1. **Single atomic change** → Bug fix, add endpoint, single file change (Level 0)
2. **Coherent feature** → Add search, implement SSO, new component (Level 1)
3. **Small complete system** → Admin tool, team app, prototype (Level 2)
4. **Full product** → Customer portal, SaaS MVP (Level 3)
5. **Platform/ecosystem** → Enterprise suite, multi-tenant system (Level 4)

**4. Do you have existing documentation?**

1. Product Brief
2. Market Research
3. Technical docs/Architecture
4. None
   </ask>

</step>

<step n="4" goal="Determine project level and workflow path">

<action>Based on responses, determine:</action>

**Level Classification:**

- **Level 0**: Single atomic change → tech-spec only
- **Level 1**: Single feature, 1-10 stories → minimal PRD + tech-spec
- **Level 2**: Small system, 5-15 stories → focused PRD + tech-spec
- **Level 3**: Full product, 12-40 stories → full PRD + architect handoff
- **Level 4**: Platform, 40+ stories → enterprise PRD + architect handoff

<action>For brownfield without docs:</action>

- Levels 0-2: Can proceed with context gathering
- Levels 3-4: MUST run architect assessment first

</step>

<step n="4a" goal="Run document-project if needed" optional="true">

<check if="needs_documentation == true">
  <action>Invoke document-project workflow before continuing with planning</action>
  <invoke-workflow>{project-root}/bmad/bmm/workflows/1-analysis/document-project/workflow.yaml</invoke-workflow>
  <action>Wait for documentation to complete</action>
  <action>Verify docs/index.ts or docs/index.md was created</action>
</check>

</step>

<step n="5" goal="Create workflow status document">

<action>Initialize status file using status_template from workflow.yaml</action>
<action>Write to versioned file path: {{status_file_path}}</action>
<action>Set start_date = {{today}} in template variables</action>

<critical>Capture any technical preferences mentioned during assessment</critical>
<critical>Initialize Workflow Status Tracker with current state</critical>

Generate comprehensive status document with all assessment data.

<template-output file="{{status_file_path}}">project_type</template-output>
<template-output file="project-workflow-status.md">project_level</template-output>
<template-output file="project-workflow-status.md">instruction_set</template-output>
<template-output file="project-workflow-status.md">scope_description</template-output>
<template-output file="project-workflow-status.md">story_count</template-output>
<template-output file="project-workflow-status.md">epic_count</template-output>
<template-output file="project-workflow-status.md">timeline</template-output>
<template-output file="project-workflow-status.md">field_type</template-output>
<template-output file="project-workflow-status.md">existing_docs</template-output>
<template-output file="project-workflow-status.md">team_size</template-output>
<template-output file="project-workflow-status.md">deployment_intent</template-output>
<template-output file="project-workflow-status.md">expected_outputs</template-output>
<template-output file="project-workflow-status.md">workflow_steps</template-output>
<template-output file="project-workflow-status.md">next_steps</template-output>
<template-output file="project-workflow-status.md">special_notes</template-output>
<template-output file="project-workflow-status.md">technical_preferences</template-output>

<action>Initialize Workflow Status Tracker section:</action>

<template-output file="project-workflow-status.md">current_phase</template-output>
Set to: "2-Plan"

<template-output file="project-workflow-status.md">current_workflow</template-output>
<check if="Level 0">Set to: "tech-spec (Level 0 - starting)"</check>
<check if="Level 1">Set to: "tech-spec (Level 1 - starting)"</check>
<check if="Level 2+">Set to: "PRD (Level {{project_level}} - starting)"</check>

<template-output file="project-workflow-status.md">progress_percentage</template-output>
Set to: 10% (assessment complete)

<template-output file="project-workflow-status.md">artifacts_table</template-output>
Initialize with:

```
| project-workflow-status.md | Complete | {output_folder}/project-workflow-status.md | {{date}} |
```

<template-output file="project-workflow-status.md">next_action</template-output>
<check if="Level 0">Set to: "Generate technical specification and single user story"</check>
<check if="Level 1">Set to: "Generate technical specification and epic/stories (2-3 stories)"</check>
<check if="Level 2+">Set to: "Generate PRD and epic breakdown"</check>

<template-output file="project-workflow-status.md">decisions_log</template-output>
Add first entry:

```
- **{{date}}**: Project assessment completed. Classified as Level {{project_level}} {{field_type}} project. Routing to {{instruction_set}} workflow.
```

</step>

<step n="6" goal="Load appropriate instruction set and handle continuation">

<critical>Based on project type and level, load ONLY the needed instructions:</critical>

<check if='workflow_type == "gdd"'>
  <invoke-workflow>{installed_path}/gdd/workflow.yaml</invoke-workflow>
  <action>GDD workflow handles all game project levels internally</action>
</check>

<check if="Level 0">
  <invoke-workflow>{installed_path}/tech-spec/workflow.yaml</invoke-workflow>
  <action>Pass level=0 to tech-spec workflow</action>
  <action>Tech-spec workflow will generate user-story.md after tech-spec completion</action>
</check>

<check if="Level 1">
  <invoke-workflow>{installed_path}/tech-spec/workflow.yaml</invoke-workflow>
  <action>Pass level=1 to tech-spec workflow</action>
  <action>Tech-spec workflow will generate epic-stories.md after tech-spec completion</action>
</check>

<check if="Level 2">
  <invoke-workflow>{installed_path}/prd/workflow.yaml</invoke-workflow>
  <action>Pass level context to PRD workflow (loads instructions-med.md)</action>
</check>

<check if="Level 3-4">
  <invoke-workflow>{installed_path}/prd/workflow.yaml</invoke-workflow>
  <action>Pass level context to PRD workflow (loads instructions-lg.md)</action>
</check>

<critical>Pass continuation context to invoked workflow:</critical>

- continuation_mode: true/false
- last_completed_step: {{step_number}}
- existing_documents: {{document_list}}
- project_level: {{level}}

<critical>The invoked workflow's instruction set should check continuation_mode and adjust accordingly</critical>

</step>

</workflow>
