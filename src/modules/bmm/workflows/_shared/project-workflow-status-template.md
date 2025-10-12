# Project Workflow Status

**Project:** {{project_name}}
**Created:** {{start_date}}
**Last Updated:** {{last_updated}}
**Status File:** `project-workflow-status-{{start_date}}.md`

---

## Workflow Status Tracker

**Current Phase:** {{current_phase}}
**Current Workflow:** {{current_workflow}}
**Current Agent:** {{current_agent}}
**Overall Progress:** {{progress_percentage}}%

### Phase Completion Status

- [ ] **1-Analysis** - Research, brainstorm, brief (optional)
- [ ] **2-Plan** - PRD/GDD/Tech-Spec + Stories/Epics
- [ ] **3-Solutioning** - Architecture + Tech Specs (Level 2+ only)
- [ ] **4-Implementation** - Story development and delivery

### Implementation Progress (Phase 4 Only)

**Story Tracking:** {{story_tracking_mode}}

{{#if in_phase_4}}

#### Current Work In Progress

- **Current Epic:** {{current_epic_number}} - {{current_epic_title}}
- **Current Story:** {{current_story_number}} - {{current_story_title}}
- **Story File:** `{{current_story_file}}`
- **Story Status:** {{current_story_status}}

#### Next Story To Work On

- **Next Epic:** {{next_epic_number}} - {{next_epic_title}}
- **Next Story:** {{next_story_number}} - {{next_story_title}}
- **Next Story File:** `{{next_story_file}}`

**Logic:** Next story is determined by:

1. If current epic has more stories → next story in same epic
2. If current epic complete → first story of next epic
3. If all epics complete → Project complete!

#### Epic/Story Summary

**Total Epics:** {{total_epics}}
**Total Stories:** {{total_stories}}
**Completed Stories:** {{completed_stories}}
**Remaining Stories:** {{remaining_stories}}

**Epic Breakdown:**
{{#epics}}

- Epic {{epic_number}}: {{epic_title}} ({{epic_completed_stories}}/{{epic_total_stories}} stories complete)
  {{/epics}}

{{/if}}

### Artifacts Generated

| Artifact | Status | Location | Date |
| -------- | ------ | -------- | ---- |

{{#artifacts}}
| {{name}} | {{status}} | {{path}} | {{date}} |
{{/artifacts}}

### Next Action Required

**What to do next:** {{next_action}}

**Command to run:** {{next_command}}

**Agent to load:** {{next_agent}}

---

## Assessment Results

### Project Classification

- **Project Type:** {{project_type}}
- **Project Level:** {{project_level}}
- **Instruction Set:** {{instruction_set}}

### Scope Summary

- **Brief Description:** {{scope_description}}
- **Estimated Stories:** {{story_count}}
- **Estimated Epics:** {{epic_count}}
- **Timeline:** {{timeline}}

### Context

- **Greenfield/Brownfield:** {{field_type}}
- **Existing Documentation:** {{existing_docs}}
- **Team Size:** {{team_size}}
- **Deployment Intent:** {{deployment_intent}}

## Recommended Workflow Path

### Primary Outputs

{{expected_outputs}}

### Workflow Sequence

{{workflow_steps}}

### Next Actions

{{next_steps}}

## Special Considerations

{{special_notes}}

## Technical Preferences Captured

{{technical_preferences}}

## Story Naming Convention

### Level 0 (Single Atomic Change)

- **Format:** `story-<short-title>.md`
- **Example:** `story-icon-migration.md`, `story-login-fix.md`
- **Location:** `{{dev_story_location}}/`
- **Max Stories:** 1 (if more needed, consider Level 1)

### Level 1 (Coherent Feature)

- **Format:** `story-<title>-<n>.md`
- **Example:** `story-oauth-integration-1.md`, `story-oauth-integration-2.md`
- **Location:** `{{dev_story_location}}/`
- **Max Stories:** 2-3 (prefer longer stories over more stories)

### Level 2+ (Multiple Epics)

- **Format:** `story-<epic>.<story>.md`
- **Example:** `story-1.1.md`, `story-1.2.md`, `story-2.1.md`
- **Location:** `{{dev_story_location}}/`
- **Max Stories:** Per epic breakdown in epics.md

## Decision Log

### Planning Decisions Made

{{#decisions}}

- **{{decision_date}}**: {{decision_description}}
  {{/decisions}}

---

## Change History

{{#changes}}

### {{change_date}} - {{change_author}}

- Phase: {{change_phase}}
- Changes: {{change_description}}
  {{/changes}}

---

## Agent Usage Guide

### For SM (Scrum Master) Agent

**When to use this file:**

- Running create-story workflow → Read "Next Story To Work On" section
- Checking epic/story progress → Read "Implementation Progress" section
- Updating story status → Update "Current Story Status" and recalculate next story

**Key fields:**

- `next_story_file` → The exact file path to create
- `next_epic_number` + `next_story_number` → For story numbering

### For DEV (Developer) Agent

**When to use this file:**

- Running dev-story workflow → Read "Current Work In Progress" section
- After completing story → Update status to "Complete", recalculate next story
- Checking what to work on → Read "Next Story To Work On"

**Key fields:**

- `current_story_file` → The story to implement
- `current_story_status` → Update after completion

### For PM (Product Manager) Agent

**When to use this file:**

- Checking overall progress → Read "Phase Completion Status"
- Planning next phase → Read "Overall Progress" percentage
- Course correction → Read "Decision Log" for context

**Key fields:**

- `progress_percentage` → Overall project progress
- `current_phase` → What phase are we in
- `artifacts` table → What's been generated

---

_This file serves as the **single source of truth** for project workflow status, epic/story tracking, and next actions. All BMM agents and workflows reference this document for coordination._

_Template Location: `bmad/bmm/workflows/_shared/project-workflow-status-template.md`_

_File Created: {{start_date}}_
