# Workflow Status Service - Integration Examples

## How Other Workflows Can Use the Enhanced workflow-status Service

### Example 1: Simple Validation (product-brief workflow)

Replace the old Step 0:

```xml
<!-- OLD WAY - 35+ lines of duplicate code -->
<step n="0" goal="Check and load workflow status file">
<action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
<action>Find the most recent file...</action>
<!-- ... 30+ more lines of checking logic ... -->
</step>
```

With the new service call:

```xml
<!-- NEW WAY - Clean and simple -->
<step n="0" goal="Validate workflow readiness">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/1-analysis/workflow-status">
  <param>mode: validate</param>
  <param>calling_workflow: product-brief</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>{{suggestion}}</output>
  <output>Note: Status tracking is optional. You can continue without it.</output>
</check>

<check if="warning != ''">
  <output>{{warning}}</output>
  <ask>Continue anyway? (y/n)</ask>
  <check if="n">
    <action>Exit workflow</action>
  </check>
</check>

<action>Store {{status_file_path}} for later updates if needed</action>
</step>
```

### Example 2: Getting Story Data (create-story workflow)

Replace the complex Step 2.5:

```xml
<!-- OLD WAY - Complex parsing logic -->
<step n="2.5" goal="Check status file TODO section for story to draft">
<action>Read {output_folder}/bmm-workflow-status.md (if exists)</action>
<action>Navigate to "### Implementation Progress (Phase 4 Only)" section</action>
<action>Find "#### TODO (Needs Drafting)" section</action>
<!-- ... 40+ lines of parsing and extraction ... -->
</step>
```

With the new service call:

```xml
<!-- NEW WAY - Let workflow-status handle the complexity -->
<step n="2.5" goal="Get next story to draft">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/1-analysis/workflow-status">
  <param>mode: data</param>
  <param>data_request: next_story</param>
</invoke-workflow>

<check if="status_exists == false">
  <action>Fall back to legacy story discovery</action>
</check>

<check if="todo_story_id exists">
  <action>Use {{todo_story_id}} as story to draft</action>
  <action>Use {{todo_story_title}} for validation</action>
  <action>Create file: {{todo_story_file}}</action>
  <output>Drafting story {{todo_story_id}}: {{todo_story_title}}</output>
</check>
</step>
```

### Example 3: Getting Project Configuration (solution-architecture workflow)

```xml
<step n="0" goal="Load project configuration">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/1-analysis/workflow-status">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <ask>No status file. Run standalone or create status first?</ask>
</check>

<check if="status_exists == true">
  <action>Use {{project_level}} to determine architecture complexity</action>
  <action>Use {{project_type}} to select appropriate templates</action>
  <action>Use {{field_type}} to know if brownfield constraints apply</action>
</check>
</step>
```

### Example 4: Quick Init Check (any workflow)

```xml
<step n="0" goal="Check if status exists">
<invoke-workflow path="{project-root}/bmad/bmm/workflows/1-analysis/workflow-status">
  <param>mode: init-check</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>{{suggestion}}</output>
  <output>Proceeding without status tracking...</output>
</check>
</step>
```

## Benefits of This Approach

1. **DRY Principle**: No more duplicating status check logic across 50+ workflows
2. **Centralized Logic**: Bug fixes and improvements happen in one place
3. **Backward Compatible**: Old workflows continue to work, can migrate gradually
4. **Advisory Not Blocking**: Workflows can proceed even without status file
5. **Flexible Data Access**: Get just what you need (next_story, project_config, etc.)
6. **Cleaner Workflows**: Focus on core logic, not status management

## Available Modes

### `validate` Mode

- **Purpose**: Check if this workflow should run
- **Returns**:
  - `status_exists`: true/false
  - `should_proceed`: true (always - advisory only)
  - `warning`: Any sequence warnings
  - `suggestion`: What to do
  - `project_level`, `project_type`, `field_type`: For workflow decisions
  - `status_file_path`: For later updates

### `data` Mode

- **Purpose**: Extract specific information
- **Parameters**: `data_request` = one of:
  - `next_story`: Get TODO story details
  - `project_config`: Get project configuration
  - `phase_status`: Get phase completion status
  - `all`: Get everything
- **Returns**: Requested fields as template outputs

### `init-check` Mode

- **Purpose**: Simple existence check
- **Returns**:
  - `status_exists`: true/false
  - `suggestion`: Brief message

### `interactive` Mode (default)

- **Purpose**: User-facing status check
- **Shows**: Current status, options menu
- **Returns**: User proceeds with selected action

## Migration Strategy

1. Start with high-value workflows that have complex Step 0s
2. Test with a few workflows first
3. Gradually migrate others as they're updated
4. Old workflows continue to work unchanged

## Next Steps

To integrate into your workflow:

1. Replace your Step 0 with appropriate service call
2. Remove duplicate status checking logic
3. Use returned values for workflow decisions
4. Update status file at completion (if status_exists == true)
