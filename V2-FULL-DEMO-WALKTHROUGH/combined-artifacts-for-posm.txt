# Epic 1 file

# Epic 1: Project Initialization & Core Setup

**Goal:** Initialize the project using the "bmad-boilerplate", manage dependencies, setup `.env` and config loading, establish basic CLI entry point, setup basic logging and output directory structure. This provides the foundational setup for all subsequent development work.

## Story List

### Story 1.1: Initialize Project from Boilerplate

-   **User Story / Goal:** As a developer, I want to set up the initial project structure using the `bmad-boilerplate`, so that I have the standard tooling (TS, Jest, ESLint, Prettier), configurations, and scripts in place.
-   **Detailed Requirements:**
    -   Copy or clone the contents of the `bmad-boilerplate` into the new project's root directory.
    -   Initialize a git repository in the project root directory (if not already done by cloning).
    -   Ensure the `.gitignore` file from the boilerplate is present.
    -   Run `npm install` to download and install all `devDependencies` specified in the boilerplate's `package.json`.
    -   Verify that the core boilerplate scripts (`lint`, `format`, `test`, `build`) execute without errors on the initial codebase.
-   **Acceptance Criteria (ACs):**
    -   AC1: The project directory contains the files and structure from `bmad-boilerplate`.
    -   AC2: A `node_modules` directory exists and contains packages corresponding to `devDependencies`.
    -   AC3: `npm run lint` command completes successfully without reporting any linting errors.
    -   AC4: `npm run format` command completes successfully, potentially making formatting changes according to Prettier rules. Running it a second time should result in no changes.
    -   AC5: `npm run test` command executes Jest successfully (it may report "no tests found" which is acceptable at this stage).
    -   AC6: `npm run build` command executes successfully, creating a `dist` directory containing compiled JavaScript output.
    -   AC7: The `.gitignore` file exists and includes entries for `node_modules/`, `.env`, `dist/`, etc. as specified in the boilerplate.

---

### Story 1.2: Setup Environment Configuration

-   **User Story / Goal:** As a developer, I want to establish the environment configuration mechanism using `.env` files, so that secrets and settings (like output paths) can be managed outside of version control, following boilerplate conventions.
-   **Detailed Requirements:**
    -   Add a production dependency for loading `.env` files (e.g., `dotenv`). Run `npm install dotenv --save-prod` (or similar library).
    -   Verify the `.env.example` file exists (from boilerplate).
    -   Add an initial configuration variable `OUTPUT_DIR_PATH=./output` to `.env.example`.
    -   Create the `.env` file locally by copying `.env.example`. Populate `OUTPUT_DIR_PATH` if needed (can keep default).
    -   Implement a utility module (e.g., `src/config.ts`) that loads environment variables from the `.env` file at application startup.
    -   The utility should export the loaded configuration values (initially just `OUTPUT_DIR_PATH`).
    -   Ensure the `.env` file is listed in `.gitignore` and is not committed.
-   **Acceptance Criteria (ACs):**
    -   AC1: The chosen `.env` library (e.g., `dotenv`) is listed under `dependencies` in `package.json` and `package-lock.json` is updated.
    -   AC2: The `.env.example` file exists, is tracked by git, and contains the line `OUTPUT_DIR_PATH=./output`.
    -   AC3: The `.env` file exists locally but is NOT tracked by git.
    -   AC4: A configuration module (`src/config.ts` or similar) exists and successfully loads the `OUTPUT_DIR_PATH` value from `.env` when the application starts.
    -   AC5: The loaded `OUTPUT_DIR_PATH` value is accessible within the application code.

---

### Story 1.3: Implement Basic CLI Entry Point & Execution

-   **User Story / Goal:** As a developer, I want a basic `src/index.ts` entry point that can be executed via the boilerplate's `dev` and `start` scripts, providing a working foundation for the application logic.
-   **Detailed Requirements:**
    -   Create the main application entry point file at `src/index.ts`.
    -   Implement minimal code within `src/index.ts` to:
        -   Import the configuration loading mechanism (from Story 1.2).
        -   Log a simple startup message to the console (e.g., "BMad Hacker Daily Digest - Starting Up...").
        -   (Optional) Log the loaded `OUTPUT_DIR_PATH` to verify config loading.
    -   Confirm execution using boilerplate scripts.
-   **Acceptance Criteria (ACs):**
    -   AC1: The `src/index.ts` file exists.
    -   AC2: Running `npm run dev` executes `src/index.ts` via `ts-node` and logs the startup message to the console.
    -   AC3: Running `npm run build` successfully compiles `src/index.ts` (and any imports) into the `dist` directory.
    -   AC4: Running `npm start` (after a successful build) executes the compiled code from `dist` and logs the startup message to the console.

---

### Story 1.4: Setup Basic Logging and Output Directory

-   **User Story / Goal:** As a developer, I want a basic console logging mechanism and the dynamic creation of a date-stamped output directory, so that the application can provide execution feedback and prepare for storing data artifacts in subsequent epics.
-   **Detailed Requirements:**
    -   Implement a simple, reusable logging utility module (e.g., `src/logger.ts`). Initially, it can wrap `console.log`, `console.warn`, `console.error`.
    -   Refactor `src/index.ts` to use this `logger` for its startup message(s).
    -   In `src/index.ts` (or a setup function called by it):
        -   Retrieve the `OUTPUT_DIR_PATH` from the configuration (loaded in Story 1.2).
        -   Determine the current date in 'YYYY-MM-DD' format.
        -   Construct the full path for the date-stamped subdirectory (e.g., `${OUTPUT_DIR_PATH}/YYYY-MM-DD`).
        -   Check if the base output directory exists; if not, create it.
        -   Check if the date-stamped subdirectory exists; if not, create it recursively. Use Node.js `fs` module (e.g., `fs.mkdirSync(path, { recursive: true })`).
        -   Log (using the logger) the full path of the output directory being used for the current run (e.g., "Output directory for this run: ./output/2025-05-04").
-   **Acceptance Criteria (ACs):**
    -   AC1: A logger utility module (`src/logger.ts` or similar) exists and is used for console output in `src/index.ts`.
    -   AC2: Running `npm run dev` or `npm start` logs the startup message via the logger.
    -   AC3: Running the application creates the base output directory (e.g., `./output` defined in `.env`) if it doesn't already exist.
    -   AC4: Running the application creates a date-stamped subdirectory (e.g., `./output/2025-05-04`) within the base output directory if it doesn't already exist.
    -   AC5: The application logs a message indicating the full path to the date-stamped output directory created/used for the current execution.
    -   AC6: The application exits gracefully after performing these setup steps (for now).

## Change Log

| Change        | Date       | Version | Description               | Author         |
| ------------- | ---------- | ------- | ------------------------- | -------------- |
| Initial Draft | 2025-05-04 | 0.1     | First draft of Epic 1     | 2-pm           |

# Epic 2 File

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

# Epic 3 File

# Epic 3: Article Scraping & Persistence

**Goal:** Implement a best-effort article scraping mechanism to fetch and extract plain text content from the external URLs associated with fetched HN stories. Handle failures gracefully and persist successfully scraped text locally. Implement a stage testing utility for scraping.

## Story List

### Story 3.1: Implement Basic Article Scraper Module

-   **User Story / Goal:** As a developer, I want a module that attempts to fetch HTML from a URL and extract the main article text using basic methods, handling common failures gracefully, so article content can be prepared for summarization.
-   **Detailed Requirements:**
    -   Create a new module: `src/scraper/articleScraper.ts`.
    -   Add a suitable HTML parsing/extraction library dependency (e.g., `@extractus/article-extractor` recommended for simplicity, or `cheerio` for more control). Run `npm install @extractus/article-extractor --save-prod` (or chosen alternative).
    -   Implement an async function `scrapeArticle(url: string): Promise<string | null>` within the module.
    -   Inside the function:
        -   Use native `Workspace` to retrieve content from the `url`. Set a reasonable timeout (e.g., 10-15 seconds). Include a `User-Agent` header to mimic a browser.
        -   Handle potential `Workspace` errors (network errors, timeouts) using `try...catch`.
        -   Check the `response.ok` status. If not okay, log error and return `null`.
        -   Check the `Content-Type` header of the response. If it doesn't indicate HTML (e.g., does not include `text/html`), log warning and return `null`.
        -   If HTML is received, attempt to extract the main article text using the chosen library (`article-extractor` preferred).
        -   Wrap the extraction logic in a `try...catch` to handle library-specific errors.
        -   Return the extracted plain text string if successful. Ensure it's just text, not HTML markup.
        -   Return `null` if extraction fails or results in empty content.
    -   Log all significant events, errors, or reasons for returning null (e.g., "Scraping URL...", "Fetch failed:", "Non-HTML content type:", "Extraction failed:", "Successfully extracted text") using the logger utility.
    -   Define TypeScript types/interfaces as needed.
-   **Acceptance Criteria (ACs):**
    -   AC1: The `articleScraper.ts` module exists and exports the `scrapeArticle` function.
    -   AC2: The chosen scraping library (e.g., `@extractus/article-extractor`) is added to `dependencies` in `package.json`.
    -   AC3: `scrapeArticle` uses native `Workspace` with a timeout and User-Agent header.
    -   AC4: `scrapeArticle` correctly handles fetch errors, non-OK responses, and non-HTML content types by logging and returning `null`.
    -   AC5: `scrapeArticle` uses the chosen library to attempt text extraction from valid HTML content.
    -   AC6: `scrapeArticle` returns the extracted plain text on success, and `null` on any failure (fetch, non-HTML, extraction error, empty result).
    -   AC7: Relevant logs are produced for success, failure modes, and errors encountered during the process.

---

### Story 3.2: Integrate Article Scraping into Main Workflow

-   **User Story / Goal:** As a developer, I want to integrate the article scraper into the main workflow (`src/index.ts`), attempting to scrape the article for each HN story that has a valid URL, after fetching its data.
-   **Detailed Requirements:**
    -   Modify the main execution flow in `src/index.ts`.
    -   Import the `scrapeArticle` function from `src/scraper/articleScraper.ts`.
    -   Within the main loop iterating through the fetched stories (after comments are fetched in Epic 2):
        -   Check if `story.url` exists and appears to be a valid HTTP/HTTPS URL. A simple check for starting with `http://` or `https://` is sufficient.
        -   If the URL is missing or invalid, log a warning ("Skipping scraping for story {storyId}: Missing or invalid URL") and proceed to the next story's processing step.
        -   If a valid URL exists, log ("Attempting to scrape article for story {storyId} from {story.url}").
        -   Call `await scrapeArticle(story.url)`.
        -   Store the result (the extracted text string or `null`) in memory, associated with the story object (e.g., add property `articleContent: string | null`).
        -   Log the outcome clearly (e.g., "Successfully scraped article for story {storyId}", "Failed to scrape article for story {storyId}").
-   **Acceptance Criteria (ACs):**
    -   AC1: Running `npm run dev` executes Epic 1 & 2 steps, and then attempts article scraping for stories with valid URLs.
    -   AC2: Stories with missing or invalid URLs are skipped, and a corresponding log message is generated.
    -   AC3: For stories with valid URLs, the `scrapeArticle` function is called.
    -   AC4: Logs clearly indicate the start and success/failure outcome of the scraping attempt for each relevant story.
    -   AC5: Story objects held in memory after this stage contain an `articleContent` property holding the scraped text (string) or `null` if scraping was skipped or failed.

---

### Story 3.3: Persist Scraped Article Text Locally

-   **User Story / Goal:** As a developer, I want to save successfully scraped article text to a separate local file for each story, so that the text content is available as input for the summarization stage.
-   **Detailed Requirements:**
    -   Import Node.js `fs` and `path` modules if not already present in `src/index.ts`.
    -   In the main workflow (`src/index.ts`), immediately after a successful call to `scrapeArticle` for a story (where the result is a non-null string):
        -   Retrieve the full path to the current date-stamped output directory.
        -   Construct the filename: `{storyId}_article.txt`.
        -   Construct the full file path using `path.join()`.
        -   Get the successfully scraped article text string (`articleContent`).
        -   Use `fs.writeFileSync(fullPath, articleContent, 'utf-8')` to save the text to the file. Wrap in `try...catch` for file system errors.
        -   Log the successful saving of the file (e.g., "Saved scraped article text to {filename}") or any file writing errors encountered.
    -   Ensure *no* `_article.txt` file is created if `scrapeArticle` returned `null` (due to skipping or failure).
-   **Acceptance Criteria (ACs):**
    -   AC1: After running `npm run dev`, the date-stamped output directory contains `_article.txt` files *only* for those stories where `scrapeArticle` succeeded and returned text content.
    -   AC2: The name of each article text file is `{storyId}_article.txt`.
    -   AC3: The content of each `_article.txt` file is the plain text string returned by `scrapeArticle`.
    -   AC4: Logs confirm the successful writing of each `_article.txt` file or report specific file writing errors.
    -   AC5: No empty `_article.txt` files are created. Files only exist if scraping was successful.

---

### Story 3.4: Implement Stage Testing Utility for Scraping

-   **User Story / Goal:** As a developer, I want a separate script/command to test the article scraping logic using HN story data from local files, allowing independent testing and debugging of the scraper.
-   **Detailed Requirements:**
    -   Create a new standalone script file: `src/stages/scrape_articles.ts`.
    -   Import necessary modules: `fs`, `path`, `logger`, `config`, `scrapeArticle`.
    -   The script should:
        -   Initialize the logger.
        -   Load configuration (to get `OUTPUT_DIR_PATH`).
        -   Determine the target date-stamped directory path (e.g., `${OUTPUT_DIR_PATH}/YYYY-MM-DD`, using the current date or potentially an optional CLI argument). Ensure this directory exists.
        -   Read the directory contents and identify all `{storyId}_data.json` files.
        -   For each `_data.json` file found:
            -   Read and parse the JSON content.
            -   Extract the `storyId` and `url`.
            -   If a valid `url` exists, call `await scrapeArticle(url)`.
            -   If scraping succeeds (returns text), save the text to `{storyId}_article.txt` in the same directory (using logic from Story 3.3). Overwrite if the file exists.
            -   Log the progress and outcome (skip/success/fail) for each story processed.
    -   Add a new script command to `package.json`: `"stage:scrape": "ts-node src/stages/scrape_articles.ts"`. Consider adding argument parsing later if needed to specify a date/directory.
-   **Acceptance Criteria (ACs):**
    -   AC1: The file `src/stages/scrape_articles.ts` exists.
    -   AC2: The script `stage:scrape` is defined in `package.json`.
    -   AC3: Running `npm run stage:scrape` (assuming a directory with `_data.json` files exists from a previous `stage:fetch` run) reads these files.
    -   AC4: The script calls `scrapeArticle` for stories with valid URLs found in the JSON files.
    -   AC5: The script creates/updates `{storyId}_article.txt` files in the target directory corresponding to successfully scraped articles.
    -   AC6: The script logs its actions (reading files, attempting scraping, saving results) for each story ID processed.
    -   AC7: The script operates solely based on local `_data.json` files and fetching from external article URLs; it does not call the Algolia HN API.

## Change Log

| Change        | Date       | Version | Description               | Author         |
| ------------- | ---------- | ------- | ------------------------- | -------------- |
| Initial Draft | 2025-05-04 | 0.1     | First draft of Epic 3     | 2-pm           |

# Epic 4 File

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

# Epic 5 File

# Epic 5: Digest Assembly & Email Dispatch

**Goal:** Assemble the collected story data and summaries from local files, format them into a readable HTML email digest, and send the email using Nodemailer with configured credentials. Implement a stage testing utility for emailing with a dry-run option.

## Story List

### Story 5.1: Implement Email Content Assembler

-   **User Story / Goal:** As a developer, I want a module that reads the persisted story metadata (`_data.json`) and summaries (`_summary.json`) from a specified directory, consolidating the necessary information needed to render the email digest.
-   **Detailed Requirements:**
    -   Create a new module: `src/email/contentAssembler.ts`.
    -   Define a TypeScript type/interface `DigestData` representing the data needed per story for the email template: `{ storyId: string, title: string, hnUrl: string, articleUrl: string | null, articleSummary: string | null, discussionSummary: string | null }`.
    -   Implement an async function `assembleDigestData(dateDirPath: string): Promise<DigestData[]>`.
    -   The function should:
        -   Use Node.js `fs` to read the contents of the `dateDirPath`.
        -   Identify all files matching the pattern `{storyId}_data.json`.
        -   For each `storyId` found:
            -   Read and parse the `{storyId}_data.json` file. Extract `title`, `hnUrl`, and `url` (use as `articleUrl`). Handle potential file read/parse errors gracefully (log and skip story).
            -   Attempt to read and parse the corresponding `{storyId}_summary.json` file. Handle file-not-found or parse errors gracefully (treat `articleSummary` and `discussionSummary` as `null`).
            -   Construct a `DigestData` object for the story, including the extracted metadata and summaries (or nulls).
        -   Collect all successfully constructed `DigestData` objects into an array.
        -   Return the array. It should ideally contain 10 items if all previous stages succeeded.
    -   Log progress (e.g., "Assembling digest data from directory...", "Processing story {storyId}...") and any errors encountered during file processing using the logger.
-   **Acceptance Criteria (ACs):**
    -   AC1: The `contentAssembler.ts` module exists and exports `assembleDigestData` and the `DigestData` type.
    -   AC2: `assembleDigestData` correctly reads `_data.json` files from the provided directory path.
    -   AC3: It attempts to read corresponding `_summary.json` files, correctly handling cases where the summary file might be missing or unparseable (resulting in null summaries for that story).
    -   AC4: The function returns a promise resolving to an array of `DigestData` objects, populated with data extracted from the files.
    -   AC5: Errors during file reading or JSON parsing are logged, and the function returns data for successfully processed stories.

---

### Story 5.2: Create HTML Email Template & Renderer

-   **User Story / Goal:** As a developer, I want a basic HTML email template and a function to render it with the assembled digest data, producing the final HTML content for the email body.
-   **Detailed Requirements:**
    -   Define the HTML structure. This can be done using template literals within a function or potentially using a simple template file (e.g., `src/email/templates/digestTemplate.html`) and `fs.readFileSync`. Template literals are simpler for MVP.
    -   Create a function `renderDigestHtml(data: DigestData[], digestDate: string): string` (e.g., in `src/email/contentAssembler.ts` or a new `templater.ts`).
    -   The function should generate an HTML string with:
        -   A suitable title in the body (e.g., `<h1>Hacker News Top 10 Summaries for ${digestDate}</h1>`).
        -   A loop through the `data` array.
        -   For each `story` in `data`:
            -   Display `<h2><a href="${story.articleUrl || story.hnUrl}">${story.title}</a></h2>`.
            -   Display `<p><a href="${story.hnUrl}">View HN Discussion</a></p>`.
            -   Conditionally display `<h3>Article Summary</h3><p>${story.articleSummary}</p>` *only if* `story.articleSummary` is not null/empty.
            -   Conditionally display `<h3>Discussion Summary</h3><p>${story.discussionSummary}</p>` *only if* `story.discussionSummary` is not null/empty.
            -   Include a separator (e.g., `<hr style="margin-top: 20px; margin-bottom: 20px;">`).
    -   Use basic inline CSS for minimal styling (margins, etc.) to ensure readability. Avoid complex layouts.
    -   Return the complete HTML document as a string.
-   **Acceptance Criteria (ACs):**
    -   AC1: A function `renderDigestHtml` exists that accepts the digest data array and a date string.
    -   AC2: The function returns a single, complete HTML string.
    -   AC3: The generated HTML includes a title with the date and correctly iterates through the story data.
    -   AC4: For each story, the HTML displays the linked title, HN link, and conditionally displays the article and discussion summaries with headings.
    -   AC5: Basic separators and margins are used for readability. The HTML is simple and likely to render reasonably in most email clients.

---

### Story 5.3: Implement Nodemailer Email Sender

-   **User Story / Goal:** As a developer, I want a module to send the generated HTML email using Nodemailer, configured with credentials stored securely in the environment file.
-   **Detailed Requirements:**
    -   Add Nodemailer dependencies: `npm install nodemailer @types/nodemailer --save-prod`.
    -   Add required configuration variables to `.env.example` (and local `.env`): `EMAIL_HOST`, `EMAIL_PORT` (e.g., 587), `EMAIL_SECURE` (e.g., `false` for STARTTLS on 587, `true` for 465), `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` (e.g., `"Your Name <you@example.com>"`), `EMAIL_RECIPIENTS` (comma-separated list).
    -   Create a new module: `src/email/emailSender.ts`.
    -   Implement an async function `sendDigestEmail(subject: string, htmlContent: string): Promise<boolean>`.
    -   Inside the function:
        -   Load the `EMAIL_*` variables from the config module.
        -   Create a Nodemailer transporter using `nodemailer.createTransport` with the loaded config (host, port, secure flag, auth: { user, pass }).
        -   Verify transporter configuration using `transporter.verify()` (optional but recommended). Log verification success/failure.
        -   Parse the `EMAIL_RECIPIENTS` string into an array or comma-separated string suitable for the `to` field.
        -   Define the `mailOptions`: `{ from: EMAIL_FROM, to: parsedRecipients, subject: subject, html: htmlContent }`.
        -   Call `await transporter.sendMail(mailOptions)`.
        -   If `sendMail` succeeds, log the success message including the `messageId` from the result. Return `true`.
        -   If `sendMail` fails (throws error), log the error using the logger. Return `false`.
-   **Acceptance Criteria (ACs):**
    -   AC1: `nodemailer` and `@types/nodemailer` dependencies are added.
    -   AC2: `EMAIL_*` variables are defined in `.env.example` and loaded from config.
    -   AC3: `emailSender.ts` module exists and exports `sendDigestEmail`.
    -   AC4: `sendDigestEmail` correctly creates a Nodemailer transporter using configuration from `.env`. Transporter verification is attempted (optional AC).
    -   AC5: The `to` field is correctly populated based on `EMAIL_RECIPIENTS`.
    -   AC6: `transporter.sendMail` is called with correct `from`, `to`, `subject`, and `html` options.
    -   AC7: Email sending success (including message ID) or failure is logged clearly.
    -   AC8: The function returns `true` on successful sending, `false` otherwise.

---

### Story 5.4: Integrate Email Assembly and Sending into Main Workflow

-   **User Story / Goal:** As a developer, I want the main application workflow (`src/index.ts`) to orchestrate the final steps: assembling digest data, rendering the HTML, and triggering the email send after all previous stages are complete.
-   **Detailed Requirements:**
    -   Modify the main execution flow in `src/index.ts`.
    -   Import `assembleDigestData`, `renderDigestHtml`, `sendDigestEmail`.
    -   Execute these steps *after* the main loop (where stories are fetched, scraped, summarized, and persisted) completes:
        -   Log "Starting final digest assembly and email dispatch...".
        -   Determine the path to the current date-stamped output directory.
        -   Call `const digestData = await assembleDigestData(dateDirPath)`.
        -   Check if `digestData` array is not empty.
            -   If yes:
                -   Get the current date string (e.g., 'YYYY-MM-DD').
                -   `const htmlContent = renderDigestHtml(digestData, currentDate)`.
                -   `const subject = \`BMad Hacker Daily Digest - ${currentDate}\``.
                -   `const emailSent = await sendDigestEmail(subject, htmlContent)`.
                -   Log the final outcome based on `emailSent` ("Digest email sent successfully." or "Failed to send digest email.").
            -   If no (`digestData` is empty or assembly failed):
                -   Log an error: "Failed to assemble digest data or no data found. Skipping email."
        -   Log "BMad Hacker Daily Digest process finished."
-   **Acceptance Criteria (ACs):**
    -   AC1: Running `npm run dev` executes all stages (Epics 1-4) and then proceeds to email assembly and sending.
    -   AC2: `assembleDigestData` is called correctly with the output directory path after other processing is done.
    -   AC3: If data is assembled, `renderDigestHtml` and `sendDigestEmail` are called with the correct data, subject, and HTML.
    -   AC4: The final success or failure of the email sending step is logged.
    -   AC5: If `assembleDigestData` returns no data, email sending is skipped, and an appropriate message is logged.
    -   AC6: The application logs a final completion message.

---

### Story 5.5: Implement Stage Testing Utility for Emailing

-   **User Story / Goal:** As a developer, I want a separate script/command to test the email assembly, rendering, and sending logic using persisted local data, including a crucial `--dry-run` option to prevent accidental email sending during tests.
-   **Detailed Requirements:**
    -   Add `yargs` dependency for argument parsing: `npm install yargs @types/yargs --save-dev`.
    -   Create a new standalone script file: `src/stages/send_digest.ts`.
    -   Import necessary modules: `fs`, `path`, `logger`, `config`, `assembleDigestData`, `renderDigestHtml`, `sendDigestEmail`, `yargs`.
    -   Use `yargs` to parse command-line arguments, specifically looking for a `--dry-run` boolean flag (defaulting to `false`). Allow an optional argument for specifying the date-stamped directory, otherwise default to current date.
    -   The script should:
        -   Initialize logger, load config.
        -   Determine the target date-stamped directory path (from arg or default). Log the target directory.
        -   Call `await assembleDigestData(dateDirPath)`.
        -   If data is assembled and not empty:
            -   Determine the date string for the subject/title.
            -   Call `renderDigestHtml(digestData, dateString)` to get HTML.
            -   Construct the subject string.
            -   Check the `dryRun` flag:
                -   If `true`: Log "DRY RUN enabled. Skipping actual email send.". Log the subject. Save the `htmlContent` to a file in the target directory (e.g., `_digest_preview.html`). Log that the preview file was saved.
                -   If `false`: Log "Live run: Attempting to send email...". Call `await sendDigestEmail(subject, htmlContent)`. Log success/failure based on the return value.
        -   If data assembly fails or is empty, log the error.
    -   Add script to `package.json`: `"stage:email": "ts-node src/stages/send_digest.ts --"`. The `--` allows passing arguments like `--dry-run`.
-   **Acceptance Criteria (ACs):**
    -   AC1: The file `src/stages/send_digest.ts` exists. `yargs` dependency is added.
    -   AC2: The script `stage:email` is defined in `package.json` allowing arguments.
    -   AC3: Running `npm run stage:email -- --dry-run` reads local data, renders HTML, logs the intent, saves `_digest_preview.html` locally, and does *not* call `sendDigestEmail`.
    -   AC4: Running `npm run stage:email` (without `--dry-run`) reads local data, renders HTML, and *does* call `sendDigestEmail`, logging the outcome.
    -   AC5: The script correctly identifies and acts upon the `--dry-run` flag.
    -   AC6: Logs clearly distinguish between dry runs and live runs and report success/failure.
    -   AC7: The script operates using only local files and the email configuration/service; it does not invoke prior pipeline stages (Algolia, scraping, Ollama).

## Change Log

| Change        | Date       | Version | Description               | Author         |
| ------------- | ---------- | ------- | ------------------------- | -------------- |
| Initial Draft | 2025-05-04 | 0.1     | First draft of Epic 5     | 2-pm           |

# END EPIC FILES