# Story {EpicNum}.{StoryNum}: {Short Title Copied from Epic File}

**Status:** Draft | In-Progress | Complete

## Goal & Context

**User Story:** {As a [role], I want [action], so that [benefit] - Copied or derived from Epic file}

**Context:** {Briefly explain how this story fits into the Epic's goal and the overall workflow. Mention the previous story's outcome if relevant. Example: "This story builds upon the project setup (Story 1.1) by defining the S3 resource needed for state persistence..."}

## Detailed Requirements

{Copy the specific requirements/description for this story directly from the corresponding `docs/epicN.md` file.}

## Acceptance Criteria (ACs)

{Copy the Acceptance Criteria for this story directly from the corresponding `docs/epicN.md` file.}

- AC1: ...
- AC2: ...
- ACN: ...

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**

  - Files to Create: {e.g., `src/services/s3-service.ts`, `test/unit/services/s3-service.test.ts`}
  - Files to Modify: {e.g., `lib/hacker-news-briefing-stack.ts`, `src/common/types.ts`}
  - _(Hint: See `docs/project-structure.md` for overall layout)_

- **Key Technologies:**

  - {e.g., TypeScript, Node.js 22.x, AWS CDK (`aws-s3` construct), AWS SDK v3 (`@aws-sdk/client-s3`), Jest}
  - {If a UI story, mention specific frontend libraries/framework features (e.g., React Hooks, Vuex store, CSS Modules)}
  - _(Hint: See `docs/tech-stack.md` for full list)_

- **API Interactions / SDK Usage:**

  - {e.g., "Use `@aws-sdk/client-s3`: `S3Client`, `GetObjectCommand`, `PutObjectCommand`.", "Handle `NoSuchKey` error specifically for `GetObjectCommand`."}
  - _(Hint: See `docs/api-reference.md` for details on external APIs and SDKs)_

- **UI/UX Notes:** ONLY IF THIS IS A UI Focused Epic or Story

- **Data Structures:**

  - {e.g., "Define/Use `AppState` interface in `src/common/types.ts`: `{ processedStoryIds: string[] }`.", "Handle JSON parsing/stringifying for state."}
  - _(Hint: See `docs/data-models.md` for key project data structures)_

- **Environment Variables:**

  - {e.g., `S3_BUCKET_NAME` (Read via `config.ts` or passed to CDK)}
  - _(Hint: See `docs/environment-vars.md` for all variables)_

- **Coding Standards Notes:**
  - {e.g., "Use `async/await` for all S3 calls.", "Implement error logging using `console.error`.", "Follow `kebab-case` for filenames, `PascalCase` for interfaces."}
  - _(Hint: See `docs/coding-standards.md` for full standards)_

## Tasks / Subtasks

{Copy the initial task breakdown from the corresponding `docs/epicN.md` file and expand or clarify as needed to ensure the agent can complete all AC. The agent can check these off as it proceeds.}

- [ ] Task 1
- [ ] Task 2
  - [ ] Subtask 2.1
- [ ] Task 3

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** {e.g., "Write unit tests for `src/services/s3-service.ts`. Mock `S3Client` and its commands (`GetObjectCommand`, `PutObjectCommand`). Test successful read/write, JSON parsing/stringifying, and `NoSuchKey` error handling."}
- **Integration Tests:** {e.g., "No specific integration tests required for _just_ this story's module, but it will be covered later in `test/integration/fetch-flow.test.ts`."}
- **Manual/CLI Verification:** {e.g., "Not applicable directly, but functionality tested via `npm run fetch-stories` later."}
- _(Hint: See `docs/testing-strategy.md` for the overall approach)_

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Any notes about implementation choices, difficulties, or follow-up needed}
- **Change Log:** {Track changes _within this specific story file_ if iterations occur}
  - Initial Draft
  - ...
