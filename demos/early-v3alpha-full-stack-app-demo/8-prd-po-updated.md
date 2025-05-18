# BMad DiCaster Product Requirements Document (PRD)

## Goal, Objective and Context

**Goal:** To develop a web application that provides a daily, concise summary of top Hacker News (HN) posts, delivered as a newsletter and accessible via a web interface.

**Objective:** To streamline the consumption of HN content by curating the top stories, providing AI-powered summaries, and offering an optional AI-generated podcast version.

**Context:** Busy professionals and enthusiasts want to stay updated on HN but lack the time to sift through numerous posts and discussions. This application will address this problem by automating the delivery of summarized content.

## Functional Requirements (MVP)

- **HN Content Retrieval & Storage:**
  - Daily retrieval of the top 30 Hacker News posts and associated comments using the HN Algolia API.
  - Scraping and storage of up to 10 linked articles per day.
  - Storage of all retrieved data (posts, comments, articles) with date association.
- **AI-Powered Summarization:**
  - AI-powered summarization of the 10 selected articles (2-paragraph summaries).
  - AI-powered summarization of comments for the 10 selected posts (2-paragraph summaries highlighting interesting interactions).
  - Configuration for local or remote LLM usage via environment variables.
- **Newsletter Generation & Delivery:**
  - Generation of a daily newsletter in HTML format, including summaries, links to HN posts and articles, and original post dates/times.
  - Automated delivery of the newsletter to a manually configured list of subscribers in Supabase. The list of emails will be manually populated in the database. Account information for the Nodemailer service will be provided via environment variables.
- **Podcast Generation & Integration:**
  - Integration with Play.ht's PlayNote API for AI-generated podcast creation from the newsletter content.
  - Webhook handler to update the newsletter with the generated podcast link.
- **Web Interface (MVP):**
  - Display of current and past newsletters.
  - Functionality to read the newsletter content within the web page.
  - Download option for newsletters.
  - Web player for listening to generated podcasts.
  - Basic mobile responsiveness for displaying newsletters and podcasts.
- **API & Triggering:**
  - Secure API endpoint to manually trigger the daily workflow, secured with API keys.
  - CLI command to manually trigger the daily workflow locally.

## Non-Functional Requirements (MVP)

- **Performance:**
  - The system should retrieve HN posts and generate the newsletter within a reasonable timeframe (e.g., under 30 minutes) to ensure timely delivery.
  - The web interface should load quickly (e.g., within 2 seconds) to provide a smooth user experience.
- **Scalability:**
  - The system is designed for an initial MVP delivery to 3-5 email subscribers. Scalability beyond this will be considered post-MVP.
- **Security:**
  - The API endpoint for triggering the daily workflow must be secure, using API keys.
  - User data (email addresses) should be stored securely. No other security measures are required for the MVP.
- **Reliability:**
  - No specific uptime or availability requirements are defined for the MVP.
  - The newsletter generation and delivery process should be robust and handle potential errors gracefully.
  - The system must be executable from a local development environment.
- **Maintainability:**
  - The codebase should adhere to good quality coding standards, including separation of concerns.
  - The system should employ facades and factories to facilitate future expansion.
  - The system should be built as an event-driven pipeline, leveraging Supabase to capture data at each stage and trigger subsequent functions asynchronously. This approach aims to mitigate potential timeout issues with Vercel hosting.

## User Interaction and Design Goals

This section captures the high-level vision and goals for the User Experience (UX) to guide the Design Architect.

- **Overall Vision & Experience:**
  - The desired look and feel is modern and minimalist, with synthwave technical glowing purple vibes.
  - Users should have a clean and efficient experience when accessing and consuming newsletter content and podcasts.
- **Key Interaction Paradigms:**
  - Interaction paradigms will be determined by the Design Architect.
- **Core Screens/Views (Conceptual):**
  - The MVP will consist of two pages:
    - A list page to display current and past newsletters.
    - A detail page to display the selected newsletter content, including:
      - Download option for the newsletter.
      - Web player for listening to the generated podcast.
      - The article laid out for viewing.
- **Accessibility Aspirations:**
  - The web interface (Epic 6) will adhere to WCAG 2.1 Level A guidelines as detailed in `frontend-architecture.md`. (Updated during checklist review)
- **Branding Considerations (High-Level):**
  - A logo for the application will be provided.
  - The application will use the name "BMad DiCaster".
- **Target Devices/Platforms:**
  - The application will be designed as a mobile-first responsive web app, ensuring it looks good on both mobile and desktop devices.

## Technical Assumptions

This section captures any existing technical information that will guide the Architect in the technical design.

- The application will be developed using the Next.js/Supabase template and hosted entirely on Vercel.
- This implies a monorepo structure, as the frontend (Next.js) and backend (Supabase functions) will reside within the same repository.
- The backend will primarily leverage serverless functions provided by Vercel and Supabase.
- Frontend development will be in Next.js with React.
- Data storage will be handled by Supabase's PostgreSQL database.
- Separate Supabase instances will be used for development and production environments to ensure data isolation and stability.
- For local development, developers can utilize the Supabase CLI and Vercel CLI to emulate the production environment, primarily for testing functions and deployments, but the development Supabase instance will be the primary source of dev data.
- Testing will include unit tests, integration tests (especially for interactions with Supabase), and end-to-end tests.
- The system should be built as an event-driven pipeline, leveraging Supabase to capture data at each stage and trigger subsequent functions asynchronously to mitigate potential timeout issues with Vercel.

## Epic Overview

_(Note: Epics will be developed sequentially. Development will start with Epic 1 and proceed to the next epic only after the previous one is fully completed and verified. Per the BMAD method, every story must be self-contained and done before the next one is started.)_

_(Note: All UI development across all epics must adhere to mobile responsiveness and Tailwind CSS/theming principles to ensure a consistent and maintainable user experience.)_

**(General Note on Service Implementation for All Epics):** All backend services (Supabase Functions) developed as part of any epic must implement robust error handling. They should log extensively using Pino, ensuring that all log entries include the relevant `workflow_run_id` for traceability. Furthermore, services must interact with the `WorkflowTrackerService` to update the `workflow_runs` table appropriately on both successful completion of their tasks and in case of any failures, recording status and error messages as applicable.

- **Epic 1: Project Initialization, Setup, and HN Content Acquisition**
  - Goal: Establish the foundational project structure, including the Next.js application, Supabase integration, deployment pipeline, API/CLI triggers, core workflow orchestration, and implement functionality to retrieve, process, and store Hacker News posts/comments via a `ContentAcquisitionFacade`, providing data for newsletter generation. Implement the database event mechanism to trigger subsequent processing. Define core configuration tables, seed data, and set up testing frameworks.
- **Epic 2: Article Scraping**
  - Goal: Implement the functionality to scrape and store linked articles from HN posts, enriching the data available for summarization and the newsletter. Ensure this functionality is triggered by database events and can be tested via API/CLI (if retained). Implement the database event mechanism to trigger subsequent processing.
- **Epic 3: AI-Powered Content Summarization**
  - Goal: Integrate AI summarization capabilities, by implementing and using a configurable and testable `LLMFacade`, to generate concise summaries of articles and comments from prompts stored in the database. This will enrich the newsletter content, be triggerable via API/CLI, is triggered by database events, and track progress via `WorkflowTrackerService`.
- **Epic 4: Automated Newsletter Creation and Distribution**
  - Goal: Automate the generation and delivery of the daily newsletter by implementing and using a configurable `EmailDispatchFacade`. This includes handling podcast link availability, being triggerable via API/CLI, orchestration by `CheckWorkflowCompletionService`, and status tracking via `WorkflowTrackerService`.
- **Epic 5: Podcast Generation Integration**
  - Goal: Integrate with an audio generation API (initially Play.ht) by implementing and using a configurable `AudioGenerationFacade` to create podcast versions of the newsletter. This includes handling webhooks to update newsletter data and workflow status. Ensure this is triggerable via API/CLI, orchestrated appropriately, and uses `WorkflowTrackerService`.
- **Epic 6: Web Interface for Initial Structure and Content Access**
  - Goal: Develop a user-friendly, responsive, and accessible web interface, based on the `frontend-architecture.md`, to display newsletters and provide access to podcast content, aligning with the project's visual and technical guidelines. All UI development within this epic must adhere to the "synthwave technical glowing purple vibes" aesthetic using Tailwind CSS and Shadcn UI, ensure basic mobile responsiveness, meet WCAG 2.1 Level A accessibility guidelines (including semantic HTML, keyboard navigation, alt text, color contrast), and optimize images using `next/image`, as detailed in the `frontend-architecture.txt` and `ui-ux-spec.txt`.

---

**Epic 1: Project Initialization, Setup, and HN Content Acquisition**

- Goal: Establish the foundational project structure, including the Next.js application, Supabase integration, deployment pipeline, API/CLI triggers, core workflow orchestration, and implement functionality to retrieve, process, and store Hacker News posts/comments via a `ContentAcquisitionFacade`, providing data for newsletter generation. Implement the database event mechanism to trigger subsequent processing. Define core configuration tables, seed data, and set up testing frameworks.

- **Story 1.1:** As a developer, I want to set up the Next.js project with Supabase integration, so that I have a functional foundation for building the application.
  - Acceptance Criteria:
    - The Next.js project is initialized using the Vercel/Supabase template.
    - Supabase is successfully integrated with the Next.js project.
    - The project codebase is initialized in a Git repository.
    - A basic project `README.md` is created in the root of the repository, including a project overview, links to main documentation (PRD, architecture), and essential developer setup/run commands.
- **Story 1.2:** As a developer, I want to configure the deployment pipeline to Vercel with separate development and production environments, so that I can easily deploy and update the application.
  - Acceptance Criteria:
    - The project is successfully linked to a Vercel project with separate environments.
    - Automated deployments are configured for the main branch to the production environment.
    - Environment variables are set up for local development and Vercel deployments.
- **Story 1.3:** As a developer, I want to implement the API and CLI trigger mechanisms, so that I can manually trigger the workflow during development and testing.
  - Acceptance Criteria:
    - A secure API endpoint is created.
    - The API endpoint requires authentication (API key).
    - The API endpoint (`/api/system/trigger-workflow`) creates an entry in the `workflow_runs` table and returns the `jobId`.
    - The API endpoint returns an appropriate response to indicate success or failure.
    - The API endpoint is secured via an API key.
    - A CLI command is created.
    - The CLI command invokes the `/api/system/trigger-workflow` endpoint or directly interacts with `WorkflowTrackerService` to start a new workflow run.
    - The CLI command provides informative output to the console.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - All interactions with the API or CLI that initiate a workflow must record the `workflow_run_id` in logs.
    - The API and CLI interfaces adhere to mobile responsiveness and Tailwind/theming principles.
- **Story 1.4:** As a system, I want to retrieve the top 30 Hacker News posts and associated comments daily using a configurable `ContentAcquisitionFacade`, so that the data is available for summarization and newsletter generation.
  - Acceptance Criteria:
    - A `ContentAcquisitionFacade` is implemented in `supabase/functions/_shared/` to abstract interaction with the news data source (initially HN Algolia API).
    - The facade handles API authentication (if any), request formation, and response parsing for the specific news source.
    - The facade implements basic retry logic for transient errors.
    - Unit tests for the `ContentAcquisitionFacade` (mocking actual HTTP calls to the HN Algolia API) achieve >80% coverage.
    - The system retrieves the top 30 Hacker News posts daily via the `ContentAcquisitionFacade`.
    - The system retrieves associated comments for the top 30 posts via the `ContentAcquisitionFacade`.
    - Retrieved data (posts and comments) is stored in Supabase database, linked to the current `workflow_run_id`.
    - This functionality can be triggered via the API and CLI.
    - The system logs the start and completion of the retrieval process, including any errors.
    - Upon completion, the service updates the `workflow_runs` table with status and details (e.g., number of posts fetched) via `WorkflowTrackerService`.
    - Supabase migrations for `hn_posts` and `hn_comments` tables (as defined in `architecture.txt`) are created and applied before data operations.
- **Story 1.5: Define and Implement `workflow_runs` Table and `WorkflowTrackerService`**
  - Goal: Implement the core workflow orchestration mechanism (tracking part).
  - Acceptance Criteria:
    - Supabase migration created for the `workflow_runs` table as defined in the architecture document.
    - `WorkflowTrackerService` implemented in `supabase/functions/_shared/` with methods for initiating, updating step details, incrementing counters, failing, and completing workflow runs.
    - Service includes robust error handling and logging via Pino.
    - Unit tests for `WorkflowTrackerService` achieve >80% coverage.
- **Story 1.6: Implement `CheckWorkflowCompletionService` (Supabase Cron Function)**
  - Goal: Implement the core workflow orchestration mechanism (progression part).
  - Acceptance Criteria:
    - Supabase Function `check-workflow-completion-service` created.
    - Function queries `workflow_runs` and related tables to determine if a workflow run is ready to progress to the next major stage.
    - Function correctly updates `workflow_runs.status` and invokes the next appropriate service function.
    - Logic for handling podcast link availability is implemented here or in conjunction with `NewsletterGenerationService`.
    - The function is configurable to be run periodically.
    - Comprehensive logging implemented using Pino.
    - Unit tests achieve >80% coverage.
- **Story 1.7: Implement Workflow Status API Endpoint (`/api/system/workflow-status/{jobId}`)**
  - Goal: Allow developers/admins to check the status of a workflow run.
  - Acceptance Criteria:
    - Next.js API Route Handler created at `/api/system/workflow-status/{jobId}`.
    - Endpoint secured with API Key authentication.
    - Retrieves and returns status details from the `workflow_runs` table.
    - Handles cases where `jobId` is not found (404).
    - Unit and integration tests for the API endpoint.
- **Story 1.8: Create and document `docs/environment-vars.md` and set up `.env.example`**
  - Goal: Ensure environment variables are properly documented and managed.
  - Acceptance Criteria:
    - A `docs/environment-vars.md` file is created.
    - An `.env.example` file is created.
    - Sensitive information in examples is masked.
    - For each third-party service requiring credentials, `docs/environment-vars.md` includes:
      - A brief note or link guiding the user on where to typically sign up for the service and obtain the necessary API key or credential.
      - A recommendation for the user to check the service's current free/low-tier API rate limits against expected MVP usage.
      - A note that usage beyond free tier limits for commercial services (like Play.ht, remote LLMs, or email providers) may incur costs, and the user should review the provider's pricing.
- **Story 1.9 (New): Implement Database Event/Webhook: `hn_posts` Insert to Article Scraping Service**
  - Goal: To ensure that the successful insertion of a new Hacker News post into the `hn_posts` table automatically triggers the `ArticleScrapingService`.
  - Acceptance Criteria:
    - A Supabase database trigger or webhook mechanism (e.g., using `pg_net` or native triggers calling a function) is implemented on the `hn_posts` table for INSERT operations.
    - The trigger successfully invokes the `ArticleScrapingService` (Supabase Function).
    - The invocation passes necessary parameters like `hn_post_id` and `workflow_run_id` to the `ArticleScrapingService`.
    - The mechanism is robust and includes error handling/logging for the trigger/webhook itself.
    - Unit/integration tests are created to verify the trigger fires correctly and the service is invoked with correct parameters.
- **Story 1.10 (New): Define and Implement Core Configuration Tables**
  - Goal: To establish the database tables necessary for storing core application configurations like summarization prompts, newsletter templates, and subscriber lists.
  - Acceptance Criteria:
    - A Supabase migration is created and applied to define the `summarization_prompts` table schema as specified in `architecture.txt`.
    - A Supabase migration is created and applied to define the `newsletter_templates` table schema as specified in `architecture.txt`.
    - A Supabase migration is created and applied to define the `subscribers` table schema as specified in `architecture.txt`.
    - These tables are ready for data population (e.g., via seeding or manual entry for MVP).
- **Story 1.11 (New): Create Seed Data for Initial Configuration**
  - Goal: To populate the database with initial configuration data (prompts, templates, test subscribers) necessary for development and testing of MVP features.
  - Acceptance Criteria:
    - A `supabase/seed.sql` file (or an equivalent, documented seeding mechanism) is created.
    - The seed mechanism populates the `summarization_prompts` table with at least one default article prompt and one default comment prompt.
    - The seed mechanism populates the `newsletter_templates` table with at least one default newsletter template (HTML format for MVP).
    - The seed mechanism populates the `subscribers` table with a small list of 1-3 test email addresses for MVP delivery testing.
    - Instructions on how to apply the seed data to a local or development Supabase instance are documented (e.g., in the project `README.md`).
- **Story 1.12 (New): Set up and Configure Project Testing Frameworks**
  - Goal: To ensure that the primary testing frameworks (Jest, React Testing Library, Playwright) are installed and configured early in the project lifecycle, enabling test-driven development practices and adherence to the testing strategy.
  - Acceptance Criteria:
    - Jest and React Testing Library (RTL) are installed as project dependencies.
    - Jest and RTL are configured for unit and integration testing of Next.js components and JavaScript/TypeScript code (e.g., `jest.config.js` is set up, necessary Babel/TS transformations are in place).
    - A sample unit test (e.g., for a simple component or utility function) is created and runs successfully using the Jest/RTL setup.
    - Playwright is installed as a project dependency.
    - Playwright is configured for end-to-end testing (e.g., `playwright.config.ts` is set up, browser configurations are defined).
    - A sample E2E test (e.g., navigating to the application's homepage on the local development server) is created and runs successfully using Playwright.
    - Scripts to execute tests (e.g., unit tests, E2E tests) are added to `package.json`.

---

**Epic 2: Article Scraping**

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

---

**Epic 3: AI-Powered Content Summarization**

- Goal: Integrate AI summarization capabilities, by implementing and using a configurable and testable `LLMFacade`, to generate concise summaries of articles and comments from prompts stored in the database. This will enrich the newsletter content, be triggerable via API/CLI, is triggered by database events, and track progress via `WorkflowTrackerService`.

- **Story 3.1:** As a system, I want to integrate an AI summarization capability by implementing and using an `LLMFacade`, so that I can generate concise summaries of articles and comments using various configurable LLM providers.
  - Acceptance Criteria:
    - An `LLMFacade` interface and concrete implementations (e.g., `OllamaAdapter`, `RemoteLLMApiAdapter`) are created in `supabase/functions/_shared/llm-facade.ts`.
    - A factory function is implemented within or alongside the facade to select the appropriate LLM adapter based on environment variables (e.g., `LLM_PROVIDER_TYPE`, `OLLAMA_API_URL`, `REMOTE_LLM_API_KEY`, `REMOTE_LLM_API_URL`, `LLM_MODEL_NAME`).
    - The `LLMFacade` handles making requests to the respective LLM APIs (as configured) and parsing their responses to extract the summary.
    - Robust error handling and retry logic for transient API errors are implemented within the facade.
    - Unit tests for the `LLMFacade` and its adapters (mocking actual HTTP calls) achieve >80% coverage.
    - The system utilizes this `LLMFacade` for all summarization tasks (articles and comments).
    - The integration is configurable via environment variables to switch between local and remote LLMs and specify model names.
- **Story 3.2:** As a system, I want to retrieve summarization prompts from the database, and then use them via the `LLMFacade` to generate 2-paragraph summaries of the scraped articles, so that users can quickly grasp the main content and the prompts can be easily updated.
  - Acceptance Criteria:
    - The service retrieves the appropriate summarization prompt from the `summarization_prompts` table.
    - The system generates a 2-paragraph summary for each scraped article using the retrieved prompt via the `LLMFacade`.
    - Generated summaries are stored in the `article_summaries` table, linked to the `scraped_article_id` and the current `workflow_run_id`.
    - The summaries are accurate and capture the key information from the article.
    - Upon completion of each article summarization task, the service updates `workflow_runs.details` (e.g., incrementing article summaries generated counts) via `WorkflowTrackerService`.
    - (System Note: The `CheckWorkflowCompletionService` monitors the `article_summaries` table as part of determining overall summarization completion for a `workflow_run_id`).
    - A Supabase migration for the `article_summaries` table (as defined in `architecture.txt`) is created and applied before data operations.
- **Story 3.3:** As a system, I want to retrieve summarization prompts from the database, and then use them via the `LLMFacade` to generate 2-paragraph summaries of the comments for the selected HN posts, so that users can understand the main discussions and the prompts can be easily updated.
  - Acceptance Criteria:
    - The service retrieves the appropriate summarization prompt from the `summarization_prompts` table.
    - The system generates a 2-paragraph summary of the comments for each selected HN post using the retrieved prompt via the `LLMFacade`.
    - Generated summaries are stored in the `comment_summaries` table, linked to the `hn_post_id` and the current `workflow_run_id`.
    - The summaries highlight interesting interactions and key points from the discussion.
    - Upon completion of each comment summarization task, the service updates `workflow_runs.details` (e.g., incrementing comment summaries generated counts) via `WorkflowTrackerService`.
    - (System Note: The `CheckWorkflowCompletionService` monitors the `comment_summaries` table as part of determining overall summarization completion for a `workflow_run_id`).
    - A Supabase migration for the `comment_summaries` table (as defined in `architecture.txt`) is created and applied before data operations.
- **Story 3.4:** As a developer, I want to trigger the AI summarization process via the API and CLI, so that I can manually initiate it for testing and debugging.
  - Acceptance Criteria:
    - The API endpoint can trigger the AI summarization process.
    - The CLI command can trigger the AI summarization process locally.
    - The system logs the input and output of the summarization process, including the summarization prompt used and any errors.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The system handles partial execution gracefully (i.e., if triggered before Epic 2 is complete, it logs a message and exits).
    - All summarization operations initiated via this trigger must be associated with a valid `workflow_run_id` and update the `workflow_runs` table accordingly via `WorkflowTrackerService`.

---

**Epic 4: Automated Newsletter Creation and Distribution**

- Goal: Automate the generation and delivery of the daily newsletter by implementing and using a configurable `EmailDispatchFacade`. This includes handling podcast link availability, being triggerable via API/CLI, orchestration by `CheckWorkflowCompletionService`, and status tracking via `WorkflowTrackerService`.

- **Story 4.1:** As a system, I want to retrieve the newsletter template from the database, so that the newsletter's design and structure can be updated without code changes.
  - Acceptance Criteria:
    - The system retrieves the newsletter template from the `newsletter_templates` database table.
- **Story 4.2:** As a system, I want to generate a daily newsletter in HTML format using the retrieved template, so that users can receive a concise summary of Hacker News content.
  - Acceptance Criteria:
    - The `NewsletterGenerationService` is triggered by the `CheckWorkflowCompletionService` when all summaries for a `workflow_run_id` are ready.
    - The service retrieves the newsletter template (from Story 4.1 output) from `newsletter_templates` table and summaries associated with the `workflow_run_id`.
    - The system generates a newsletter in HTML format using the template retrieved from the database.
    - The newsletter includes summaries of selected articles and comments.
    - The newsletter includes links to the original HN posts and articles.
    - The newsletter includes the original post dates/times.
    - Generated newsletter is stored in the `newsletters` table, linked to the `workflow_run_id`.
    - The service updates `workflow_runs.status` to 'generating_podcast' (or a similar appropriate status indicating handoff to podcast generation) after initiating podcast generation (as part of Epic 5 logic that will be invoked by this service or by `CheckWorkflowCompletionService` after this story's core task).
    - A Supabase migration for the `newsletters` table (as defined in `architecture.txt`) is created and applied before data operations.
- **Story 4.3:** As a system, I want to send the generated newsletter to a list of subscribers by implementing and using an `EmailDispatchFacade`, with credentials securely provided, so that users receive the daily summary in their inbox.
  - Acceptance Criteria:
    - An `EmailDispatchFacade` is implemented in `supabase/functions/_shared/` to abstract interaction with the email sending service (initially Nodemailer via SMTP).
    - The facade handles configuration (e.g., SMTP settings from environment variables), email construction (From, To, Subject, HTML content), and sending the email.
    - The facade includes error handling for email dispatch and logs relevant status information.
    - Unit tests for the `EmailDispatchFacade` (mocking the actual Nodemailer library calls) achieve >80% coverage.
    - The `NewsletterGenerationService` (specifically, its delivery part, utilizing the `EmailDispatchFacade`) is triggered by `CheckWorkflowCompletionService` once the podcast link is available in the `newsletters` table for the `workflow_run_id` (or a configured timeout/failure condition for the podcast step has been met).
    - The system retrieves the list of subscriber email addresses from the Supabase database.
    - The system sends the HTML newsletter (with podcast link conditionally included) to all active subscribers using the `EmailDispatchFacade`.
    - Credentials for the email service (e.g., SMTP server details) are securely accessed via environment variables and used by the facade.
    - The system logs the delivery status for each subscriber (potentially via the facade).
    - The system implements conditional logic for podcast link inclusion (from `newsletters` table) and handles delay/retry as per PRD, coordinated by `CheckWorkflowCompletionService`.
    - Updates `newsletters.delivery_status` (e.g., 'sent', 'failed') and `workflow_runs.status` to 'completed' or 'failed' via `WorkflowTrackerService` upon completion or failure of delivery.
    - The initial email template includes a placeholder for the podcast URL.
    - The end-to-end generation time for a typical daily newsletter (from workflow trigger to successful email dispatch initiation, for a small set of content) is measured and logged during testing to ensure it's within a reasonable operational timeframe (target < 30 minutes).
- **Story 4.4:** As a developer, I want to trigger the newsletter generation and distribution process via the API and CLI, so that I can manually initiate it for testing and debugging.
  - Acceptance Criteria:
    - The API endpoint can trigger the newsletter generation and distribution process.
    - The CLI command can trigger the newsletter generation and distribution process locally.
    - The system logs the start and completion of the process, including any errors.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The system handles partial execution gracefully (i.e., if triggered before Epic 3 is complete, it logs a message and exits).
    - All newsletter operations initiated via this trigger must be associated with a valid `workflow_run_id` and update the `workflow_runs` table accordingly via `WorkflowTrackerService`.

---

**Epic 5: Podcast Generation Integration**

- Goal: Integrate with an audio generation API (initially Play.ht) by implementing and using a configurable `AudioGenerationFacade` to create podcast versions of the newsletter. This includes handling webhooks to update newsletter data and workflow status. Ensure this is triggerable via API/CLI, orchestrated appropriately, and uses `WorkflowTrackerService`.

- **Story 5.1:** As a system, I want to integrate with an audio generation API (e.g., Play.ht's PlayNote API) by implementing and using an `AudioGenerationFacade`, so that I can generate AI-powered podcast versions of the newsletter content.
  - Acceptance Criteria:
    - An `AudioGenerationFacade` is implemented in `supabase/functions/_shared/` to abstract interaction with the audio generation service (initially Play.ht).
    - The facade handles API authentication, request formation (e.g., sending content for synthesis, providing webhook URL), and response parsing for the specific audio generation service.
    - The facade is configurable via environment variables (e.g., API key, user ID, service endpoint, webhook URL base).
    - Robust error handling and retry logic for transient API errors are implemented within the facade.
    - Unit tests for the `AudioGenerationFacade` (mocking actual HTTP calls to the Play.ht API) achieve >80% coverage.
    - The system uses this `AudioGenerationFacade` for all podcast generation tasks.
    - The integration employs webhooks for asynchronous status updates from the audio generation service.
    - (Context: The `PodcastGenerationService` containing this logic is invoked by `NewsletterGenerationService` or `CheckWorkflowCompletionService` for a specific `workflow_run_id` and `newsletter_id`.)
- **Story 5.2:** As a system, I want to send the newsletter content to the audio generation service via the `AudioGenerationFacade` to initiate podcast creation, and receive a job ID or initial response, so that I can track the podcast creation process.
  - Acceptance Criteria:
    - The system sends the newsletter content (identified by `newsletter_id` for a given `workflow_run_id`) to the configured audio generation service via the `AudioGenerationFacade`.
    - The system receives a job ID or initial response from the service via the facade.
    - The `podcast_playht_job_id` (or a generic `podcast_job_id`) and `podcast_status` (e.g., 'generating', 'submitted') are stored in the `newsletters` table, linked to the `workflow_run_id`.
- **Story 5.3:** As a system, I want to implement a webhook handler to receive the podcast URL from the audio generation service, and update the newsletter data and workflow status, so that the podcast link can be included in the newsletter and web interface, and the overall workflow can proceed.
  - Acceptance Criteria:
    - The system implements a webhook handler (`PlayHTWebhookHandlerAPI` at `/api/webhooks/playht` or a more generic path like `/api/webhooks/audio-generation`) to receive the podcast URL and status from the audio generation service.
    - The webhook handler extracts the podcast URL and status (e.g., 'completed', 'failed') from the webhook payload.
    - The webhook handler updates the `newsletters` table with the podcast URL and status for the corresponding job.
    - The `PlayHTWebhookHandlerAPI` also updates the `workflow_runs.details` with the podcast status (e.g., `podcast_status: 'completed'`) via `WorkflowTrackerService` for the relevant `workflow_run_id` (which may need to be looked up from the `newsletter_id` or job ID present in the webhook or associated with the service job).
    - If supported by the audio generation service (e.g., Play.ht), implement security verification for the incoming webhook (such as shared secret or signature validation) to ensure authenticity. If direct verification mechanisms are not supported by the provider, this specific AC is N/A, and alternative measures (like IP whitelisting, if applicable and secure) should be considered and documented.
- **Story 5.4:** As a developer, I want to trigger the podcast generation process via the API and CLI, so that I can manually initiate it for testing and debugging.
  - Acceptance Criteria:
    - The API endpoint can trigger the podcast generation process.
    - The CLI command can trigger the podcast generation process locally.
    - The system logs the start and completion of the process, including any intermediate steps, responses from the audio generation service, and webhook interactions.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The system handles partial execution gracefully (i.e., if triggered before Epic 4 components are ready, it logs a message and exits).
    - All podcast generation operations initiated via this trigger must be associated with a valid `workflow_run_id` and `newsletter_id`, and update the `workflow_runs` and `newsletters` tables accordingly via `WorkflowTrackerService` and direct table updates as necessary.

---

**Epic 6: Web Interface for Initial Structure and Content Access**

- Goal: Develop a user-friendly, responsive, and accessible web interface, based on the `frontend-architecture.md`, to display newsletters and provide access to podcast content, aligning with the project's visual and technical guidelines. All UI development within this epic must adhere to the "synthwave technical glowing purple vibes" aesthetic using Tailwind CSS and Shadcn UI, ensure basic mobile responsiveness, meet WCAG 2.1 Level A accessibility guidelines (including semantic HTML, keyboard navigation, alt text, color contrast), and optimize images using `next/image`, as detailed in the `frontend-architecture.txt` and `ui-ux-spec.txt`.

- **Story 6.1:** As a developer, I want to establish the initial Next.js App Router structure for the web interface, including core layouts and routing, using `frontend-architecture.md` as a guide, so that I have a foundational frontend structure.
  - Acceptance Criteria:
    - Initial HTML/CSS mockups (e.g., from Vercel v0, if used) serve as a visual guide, but implementation uses Next.js and Shadcn UI components as per `frontend-architecture.md`.
    - Next.js App Router routes are set up for `/newsletters` (listing page) and `/newsletters/[newsletterId]` (detail page) within an `app/(web)/` route group.
    - Root layout (`app/(web)/layout.tsx`) and any necessary feature-specific layouts (e.g., `app/(web)/newsletters/layout.tsx`) are implemented using Next.js App Router conventions and Tailwind CSS.
    - A `PageWrapper.tsx` component (as defined in `frontend-architecture.txt`) is implemented and used for consistent page styling (e.g., padding, max-width).
    - Basic page structure renders correctly in development environment.
- **Story 6.2:** As a user, I want to see a list of current and past newsletters on the `/newsletters` page, so that I can easily browse available content.
  - Acceptance Criteria:
    - The `app/(web)/newsletters/page.tsx` route displays a list of newsletters.
    - Newsletter items are displayed using a `NewsletterCard.tsx` component.
    - The `NewsletterCard.tsx` component is developed (e.g., using Shadcn UI `Card` as a base), displaying at least the newsletter title, target date, and a link/navigation to its detail page.
    - `NewsletterCard.tsx` is styled using Tailwind CSS to fit the "synthwave" theme.
    - Data for the newsletter list (e.g., ID, title, date) is fetched server-side on `app/(web)/newsletters/page.tsx` using the Supabase server client.
    - The newsletter list page is responsive across common device sizes (mobile, desktop).
    - The list includes relevant information such as the newsletter title and date.
    - The list is paginated or provides scrolling functionality to handle a large number of newsletters.
    - Key page load performance (e.g., Largest Contentful Paint) for the newsletter list page is benchmarked (e.g., using browser developer tools or Lighthouse) during development testing to ensure it aligns with the target of fast load times (target < 2 seconds).
- **Story 6.3:** As a user, I want to be able to select a newsletter from the list and read its full content within the web page on the `/newsletters/[newsletterId]` page.
  - Acceptance Criteria:
    - Clicking on a `NewsletterCard` navigates to the corresponding `app/(web)/newsletters/[newsletterId]/page.tsx` route.
    - The full HTML content of the selected newsletter is retrieved server-side using the Supabase server client and displayed in a readable format.
    - A `BackButton.tsx` component is developed (e.g., using Shadcn UI `Button` as a base) and integrated on the newsletter detail page, allowing users to navigate back to the newsletter list.
    - The newsletter detail page content area is responsive across common device sizes.
    - Key page load performance (e.g., Largest Contentful Paint) for the newsletter detail page is benchmarked (e.g., using browser developer tools or Lighthouse) during development testing to ensure it aligns with the target of fast load times (target < 2 seconds).
- **Story 6.4:** As a user, I want to have the option to download the currently viewed newsletter from its detail page, so that I can access it offline.
  - Acceptance Criteria:
    - A `DownloadButton.tsx` component is developed (e.g., using Shadcn UI `Button` as a base).
    - The `DownloadButton.tsx` is integrated and visible on the newsletter detail page (`/newsletters/[newsletterId]`).
    - Clicking the button initiates a download of the newsletter content (e.g., HTML format for MVP).
- **Story 6.5:** As a user, I want to listen to the generated podcast associated with a newsletter within the web interface on its detail page, if a podcast is available.
  - Acceptance Criteria:
    - A `PodcastPlayer.tsx` React component with standard playback controls (play, pause, seek bar, volume control) is developed.
    - An `podcastPlayerSlice.ts` Zustand store is implemented to manage podcast player state (e.g., current track URL, playback status, current time, volume).
    - The `PodcastPlayer.tsx` component integrates with the `podcastPlayerSlice.ts` Zustand store for its state management.
    - If a podcast URL is available for the displayed newsletter (fetched from Supabase), the `PodcastPlayer.tsx` component is displayed on the newsletter detail page.
    - The `PodcastPlayer.tsx` can load and play the podcast audio from the provided URL.
    - The `PodcastPlayer.tsx` is styled using Tailwind CSS to fit the "synthwave" theme and is responsive.

---

## Key Reference Documents

_(This section will be created later, from the sections prior to this being carved up into smaller documents)_

## Out of Scope Ideas Post MVP

- User Authentication and Management
- Subscription Management
- Admin Dashboard
  - Viewing and updating daily podcast settings
  - Prompt management for summarization
  - UI for template modification
- Enhanced Newsletter Customization
- Additional Content Digests
  - Configuration and creation of different digests
  - Support for content sources beyond Hacker News
- Advanced scraping techniques (e.g., Playwright)

## Change Log

| Change                                           | Date       | Version | Description                                                                                                                                               | Author |
| :----------------------------------------------- | :--------- | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| Initial Draft                                    | 2025-05-13 | 0.1     | Initial draft of the Product Requirements Document                                                                                                        | 2-pm   |
| Updates from Arch suggestions & Checklist Review | 2025-05-14 | 0.3     | Incorporated changes from `arch-suggested-changes.txt`, `fea-suggested-changes.txt`, and Master Checklist review, including new stories & AC refinements. | 5-posm |
