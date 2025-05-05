# Epic 2: HN Data Acquisition & Persistence

**Goal:** Implement fetching top 10 stories and their comments (respecting limits) from Algolia HN API, and persist this raw data locally into the date-stamped output directory created in Epic 1. Implement a stage testing utility for fetching.

## Story List

### Story 2.1: Implement Algolia HN API Client

-   **User Story / Goal:** As a developer, I want a dedicated client module to interact with the Algolia Hacker News Search API, so that fetching stories and comments is encapsulated, reusable, and uses the required native `Workspace` API.
-   **Detailed Requirements:**
    -   Create a new module: `src/clients/algoliaHNClient.ts`.
    -   Implement an async function `WorkspaceTopStories` within the client:
        -   Use native `Workspace` to call the Algolia HN Search API endpoint for front-page stories (e.g., `http://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10`). Adjust `hitsPerPage` if needed to ensure 10 stories.
        -   Parse the JSON response.
        -   Extract required metadata for each story: `objectID` (use as `storyId`), `title`, `url` (article URL), `points`, `num_comments`. Handle potential missing `url` field gracefully (log warning, maybe skip story later if URL needed).
        -   Construct the `hnUrl` for each story (e.g., `https://news.ycombinator.com/item?id={storyId}`).
        -   Return an array of structured story objects.
    -   Implement a separate async function `WorkspaceCommentsForStory` within the client:
        -   Accept `storyId` and `maxComments` limit as arguments.
        -   Use native `Workspace` to call the Algolia HN Search API endpoint for comments of a specific story (e.g., `http://hn.algolia.com/api/v1/search?tags=comment,story_{storyId}&hitsPerPage={maxComments}`).
        -   Parse the JSON response.
        -   Extract required comment data: `objectID` (use as `commentId`), `comment_text`, `author`, `created_at`.
        -   Filter out comments where `comment_text` is null or empty. Ensure only up to `maxComments` are returned.
        -   Return an array of structured comment objects.
    -   Implement basic error handling using `try...catch` around `Workspace` calls and check `response.ok` status. Log errors using the logger utility from Epic 1.
    -   Define TypeScript interfaces/types for the expected structures of API responses (stories, comments) and the data returned by the client functions (e.g., `Story`, `Comment`).
-   **Acceptance Criteria (ACs):**
    -   AC1: The module `src/clients/algoliaHNClient.ts` exists and exports `WorkspaceTopStories` and `WorkspaceCommentsForStory` functions.
    -   AC2: Calling `WorkspaceTopStories` makes a network request to the correct Algolia endpoint and returns a promise resolving to an array of 10 `Story` objects containing the specified metadata.
    -   AC3: Calling `WorkspaceCommentsForStory` with a valid `storyId` and `maxComments` limit makes a network request to the correct Algolia endpoint and returns a promise resolving to an array of `Comment` objects (up to `maxComments`), filtering out empty ones.
    -   AC4: Both functions use the native `Workspace` API internally.
    -   AC5: Network errors or non-successful API responses (e.g., status 4xx, 5xx) are caught and logged using the logger.
    -   AC6: Relevant TypeScript types (`Story`, `Comment`, etc.) are defined and used within the client module.

---

### Story 2.2: Integrate HN Data Fetching into Main Workflow

-   **User Story / Goal:** As a developer, I want to integrate the HN data fetching logic into the main application workflow (`src/index.ts`), so that running the app retrieves the top 10 stories and their comments after completing the setup from Epic 1.
-   **Detailed Requirements:**
    -   Modify the main execution flow in `src/index.ts` (or a main async function called by it).
    -   Import the `algoliaHNClient` functions.
    -   Import the configuration module to access `MAX_COMMENTS_PER_STORY`.
    -   After the Epic 1 setup (config load, logger init, output dir creation), call `WorkspaceTopStories()`.
    -   Log the number of stories fetched.
    -   Iterate through the array of fetched `Story` objects.
    -   For each `Story`, call `WorkspaceCommentsForStory()`, passing the `story.storyId` and the configured `MAX_COMMENTS_PER_STORY`.
    -   Store the fetched comments within the corresponding `Story` object in memory (e.g., add a `comments: Comment[]` property to the `Story` object).
    -   Log progress using the logger utility (e.g., "Fetched 10 stories.", "Fetching up to X comments for story {storyId}...").
-   **Acceptance Criteria (ACs):**
    -   AC1: Running `npm run dev` executes Epic 1 setup steps followed by fetching stories and then comments for each story.
    -   AC2: Logs clearly show the start and successful completion of fetching stories, and the start of fetching comments for each of the 10 stories.
    -   AC3: The configured `MAX_COMMENTS_PER_STORY` value is read from config and used in the calls to `WorkspaceCommentsForStory`.
    -   AC4: After successful execution, story objects held in memory contain a nested array of fetched comment objects. (Can be verified via debugger or temporary logging).

---

### Story 2.3: Persist Fetched HN Data Locally

-   **User Story / Goal:** As a developer, I want to save the fetched HN stories (including their comments) to JSON files in the date-stamped output directory, so that the raw data is persisted locally for subsequent pipeline stages and debugging.
-   **Detailed Requirements:**
    -   Define a consistent JSON structure for the output file content. Example: `{ storyId: "...", title: "...", url: "...", hnUrl: "...", points: ..., fetchedAt: "ISO_TIMESTAMP", comments: [{ commentId: "...", text: "...", author: "...", createdAt: "ISO_TIMESTAMP", ... }, ...] }`. Include a timestamp for when the data was fetched.
    -   Import Node.js `fs` (specifically `fs.writeFileSync`) and `path` modules.
    -   In the main workflow (`src/index.ts`), within the loop iterating through stories (after comments have been fetched and added to the story object in Story 2.2):
        -   Get the full path to the date-stamped output directory (determined in Epic 1).
        -   Construct the filename for the story's data: `{storyId}_data.json`.
        -   Construct the full file path using `path.join()`.
        -   Serialize the complete story object (including comments and fetch timestamp) to a JSON string using `JSON.stringify(storyObject, null, 2)` for readability.
        -   Write the JSON string to the file using `fs.writeFileSync()`. Use a `try...catch` block for error handling.
    -   Log (using the logger) the successful persistence of each story's data file or any errors encountered during file writing.
-   **Acceptance Criteria (ACs):**
    -   AC1: After running `npm run dev`, the date-stamped output directory (e.g., `./output/YYYY-MM-DD/`) contains exactly 10 files named `{storyId}_data.json`.
    -   AC2: Each JSON file contains valid JSON representing a single story object, including its metadata, fetch timestamp, and an array of its fetched comments, matching the defined structure.
    -   AC3: The number of comments in each file's `comments` array does not exceed `MAX_COMMENTS_PER_STORY`.
    -   AC4: Logs indicate that saving data to a file was attempted for each story, reporting success or specific file writing errors.

---

### Story 2.4: Implement Stage Testing Utility for HN Fetching

-   **User Story / Goal:** As a developer, I want a separate, executable script that *only* performs the HN data fetching and persistence, so I can test and trigger this stage independently of the full pipeline.
-   **Detailed Requirements:**
    -   Create a new standalone script file: `src/stages/fetch_hn_data.ts`.
    -   This script should perform the essential setup required for this stage: initialize logger, load configuration (`.env`), determine and create output directory (reuse or replicate logic from Epic 1 / `src/index.ts`).
    -   The script should then execute the core logic of fetching stories via `algoliaHNClient.fetchTopStories`, fetching comments via `algoliaHNClient.fetchCommentsForStory` (using loaded config for limit), and persisting the results to JSON files using `fs.writeFileSync` (replicating logic from Story 2.3).
    -   The script should log its progress using the logger utility.
    -   Add a new script command to `package.json` under `"scripts"`: `"stage:fetch": "ts-node src/stages/fetch_hn_data.ts"`.
-   **Acceptance Criteria (ACs):**
    -   AC1: The file `src/stages/fetch_hn_data.ts` exists.
    -   AC2: The script `stage:fetch` is defined in `package.json`'s `scripts` section.
    -   AC3: Running `npm run stage:fetch` executes successfully, performing only the setup, fetch, and persist steps.
    -   AC4: Running `npm run stage:fetch` creates the same 10 `{storyId}_data.json` files in the correct date-stamped output directory as running the main `npm run dev` command (at the current state of development).
    -   AC5: Logs generated by `npm run stage:fetch` reflect only the fetching and persisting steps, not subsequent pipeline stages.

## Change Log

| Change        | Date       | Version | Description               | Author         |
| ------------- | ---------- | ------- | ------------------------- | -------------- |
| Initial Draft | 2025-05-04 | 0.1     | First draft of Epic 2     | 2-pm           |