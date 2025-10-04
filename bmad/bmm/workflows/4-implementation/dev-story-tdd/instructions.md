# TDD Dev Story - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: /home/bj/python/BMAD-METHOD/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Only modify the story file in these areas: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List, Change Log, and Status</critical>
<critical>Execute ALL steps in exact order; do NOT skip steps</critical>
<critical>If {{run_until_complete}} == true, run non-interactively: do not pause between steps unless a HALT condition is reached or explicit user approval is required for unapproved dependencies.</critical>
<critical>Absolutely DO NOT stop because of "milestones", "significant progress", or "session boundaries". Continue in a single execution until the story is COMPLETE (all ACs satisfied and all tasks/subtasks checked) or a HALT condition is triggered.</critical>
<critical>Do NOT schedule a "next session" or request review pauses unless a HALT condition applies. Only Step 7 decides completion.</critical>
<critical>TEST-FIRST MANDATE: NEVER write implementation code before tests exist and fail. This is RED-GREEN-REFACTOR, not GREEN-RED.</critical>

<workflow>

  <step n="1" goal="Load story and select next task">
    <action>If {{story_path}} was explicitly provided and is valid → use it. Otherwise, attempt auto-discovery.</action>
    <action>Auto-discovery: Read {{story_dir}} from config (dev_story_location). If invalid/missing or contains no .md files, ASK user to provide either: (a) a story file path, or (b) a directory to scan.</action>
    <action>If a directory is provided, list story markdown files recursively under that directory matching pattern: "story-*.md".</action>
    <action>Sort candidates by last modified time (newest first) and take the top {{story_selection_limit}} items.</action>
    <ask>Present the list with index, filename, and modified time. Ask: "Select a story (1-{{story_selection_limit}}) or enter a path:"</ask>
    <action>Resolve the selected item into {{story_path}}</action>
    <action>Read the COMPLETE story file from {{story_path}}</action>
    <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks (including subtasks), Dev Notes, Dev Agent Record, File List, Change Log, Status</action>
    <action>Identify the first incomplete task (unchecked [ ]) in Tasks/Subtasks; if subtasks exist, treat all subtasks as part of the selected task scope</action>
    <check>If no incomplete tasks found → "All tasks completed - proceed to completion sequence" and <goto step="7">Continue</goto></check>
    <check>If story file inaccessible → HALT: "Cannot develop story without access to story file"</check>
    <check>If task requirements ambiguous → ASK user to clarify; if unresolved, HALT: "Task requirements must be clear before implementation"</check>
  </step>

  <step n="2" goal="Generate failing acceptance tests (RED phase)">
    <action>Review Story Context JSON and extract acceptance criteria for the selected task</action>
    <action>Review test strategy from Story Context (if present): required test types, coverage thresholds, test patterns</action>
    <action>Plan test suite: determine which acceptance criteria need which test types (unit, integration, e2e)</action>
    <action>Write brief test plan in Dev Agent Record → Debug Log</action>

    <action>Invoke ATDD task to generate comprehensive failing tests:

<invoke-task path="/home/bj/python/BMAD-METHOD/bmad/bmm/workflows/testarch/atdd/instructions.md">
  <param name="story_path">{{story_path}}</param>
  <param name="task_id">{{current_task_id}}</param>
  <param name="acceptance_criteria">{{current_task_acceptance_criteria}}</param>
</invoke-task>

This will:
- Generate failing tests for all acceptance criteria
- Automatically register tests with RVTM (linking to requirements)
- Create test files following project conventions
- Provide implementation checklist
</action>

    <action>Review generated tests for completeness and clarity</action>
    <action>Ensure tests follow patterns from TEA knowledge base: one test = one concern, explicit assertions, clear failure messages</action>

    <action>Run the generated tests to verify RED state</action>
    <check>If {{verify_red_state}} == true and tests PASS without implementation → HALT: "Tests must fail initially to prove they test the right thing. Review test assertions."</check>
    <check>If tests cannot be created due to missing acceptance criteria → ASK user for clarification</check>
    <check>If ATDD task fails → Review error, attempt fix, or ask user for guidance</check>

    <action>Confirm RED state: Display "✅ RED Phase Complete: N tests created, all failing as expected"</action>
    <action>Log to Dev Agent Record: "RED: Generated N tests for task {{current_task_id}}, all tests failing (validated)"</action>
  </step>

  <step n="3" goal="Implement to pass tests (GREEN phase)">
    <action>Review the failing tests and their error messages</action>
    <action>Review the implementation checklist provided by ATDD task</action>
    <action>Plan implementation approach in Dev Agent Record → Debug Log</action>

    <action>Implement ONLY enough code to make the failing tests pass</action>
    <action>Follow the principle: simplest implementation that satisfies tests</action>
    <action>Handle error conditions and edge cases as specified in tests</action>
    <action>Follow architecture patterns and coding standards from Story Context</action>

    <action>Run tests iteratively during implementation</action>
    <action>Continue implementing until all tests for this task PASS</action>

    <check>If unapproved dependencies are needed → ASK user for approval before adding</check>
    <check>If 3 consecutive implementation failures occur → HALT and request guidance</check>
    <check>If required configuration is missing → HALT: "Cannot proceed without necessary configuration files"</check>
    <check>If tests still fail after reasonable attempts → Review test expectations vs implementation, ask user if tests need adjustment</check>

    <action>Confirm GREEN state: Display "✅ GREEN Phase Complete: All N tests now passing"</action>
    <action>Log to Dev Agent Record: "GREEN: Implemented task {{current_task_id}}, all tests passing"</action>
  </step>

  <step n="4" goal="Refactor while maintaining green (REFACTOR phase)">
    <check>If {{refactor_required}} == false → Skip this step</check>

    <action>Review implementation against code quality standards:</action>
    <action>  - DRY (Don't Repeat Yourself): Identify and eliminate duplication</action>
    <action>  - SOLID principles: Check single responsibility, proper abstractions</action>
    <action>  - Naming clarity: Ensure variables, functions, classes are well-named</action>
    <action>  - Function/method size: Break down large functions</action>
    <action>  - Complexity reduction: Simplify complex logic</action>
    <action>  - Pattern consistency: Match existing codebase patterns</action>

    <action>Identify specific refactoring opportunities and list them</action>

    <action>For each refactoring opportunity:</action>
    <action>  1. Make ONE small refactoring change</action>
    <action>  2. Run all tests immediately</action>
    <action>  3. If tests FAIL:</action>
    <action>     - Revert the change immediately</action>
    <action>     - Try a different refactoring approach</action>
    <action>     - Document what didn't work</action>
    <action>  4. If tests PASS:</action>
    <action>     - Keep the change</action>
    <action>     - Continue to next refactoring</action>

    <action>After all refactoring, validate final state:</action>
    <action>  - All tests still GREEN ✅</action>
    <action>  - Code quality metrics improved (less duplication, lower complexity)</action>
    <action>  - No new warnings or linting errors introduced</action>
    <action>  - Architecture patterns maintained</action>

    <check>If tests fail during refactoring and revert doesn't fix → HALT: "Refactoring broke tests, cannot recover. Manual review required."</check>
    <check>If code quality decreases (more duplication, higher complexity) → Revert refactoring and try different approach</check>

    <action>Confirm REFACTOR complete: Display "✅ REFACTOR Phase Complete: Code quality improved, all tests still GREEN"</action>
    <action>Log to Dev Agent Record: "REFACTOR: Improved code quality for task {{current_task_id}}, N refactorings applied, all tests green"</action>
  </step>

  <step n="5" goal="Run comprehensive validation">
    <action>Determine how to run tests for this repo (infer or use {{run_tests_command}} if provided)</action>
    <action>Run the complete test suite (not just new tests):</action>
    <action>  - Unit tests</action>
    <action>  - Integration tests (if applicable)</action>
    <action>  - End-to-end tests (if applicable)</action>

    <action>Run linting and code quality checks if configured</action>
    <action>Validate implementation meets ALL acceptance criteria for this task</action>
    <action>If ACs include quantitative thresholds (e.g., test pass rate, coverage %), ensure they are met</action>

    <action>Capture test results summary (for RVTM update):</action>
    <action>  - Total tests run</action>
    <action>  - Tests passed</action>
    <action>  - Tests failed (should be 0)</action>
    <action>  - Coverage % (if measured)</action>
    <action>  - Execution time</action>

    <check>If regression tests fail → STOP and fix before continuing. Log failure in Dev Agent Record.</check>
    <check>If new tests fail → STOP and fix before continuing. Return to GREEN phase if needed.</check>
    <check>If linting fails → Fix issues before continuing</check>
    <check>If acceptance criteria not met → Document gaps and ask user how to proceed</check>
  </step>

  <step n="6" goal="Mark task complete and update story + RVTM">
    <action>ONLY mark the task (and subtasks) checkbox with [x] if ALL tests pass and validation succeeds</action>
    <action>Update File List section with any new, modified, or deleted files (paths relative to repo root)</action>
    <action>Add completion notes to Dev Agent Record summarizing:</action>
    <action>  - RED: Tests created</action>
    <action>  - GREEN: Implementation approach</action>
    <action>  - REFACTOR: Quality improvements made</action>
    <action>  - Any follow-ups or technical debt noted</action>

    <action>Append entry to Change Log describing the change with test count and coverage</action>
    <action>Save the story file</action>

    <action>Update RVTM with test execution results:

<invoke-task path="/home/bj/python/BMAD-METHOD/bmad/core/tasks/rvtm/update-story-status.md">
  <param name="story_file">{{story_path}}</param>
  <param name="test_results">{{test_results_summary}}</param>
  <param name="matrix_file">.rvtm/matrix.yaml</param>
</invoke-task>

This will:
- Update test status to "passed" for all passing tests
- Update test execution timestamps
- Recalculate coverage metrics
- Non-blocking: warns if RVTM unavailable but continues
</action>

    <action>Display summary:</action>
    <action>  - Task completed: {{current_task_id}}</action>
    <action>  - Tests: N created, N passing</action>
    <action>  - RVTM: Updated with test results</action>
    <action>  - Files modified: list paths</action>

    <check>Determine if more incomplete tasks remain</check>
    <check>If more tasks remain → <goto step="1">Next task</goto></check>
    <check>If no tasks remain → <goto step="7">Completion</goto></check>
  </step>

  <step n="7" goal="Story completion sequence">
    <action>Verify ALL tasks and subtasks are marked [x] (re-scan the story document now)</action>
    <action>Run the full regression suite one final time (do not skip)</action>
    <action>Confirm File List includes every changed file</action>
    <action>Execute story definition-of-done checklist, if the story includes one</action>
    <action>Update the story Status to: Ready for Review</action>

    <action>Update RVTM story status to completed:

<invoke-task path="/home/bj/python/BMAD-METHOD/bmad/core/tasks/rvtm/update-story-status.md">
  <param name="story_file">{{story_path}}</param>
  <param name="status">completed</param>
  <param name="matrix_file">.rvtm/matrix.yaml</param>
</invoke-task>

This will:
- Mark story as completed with timestamp
- Update linked requirements to "implemented" status
- Recalculate all coverage metrics
- Generate final traceability report
</action>

    <action>Generate final TDD summary report:</action>
    <action>  - Story: {{story_title}}</action>
    <action>  - Tasks completed: N</action>
    <action>  - Total tests created: N</action>
    <action>  - All tests passing: ✅</action>
    <action>  - RED-GREEN-REFACTOR cycles: N</action>
    <action>  - RVTM Traceability:</action>
    <action>    * Requirements linked: N</action>
    <action>    * Tests registered: N</action>
    <action>    * Coverage: X%</action>
    <action>    * All requirements verified: ✅</action>
    <action>  - Status: Ready for Review</action>

    <check>If any task is incomplete → Return to step 1 to complete remaining work (Do NOT finish with partial progress)</check>
    <check>If regression failures exist → STOP and resolve before completing</check>
    <check>If File List is incomplete → Update it before completing</check>
    <check>If RVTM shows coverage gaps → Warn user but proceed (traceability is best-effort)</check>
  </step>

  <step n="8" goal="Validation and handoff" optional="true">
    <action>Optionally run the workflow validation task against the story using /home/bj/python/BMAD-METHOD/bmad/core/tasks/validate-workflow.md</action>
    <action>Run validation against TDD checklist: {installed_path}/checklist.md</action>
    <action>Prepare a concise summary in Dev Agent Record → Completion Notes highlighting TDD discipline maintained</action>
    <action>Communicate that the story is Ready for Review with full test coverage and RVTM traceability</action>
  </step>

</workflow>
```
