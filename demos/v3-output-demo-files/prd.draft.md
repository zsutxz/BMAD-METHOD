# BMad Daily Digest Product Requirements Document (PRD)

**Version:** 0.1
**Date:** May 20, 2025
**Author:** JohnAI

## 1. Goal, Objective and Context

* **Overall Goal:** To provide busy tech executives with a quick, daily audio digest of top Hacker News posts and discussions, enabling them to stay effortlessly informed.
* **Project Objective (MVP Focus):** To successfully launch the "BMad Daily Digest" by:
    * Automating the daily fetching of top 10 Hacker News posts (article metadata and comments via Algolia HN API) and scraping of linked article content.
    * Processing this content into a structured format.
    * Generating a 2-agent audio podcast using the play.ai PlayNote API.
    * Delivering the podcast via a simple Next.js web application (polyrepo structure) with a list of episodes and detail pages including an audio player and links to source materials.
    * Operating this process daily, aiming for delivery by a consistent morning hour.
    * Adhering to a full TypeScript stack (Node.js 22 for backend), with a Next.js frontend, AWS Lambda backend, DynamoDB, S3, and AWS CDK for IaC, while aiming to stay within AWS free-tier limits where possible.
* **Context/Problem Solved:** Busy tech executives lack the time to thoroughly read Hacker News daily but need to stay updated on key tech discussions, trends, and news for strategic insights. "BMad Daily Digest" solves this by offering a convenient, curated audio summary.

## 2. Functional Requirements (MVP)

**FR1: Content Acquisition**
* The system **must** automatically fetch data for the top 10 (configurable) posts from Hacker News daily.
* For each Hacker News post, the system **must** identify and retrieve:
    * The URL of the linked article.
    * Key metadata about the Hacker News post (e.g., title, HN link, score, author, HN Post ID).
* The system **must** fetch comments for each identified Hacker News post using the Algolia HN Search API, with logic to handle new vs. repeat posts and scraping failures differently.
* The system **must** attempt to scrape and extract the primary textual content from the linked article URL for each of the top posts (unless it's a repeat post where only new comments are needed).
    * This process should aim to isolate the main article body.
    * If scraping fails, a fallback using HN title, summary (if available), and increased comments **must** be used.

**FR2: Content Processing and Formatting**
* The system **must** aggregate the extracted/fallback article content and selected comments for the top 10 posts.
* The system **must** process and structure the aggregated text content into a single text file suitable for submission to the play.ai PlayNote API.
    * The text file **must** begin with an introductory sentence: "It's a top 10 countdown for [Today'sDate]".
    * Content **must** be structured sequentially (e.g., "Story 10 - [details]..."), with special phrasing for repeat posts or posts where article scraping failed.
    * Article content may be truncated if `MAX_ARTICLE_LENGTH` is set, preserving intro/conclusion where possible.

**FR3: Podcast Generation**
* The system **must** submit the formatted text content to the play.ai PlayNote API daily using specified voice and style parameters (configurable via environment variables).
* The system **must** capture the `jobId` from Play.ai and use a polling mechanism (e.g., AWS Step Functions) to check for job completion status.
* Upon successful completion, the system **must** retrieve the generated audio podcast file from the Play.ai-provided URL.
* The system **must** store the generated audio file (e.g., on S3) and its associated metadata (including episode number, generated title, S3 location, original Play.ai URL, source HN posts, and processing status) in DynamoDB.

**FR4: Web Application Interface (MVP)**
* The system **must** provide a web application (Next.js, "80s retro CRT terminal" theme with Tailwind CSS & shadcn/ui) with a **List Page** that:
    * Displays a chronological list (newest first) of all generated "BMad Daily Digest" episodes, formatted as "Episode [EpisodeNumber]: [PublicationDate] - [PodcastTitle]".
    * Allows users to navigate to a Detail Page for each episode.
* The system **must** provide a web application with a **Detail Page** for each episode that:
    * Displays the `podcastGeneratedTitle`, `publicationDate`, and `episodeNumber`.
    * Includes an embedded HTML5 audio player for the podcast.
    * Lists the individual Hacker News stories included, with direct links to the original source article and the Hacker News discussion page.
* The system **must** provide a minimalist **About Page**.
* The web application **must** be responsive.

**FR5: Automation and Scheduling**
* The entire end-to-end backend process **must** be orchestrated (preferably via AWS Step Functions) and automated to run daily, triggered by Amazon EventBridge Scheduler (default 12:00 UTC, configurable).
* For MVP, a re-run of the daily job for the same day **must** overwrite/start over previous data for that day.

## 3. Non-Functional Requirements (MVP)

**a. Performance:**
* **Podcast Generation Time:** The daily process should complete in a timely manner (e.g., target by 8 AM CST/12:00-13:00 UTC, specific completion window TBD based on Play.ai processing).
* **Web Application Load Time:** Pages on the Next.js app should aim for fast load times (e.g., target under 3-5 seconds).

**b. Reliability / Availability:**
* **Daily Process Success Rate:** Target >95% success rate for automated podcast generation without manual intervention.
* **Web Application Uptime:** Target 99.5%+ uptime.

**c. Maintainability:**
* **Code Quality:** Code **must** be well-documented. Internal code comments **should** be used when logic isn't clear from names. All functions **must** have JSDoc-style outer comments. Adherence to defined coding standards (ESLint, Prettier).
* **Configuration Management:** System configurations and secrets **must** be managed via environment variables (`.env` locally, Lambda environment variables when deployed), set manually for MVP.

**d. Usability (Web Application):**
* The web application **must** be intuitive for busy tech executives.
* The audio player **must** be simple and reliable.
* Accessibility: Standard MVP considerations, with particular attention to contrast for the "glowing green on dark" theme, good keyboard navigation, and basic screen reader compatibility.

**e. Security (MVP Focus):**
* **API Key Management:** Keys for Algolia, Play.ai, AWS **must** be stored securely (gitignored `.env` files locally, Lambda environment variables in AWS), not hardcoded.
* **Data Handling:** Scraped content handled responsibly.

**f. Cost Efficiency:**
* AWS service usage **must** aim to stay within free-tier limits where feasible. Play.ai usage is via existing user subscription.

## 4. User Interaction and Design Goals

**a. Overall Vision & Experience:**
* **Look and Feel:** Dark mode UI, "glowing green ASCII/text on a black background" aesthetic (CRT terminal style), "80s retro everything" theme.
* **UI Component Toolkit:** Tailwind CSS and shadcn/ui, customized for the theme. Initial structure/components kickstarted by an AI UI generation tool.
* **User Experience:** Highly efficient, clear navigation, no clutter, prioritizing content readability for busy tech executives.

**b. Key Interaction Paradigms (MVP):**
* View list of digests (reverse chronological), select one for details. No sorting/filtering on list page for MVP.

**c. Core Screens/Views (MVP):**
* **List Page:** Episodes ("Episode [N]: [Date] - [PodcastTitle]").
* **Detail Page:** Episode details, HTML5 audio player, list of source HN stories with links to articles and HN discussions.
* **About Page:** Minimalist, explaining the service, consistent theme.

**d. Accessibility Aspirations (MVP):**
* Standard considerations: good contrast (critical for theme), keyboard navigation, basic screen reader compatibility.

**e. Branding Considerations (High-Level):**
* "80s retro everything" theme is central. Logo/typeface should complement this (e.g., pixel art, retro fonts).

**f. Target Devices/Platforms:**
* Responsive web application, good UX on desktop and mobile.

## 5. Technical Assumptions

**a. Core Technology Stack & Approach:**
* **Full TypeScript Stack:** TypeScript for frontend and backend.
* **Frontend:** Next.js (React), Node.js 22. Styling: Tailwind CSS, shadcn/ui. Hosting: Static site on AWS S3 (via CloudFront).
* **Backend:** Node.js 22, TypeScript. HTTP Client: `axios`. Compute: AWS Lambda. Database: AWS DynamoDB.
* **Infrastructure as Code (IaC):** All AWS infrastructure via AWS CDK.
* **Key External Services/APIs:** Algolia HN Search API (posts/comments), Play.ai PlayNote API (audio gen, user has subscription, polling for status), Custom scraping for articles (TypeScript with Cheerio, Readability.js, potentially Puppeteer/Playwright).
* **Automation:** Daily trigger via Amazon EventBridge Scheduler. Orchestration via AWS Step Functions.
* **Configuration & Secrets:** Environment variables (`.env` local & gitignored, Lambda env vars).
* **Coding Standards:** JSDoc for functions, inline comments for clarity. ESLint, Prettier.

**b. Repository Structure & Service Architecture:**
* **Repository Structure:** Polyrepo (separate Git repositories for `bmad-daily-digest-frontend` and `bmad-daily-digest-backend`).
* **High-Level Service Architecture:** Backend is serverless functions (AWS Lambda) for distinct tasks, orchestrated by Step Functions. API layer via AWS API Gateway to expose backend to frontend.

## 6. Epic Overview

This section details the Epics and their User Stories for the MVP.

**Epic 1: Backend Foundation, Tooling & "Hello World" API**
* **Goal:** To establish the core backend project infrastructure in its dedicated repository, including robust development tooling and initial AWS CDK setup for essential services. By the end of this epic:
    1.  A simple "hello world" API endpoint (AWS API Gateway + Lambda) **must** be deployed and testable via `curl`, returning a dynamic message.
    2.  The backend project **must** have ESLint, Prettier, Jest (unit testing), and esbuild (TypeScript bundling) configured and operational.
    3.  Basic unit tests **must** exist for the "hello world" Lambda function.
    4.  Code formatting and linting checks **should** be integrated into a pre-commit hook and/or a basic CI pipeline stub.
* **User Stories for Epic 1:**

    **Story 1.1: Initialize Backend Project using TS-TEMPLATE-STARTER**
    * **User Story Statement:** As a Developer, I want to create the `bmad-daily-digest-backend` Git repository and initialize it using the existing `TS-TEMPLATE-STARTER`, ensuring all foundational tooling (TypeScript, Node.js 22, ESLint, Prettier, Jest, esbuild) is correctly configured and operational for this specific project, so that I have a high-quality, standardized development environment ready for application logic.
    * **Acceptance Criteria (ACs):**
        1.  A new, private Git repository named `bmad-daily-digest-backend` **must** be created on GitHub.
        2.  The contents of the `TS-TEMPLATE-STARTER` project **must** be copied/cloned into this new repository.
        3.  `package.json` **must** be updated (project name, version, description).
        4.  Project dependencies **must** be installable.
        5.  TypeScript setup (`tsconfig.json`) **must** be verified for Node.js 22, esbuild compatibility; project **must** compile.
        6.  ESLint and Prettier configurations **must** be operational; lint/format scripts **must** execute successfully.
        7.  Jest configuration **must** be operational; test scripts **must** execute successfully with any starter example tests.
        8.  Irrelevant generic demo code from starter **should** be removed. `index.ts`/`index.test.ts` can remain as placeholders.
        9.  A standard `.gitignore` and an updated project `README.md` **must** be present.

    **Story 1.2: Pre-commit Hook Implementation**
    * **User Story Statement:** As a Developer, I want pre-commit hooks automatically enforced in the `bmad-daily-digest-backend` repository, so that code quality standards (like linting and formatting) are checked and applied to staged files before any code is committed, thereby maintaining codebase consistency and reducing trivial errors.
    * **Acceptance Criteria (ACs):**
        1.  A pre-commit hook tool (e.g., Husky) **must** be installed and configured.
        2.  A tool for running linters/formatters on staged files (e.g., `lint-staged`) **must** be installed and configured.
        3.  Pre-commit hook **must** trigger `lint-staged` on staged `.ts` files.
        4.  `lint-staged` **must** be configured to run ESLint (`--fix`) and Prettier (`--write`).
        5.  Attempting to commit files with auto-fixable issues **must** result in fixes applied and successful commit.
        6.  Attempting to commit files with non-auto-fixable linting errors **must** abort the commit with error messages.
        7.  Committing clean files **must** proceed without issues.

    **Story 1.3: "Hello World" Lambda Function Implementation & Unit Tests**
    * **User Story Statement:** As a Developer, I need a simple "Hello World" AWS Lambda function implemented in TypeScript within the `bmad-daily-digest-backend` project. This function, when invoked, should return a dynamic greeting message including the current date and time, and it must be accompanied by comprehensive Jest unit tests, so that our basic serverless compute functionality, testing setup, and TypeScript bundling are validated.
    * **Acceptance Criteria (ACs):**
        1.  A `src/handlers/helloWorldHandler.ts` file (or similar) **must** contain the Lambda handler.
        2.  Handler **must** be AWS Lambda compatible (event, context, Promise response).
        3.  Successful execution **must** return JSON: `statusCode: 200`, body with `message: "Hello from BMad Daily Digest Backend, today is [current_date] at [current_time]."`.
        4.  Date and time in message **must** be dynamic.
        5.  A corresponding Jest unit test file (e.g., `src/handlers/helloWorldHandler.test.ts`) **must** be created.
        6.  Unit tests **must** verify: 200 status, valid JSON body, expected `message` field, "Hello from..." prefix, dynamic date/time portion (use mocked `Date`).
        7.  All unit tests **must** pass.
        8.  esbuild configuration **must** correctly bundle the handler.

    **Story 1.4: AWS CDK Setup for "Hello World" API (Lambda & API Gateway)**
    * **User Story Statement:** As a Developer, I want to define the necessary AWS infrastructure (Lambda function and API Gateway endpoint) for the "Hello World" service using AWS CDK (Cloud Development Kit) in TypeScript, so that the infrastructure is version-controlled, repeatable, and can be deployed programmatically.
    * **Acceptance Criteria (ACs):**
        1.  AWS CDK (v2) **must** be a development dependency.
        2.  CDK app structure **must** be initialized (e.g., in `cdk/` or `infra/`).
        3.  A new CDK stack (e.g., `BmadDailyDigestBackendStack`) **must** be defined in TypeScript.
        4.  CDK stack **must** define an AWS Lambda resource for the "Hello World" function (Node.js 22, bundled code reference, handler entry point, basic IAM role for CloudWatch logs, free-tier conscious settings).
        5.  CDK stack **must** define an AWS API Gateway (HTTP API preferred) with a route (e.g., `GET /hello`) triggering the Lambda.
        6.  CDK stack **must** be synthesizable (`cdk synth`) without errors.
        7.  CDK code **must** adhere to project ESLint/Prettier standards.
        8.  Mechanism for passing Lambda environment variables via CDK (if any needed for "Hello World") **must** be in place.

    **Story 1.5: "Hello World" API Deployment & Manual Invocation Test**
    * **User Story Statement:** As a Developer, I need to deploy the "Hello World" API (defined in AWS CDK) to an AWS environment and successfully invoke its endpoint using a tool like `curl`, so that I can verify the end-to-end deployment process and confirm the basic API is operational in the cloud.
    * **Acceptance Criteria (ACs):**
        1.  The AWS CDK stack for "Hello World" API **must** deploy successfully to a designated AWS account/region.
        2.  The API Gateway endpoint URL for `/hello` **must** be retrievable post-deployment.
        3.  A `GET` request to the deployed `/hello` endpoint **must** receive a response.
        4.  HTTP response status **must** be 200 OK.
        5.  Response body **must** be JSON containing the expected dynamic "Hello..." message.
        6.  Basic Lambda invocation logs **must** be visible in AWS CloudWatch Logs.

    **Story 1.6: Basic CI/CD Pipeline Stub with Quality Gates**
    * **User Story Statement:** As a Developer, I need a basic Continuous Integration (CI) pipeline established for the `bmad-daily-digest-backend` repository, so that code quality checks (linting, formatting, unit tests) and the build process are automated upon code pushes and pull requests, ensuring early feedback and maintaining codebase health.
    * **Acceptance Criteria (ACs):**
        1.  A CI workflow file (e.g., GitHub Actions in `.github/workflows/main.yml`) **must** be created.
        2.  Pipeline **must** trigger on pushes to `main` and PRs targeting `main`.
        3.  Pipeline **must** include steps for: checkout, Node.js 22 setup, dependency install, ESLint check, Prettier format check, Jest unit tests, esbuild bundle.
        4.  Pipeline **must** fail if any lint, format, test, or bundle step fails.
        5.  A successful CI run on the `main` branch (with "Hello World" code) **must** be demonstrated.
        6.  CI pipeline for MVP **does not** need to perform AWS deployment; focus is on quality gates.

---
**Epic 2: Automated Content Ingestion & Podcast Generation Pipeline**

**Goal:** To implement the complete automated daily workflow within the backend. This includes fetching Hacker News post data, scraping and extracting content from linked external articles, aggregating and formatting text, submitting it to Play.ai, managing job status via polling, and retrieving/storing the final audio file and associated metadata. This epic delivers the core value proposition of generating the daily audio content and making it ready for consumption via an API.

**User Stories for Epic 2:**

**Story 2.1: AWS CDK Extension for Epic 2 Resources**
* **User Story Statement:** As a Developer, I need to extend the existing AWS CDK stack within the `bmad-daily-digest-backend` project to define and provision all new AWS resources required for the content ingestion and podcast generation pipeline—including a DynamoDB table for episode and processed post metadata, an S3 bucket for audio storage, and the AWS Step Functions state machine for orchestrating the Play.ai job status polling—so that all backend infrastructure for this epic is managed as code and ready for the application logic.
* **Acceptance Criteria (ACs):**
    1.  The existing AWS CDK application (from Epic 1) **must** be extended with new resource definitions for Epic 2.
    2.  A DynamoDB table (e.g., `BmadDailyDigestEpisodes`) **must** be defined via CDK for episode metadata, with `episodeId` (String UUID) as PK, key attributes (`publicationDate`, `episodeNumber`, `podcastGeneratedTitle`, `audioS3Key`, `audioS3Bucket`, `playAiJobId`, `playAiSourceAudioUrl`, `sourceHNPosts` (List of objects: `{ hnPostId, title, originalArticleUrl, hnLink, isUpdateStatus, lastCommentFetchTimestamp, oldRank }`), `status`, `createdAt`), and PAY_PER_REQUEST billing.
    3.  A DynamoDB table or GSI strategy **must** be defined via CDK to efficiently track processed Hacker News posts (`hnPostId`) and their `lastCommentFetchTimestamp` to support the "new comments only" feature.
    4.  An S3 bucket (e.g., `bmad-daily-digest-audio-{unique-suffix}`) **must** be defined via CDK for audio storage, with private access.
    5.  An AWS Step Functions state machine **must** be defined via CDK to manage the Play.ai job status polling workflow (details in Story 2.6).
    6.  Necessary IAM roles/permissions for Lambdas to interact with DynamoDB, S3, Step Functions, CloudWatch Logs **must** be defined via CDK.
    7.  The updated CDK stack **must** synthesize (`cdk synth`) and deploy (`cdk deploy`) successfully.
    8.  All new CDK code **must** adhere to project ESLint/Prettier standards.

**Story 2.2: Fetch Top Hacker News Posts & Identify Repeats**
* **User Story Statement:** As the System, I need to reliably fetch the top N (configurable, e.g., 10) current Hacker News posts daily using the Algolia HN API, including their essential metadata. I also need to identify if each fetched post has been processed in a recent digest by checking against stored data, so that I have an accurate list of stories and their status (new or repeat) to begin generating the daily digest.
* **Acceptance Criteria (ACs):**
    1.  A `hackerNewsService.ts` function **must** fetch top N HN posts (stories only) via `axios` from Algolia API (configurable `HN_POSTS_COUNT`).
    2.  Extracted metadata per post: Title, Article URL, HN Post URL, HN Post ID (`objectID`), Author, Points, Creation timestamp.
    3.  For each post, the function **must** query DynamoDB (see Story 2.1 AC#3) to determine its `isUpdateStatus` (true if recently processed and article scraped) and retrieve `lastCommentFetchTimestamp` and `oldRank` if available.
    4.  Function **must** return an array of HN post objects with metadata, `isUpdateStatus`, `lastCommentFetchTimestamp`, and `oldRank`.
    5.  Error handling for Algolia/DynamoDB calls **must** be implemented and logged.
    6.  Unit tests (Jest) **must** verify API calls, data extraction, repeat identification (mocked DDB), and error handling. All tests **must** pass.

**Story 2.3: Article Content Scraping & Extraction (Conditional)**
* **User Story Statement:** As the System, for each Hacker News post identified as *new* (or for which article scraping previously failed), I need to robustly fetch its HTML content from the linked article URL and extract the primary textual content and title. If scraping fails, a fallback mechanism must be triggered using available HN metadata and signaling the need for increased comments.
* **Acceptance Criteria (ACs):**
    1.  An `articleScraperService.ts` function **must** accept an article URL and `isUpdateStatus`.
    2.  If `isUpdateStatus` is true (article already scraped and good), scraping **must** be skipped, and a success status indicating no new scrape needed is returned (or pre-existing content reference).
    3.  If new scrape needed: use `axios` (timeout, User-Agent) to fetch HTML.
    4.  Use `Mozilla Readability` (JS port) or similar to extract main article text and title.
    5.  Return `{ success: true, title: string, content: string, ... }` on success.
    6.  If scraping fails: log failure, return `{ success: false, error: string, fallbackNeeded: true }`.
    7.  No "polite" inter-article scraping delays for MVP.
    8.  Unit tests (Jest) **must** mock `axios`, test successful extraction, skip logic, and failure/fallback scenarios. All tests **must** pass.

**Story 2.4: Fetch Hacker News Comments (Conditional Logic)**
* **User Story Statement:** As the System, I need to fetch comments for each selected Hacker News post using the Algolia HN API, adjusting the strategy based on whether the post is new, a repeat (requiring only new comments), or if its article scraping failed (requiring more comments).
* **Acceptance Criteria (ACs):**
    1.  `hackerNewsService.ts` **must** be extended to fetch comments for an HN Post ID, accepting `isUpdateStatus`, `lastCommentFetchTimestamp`, and `articleScrapingFailed` flags.
    2.  Use `axios` to call Algolia HN API item endpoint (`/api/v1/items/[POST_ID]`).
    3.  **Comment Fetching Logic:**
        * If `articleScrapingFailed`: Fetch up to 3x `HN_COMMENTS_COUNT_PER_POST` (configurable, e.g., ~150) available comments (top-level first, then immediate children, by Algolia sort order).
        * If `isUpdateStatus` (repeat post): Fetch all comments, then filter client-side for comments with `created_at_i` > `lastCommentFetchTimestamp`. Select up to `HN_COMMENTS_COUNT_PER_POST` of these *new* comments.
        * Else (new post, successful scrape): Fetch up to `HN_COMMENTS_COUNT_PER_POST` (configurable, e.g., ~50) available comments.
    4.  Extract plain text (HTML stripped), author, creation timestamp for selected comments.
    5.  Return array of comment objects; empty if none.
    6.  Error handling and logging for API calls.
    7.  Unit tests (Jest) **must** mock `axios` and verify all conditional fetching logic, comment selection/filtering, data extraction (HTML stripping), and error handling. All tests **must** pass.

**Story 2.5: Content Aggregation and Formatting for Play.ai**
* **User Story Statement:** As the System, I need to aggregate the collected Hacker News post data (titles), associated article content (full, truncated, or fallback summary), and comments (new, updated, or extended sets) for all top stories, and format this combined text according to the specified structure for the play.ai PlayNote API, including special phrasing for different post types (new, update, scrape-failed), so that it's ready for podcast generation.
* **Acceptance Criteria (ACs):**
    1.  A `contentFormatterService.ts` **must** be implemented.
    2.  It **must** accept an array of processed HN post objects (containing all necessary metadata, statuses, content, and comments).
    3.  Output **must** be a single string.
    4.  String **must** start: "It's a top 10 countdown for [Current Date]".
    5.  Posts **must** be sequenced in reverse rank order.
    6.  **Formatting for standard new post:** "Story [Rank] - [Article Title]. [Full/Truncated Article Text]. Comments Section. [Number] comments follow. Comment 1: [Text]. Comment 2: [Text]..."
    7.  **Formatting for repeat post (update):** "Story [Rank] (previously Rank [OldRank] yesterday) - [Article Title]. We're bringing you new comments on this popular story. Comments Section. [Number] new comments follow. Comment 1: [Text]..."
    8.  **Formatting for scrape-failed post:** "Story [Rank] - [Article Title]. We couldn't retrieve the full article, but here's a summary if available and the latest comments. [Optional HN Summary]. Comments Section. [Number] comments follow. Comment 1: [Text]..."
    9.  **Article Truncation:** If `MAX_ARTICLE_LENGTH` (env var) is set and article exceeds, truncate by attempting to preserve beginning and end (or simpler first X / last Y characters for MVP).
    10. Graceful handling for missing parts (e.g., "Article content not available," "0 comments follow") **must** be implemented.
    11. Unit tests (Jest) **must** verify all formatting variations, truncation, data merging, and error handling. All tests **must** pass.

**Story 2.6 (REVISED): Implement Podcast Generation Status Polling via Play.ai API**
* **User Story Statement:** As the System, after submitting a podcast generation job to Play.ai and receiving a `jobId`, I need an AWS Step Function state machine to periodically poll the Play.ai API for the status of this specific job, continuing until the job is reported as "completed" or "failed" (or a configurable max duration/attempts limit is reached), so the system can reliably determine when the podcast audio is ready or if an error occurred.
* **Acceptance Criteria (ACs):**
    1.  The AWS Step Function state machine (CDK defined in Story 2.1) **must** manage the polling workflow.
    2.  Input: `jobId`.
    3.  States: Invoke Poller Lambda (calls Play.ai status endpoint with `axios`), Wait (configurable `POLLING_INTERVAL_MINUTES`), Choice (evaluates status).
    4.  Loop if status is "processing".
    5.  Stop if "completed" or "failed".
    6.  Max polling duration/attempts (configurable env vars `MAX_POLLING_DURATION_MINUTES`, `MAX_POLLING_ATTEMPTS`) **must** be enforced, treating expiry as failure.
    7.  If "completed": extract `audioUrl`, trigger next step (Story 2.8 process) with data.
    8.  If "failed"/"timeout": log event, record failure, terminate.
    9.  Poller Lambda handles Play.ai API errors gracefully.
    10. Unit tests for Poller Lambda; Step Function definition tested. All tests **must** pass.

**Story 2.7: Submit Content to Play.ai PlayNote API & Initiate Podcast Generation**
* **User Story Statement:** As the System, I need to securely submit the aggregated and formatted text content (using `sourceText`) to the play.ai PlayNote API via an `application/json` request to initiate the podcast generation process, and I must capture the `jobId` returned by Play.ai, so that this `jobId` can be passed to the status polling mechanism (Step Function).
* **Acceptance Criteria (ACs):**
    1.  A `playAiService.ts` function **must** handle submission.
    2.  Input: formatted text (from Story 2.5).
    3.  Use `axios` for `POST` to Play.ai endpoint (e.g., `https://api.play.ai/api/v1/playnotes`).
    4.  Request `Content-Type: application/json`.
    5.  JSON body: `sourceText`, and configurable `title`, `voiceId1`, `name1`, `voiceId2`, `name2`, `styleGuidance` (from env vars). *Developer to confirm exact field names per Play.ai JSON API for text input.*
    6.  Headers: `Authorization: Bearer [TOKEN]`, `X-USER-ID: [API_KEY]` (from env vars `PLAY_AI_BEARER_TOKEN`, `PLAY_AI_USER_ID`).
    7.  No `webHookUrl` sent.
    8.  On success: extract `jobId`, log it, initiate polling Step Function (Story 2.6) with `jobId`.
    9.  Error handling for API submission.
    10. Unit tests (Jest) mock `axios`, verify API call, auth, payload, `jobId` extraction, Step Function initiation, error handling. All tests **must** pass.

**Story 2.8: Retrieve, Store Generated Podcast Audio & Persist Episode Metadata**
* **User Story Statement:** As the System, once the podcast generation status polling (Story 2.6) indicates a Play.ai job is "completed," I need to download the generated audio file from the provided `audioUrl`, store this file in our designated S3 bucket, and then save all relevant metadata for the episode (including the S3 audio location, `episodeNumber`, `podcastGeneratedTitle`, `playAiSourceAudioUrl`, and source information like `isUpdateStatus` for each HN story, and `lastCommentFetchTimestamp` for each HN post) into our DynamoDB table, so that the daily digest is fully processed, archived, and ready for access.
* **Acceptance Criteria (ACs):**
    1.  A `podcastStorageService.ts` function **must** be triggered by Step Function (Story 2.6) on "completed" status, receiving `audioUrl`, Play.ai `jobId`, and original context (list of source HN posts with their processing statuses & metadata).
    2.  Use `axios` to download audio from `audioUrl`.
    3.  Upload audio to S3 bucket (from Story 2.1), using key (e.g., `YYYY/MM/DD/episodeId.mp3`).
    4.  Prepare episode metadata: `episodeId` (UUID), `publicationDate` (YYYY-MM-DD), `episodeNumber` (sequential logic), `podcastGeneratedTitle` (from Play.ai or constructed), `audioS3Bucket`, `audioS3Key`, `playAiJobId`, `playAiSourceAudioUrl`, `sourceHNPosts` (array of objects: `{ hnPostId, title, originalArticleUrl, hnLink, isUpdateStatus, lastCommentFetchTimestamp, oldRank }`), `status: "Published"`, `createdAt`.
    5.  The `lastCommentFetchTimestamp` for each processed `hnPostId` in `sourceHNPosts` **must** be set to the current time (or comment processing time) for future "new comments only" logic.
    6.  Save metadata to `BmadDailyDigestEpisodes` DynamoDB table.
    7.  Error handling for download, S3 upload, DDB write; failure sets episode status to "Failed".
    8.  Unit tests (Jest) mock `axios`, AWS SDK (S3, DynamoDB); verify data handling, storage, metadata, errors. All tests **must** pass.

**Story 2.9: Daily Workflow Orchestration & Scheduling**
* **User Story Statement:** As the System Administrator, I need the entire daily backend workflow (Stories 2.2 through 2.8) to be fully orchestrated by the primary AWS Step Function state machine and automatically scheduled to run once per day using Amazon EventBridge Scheduler, ensuring it handles re-runs for the same day by overwriting/starting over (for MVP), so that "BMad Daily Digest" episodes are produced consistently and reliably.
* **Acceptance Criteria (ACs):**
    1.  The primary AWS Step Function state machine **must** orchestrate the sequence: Call Lambdas/services for Fetch HN Posts (2.2), then for each post: Scrape Article (2.3) & Fetch Comments (2.4); then Aggregate & Format (2.5); then Submit to Play.ai (2.7 which returns `jobId`); then initiate Polling (2.6 using `jobId`); on "completed" polling, trigger Retrieve & Store Audio/Metadata (2.8).
    2.  State machine **must** manage data flow between steps.
    3.  Overall workflow error handling: critical step failure marks state machine execution as "Failed" and logs comprehensively. Individual steps use retries for transient errors.
    4.  **Idempotency (MVP):** Re-running for the same `publicationDate` **must** re-process and overwrite previous data for that date.
    5.  Amazon EventBridge Scheduler rule (CDK defined) **must** trigger the main Step Function daily at 12:00 UTC (default, configurable via `DAILY_JOB_SCHEDULE_UTC_CRON`).
    6.  Successful end-to-end run **must** be demonstrated.
    7.  Step Function execution history **must** provide a clear audit trail.
    8.  Unit tests for any new orchestrator-specific Lambda functions. All tests **must** pass.

---
**Epic 3: Web Application MVP & Podcast Consumption**

**Goal:** To set up the frontend project in its dedicated repository and develop and deploy the Next.js frontend application MVP, enabling users to consume the "BMad Daily Digest." This includes initial project setup (AI-assisted UI kickstart), pages for listing and detailing episodes, an about page, and deployment.

**User Stories for Epic 3:**

**Story 3.1: Frontend Project Repository & Initial UI Setup (AI-Assisted)**
* **User Story Statement:** As a Developer, I need to establish the `bmad-daily-digest-frontend` Git repository with a new Next.js (TypeScript, Node.js 22) project. This foundational setup must include essential development tooling (ESLint, Prettier, Jest with React Testing Library, a basic CI stub), and integrate an initial UI structure and core presentational components—kickstarted by an AI UI generation tool—styled with Tailwind CSS and shadcn/ui to embody the "80s retro CRT terminal" aesthetic, so that a high-quality, styled, and standardized frontend development environment is ready for building application features.
* **Acceptance Criteria (ACs):**
    1.  A new, private Git repository `bmad-daily-digest-frontend` **must** be created on GitHub.
    2.  A Next.js project (TypeScript, targeting Node.js 22) **must** be initialized.
    3.  Tooling (ESLint for Next.js/React/TS, Prettier, Jest with React Testing Library) **must** be installed and configured.
    4.  NPM scripts for lint, format, test, build **must** be in `package.json`.
    5.  Tailwind CSS and `shadcn/ui` **must** be installed and configured.
    6.  An initial UI structure (basic page layout, placeholder pages for List, Detail, About) and a few core presentational components (themed buttons, text display) **must** be generated using an agreed-upon AI UI generation tool, targeting the "80s retro CRT terminal" aesthetic.
    7.  The AI-generated UI code **must** be integrated into the Next.js project.
    8.  The application **must** build successfully with the initial UI.
    9.  A basic CI pipeline stub (GitHub Actions) for lint, format check, test, build **must** be created.
    10. A standard Next.js `.gitignore` and an updated `README.md` **must** be present.

**Story 3.2: Frontend API Service Layer for Backend Communication**
* **User Story Statement:** As a Frontend Developer, I need a dedicated and well-typed API service layer within the Next.js frontend application to manage all HTTP communication with the "BMad Daily Digest" backend API (for fetching episode lists and specific episode details), so that UI components can cleanly and securely consume backend data with robust error handling.
* **Acceptance Criteria (ACs):**
    1.  A TypeScript module (e.g., `src/services/apiClient.ts`) **must** encapsulate backend API interactions.
    2.  Functions **must** exist for: fetching all podcast episodes (e.g., `getEpisodes()`) and fetching details for a single episode by `episodeId` (e.g., `getEpisodeDetails(episodeId)`).
    3.  `axios` **must** be used for HTTP requests.
    4.  Backend API base URL **must** be configurable via `NEXT_PUBLIC_BACKEND_API_URL`.
    5.  TypeScript interfaces (e.g., `EpisodeListItem`, `EpisodeDetail`, `SourceHNStory`) for API response data **must** be defined, matching data structure from backend (Story 2.8).
    6.  API functions **must** correctly parse JSON responses and transform data into defined frontend interfaces.
    7.  Error handling (network errors, non-2xx responses) **must** be implemented, providing clear error information.
    8.  Unit tests (Jest) **must** mock `axios` and verify API calls, data parsing/transformation, and error handling. All tests **must** pass.

**Story 3.3: Episode List Page Implementation**
* **User Story Statement:** As a Busy Tech Executive, I want to view a responsive "Episode List Page" that clearly displays all available "BMad Daily Digest" episodes in reverse chronological order, showing the episode number, publication date, and podcast title for each, so that I can quickly find and select the latest or a specific past episode to listen to.
* **Acceptance Criteria (ACs):**
    1.  A Next.js page component (e.g., `src/app/page.tsx` or `src/app/episodes/page.tsx`) **must** be created.
    2.  It **must** use the API service layer (Story 3.2) to fetch episodes.
    3.  A themed loading state **must** be shown during data fetching.
    4.  An error message **must** be shown if fetching fails.
    5.  A "No episodes available yet" message **must** be shown for an empty list.
    6.  Episodes **must** be listed in reverse chronological order (newest first), based on `publicationDate` or `episodeNumber`.
    7.  Each list item **must** display "Episode [EpisodeNumber]: [PublicationDate] - [PodcastGeneratedTitle]".
    8.  Each item **must** link to the Episode Detail Page for that episode using its `episodeId`.
    9.  Styling **must** adhere to the "80s retro CRT terminal" aesthetic.
    10. The page **must** be responsive.
    11. Unit/integration tests (Jest with RTL) **must** cover loading, error, no episodes, list rendering, data display, order, and navigation. All tests **must** pass.

**Story 3.4: Episode Detail Page Implementation**
* **User Story Statement:** As a Busy Tech Executive, after selecting a podcast episode from the list, I want to be taken to a responsive "Episode Detail Page" where I can easily play the audio using a standard HTML5 player, see a clear breakdown of the Hacker News stories discussed in that episode, and have direct links to explore both the original articles and the Hacker News comment threads, so I can listen to the digest and dive deeper into topics of interest.
* **Acceptance Criteria (ACs):**
    1.  A Next.js dynamic route page (e.g., `src/app/episodes/[episodeId]/page.tsx`) **must** be created.
    2.  It **must** accept `episodeId` from the URL.
    3.  It **must** use the API service layer (Story 3.2) to fetch details for the `episodeId`.
    4.  Loading and error states **must** be handled.
    5.  If data is found, it **must** display: `podcastGeneratedTitle`, `publicationDate`, `episodeNumber`.
    6.  An embedded HTML5 audio player (`<audio controls>`) **must** play the podcast. The `src` **must** be the publicly accessible URL for the audio file (e.g., a CloudFront URL pointing to the S3 object).
    7.  A list of included Hacker News stories (from the `sourceHNPosts` array in the episode data) **must** be displayed.
    8.  For each HN story in the list: its title, a link to the `originalArticleUrl` (opening in new tab), and a link to its `hnLink` (opening in new tab) **must** be displayed.
    9.  Styling **must** adhere to the "80s retro CRT terminal" aesthetic.
    10. The page **must** be responsive.
    11. Unit/integration tests (Jest with RTL) **must** cover loading, error, rendering of all details, player presence, and correct link generation. All tests **must** pass.

**Story 3.5: "About" Page Implementation**
* **User Story Statement:** As a User, I want to access a minimalist, responsive, and consistently styled "About Page" that clearly explains what the "BMad Daily Digest" service is, its core purpose, and how it works at a high level, so that I can quickly understand the value and nature of the service.
* **Acceptance Criteria (ACs):**
    1.  A Next.js page component (e.g., `src/app/about/page.tsx`) **must** be created.
    2.  It **must** display static informational content (placeholder text: "BMad Daily Digest provides a daily audio summary of top Hacker News discussions for busy tech professionals, generated using AI.").
    3.  Content **must** explain: What "BMad Daily Digest" is, its purpose, and a high-level overview of generation.
    4.  Styling **must** adhere to the "80s retro CRT terminal" aesthetic.
    5.  The page **must** be responsive.
    6.  A link to the "About Page" **must** be accessible (e.g., in site navigation/footer, specific location defined by Story 3.1's AI-generated layout).
    7.  Unit tests (Jest with RTL) **must** verify rendering of static content. All tests **must** pass.

**Story 3.6: Frontend Deployment to S3 & CloudFront via CDK**
* **User Story Statement:** As a Developer, I need the Next.js frontend application to be configured for static export (or an equivalent static-first deployment model) and have its AWS infrastructure (S3 for hosting, CloudFront for CDN and HTTPS) defined and managed via AWS CDK. This setup should automate the deployment of the static site, making the "BMad Daily Digest" web application publicly accessible, performant, and cost-effective.
* **Acceptance Criteria (ACs):**
    1.  The Next.js application **must** be configured for static export suitable for S3/CloudFront hosting.
    2.  AWS CDK scripts (managed in the `bmad-daily-digest-backend` repo's CDK app for unified IaC, unless Architect advises a separate frontend CDK app) **must** define the frontend S3 bucket and CloudFront distribution.
    3.  CDK stack **must** define: S3 bucket (static web hosting), CloudFront distribution (S3 origin, HTTPS via default CloudFront domain or ACM cert for custom domain if specified, caching behaviors, OAC/OAI).
    4.  A `package.json` build script **must** generate the static output (e.g., to `out/`).
    5.  The CDK deployment process (or related script) **must** include steps to build the Next.js app and sync static files to S3.
    6.  The application **must** be accessible via its CloudFront URL.
    7.  All MVP functionalities **must** be operational on the deployed site.
    8.  HTTPS **must** be enforced.
    9.  CDK code **must** meet project standards.

## 7. Key Reference Documents
*{This section will be populated later with links to the final PRD, Architecture Document, UI/UX Specification, etc.}*

## 8. Out of Scope Ideas Post MVP
* **Advanced Audio Player Functionality:** Custom controls (skip +/- 15s), playback speed adjustment, remembering playback position.
* **User Accounts & Personalization:** User creation, email subscription management, customizable podcast hosts.
* **Enhanced Content Delivery & Discovery:** Daily email summary, full RSS feed, full podcast transcription on website, search functionality.
* **Expanded Content Sources:** Beyond Hacker News.
* **Community & Feedback:** In-app feedback mechanisms.

## 9. Change Log

| Change                                      | Date          | Version | Description                                                                 | Author        |
| :------------------------------------------ | :------------ | :------ | :-------------------------------------------------------------------------- | :------------ |
| Initial PRD draft and MVP scope definition. | May 20, 2025  | 0.1     | Created initial PRD based on Project Brief; defined Epics & detailed Stories. | John (PM) & User |
