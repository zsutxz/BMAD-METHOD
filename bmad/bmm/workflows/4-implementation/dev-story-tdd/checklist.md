# TDD Workflow Validation Checklist

## Story Initialization

- [ ] Story file loaded and Status == 'Approved'
- [ ] Story Context JSON loaded and parsed
- [ ] Story Context contains acceptance criteria
- [ ] Story Context contains test strategy (if applicable)
- [ ] All tasks and subtasks identified
- [ ] RVTM matrix available (or gracefully degraded if not)

## Phase 1: RED - Failing Tests

### Test Generation

- [ ] ATDD task invoked successfully for current task
- [ ] Test files generated for all acceptance criteria
- [ ] Tests follow TEA knowledge patterns (one test = one concern)
- [ ] Tests have explicit assertions
- [ ] Test failure messages are clear and actionable
- [ ] Tests match required types from test strategy (unit/integration/e2e)

### RVTM Integration (RED Phase)

- [ ] Tests automatically registered in RVTM
- [ ] Tests linked to story requirements
- [ ] Test status set to 'pending' initially
- [ ] Test file paths recorded correctly
- [ ] Requirement inheritance from story working

### RED State Verification

- [ ] Tests executed after generation
- [ ] All tests FAILED (RED state verified)
- [ ] Failure messages indicate what needs to be implemented
- [ ] No tests passing before implementation (proves tests are valid)
- [ ] RED phase logged in Dev Agent Record

## Phase 2: GREEN - Implementation

### Implementation Quality

- [ ] Code implemented to pass failing tests
- [ ] Implementation follows Story Context architecture patterns
- [ ] Implementation uses existing interfaces from Story Context
- [ ] Coding standards from repository maintained
- [ ] Error handling implemented as specified in tests
- [ ] Edge cases covered per test requirements

### Test Execution (GREEN Phase)

- [ ] Tests run iteratively during implementation
- [ ] All new tests PASS (GREEN state achieved)
- [ ] No tests skipped or disabled
- [ ] Test execution time reasonable
- [ ] GREEN phase logged in Dev Agent Record

### Acceptance Criteria Validation

- [ ] Implementation satisfies all task acceptance criteria
- [ ] Quantitative thresholds met (if specified in ACs)
- [ ] No acceptance criteria left unaddressed
- [ ] Acceptance criteria validation documented

## Phase 3: REFACTOR - Code Quality Improvement

### Refactoring Discipline

- [ ] Code quality issues identified before refactoring
- [ ] Refactoring applied incrementally (one change at a time)
- [ ] Tests run after EACH refactoring change
- [ ] All tests remained GREEN throughout refactoring
- [ ] Failed refactoring attempts reverted immediately

### Code Quality Metrics

- [ ] DRY principle applied (duplication reduced)
- [ ] SOLID principles followed
- [ ] Naming clarity improved
- [ ] Function/method size appropriate
- [ ] Complexity reduced where possible
- [ ] Architecture patterns consistent with codebase

### Refactoring Outcome

- [ ] Code quality improved measurably
- [ ] No new duplication introduced
- [ ] No increased complexity
- [ ] All tests still GREEN after all refactoring
- [ ] REFACTOR phase logged in Dev Agent Record

## Phase 4: Comprehensive Validation

### Test Suite Execution

- [ ] Full test suite executed (not just new tests)
- [ ] Unit tests: all passing
- [ ] Integration tests: all passing (if applicable)
- [ ] E2E tests: all passing (if applicable)
- [ ] No regression failures introduced
- [ ] Test coverage meets threshold (if specified)

### Code Quality Checks

- [ ] Linting passes with no errors
- [ ] Code quality tools pass (if configured)
- [ ] No new warnings introduced
- [ ] Security checks pass (if configured)
- [ ] Performance acceptable (if thresholds specified)

### Validation Results

- [ ] Test results captured for RVTM update
- [ ] Total tests count recorded
- [ ] Pass/fail counts correct
- [ ] Coverage percentage calculated (if applicable)
- [ ] Execution time recorded

## Phase 5: Task Completion & RVTM Update

### Story File Updates

- [ ] Task checkbox marked [x] (only if all tests pass)
- [ ] Subtasks checkboxes marked [x] (if applicable)
- [ ] File List updated with all changed files
- [ ] File paths relative to repo root
- [ ] Change Log entry added
- [ ] Change Log describes what was implemented and test coverage

### Dev Agent Record Updates

- [ ] Debug Log contains RED-GREEN-REFACTOR summary
- [ ] Completion Notes summarize implementation approach
- [ ] Test count and coverage documented
- [ ] Follow-up items noted (if any)
- [ ] Technical debt documented (if any)

### RVTM Traceability Updates

- [ ] update-story-status.md task invoked
- [ ] Test status updated to 'passed' in RVTM
- [ ] Test execution timestamps recorded
- [ ] Coverage metrics recalculated
- [ ] RVTM update completed (or warning logged if unavailable)
- [ ] Traceability maintained: requirement → story → test → implementation

## Phase 6: Story Completion

### All Tasks Verification

- [ ] All tasks marked [x] (complete scan performed)
- [ ] All subtasks marked [x]
- [ ] No incomplete tasks remain
- [ ] Final regression suite executed
- [ ] All regression tests passing

### Story Metadata Complete

- [ ] File List includes ALL changed files
- [ ] Change Log complete for entire story
- [ ] Dev Agent Record has completion summary
- [ ] Story Status updated to 'Ready for Review'
- [ ] Story file saved

### RVTM Story Completion

- [ ] Story marked as 'completed' in RVTM
- [ ] Linked requirements updated to 'implemented' status
- [ ] All coverage metrics final and accurate
- [ ] Traceability report available
- [ ] Audit trail complete in RVTM history

### Final TDD Summary

- [ ] Total tasks completed: count correct
- [ ] Total tests created: count correct
- [ ] All tests passing: verified
- [ ] RED-GREEN-REFACTOR cycles: counted
- [ ] RVTM traceability complete:
  - [ ] Requirements linked count
  - [ ] Tests registered count
  - [ ] Coverage percentage
  - [ ] All requirements verified

## TDD Discipline Validation

### Test-First Adherence

- [ ] NO code written before tests existed
- [ ] NO implementation started in RED phase
- [ ] All tests failed initially (RED validated)
- [ ] Tests drove implementation (GREEN)
- [ ] Refactoring kept tests green (REFACTOR)
- [ ] Test-first discipline maintained throughout

### ATDD Integration

- [ ] ATDD task used for all test generation
- [ ] Acceptance criteria drove test creation
- [ ] Tests map one-to-one with acceptance criteria
- [ ] TEA knowledge patterns applied
- [ ] Test quality high (clear, explicit, isolated)

### Traceability Discipline

- [ ] RVTM updated automatically at each phase
- [ ] No manual traceability steps required
- [ ] Requirements → Tests → Implementation linkage complete
- [ ] Bidirectional traceability verified
- [ ] Stakeholder visibility maintained throughout

## Definition of Done

### Story Level

- [ ] All acceptance criteria satisfied
- [ ] All tasks complete
- [ ] All tests passing
- [ ] Code quality high
- [ ] Documentation complete
- [ ] RVTM traceability complete
- [ ] Ready for review

### Test Coverage

- [ ] All requirements have tests
- [ ] All tests passing
- [ ] Coverage threshold met (if specified)
- [ ] No orphaned tests (all linked to requirements)
- [ ] No coverage gaps (all requirements covered)

### Quality Gates

- [ ] No regressions introduced
- [ ] Linting clean
- [ ] Code quality metrics acceptable
- [ ] Security checks pass
- [ ] Performance acceptable
- [ ] Architecture patterns maintained

## TDD Benefits Realized

### Verification

- [ ] Tests prove code works before deployment
- [ ] Acceptance criteria verified by passing tests
- [ ] Refactoring safety net in place
- [ ] Regression protection established

### Documentation

- [ ] Tests document expected behavior
- [ ] Test names describe functionality
- [ ] Failure messages guide debugging
- [ ] Requirements traced through tests

### Quality

- [ ] Test-first led to better design
- [ ] Code is testable and modular
- [ ] Edge cases identified and handled
- [ ] Error handling comprehensive

### Traceability

- [ ] Stakeholders can see requirement status
- [ ] Test verification visible in real-time
- [ ] Implementation completeness measurable
- [ ] Audit trail complete for compliance

---

**Validation Result:** [Pass/Fail]

**Validator:** ****\*\*****\_\_****\*\*****

**Date:** ****\*\*****\_\_****\*\*****

**Notes:**
