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