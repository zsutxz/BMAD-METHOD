Okay, remaining in **SM Mode**.

Generating the stories for **Epic 3: Article Scraping & Persistence**. This assumes that Epic 1 (project setup, config, logging, output dir) and Epic 2 (HN client implementation, data fetching integration, and local persistence of `{storyId}_data.json` files) are complete.

---

## **Stories Report: Epic 3**

**File: ai/stories/3.1.story.md**

```markdown
# Story 3.1: Implement Basic Article Scraper Module

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want a module that attempts to fetch HTML from a URL and extract the main article text using basic methods, handling common failures gracefully, so article content can be prepared for summarization. [220]

**Context:** This story introduces the article scraping capability. It creates a dedicated module (`src/scraper/articleScraper.ts`) responsible for fetching content from external article URLs (found in the `{storyId}_data.json` files from Epic 2) and extracting plain text. It emphasizes using native `Workspace` and a simple extraction library (`@extractus/article-extractor` is recommended [222, 873]), and crucially, handling failures robustly (timeouts, non-HTML content, extraction errors) as required by the PRD [723, 724, 741]. This module will be used by the main pipeline (Story 3.2) and the stage tester (Story 3.4). [47, 55, 60, 63, 65]

## Detailed Requirements

- Create a new module: `src/scraper/articleScraper.ts`. [221]
- Add `@extractus/article-extractor` dependency: `npm install @extractus/article-extractor --save-prod`. [222, 223, 873]
- Implement an async function `scrapeArticle(url: string): Promise<string | null>` within the module. [223, 224]
- Inside the function:
  - Use native `Workspace` [749] to retrieve content from the `url`. [224] Set a reasonable timeout (e.g., 15 seconds via `AbortSignal.timeout()`, configure via `SCRAPE_TIMEOUT_MS` [615] if needed). Include a `User-Agent` header (e.g., `"BMadHackerDigest/0.1"` or configurable via `SCRAPER_USER_AGENT` [629]). [225]
  - Handle potential `Workspace` errors (network errors, timeouts) using `try...catch`. Log error using logger (from Story 1.4) and return `null`. [226]
  - Check the `response.ok` status. If not okay, log error (including status code) and return `null`. [226, 227]
  - Check the `Content-Type` header of the response. If it doesn't indicate HTML (e.g., does not include `text/html`), log warning and return `null`. [227, 228]
  - If HTML is received (`response.text()`), attempt to extract the main article text using `@extractus/article-extractor`. [229]
  - Wrap the extraction logic (`await articleExtractor.extract(htmlContent)`) in a `try...catch` to handle library-specific errors. Log error and return `null` on failure. [230]
  - Return the extracted plain text (`article.content`) if successful and not empty. Ensure it's just text, not HTML markup. [231]
  - Return `null` if extraction fails or results in empty content. [232]
  - Log all significant events, errors, or reasons for returning null (e.g., "Scraping URL...", "Fetch failed:", "Non-OK status:", "Non-HTML content type:", "Extraction failed:", "Successfully extracted text for {url}") using the logger utility. [233]
- Define TypeScript types/interfaces as needed (though `article-extractor` types might suffice). [234]

## Acceptance Criteria (ACs)

- AC1: The `src/scraper/articleScraper.ts` module exists and exports the `scrapeArticle` function. [234]
- AC2: The `@extractus/article-extractor` library is added to `dependencies` in `package.json` and `package-lock.json` is updated. [235]
- AC3: `scrapeArticle` uses native `Workspace` with a timeout (default or configured) and a User-Agent header. [236]
- AC4: `scrapeArticle` correctly handles fetch errors (network, timeout), non-OK responses, and non-HTML content types by logging the specific reason and returning `null`. [237]
- AC5: `scrapeArticle` uses `@extractus/article-extractor` to attempt text extraction from valid HTML content fetched via `response.text()`. [238]
- AC6: `scrapeArticle` returns the extracted plain text string on success, and `null` on any failure (fetch, non-HTML, extraction error, empty result). [239]
- AC7: Relevant logs are produced using the logger for success, different failure modes, and errors encountered during the process. [240]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Create: `src/scraper/articleScraper.ts`.
  - Files to Modify: `package.json`, `package-lock.json`. Add optional env vars to `.env.example`.
  - _(Hint: See `docs/project-structure.md` [819] for scraper location)._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851], Native `Workspace` API [863].
  - `@extractus/article-extractor` library. [873]
  - Uses `logger` utility (Story 1.4).
  - Uses `config` utility (Story 1.2) if implementing configurable timeout/user-agent.
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - Native `Workspace(url, { signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': userAgent } })`. [225]
  - Check `response.ok`, `response.headers.get('Content-Type')`. [227, 228]
  - Get body as text: `await response.text()`. [229]
  - `@extractus/article-extractor`: `import articleExtractor from '@extractus/article-extractor'; const article = await articleExtractor.extract(htmlContent); return article?.content || null;` [229, 231]
- **Data Structures:**
  - Function signature: `scrapeArticle(url: string): Promise<string | null>`. [224]
  - Uses `article` object returned by extractor.
  - _(Hint: See `docs/data-models.md` [498-547])._
- **Environment Variables:**
  - Optional: `SCRAPE_TIMEOUT_MS` (default e.g., 15000). [615]
  - Optional: `SCRAPER_USER_AGENT` (default e.g., "BMadHackerDigest/0.1"). [629]
  - Load via `config.ts` if used.
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Use `async/await`.
  - Implement comprehensive `try...catch` blocks for `Workspace` and extraction. [226, 230]
  - Log errors and reasons for returning `null` clearly. [233]

## Tasks / Subtasks

- [ ] Run `npm install @extractus/article-extractor --save-prod`.
- [ ] Create `src/scraper/articleScraper.ts`.
- [ ] Import logger, (optionally config), and `articleExtractor`.
- [ ] Define the `scrapeArticle` async function accepting a `url`.
- [ ] Implement `try...catch` for the entire fetch/parse logic. Log error and return `null` in `catch`.
- [ ] Inside `try`:
  - [ ] Define timeout (default or from config).
  - [ ] Define User-Agent (default or from config).
  - [ ] Call native `Workspace` with URL, timeout signal, and User-Agent header.
  - [ ] Check `response.ok`. If not OK, log status and return `null`.
  - [ ] Check `Content-Type` header. If not HTML, log type and return `null`.
  - [ ] Get HTML content using `response.text()`.
  - [ ] Implement inner `try...catch` for extraction:
    - [ ] Call `await articleExtractor.extract(htmlContent)`.
    - [ ] Check if result (`article?.content`) is valid text. If yes, log success and return text.
    - [ ] If extraction failed or content is empty, log reason and return `null`.
    - [ ] In `catch` block for extraction, log error and return `null`.
- [ ] Add optional env vars `SCRAPE_TIMEOUT_MS` and `SCRAPER_USER_AGENT` to `.env.example`.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - Write unit tests for `src/scraper/articleScraper.ts`. [919]
  - Mock native `Workspace`. Test different scenarios:
    - Successful fetch (200 OK, HTML content type) -> Mock `articleExtractor` success -> Verify returned text [239].
    - Successful fetch -> Mock `articleExtractor` failure/empty content -> Verify `null` return and logs [239, 240].
    - Fetch returns non-OK status (e.g., 404, 500) -> Verify `null` return and logs [237, 240].
    - Fetch returns non-HTML content type -> Verify `null` return and logs [237, 240].
    - Fetch throws network error/timeout -> Verify `null` return and logs [237, 240].
  - Mock `@extractus/article-extractor` to simulate success and failure cases. [918]
  - Verify `Workspace` is called with the correct URL, User-Agent, and timeout signal [236].
- **Integration Tests:** N/A for this module itself. [921]
- **Manual/CLI Verification:** Tested indirectly via Story 3.2 execution and directly via Story 3.4 stage runner. [912]
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Implemented scraper module with @extractus/article-extractor and robust error handling.}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/3.2.story.md**

```markdown
# Story 3.2: Integrate Article Scraping into Main Workflow

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want to integrate the article scraper into the main workflow (`src/core/pipeline.ts`), attempting to scrape the article for each HN story that has a valid URL, after fetching its data. [241]

**Context:** This story connects the scraper module (`articleScraper.ts` from Story 3.1) into the main application pipeline (`src/core/pipeline.ts`) developed in Epic 2. It modifies the main loop over the fetched stories (which contain data loaded in Story 2.2) to include a call to `scrapeArticle` for stories that have an article URL. The result (scraped text or null) is then stored in memory, associated with the story object. [47, 78, 79]

## Detailed Requirements

- Modify the main execution flow in `src/core/pipeline.ts` (assuming logic moved here in Story 2.2). [242]
- Import the `scrapeArticle` function from `src/scraper/articleScraper.ts`. [243] Import the logger.
- Within the main loop iterating through the fetched `Story` objects (after comments are fetched in Story 2.2 and before persistence in Story 2.3):
  - Check if `story.articleUrl` exists and appears to be a valid HTTP/HTTPS URL. A simple check for starting with `http://` or `https://` is sufficient. [243, 244]
  - If the URL is missing or invalid, log a warning using the logger ("Skipping scraping for story {storyId}: Missing or invalid URL") and proceed to the next step for this story (e.g., summarization in Epic 4, or persistence in Story 3.3). Set an internal placeholder for scraped content to `null`. [245]
  - If a valid URL exists:
    - Log ("Attempting to scrape article for story {storyId} from {story.articleUrl}"). [246]
    - Call `await scrapeArticle(story.articleUrl)`. [247]
    - Store the result (the extracted text string or `null`) in memory, associated with the story object. Define/add property `articleContent: string | null` to the `Story` type in `src/types/hn.ts`. [247, 513]
    - Log the outcome clearly using the logger (e.g., "Successfully scraped article for story {storyId}", "Failed to scrape article for story {storyId}"). [248]

## Acceptance Criteria (ACs)

- AC1: Running `npm run dev` executes Epic 1 & 2 steps, and then attempts article scraping for stories with valid `articleUrl`s within the main pipeline loop. [249]
- AC2: Stories with missing or invalid `articleUrl`s are skipped by the scraping step, and a corresponding warning message is logged via the logger. [250]
- AC3: For stories with valid URLs, the `scrapeArticle` function from `src/scraper/articleScraper.ts` is called with the correct URL. [251]
- AC4: Logs (via logger) clearly indicate the start ("Attempting to scrape...") and the success/failure outcome of the scraping attempt for each relevant story. [252]
- AC5: Story objects held in memory after this stage contain an `articleContent` property holding the scraped text (string) or `null` if scraping was skipped or failed. [253] (Verify via debugger/logging).
- AC6: The `Story` type definition in `src/types/hn.ts` is updated to include the `articleContent: string | null` field. [513]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Modify: `src/core/pipeline.ts`, `src/types/hn.ts`.
  - _(Hint: See `docs/project-structure.md` [818, 821])._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851].
  - Uses `articleScraper.scrapeArticle` (Story 3.1), `logger` (Story 1.4).
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - Calls internal `scrapeArticle(url)`.
- **Data Structures:**
  - Operates on `Story[]` fetched in Epic 2.
  - Augment `Story` interface in `src/types/hn.ts` to include `articleContent: string | null`. [513]
  - Checks `story.articleUrl`.
  - _(Hint: See `docs/data-models.md` [506-517])._
- **Environment Variables:**
  - N/A directly, but `scrapeArticle` might use them (Story 3.1).
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Perform the URL check before calling the scraper. [244]
  - Clearly log skipping, attempt, success, failure for scraping. [245, 246, 248]
  - Ensure the `articleContent` property is always set (either to the result string or explicitly to `null`).

## Tasks / Subtasks

- [ ] Update `Story` type in `src/types/hn.ts` to include `articleContent: string | null`.
- [ ] Modify the main loop in `src/core/pipeline.ts` where stories are processed.
- [ ] Import `scrapeArticle` from `src/scraper/articleScraper.ts`.
- [ ] Import `logger`.
- [ ] Inside the loop (after comment fetching, before persistence steps):
  - [ ] Check if `story.articleUrl` exists and starts with `http`.
  - [ ] If invalid/missing:
    - [ ] Log warning message.
    - [ ] Set `story.articleContent = null`.
  - [ ] If valid:
    - [ ] Log attempt message.
    - [ ] Call `const scrapedContent = await scrapeArticle(story.articleUrl)`.
    - [ ] Set `story.articleContent = scrapedContent`.
    - [ ] Log success (if `scrapedContent` is not null) or failure (if `scrapedContent` is null).
- [ ] Add temporary logging or use debugger to verify `articleContent` property in story objects (AC5).

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - Unit test the modified pipeline logic in `src/core/pipeline.ts`. [916]
  - Mock the `scrapeArticle` function. [918]
  - Provide mock `Story` objects with and without valid `articleUrl`s.
  - Verify that `scrapeArticle` is called only for stories with valid URLs [251].
  - Verify that the correct URL is passed to `scrapeArticle`.
  - Verify that the return value (mocked text or mocked null) from `scrapeArticle` is correctly assigned to the `story.articleContent` property [253].
  - Verify that appropriate logs (skip warning, attempt, success/fail) are called based on the URL validity and mocked `scrapeArticle` result [250, 252].
- **Integration Tests:** Less emphasis here; Story 3.4 provides better integration testing for scraping. [921]
- **Manual/CLI Verification:** [912]
  - Run `npm run dev`.
  - Check console logs for "Attempting to scrape...", "Successfully scraped...", "Failed to scrape...", and "Skipping scraping..." messages [250, 252].
  - Use debugger or temporary logging to inspect `story.articleContent` values during or after the pipeline run [253].
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Integrated scraper call into pipeline. Updated Story type. Verified logic for handling valid/invalid URLs.}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/3.3.story.md**

```markdown
# Story 3.3: Persist Scraped Article Text Locally

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want to save successfully scraped article text to a separate local file for each story, so that the text content is available as input for the summarization stage. [254]

**Context:** This story adds the persistence step for the article content scraped in Story 3.2. Following a successful scrape (where `story.articleContent` is not null), this logic writes the plain text content to a `.txt` file (`{storyId}_article.txt`) within the date-stamped output directory created in Epic 1. This ensures the scraped text is available for the next stage (Summarization - Epic 4) even if the main script is run in stages or needs to be restarted. No file should be created if scraping failed or was skipped. [49, 734, 735]

## Detailed Requirements

- Import Node.js `fs` (`writeFileSync`) and `path` modules if not already present in `src/core/pipeline.ts`. [255] Import logger.
- In the main workflow (`src/core/pipeline.ts`), within the loop processing each story, _after_ the scraping attempt (Story 3.2) is complete: [256]
  - Check if `story.articleContent` is a non-null, non-empty string.
  - If yes (scraping was successful and yielded content):
    - Retrieve the full path to the current date-stamped output directory (available from setup). [256]
    - Construct the filename: `{storyId}_article.txt`. [257]
    - Construct the full file path using `path.join()`. [257]
    - Get the successfully scraped article text string (`story.articleContent`). [258]
    - Use `fs.writeFileSync(fullPath, story.articleContent, 'utf-8')` to save the text to the file. [259] Wrap this call in a `try...catch` block for file system errors. [260]
    - Log the successful saving of the file (e.g., "Saved scraped article text to {filename}") or any file writing errors encountered, using the logger. [260]
  - If `story.articleContent` is null or empty (scraping skipped or failed), ensure _no_ `_article.txt` file is created for this story. [261]

## Acceptance Criteria (ACs)

- AC1: After running `npm run dev`, the date-stamped output directory contains `_article.txt` files _only_ for those stories where `scrapeArticle` (from Story 3.1) succeeded and returned non-empty text content during the pipeline run (Story 3.2). [262]
- AC2: The name of each article text file is `{storyId}_article.txt`. [263]
- AC3: The content of each existing `_article.txt` file is the plain text string stored in `story.articleContent`. [264]
- AC4: Logs confirm the successful writing of each `_article.txt` file or report specific file writing errors. [265]
- AC5: No empty `_article.txt` files are created. Files only exist if scraping was successful and returned content. [266]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Modify: `src/core/pipeline.ts`.
  - _(Hint: See `docs/project-structure.md` [818])._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851].
  - Native `fs` module (`writeFileSync`). [259]
  - Native `path` module (`join`). [257]
  - Uses `logger` (Story 1.4).
  - Uses output directory path (from Story 1.4 logic).
  - Uses `story.articleContent` populated in Story 3.2.
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - `fs.writeFileSync(fullPath, articleContentString, 'utf-8')`. [259]
- **Data Structures:**
  - Checks `story.articleContent` (string | null).
  - Defines output file format `{storyId}_article.txt` [541].
  - _(Hint: See `docs/data-models.md` [506-517, 541])._
- **Environment Variables:**
  - Relies on `OUTPUT_DIR_PATH` being available (from Story 1.2/1.4).
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Place the file writing logic immediately after the scraping result is known for a story.
  - Use a clear `if (story.articleContent)` check. [256]
  - Use `try...catch` around `fs.writeFileSync`. [260]
  - Log success/failure clearly. [260]

## Tasks / Subtasks

- [ ] In `src/core/pipeline.ts`, ensure `fs` and `path` are imported. Ensure logger is imported.
- [ ] Ensure the output directory path is available within the story processing loop.
- [ ] Inside the loop, after `story.articleContent` is set (from Story 3.2):
  - [ ] Add an `if (story.articleContent)` condition.
  - [ ] Inside the `if` block:
    - [ ] Construct filename: `{storyId}_article.txt`.
    - [ ] Construct full path using `path.join`.
    - [ ] Implement `try...catch`:
      - [ ] `try`: Call `fs.writeFileSync(fullPath, story.articleContent, 'utf-8')`.
      - [ ] `try`: Log success message.
      - [ ] `catch`: Log error message.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** [915]
  - Difficult to unit test filesystem writes effectively. Focus on testing the _conditional logic_ within the pipeline function. [918]
  - Mock `fs.writeFileSync`. Provide mock `Story` objects where `articleContent` is sometimes a string and sometimes null.
  - Verify `fs.writeFileSync` is called _only when_ `articleContent` is a non-empty string. [262]
  - Verify it's called with the correct path (`path.join(outputDir, storyId + '_article.txt')`) and content (`story.articleContent`). [263, 264]
- **Integration Tests:** [921]
  - Use `mock-fs` or temporary directory setup/teardown. [924]
  - Run the pipeline segment responsible for scraping (mocked) and saving.
  - Verify that `.txt` files are created only for stories where the mocked scraper returned text.
  - Verify file contents match the mocked text.
- **Manual/CLI Verification:** [912]
  - Run `npm run dev`.
  - Inspect the `output/YYYY-MM-DD/` directory.
  - Check which `{storyId}_article.txt` files exist. Compare this against the console logs indicating successful/failed scraping attempts for corresponding story IDs. Verify files only exist for successful scrapes (AC1, AC5).
  - Check filenames are correct (AC2).
  - Open a few existing `.txt` files and spot-check the content (AC3).
  - Check logs for file saving success/error messages (AC4).
- _(Hint: See `docs/testing-strategy.md` [907-950] for the overall approach)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Added logic to save article text conditionally. Verified files are created only on successful scrape.}
- **Change Log:**
  - Initial Draft
```

---

**File: ai/stories/3.4.story.md**

```markdown
# Story 3.4: Implement Stage Testing Utility for Scraping

**Status:** Draft

## Goal & Context

**User Story:** As a developer, I want a separate script/command to test the article scraping logic using HN story data from local files, allowing independent testing and debugging of the scraper. [267]

**Context:** This story implements the standalone stage testing utility for Epic 3, as required by the PRD [736, 764]. It creates `src/stages/scrape_articles.ts`, which reads story data (specifically URLs) from the `{storyId}_data.json` files generated in Epic 2 (or by `stage:fetch`), calls the `scrapeArticle` function (from Story 3.1) for each URL, and persists any successfully scraped text to `{storyId}_article.txt` files (replicating Story 3.3 logic). This allows testing the scraping functionality against real websites using previously fetched story lists, without running the full pipeline or the HN fetching stage. [57, 63, 820, 912, 930]

## Detailed Requirements

- Create a new standalone script file: `src/stages/scrape_articles.ts`. [268]
- Import necessary modules: `fs` (e.g., `readdirSync`, `readFileSync`, `writeFileSync`, `existsSync`, `statSync`), `path`, `logger` (Story 1.4), `config` (Story 1.2), `scrapeArticle` (Story 3.1), date util (Story 1.4). [269]
- The script should:
  - Initialize the logger. [270]
  - Load configuration (to get `OUTPUT_DIR_PATH`). [271]
  - Determine the target date-stamped directory path (e.g., using current date via date util, or potentially allow override via CLI arg later - current date default is fine for now). [271] Ensure this base output directory exists. Log the target directory.
  - Check if the target date-stamped directory exists. If not, log an error and exit ("Directory {path} not found. Run fetch stage first?").
  - Read the directory contents and identify all files ending with `_data.json`. [272] Use `fs.readdirSync` and filter.
  - For each `_data.json` file found:
    - Construct the full path and read its content using `fs.readFileSync`. [273]
    - Parse the JSON content. Handle potential parse errors gracefully (log error, skip file). [273]
    - Extract the `storyId` and `articleUrl` from the parsed data. [274]
    - If a valid `articleUrl` exists (starts with `http`): [274]
      - Log the attempt: "Attempting scrape for story {storyId} from {url}...".
      - Call `await scrapeArticle(articleUrl)`. [274]
      - If scraping succeeds (returns a non-null string):
        - Construct the output filename `{storyId}_article.txt`. [275]
        - Construct the full output path. [275]
        - Save the text to the file using `fs.writeFileSync` (replicating logic from Story 3.3, including try/catch and logging). [275] Overwrite if the file exists. [276]
        - Log success outcome.
      - If scraping fails (`scrapeArticle` returns null):
        - Log failure outcome.
    - If `articleUrl` is missing or invalid:
      - Log skipping message.
  - Log overall completion: "Scraping stage finished processing {N} data files.".
- Add a new script command to `package.json`: `"stage:scrape": "ts-node src/stages/scrape_articles.ts"`. [277]

## Acceptance Criteria (ACs)

- AC1: The file `src/stages/scrape_articles.ts` exists. [279]
- AC2: The script `stage:scrape` is defined in `package.json`'s `scripts` section. [280]
- AC3: Running `npm run stage:scrape` (assuming a date-stamped directory with `_data.json` files exists from a previous fetch run) successfully reads these JSON files. [281]
- AC4: The script calls `scrapeArticle` for stories with valid `articleUrl`s found in the JSON files. [282]
- AC5: The script creates or updates `{storyId}_article.txt` files in the _same_ date-stamped directory, corresponding only to successfully scraped articles. [283]
- AC6: The script logs its actions (reading files, attempting scraping, skipping, saving results/failures) for each story ID processed based on the found `_data.json` files. [284]
- AC7: The script operates solely based on local `_data.json` files as input and fetching from external article URLs via `scrapeArticle`; it does not call the Algolia HN API client. [285, 286]

## Technical Implementation Context

**Guidance:** Use the following details for implementation. Refer to the linked `docs/` files for broader context if needed.

- **Relevant Files:**
  - Files to Create: `src/stages/scrape_articles.ts`.
  - Files to Modify: `package.json`.
  - _(Hint: See `docs/project-structure.md` [820] for stage runner location)._
- **Key Technologies:**
  - TypeScript [846], Node.js 22.x [851], `ts-node`.
  - Native `fs` module (`readdirSync`, `readFileSync`, `writeFileSync`, `existsSync`, `statSync`). [269]
  - Native `path` module. [269]
  - Uses `logger` (Story 1.4), `config` (Story 1.2), date util (Story 1.4), `scrapeArticle` (Story 3.1), persistence logic (Story 3.3).
  - _(Hint: See `docs/tech-stack.md` [839-905])._
- **API Interactions / SDK Usage:**
  - Calls internal `scrapeArticle(url)`.
  - Uses `fs` module extensively for reading directory, reading JSON, writing TXT.
- **Data Structures:**
  - Reads JSON structure from `_data.json` files [538-540]. Extracts `storyId`, `articleUrl`.
  - Creates `{storyId}_article.txt` files [541].
  - _(Hint: See `docs/data-models.md`)._
- **Environment Variables:**
  - Reads `OUTPUT_DIR_PATH` via `config.ts`. `scrapeArticle` might use others.
  - _(Hint: See `docs/environment-vars.md` [548-638])._
- **Coding Standards Notes:**
  - Structure script clearly (setup, read data files, loop, process/scrape/save).
  - Use `async/await` for `scrapeArticle`.
  - Implement robust error handling for file IO (reading dir, reading files, parsing JSON, writing files) using `try...catch` and logging.
  - Use logger for detailed progress reporting. [284]
  - Wrap main logic in an async IIFE or main function.

## Tasks / Subtasks

- [ ] Create `src/stages/scrape_articles.ts`.
- [ ] Add imports: `fs`, `path`, `logger`, `config`, `scrapeArticle`, date util.
- [ ] Implement setup: Init logger, load config, get output path, get target date-stamped path.
- [ ] Check if target date-stamped directory exists, log error and exit if not.
- [ ] Use `fs.readdirSync` to get list of files in the target directory.
- [ ] Filter the list to get only files ending in `_data.json`.
- [ ] Loop through the `_data.json` filenames:
  - [ ] Construct full path for the JSON file.
  - [ ] Use `try...catch` for reading and parsing the JSON file:
    - [ ] `try`: Read file (`fs.readFileSync`). Parse JSON (`JSON.parse`).
    - [ ] `catch`: Log error (read/parse), continue to next file.
  - [ ] Extract `storyId` and `articleUrl`.
  - [ ] Check if `articleUrl` is valid (starts with `http`).
  - [ ] If valid:
    - [ ] Log attempt.
    - [ ] Call `content = await scrapeArticle(articleUrl)`.
    - [ ] `if (content)`:
      - [ ] Construct `.txt` output path.
      - [ ] Use `try...catch` to write file (`fs.writeFileSync`). Log success/error.
    - [ ] `else`: Log scrape failure.
  - [ ] If URL invalid: Log skip.
- [ ] Log completion message.
- [ ] Add `"stage:scrape": "ts-node src/stages/scrape_articles.ts"` to `package.json`.

## Testing Requirements

**Guidance:** Verify implementation against the ACs using the following tests.

- **Unit Tests:** Difficult to unit test the entire script effectively due to heavy FS and orchestration logic. Focus on unit testing the core `scrapeArticle` module (Story 3.1) and utilities. [915]
- **Integration Tests:** N/A for the script itself. [921]
- **Manual/CLI Verification (Primary Test Method):** [912, 927, 930]
  - Ensure `_data.json` files exist from `npm run stage:fetch` or `npm run dev`.
  - Run `npm run stage:scrape`. [281]
  - Verify successful execution.
  - Check logs for reading files, skipping, attempting scrapes, success/failure messages, and saving messages [284].
  - Inspect the `output/YYYY-MM-DD/` directory for newly created/updated `{storyId}_article.txt` files. Verify they correspond to stories where scraping succeeded according to logs [283, 285].
  - Verify the script _only_ performed scraping actions based on local files (AC7).
  - Modify `package.json` to add the script (AC2).
- _(Hint: See `docs/testing-strategy.md` [907-950] which identifies Stage Runners as a key part of Acceptance Testing)._

## Story Wrap Up (Agent Populates After Execution)

- **Agent Model Used:** `<Agent Model Name/Version>`
- **Completion Notes:** {Stage runner implemented. Reads \_data.json, calls scraper, saves \_article.txt conditionally. package.json updated.}
- **Change Log:**
  - Initial Draft
```

---

## **End of Report for Epic 3**
