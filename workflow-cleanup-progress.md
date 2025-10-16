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

- Status: ⚙️ IN PROGRESS
- Workflows Completed: 14/35 (40%)

### Completed Workflows:

**CIS Module (4/4 - 100% complete):**

1. ✅ storytelling - Fixed: removed use_advanced_elicitation bloat, removed duplicate story_frameworks, fixed web_bundle filename (story-frameworks.csv → story-types.csv), added missing {{resolution}} template-output, added {communication_language} and {user_name} usage
2. ✅ problem-solving - Fixed: removed use_advanced_elicitation bloat, removed duplicate solving_methods
3. ✅ design-thinking - Fixed: removed use_advanced_elicitation bloat, removed duplicate design_methods
4. ✅ innovation-strategy - Fixed: removed use_advanced_elicitation bloat, removed duplicate innovation_frameworks

**BMM Module (2/30 fully audited, 8/30 surface cleaned):** 5. ✅ **brainstorm-game** - FULL AUDIT: removed use_advanced_elicitation bloat, restored existing_workflows (critical), added {communication_language} and {user_name} 6. ✅ **brainstorm-project** - FULL AUDIT: removed use_advanced_elicitation bloat, restored existing_workflows (critical), added {communication_language} and {user_name} 7. ⚠️ game-brief - Surface clean only: removed use_advanced_elicitation bloat (needs full audit) 8. ⚠️ product-brief - Surface clean only: removed use_advanced_elicitation bloat (needs full audit) 9. ⚠️ research - Surface clean only: removed use_advanced_elicitation bloat (needs full audit) 10. ⚠️ gdd - Surface clean only: removed use_advanced_elicitation bloat (needs full audit) 11. ⚠️ narrative - Surface clean only: removed use_advanced_elicitation bloat (needs full audit) 12. ⚠️ prd - Surface clean only: removed use_advanced_elicitation bloat (needs full audit) 13. ⚠️ tech-spec (2-plan) - Surface clean only: removed use_advanced_elicitation bloat (needs full audit) 14. ⚠️ ux - Surface clean only: removed use_advanced_elicitation bloat (needs full audit)

**Common Issues Found:**

- `use_advanced_elicitation: true` bloat in web_bundle (not used in instructions) - Fixed in 14 workflows (4 CIS + 10 BMM)
- Duplicate data file variables between top-level and web_bundle - Fixed in 4 CIS workflows
- Missing template-output tags for template variables - Fixed in storytelling (1)
- Underutilization of {communication_language} and {user_name} config variables - Enhanced in storytelling (1)

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

### 2025-10-16: Added Instruction Style Philosophy to create-workflow

- **Enhancement:** Added comprehensive guidance on intent-based vs prescriptive instruction patterns
- **Location:** `/src/modules/bmb/workflows/create-workflow/instructions.md` Step 5
- **Changes:**
  - Added instruction style choice in Step 3 (intent-based vs prescriptive)
  - Added 100+ line section in Step 5 with examples and best practices
  - Documented when to use each style and how to mix both effectively
  - Provided clear "good" and "bad" examples for each pattern
  - Emphasized goal-oriented collaboration over rigid prescriptive wording

**Key Philosophy Shift:**

- **Intent-Based (Recommended):** Guide LLM with goals and principles, let it adapt conversations naturally
  - Better for complex discovery, creative work, iterative refinement
  - Example: `<action>Guide user to define their target audience with specific demographics and needs</action>`

- **Prescriptive (Selective Use):** Provide exact wording for questions and options
  - Better for simple data collection, compliance, binary choices
  - Example: `<ask>What is your target platform? Choose: PC, Console, Mobile, Web</ask>`

**Impact:** Future workflows will be more conversational and adaptive, improving human-AI collaboration quality

### 2025-10-16: Transformed game-brief to Intent-Based Style

- **Transformation:** Converted game-brief from prescriptive to intent-based instructions
- **Location:** `/src/modules/bmm/workflows/1-analysis/game-brief/instructions.md`
- **Results:**
  - **Before:** 617 lines (heavily prescriptive with hardcoded question templates)
  - **After:** 370 lines (intent-based with goal-oriented guidance)
  - **Reduction:** 247 lines removed (40% reduction)

**Changes Made:**

- Step 1: Converted hardcoded "What is the working title?" to intent-based "Ask for the working title"
- Step 1b: Transformed 7 prescriptive bullet points to 5 action-based guidance lines
- Steps 3-12 (Interactive Mode): Replaced massive <ask> blocks with compact <action> guidance
  - Step 4 (Target Market): 31 lines → 8 lines
  - Step 5 (Game Fundamentals): 33 lines → 10 lines
  - Step 6 (Scope/Constraints): 47 lines → 11 lines
  - Step 7 (Reference Framework): 33 lines → 8 lines
  - Step 8 (Content Framework): 32 lines → 9 lines
  - Step 9 (Art/Audio): 32 lines → 8 lines
  - Step 10 (Risks): 38 lines → 9 lines
  - Step 11 (Success): 37 lines → 9 lines
  - Step 12 (Next Steps): 35 lines → 9 lines

**Pattern Applied:**

- **Old (Prescriptive):** `<ask>Who will play your game? **Primary Audience:** - Age range - Gaming experience level...</ask>`
- **New (Intent-Based):** `<action>Guide user to define their primary target audience with specific demographics, gaming preferences, and behavioral characteristics</action>`

**Benefits:**

- More conversational and adaptive LLM behavior
- Cleaner, more maintainable instructions
- Better human-AI collaboration
- LLM can adapt questions to user context naturally
- Demonstrates the philosophy shift documented in create-workflow

**This serves as the reference implementation for converting prescriptive workflows to intent-based style.**

### 2025-10-16: Completed ALL 1-analysis Workflows (7/7 - 100%)

**✅ Phase 1-Analysis Module Complete!**

All 7 workflows in the 1-analysis folder have been audited, cleaned, and optimized:

1. ✅ **brainstorm-game** - FULL AUDIT (earlier session)
   - Removed use_advanced_elicitation bloat
   - Restored critical existing_workflows
   - Added {communication_language} and {user_name}

2. ✅ **brainstorm-project** - FULL AUDIT (earlier session)
   - Removed use_advanced_elicitation bloat
   - Restored critical existing_workflows
   - Added {communication_language} and {user_name}

3. ✅ **game-brief** - INTENT-BASED TRANSFORMATION
   - **Before:** 617 lines → **After:** 370 lines (40% reduction)
   - Removed brief_format bloat
   - Transformed all prescriptive steps to intent-based
   - Added executive summary option
   - Added {communication_language} and {user_name}

4. ✅ **product-brief** - INTENT-BASED TRANSFORMATION
   - **Before:** 444 lines → **After:** 332 lines (25% reduction)
   - Removed brief_format bloat
   - Transformed steps 3-12 to intent-based guidance
   - Added executive summary option
   - Added {communication_language} and {user_name}

5. ✅ **research** - ROUTER CLEANUP
   - **YAML Before:** 245 lines → **After:** 46 lines (81% reduction!)
   - Removed massive bloat: research_types, frameworks, data_sources, claude_code_enhancements (duplicated in web_bundle)
   - Added {communication_language} to router
   - Router appropriately deterministic for type selection

6. ✅ **document-project** - ROUTER CLEANUP
   - **YAML:** Removed runtime_variables, scan_levels, resumability bloat (documentation, not config)
   - Added {communication_language}
   - Added {user_name} personalization
   - Router appropriately deterministic for mode selection

7. ✅ **workflow-status** - DETERMINISTIC VALIDATION
   - **YAML:** Removed unused variables bloat (status_file_pattern, check_existing_status, display_menu, suggest_next_action)
   - Added missing critical headers
   - Added {user_name} personalization
   - Appropriately deterministic/structured (this is a menu/orchestration workflow)

**Instruction Style Decisions Applied:**

- **Intent-Based:** game-brief, product-brief (conversational, adaptive)
- **Deterministic/Prescriptive:** workflow-status (menu/orchestration)
- **Router Pattern:** document-project, research (appropriate for delegation workflows)

**Total Lines Saved:**

- game-brief: 247 lines
- product-brief: 112 lines
- research YAML: 199 lines
- document-project YAML: ~100 lines
- workflow-status YAML: ~10 lines
- **Total:** ~668 lines removed across 1-analysis workflows

---

## Summary Statistics

**Phase 1:** ✅ 3/3 files updated (100%)
**Phase 2:** ✅ 34/34 workflows updated (100%)
**Phase 3:** ⏳ 0/34 workflows cleaned (0%)

**Overall Progress:** 67% complete (2/3 phases done)
