# Project Workflow Analysis

**Date:** {{date}}
**Project:** {{project_name}}
**Analyst:** {{user_name}}
**Last Updated:** {{date}}

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

_This analysis serves as the **single source of truth** for project workflow decisions, progress tracking, and next actions. All BMM workflow phases reference this document for coordination._

_Template Location: `bmad/bmm/workflows/_shared/project-workflow-analysis-template.md`_
