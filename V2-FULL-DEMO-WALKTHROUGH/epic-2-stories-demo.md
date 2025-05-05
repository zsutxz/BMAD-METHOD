Okay, continuing in **SM Mode**.

Generating the stories for **Epic 2: HN Data Acquisition & Persistence**. This assumes that the foundational work from Epic 1 (project initialization, configuration setup via `src/utils/config.ts`, logger via `src/utils/logger.ts`, and output directory creation logic in `src/index.ts`) is complete and available for use.

---

## **Stories Report: Epic 2**

**File: ai/stories/2.1.story.md**

```markdown
# Story 2.1: Implement Algolia HN API Client

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want a dedicated client module to interact with the Algolia Hacker News Search API, so that fetching stories and comments is encapsulated, reusable, and uses the required native `Workspace` API. [155]

**Context:** This story creates the primary interface for retrieving data from the external Hacker News API provided by Algolia. It encapsulates the specific API calls (`GET /search` for stories and comments) and data extraction logic into a reusable module (`src/clients/algoliaHNClient.ts`). This client will be used by the main pipeline (Story 2.2) and the stage testing utility (Story 2.4). It builds upon the logger created in Epic 1 (Story 1.4). [54, 60, 62, 77]

## Detailed Requirements

- Create a new module: `src/clients/algoliaHNClient.ts`. [156]
- Implement an async function `WorkspaceTopStories` within the client: [157]
  - Use native `Workspace` [749] to call the Algolia HN Search API endpoint for front-page stories (`http://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10`). [4, 6, 7, 157] Adjust `hitsPerPage` if needed to ensure 10 stories.
  - Parse the JSON response. [158]
  - Extract required metadata for each story: `objectID` (use as `storyId`), `title`, `url` (use as `articleUrl`), `points`, `num_comments`. [159, 522] Handle potential missing `url` field gracefully (log warning using logger from Story 1.4, treat as null). [160]
  - Construct the `hnUrl` for each story (e.g., `https://news.ycombinator.com/item?id={storyId}`). [161]
  - Return an array of structured story objects (define a `Story` type, potentially in `src/types/hn.ts`). [162, 506-511]
- Implement a separate async function `WorkspaceCommentsForStory` within the client: [163]
  - Accept `storyId` (string) and `maxComments` limit (number) as arguments. [163]
  - Use native `Workspace` to call the Algolia HN Search API endpoint for comments of a specific story (`http://hn.algolia.com/api/v1/search?tags=comment,story_{storyId}&hitsPerPage={maxComments}`). [12, 13, 14, 164]
  - Parse the JSON response. [165]
  - Extract required comment data: `objectID` (use as `commentId`), `comment_text`, `author`, `created_at`. [165, 524]
  - Filter out comments where `comment_text` is null or empty. Ensure only up to `maxComments` are returned. [166]
  - Return an array of structured comment objects (define a `Comment` type, potentially in `src/types/hn.ts`). [167, 500-505]
- Implement basic error handling using `try...catch` around `Workspace` calls and check `response.ok` status. [168] Log errors using the logger utility from Epic 1 (Story 1.4). [169]
- Define TypeScript interfaces/types for the expected structures of API responses (subset needed) and the data returned by the client functions (`Story`, `Comment`). Place these in `src/types/hn.ts`. [169, 821]

## Acceptance Criteria (ACs)

- AC1: The module `src/clients/algoliaHNClient.ts` exists and exports `WorkspaceTopStories` and `WorkspaceCommentsForStory` functions. [170]
- AC2: Calling `WorkspaceTopStories` makes a network request to the correct Algolia endpoint (`search?tags=front_page&hitsPerPage=10`) and returns a promise resolving to an array of 10 `Story` objects containing the specified metadata (`storyId`, `title`, `articleUrl`, `hnUrl`, `points`, `num_comments`). [171]
- AC3: Calling `WorkspaceCommentsForStory` with a valid `storyId` and `maxComments` limit makes a network request to the correct Algolia endpoint (`search?tags=comment,story_{storyId}&hitsPerPage={maxComments}`) and returns a promise resolving to an array of `Comment` objects (up to `maxComments`), filtering out empty ones. [172]
- AC4: Both functions use the native `Workspace` API internally. [173]
- AC5: Network errors or non-successful API responses (e.g., status 4xx, 5xx) are caught and logged using the logger from Story 1.4. [174] Functions should likely return an empty array or throw a specific error in failure cases for the caller to handle.
- AC6: Relevant TypeScript types (`Story`, `Comment`) are defined in `src/types/hn.ts` and used within the client module. [175]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Create: `src/clients/algoliaHNClient.ts`, `src/types/hn.ts`.
  - Files to Modify: Potentially `src/types/index.ts` if using a barrel file.
  - _(Hint: See `docs/project-structure.md` [817, 821] for location)._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851], Native `Workspace` API [863].
  - Uses `logger` utility from Epic 1 (Story 1.4).
  - _(Hint: See `docs/tech-stack.md` [839-905] for full list)._
- **API Interactions / SDK Usage:**
  - Algolia HN Search API `GET /search` endpoint. [2]
  - Base URL: `http://hn.algolia.com/api/v1` [3]
  - Parameters: `tags=front_page`, `hitsPerPage=10` (for stories) [6, 7]; `tags=comment,story_{storyId}`, `hitsPerPage={maxComments}` (for comments) [13, 14].
  - Check `response.ok` and parse JSON response (`response.json()`). [168, 158, 165]
  - Handle potential network errors with `try...catch`. [168]
  - No authentication required. [3]
  - _(Hint: See `docs/api-reference.md` [2-21] for details)._
- **Data Structures:**
  - Define `Comment` interface: `{ commentId: string, commentText: string | null, author: string | null, createdAt: string }`. [501-505]
  - Define `Story` interface (initial fields): `{ storyId: string, title: string, articleUrl: string | null, hnUrl: string, points?: number, numComments?: number }`. [507-511]
  - (These types will be augmented in later stories [512-517]).
  - Reference Algolia response subset schemas in `docs/data-models.md` [521-525].
  - _(Hint: See `docs/data-models.md` for full details)._
- **Environment Variables:**
  - No direct environment variables needed for this client itself (uses hardcoded base URL, fetches comment limit via argument).
  - _(Hint: See `docs/environment-vars.md` [548-638] for all variables)._
- **Coding Standards Notes:**
  - Use `async/await` for `Workspace` calls.
  - Use logger for errors and significant events (e.g., warning if `url` is missing). [160]
  - Export types and functions clearly.

## Tasks / Subtasks

- [ ] Create `src/types/hn.ts` and define `Comment` and initial `Story` interfaces.
- [ ] Create `src/clients/algoliaHNClient.ts`.
- [ ] Import necessary types and the logger utility.
- [ ] Implement `WorkspaceTopStories` function:
  - [ ] Construct Algolia URL for top stories.
  - [ ] Use `Workspace` with `try...catch`.
  - [ ] Check `response.ok`, log errors if not OK.
  - [ ] Parse JSON response.
  - [ ] Map `hits` to `Story` objects, extracting required fields, handling null `url`, constructing `hnUrl`.
  - [ ] Return array of `Story` objects (or handle error case).
- [ ] Implement `WorkspaceCommentsForStory` function:
  - [ ] Accept `storyId` and `maxComments` arguments.
  - [ ] Construct Algolia URL for comments using arguments.
  - [ ] Use `Workspace` with `try...catch`.
  - [ ] Check `response.ok`, log errors if not OK.
  - [ ] Parse JSON response.
  - [ ] Map `hits` to `Comment` objects, extracting required fields.
  - [ ] Filter out comments with null/empty `comment_text`.
  - [ ] Limit results to `maxComments`.
  - [ ] Return array of `Comment` objects (or handle error case).
- [ ] Export functions and types as needed.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - Write unit tests for `src/clients/algoliaHNClient.ts`. [919]
  - Mock the native `Workspace` function (e.g., using `jest.spyOn(global, 'fetch')`). [918]
  - Test `WorkspaceTopStories`: Provide mock successful responses (valid JSON matching Algolia structure [521-523]) and verify correct parsing, mapping to `Story` objects [171], and `hnUrl` construction. Test with missing `url` field. Test mock error responses (network error, non-OK status) and verify error logging [174] and return value.
  - Test `WorkspaceCommentsForStory`: Provide mock successful responses [524-525] and verify correct parsing, mapping to `Comment` objects, filtering of empty comments, and limiting by `maxComments` [172]. Test mock error responses and verify logging [174].
  - Verify `Workspace` was called with the correct URLs and parameters [171, 172].
- **Integration Tests:** N/A for this client module itself, but it will be used in pipeline integration tests later. [921]
- **Manual/CLI Verification:** Tested indirectly via Story 2.2 execution and directly via Story 2.4 stage runner. [912]
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Any notes about implementation choices, difficulties, or follow-up needed}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/2.2.story.md**

```markdown
# Story 2.2: Integrate HN Data Fetching into Main Workflow

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want to integrate the HN data fetching logic into the main application workflow (`src/index.ts`), so that running the app retrieves the top 10 stories and their comments after completing the setup from Epic 1. [176]

**Context:** This story connects the HN API client created in Story 2.1 to the main application entry point (`src/index.ts`) established in Epic 1 (Story 1.3). It modifies the main execution flow to call the client functions (`WorkspaceTopStories`, `WorkspaceCommentsForStory`) after the initial setup (logger, config, output directory). It uses the `MAX_COMMENTS_PER_STORY` configuration value loaded in Story 1.2. The fetched data (stories and their associated comments) is held in memory at the end of this stage. [46, 77]

## Detailed Requirements

- Modify the main execution flow in `src/index.ts` (or a main async function called by it, potentially moving logic to `src/core/pipeline.ts` as suggested by `ARCH` [46, 53] and `PS` [818]). **Recommendation:** Create `src/core/pipeline.ts` and a `runPipeline` async function, then call this function from `src/index.ts`.
- Import the `algoliaHNClient` functions (`WorkspaceTopStories`, `WorkspaceCommentsForStory`) from Story 2.1. [177]
- Import the configuration module (`src/utils/config.ts`) to access `MAX_COMMENTS_PER_STORY`. [177, 563] Also import the logger.
- In the main pipeline function, after the Epic 1 setup (config load, logger init, output dir creation):
  - Call `await fetchTopStories()`. [178]
  - Log the number of stories fetched (e.g., "Fetched X stories."). [179] Use the logger from Story 1.4.
  - Retrieve the `MAX_COMMENTS_PER_STORY` value from the config module. Ensure it's parsed as a number. Provide a default if necessary (e.g., 50, matching `ENV` [564]).
  - Iterate through the array of fetched `Story` objects. [179]
  - For each `Story`:
    - Log progress (e.g., "Fetching up to Y comments for story {storyId}..."). [182]
    - Call `await fetchCommentsForStory()`, passing the `story.storyId` and the configured `MAX_COMMENTS_PER_STORY` value. [180]
    - Store the fetched comments (the returned `Comment[]`) within the corresponding `Story` object in memory (e.g., add a `comments: Comment[]` property to the `Story` type/object). [181] Augment the `Story` type definition in `src/types/hn.ts`. [512]
- Ensure errors from the client functions are handled appropriately (e.g., log error and potentially skip comment fetching for that story).

## Acceptance Criteria (ACs)

- AC1: Running `npm run dev` executes Epic 1 setup steps followed by fetching stories and then comments for each story using the `algoliaHNClient`. [183]
- AC2: Logs (via logger) clearly show the start and successful completion of fetching stories, and the start of fetching comments for each of the 10 stories. [184]
- AC3: The configured `MAX_COMMENTS_PER_STORY` value is read from config, parsed as a number, and used in the calls to `WorkspaceCommentsForStory`. [185]
- AC4: After successful execution (before persistence in Story 2.3), `Story` objects held in memory contain a `comments` property populated with an array of fetched `Comment` objects. [186] (Verification via debugger or temporary logging).
- AC5: The `Story` type definition in `src/types/hn.ts` is updated to include the `comments: Comment[]` field. [512]
- AC6: (If implemented) Core logic is moved to `src/core/pipeline.ts` and called from `src/index.ts`. [818]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Create: `src/core/pipeline.ts` (recommended).
  - Files to Modify: `src/index.ts`, `src/types/hn.ts`.
  - _(Hint: See `docs/project-structure.md` [818, 821, 822])._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851].
  - Uses `algoliaHNClient` (Story 2.1), `config` (Story 1.2), `logger` (Story 1.4).
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - Calls internal `algoliaHNClient.fetchTopStories()` and `algoliaHNClient.fetchCommentsForStory()`.
- **Data Structures:**
  - Augment `Story` interface in `src/types/hn.ts` to include `comments: Comment[]`. [512]
  - Manipulates arrays of `Story` and `Comment` objects in memory.
  - _(Hint: See `docs/data-models.md` [500-517])._
- **Environment Variables:**
  - Reads `MAX_COMMENTS_PER_STORY` via `config.ts`. [177, 563]
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Use `async/await` for calling client functions.
  - Structure fetching logic cleanly (e.g., within a loop).
  - Use the logger for progress and error reporting. [182, 184]
  - Consider putting the main loop logic inside the `runPipeline` function in `src/core/pipeline.ts`.

## Tasks / Subtasks

- [ ] (Recommended) Create `src/core/pipeline.ts` and define an async `runPipeline` function.
- [ ] Modify `src/index.ts` to import and call `runPipeline`. Move existing setup logic (logger init, config load, dir creation) into `runPipeline` or ensure it runs before it.
- [ ] In `pipeline.ts` (or `index.ts`), import `WorkspaceTopStories`, `WorkspaceCommentsForStory` from `algoliaHNClient`.
- [ ] Import `config` and `logger`.
- [ ] Call `WorkspaceTopStories` after initial setup. Log count.
- [ ] Retrieve `MAX_COMMENTS_PER_STORY` from `config`, ensuring it's a number.
- [ ] Update `Story` type in `src/types/hn.ts` to include `comments: Comment[]`.
- [ ] Loop through the fetched stories:
  - [ ] Log comment fetching start for the story ID.
  - [ ] Call `WorkspaceCommentsForStory` with `storyId` and `maxComments`.
  - [ ] Handle potential errors from the client function call.
  - [ ] Assign the returned comments array to the `comments` property of the current story object.
- [ ] Add temporary logging or use debugger to verify stories in memory contain comments (AC4).

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - If logic is moved to `src/core/pipeline.ts`, unit test `runPipeline`. [916]
  - Mock `algoliaHNClient` functions (`WorkspaceTopStories`, `WorkspaceCommentsForStory`). [918]
  - Mock `config` to provide `MAX_COMMENTS_PER_STORY`.
  - Mock `logger`.
  - Verify `WorkspaceTopStories` is called once.
  - Verify `WorkspaceCommentsForStory` is called for each story returned by the mocked `WorkspaceTopStories`, and that it receives the correct `storyId` and `maxComments` value from config [185].
  - Verify the results from mocked `WorkspaceCommentsForStory` are correctly assigned to the `comments` property of the story objects.
- **Integration Tests:**
  - Could have an integration test for the fetch stage that uses the real `algoliaHNClient` (or a lightly mocked version checking calls) and verifies the in-memory data structure, but this is largely covered by the stage runner (Story 2.4). [921]
- **Manual/CLI Verification:**
  - Run `npm run dev`.
  - Check logs for fetching stories and comments messages [184].
  - Use debugger or temporary `console.log` in the pipeline code to inspect a story object after the loop and confirm its `comments` property is populated [186].
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Logic moved to src/core/pipeline.ts. Verified in-memory data structure.}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/2.3.story.md**

```markdown
# Story 2.3: Persist Fetched HN Data Locally

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want to save the fetched HN stories (including their comments) to JSON files in the date-stamped output directory, so that the raw data is persisted locally for subsequent pipeline stages and debugging. [187]

**Context:** This story follows Story 2.2 where HN data (stories with comments) was fetched and stored in memory. Now, this data needs to be saved to the local filesystem. It uses the date-stamped output directory created in Epic 1 (Story 1.4) and writes one JSON file per story, containing the story metadata and its comments. This persisted data (`{storyId}_data.json`) is the input for subsequent stages (Scraping - Epic 3, Summarization - Epic 4, Email Assembly - Epic 5). [48, 734, 735]

## Detailed Requirements

- Define a consistent JSON structure for the output file content. [188] Example from `docs/data-models.md` [539]: `{ storyId: "...", title: "...", articleUrl: "...", hnUrl: "...", points: ..., numComments: ..., fetchedAt: "ISO_TIMESTAMP", comments: [{ commentId: "...", commentText: "...", author: "...", createdAt: "...", ... }, ...] }`. Include a timestamp (`WorkspaceedAt`) for when the data was fetched/saved. [190]
- Import Node.js `fs` (specifically `writeFileSync`) and `path` modules in the pipeline module (`src/core/pipeline.ts` or `src/index.ts`). [190] Import `date-fns` or use `new Date().toISOString()` for timestamp.
- In the main workflow (`pipeline.ts`), within the loop iterating through stories (immediately after comments have been fetched and added to the story object in Story 2.2): [191]
  - Get the full path to the date-stamped output directory (this path should be determined/passed from the initial setup logic from Story 1.4). [191]
  - Generate the current timestamp in ISO 8601 format (e.g., `new Date().toISOString()`) and add it to the story object as `WorkspaceedAt`. [190] Update `Story` type in `src/types/hn.ts`. [516]
  - Construct the filename for the story's data: `{storyId}_data.json`. [192]
  - Construct the full file path using `path.join()`. [193]
  - Prepare the data object to be saved, matching the defined JSON structure (including `storyId`, `title`, `articleUrl`, `hnUrl`, `points`, `numComments`, `WorkspaceedAt`, `comments`).
  - Serialize the prepared story data object to a JSON string using `JSON.stringify(storyData, null, 2)` for readability. [194]
  - Write the JSON string to the file using `fs.writeFileSync()`. Use a `try...catch` block for error handling around the file write. [195]
  - Log (using the logger) the successful persistence of each story's data file or any errors encountered during file writing. [196]

## Acceptance Criteria (ACs)

- AC1: After running `npm run dev`, the date-stamped output directory (e.g., `./output/YYYY-MM-DD/`) contains exactly 10 files named `{storyId}_data.json` (assuming 10 stories were fetched successfully). [197]
- AC2: Each JSON file contains valid JSON representing a single story object, including its metadata (`storyId`, `title`, `articleUrl`, `hnUrl`, `points`, `numComments`), a `WorkspaceedAt` ISO timestamp, and an array of its fetched `comments`, matching the structure defined in `docs/data-models.md` [538-540]. [198]
- AC3: The number of comments in each file's `comments` array does not exceed `MAX_COMMENTS_PER_STORY`. [199]
- AC4: Logs indicate that saving data to a file was attempted for each story, reporting success or specific file writing errors. [200]
- AC5: The `Story` type definition in `src/types/hn.ts` is updated to include the `WorkspaceedAt: string` field. [516]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Modify: `src/core/pipeline.ts` (or `src/index.ts`), `src/types/hn.ts`.
  - _(Hint: See `docs/project-structure.md` [818, 821, 822])._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851].
  - Native `fs` module (`writeFileSync`) [190].
  - Native `path` module (`join`) [193].
  - `JSON.stringify` [194].
  - Uses `logger` (Story 1.4).
  - Uses output directory path created in Story 1.4 logic.
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - `fs.writeFileSync(filePath, jsonDataString, 'utf-8')`. [195]
- **Data Structures:**
  - Uses `Story` and `Comment` types from `src/types/hn.ts`.
  - Augment `Story` type to include `WorkspaceedAt: string`. [516]
  - Creates JSON structure matching `{storyId}_data.json` schema in `docs/data-models.md`. [538-540]
  - _(Hint: See `docs/data-models.md`)._
- **Environment Variables:**
  - N/A directly, but relies on `OUTPUT_DIR_PATH` being available from config (Story 1.2) used by the directory creation logic (Story 1.4).
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Use `try...catch` for `writeFileSync` calls. [195]
  - Use `JSON.stringify` with indentation (`null, 2`) for readability. [194]
  - Log success/failure clearly using the logger. [196]

## Tasks / Subtasks

- [ ] In `pipeline.ts` (or `index.ts`), import `fs` and `path`.
- [ ] Update `Story` type in `src/types/hn.ts` to include `WorkspaceedAt: string`.
- [ ] Ensure the full path to the date-stamped output directory is available within the story processing loop.
- [ ] Inside the loop (after comments are fetched for a story):
  - [ ] Get the current ISO timestamp (`new Date().toISOString()`).
  - [ ] Add the timestamp to the story object as `WorkspaceedAt`.
  - [ ] Construct the output filename: `{storyId}_data.json`.
  - [ ] Construct the full file path using `path.join(outputDirPath, filename)`.
  - [ ] Create the data object matching the specified JSON structure, including comments.
  - [ ] Serialize the data object using `JSON.stringify(data, null, 2)`.
  - [ ] Use `try...catch` block:
    - [ ] Inside `try`: Call `fs.writeFileSync(fullPath, jsonString, 'utf-8')`.
    - [ ] Inside `try`: Log success message with filename.
    - [ ] Inside `catch`: Log file writing error with filename.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - Testing file system interactions directly in unit tests can be brittle. [918]
  - Focus unit tests on the data preparation logic: ensure the object created before `JSON.stringify` has the correct structure (`storyId`, `title`, `articleUrl`, `hnUrl`, `points`, `numComments`, `WorkspaceedAt`, `comments`) based on a sample input `Story` object. [920]
  - Verify the `WorkspaceedAt` timestamp is added correctly.
- **Integration Tests:** [921]
  - Could test the file writing aspect using `mock-fs` or actual file system writes within a temporary directory (created during setup, removed during teardown). [924]
  - Verify that the correct filename is generated and the content written to the mock/temporary file matches the expected JSON structure [538-540] and content.
- **Manual/CLI Verification:** [912]
  - Run `npm run dev`.
  - Inspect the `output/YYYY-MM-DD/` directory (use current date).
  - Verify 10 files named `{storyId}_data.json` exist (AC1).
  - Open a few files, visually inspect the JSON structure, check for all required fields (metadata, `WorkspaceedAt`, `comments` array), and verify comment count <= `MAX_COMMENTS_PER_STORY` (AC2, AC3).
  - Check console logs for success messages for file writing or any errors (AC4).
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Files saved successfully in ./output/YYYY-MM-DD/ directory.}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/2.4.story.md**

```markdown
# Story 2.4: Implement Stage Testing Utility for HN Fetching

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want a separate, executable script that _only_ performs the HN data fetching and persistence, so I can test and trigger this stage independently of the full pipeline. [201]

**Context:** This story addresses the PRD requirement [736] for stage-specific testing utilities [764]. It creates a standalone Node.js script (`src/stages/fetch_hn_data.ts`) that replicates the core logic of Stories 2.1, 2.2 (partially), and 2.3. This script will initialize necessary components (logger, config), call the `algoliaHNClient` to fetch stories and comments, and persist the results to the date-stamped output directory, just like the main pipeline does up to this point. This allows isolated testing of the Algolia API interaction and data persistence without running subsequent scraping, summarization, or emailing stages. [57, 62, 912]

## Detailed Requirements

- Create a new standalone script file: `src/stages/fetch_hn_data.ts`. [202]
- This script should perform the essential setup required _for this stage_:
  - Initialize the logger utility (from Story 1.4). [203]
  - Load configuration using the config utility (from Story 1.2) to get `MAX_COMMENTS_PER_STORY` and `OUTPUT_DIR_PATH`. [203]
  - Determine the current date ('YYYY-MM-DD') using the utility from Story 1.4. [203]
  - Construct the date-stamped output directory path. [203]
  - Ensure the output directory exists (create it recursively if not, reusing logic/utility from Story 1.4). [203]
- The script should then execute the core logic of fetching and persistence:
  - Import and use `algoliaHNClient.fetchTopStories` and `algoliaHNClient.fetchCommentsForStory` (from Story 2.1). [204]
  - Import `fs` and `path`.
  - Replicate the fetch loop logic from Story 2.2 (fetch stories, then loop to fetch comments for each using loaded `MAX_COMMENTS_PER_STORY` limit). [204]
  - Replicate the persistence logic from Story 2.3 (add `WorkspaceedAt` timestamp, prepare data object, `JSON.stringify`, `fs.writeFileSync` to `{storyId}_data.json` in the date-stamped directory). [204]
- The script should log its progress (e.g., "Starting HN data fetch stage...", "Fetching stories...", "Fetching comments for story X...", "Saving data for story X...") using the logger utility. [205]
- Add a new script command to `package.json` under `"scripts"`: `"stage:fetch": "ts-node src/stages/fetch_hn_data.ts"`. [206]

## Acceptance Criteria (ACs)

- AC1: The file `src/stages/fetch_hn_data.ts` exists. [207]
- AC2: The script `stage:fetch` is defined in `package.json`'s `scripts` section. [208]
- AC3: Running `npm run stage:fetch` executes successfully, performing only the setup (logger, config, output dir), fetch (stories, comments), and persist steps (to JSON files). [209]
- AC4: Running `npm run stage:fetch` creates the same 10 `{storyId}_data.json` files in the correct date-stamped output directory as running the main `npm run dev` command (up to the end of Epic 2 functionality). [210]
- AC5: Logs generated by `npm run stage:fetch` reflect only the fetching and persisting steps, not subsequent pipeline stages (scraping, summarizing, emailing). [211]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Create: `src/stages/fetch_hn_data.ts`.
  - Files to Modify: `package.json`.
  - _(Hint: See `docs/project-structure.md` [820] for stage runner location)._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851], `ts-node` (via `npm run` script).
  - Uses `logger` (Story 1.4), `config` (Story 1.2), date util (Story 1.4), directory creation logic (Story 1.4), `algoliaHNClient` (Story 2.1), `fs`/`path` (Story 2.3).
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - Calls internal `algoliaHNClient` functions.
  - Uses `fs.writeFileSync`.
- **Data Structures:**
  - Uses `Story`, `Comment` types.
  - Generates `{storyId}_data.json` files [538-540].
  - _(Hint: See `docs/data-models.md`)._
- **Environment Variables:**
  - Reads `MAX_COMMENTS_PER_STORY` and `OUTPUT_DIR_PATH` via `config.ts`.
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Structure the script clearly (setup, fetch, persist).
  - Use `async/await`.
  - Use logger extensively for progress indication. [205]
  - Consider wrapping the main logic in an `async` IIFE (Immediately Invoked Function Expression) or a main function call.

## Tasks / Subtasks

- [ ] Create `src/stages/fetch_hn_data.ts`.
- [ ] Add imports for logger, config, date util, `algoliaHNClient`, `fs`, `path`.
- [ ] Implement setup logic: initialize logger, load config, get output dir path, ensure directory exists.
- [ ] Implement main fetch logic:
  - [ ] Call `WorkspaceTopStories`.
  - [ ] Get `MAX_COMMENTS_PER_STORY` from config.
  - [ ] Loop through stories:
    - [ ] Call `WorkspaceCommentsForStory`.
    - [ ] Add comments to story object.
    - [ ] Add `WorkspaceedAt` timestamp.
    - [ ] Prepare data object for saving.
    - [ ] Construct full file path for `{storyId}_data.json`.
    - [ ] Serialize and write to file using `fs.writeFileSync` within `try...catch`.
    - [ ] Log progress/success/errors.
- [ ] Add script `"stage:fetch": "ts-node src/stages/fetch_hn_data.ts"` to `package.json`.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** Unit tests for the underlying components (logger, config, client, utils) should already exist from previous stories. Unit testing the stage script itself might have limited value beyond checking basic setup calls if the core logic is just orchestrating tested components. [915]
- **Integration Tests:** N/A specifically for the script, as it _is_ an integration test itself. [921]
- **Manual/CLI Verification (Primary Test Method for this Story):** [912, 927]
  - Run `npm run stage:fetch`. [209]
  - Verify successful execution without errors.
  - Check console logs for messages specific to fetching and persisting [211].
  - Inspect the `output/YYYY-MM-DD/` directory and verify the content of the generated `{storyId}_data.json` files match expectations (similar to verification for Story 2.3) [210].
  - Modify `package.json` to add the script (AC2).
- _(Hint: See `docs/testing-strategy.md` [907-950] which identifies Stage Runners as a key part of Acceptance Testing)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Stage runner script created and tested successfully. package.json updated.}
- **Change Log:**
  - Initial Draft
```

---

## **End of Report for Epic 2**

Okay, continuing in **SM Mode**.

Generating the stories for **Epic 2: HN Data Acquisition & Persistence**. This assumes that the foundational work from Epic 1 (project initialization, configuration setup via `src/utils/config.ts`, logger via `src/utils/logger.ts`, and output directory creation logic in `src/index.ts`) is complete and available for use.

---

## **Stories Report: Epic 2**

**File: ai/stories/2.1.story.md**

```markdown
# Story 2.1: Implement Algolia HN API Client

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want a dedicated client module to interact with the Algolia Hacker News Search API, so that fetching stories and comments is encapsulated, reusable, and uses the required native `Workspace` API. [155]

**Context:** This story creates the primary interface for retrieving data from the external Hacker News API provided by Algolia. It encapsulates the specific API calls (`GET /search` for stories and comments) and data extraction logic into a reusable module (`src/clients/algoliaHNClient.ts`). This client will be used by the main pipeline (Story 2.2) and the stage testing utility (Story 2.4). It builds upon the logger created in Epic 1 (Story 1.4). [54, 60, 62, 77]

## Detailed Requirements

- Create a new module: `src/clients/algoliaHNClient.ts`. [156]
- Implement an async function `WorkspaceTopStories` within the client: [157]
  - Use native `Workspace` [749] to call the Algolia HN Search API endpoint for front-page stories (`http://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10`). [4, 6, 7, 157] Adjust `hitsPerPage` if needed to ensure 10 stories.
  - Parse the JSON response. [158]
  - Extract required metadata for each story: `objectID` (use as `storyId`), `title`, `url` (use as `articleUrl`), `points`, `num_comments`. [159, 522] Handle potential missing `url` field gracefully (log warning using logger from Story 1.4, treat as null). [160]
  - Construct the `hnUrl` for each story (e.g., `https://news.ycombinator.com/item?id={storyId}`). [161]
  - Return an array of structured story objects (define a `Story` type, potentially in `src/types/hn.ts`). [162, 506-511]
- Implement a separate async function `WorkspaceCommentsForStory` within the client: [163]
  - Accept `storyId` (string) and `maxComments` limit (number) as arguments. [163]
  - Use native `Workspace` to call the Algolia HN Search API endpoint for comments of a specific story (`http://hn.algolia.com/api/v1/search?tags=comment,story_{storyId}&hitsPerPage={maxComments}`). [12, 13, 14, 164]
  - Parse the JSON response. [165]
  - Extract required comment data: `objectID` (use as `commentId`), `comment_text`, `author`, `created_at`. [165, 524]
  - Filter out comments where `comment_text` is null or empty. Ensure only up to `maxComments` are returned. [166]
  - Return an array of structured comment objects (define a `Comment` type, potentially in `src/types/hn.ts`). [167, 500-505]
- Implement basic error handling using `try...catch` around `Workspace` calls and check `response.ok` status. [168] Log errors using the logger utility from Epic 1 (Story 1.4). [169]
- Define TypeScript interfaces/types for the expected structures of API responses (subset needed) and the data returned by the client functions (`Story`, `Comment`). Place these in `src/types/hn.ts`. [169, 821]

## Acceptance Criteria (ACs)

- AC1: The module `src/clients/algoliaHNClient.ts` exists and exports `WorkspaceTopStories` and `WorkspaceCommentsForStory` functions. [170]
- AC2: Calling `WorkspaceTopStories` makes a network request to the correct Algolia endpoint (`search?tags=front_page&hitsPerPage=10`) and returns a promise resolving to an array of 10 `Story` objects containing the specified metadata (`storyId`, `title`, `articleUrl`, `hnUrl`, `points`, `num_comments`). [171]
- AC3: Calling `WorkspaceCommentsForStory` with a valid `storyId` and `maxComments` limit makes a network request to the correct Algolia endpoint (`search?tags=comment,story_{storyId}&hitsPerPage={maxComments}`) and returns a promise resolving to an array of `Comment` objects (up to `maxComments`), filtering out empty ones. [172]
- AC4: Both functions use the native `Workspace` API internally. [173]
- AC5: Network errors or non-successful API responses (e.g., status 4xx, 5xx) are caught and logged using the logger from Story 1.4. [174] Functions should likely return an empty array or throw a specific error in failure cases for the caller to handle.
- AC6: Relevant TypeScript types (`Story`, `Comment`) are defined in `src/types/hn.ts` and used within the client module. [175]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Create: `src/clients/algoliaHNClient.ts`, `src/types/hn.ts`.
  - Files to Modify: Potentially `src/types/index.ts` if using a barrel file.
  - _(Hint: See `docs/project-structure.md` [817, 821] for location)._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851], Native `Workspace` API [863].
  - Uses `logger` utility from Epic 1 (Story 1.4).
  - _(Hint: See `docs/tech-stack.md` [839-905] for full list)._
- **API Interactions / SDK Usage:**
  - Algolia HN Search API `GET /search` endpoint. [2]
  - Base URL: `http://hn.algolia.com/api/v1` [3]
  - Parameters: `tags=front_page`, `hitsPerPage=10` (for stories) [6, 7]; `tags=comment,story_{storyId}`, `hitsPerPage={maxComments}` (for comments) [13, 14].
  - Check `response.ok` and parse JSON response (`response.json()`). [168, 158, 165]
  - Handle potential network errors with `try...catch`. [168]
  - No authentication required. [3]
  - _(Hint: See `docs/api-reference.md` [2-21] for details)._
- **Data Structures:**
  - Define `Comment` interface: `{ commentId: string, commentText: string | null, author: string | null, createdAt: string }`. [501-505]
  - Define `Story` interface (initial fields): `{ storyId: string, title: string, articleUrl: string | null, hnUrl: string, points?: number, numComments?: number }`. [507-511]
  - (These types will be augmented in later stories [512-517]).
  - Reference Algolia response subset schemas in `docs/data-models.md` [521-525].
  - _(Hint: See `docs/data-models.md` for full details)._
- **Environment Variables:**
  - No direct environment variables needed for this client itself (uses hardcoded base URL, fetches comment limit via argument).
  - _(Hint: See `docs/environment-vars.md` [548-638] for all variables)._
- **Coding Standards Notes:**
  - Use `async/await` for `Workspace` calls.
  - Use logger for errors and significant events (e.g., warning if `url` is missing). [160]
  - Export types and functions clearly.

## Tasks / Subtasks

- [ ] Create `src/types/hn.ts` and define `Comment` and initial `Story` interfaces.
- [ ] Create `src/clients/algoliaHNClient.ts`.
- [ ] Import necessary types and the logger utility.
- [ ] Implement `WorkspaceTopStories` function:
  - [ ] Construct Algolia URL for top stories.
  - [ ] Use `Workspace` with `try...catch`.
  - [ ] Check `response.ok`, log errors if not OK.
  - [ ] Parse JSON response.
  - [ ] Map `hits` to `Story` objects, extracting required fields, handling null `url`, constructing `hnUrl`.
  - [ ] Return array of `Story` objects (or handle error case).
- [ ] Implement `WorkspaceCommentsForStory` function:
  - [ ] Accept `storyId` and `maxComments` arguments.
  - [ ] Construct Algolia URL for comments using arguments.
  - [ ] Use `Workspace` with `try...catch`.
  - [ ] Check `response.ok`, log errors if not OK.
  - [ ] Parse JSON response.
  - [ ] Map `hits` to `Comment` objects, extracting required fields.
  - [ ] Filter out comments with null/empty `comment_text`.
  - [ ] Limit results to `maxComments`.
  - [ ] Return array of `Comment` objects (or handle error case).
- [ ] Export functions and types as needed.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - Write unit tests for `src/clients/algoliaHNClient.ts`. [919]
  - Mock the native `Workspace` function (e.g., using `jest.spyOn(global, 'fetch')`). [918]
  - Test `WorkspaceTopStories`: Provide mock successful responses (valid JSON matching Algolia structure [521-523]) and verify correct parsing, mapping to `Story` objects [171], and `hnUrl` construction. Test with missing `url` field. Test mock error responses (network error, non-OK status) and verify error logging [174] and return value.
  - Test `WorkspaceCommentsForStory`: Provide mock successful responses [524-525] and verify correct parsing, mapping to `Comment` objects, filtering of empty comments, and limiting by `maxComments` [172]. Test mock error responses and verify logging [174].
  - Verify `Workspace` was called with the correct URLs and parameters [171, 172].
- **Integration Tests:** N/A for this client module itself, but it will be used in pipeline integration tests later. [921]
- **Manual/CLI Verification:** Tested indirectly via Story 2.2 execution and directly via Story 2.4 stage runner. [912]
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Any notes about implementation choices, difficulties, or follow-up needed}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/2.2.story.md**

```markdown
# Story 2.2: Integrate HN Data Fetching into Main Workflow

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want to integrate the HN data fetching logic into the main application workflow (`src/index.ts`), so that running the app retrieves the top 10 stories and their comments after completing the setup from Epic 1. [176]

**Context:** This story connects the HN API client created in Story 2.1 to the main application entry point (`src/index.ts`) established in Epic 1 (Story 1.3). It modifies the main execution flow to call the client functions (`WorkspaceTopStories`, `WorkspaceCommentsForStory`) after the initial setup (logger, config, output directory). It uses the `MAX_COMMENTS_PER_STORY` configuration value loaded in Story 1.2. The fetched data (stories and their associated comments) is held in memory at the end of this stage. [46, 77]

## Detailed Requirements

- Modify the main execution flow in `src/index.ts` (or a main async function called by it, potentially moving logic to `src/core/pipeline.ts` as suggested by `ARCH` [46, 53] and `PS` [818]). **Recommendation:** Create `src/core/pipeline.ts` and a `runPipeline` async function, then call this function from `src/index.ts`.
- Import the `algoliaHNClient` functions (`WorkspaceTopStories`, `WorkspaceCommentsForStory`) from Story 2.1. [177]
- Import the configuration module (`src/utils/config.ts`) to access `MAX_COMMENTS_PER_STORY`. [177, 563] Also import the logger.
- In the main pipeline function, after the Epic 1 setup (config load, logger init, output dir creation):
  - Call `await fetchTopStories()`. [178]
  - Log the number of stories fetched (e.g., "Fetched X stories."). [179] Use the logger from Story 1.4.
  - Retrieve the `MAX_COMMENTS_PER_STORY` value from the config module. Ensure it's parsed as a number. Provide a default if necessary (e.g., 50, matching `ENV` [564]).
  - Iterate through the array of fetched `Story` objects. [179]
  - For each `Story`:
    - Log progress (e.g., "Fetching up to Y comments for story {storyId}..."). [182]
    - Call `await fetchCommentsForStory()`, passing the `story.storyId` and the configured `MAX_COMMENTS_PER_STORY` value. [180]
    - Store the fetched comments (the returned `Comment[]`) within the corresponding `Story` object in memory (e.g., add a `comments: Comment[]` property to the `Story` type/object). [181] Augment the `Story` type definition in `src/types/hn.ts`. [512]
- Ensure errors from the client functions are handled appropriately (e.g., log error and potentially skip comment fetching for that story).

## Acceptance Criteria (ACs)

- AC1: Running `npm run dev` executes Epic 1 setup steps followed by fetching stories and then comments for each story using the `algoliaHNClient`. [183]
- AC2: Logs (via logger) clearly show the start and successful completion of fetching stories, and the start of fetching comments for each of the 10 stories. [184]
- AC3: The configured `MAX_COMMENTS_PER_STORY` value is read from config, parsed as a number, and used in the calls to `WorkspaceCommentsForStory`. [185]
- AC4: After successful execution (before persistence in Story 2.3), `Story` objects held in memory contain a `comments` property populated with an array of fetched `Comment` objects. [186] (Verification via debugger or temporary logging).
- AC5: The `Story` type definition in `src/types/hn.ts` is updated to include the `comments: Comment[]` field. [512]
- AC6: (If implemented) Core logic is moved to `src/core/pipeline.ts` and called from `src/index.ts`. [818]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Create: `src/core/pipeline.ts` (recommended).
  - Files to Modify: `src/index.ts`, `src/types/hn.ts`.
  - _(Hint: See `docs/project-structure.md` [818, 821, 822])._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851].
  - Uses `algoliaHNClient` (Story 2.1), `config` (Story 1.2), `logger` (Story 1.4).
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - Calls internal `algoliaHNClient.fetchTopStories()` and `algoliaHNClient.fetchCommentsForStory()`.
- **Data Structures:**
  - Augment `Story` interface in `src/types/hn.ts` to include `comments: Comment[]`. [512]
  - Manipulates arrays of `Story` and `Comment` objects in memory.
  - _(Hint: See `docs/data-models.md` [500-517])._
- **Environment Variables:**
  - Reads `MAX_COMMENTS_PER_STORY` via `config.ts`. [177, 563]
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Use `async/await` for calling client functions.
  - Structure fetching logic cleanly (e.g., within a loop).
  - Use the logger for progress and error reporting. [182, 184]
  - Consider putting the main loop logic inside the `runPipeline` function in `src/core/pipeline.ts`.

## Tasks / Subtasks

- [ ] (Recommended) Create `src/core/pipeline.ts` and define an async `runPipeline` function.
- [ ] Modify `src/index.ts` to import and call `runPipeline`. Move existing setup logic (logger init, config load, dir creation) into `runPipeline` or ensure it runs before it.
- [ ] In `pipeline.ts` (or `index.ts`), import `WorkspaceTopStories`, `WorkspaceCommentsForStory` from `algoliaHNClient`.
- [ ] Import `config` and `logger`.
- [ ] Call `WorkspaceTopStories` after initial setup. Log count.
- [ ] Retrieve `MAX_COMMENTS_PER_STORY` from `config`, ensuring it's a number.
- [ ] Update `Story` type in `src/types/hn.ts` to include `comments: Comment[]`.
- [ ] Loop through the fetched stories:
  - [ ] Log comment fetching start for the story ID.
  - [ ] Call `WorkspaceCommentsForStory` with `storyId` and `maxComments`.
  - [ ] Handle potential errors from the client function call.
  - [ ] Assign the returned comments array to the `comments` property of the current story object.
- [ ] Add temporary logging or use debugger to verify stories in memory contain comments (AC4).

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - If logic is moved to `src/core/pipeline.ts`, unit test `runPipeline`. [916]
  - Mock `algoliaHNClient` functions (`WorkspaceTopStories`, `WorkspaceCommentsForStory`). [918]
  - Mock `config` to provide `MAX_COMMENTS_PER_STORY`.
  - Mock `logger`.
  - Verify `WorkspaceTopStories` is called once.
  - Verify `WorkspaceCommentsForStory` is called for each story returned by the mocked `WorkspaceTopStories`, and that it receives the correct `storyId` and `maxComments` value from config [185].
  - Verify the results from mocked `WorkspaceCommentsForStory` are correctly assigned to the `comments` property of the story objects.
- **Integration Tests:**
  - Could have an integration test for the fetch stage that uses the real `algoliaHNClient` (or a lightly mocked version checking calls) and verifies the in-memory data structure, but this is largely covered by the stage runner (Story 2.4). [921]
- **Manual/CLI Verification:**
  - Run `npm run dev`.
  - Check logs for fetching stories and comments messages [184].
  - Use debugger or temporary `console.log` in the pipeline code to inspect a story object after the loop and confirm its `comments` property is populated [186].
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Logic moved to src/core/pipeline.ts. Verified in-memory data structure.}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/2.3.story.md**

```markdown
# Story 2.3: Persist Fetched HN Data Locally

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want to save the fetched HN stories (including their comments) to JSON files in the date-stamped output directory, so that the raw data is persisted locally for subsequent pipeline stages and debugging. [187]

**Context:** This story follows Story 2.2 where HN data (stories with comments) was fetched and stored in memory. Now, this data needs to be saved to the local filesystem. It uses the date-stamped output directory created in Epic 1 (Story 1.4) and writes one JSON file per story, containing the story metadata and its comments. This persisted data (`{storyId}_data.json`) is the input for subsequent stages (Scraping - Epic 3, Summarization - Epic 4, Email Assembly - Epic 5). [48, 734, 735]

## Detailed Requirements

- Define a consistent JSON structure for the output file content. [188] Example from `docs/data-models.md` [539]: `{ storyId: "...", title: "...", articleUrl: "...", hnUrl: "...", points: ..., numComments: ..., fetchedAt: "ISO_TIMESTAMP", comments: [{ commentId: "...", commentText: "...", author: "...", createdAt: "...", ... }, ...] }`. Include a timestamp (`WorkspaceedAt`) for when the data was fetched/saved. [190]
- Import Node.js `fs` (specifically `writeFileSync`) and `path` modules in the pipeline module (`src/core/pipeline.ts` or `src/index.ts`). [190] Import `date-fns` or use `new Date().toISOString()` for timestamp.
- In the main workflow (`pipeline.ts`), within the loop iterating through stories (immediately after comments have been fetched and added to the story object in Story 2.2): [191]
  - Get the full path to the date-stamped output directory (this path should be determined/passed from the initial setup logic from Story 1.4). [191]
  - Generate the current timestamp in ISO 8601 format (e.g., `new Date().toISOString()`) and add it to the story object as `WorkspaceedAt`. [190] Update `Story` type in `src/types/hn.ts`. [516]
  - Construct the filename for the story's data: `{storyId}_data.json`. [192]
  - Construct the full file path using `path.join()`. [193]
  - Prepare the data object to be saved, matching the defined JSON structure (including `storyId`, `title`, `articleUrl`, `hnUrl`, `points`, `numComments`, `WorkspaceedAt`, `comments`).
  - Serialize the prepared story data object to a JSON string using `JSON.stringify(storyData, null, 2)` for readability. [194]
  - Write the JSON string to the file using `fs.writeFileSync()`. Use a `try...catch` block for error handling around the file write. [195]
  - Log (using the logger) the successful persistence of each story's data file or any errors encountered during file writing. [196]

## Acceptance Criteria (ACs)

- AC1: After running `npm run dev`, the date-stamped output directory (e.g., `./output/YYYY-MM-DD/`) contains exactly 10 files named `{storyId}_data.json` (assuming 10 stories were fetched successfully). [197]
- AC2: Each JSON file contains valid JSON representing a single story object, including its metadata (`storyId`, `title`, `articleUrl`, `hnUrl`, `points`, `numComments`), a `WorkspaceedAt` ISO timestamp, and an array of its fetched `comments`, matching the structure defined in `docs/data-models.md` [538-540]. [198]
- AC3: The number of comments in each file's `comments` array does not exceed `MAX_COMMENTS_PER_STORY`. [199]
- AC4: Logs indicate that saving data to a file was attempted for each story, reporting success or specific file writing errors. [200]
- AC5: The `Story` type definition in `src/types/hn.ts` is updated to include the `WorkspaceedAt: string` field. [516]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Modify: `src/core/pipeline.ts` (or `src/index.ts`), `src/types/hn.ts`.
  - _(Hint: See `docs/project-structure.md` [818, 821, 822])._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851].
  - Native `fs` module (`writeFileSync`) [190].
  - Native `path` module (`join`) [193].
  - `JSON.stringify` [194].
  - Uses `logger` (Story 1.4).
  - Uses output directory path created in Story 1.4 logic.
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - `fs.writeFileSync(filePath, jsonDataString, 'utf-8')`. [195]
- **Data Structures:**
  - Uses `Story` and `Comment` types from `src/types/hn.ts`.
  - Augment `Story` type to include `WorkspaceedAt: string`. [516]
  - Creates JSON structure matching `{storyId}_data.json` schema in `docs/data-models.md`. [538-540]
  - _(Hint: See `docs/data-models.md`)._
- **Environment Variables:**
  - N/A directly, but relies on `OUTPUT_DIR_PATH` being available from config (Story 1.2) used by the directory creation logic (Story 1.4).
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Use `try...catch` for `writeFileSync` calls. [195]
  - Use `JSON.stringify` with indentation (`null, 2`) for readability. [194]
  - Log success/failure clearly using the logger. [196]

## Tasks / Subtasks

- [ ] In `pipeline.ts` (or `index.ts`), import `fs` and `path`.
- [ ] Update `Story` type in `src/types/hn.ts` to include `WorkspaceedAt: string`.
- [ ] Ensure the full path to the date-stamped output directory is available within the story processing loop.
- [ ] Inside the loop (after comments are fetched for a story):
  - [ ] Get the current ISO timestamp (`new Date().toISOString()`).
  - [ ] Add the timestamp to the story object as `WorkspaceedAt`.
  - [ ] Construct the output filename: `{storyId}_data.json`.
  - [ ] Construct the full file path using `path.join(outputDirPath, filename)`.
  - [ ] Create the data object matching the specified JSON structure, including comments.
  - [ ] Serialize the data object using `JSON.stringify(data, null, 2)`.
  - [ ] Use `try...catch` block:
    - [ ] Inside `try`: Call `fs.writeFileSync(fullPath, jsonString, 'utf-8')`.
    - [ ] Inside `try`: Log success message with filename.
    - [ ] Inside `catch`: Log file writing error with filename.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - Testing file system interactions directly in unit tests can be brittle. [918]
  - Focus unit tests on the data preparation logic: ensure the object created before `JSON.stringify` has the correct structure (`storyId`, `title`, `articleUrl`, `hnUrl`, `points`, `numComments`, `WorkspaceedAt`, `comments`) based on a sample input `Story` object. [920]
  - Verify the `WorkspaceedAt` timestamp is added correctly.
- **Integration Tests:** [921]
  - Could test the file writing aspect using `mock-fs` or actual file system writes within a temporary directory (created during setup, removed during teardown). [924]
  - Verify that the correct filename is generated and the content written to the mock/temporary file matches the expected JSON structure [538-540] and content.
- **Manual/CLI Verification:** [912]
  - Run `npm run dev`.
  - Inspect the `output/YYYY-MM-DD/` directory (use current date).
  - Verify 10 files named `{storyId}_data.json` exist (AC1).
  - Open a few files, visually inspect the JSON structure, check for all required fields (metadata, `WorkspaceedAt`, `comments` array), and verify comment count <= `MAX_COMMENTS_PER_STORY` (AC2, AC3).
  - Check console logs for success messages for file writing or any errors (AC4).
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Files saved successfully in ./output/YYYY-MM-DD/ directory.}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/2.4.story.md**

```markdown
# Story 2.4: Implement Stage Testing Utility for HN Fetching

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want a separate, executable script that _only_ performs the HN data fetching and persistence, so I can test and trigger this stage independently of the full pipeline. [201]

**Context:** This story addresses the PRD requirement [736] for stage-specific testing utilities [764]. It creates a standalone Node.js script (`src/stages/fetch_hn_data.ts`) that replicates the core logic of Stories 2.1, 2.2 (partially), and 2.3. This script will initialize necessary components (logger, config), call the `algoliaHNClient` to fetch stories and comments, and persist the results to the date-stamped output directory, just like the main pipeline does up to this point. This allows isolated testing of the Algolia API interaction and data persistence without running subsequent scraping, summarization, or emailing stages. [57, 62, 912]

## Detailed Requirements

- Create a new standalone script file: `src/stages/fetch_hn_data.ts`. [202]
- This script should perform the essential setup required _for this stage_:
  - Initialize the logger utility (from Story 1.4). [203]
  - Load configuration using the config utility (from Story 1.2) to get `MAX_COMMENTS_PER_STORY` and `OUTPUT_DIR_PATH`. [203]
  - Determine the current date ('YYYY-MM-DD') using the utility from Story 1.4. [203]
  - Construct the date-stamped output directory path. [203]
  - Ensure the output directory exists (create it recursively if not, reusing logic/utility from Story 1.4). [203]
- The script should then execute the core logic of fetching and persistence:
  - Import and use `algoliaHNClient.fetchTopStories` and `algoliaHNClient.fetchCommentsForStory` (from Story 2.1). [204]
  - Import `fs` and `path`.
  - Replicate the fetch loop logic from Story 2.2 (fetch stories, then loop to fetch comments for each using loaded `MAX_COMMENTS_PER_STORY` limit). [204]
  - Replicate the persistence logic from Story 2.3 (add `WorkspaceedAt` timestamp, prepare data object, `JSON.stringify`, `fs.writeFileSync` to `{storyId}_data.json` in the date-stamped directory). [204]
- The script should log its progress (e.g., "Starting HN data fetch stage...", "Fetching stories...", "Fetching comments for story X...", "Saving data for story X...") using the logger utility. [205]
- Add a new script command to `package.json` under `"scripts"`: `"stage:fetch": "ts-node src/stages/fetch_hn_data.ts"`. [206]

## Acceptance Criteria (ACs)

- AC1: The file `src/stages/fetch_hn_data.ts` exists. [207]
- AC2: The script `stage:fetch` is defined in `package.json`'s `scripts` section. [208]
- AC3: Running `npm run stage:fetch` executes successfully, performing only the setup (logger, config, output dir), fetch (stories, comments), and persist steps (to JSON files). [209]
- AC4: Running `npm run stage:fetch` creates the same 10 `{storyId}_data.json` files in the correct date-stamped output directory as running the main `npm run dev` command (up to the end of Epic 2 functionality). [210]
- AC5: Logs generated by `npm run stage:fetch` reflect only the fetching and persisting steps, not subsequent pipeline stages (scraping, summarizing, emailing). [211]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Create: `src/stages/fetch_hn_data.ts`.
  - Files to Modify: `package.json`.
  - _(Hint: See `docs/project-structure.md` [820] for stage runner location)._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851], `ts-node` (via `npm run` script).
  - Uses `logger` (Story 1.4), `config` (Story 1.2), date util (Story 1.4), directory creation logic (Story 1.4), `algoliaHNClient` (Story 2.1), `fs`/`path` (Story 2.3).
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - Calls internal `algoliaHNClient` functions.
  - Uses `fs.writeFileSync`.
- **Data Structures:**
  - Uses `Story`, `Comment` types.
  - Generates `{storyId}_data.json` files [538-540].
  - _(Hint: See `docs/data-models.md`)._
- **Environment Variables:**
  - Reads `MAX_COMMENTS_PER_STORY` and `OUTPUT_DIR_PATH` via `config.ts`.
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Structure the script clearly (setup, fetch, persist).
  - Use `async/await`.
  - Use logger extensively for progress indication. [205]
  - Consider wrapping the main logic in an `async` IIFE (Immediately Invoked Function Expression) or a main function call.

## Tasks / Subtasks

- [ ] Create `src/stages/fetch_hn_data.ts`.
- [ ] Add imports for logger, config, date util, `algoliaHNClient`, `fs`, `path`.
- [ ] Implement setup logic: initialize logger, load config, get output dir path, ensure directory exists.
- [ ] Implement main fetch logic:
  - [ ] Call `WorkspaceTopStories`.
  - [ ] Get `MAX_COMMENTS_PER_STORY` from config.
  - [ ] Loop through stories:
    - [ ] Call `WorkspaceCommentsForStory`.
    - [ ] Add comments to story object.
    - [ ] Add `WorkspaceedAt` timestamp.
    - [ ] Prepare data object for saving.
    - [ ] Construct full file path for `{storyId}_data.json`.
    - [ ] Serialize and write to file using `fs.writeFileSync` within `try...catch`.
    - [ ] Log progress/success/errors.
- [ ] Add script `"stage:fetch": "ts-node src/stages/fetch_hn_data.ts"` to `package.json`.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** Unit tests for the underlying components (logger, config, client, utils) should already exist from previous stories. Unit testing the stage script itself might have limited value beyond checking basic setup calls if the core logic is just orchestrating tested components. [915]
- **Integration Tests:** N/A specifically for the script, as it _is_ an integration test itself. [921]
- **Manual/CLI Verification (Primary Test Method for this Story):** [912, 927]
  - Run `npm run stage:fetch`. [209]
  - Verify successful execution without errors.
  - Check console logs for messages specific to fetching and persisting [211].
  - Inspect the `output/YYYY-MM-DD/` directory and verify the content of the generated `{storyId}_data.json` files match expectations (similar to verification for Story 2.3) [210].
  - Modify `package.json` to add the script (AC2).
- _(Hint: See `docs/testing-strategy.md` [907-950] which identifies Stage Runners as a key part of Acceptance Testing)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Stage runner script created and tested successfully. package.json updated.}
- **Change Log:**
  - Initial Draft
```

---

## **End of Report for Epic 2**
