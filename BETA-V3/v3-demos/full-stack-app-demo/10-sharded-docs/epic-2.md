# Epic 2: Article Scraping

> This document is a granulated shard from the main "BETA-V3/v3-demos/full-stack-app-demo/8-prd-po-updated.md" focusing on "Epic 2: Article Scraping".

- Goal: Implement the functionality to scrape and store linked articles from HN posts, enriching the data available for summarization and the newsletter. Ensure this functionality is triggered by database events and can be tested via API/CLI (if retained). Implement the database event mechanism to trigger subsequent processing.

- **Story 2.1:** As a system, I want to identify URLs within the top 30 (configurable via environment variable) Hacker News posts, so that I can extract the content of linked articles.
  - Acceptance Criteria:
    - The system parses the top N (configurable via env var) Hacker News posts to identify URLs.
    - The system filters out any URLs that are not relevant to article scraping (e.g., links to images, videos, etc.).
- **Story 2.2:** As a system, I want to scrape the content of the identified article URLs using Cheerio, so that I can provide summaries in the newsletter.
  - Acceptance Criteria:
    - The system scrapes the content from the identified article URLs using Cheerio.
    - The system extracts relevant content such as the article title, author, publication date, and main text.
    - The system handles potential issues during scraping, such as website errors or changes in website structure, logging errors for review.
- **Story 2.3:** As a system, I want to store the scraped article content in the Supabase database, associated with the corresponding Hacker News post and workflow run, so that it can be used for summarization and newsletter generation.
  - Acceptance Criteria:
    - Scraped article content is stored in the `scraped_articles` table, linked to the `hn_post_id` and the current `workflow_run_id`.
    - The system ensures that the stored data includes all extracted information (title, author, date, text).
    - The `scraping_status` and any `error_message` are recorded in the `scraped_articles` table.
    - Upon completion of scraping an article (success or failure), the service updates the `workflow_runs.details` (e.g., incrementing scraped counts) via `WorkflowTrackerService`.
    - A Supabase migration for the `scraped_articles` table (as defined in `architecture.txt`) is created and applied before data operations.
- **Story 2.4:** As a developer, I want to trigger the article scraping process via the API and CLI, so that I can manually initiate it for testing and debugging.
  - _Architect's Note: This story might become redundant if the main workflow trigger (Story 1.3) handles the entire pipeline initiation and individual service testing is done via direct function invocation or unit/integration tests._
  - Acceptance Criteria:
    - The API endpoint can trigger the article scraping process.
    - The CLI command can trigger the article scraping process locally.
    - The system logs the start and completion of the scraping process, including any errors encountered.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The system handles partial execution gracefully (i.e., if triggered before Epic 1 components like `WorkflowTrackerService` are available, it logs a message and exits).
    - If retained for isolated testing, all scraping operations initiated via this trigger must be associated with a valid `workflow_run_id` and update the `workflow_runs` table accordingly via `WorkflowTrackerService`.
- **Story 2.5 (New): Implement Database Event/Webhook: `scraped_articles` Success to Summarization Service**
  - Goal: To ensure that the successful scraping and storage of an article in `scraped_articles` automatically triggers the `SummarizationService`.
  - Acceptance Criteria:
    - A Supabase database trigger or webhook mechanism is implemented on the `scraped_articles` table (e.g., on INSERT or UPDATE where `scraping_status` is 'success').
    - The trigger successfully invokes the `SummarizationService` (Supabase Function).
    - The invocation passes necessary parameters like `scraped_article_id` and `workflow_run_id` to the `SummarizationService`.
    - The mechanism is robust and includes error handling/logging for the trigger/webhook itself.
    - Unit/integration tests are created to verify the trigger fires correctly and the service is invoked with correct parameters.
