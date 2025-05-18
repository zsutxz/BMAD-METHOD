Okay, I will generate all stories for Epic 2 in a single output, performing the necessary analysis of the provided documents to ensure each story is detailed and actionable.

Operating in **Story Creator Phase**.

Here are all the stories for Epic 2:

---

# Story 2.1: Identify URLs within Hacker News posts for article extraction

## Status: Draft

## Story

- As a system
- I want to identify URLs within the top 30 (configurable via environment variable) Hacker News posts
- so that I can extract the content of linked articles.

## Acceptance Criteria (ACs)

1.  The system parses the top N (configurable via env var `HN_POST_LIMIT_FOR_SCRAPING`, defaults to 10 as per PRD Functional Req `[8-prd-po-updated.txt#HN Content Retrieval & Storage]`) Hacker News posts (retrieved in Epic 1) to identify URLs from the `url` field of `hn_posts` table entries associated with the current `workflow_run_id`.
2.  The system filters out any URLs that are not relevant to article scraping (e.g., links to `news.ycombinator.com` itself, known non-article domains if a list is maintained, or links that are empty/null).

## Tasks / Subtasks

- [ ] Task 1: Develop URL identification logic. (AC: 1)
  - [ ] Within the `ArticleScrapingService` (Supabase Function), add logic to fetch `hn_posts` records relevant to the current `workflow_run_id`.
  - [ ] Retrieve the `url` field from these records.
  - [ ] Implement configuration to limit processing to N posts (e.g., using an environment variable `HN_POST_LIMIT_FOR_SCRAPING`, defaulting to 10). The PRD mentions "up to 10 linked articles per day" (`[8-prd-po-updated.txt#Functional Requirements (MVP)]`). This might mean the top 10 posts with valid URLs from the fetched 30.
- [ ] Task 2: Implement URL filtering. (AC: 2)
  - [ ] Create a filtering mechanism to exclude irrelevant URLs.
  - [ ] Initial filters should exclude:
    - Null or empty URLs.
    - URLs pointing to `news.ycombinator.com` (item or user links).
    - (Optional, for future enhancement) URLs matching a configurable blocklist of domains (e.g., image hosts, video platforms if not desired).
  - [ ] Log any URLs that are filtered out and the reason.
- [ ] Task 3: Prepare URLs for Scraping Task.
  - [ ] For each valid and filtered URL, create a corresponding 'pending' entry in the `scraped_articles` table (this might be done here or as the first step in Story 2.2 just before actual scraping). This is important for tracking.

## Dev Technical Guidance

- **Service Context:** This logic will be part of the `ArticleScrapingService` Supabase Function, which is triggered by the database event from `hn_posts` insertion (Story 1.9). The service will receive `hn_post_id`, `workflow_run_id`, and `article_url` (the URL from the `hn_posts` table). This story's tasks refine how the service _validates_ and _prepares_ this URL before actual scraping.
- **Configuration:**
  - Environment Variable: `HN_POST_LIMIT_FOR_SCRAPING` (default to 10). This dictates how many of the HN posts (those with URLs) from the current `workflow_run_id` will have their articles attempted for scraping.
  - The PRD `[8-prd-po-updated.txt#HN Content Retrieval & Storage]` says "Scraping and storage of up to 10 linked articles per day." This implies a selection or prioritization if more than 10 valid article URLs are found among the top 30 HN posts. The service might process the first 10 valid URLs it encounters based on post ranking or fetch order.
- **URL Filtering Logic:**
  - Basic validation: check if URL is non-empty and a valid HTTP/HTTPS URL structure.
  - Domain checking: Use `URL` object in JavaScript/TypeScript to parse and inspect hostnames.
  - Example filter: `if (!url || new URL(url).hostname === 'news.ycombinator.com') return 'filtered_out_internal_link';`
- **Input:** The `ArticleScrapingService` will receive `hn_post_id` and its associated `article_url` from the trigger (Story 1.9). This story focuses on the service deciding _if_ it should proceed with _this specific_ `article_url` based on overall limits and URL validity.
- **Logging:** Use Pino. Log the `workflow_run_id`, `hn_post_id`, the URL being processed, and the outcome of identification/filtering.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 2.2: Scrape content of identified article URLs using Cheerio

## Status: Draft

## Story

- As a system
- I want to scrape the content of the identified article URLs using Cheerio
- so that I can provide summaries in the newsletter.

## Acceptance Criteria (ACs)

1.  The system scrapes the content from the identified article URLs using Cheerio.
2.  The system extracts relevant content such as the article title, author, publication date, and main text.
3.  The system handles potential issues during scraping, such as website errors or changes in website structure, logging errors for review.

## Tasks / Subtasks

- [ ] Task 1: Set up `ArticleScrapingService` Supabase Function.
  - [ ] Create the Supabase Function `article-scraper-service` in `supabase/functions/article-scraper-service/index.ts`.
  - [ ] This function is triggered by the event from Story 1.9 (new `hn_post` insert). It receives `hn_post_id`, `workflow_run_id`, and `original_url`.
  - [ ] Initialize Pino logger and Supabase admin client.
- [ ] Task 2: Implement Article Content Fetching. (AC: 1)
  - [ ] For the given `original_url`, make an HTTP GET request to fetch the HTML content of the article. Use a robust HTTP client (e.g., `node-fetch` or `axios`).
  - [ ] Implement basic error handling for the fetch (e.g., timeouts, non-2xx responses).
- [ ] Task 3: Implement Content Extraction using Cheerio. (AC: 1, 2)
  - [ ] Load the fetched HTML content into Cheerio.
  - [ ] Implement logic to extract:
    - Article Title (e.g., from `<title>` tag, `<h1>` tags, OpenGraph meta tags like `og:title`).
    - Author (e.g., from meta tags like `author`, `article:author`, or common HTML patterns).
    - Publication Date (e.g., from meta tags like `article:published_time`, `datePublished`, or common HTML patterns; attempt to parse into ISO format).
    - Main Text Content (This is the most complex part. Attempt to identify the main article body, stripping away boilerplate like navs, footers, ads. Look for common patterns like `<article>` tags, `div`s with class `content`, `post-body`, etc. Paragraphs (`<p>`) within these main containers are primary targets.)
  - [ ] Store the `resolved_url` if the fetch involved redirects.
- [ ] Task 4: Implement Scraping Error Handling. (AC: 3)
  - [ ] If fetching fails (network error, 4xx/5xx status), record `scraping_status = 'failed_unreachable'` or similar, and log the error.
  - [ ] If HTML parsing or content extraction fails significantly, record `scraping_status = 'failed_parsing'`, and log the error.
  - [ ] Consider a generic `failed_generic` status for other errors.
  - [ ] The PRD mentions `failed_paywall` (`[3-architecture.txt#ScrapedArticle]`). Implement basic detection if possible (e.g., looking for keywords like "subscribe to read" in a limited part of the body if main content is very short), otherwise, this might be a manual classification or future enhancement.
- [ ] Task 5: Update `scraped_articles` Table (Initial Entry).
  - [ ] Before attempting to scrape, the `ArticleScrapingService` should create or update an entry in `scraped_articles` for the given `hn_post_id` and `workflow_run_id`, setting `original_url` and `scraping_status = 'pending'`. This uses the `id` of this new row as `scraped_article_id` for subsequent updates.
  - [ ] (This task might overlap with Story 2.1 Task 3 or Story 2.3 Task 1, ensure it's done once logically).

## Dev Technical Guidance

- **Service:** `article-scraper-service` Supabase Function.
- **Technology:**
  - HTTP Client: `node-fetch` (common in Node.js environments for Supabase Functions) or `axios`.
  - HTML Parsing: Cheerio (`[3-architecture.txt#Definitive Tech Stack Selections]`).
- **Content Extraction Strategy (Cheerio):**
  - This is heuristic-based and can be fragile. Start with common patterns.
  - **Title:** `$('title').text()`, `$('meta[property="og:title"]').attr('content')`, `$('h1').first().text()`.
  - **Author:** `$('meta[name="author"]').attr('content')`, `$('meta[property="article:author"]').attr('content')`.
  - **Date:** `$('meta[property="article:published_time"]').attr('content')`, `$('time').attr('datetime')`. Use a library like `date-fns` to parse various date formats into a consistent ISO string.
  - **Main Text:** This is the hardest. Libraries like `@mozilla/readability` can be used in conjunction with or as an alternative to custom Cheerio selectors for extracting the main article content, as they are specifically designed for this. If using only Cheerio, look for large blocks of text within `<p>` tags, often nested under `<article>` or common `div` classes. Remove script/style tags.
- **Data to Extract:** `title`, `author`, `publication_date`, `main_text_content`, `resolved_url` (if different from original).
- **Error Logging:** Log `workflow_run_id`, `hn_post_id`, `original_url`, and specific error messages from Cheerio or fetch.
- **Workflow Interaction:**
  - The service is triggered by Story 1.9.
  - It updates the `workflow_runs` table via `WorkflowTrackerService` (e.g., `incrementWorkflowDetailCounter(jobId, 'articles_attempted_scraping')`) before attempting the scrape for an article.
  - The success/failure status for _this specific article_ is recorded in `scraped_articles` table (Story 2.3).
  - The _overall_ status of the scraping stage for the `workflow_run_id` (e.g., moving from 'scraping_articles' to 'summarizing_content') is managed by `CheckWorkflowCompletionService` (Story 1.6) once all triggered scraping tasks for that run are no longer 'pending'.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 2.3: Store scraped article content in Supabase

## Status: Draft

## Story

- As a system
- I want to store the scraped article content in the Supabase database, associated with the corresponding Hacker News post and workflow run
- so that it can be used for summarization and newsletter generation.

## Acceptance Criteria (ACs)

1.  Scraped article content is stored in the `scraped_articles` table, linked to the `hn_post_id` and the current `workflow_run_id`.
2.  The system ensures that the stored data includes all extracted information (title, author, date, text, resolved URL).
3.  The `scraping_status` and any `error_message` are recorded in the `scraped_articles` table.
4.  Upon completion of scraping an article (success or failure), the service updates the `workflow_runs.details` (e.g., incrementing scraped counts) via `WorkflowTrackerService`.
5.  A Supabase migration for the `scraped_articles` table (as defined in `architecture.txt`) is created and applied before data operations.

## Tasks / Subtasks

- [ ] Task 1: Create `scraped_articles` Table Migration. (AC: 5)
  - [ ] Create a Supabase migration file in `supabase/migrations/`.
  - [ ] Define the SQL for the `scraped_articles` table as specified in `[3-architecture.txt#scraped_articles]`, including columns: `id`, `hn_post_id`, `original_url`, `resolved_url`, `title`, `author`, `publication_date`, `main_text_content`, `scraped_at`, `scraping_status`, `error_message`, `workflow_run_id`.
  - [ ] Include unique index and comments as specified.
  - [ ] Apply the migration.
- [ ] Task 2: Implement Data Storage Logic in `ArticleScrapingService`. (AC: 1, 2, 3)
  - [ ] After scraping (Story 2.2), or if scraping failed, the `ArticleScrapingService` will update the existing 'pending' record in `scraped_articles` (identified by `hn_post_id` and `workflow_run_id`, or by the `scraped_article_id` if created earlier).
  - [ ] Populate `title`, `author`, `publication_date` (parsed to TIMESTAMPTZ), `main_text_content`, `resolved_url`.
  - [ ] Set `scraped_at = now()`.
  - [ ] Set `scraping_status` to 'success', 'failed_unreachable', 'failed_paywall', 'failed_parsing', or 'failed_generic'.
  - [ ] Populate `error_message` if scraping failed.
  - [ ] Ensure `hn_post_id` and `workflow_run_id` are correctly associated.
- [ ] Task 3: Update `WorkflowTrackerService`. (AC: 4)
  - [ ] After attempting to scrape and updating `scraped_articles`, the `ArticleScrapingService` should call `WorkflowTrackerService`.
  - [ ] Example calls:
    - `WorkflowTrackerService.incrementWorkflowDetailCounter(workflow_run_id, 'articles_scraping_attempted', 1)`
    - If successful: `WorkflowTrackerService.incrementWorkflowDetailCounter(workflow_run_id, 'articles_scraped_successfully', 1)`
    - If failed: `WorkflowTrackerService.incrementWorkflowDetailCounter(workflow_run_id, 'articles_scraping_failed', 1)`
  - [ ] Log these updates.
- [ ] Task 4: Ensure `ArticleScrapingService` creates initial 'pending' record if not already handled.
  - [ ] As the very first step when `ArticleScrapingService` is invoked for an `hn_post_id` and `workflow_run_id`, it must ensure an entry exists in `scraped_articles` with `scraping_status = 'pending'`. This can be an `INSERT ... ON CONFLICT DO NOTHING` or an explicit check. This record's `id` is the `scraped_article_id`. This prevents issues if the trigger fires multiple times or if other logic expects this row.

## Dev Technical Guidance

- **Service:** `ArticleScrapingService` Supabase Function.
- **Database Table:** `scraped_articles`. The schema definition from `[3-architecture.txt#scraped_articles]` is the source of truth.
  - `scraping_status` enum values: 'pending', 'success', 'failed_unreachable', 'failed_paywall', 'failed_parsing', 'failed_generic'.
- **Data Flow:**
  1.  `ArticleScrapingService` is triggered (Story 1.9) with `hn_post_id`, `workflow_run_id`, `original_url`.
  2.  (Task 4 of this story / Story 2.2 Task 5): Service ensures/creates a `scraped_articles` row for this task, status 'pending'. Gets `scraped_article_id`.
  3.  Service attempts scraping (Story 2.1, Story 2.2).
  4.  (Task 2 of this story): Service updates the `scraped_articles` row with results (content, status, error message).
  5.  (Task 3 of this story): Service updates `workflow_runs.details` via `WorkflowTrackerService`.
- **Supabase Client:** Use the Supabase admin client for `INSERT` and `UPDATE` operations on `scraped_articles`.
- **Error Handling:** If database operations fail, the `ArticleScrapingService` should log this critically. The overall workflow's `error_message` might need an update via `WorkflowTrackerService.failWorkflow()` if a DB error in scraping is deemed critical for the whole run.
- **Unique Constraint:** The `idx_scraped_articles_hn_post_id_workflow_run_id` unique index in `[3-architecture.txt#scraped_articles]` ensures that for a given workflow run, an HN post is processed only once by the scraping service. The initial insert (Task 4) should handle potential conflicts gracefully (e.g. `ON CONFLICT DO UPDATE` to set status to pending if it was somehow different, or `ON CONFLICT DO NOTHING` if an identical pending record already exists).

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 2.4: Trigger article scraping process via API and CLI

## Status: Draft

## Story

- As a developer
- I want to trigger the article scraping process via the API and CLI
- so that I can manually initiate it for testing and debugging.

## Acceptance Criteria (ACs)

1.  The API endpoint can trigger the article scraping process.
2.  The CLI command can trigger the article scraping process locally.
3.  The system logs the start and completion of the scraping process, including any errors encountered.
4.  All API requests and CLI command executions are logged, including timestamps and any relevant data.
5.  The system handles partial execution gracefully (i.e., if triggered before Epic 1 components like `WorkflowTrackerService` are available, it logs a message and exits).
6.  If retained for isolated testing, all scraping operations initiated via this trigger must be associated with a valid `workflow_run_id` and update the `workflow_runs` table accordingly via `WorkflowTrackerService`.

**(Self-correction/Architect's Note from PRD `[8-prd-po-updated.txt#Story 2.4]`):** "This story might become redundant if the main workflow trigger (Story 1.3) handles the entire pipeline initiation and individual service testing is done via direct function invocation or unit/integration tests."

**Decision for this story:** Proceed with the understanding that this provides a way to trigger scraping for a _specific, existing_ `workflow_run_id` and potentially for a _specific_ `hn_post_id` within that run, rather than initiating a full new workflow. This makes it distinct from Story 1.3 and useful for targeted testing/re-processing of a single article. If the main workflow trigger (1.3) is the _only_ intended way to start scraping, then this story could be skipped or its scope significantly reduced to just documenting how to test `ArticleScrapingService` via unit/integration tests. Assuming the former (targeted trigger) for now.

## Tasks / Subtasks

- [ ] Task 1: Design API endpoint for targeted scraping. (AC: 1)
  - [ ] Define a new Next.js API Route, e.g., `POST /api/system/trigger-scraping`.
  - [ ] Request body should accept `workflow_run_id` and `hn_post_id` (or `article_url` if more direct).
  - [ ] Secure with API key (same as Story 1.3).
- [ ] Task 2: Implement API endpoint logic. (AC: 1, 3, 4, 6)
  - [ ] Authenticate request.
  - [ ] Validate inputs (`workflow_run_id`, `hn_post_id`).
  - [ ] Log initiation with Pino, including parameters.
  - [ ] Directly invoke `ArticleScrapingService` with the provided parameters. This might involve making an HTTP call to the service's endpoint if it's designed as a callable function, or if possible, importing and calling its handler directly (if co-located or packaged appropriately for internal calls).
  - [ ] `ArticleScrapingService` should already handle `WorkflowTrackerService` updates for the specific article. This endpoint mainly orchestrates the call.
  - [ ] Return a response indicating success/failure of _triggering_ the scrape.
- [ ] Task 3: Implement CLI command for targeted scraping. (AC: 2, 3, 4, 6)
  - [ ] Create a new script `scripts/trigger-article-scrape.ts`.
  - [ ] Accept `workflow_run_id` and `hn_post_id` as command-line arguments.
  - [ ] The script calls the new API endpoint from Task 1 or directly invokes the `ArticleScrapingService` logic.
  - [ ] Log initiation and outcome to console.
  - [ ] Add to `package.json` scripts.
- [ ] Task 4: Handle graceful partial execution. (AC: 5)
  - [ ] Ensure that if `WorkflowTrackerService` or other critical Epic 1 components are not available (e.g., during early development phases), the API/CLI logs a clear error and exits without crashing. This is more of a general robustness measure.

## Dev Technical Guidance

- **Purpose of this Trigger:** Unlike Story 1.3 (which starts a _new_ full workflow), this trigger is for re-scraping a specific article within an _existing_ workflow or for testing the `ArticleScrapingService` in isolation with specific inputs.
- **API Endpoint:**
  - `POST /api/system/trigger-scraping`
  - Request Body: `{ "workflow_run_id": "uuid", "hn_post_id": "string" }` (or alternatively, the direct `article_url` if `hn_post_id` lookup is an extra step).
  - Authentication: Use `WORKFLOW_TRIGGER_API_KEY` in `X-API-KEY` header.
- **CLI Command:**
  - Example: `npm run trigger-scrape -- --workflowId <uuid> --postId <string>`
  - Use a library like `yargs` for parsing command-line arguments if it becomes complex.
- **Invoking `ArticleScrapingService`:**
  - If `ArticleScrapingService` is an HTTP-triggered Supabase Function, the API/CLI will make an HTTP request to its endpoint. This is cleaner for decoupling.
  - The payload to `ArticleScrapingService` should be what it expects (e.g., `{ hn_post_id, workflow_run_id, article_url }`).
- **Logging:** Essential for tracking manual triggers. Log all input parameters and the outcome of the trigger. `ArticleScrapingService` itself will log its detailed scraping activities.
- **Redundancy Check:** Re-evaluate if this story is truly needed if unit/integration tests for `ArticleScrapingService` are comprehensive and the main workflow trigger (Story 1.3) is sufficient for end-to-end testing. If kept, its specific purpose (targeted re-processing/testing) should be clear.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed. Specifically, confirm if this targeted trigger is required or if testing will be handled by other means.}

### Change Log

---

# Story 2.5: Implement Database Event/Webhook: `scraped_articles` Success to Summarization Service

## Status: Draft

## Story

- As a system
- I want the successful scraping and storage of an article in `scraped_articles` to automatically trigger the `SummarizationService`
- so that content summarization can begin as soon as an article's text is available.

## Acceptance Criteria (ACs)

1.  A Supabase database trigger or webhook mechanism is implemented on the `scraped_articles` table (e.g., on INSERT or UPDATE where `scraping_status` is 'success').
2.  The trigger successfully invokes the `SummarizationService` (Supabase Function).
3.  The invocation passes necessary parameters like `scraped_article_id` and `workflow_run_id` to the `SummarizationService`.
4.  The mechanism is robust and includes error handling/logging for the trigger/webhook itself.
5.  Unit/integration tests are created to verify the trigger fires correctly and the service is invoked with correct parameters.

## Tasks / Subtasks

- [ ] Task 1: Design Trigger Mechanism for `scraped_articles`.
  - [ ] Similar to Story 1.9, decide on PostgreSQL trigger + `pg_net` vs. Supabase Function Hooks on database events if available and suitable.
  - [ ] The trigger should fire `AFTER INSERT OR UPDATE ON scraped_articles FOR EACH ROW WHEN (NEW.scraping_status = 'success' AND (OLD IS NULL OR OLD.scraping_status IS DISTINCT FROM 'success'))`. This ensures it fires only once when an article becomes successfully scraped.
- [ ] Task 2: Implement Database Trigger and PL/pgSQL Function (if `pg_net` chosen). (AC: 1)
  - [ ] Create a migration file in `supabase/migrations/`.
  - [ ] Write SQL for the PL/pgSQL function. It will construct a payload (e.g., `{ "scraped_article_id": NEW.id, "workflow_run_id": NEW.workflow_run_id }`) and use `pg_net.http_post` to call the `SummarizationService`'s invocation URL.
  - [ ] Write SQL to create the trigger on `scraped_articles`.
  - [ ] The `SummarizationService` (from Epic 3) needs a known invocation URL.
- [ ] Task 3: Configure `SummarizationService` for Invocation. (AC: 2, 3)
  - [ ] Ensure `SummarizationService` (to be developed in Epic 3) is designed to accept `scraped_article_id` and `workflow_run_id` via its request body (if HTTP triggered).
  - [ ] Implement security for this invocation URL (e.g., shared internal secret token).
- [ ] Task 4: Implement Error Handling and Logging for this Trigger. (AC: 4)
  - [ ] The PL/pgSQL function should log errors from `pg_net` calls (e.g., to `stderr`).
- [ ] Task 5: Create Tests. (AC: 5)
  - [ ] **Integration Test:**
    - Set up the trigger.
    - Insert/Update a row in `scraped_articles` to meet trigger conditions (`scraping_status = 'success'`).
    - Verify that a (mocked) `SummarizationService` endpoint receives an invocation with correct `scraped_article_id` and `workflow_run_id`.

## Dev Technical Guidance

- **Trigger Condition:** Crucially, the trigger should only fire when an article is _newly_ marked as successfully scraped to avoid re-triggering summarization unnecessarily. The `WHEN (NEW.scraping_status = 'success' AND (OLD IS NULL OR OLD.scraping_status IS DISTINCT FROM 'success'))` condition handles this for both new inserts and updates.
- **`pg_net` or Function Hooks:** Same considerations as Story 1.9. If Supabase Function Hooks on DB events are a simpler alternative to `pg_net` for invoking Vercel-hosted Supabase Functions, that path is preferable.
  - Payload to `SummarizationService`:
    ```json
    {
      "scraped_article_id": "UUID of the scraped article",
      "workflow_run_id": "UUID of the current workflow"
    }
    ```
- **Security:** The invocation URL for `SummarizationService` should be protected.
- **Error Handling:** Similar to Story 1.9, errors in the trigger/`pg_net` call should be logged but ideally not cause the update to `scraped_articles` to fail. The `CheckWorkflowCompletionService` can serve as a backup to find successfully scraped articles that somehow didn't trigger summarization.
- **Target Service:** The `SummarizationService` will be defined in Epic 3. For testing this story, its endpoint can be a mock that just logs received payloads.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---
