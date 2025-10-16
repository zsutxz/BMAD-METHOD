# Workflow Cleanup Progress Tracker

**Started:** 2025-10-15
**Goal:** Standardize all BMM/BMB/CIS workflows with proper config variables, yaml/instruction alignment, and web_bundle validation

---

## Scope

- **Total Workflows:** 42
  - BMM: 30 workflows
  - BMB: 8 workflows
  - CIS: 4 workflows
- **Excluded:** testarch/\* workflows

---

## Phase 1: Fix BMB Documentation (Foundation)

### Files to Update:

- [ ] `/src/modules/bmb/workflows/create-workflow/instructions.md`
- [ ] `/src/modules/bmb/workflows/edit-workflow/instructions.md`
- [ ] `/src/modules/bmb/workflows/convert-legacy/instructions.md`

### Standards Being Enforced:

1. Standard config block in all workflows
2. Instructions must use config variables
3. Templates must use config variables
4. Yaml variables must be used (instructions OR templates)
5. Web_bundle must include all dependencies

### Progress:

- Status: ✅ COMPLETE
- Files Updated: 3/3

### Completed:

- ✅ **create-workflow/instructions.md** - Added:
  - Standard config block enforcement in Step 4
  - Config variable usage guidance in Step 5 (instructions)
  - Standard metadata in templates in Step 6
  - YAML/instruction/template alignment validation in Step 9
  - Enhanced web_bundle dependency scanning in Step 9b (workflow calls)

- ✅ **edit-workflow/instructions.md** - Added:
  - Standard config audit in Step 2 (analyze best practices)
  - New menu option 2: "Add/fix standard config"
  - New menu option 9: "Remove bloat"
  - Standard config handler in Step 4 with template
  - Bloat removal handler in Step 4 (cross-reference check)
  - Enhanced web bundle scanning (workflow dependencies)
  - Complete standard config validation checklist in Step 6
  - YAML/file alignment validation in Step 6

- ✅ **convert-legacy/instructions.md** - Added:
  - Standard config block documentation in Step 5c (Template conversion)
  - Standard config block documentation in Step 5e (Task conversion)
  - Post-conversion verification steps for config variables
  - Standard config validation checklist in Step 6
  - Instructions update reminder (use config variables)

---

## Phase 2: Global Config Variable Sweep

### Standard Config Block:

```yaml
# Critical variables from config
config_source: '{project-root}/bmad/[module]/config.yaml'
output_folder: '{config_source}:output_folder'
user_name: '{config_source}:user_name'
communication_language: '{config_source}:communication_language'
date: system-generated
```

### Rules:

- Add to existing config section (don't duplicate)
- Only add missing variables
- Skip testarch/\* workflows

### Progress:

- Status: ✅ COMPLETE
- Workflows Updated: 34/34 (excluded 8 testarch workflows)
- Added `communication_language` to all workflows missing it
- Standardized comment: "Critical variables from config"

---

## Phase 3: Workflow-by-Workflow Deep Clean

### Per-Workflow Checklist:

1. Read workflow.yaml + instructions.md + template.md (if exists)
2. Variable audit (yaml ↔ instructions ↔ templates)
3. Standard config usage validation
4. Bloat removal (unused fields, duplicates)
5. Web_bundle validation (all dependencies included)

### Progress:

- Status: Pending
- Workflows Completed: 0/42

### Completed Workflows:

_None yet_

---

## Issues/Notes Log

### 2025-10-16: Created audit-workflow

- **Location:** `/bmad/bmb/workflows/audit-workflow/`
- **Purpose:** Codifies all Phase 1 and Phase 2 standards into a reusable validation tool
- **Files Created:**
  - `workflow.yaml` - Configuration with standard config block
  - `instructions.md` - 8-step audit process
  - `checklist.md` - 70-point validation checklist
- **Validation:** audit-workflow passes 100% of its own validation criteria
- **Next Use:** Will be used to perform Phase 3 systematic audits

**Audit-Workflow Capabilities:**

1. Standard config block validation
2. YAML/instruction/template alignment analysis
3. Config variable usage audit
4. Web bundle completeness validation
5. Bloat detection (unused yaml fields)
6. Template variable mapping verification
7. Comprehensive audit report generation
8. Integration with edit-workflow for fixes

---

## Summary Statistics

**Phase 1:** ✅ 3/3 files updated (100%)
**Phase 2:** ✅ 34/34 workflows updated (100%)
**Phase 3:** ⏳ 0/34 workflows cleaned (0%)

**Overall Progress:** 67% complete (2/3 phases done)
