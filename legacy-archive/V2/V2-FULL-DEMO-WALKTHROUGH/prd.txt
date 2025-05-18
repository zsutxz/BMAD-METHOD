# BMad Hacker Daily Digest Product Requirements Document (PRD)

## Intro

The BMad Hacker Daily Digest is a command-line tool designed to address the time-consuming nature of reading extensive Hacker News (HN) comment threads. It aims to provide users with a time-efficient way to grasp the collective intelligence and key insights from discussions on top HN stories. The service will fetch the top 10 HN stories daily, retrieve a configurable number of comments for each, attempt to scrape the linked article, generate separate summaries for the article (if scraped) and the comment discussion using a local LLM, and deliver these summaries in a single daily email briefing triggered manually. This project also serves as a practical learning exercise in agent-driven development, TypeScript, Node.js, API integration, and local LLM usage, starting from the provided "bmad-boilerplate" template.

## Goals and Context

- **Project Objectives:**
  - Provide a quick, reliable, automated way to stay informed about key HN discussions without reading full threads.
  - Successfully fetch top 10 HN story metadata via Algolia HN API.
  - Retrieve a _configurable_ number of comments per story (default 50) via Algolia HN API.
  - Attempt basic scraping of linked article content, handling failures gracefully.
  - Generate distinct Article Summaries (if scraped) and Discussion Summaries using a local LLM (Ollama).
  - Assemble summaries for 10 stories into an HTML email and send via Nodemailer upon manual CLI trigger.
  - Serve as a learning platform for agent-driven development, TypeScript, Node.js v22, API integration, local LLMs, and configuration management, leveraging the "bmad-boilerplate" structure and tooling.
- **Measurable Outcomes:**
  - The tool completes its full process (fetch, scrape attempt, summarize, email) without crashing on manual CLI trigger across multiple test runs.
  - The generated email digest consistently contains results for 10 stories, including correct links, discussion summaries, and article summaries where scraping was successful.
  - Errors during article scraping are logged, and the process continues for affected stories using only comment summaries, without halting the script.
- **Success Criteria:**
  - Successful execution of the end-to-end process via CLI trigger for 3 consecutive test runs.
  - Generated email is successfully sent and received, containing summaries for all 10 fetched stories (article summary optional based on scraping success).
  - Scraping failures are logged appropriately without stopping the overall process.
- **Key Performance Indicators (KPIs):**
  - Successful Runs / Total Runs (Target: 100% for MVP tests)
  - Stories with Article Summaries / Total Stories (Measures scraping effectiveness)
  - Stories with Discussion Summaries / Total Stories (Target: 100%)
  * Manual Qualitative Check: Relevance and coherence of summaries in the digest.

## Scope and Requirements (MVP / Current Version)

### Functional Requirements (High-Level)

- **HN Story Fetching:** Retrieve IDs and metadata (title, URL, HN link) for the top 10 stories from Algolia HN Search API.
- **HN Comment Fetching:** For each story, retrieve comments from Algolia HN Search API up to a maximum count defined in a `.env` configuration variable (`MAX_COMMENTS_PER_STORY`, default 50).
- **Article Content Scraping:** Attempt to fetch HTML and extract main text content from the story's external URL using basic methods (e.g., Node.js native fetch, optionally `article-extractor` or similar basic library).
- **Scraping Failure Handling:** If scraping fails, log the error and proceed with generating only the Discussion Summary for that story.
- **LLM Summarization:**
  - Generate an "Article Summary" from scraped text (if successful) using a configured local LLM (Ollama endpoint).
  - Generate a "Discussion Summary" from the fetched comments using the same LLM.
  - Initial Prompts (Placeholders - refine in Epics):
    - _Article Prompt:_ "Summarize the key points of the following article text: {Article Text}"
    - _Discussion Prompt:_ "Summarize the main themes, viewpoints, and key insights from the following Hacker News comments: {Comment Texts}"
- **Digest Formatting:** Combine results for the 10 stories into a single HTML email. Each story entry should include: Story Title, HN Link, Article Link, Article Summary (if available), Discussion Summary.
- **Email Dispatch:** Send the formatted HTML email using Nodemailer to a recipient list defined in `.env`. Use credentials also stored in `.env`.
- **Main Execution Trigger:** Initiate the _entire implemented pipeline_ via a manual command-line interface (CLI) trigger, using the standard scripts defined in the boilerplate (`npm run dev`, `npm start` after build). Each functional epic should add its capability to this main execution flow.
- **Configuration:** Manage external parameters (Algolia API details (if needed), LLM endpoint URL, `MAX_COMMENTS_PER_STORY`, Nodemailer credentials, recipient email list, output directory path) via a `.env` file, based on the provided `.env.example`.
- **Incremental Logging & Data Persistence:**
  - Implement basic console logging for key steps and errors throughout the pipeline.
  - Persist intermediate data artifacts (fetched stories/comments, scraped text, generated summaries) to local files within a configurable, date-stamped directory structure (e.g., `./output/YYYY-MM-DD/`).
  - This persistence should be implemented incrementally within the relevant functional epics (Data Acquisition, Scraping, Summarization).
- **Stage Testing Utilities:**
  - Provide separate utility scripts or CLI commands to allow testing individual pipeline stages in isolation (e.g., fetching HN data, scraping URLs, summarizing text, sending email).
  - These utilities should support using locally saved files as input (e.g., test scraping using a file containing story URLs, test summarization using a file containing text). This facilitates development and debugging.

### Non-Functional Requirements (NFRs)

- **Performance:** MVP focuses on functionality over speed. Should complete within a reasonable time (e.g., < 5 minutes) on a typical developer machine for local LLM use. No specific response time targets.
- **Scalability:** Designed for single-user, local execution. No scaling requirements for MVP.
- **Reliability/Availability:**
  - The script must handle article scraping failures gracefully (log and continue).
  - Basic error handling for API calls (e.g., log network errors).
  - Local LLM interaction may fail; basic error logging is sufficient for MVP.
  - No requirement for automated retries or production-grade error handling.
- **Security:**
  - Email credentials must be stored securely via `.env` file and not committed to version control (as per boilerplate `.gitignore`).
  - No other specific security requirements for local MVP.
- **Maintainability:**
  - Code should be well-structured TypeScript.
  - Adherence to the linting (ESLint) and formatting (Prettier) rules configured in the "bmad-boilerplate" is required. Use `npm run lint` and `npm run format`.
  - Modularity is desired to potentially swap LLM providers later and facilitate stage testing.
- **Usability/Accessibility:** N/A (CLI tool for developer).
- **Other Constraints:**
  - Must use TypeScript and Node.js v22.
  - Must run locally on the developer's machine.
  - Must use Node.js v22 native `Workspace` API for HTTP requests.
  - Must use Algolia HN Search API for HN data.
  - Must use a local Ollama instance via a configurable HTTP endpoint.
  - Must use Nodemailer for email dispatch.
  - Must use `.env` for configuration based on `.env.example`.
  - Must use local file system for logging and intermediate data storage. Ensure output/log directories are gitignored.
  - Focus on a functional pipeline for learning/demonstration.

### User Experience (UX) Requirements (High-Level)

- The primary UX goal is to deliver a time-saving digest.
- For the developer user, the main CLI interaction should be simple: using standard boilerplate scripts like `npm run dev` or `npm start` to trigger the full process.
- Feedback during CLI execution (e.g., "Fetching stories...", "Summarizing story X/10...", "Sending email...") is desirable via console logging.
- Separate CLI commands/scripts for testing individual stages should provide clear input/output mechanisms.

### Integration Requirements (High-Level)

- **Algolia HN Search API:** Fetching top stories and comments. Requires understanding API structure and query parameters.
- **Ollama Service:** Sending text (article content, comments) and receiving summaries via its API endpoint. Endpoint URL must be configurable.
- **SMTP Service (via Nodemailer):** Sending the final digest email. Requires valid SMTP credentials and recipient list configured in `.env`.

### Testing Requirements (High-Level)

- MVP success relies on manual end-to-end test runs confirming successful execution and valid email output.
- Unit/integration tests are encouraged using the **Jest framework configured in the boilerplate**. Focus testing effort on the core pipeline components. Use `npm run test`.
- **Stage-specific testing utilities (as defined in Functional Requirements) are required** to support development and verification of individual pipeline components.

## Epic Overview (MVP / Current Version)

_(Revised proposal)_

- **Epic 1: Project Initialization & Core Setup** - Goal: Initialize the project using "bmad-boilerplate", manage dependencies, setup `.env` and config loading, establish basic CLI entry point, setup basic logging and output directory structure.
- **Epic 2: HN Data Acquisition & Persistence** - Goal: Implement fetching top 10 stories and their comments (respecting limits) from Algolia HN API, and persist this raw data locally. Implement stage testing utility for fetching.
- **Epic 3: Article Scraping & Persistence** - Goal: Implement best-effort article scraping/extraction, handle failures gracefully, and persist scraped text locally. Implement stage testing utility for scraping.
- **Epic 4: LLM Summarization & Persistence** - Goal: Integrate with Ollama to generate article/discussion summaries from persisted data and persist summaries locally. Implement stage testing utility for summarization.
- **Epic 5: Digest Assembly & Email Dispatch** - Goal: Format collected summaries into an HTML email using persisted data and send it using Nodemailer. Implement stage testing utility for emailing (with dry-run option).

## Key Reference Documents

- `docs/project-brief.md`
- `docs/prd.md` (This document)
- `docs/architecture.md` (To be created by Architect)
- `docs/epic1.md`, `docs/epic2.md`, ... (To be created)
- `docs/tech-stack.md` (Partially defined by boilerplate, to be finalized by Architect)
- `docs/api-reference.md` (If needed for Algolia/Ollama details)
- `docs/testing-strategy.md` (Optional - low priority for MVP, Jest setup provided)

## Post-MVP / Future Enhancements

- Advanced scraping techniques (handling JavaScript, anti-bot measures).
- Processing all comments (potentially using MapReduce summarization).
- Automated scheduling (e.g., using cron).
- Database integration for storing results or tracking.
- Cloud deployment and web frontend.
- User management (sign-ups, preferences).
- Production-grade error handling, monitoring, and email deliverability.
- Fine-tuning LLM prompts or models.
- Sophisticated retry logic for API calls or scraping.
- Cloud LLM integration.

## Change Log

| Change                  | Date       | Version | Description                             | Author |
| ----------------------- | ---------- | ------- | --------------------------------------- | ------ |
| Refined Epics & Testing | 2025-05-04 | 0.3     | Removed Epic 6, added stage testing req | 2-pm   |
| Boilerplate Added       | 2025-05-04 | 0.2     | Updated to reflect use of boilerplate   | 2-pm   |
| Initial Draft           | 2025-05-04 | 0.1     | First draft based on brief              | 2-pm   |

## Initial Architect Prompt

### Technical Infrastructure

- **Starter Project/Template:** **Mandatory: Use the provided "bmad-boilerplate".** This includes TypeScript setup, Node.js v22 compatibility, Jest, ESLint, Prettier, `ts-node`, `.env` handling via `.env.example`, and standard scripts (`dev`, `build`, `test`, `lint`, `format`).
- **Hosting/Cloud Provider:** Local machine execution only for MVP. No cloud deployment.
- **Frontend Platform:** N/A (CLI tool).
- **Backend Platform:** Node.js v22 with TypeScript (as provided by the boilerplate). No specific Node.js framework mandated, but structure should support modularity and align with boilerplate setup.
- **Database Requirements:** None. Local file system for intermediate data storage and logging only. Structure TBD (e.g., `./output/YYYY-MM-DD/`). Ensure output directory is configurable via `.env` and gitignored.

### Technical Constraints

- Must adhere to the structure and tooling provided by "bmad-boilerplate".
- Must use Node.js v22 native `Workspace` for HTTP requests.
- Must use the Algolia HN Search API for fetching HN data.
- Must integrate with a local Ollama instance via a configurable HTTP endpoint. Design should allow potential swapping to other LLM APIs later.
- Must use Nodemailer for sending email.
- Configuration (LLM endpoint, email credentials, recipients, `MAX_COMMENTS_PER_STORY`, output dir path) must be managed via a `.env` file based on `.env.example`.
- Article scraping must be basic, best-effort, and handle failures gracefully without stopping the main process.
- Intermediate data must be persisted locally incrementally.
- Code must adhere to the ESLint and Prettier configurations within the boilerplate.

### Deployment Considerations

- Execution is manual via CLI trigger only, using `npm run dev` or `npm start`.
- No CI/CD required for MVP.
- Single environment: local development machine.

### Local Development & Testing Requirements

- The entire application runs locally.
- The main CLI command (`npm run dev`/`start`) should execute the _full implemented pipeline_.
- **Separate utility scripts/commands MUST be provided** for testing individual pipeline stages (fetch, scrape, summarize, email) potentially using local file I/O. Architecture should facilitate creating these stage runners. (e.g., `npm run stage:fetch`, `npm run stage:scrape -- --inputFile <path>`, `npm run stage:summarize -- --inputFile <path>`, `npm run stage:email -- --inputFile <path> [--dry-run]`).
- The boilerplate provides `npm run test` using Jest for running automated unit/integration tests.
- The boilerplate provides `npm run lint` and `npm run format` for code quality checks.
- Basic console logging is required. File logging can be considered by the architect.
- Testability of individual modules (API clients, scraper, summarizer, emailer) is crucial and should leverage the Jest setup and stage testing utilities.

### Other Technical Considerations

- **Modularity:** Design components (HN client, scraper, LLM client, emailer) with clear interfaces to facilitate potential future modifications (e.g., changing LLM provider) and independent stage testing.
- **Error Handling:** Focus on robust handling of scraping failures and basic handling of API/network errors. Implement within the boilerplate structure. Logging should clearly indicate errors.
- **Resource Management:** Be mindful of local resources when interacting with the LLM, although optimization is not a primary MVP goal.
- **Dependency Management:** Add necessary production dependencies (e.g., `nodemailer`, potentially `article-extractor`, libraries for date handling or file system operations if needed) to the boilerplate's `package.json`. Keep dependencies minimal.
- **Configuration Loading:** Implement a robust way to load and validate settings from the `.env` file early in the application startup.
