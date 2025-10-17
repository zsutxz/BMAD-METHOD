# Workflow Status Check

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/1-analysis/workflow-status/workflow.yaml</critical>
<critical>This is the UNIVERSAL entry point - any agent can ask "what should I do now?"</critical>

<workflow>

<step n="1" goal="Check for status file">
<action>Search {output_folder}/ for file: bmm-workflow-status.md</action>

<check if="no status file found">
  <output>No workflow status found. To get started:

Load analyst agent and run: `workflow-init`

This will guide you through project setup and create your workflow path.</output>
<action>Exit workflow</action>
</check>

<check if="status file found">
  <action>Continue to step 2</action>
</check>
</step>

<step n="2" goal="Read and parse status">
<action>Read bmm-workflow-status.md</action>
<action>Extract key-value pairs from status file:</action>

Parse these fields:

- PROJECT_NAME
- PROJECT_TYPE
- PROJECT_LEVEL
- FIELD_TYPE
- CURRENT_PHASE
- CURRENT_WORKFLOW
- TODO_STORY
- IN_PROGRESS_STORY
- NEXT_ACTION
- NEXT_COMMAND
- NEXT_AGENT
  </step>

<step n="3" goal="Display current status and options">
<action>Load workflow path file to check for optional steps</action>
<action>Check if current workflow is in progress or complete</action>

<output>
## 📊 Current Status

**Project:** {{PROJECT_NAME}} (Level {{PROJECT_LEVEL}} {{PROJECT_TYPE}})
**Phase:** {{CURRENT_PHASE}}
**Current Workflow:** {{CURRENT_WORKFLOW}}

{{#if CURRENT_PHASE == "4-Implementation"}}
**Development Queue:**

- TODO: {{TODO_STORY}} - {{TODO_TITLE}}
- IN PROGRESS: {{IN_PROGRESS_STORY}} - {{IN_PROGRESS_TITLE}}
  {{/if}}

## 🎯 Your Options

{{#if CURRENT_WORKFLOW != "complete"}}
**Continue in progress:**

- {{CURRENT_WORKFLOW}} ({{CURRENT_AGENT}} agent)
  {{/if}}

**Next required step:**

- Command: `{{NEXT_COMMAND}}`
- Agent: {{NEXT_AGENT}}

{{#if optional_workflows_available}}
**Optional workflows available:**
{{#each optional_workflows}}

- {{workflow_name}} ({{agent}})
  {{/each}}
  {{/if}}
  </output>
  </step>

<step n="4" goal="Offer actions">
<ask>What would you like to do?

{{#if CURRENT_WORKFLOW != "complete"}}

1. **Continue current** - Resume {{CURRENT_WORKFLOW}}
   {{/if}}
2. **Next required** - {{NEXT_COMMAND}}
   {{#if optional_workflows_available}}
3. **Optional workflow** - Choose from available options
   {{/if}}
4. **View full status** - See complete status file
5. **Exit** - Return to agent

Your choice:</ask>

<action>Handle user selection based on available options</action>
</step>

</workflow>
