# Epic 2: Automated Content Ingestion & Podcast Generation Pipeline

**Goal:** To implement the complete automated daily workflow within the backend. This includes fetching Hacker News post data, scraping and extracting content from linked external articles, aggregating and formatting text, submitting it to Play.ai, managing job status via polling, and retrieving/storing the final audio file and associated metadata. This epic delivers the core value proposition of generating the daily audio content and making it ready for consumption via an API.

## User Stories

**Story 2.1: AWS CDK Extension for Epic 2 Resources**
* **User Story Statement:** As a Developer, I need to extend the existing AWS CDK stack within the `bmad-daily-digest-backend` project to define and provision all new AWS resources required for the content ingestion and podcast generation pipeline—including the `BmadDailyDigestEpisodes` DynamoDB table (with GSI), the `HackerNewsPostProcessState` DynamoDB table, an S3 bucket for audio storage, and the AWS Step Functions state machine for orchestrating the Play.ai job status polling—so that all backend infrastructure for this epic is managed as code and ready for the application logic.
* **Acceptance Criteria (ACs):**
    1.  The existing AWS CDK application (from Epic 1) **must** be extended.
    2.  The `BmadDailyDigestEpisodes` DynamoDB table resource **must** be defined in CDK as specified in the System Architecture Document's "Data Models" section (with `episodeId` PK, key attributes like `publicationDate`, `episodeNumber`, `podcastGeneratedTitle`, `audioS3Key`, `audioS3Bucket`, `playAiJobId`, `playAiSourceAudioUrl`, `sourceHNPosts` list, `status`, `createdAt`, `updatedAt`), including a GSI for chronological sorting (e.g., PK `status`, SK `publicationDate`), and PAY_PER_REQUEST billing.
    3.  The `HackerNewsPostProcessState` DynamoDB table resource **must** be defined in CDK as specified in the System Architecture Document's "Data Models" section (with `hnPostId` PK and attributes like `lastCommentFetchTimestamp`, `lastSuccessfullyScrapedTimestamp`, `lastKnownRank`), and PAY_PER_REQUEST billing.
    4.  An S3 bucket resource (e.g., `bmad-daily-digest-audio-{unique-suffix}`) **must** be defined via CDK for audio storage, with private access by default.
    5.  An AWS Step Functions state machine resource **must** be defined via CDK to manage the Play.ai job status polling workflow (as detailed in Story 2.6).
    6.  Necessary IAM roles and permissions for Lambda functions within this epic to interact with DynamoDB, S3, Step Functions, CloudWatch Logs **must** be defined via CDK, adhering to least privilege.
    7.  The updated CDK stack **must** synthesize (`cdk synth`) and deploy (`cdk deploy`) successfully.
    8.  All new CDK code **must** adhere to project ESLint/Prettier standards.

**Story 2.2: Fetch Top Hacker News Posts & Identify Repeats**
* **User Story Statement:** As the System, I need to reliably fetch the top N (configurable, e.g., 10) current Hacker News posts daily using the Algolia HN API, including their essential metadata. I also need to identify if each fetched post has been processed in a recent digest by checking against the `HackerNewsPostProcessState` table, so that I have an accurate list of stories and their status (new or repeat) to begin generating the daily digest.
* **Acceptance Criteria (ACs):**
    1.  A `hackerNewsService.ts` function **must** fetch top N HN posts (stories only) via `axios` from Algolia API (configurable `HN_POSTS_COUNT`).
    2.  Extracted metadata per post: Title, Article URL, HN Post URL, HN Post ID (`objectID`), Author, Points, Creation timestamp.
    3.  For each post, the function **must** query the `HackerNewsPostProcessState` DynamoDB table to determine its `isUpdateStatus` (true if `lastSuccessfullyScrapedTimestamp` and `lastCommentFetchTimestamp` indicate prior full processing) and retrieve `lastCommentFetchTimestamp` and `lastKnownRank` if available.
    4.  Function **must** return an array of HN post objects with metadata, `isUpdateStatus`, `lastCommentFetchTimestamp`, and `lastKnownRank`.
    5.  Error handling for Algolia/DynamoDB calls **must** be implemented and logged.
    6.  Unit tests (Jest) **must** verify API calls, data extraction, repeat identification (mocked DDB), and error handling. All tests **must** pass.

**Story 2.3: Article Content Scraping & Extraction (Conditional)**
* **User Story Statement:** As the System, for each Hacker News post identified as *new* (or for which article scraping previously failed and is being retried), I need to robustly fetch its HTML content from the linked article URL and extract the primary textual content and title using libraries like Cheerio and Mozilla Readability. If scraping fails, a fallback mechanism must be triggered.
* **Acceptance Criteria (ACs):**
    1.  An `articleScraperService.ts` function **must** accept an article URL and `isUpdateStatus`.
    2.  If `isUpdateStatus` is true (article already successfully scraped and stored, though we are not storing full articles long term - this implies we have the article data available from a previous step if it's a repeat post where we don't re-scrape), scraping **must** be skipped. (For MVP, if it's a repeat post, we assume we don't need to re-scrape the article itself, only comments, as per user feedback. This story focuses on *new* scrapes or retries of failed scrapes).
    3.  If a new scrape is needed: use `axios` (timeout, User-Agent) to fetch HTML.
    4.  Use `Mozilla Readability` (JS port) and/or `Cheerio` to extract main article text and title.
    5.  Return `{ success: true, title: string, content: string }` on success.
    6.  If scraping fails: log failure, return `{ success: false, error: string, fallbackNeeded: true }`.
    7.  No specific "polite" inter-article scraping delays for MVP.
    8.  Unit tests (Jest) **must** mock `axios`, test successful extraction, skip logic for non-applicable cases, and failure/fallback scenarios. All tests **must** pass.

**Story 2.4: Fetch Hacker News Comments (Conditional Logic)**
* **User Story Statement:** As the System, I need to fetch comments for each selected Hacker News post using the Algolia HN API, adjusting the strategy to fetch up to N comments for new posts, only new comments since last fetch for repeat posts, or up to 3N comments if article scraping failed.
* **Acceptance Criteria (ACs):**
    1.  `hackerNewsService.ts` **must** be extended to fetch comments for an HN Post ID, accepting `isUpdateStatus`, `lastCommentFetchTimestamp` (from `HackerNewsPostProcessState`), and `articleScrapingFailed` flags.
    2.  Use `axios` to call Algolia HN API item endpoint.
    3.  **Comment Fetching Logic:**
        * If `articleScrapingFailed`: Fetch up to 3 * `HN_COMMENTS_COUNT_PER_POST` available comments.
        * If `isUpdateStatus`: Fetch all comments, then filter client-side for comments with `created_at_i` > `lastCommentFetchTimestamp`. Select up to `HN_COMMENTS_COUNT_PER_POST` of these *new* comments.
        * Else (new post, successful scrape): Fetch up to `HN_COMMENTS_COUNT_PER_POST`.
    4.  For selected comments, extract plain text (HTML stripped), author, creation timestamp.
    5.  Return array of comment objects; empty if none. An updated `lastCommentFetchTimestamp` (max `created_at_i` of fetched comments for this post) should be available for updating `HackerNewsPostProcessState`.
    6.  Error handling and logging for API calls.
    7.  Unit tests (Jest) **must** mock `axios` and verify all conditional fetching logic, comment selection/filtering, data extraction, and error handling. All tests **must** pass.

**Story 2.5: Content Aggregation and Formatting for Play.ai**
* **User Story Statement:** As the System, I need to aggregate the collected Hacker News post data (titles), associated article content (full, truncated, or fallback summary), and comments (new, updated, or extended sets) for all top stories, and format this combined text according to the specified structure for the play.ai PlayNote API, including special phrasing for different post types (new, update, scrape-failed) and configurable article truncation.
* **Acceptance Criteria (ACs):**
    1.  A `contentFormatterService.ts` **must** be implemented.
    2.  Inputs: Array of processed HN post objects (with metadata, statuses, content, comments).
    3.  Output: A single string.
    4.  String starts: "It's a top 10 countdown for [Current Date]".
    5.  Posts sequenced in reverse rank order.
    6.  **Formatting (new post):** "Story [Rank] - [Article Title]. [Full/Truncated Article Text]. Comments Section. [Number] comments follow. Comment 1: [Text]..."
    7.  **Formatting (repeat post):** "Story [Rank] (previously Rank [OldRank] yesterday) - [Article Title]. We're bringing you new comments on this popular story. Comments Section. [Number] new comments follow. Comment 1: [Text]..."
    8.  **Formatting (scrape-failed post):** "Story [Rank] - [Article Title]. We couldn't retrieve the full article, but here's a summary if available and the latest comments. [Optional HN Summary]. Comments Section. [Number] comments follow. Comment 1: [Text]..."
    9.  **Article Truncation:** If `MAX_ARTICLE_LENGTH` (env var) set and article exceeds, truncate aiming to preserve intro/conclusion.
    10. Graceful handling for missing parts.
    11. Unit tests (Jest) verify all formatting, truncation, data merging, error handling. All tests **must** pass.

**Story 2.6 (REVISED): Implement Podcast Generation Status Polling via Play.ai API**
* **User Story Statement:** As the System, after submitting a podcast generation job to Play.ai and receiving a `jobId`, I need an AWS Step Function state machine to periodically poll the Play.ai API for the status of this specific job, continuing until the job is reported as "completed" or "failed" (or a configurable max duration/attempts limit is reached), so the system can reliably determine when the podcast audio is ready or if an error occurred.
* **Acceptance Criteria (ACs):**
    1.  The AWS Step Function state machine (CDK defined in Story 2.1) **must** manage the polling workflow.
    2.  Input: `jobId`.
    3.  States: Invoke Poller Lambda (calls Play.ai status GET endpoint with `axios`), Wait (configurable `POLLING_INTERVAL_MINUTES`), Choice (evaluates status: "processing", "completed", "failed").
    4.  Loop if "processing". Stop if "completed" or "failed".
    5.  Max polling duration/attempts (configurable env vars `MAX_POLLING_DURATION_MINUTES`, `MAX_POLLING_ATTEMPTS`) **must** be enforced, treating expiry as failure.
    6.  If "completed": extract `audioUrl`, trigger next step (Story 2.8 process) with data.
    7.  If "failed"/"timeout": log event, record failure (e.g., update episode status in DDB via a Lambda), terminate.
    8.  Poller Lambda handles API errors gracefully.
    9.  Unit tests for Poller Lambda logic; Step Function definition tested (locally if possible, or via AWS console tests). All tests **must** pass.

**Story 2.7: Submit Content to Play.ai PlayNote API & Initiate Podcast Generation**
* **User Story Statement:** As the System, I need to securely submit the aggregated and formatted text content (using `sourceText`) to the play.ai PlayNote API via an `application/json` request to initiate the podcast generation process, and I must capture the `jobId` returned by Play.ai, so that this `jobId` can be passed to the status polling mechanism (Step Function).
* **Acceptance Criteria (ACs):**
    1.  A `playAiService.ts` function **must** handle submission.
    2.  Input: formatted text (from Story 2.5).
    3.  Use `axios` for `POST` to Play.ai endpoint (e.g., `https://api.play.ai/api/v1/playnotes`).
    4.  Request `Content-Type: application/json`.
    5.  JSON body: `sourceText`, and configurable `title`, `voiceId1`, `name1` (default "Angelo"), `voiceId2`, `name2` (default "Deedee"), `styleGuidance` (default "podcast") from env vars.
    6.  Headers: `Authorization: Bearer <PLAY_AI_BEARER_TOKEN>`, `X-USER-ID: <PLAY_AI_USER_ID>` (from env vars).
    7.  No `webHookUrl` sent.
    8.  On success: extract `jobId`, log it, initiate polling Step Function (Story 2.6) with `jobId` and other context (like internal `episodeId`).
    9.  Error handling for API submission; log and flag failure.
    10. Unit tests (Jest) mock `axios`, verify API call, auth, payload, `jobId` extraction, Step Function initiation (mocked), error handling. All tests **must** pass.

**Story 2.8: Retrieve, Store Generated Podcast Audio & Persist Episode Metadata**
* **User Story Statement:** As the System, once the podcast generation status polling (Story 2.6) indicates a Play.ai job is "completed," I need to download the generated audio file from the provided `audioUrl`, store this file in our designated S3 bucket, and then save/update all relevant metadata for the episode (including S3 audio location, `episodeNumber`, `podcastGeneratedTitle`, `playAiSourceAudioUrl`, and source HN post information including their `lastCommentFetchTimestamp`) into our DynamoDB tables (`BmadDailyDigestEpisodes` and `HackerNewsPostProcessState`), so that the daily digest is fully processed, archived, and ready for access.
* **Acceptance Criteria (ACs):**
    1.  A `podcastStorageService.ts` function **must** be triggered by Step Function (Story 2.6) on "completed" status, receiving `audioUrl`, Play.ai `jobId`, and original context (like internal `episodeId`, list of source HN posts with their metadata and processing status).
    2.  Use `axios` to download audio from `audioUrl`.
    3.  Upload audio to S3 bucket (from Story 2.1), using key (e.g., `YYYY/MM/DD/episodeId.mp3`).
    4.  Prepare `Episode` metadata for `BmadDailyDigestEpisodes` table: `episodeId` (UUID), `publicationDate` (YYYY-MM-DD), `episodeNumber` (sequential logic, TBD), `podcastGeneratedTitle` (from Play.ai or constructed), `audioS3Bucket`, `audioS3Key`, `playAiJobId`, `playAiSourceAudioUrl`, `sourceHNPosts` (array of objects: `{ hnPostId, title, originalArticleUrl, hnLink, isUpdateStatus, oldRank, articleScrapingFailed }`), `status: "Published"`, `createdAt`, `updatedAt`.
    5.  For each `hnPostId` in `sourceHNPosts`, update its corresponding item in the `HackerNewsPostProcessState` table with the `lastCommentFetchTimestamp` (current time or max comment time from this run), `lastProcessedDate` (current date), and `lastKnownRank`. If `articleScrapingFailed` was false for this run, update `lastSuccessfullyScrapedTimestamp`.
    6.  Save `Episode` metadata to `BmadDailyDigestEpisodes` DynamoDB table.
    7.  Error handling for download, S3 upload, DDB writes; failure should result in episode `status: "Failed"`.
    8.  Unit tests (Jest) mock `axios`, AWS SDK (S3, DynamoDB); verify data handling, storage, metadata construction for both tables, errors. All tests **must** pass.

**Story 2.9: Daily Workflow Orchestration & Scheduling**
* **User Story Statement:** As the System Administrator, I need the entire daily backend workflow (Stories 2.2 through 2.8) to be fully orchestrated by the primary AWS Step Function state machine and automatically scheduled to run once per day using Amazon EventBridge Scheduler, ensuring it handles re-runs for the same day by overwriting/starting over (for MVP), so that "BMad Daily Digest" episodes are produced consistently and reliably.
* **Acceptance Criteria (ACs):**
    1.  The primary AWS Step Function state machine **must** orchestrate the sequence: Fetch HN Posts & Identify Repeats (2.2); For each post: conditionally Scrape Article (2.3) & Fetch Comments (2.4); then Aggregate & Format Content (2.5); then Submit to Play.ai & get `jobId` (2.7); then initiate/manage Polling (2.6 using `jobId`); on "completed" polling, trigger Retrieve & Store Audio/Metadata (2.8).
    2.  State machine **must** manage data flow (inputs/outputs) between steps correctly.
    3.  Overall workflow error handling: critical step failure marks state machine execution as "Failed" and logs comprehensively. Steps use retries for transient errors.
    4.  **Idempotency (MVP):** Re-running for the same `publicationDate` **must** re-process and effectively overwrite previous data for that date.
    5.  Amazon EventBridge Scheduler rule (CDK defined) **must** trigger the main Step Function daily at 12:00 UTC (default, configurable via `DAILY_JOB_SCHEDULE_UTC_CRON`).
    6.  Successful end-to-end run **must** be demonstrated (e.g., processing sample data through the pipeline).
    7.  Step Function execution history **must** provide a clear audit trail of steps and data.
    8.  Unit tests for any new orchestrator-specific Lambda functions (if any not covered). All tests **must** pass. 