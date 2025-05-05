# Epic 4: LLM Summarization & Persistence

**Goal:** Integrate with the configured local Ollama instance to generate summaries for successfully scraped article text and fetched comments. Persist these summaries locally. Implement a stage testing utility for summarization.

## Story List

### Story 4.1: Implement Ollama Client Module

-   **User Story / Goal:** As a developer, I want a client module to interact with the configured Ollama API endpoint via HTTP, handling requests and responses for text generation, so that summaries can be generated programmatically.
-   **Detailed Requirements:**
    -   **Prerequisite:** Ensure a local Ollama instance is installed and running, accessible via the URL defined in `.env` (`OLLAMA_ENDPOINT_URL`), and that the model specified in `.env` (`OLLAMA_MODEL`) has been downloaded (e.g., via `ollama pull model_name`). Instructions for this setup should be in the project README.
    -   Create a new module: `src/clients/ollamaClient.ts`.
    -   Implement an async function `generateSummary(promptTemplate: string, content: string): Promise<string | null>`. *(Note: Parameter name changed for clarity)*
    -   Add configuration variables `OLLAMA_ENDPOINT_URL` (e.g., `http://localhost:11434`) and `OLLAMA_MODEL` (e.g., `llama3`) to `.env.example`. Ensure they are loaded via the config module (`src/utils/config.ts`). Update local `.env` with actual values. Add optional `OLLAMA_TIMEOUT_MS` to `.env.example` with a default like `120000`.
    -   Inside `generateSummary`:
        -   Construct the full prompt string using the `promptTemplate` and the provided `content` (e.g., replacing a placeholder like `{Content Placeholder}` in the template, or simple concatenation if templates are basic).
        -   Construct the Ollama API request payload (JSON): `{ model: configured_model, prompt: full_prompt, stream: false }`. Refer to Ollama `/api/generate` documentation and `docs/data-models.md`.
        -   Use native `Workspace` to send a POST request to the configured Ollama endpoint + `/api/generate`. Set appropriate headers (`Content-Type: application/json`). Use the configured `OLLAMA_TIMEOUT_MS` or a reasonable default (e.g., 2 minutes).
        -   Handle `Workspace` errors (network, timeout) using `try...catch`.
        -   Check `response.ok`. If not OK, log the status/error and return `null`.
        -   Parse the JSON response from Ollama. Extract the generated text (typically in the `response` field). Refer to `docs/data-models.md`.
        -   Check for potential errors within the Ollama response structure itself (e.g., an `error` field).
        -   Return the extracted summary string on success. Return `null` on any failure.
        -   Log key events: initiating request (mention model), receiving response, success, failure reasons, potentially request/response time using the logger.
    -   Define necessary TypeScript types for the Ollama request payload and expected response structure in `src/types/ollama.ts` (referenced in `docs/data-models.md`).
-   **Acceptance Criteria (ACs):**
    -   AC1: The `ollamaClient.ts` module exists and exports `generateSummary`.
    -   AC2: `OLLAMA_ENDPOINT_URL` and `OLLAMA_MODEL` are defined in `.env.example`, loaded via config, and used by the client. Optional `OLLAMA_TIMEOUT_MS` is handled.
    -   AC3: `generateSummary` sends a correctly formatted POST request (model, full prompt based on template and content, stream:false) to the configured Ollama endpoint/path using native `Workspace`.
    -   AC4: Network errors, timeouts, and non-OK API responses are handled gracefully, logged, and result in a `null` return (given the Prerequisite Ollama service is running).
    -   AC5: A successful Ollama response is parsed correctly, the generated text is extracted, and returned as a string.
    * AC6: Unexpected Ollama response formats or internal errors (e.g., `{"error": "..."}`) are handled, logged, and result in a `null` return.
    * AC7: Logs provide visibility into the client's interaction with the Ollama API.

---

### Story 4.2: Define Summarization Prompts

* **User Story / Goal:** As a developer, I want standardized base prompts for generating article summaries and HN discussion summaries documented centrally, ensuring consistent instructions are sent to the LLM.
* **Detailed Requirements:**
    * Define two standardized base prompts (`ARTICLE_SUMMARY_PROMPT`, `DISCUSSION_SUMMARY_PROMPT`) **and document them in `docs/prompts.md`**.
    * Ensure these prompts are accessible within the application code, for example, by defining them as exported constants in a dedicated module like `src/utils/prompts.ts`, which reads from or mirrors the content in `docs/prompts.md`.
* **Acceptance Criteria (ACs):**
    * AC1: The `ARTICLE_SUMMARY_PROMPT` text is defined in `docs/prompts.md` with appropriate instructional content.
    * AC2: The `DISCUSSION_SUMMARY_PROMPT` text is defined in `docs/prompts.md` with appropriate instructional content.
    * AC3: The prompt texts documented in `docs/prompts.md` are available as constants or variables within the application code (e.g., via `src/utils/prompts.ts`) for use by the Ollama client integration.

---

### Story 4.3: Integrate Summarization into Main Workflow

* **User Story / Goal:** As a developer, I want to integrate the Ollama client into the main workflow to generate summaries for each story's scraped article text (if available) and fetched comments, using centrally defined prompts and handling potential comment length limits.
* **Detailed Requirements:**
    * Modify the main execution flow in `src/index.ts` or `src/core/pipeline.ts`.
    * Import `ollamaClient.generateSummary` and the prompt constants/variables (e.g., from `src/utils/prompts.ts`, which reflect `docs/prompts.md`).
    * Load the optional `MAX_COMMENT_CHARS_FOR_SUMMARY` configuration value from `.env` via the config utility.
    * Within the main loop iterating through stories (after article scraping/persistence in Epic 3):
    * **Article Summary Generation:**
        * Check if the `story` object has non-null `articleContent`.
        * If yes: log "Attempting article summarization for story {storyId}", call `await generateSummary(ARTICLE_SUMMARY_PROMPT, story.articleContent)`, store the result (string or null) as `story.articleSummary`, log success/failure.
        * If no: set `story.articleSummary = null`, log "Skipping article summarization: No content".
    * **Discussion Summary Generation:**
        * Check if the `story` object has a non-empty `comments` array.
        * If yes:
            * Format the `story.comments` array into a single text block suitable for the LLM prompt (e.g., concatenating `comment.text` with separators like `---`).
            * **Check truncation limit:** If `MAX_COMMENT_CHARS_FOR_SUMMARY` is configured to a positive number and the `formattedCommentsText` length exceeds it, truncate `formattedCommentsText` to the limit and log a warning: "Comment text truncated to {limit} characters for summarization for story {storyId}".
            * Log "Attempting discussion summarization for story {storyId}".
            * Call `await generateSummary(DISCUSSION_SUMMARY_PROMPT, formattedCommentsText)`. *(Pass the potentially truncated text)*
            * Store the result (string or null) as `story.discussionSummary`. Log success/failure.
        * If no: set `story.discussionSummary = null`, log "Skipping discussion summarization: No comments".
* **Acceptance Criteria (ACs):**
    * AC1: Running `npm run dev` executes steps from Epics 1-3, then attempts summarization using the Ollama client.
    * AC2: Article summary is attempted only if `articleContent` exists for a story.
    * AC3: Discussion summary is attempted only if `comments` exist for a story.
    * AC4: `generateSummary` is called with the correct prompts (sourced consistently with `docs/prompts.md`) and corresponding content (article text or formatted/potentially truncated comments).
    * AC5: If `MAX_COMMENT_CHARS_FOR_SUMMARY` is set and comment text exceeds it, the text passed to `generateSummary` is truncated, and a warning is logged.
    * AC6: Logs clearly indicate the start, success, or failure (including null returns from the client) for both article and discussion summarization attempts per story.
    * AC7: Story objects in memory now contain `articleSummary` (string/null) and `discussionSummary` (string/null) properties.

---

### Story 4.4: Persist Generated Summaries Locally

*(No changes needed for this story based on recent decisions)*

-   **User Story / Goal:** As a developer, I want to save the generated article and discussion summaries (or null placeholders) to a local JSON file for each story, making them available for the email assembly stage.
-   **Detailed Requirements:**
    -   Define the structure for the summary output file: `{storyId}_summary.json`. Content example: `{ "storyId": "...", "articleSummary": "...", "discussionSummary": "...", "summarizedAt": "ISO_TIMESTAMP" }`. Note that `articleSummary` and `discussionSummary` can be `null`.
    -   Import `fs` and `path` in `src/index.ts` or `src/core/pipeline.ts` if needed.
    -   In the main workflow loop, after *both* summarization attempts (article and discussion) for a story are complete:
        -   Create a summary result object containing `storyId`, `articleSummary` (string or null), `discussionSummary` (string or null), and the current ISO timestamp (`new Date().toISOString()`). Add this timestamp to the in-memory `story` object as well (`story.summarizedAt`).
        -   Get the full path to the date-stamped output directory.
        -   Construct the filename: `{storyId}_summary.json`.
        -   Construct the full file path using `path.join()`.
        -   Serialize the summary result object to JSON (`JSON.stringify(..., null, 2)`).
        -   Use `fs.writeFileSync` to save the JSON to the file, wrapping in `try...catch`.
        -   Log the successful saving of the summary file or any file writing errors.
-   **Acceptance Criteria (ACs):**
    -   AC1: After running `npm run dev`, the date-stamped output directory contains 10 files named `{storyId}_summary.json`.
    -   AC2: Each `_summary.json` file contains valid JSON adhering to the defined structure.
    -   AC3: The `articleSummary` field contains the generated summary string if successful, otherwise `null`.
    -   AC4: The `discussionSummary` field contains the generated summary string if successful, otherwise `null`.
    -   AC5: A valid ISO timestamp is present in the `summarizedAt` field.
    -   AC6: Logs confirm successful writing of each summary file or report file system errors.

---

### Story 4.5: Implement Stage Testing Utility for Summarization

*(Changes needed to reflect prompt sourcing and optional truncation)*

* **User Story / Goal:** As a developer, I want a separate script/command to test the LLM summarization logic using locally persisted data (HN comments, scraped article text), allowing independent testing of prompts and Ollama interaction.
* **Detailed Requirements:**
    * Create a new standalone script file: `src/stages/summarize_content.ts`.
    * Import necessary modules: `fs`, `path`, `logger`, `config`, `ollamaClient`, prompt constants (e.g., from `src/utils/prompts.ts`).
    * The script should:
        * Initialize logger, load configuration (Ollama endpoint/model, output dir, **optional `MAX_COMMENT_CHARS_FOR_SUMMARY`**).
        * Determine target date-stamped directory path.
        * Find all `{storyId}_data.json` files in the directory.
        * For each `storyId` found:
            * Read `{storyId}_data.json` to get comments. Format them into a single text block.
            * *Attempt* to read `{storyId}_article.txt`. Handle file-not-found gracefully. Store content or null.
            * Call `ollamaClient.generateSummary` for article text (if not null) using `ARTICLE_SUMMARY_PROMPT`.
            * **Apply truncation logic:** If comments exist, check `MAX_COMMENT_CHARS_FOR_SUMMARY` and truncate the formatted comment text block if needed, logging a warning.
            * Call `ollamaClient.generateSummary` for formatted comments (if comments exist) using `DISCUSSION_SUMMARY_PROMPT` *(passing potentially truncated text)*.
            * Construct the summary result object (with summaries or nulls, and timestamp).
            * Save the result object to `{storyId}_summary.json` in the same directory (using logic from Story 4.4), overwriting if exists.
            * Log progress (reading files, calling Ollama, truncation warnings, saving results) for each story ID.
    * Add script to `package.json`: `"stage:summarize": "ts-node src/stages/summarize_content.ts"`.
* **Acceptance Criteria (ACs):**
    * AC1: The file `src/stages/summarize_content.ts` exists.
    * AC2: The script `stage:summarize` is defined in `package.json`.
    * AC3: Running `npm run stage:summarize` (after `stage:fetch` and `stage:scrape` runs) reads `_data.json` and attempts to read `_article.txt` files from the target directory.
    * AC4: The script calls the `ollamaClient` with correct prompts (sourced consistently with `docs/prompts.md`) and content derived *only* from the local files (requires Ollama service running per Story 4.1 prerequisite).
    * AC5: If `MAX_COMMENT_CHARS_FOR_SUMMARY` is set and applicable, comment text is truncated before calling the client, and a warning is logged.
    * AC6: The script creates/updates `{storyId}_summary.json` files in the target directory reflecting the results of the Ollama calls (summaries or nulls).
    * AC7: Logs show the script processing each story ID found locally, interacting with Ollama, and saving results.
    * AC8: The script does not call Algolia API or the article scraper module.

## Change Log

| Change                      | Date         | Version | Description                          | Author         |
| --------------------------- | ------------ | ------- | ------------------------------------ | -------------- |
| Integrate prompts.md refs   | 2025-05-04   | 0.3     | Updated stories 4.2, 4.3, 4.5        | 3-Architect    |
| Added Ollama Prereq Note    | 2025-05-04   | 0.2     | Added note about local Ollama setup  | 2-pm           |
| Initial Draft               | 2025-05-04   | 0.1     | First draft of Epic 4                | 2-pm           |