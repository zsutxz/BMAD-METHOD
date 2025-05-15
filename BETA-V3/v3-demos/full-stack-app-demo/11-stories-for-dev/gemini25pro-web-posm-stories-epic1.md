Okay, I understand. I will proceed to generate all stories for Epic 1 in a single output. I will perform the necessary analysis of the provided documents to ensure each story is detailed and actionable.

Operating in **Story Creator Phase**.

Here are all the stories for Epic 1:

---

# Story 1.1: Set up Next.js project with Supabase integration

## Status: Draft

## Story

- As a developer
- I want to set up the Next.js project with Supabase integration
- so that I have a functional foundation for building the application.

## Acceptance Criteria (ACs)

1.  The Next.js project is initialized using the Vercel/Supabase template.
2.  Supabase is successfully integrated with the Next.js project.
3.  The project codebase is initialized in a Git repository.
4.  A basic project `README.md` is created in the root of the repository, including a project overview, links to main documentation (PRD, architecture), and essential developer setup/run commands.

## Tasks / Subtasks

- [ ] Task 1: Initialize Next.js project. (AC: 1)
  - [ ] Use the Vercel/Supabase Next.js App Router template to create the project.
  - [ ] Confirm all default template files and directories are present as per the template's standard structure.
- [ ] Task 2: Integrate and configure Supabase. (AC: 2)
  - [ ] Create a `.env.local` file based on `.env.example` (to be created in Story 1.8).
  - [ ] Populate `.env.local` with Supabase project URL and anon key (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - [ ] Verify that the Supabase client utility files provided by the template (e.g., `utils/supabase/client.ts`, `utils/supabase/server.ts`) are correctly configured to use these environment variables.
  - [ ] Perform a basic test of Supabase connectivity (e.g., a simple data fetch in a test page or server component, or ensure client initialization does not throw errors).
- [ ] Task 3: Initialize Git repository. (AC: 3)
  - [ ] Execute `git init` in the project's root directory.
  - [ ] Create a `.gitignore` file (if not provided by the template, add common Node.js/Next.js/Supabase ignores like `node_modules/`, `.env*` (except `.env.example`), `supabase/db/volumes/`).
  - [ ] Make an initial commit of the project files.
- [ ] Task 4: Create `README.md`. (AC: 4)
  - [ ] Create a `README.md` file in the project root.
  - [ ] Add a "Project Overview" section (e.g., from PRD Intro `[8-prd-po-updated.txt#Goal, Objective and Context]`).
  - [ ] Add a "Documentation" section with links to:
    - PRD (e.g., `docs/8-prd-po-updated.txt`)
    - Main Architecture Document (e.g., `docs/3-architecture.txt`)
    - Frontend Architecture Document (e.g., `docs/5-front-end-architecture.txt`)
    - Environment Variables (e.g., `docs/environment-vars.md` - to be created in Story 1.8)
  - [ ] Add an "Essential Developer Setup/Run Commands" section (e.g., `npm install`, `npm run dev`, `supabase start` if using local Supabase CLI).

## Dev Technical Guidance

- **Template:** Use the Vercel/Supabase Next.js App Router Template (`[3-architecture.txt#Definitive Tech Stack Selections]`).
- **Supabase Client Setup:** Refer to `utils/supabase/client.ts` and `utils/supabase/server.ts` as described in `[5-front-end-architecture.txt#Detailed Frontend Directory Structure]` and `[3-architecture.txt#Project Structure]`.
- **Environment Variables:** The initial focus is on `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The `SUPABASE_SERVICE_ROLE_KEY` will be needed later for backend functions.
- **README Content - Project Overview Example:** "BMad DiCaster is a web application that provides a daily, concise summary of top Hacker News (HN) posts, delivered as a newsletter and accessible via a web interface." (`[8-prd-po-updated.txt#Goal, Objective and Context]`)
- **README Content - Essential Commands Example:**

  ```bash
  # Clone the repository
  git clone <repository-url>
  cd <project-directory>

  # Install dependencies
  npm install

  # Set up environment variables
  cp .env.example .env.local
  # Edit .env.local with your Supabase credentials

  # Run the Next.js development server
  npm run dev

  # For local Supabase development (using Supabase CLI)
  # supabase init # Run once if setting up Supabase locally from scratch
  # supabase start # Starts local Supabase docker containers
  # supabase db reset # Resets local database and applies migrations + seed data (if configured)
  ```

- **Git:** Ensure `.gitignore` excludes sensitive files like `.env.local` and `node_modules/`.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.2: Configure deployment pipeline to Vercel

## Status: Draft

## Story

- As a developer
- I want to configure the deployment pipeline to Vercel with separate development and production environments
- so that I can easily deploy and update the application.

## Acceptance Criteria (ACs)

1.  The project is successfully linked to a Vercel project with separate environments.
2.  Automated deployments are configured for the main branch to the production environment.
3.  Environment variables are set up for local development and Vercel deployments.

## Tasks / Subtasks

- [ ] Task 1: Link project to Vercel. (AC: 1)
  - [ ] Create a new project on Vercel and connect it to the Git repository.
  - [ ] Configure Vercel project settings (e.g., framework preset should be Next.js, root directory).
- [ ] Task 2: Configure Vercel environments and deployments. (AC: 1, 2)
  - [ ] Ensure Vercel automatically creates preview deployments for pull requests/feature branches.
  - [ ] Configure the `main` (or `master`) branch to deploy to the Vercel production environment.
  - [ ] (Potentially) Set up a `develop` branch to deploy to a Vercel development/staging environment if desired (PRD mentions dev and prod Supabase instances `[8-prd-po-updated.txt#Technical Assumptions]`).
- [ ] Task 3: Set up environment variables on Vercel. (AC: 3)
  - [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel project settings for the production environment (pointing to the production Supabase instance).
  - [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel for the production environment (for backend functions).
  - [ ] If a separate development Vercel environment is used, configure its environment variables to point to the development Supabase instance.
  - [ ] Ensure local development continues to use `.env.local` which should point to a development Supabase instance.
- [ ] Task 4: Verify deployment.
  - [ ] Push a small change to the `main` branch and verify it deploys to production on Vercel.
  - [ ] Create a PR with a small change and verify a preview deployment is created.

## Dev Technical Guidance

- **Vercel Integration:** Follow Vercel's documentation for connecting a Git repository and deploying a Next.js application.
- **Environment Variables:**
  - Refer to `[3-architecture.txt#Infrastructure and Deployment Overview]` for details on Vercel environment management.
  - PRD states: "Separate Supabase instances will be used for development and production environments" (`[8-prd-po-updated.txt#Technical Assumptions]`). Ensure Vercel environment variables reflect this.
  - For local development: `.env.local` should use credentials for the _development_ Supabase instance.
  - Vercel "Development" environment (if created distinct from "Preview"): Link to a specific git branch (e.g., `develop`) and use _development_ Supabase instance credentials.
  - Vercel "Preview" environments (for PRs): Typically inherit from the "Development" environment settings or can be configured separately. Use _development_ Supabase instance credentials.
  - Vercel "Production" environment (for `main` branch): Use _production_ Supabase instance credentials.
- **Build Settings:** Vercel usually auto-detects Next.js settings. Ensure build commands and output directories are standard.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.3: Implement API and CLI trigger mechanisms

## Status: Draft

## Story

- As a developer
- I want to implement the API and CLI trigger mechanisms
- so that I can manually trigger the workflow during development and testing.

## Acceptance Criteria (ACs)

1.  A secure API endpoint is created.
2.  The API endpoint requires authentication (API key).
3.  The API endpoint (`/api/system/trigger-workflow`) creates an entry in the `workflow_runs` table and returns the `jobId`.
4.  The API endpoint returns an appropriate response to indicate success or failure.
5.  The API endpoint is secured via an API key.
6.  A CLI command is created.
7.  The CLI command invokes the `/api/system/trigger-workflow` endpoint or directly interacts with `WorkflowTrackerService` to start a new workflow run.
8.  The CLI command provides informative output to the console.
9.  All API requests and CLI command executions are logged, including timestamps and any relevant data.
10. All interactions with the API or CLI that initiate a workflow must record the `workflow_run_id` in logs.
11. The API and CLI interfaces adhere to mobile responsiveness and Tailwind/theming principles. (Self-correction: This AC seems misplaced for API/CLI, likely a copy-paste error from a UI story. It will be ignored for this backend story).

## Tasks / Subtasks

- [ ] Task 1: Create API Endpoint (`/api/system/trigger-workflow`). (AC: 1, 3, 4)
  - [ ] Create a Next.js API Route Handler at `app/(api)/system/trigger-workflow/route.ts` (as per `[3-architecture.txt#Project Structure]`).
  - [ ] Implement `POST` request handling.
  - [ ] On request, call the `WorkflowTrackerService.initiateNewWorkflow()` method (to be created in Story 1.5).
  - [ ] Return a `202 Accepted` response with `{"message": "Daily workflow triggered successfully...", "jobId": "<UUID_of_the_workflow_run>"}` on success, as specified in `[3-architecture.txt#Workflow Trigger API]`.
  - [ ] Return appropriate error responses (e.g., `401 Unauthorized`, `500 Internal Server Error`).
- [ ] Task 2: Secure API Endpoint. (AC: 2, 5)
  - [ ] Retrieve an API key from an environment variable (e.g., `WORKFLOW_TRIGGER_API_KEY`).
  - [ ] Expect the API key in the `X-API-KEY` header of incoming requests.
  - [ ] Reject requests with missing or invalid API keys with a `401 Unauthorized` response.
- [ ] Task 3: Implement CLI command. (AC: 6, 7, 8)
  - [ ] Create a Node.js script (e.g., `scripts/trigger-workflow.ts`) that can be run from the command line (e.g., via `npm run trigger-workflow`).
  - [ ] The script should either:
    - Make an HTTP POST request to the `/api/system/trigger-workflow` endpoint, including the API key.
    - Alternatively (if direct backend access is preferred for CLI and feasible): Initialize a Supabase admin client and directly call the `WorkflowTrackerService.initiateNewWorkflow()` method.
  - [ ] The script should output the `jobId` and a success/failure message to the console.
  - [ ] Add a corresponding script to `package.json` (e.g., `"trigger-workflow": "tsx scripts/trigger-workflow.ts"`).
- [ ] Task 4: Implement Logging. (AC: 9, 10)
  - [ ] In the API endpoint, use Pino logger (to be configured, see `[3-architecture.txt#Error Handling Strategy]`) to log request reception, API key validation result, `jobId` of created workflow, and any errors.
  - [ ] In the CLI command, log initiation, parameters used, response from API/service, and any errors.
  - [ ] Ensure all logs related to a workflow initiation include the generated `workflow_run_id`.

## Dev Technical Guidance

- **API Route Handler:**
  - Location: `app/(api)/system/trigger-workflow/route.ts` based on `[3-architecture.txt#Project Structure]`.
  - Use Next.js Route Handler conventions for `POST` method.
  - Interact with `WorkflowTrackerService` (from Story 1.5) to create the `workflow_runs` entry.
  - Response structure should match `[3-architecture.txt#Workflow Trigger API]`.
- **API Key Security:**
  - Store the actual key in `WORKFLOW_TRIGGER_API_KEY` environment variable.
  - Compare the request header `X-API-KEY` with this environment variable.
- **CLI Command:**
  - Can use a library like `axios` or `node-fetch` if calling the API endpoint, or Supabase client if interacting directly.
  - `tsx` or `ts-node` can be used to run TypeScript scripts directly (as per `[3-architecture.txt#Definitive Tech Stack Selections]`).
- **Logging:**
  - A shared Pino logger configuration should be established (see `[3-architecture.txt#Error Handling Strategy]`).
  - Logs should be structured (JSON) and include context like `workflowRunId`, `serviceName: 'APITriggerService'` or `'CLITriggerService'`.
- **Workflow Initiation:** The primary action is to create a new record in the `workflow_runs` table. The `jobId` returned is the ID of this record.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.4: Retrieve HN posts and comments via `ContentAcquisitionFacade`

## Status: Draft

## Story

- As a system
- I want to retrieve the top 30 Hacker News posts and associated comments daily using a configurable `ContentAcquisitionFacade`
- so that the data is available for summarization and newsletter generation.

## Acceptance Criteria (ACs)

1.  A `ContentAcquisitionFacade` is implemented in `supabase/functions/_shared/` to abstract interaction with the news data source (initially HN Algolia API).
2.  The facade handles API authentication (if any), request formation, and response parsing for the specific news source.
3.  The facade implements basic retry logic for transient errors.
4.  Unit tests for the `ContentAcquisitionFacade` (mocking actual HTTP calls to the HN Algolia API) achieve \>80% coverage.
5.  The system retrieves the top 30 Hacker News posts daily via the `ContentAcquisitionFacade`.
6.  The system retrieves associated comments for the top 30 posts via the `ContentAcquisitionFacade`.
7.  Retrieved data (posts and comments) is stored in Supabase database, linked to the current `workflow_run_id`.
8.  This functionality can be triggered via the API and CLI (implicitly, as part of the workflow started by Story 1.3, and executed by `HNContentService`).
9.  The system logs the start and completion of the retrieval process, including any errors.
10. Upon completion, the service updates the `workflow_runs` table with status and details (e.g., number of posts fetched) via `WorkflowTrackerService`.
11. Supabase migrations for `hn_posts` and `hn_comments` tables (as defined in `architecture.txt`) are created and applied before data operations.

## Tasks / Subtasks

- [ ] Task 1: Implement `ContentAcquisitionFacade`. (AC: 1, 2, 3)
  - [ ] Create `supabase/functions/_shared/content-acquisition-facade.ts`.
  - [ ] Implement a method like `WorkspaceTopHNPostsAndComments(limit: number)` within the facade.
  - [ ] Inside this method:
    - Fetch top posts from HN Algolia API (`GET /search?tags=front_page` as per `[3-architecture.txt#Hacker News (HN) Algolia API]`).
    - Sort posts by points (descending) and take the top `limit` (e.g., 30).
    - For each selected post, fetch its comments using `GET /items/{objectID}` (`[3-architecture.txt#Hacker News (HN) Algolia API]`).
    - Implement retry logic (e.g., 2-3 retries with exponential backoff) for API calls.
    - Parse responses to match `HNPost` and `HNComment` domain models (`[3-architecture.txt#Core Application Entities / Domain Objects]`).
- [ ] Task 2: Create Unit Tests for `ContentAcquisitionFacade`. (AC: 4)
  - [ ] Create `supabase/functions/_shared/content-acquisition-facade.test.ts`.
  - [ ] Mock HTTP requests to the HN Algolia API.
  - [ ] Test successful data fetching and parsing for posts and comments.
  - [ ] Test error handling and retry logic.
  - [ ] Aim for \>80% code coverage for the facade.
- [ ] Task 3: Create `HNContentService` Supabase Function. (AC: 5, 6, 7, 9, 10)
  - [ ] Create Supabase Function `hn-content-service` (e.g., in `supabase/functions/hn-content-service/index.ts`).
  - [ ] This function will be triggered (e.g., by `CheckWorkflowCompletionService` or directly after workflow initiation for the first step).
  - [ ] The function should accept `workflow_run_id` as a parameter.
  - [ ] Use the `WorkflowTrackerService` to update `workflow_runs` status to 'fetching_hn_posts' and log initiation.
  - [ ] Call `ContentAcquisitionFacade.fetchTopHNPostsAndComments()` to get data.
  - [ ] Store fetched posts into `hn_posts` table and comments into `hn_comments` table, linking them to the `workflow_run_id` and each other.
  - [ ] Use Pino logger for detailed logging of operations, data counts, and errors.
  - [ ] On successful completion, use `WorkflowTrackerService` to update `workflow_runs` details (e.g., `posts_fetched: count`) and potentially an intermediate status like 'hn_data_fetched'.
  - [ ] On failure, use `WorkflowTrackerService` to mark the workflow as failed with an error message.
- [ ] Task 4: Implement Database Migrations. (AC: 11)
  - [ ] Create Supabase migration files in `supabase/migrations/` for `hn_posts` and `hn_comments` tables as defined in `[3-architecture.txt#Database Schemas (Supabase PostgreSQL)]`.
  - [ ] Ensure table definitions include fields for `workflow_run_id` where appropriate (e.g., on `hn_posts`).
  - [ ] Apply migrations to the local/dev Supabase instance.
- [ ] Task 5: Integrate `HNContentService` into Workflow. (AC: 8)
  - [ ] Ensure that after a workflow is triggered by Story 1.3, the `HNContentService` is the first service to be invoked by the orchestration mechanism (e.g., `CheckWorkflowCompletionService` picking up 'pending' or 'initiated' workflows, or a direct call if designed that way for the first step).

## Dev Technical Guidance

- **Facade Design:**
  - The `ContentAcquisitionFacade` should be stateless and handle all interactions with the HN Algolia API.
  - Refer to API details in `[3-architecture.txt#Hacker News (HN) Algolia API]`.
  - Domain models (`HNPost`, `HNComment`) are defined in `[3-architecture.txt#Core Application Entities / Domain Objects]` and should ideally be in `shared/types/domain-models.ts`.
- **`HNContentService` Supabase Function:**
  - This is a backend Supabase Function.
  - It orchestrates the use of the facade and database interactions.
  - Must use the Supabase admin client for database operations.
  - Error handling is critical: log errors and update `workflow_runs` table appropriately via `WorkflowTrackerService`.
- **Data Storage:**
  - `hn_posts`: Store `id` (HN objectID), `title`, `url`, `author`, `points`, `created_at`, `retrieved_at`, `hn_story_text`, `num_comments`, `workflow_run_id`.
  - `hn_comments`: Store `id` (HN commentID), `hn_post_id`, `parent_comment_id`, `author`, `comment_text`, `created_at`, `retrieved_at`.
  - Reference schema details from `[3-architecture.txt#Database Schemas (Supabase PostgreSQL)]`.
- **Logging:** Use Pino structured logging. Include `workflow_run_id` in all relevant log messages.
- **Workflow Orchestration:** The `HNContentService` is a key step in the pipeline. Its completion (or failure) must be tracked in `workflow_runs`. The trigger for the _next_ step (Article Scraping, Story 1.9) will depend on successful inserts into `hn_posts`.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.5: Define and Implement `workflow_runs` Table and `WorkflowTrackerService`

## Status: Draft

## Story

- As a system
- I want to define and implement the `workflow_runs` table and a `WorkflowTrackerService`
- so that I have a robust mechanism for initiating, tracking, and managing the state of each daily workflow execution.

## Acceptance Criteria (ACs)

1.  Supabase migration created for the `workflow_runs` table as defined in the architecture document.
2.  `WorkflowTrackerService` implemented in `supabase/functions/_shared/` with methods for initiating, updating step details, incrementing counters, failing, and completing workflow runs.
3.  Service includes robust error handling and logging via Pino.
4.  Unit tests for `WorkflowTrackerService` achieve \>80% coverage.

## Tasks / Subtasks

- [ ] Task 1: Create `workflow_runs` table migration. (AC: 1)
  - [ ] Create a new Supabase migration file in `supabase/migrations/`.
  - [ ] Define the SQL for the `workflow_runs` table exactly as specified in `[3-architecture.txt#workflow_runs]`, including columns: `id`, `created_at`, `last_updated_at`, `status`, `current_step_details`, `error_message`, `details` (JSONB).
  - [ ] Include comments on columns as specified.
  - [ ] Apply the migration to the local/dev Supabase instance.
- [ ] Task 2: Implement `WorkflowTrackerService`. (AC: 2, 3)
  - [ ] Create file `supabase/functions/_shared/workflow-tracker-service.ts`.
  - [ ] Implement the `WorkflowTrackerService` class or module.
  - [ ] Methods to include:
    - `initiateNewWorkflow(initialStatus: string = 'pending', initialDetails?: object): Promise<{ jobId: string }>`: Creates a new row in `workflow_runs`, returns the `jobId`.
    - `updateWorkflowStep(jobId: string, stepDetails: string, newStatus?: string): Promise<void>`: Updates `current_step_details` and optionally `status`, and `last_updated_at`.
    - `updateWorkflowDetails(jobId: string, newDetails: object, merge: boolean = true): Promise<void>`: Updates the `details` JSONB column. `merge` indicates if newDetails should be merged with existing details or overwrite.
    - `incrementWorkflowDetailCounter(jobId: string, counterName: string, incrementBy: number = 1): Promise<void>`: Increments a numeric value within the `details` JSONB field.
    - `failWorkflow(jobId: string, errorMessage: string, stepDetails?: string): Promise<void>`: Sets status to 'failed', updates `error_message`, `current_step_details`, and `last_updated_at`.
    - `completeWorkflow(jobId: string, finalDetails?: object): Promise<void>`: Sets status to 'completed', updates `details` (if provided), and `last_updated_at`.
    - `getWorkflowStatus(jobId: string): Promise<WorkflowRun | null>`: Retrieves a workflow run by its ID.
  - [ ] Use Supabase admin client for database operations.
  - [ ] Implement comprehensive error handling for database operations within the service.
  - [ ] Use Pino for logging service activities, including `jobId` in logs.
- [ ] Task 3: Create Unit Tests for `WorkflowTrackerService`. (AC: 4)
  - [ ] Create `supabase/functions/_shared/workflow-tracker-service.test.ts`.
  - [ ] Mock the Supabase client (database interaction).
  - [ ] Write tests for each method:
    - Verify correct data is passed to the mocked Supabase client.
    - Test successful operations and expected return values.
    - Test behavior on database errors (e.g., Supabase client throws an error).
    - Test JSONB merging and counter logic.
  - [ ] Aim for \>80% code coverage.

## Dev Technical Guidance

- **`workflow_runs` Table:** The schema is critical. Adhere strictly to `[3-architecture.txt#workflow_runs]`. Pay attention to data types (TEXT, TIMESTAMPTZ, JSONB) and default values.
- **`WorkflowTrackerService`:**
  - This service is central to orchestration. It will be used by API/CLI triggers and all pipeline Supabase Functions.
  - Location: `supabase/functions/_shared/workflow-tracker-service.ts` as per `[3-architecture.txt#Project Structure]`.
  - Needs to use the Supabase admin client (`createClient` from `@supabase/supabase-js` initialized with `SUPABASE_SERVICE_ROLE_KEY`).
  - **JSONB Updates:** For `updateWorkflowDetails` and `incrementWorkflowDetailCounter`, be careful with JSONB manipulation. Supabase client allows direct updates to JSONB fields. For merging or incrementing, you might need to fetch, modify, and then update, or use database functions if performance becomes an issue (unlikely for MVP).
  - **Status Enum:** While the `status` column is TEXT, the service should internally work with a defined set of status strings (e.g., 'pending', 'fetching_hn', 'scraping_articles', etc., as listed in `[3-architecture.txt#WorkflowRun]`). Consider defining these as constants.
  - **Error Handling:** If database operations within the service fail, it should log the error and throw an exception so the calling service is aware.
- **Logging:** All methods in `WorkflowTrackerService` should log their actions, parameters (especially `jobId`), and outcomes. Use Pino.
- **Testing:** Mocking the Supabase client is key. Focus on testing the logic of how data is prepared for DB operations and how responses are handled.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.6: Implement `CheckWorkflowCompletionService` (Supabase Cron Function)

## Status: Draft

## Story

- As a system
- I want to implement the `CheckWorkflowCompletionService` as a Supabase Cron Function
- so that I can orchestrate the progression of workflows between different stages based on the completion of prerequisite tasks.

## Acceptance Criteria (ACs)

1.  Supabase Function `check-workflow-completion-service` created.
2.  Function queries `workflow_runs` and related tables to determine if a workflow run is ready to progress to the next major stage.
3.  Function correctly updates `workflow_runs.status` and invokes the next appropriate service function.
4.  Logic for handling podcast link availability is implemented here or in conjunction with `NewsletterGenerationService`.
5.  The function is configurable to be run periodically.
6.  Comprehensive logging implemented using Pino.
7.  Unit tests achieve \>80% coverage.

## Tasks / Subtasks

- [ ] Task 1: Create `check-workflow-completion-service` Supabase Function. (AC: 1)
  - [ ] Create the directory `supabase/functions/check-workflow-completion-service/`.
  - [ ] Create `index.ts` within this directory as the entry point for the function.
  - [ ] Set up the function to be invokable via an HTTP request (Vercel Cron Jobs will call this).
- [ ] Task 2: Implement workflow progression logic. (AC: 2, 3)
  - [ ] The function should query `workflow_runs` for active jobs (e.g., status not 'completed' or 'failed').
  - [ ] For each active job, determine its current status and check if prerequisites for the next stage are met. Examples:
    - If status is 'pending' (or an initial status like 'hn_content_fetching_initiated'): Invoke `HNContentService` (Story 1.4). (Self-correction: `HNContentService` might be directly called by trigger, or this service ensures it starts if not).
    - If status is 'hn_data_fetched' (or similar): Check if all expected `hn_posts` have triggered `ArticleScrapingService` (Story 2.x) tasks. (More likely, this service checks if scraping is _complete_).
    - If status is 'articles_scraped' (meaning all scraping tasks for a workflow_run_id are done): Update status to 'summarizing_content' and trigger `SummarizationService` (Story 3.x) for all articles/comments of that `workflow_run_id`.
    - If status is 'summaries_generated' (all summaries for workflow_run_id done): Update status to 'generating_newsletter', trigger `NewsletterGenerationService` (Story 4.x) to compile content.
    - If status is 'newsletter_content_generated' (and podcast initiated): Update status to 'generating_podcast'.
  - [ ] Use `WorkflowTrackerService` to update `workflow_runs.status`.
  - [ ] Invoke the next service function directly (e.g., by importing and calling its handler, or making an internal HTTP request if they are deployed as separate invokable endpoints).
- [ ] Task 3: Implement podcast link availability logic. (AC: 4)
  - [ ] If `workflow_runs.status` is 'generating_podcast' (or similar):
    - Query the `newsletters` table (for the current `workflow_run_id`) to check `podcast_status` and `podcast_url`.
    - If `podcast_status` is 'completed' and `podcast_url` is available, or if 'failed', or a timeout has occurred:
      - Update `workflow_runs.status` to 'delivering_newsletter'.
      - Trigger the delivery part of `NewsletterGenerationService` (Story 4.3).
- [ ] Task 4: Configure for periodic execution. (AC: 5)
  - [ ] Document how to set up a Vercel Cron Job (e.g., in `vercel.json` or Vercel dashboard) to call the HTTP endpoint of this Supabase Function periodically (e.g., every 5-10 minutes, as suggested in `[3-architecture.txt#Workflow Orchestration and Status Management]`).
- [ ] Task 5: Implement Logging. (AC: 6)
  - [ ] Use Pino logger for detailed logging:
    - Service invocation.
    - `workflow_run_id`s being processed.
    - Checks performed and their outcomes.
    - Next services being triggered.
    - Any errors encountered.
- [ ] Task 6: Create Unit Tests. (AC: 7)
  - [ ] Create `check-workflow-completion-service.test.ts`.
  - [ ] Mock `WorkflowTrackerService`, database queries (Supabase client), and any direct service invocations.
  - [ ] Test different workflow states and transitions:
    - No jobs ready to progress.
    - Job ready for summarization.
    - Job ready for newsletter generation.
    - Job waiting for podcast, then podcast becomes available.
    - Job waiting for podcast, then podcast fails or times out.
  - [ ] Test error handling within the service.
  - [ ] Aim for \>80% coverage.

## Dev Technical Guidance

- **Function Signature:** The Supabase Function should be an HTTP-triggered function. Vercel Cron jobs will send a `GET` or `POST` request.
- **Orchestration Logic:** This service is the "brain" of the pipeline progression. It needs to be robust and handle various states correctly. Refer to `[3-architecture.txt#Workflow Orchestration and Status Management]` and `[3-architecture.txt#Core Workflow / Sequence Diagrams]` for the intended flow.
- **Prerequisite Checks:** This involves querying various tables (`hn_posts`, `scraped_articles`, `article_summaries`, `comment_summaries`, `newsletters`) based on `workflow_run_id` to see if expected data is present and counts match, or statuses are 'completed'.
  - Example: To move from scraping to summarization for a `workflow_run_id`, it might check if `COUNT(scraped_articles WHERE workflow_run_id = X AND scraping_status = 'success')` matches an expected count (e.g., number of posts with URLs from `hn_posts` for that run).
- **Invoking Other Services:**
  - If Supabase Functions are co-located and can be imported, direct function calls might be possible.
  - Alternatively, each service could expose a minimal HTTP trigger for internal invocation, and this orchestrator calls those. This adds decoupling but also complexity. For MVP, direct invocation if possible might be simpler if all are part of the same deployment. The architecture doc mentions `Supabase Database Webhooks calling Supabase Functions hosted on Vercel` (`[3-architecture.txt#Architectural / Design Patterns Adopted]`), which implies individual functions. This orchestrator might be an exception, being a cron-triggered function that then calls other functions.
  - The exact mechanism for "invoking the next appropriate service" needs to be carefully designed. For services like `ArticleScrapingService` or `SummarizationService` which act on individual items, the orchestrator might trigger them _for all relevant items_ of a `workflow_run_id` once the previous stage for that run is globally complete.
- **Idempotency:** Consider if the orchestrator needs to be idempotent, though periodic checking and status updates should naturally handle this. If a step was already triggered but the status wasn't updated, it might get re-triggered. Ensure downstream services can handle this (e.g., don't re-scrape if already scraped for that `workflow_run_id`).
- **Configuration:** The cron schedule (e.g., "every 5 minutes") will be configured in Vercel.
- **Podcast Timeout:** The PRD mentions delay/retry for podcast link availability (`[8-prd-po-updated.txt#Functional Requirements (MVP)]` under Newsletter Gen & Delivery, and Story 4.3 AC11). This service should implement the "timeout" part of that logic.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.7: Implement Workflow Status API Endpoint (`/api/system/workflow-status/{jobId}`)

## Status: Draft

## Story

- As a developer/admin
- I want to check the status of a specific workflow run via an API endpoint
- so that I can monitor its progress and troubleshoot issues.

## Acceptance Criteria (ACs)

1.  Next.js API Route Handler created at `/api/system/workflow-status/{jobId}`.
2.  Endpoint secured with API Key authentication.
3.  Retrieves and returns status details from the `workflow_runs` table.
4.  Handles cases where `jobId` is not found (404).
5.  Unit and integration tests for the API endpoint.

## Tasks / Subtasks

- [ ] Task 1: Create API Route Handler. (AC: 1)
  - [ ] Create file `app/(api)/system/workflow-status/[jobId]/route.ts` (dynamic route segment for `jobId`).
  - [ ] Implement `GET` request handling.
- [ ] Task 2: Implement API Key Authentication. (AC: 2)
  - [ ] Reuse the API key authentication logic from Story 1.3 (check `X-API-KEY` header against `WORKFLOW_TRIGGER_API_KEY` env var).
  - [ ] Return `401 Unauthorized` for missing/invalid keys.
- [ ] Task 3: Retrieve and Return Workflow Status. (AC: 3)
  - [ ] Extract `jobId` from the URL path parameters.
  - [ ] Use `WorkflowTrackerService.getWorkflowStatus(jobId)` (from Story 1.5) to fetch the `workflow_runs` record.
  - [ ] If found, return a `200 OK` response with the workflow run data (e.g., `jobId`, `createdAt`, `lastUpdatedAt`, `status`, `currentStep`, `errorMessage`, `details`) as specified in `[3-architecture.txt#Workflow Status API]`.
- [ ] Task 4: Handle Not Found Cases. (AC: 4)
  - [ ] If `WorkflowTrackerService.getWorkflowStatus(jobId)` returns null (or no record found), return a `404 Not Found` response.
- [ ] Task 5: Implement Logging.
  - [ ] Use Pino logger to log request reception (including `jobId`), auth result, and outcome (status returned or error).
- [ ] Task 6: Create Tests. (AC: 5)
  - [ ] **Unit Tests:** Test the route handler logic by mocking `WorkflowTrackerService` and request/response objects. Test auth, successful retrieval, and 404 cases.
  - [ ] **Integration Tests:** (Optional but recommended) Test the endpoint by making actual HTTP requests (e.g., using `supertest`) to a running dev server, with a seeded `workflow_runs` table in the test/dev database.

## Dev Technical Guidance

- **API Route Location:** `app/(api)/system/workflow-status/[jobId]/route.ts` as per `[3-architecture.txt#Project Structure]`. Note the `[jobId]` for dynamic path parameter.
- **Authentication:** Consistent API key mechanism as in Story 1.3.
- **Data Retrieval:** Leverage the `WorkflowTrackerService.getWorkflowStatus(jobId)` method. This keeps data access logic centralized.
- **Response Format:** Adhere to the JSON response structure defined in `[3-architecture.txt#Workflow Status API]`:
  ```json
  {
    "jobId": "<UUID>",
    "createdAt": "timestamp",
    "lastUpdatedAt": "timestamp",
    "status": "string",
    "currentStep": "string", // This is currentStepDetails from workflow_runs
    "errorMessage": "string?",
    "details": {
      /* JSONB object */
    }
  }
  ```
- **Error Handling:** Standard HTTP error responses (`401`, `404`, `500` for unexpected server errors).
- **Logging:** Pino logger, include `jobId` from path and API key validation status.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.8: Create and document `docs/environment-vars.md` and set up `.env.example`

## Status: Draft

## Story

- As a developer
- I want environment variables properly documented and an example file provided
- so that project setup is clear and secure credential management is facilitated.

## Acceptance Criteria (ACs)

1.  A `docs/environment-vars.md` file is created.
2.  An `.env.example` file is created in the project root.
3.  Sensitive information in examples is masked (e.g., uses placeholders like `your_api_key_here`).
4.  For each third-party service requiring credentials, `docs/environment-vars.md` includes:
    - A brief note or link guiding the user on where to typically sign up for the service and obtain the necessary API key or credential.
    - A recommendation for the user to check the service's current free/low-tier API rate limits against expected MVP usage.
    - A note that usage beyond free tier limits for commercial services (like Play.ht, remote LLMs, or email providers) may incur costs, and the user should review the provider's pricing.

## Tasks / Subtasks

- [ ] Task 1: Create `.env.example` file. (AC: 2, 3)
  - [ ] Create `.env.example` in the project root.
  - [ ] List all environment variables required by the application so far and planned for Epic 1 (and subsequent epics if known).
    - `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here`
    - `SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here`
    - `WORKFLOW_TRIGGER_API_KEY=your_secure_api_key_for_triggers_here`
    - `LOG_LEVEL=info` (Example for Pino logger)
    - (Anticipating future stories):
    - `PLAYHT_USER_ID=`
    - `PLAYHT_API_KEY=`
    - `LLM_PROVIDER_TYPE=ollama` (e.g., 'ollama' or 'remote_api')
    - `OLLAMA_API_URL=http://localhost:11434` (if ollama type)
    - `REMOTE_LLM_API_URL=` (if remote_api type)
    - `REMOTE_LLM_API_KEY=` (if remote_api type)
    - `LLM_MODEL_NAME=llama2` (example)
    - `SMTP_HOST=`
    - `SMTP_PORT=`
    - `SMTP_USER=`
    - `SMTP_PASS=`
    - `SMTP_FROM_EMAIL=`
  - [ ] Ensure actual secret values are replaced with placeholders.
- [ ] Task 2: Create `docs/environment-vars.md`. (AC: 1, 4)
  - [ ] Create the file `docs/environment-vars.md`.
  - [ ] For each variable in `.env.example`, document:
    - Variable name.
    - Brief description of its purpose.
    - Whether it's required or optional.
    - Example value (masked if sensitive).
    - Where to obtain it (e.g., Supabase project settings, Play.ht dashboard).
    - Notes on rate limits/costs for third-party services (AC 4.b, 4.c).
  - [ ] Structure the document clearly (e.g., by service or category).

## Dev Technical Guidance

- **`.env.example`:**

  - Should be committed to Git.
  - Serves as a template for developers to create their `.env.local` (which should be in `.gitignore`).

- **`docs/environment-vars.md` Structure Example:**

  ```markdown
  # Environment Variables

  This document lists all environment variables used by the BMad DiCaster application.
  Create a `.env.local` file in the project root by copying `.env.example` and populate it with your actual values.

  ## Supabase

  Obtain these from your Supabase project settings dashboard.

  - `NEXT_PUBLIC_SUPABASE_URL`
    - Description: The public URL for your Supabase project.
    - Required: Yes
    - Example: `https://<your-project-ref>.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - Description: The public anonymous key for your Supabase project (for client-side access).
    - Required: Yes
    - Example: `ey...`
  - `SUPABASE_SERVICE_ROLE_KEY`
    - Description: The secret service role key for your Supabase project (for backend/admin access). **Keep this secret!**
    - Required: Yes (for backend functions)
    - Example: `ey...`

  ## System & API Keys

  - `WORKFLOW_TRIGGER_API_KEY`
    - Description: A secure API key used to authenticate requests to the `/api/system/trigger-workflow` endpoint. Generate a strong, random string for this.
    - Required: Yes (for API trigger)
    - Example: `a_very_strong_and_secret_key`

  ## Logging

  - `LOG_LEVEL`
    - Description: Sets the logging level for Pino logger.
    - Required: No (defaults to 'info')
    - Example: `debug` or `warn`

  ## Play.ht (Podcast Generation - Epic 5)

  Sign up at [Play.ht](https://play.ht/) to obtain API credentials. Review their API documentation for current rate limits and pricing tiers. MVP usage is expected to be low, but exceeding free/low-tier limits may incur costs.

  - `PLAYHT_USER_ID`
    - Description: Your Play.ht User ID.
    - Required: Yes (for Epic 5)
  - `PLAYHT_API_KEY`
    - Description: Your Play.ht API Key.
    - Required: Yes (for Epic 5)

  ## LLM Provider (Summarization - Epic 3)

  Configure for either local Ollama or a remote LLM API. For remote APIs, check provider's site for signup, key acquisition, rate limits, and pricing.

  - `LLM_PROVIDER_TYPE`
    - Description: Specifies the LLM provider. Either 'ollama' or 'remote_api'.
    - Required: Yes (for Epic 3)
    - Example: `ollama`
  - `OLLAMA_API_URL`
    - Description: URL for your local Ollama API (if `LLM_PROVIDER_TYPE=ollama`).
    - Required: If `LLM_PROVIDER_TYPE=ollama`
    - Example: `http://localhost:11434`
  - `REMOTE_LLM_API_URL`
    - Description: Base URL for the remote LLM provider's API (if `LLM_PROVIDER_TYPE=remote_api`).
    - Required: If `LLM_PROVIDER_TYPE=remote_api`
  - `REMOTE_LLM_API_KEY`
    - Description: API key for the remote LLM provider (if `LLM_PROVIDER_TYPE=remote_api`).
    - Required: If `LLM_PROVIDER_TYPE=remote_api`
  - `LLM_MODEL_NAME`
    - Description: The specific model name to be used for summarization (e.g., 'llama2', 'gpt-3.5-turbo').
    - Required: Yes (for Epic 3)
    - Example: `llama2`

  ## Nodemailer (Email Dispatch - Epic 4)

  Configure SMTP details for sending emails. These could be from a transactional email service (e.g., SendGrid, Mailgun - check their free tiers, rate limits, pricing) or a standard email provider.

  - `SMTP_HOST`
    - Description: SMTP server hostname.
    - Required: Yes (for Epic 4)
  - `SMTP_PORT`
    - Description: SMTP server port.
    - Required: Yes (for Epic 4)
  - `SMTP_USER`
    - Description: SMTP username.
    - Required: Yes (for Epic 4)
  - `SMTP_PASS`
    - Description: SMTP password.
    - Required: Yes (for Epic 4)
  - `SMTP_FROM_EMAIL`
    - Description: The "From" email address for outgoing newsletters.
    - Required: Yes (for Epic 4)
  ```

- **Zod for Validation:** While not explicitly in this story's ACs, the architecture mentions using Zod for runtime parsing/validation of environment variables (`[3-architecture.txt#Coding Standards]`). This is a good practice to consider implementing early, perhaps in a shared utility.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.9: Implement Database Event/Webhook: `hn_posts` Insert to Article Scraping Service

## Status: Draft

## Story

- As a system
- I want the successful insertion of a new Hacker News post into the `hn_posts` table to automatically trigger the `ArticleScrapingService`
- so that article scraping is initiated promptly as new post data becomes available.

## Acceptance Criteria (ACs)

1.  A Supabase database trigger or webhook mechanism (e.g., using `pg_net` or native triggers calling a function) is implemented on the `hn_posts` table for INSERT operations.
2.  The trigger successfully invokes the `ArticleScrapingService` (Supabase Function).
3.  The invocation passes necessary parameters like `hn_post_id` (which is the `id` of the newly inserted row) and `workflow_run_id` to the `ArticleScrapingService`.
4.  The mechanism is robust and includes error handling/logging for the trigger/webhook itself.
5.  Unit/integration tests are created to verify the trigger fires correctly and the service is invoked with correct parameters.

## Tasks / Subtasks

- [ ] Task 1: Design Trigger Mechanism.
  - [ ] Decide on the Supabase mechanism:
    - **Database Trigger + Function:** A PostgreSQL trigger on `hn_posts` (AFTER INSERT) calls a PL/pgSQL function. This function then uses `pg_net` to make an HTTP request to the `ArticleScrapingService` Supabase Function endpoint. This is robust.
    - **Supabase Webhooks (if directly applicable to table inserts):** Investigate if Supabase offers a simpler direct table-to-function webhook for Vercel-hosted functions. (The architecture mentions "Supabase Database Webhooks ... calling Supabase Functions hosted on Vercel" `[3-architecture.txt#Architectural / Design Patterns Adopted]`).
- [ ] Task 2: Implement Database Trigger and PL/pgSQL Function (if chosen). (AC: 1)
  - [ ] Create a migration file in `supabase/migrations/`.
  - [ ] Write SQL to define the PL/pgSQL function that constructs the payload (`hn_post_id`, `workflow_run_id`, `article_url` from the new row) and uses `pg_net.http_post` to call the `ArticleScrapingService`'s invocation URL.
  - [ ] Write SQL to create the `AFTER INSERT ON hn_posts FOR EACH ROW EXECUTE FUNCTION your_trigger_function();`.
  - [ ] Ensure the `ArticleScrapingService` (from Epic 2) has a known, stable invocation URL. For Supabase functions deployed on Vercel, this will be a Vercel function URL.
- [ ] Task 3: Configure `ArticleScrapingService` for Invocation. (AC: 2, 3)
  - [ ] Ensure `ArticleScrapingService` (to be developed in Epic 2) is designed to accept `hn_post_id`, `workflow_run_id`, and `article_url` (from `NEW.url` in the trigger) likely via its request body (if HTTP triggered).
  - [ ] The invocation URL for `ArticleScrapingService` needs to be securely callable, potentially requiring an internal auth mechanism (e.g., a shared secret/bearer token passed by `pg_net` and checked by the service) if not publicly exposed.
- [ ] Task 4: Implement Error Handling and Logging for Trigger. (AC: 4)
  - [ ] The PL/pgSQL function should have basic error handling (BEGIN/EXCEPTION block) to catch issues with `pg_net` calls and log them (e.g., to `stderr` or a dedicated log table if necessary, though `stderr` is usually captured by Supabase logs).
  - [ ] The `ArticleScrapingService` itself will have more detailed logging.
- [ ] Task 5: Create Tests. (AC: 5)
  - [ ] **Integration Test:** This is the most crucial test.
    - Set up a test environment with the trigger in place.
    - Insert a test row into `hn_posts`.
    - Verify that the `ArticleScrapingService` (mocked endpoint for this test if the service itself isn't built yet) receives an invocation with the correct parameters. Supabase CLI provides tools for local function testing and log inspection (`supabase functions serve` and `supabase db test`).
  - [ ] Consider how to unit test the PL/pgSQL function itself, if possible within Supabase's testing tools, or focus on the integration test.

## Dev Technical Guidance

- **`pg_net`:** This Supabase extension allows PostgreSQL functions to make HTTP requests. See Supabase documentation for `pg_net`.
  - Example `pg_net` call within PL/pgSQL:
    ```sql
    PERFORM net.http_post(
        url:='YOUR_ARTICLE_SCRAPING_SERVICE_INVOCATION_URL',
        body:=jsonb_build_object(
            'hnPostId', NEW.id,
            'workflowRunId', NEW.workflow_run_id,
            'articleUrl', NEW.url
        ),
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_INTERNAL_SECRET_TOKEN"}'::jsonb
    );
    ```
  - The `YOUR_ARTICLE_SCRAPING_SERVICE_INVOCATION_URL` would be the URL of the `article-scraper-service` Supabase Function.
  - An internal secret token (`YOUR_INTERNAL_SECRET_TOKEN`) stored as an environment variable for the Supabase instance (and readable by Postgres functions if configured) and checked by the target function adds security.
- **Trigger Payload:** The `NEW` record in a PostgreSQL trigger function refers to the newly inserted row. You can access `NEW.id`, `NEW.workflow_run_id`, `NEW.url`, etc.
- **Security of Invoked Function:** The `ArticleScrapingService` needs to verify that invocations are legitimate (e.g., via a bearer token or by checking the source if network policies allow).
- **Error Handling in Trigger:** If `pg_net` fails, the trigger function should ideally not cause the original INSERT into `hn_posts` to fail unless absolutely critical. Log the error and allow the insert to proceed. The `CheckWorkflowCompletionService` can act as a fallback if some scraping tasks aren't triggered.
- **Alternative - Supabase Function Hooks:** Supabase also offers "Function Hooks" on database events. This might be a simpler way to achieve the same if it directly supports invoking another Supabase/Vercel function with the event payload. This should be investigated as it might avoid raw `pg_net`. Architecture doc quote: "Supabase Database Webhooks (via `pg_net` or native functionality) to trigger Vercel-hosted Supabase Functions" `[3-architecture.txt#High-Level Overview]`. "Native functionality" might refer to these hooks.
- The `ArticleScrapingService` will be defined in Epic 2 (Story 2.x). This story (1.9) sets up the _triggering mechanism_. The actual service endpoint might be a placeholder or a mock during the testing of this story if Epic 2 isn't done.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.10: Define and Implement Core Configuration Tables

## Status: Draft

## Story

- As a system administrator/developer
- I want the database tables necessary for storing core application configurations like summarization prompts, newsletter templates, and subscriber lists established
- so that these configurations can be managed and utilized by the application.

## Acceptance Criteria (ACs)

1.  A Supabase migration is created and applied to define the `summarization_prompts` table schema as specified in `architecture.txt`.
2.  A Supabase migration is created and applied to define the `newsletter_templates` table schema as specified in `architecture.txt`.
3.  A Supabase migration is created and applied to define the `subscribers` table schema as specified in `architecture.txt`.
4.  These tables are ready for data population (e.g., via seeding or manual entry for MVP).

## Tasks / Subtasks

- [ ] Task 1: Create Migration for `summarization_prompts` Table. (AC: 1)
  - [ ] Create a new Supabase migration file.
  - [ ] Define the SQL for `summarization_prompts` table as per `[3-architecture.txt#summarization_prompts]`, including columns: `id`, `prompt_name`, `prompt_text`, `version`, `created_at`, `updated_at`, `is_default_article_prompt`, `is_default_comment_prompt`.
  - [ ] Include comments and constraints as specified.
  - [ ] Apply the migration.
- [ ] Task 2: Create Migration for `newsletter_templates` Table. (AC: 2)
  - [ ] Create a new Supabase migration file.
  - [ ] Define the SQL for `newsletter_templates` table as per `[3-architecture.txt#newsletter_templates]`, including columns: `id`, `template_name`, `mjml_content`, `html_content`, `version`, `created_at`, `updated_at`, `is_default`.
  - [ ] Include comments and constraints as specified.
  - [ ] Apply the migration.
- [ ] Task 3: Create Migration for `subscribers` Table. (AC: 3)
  - [ ] Create a new Supabase migration file.
  - [ ] Define the SQL for `subscribers` table as per `[3-architecture.txt#subscribers]`, including columns: `id`, `email`, `subscribed_at`, `is_active`, `unsubscribed_at`.
  - [ ] Include indexes and constraints as specified.
  - [ ] Apply the migration.
- [ ] Task 4: Verify Table Readiness. (AC: 4)
  - [ ] After applying migrations, inspect the database schema (e.g., via Supabase Studio or `psql`) to confirm the tables are created correctly.
  - [ ] Confirm tables are empty and ready for data population by Story 1.11 (Seeding).

## Dev Technical Guidance

- **Migration Files:** Use `supabase migrations new <migration_name>` to create new migration files in `supabase/migrations/`.
- **SQL Definitions:** Copy the `CREATE TABLE` statements directly from `[3-architecture.txt#Database Schemas (Supabase PostgreSQL)]` for each table:
  - `summarization_prompts` (`[3-architecture.txt#summarization_prompts]`)
  - `newsletter_templates` (`[3-architecture.txt#newsletter_templates]`)
  - `subscribers` (`[3-architecture.txt#subscribers]`)
- **Application Logic for Defaults:** The architecture notes for `summarization_prompts` and `newsletter_templates` state: "Application logic will enforce that only one prompt of each type is marked as default" and "Application logic will enforce that only one template is marked as default" (`[3-architecture.txt#summarization_prompts]` and `[3-architecture.txt#newsletter_templates]`). This logic is not part of the table DDL but will be important when services interact with these tables. For this story, just creating the tables is sufficient.
- **Applying Migrations:** Use `supabase db push` (for local dev, careful with existing data) or `supabase migration up --linked` (for linked projects) after creating and editing the migration files. For local development, `supabase start` often applies new migrations. `supabase db reset` is also useful for a clean slate with all migrations.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.11: Create Seed Data for Initial Configuration

## Status: Draft

## Story

- As a developer
- I want to populate the database with initial configuration data (prompts, templates, test subscribers)
- so that the application has necessary default settings for MVP development and testing.

## Acceptance Criteria (ACs)

1.  A `supabase/seed.sql` file (or an equivalent, documented seeding mechanism) is created.
2.  The seed mechanism populates the `summarization_prompts` table with at least one default article prompt and one default comment prompt.
3.  The seed mechanism populates the `newsletter_templates` table with at least one default newsletter template (HTML format for MVP).
4.  The seed mechanism populates the `subscribers` table with a small list of 1-3 test email addresses for MVP delivery testing.
5.  Instructions on how to apply the seed data to a local or development Supabase instance are documented (e.g., in the project `README.md`).

## Tasks / Subtasks

- [ ] Task 1: Create `supabase/seed.sql` file. (AC: 1)
  - [ ] Create the file `supabase/seed.sql` in the `supabase` directory. This file is automatically run by `supabase db reset` and often by `supabase start` if the DB is fresh.
- [ ] Task 2: Add Seed Data for `summarization_prompts`. (AC: 2)
  - [ ] Write `INSERT` statements in `seed.sql` for `summarization_prompts`.
  - [ ] Include one prompt marked `is_default_article_prompt = TRUE`.
  - Example Article Prompt: "Summarize the following article in two concise paragraphs, focusing on its key findings and implications: {article_text}"
  - [ ] Include one prompt marked `is_default_comment_prompt = TRUE`.
  - Example Comment Prompt: "Summarize the key themes and most insightful or contrasting viewpoints from the following Hacker News comments in two concise paragraphs: {comment_text}"
- [ ] Task 3: Add Seed Data for `newsletter_templates`. (AC: 3)
  - [ ] Write `INSERT` statements in `seed.sql` for `newsletter_templates`.
  - [ ] Include one template marked `is_default = TRUE`.
  - [ ] The `html_content` should be a basic HTML structure for a newsletter.
  - Example HTML structure:
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <title>{{newsletter_title}}</title>
      </head>
      <body>
        <h1>{{newsletter_title}}</h1>
        <h2>Articles</h2>
        {{article_summaries_section}}
        <h2>Comments</h2>
        {{comment_summaries_section}}
        <p>Podcast: <a href="{{podcast_url}}">{{podcast_url}}</a></p>
      </body>
    </html>
    ```
    (Placeholders like `{{newsletter_title}}` will be replaced by the `NewsletterGenerationService`.)
- [ ] Task 4: Add Seed Data for `subscribers`. (AC: 4)
  - [ ] Write `INSERT` statements in `seed.sql` for `subscribers`.
  - [ ] Add 1-3 valid (but test/dev) email addresses, marked as `is_active = TRUE`. (e.g., `developer1@example.com`, `testuser@example.com`).
- [ ] Task 5: Document Seeding Process. (AC: 5)
  - [ ] Add a section to `README.md` explaining how to apply seed data (e.g., "Run `supabase db reset` to reset your local database and apply migrations and seed data." or "Seed data in `supabase/seed.sql` is automatically applied when starting Supabase locally for the first time or after a reset.").

## Dev Technical Guidance

- **`supabase/seed.sql`:** This is the standard location for seed data that Supabase CLI can automatically apply.
- **SQL `INSERT` Statements:** Use standard SQL syntax. Example for `summarization_prompts`:
  ```sql
  INSERT INTO public.summarization_prompts (prompt_name, prompt_text, version, is_default_article_prompt, is_default_comment_prompt) VALUES
  ('default_article_v1', 'Summarize the following article in two concise paragraphs...: {article_text}', '1.0', TRUE, FALSE),
  ('default_comment_v1', 'Summarize the key themes from the following comments...: {comment_text}', '1.0', FALSE, TRUE);
  ```
- **Newsletter Template Placeholders:** The `NewsletterGenerationService` (Epic 4) will be responsible for replacing placeholders like `{{newsletter_title}}`, `{{article_summaries_section}}`, `{{comment_summaries_section}}`, `{{podcast_url}}` with actual content. The seed data just provides the template structure.
- **Idempotency:** `seed.sql` is typically run on a fresh or reset database. If you need it to be idempotent (runnable multiple times without error or duplication), you'd need to add checks (e.g., `INSERT ... ON CONFLICT DO NOTHING`), but for initial seeding, this is usually not necessary. Supabase's `db reset` handles wiping data before seeding.
- **Testing Seed Data:** After writing `seed.sql`, run `supabase stop`, `supabase start` (or `supabase db reset`) and then check the tables in Supabase Studio or via `psql` to ensure data is populated correctly.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---

# Story 1.12: Set up and Configure Project Testing Frameworks

## Status: Draft

## Story

- As a developer
- I want the primary testing frameworks (Jest, React Testing Library, Playwright) installed and configured early
- so that test-driven development practices can be followed and the testing strategy adhered to from the beginning.

## Acceptance Criteria (ACs)

1.  Jest and React Testing Library (RTL) are installed as project dependencies.
2.  Jest and RTL are configured for unit and integration testing of Next.js components and JavaScript/TypeScript code (e.g., `jest.config.js` is set up, necessary Babel/TS transformations are in place).
3.  A sample unit test (e.g., for a simple utility function or a basic React component) is created and runs successfully using the Jest/RTL setup.
4.  Playwright is installed as a project dependency.
5.  Playwright is configured for end-to-end testing (e.g., `playwright.config.ts` is set up, browser configurations are defined).
6.  A sample E2E test (e.g., navigating to the application's homepage on the local development server) is created and runs successfully using Playwright.
7.  Scripts to execute tests (e.g., unit tests, E2E tests) are added to `package.json`.

## Tasks / Subtasks

- [ ] Task 1: Install and Configure Jest & RTL. (AC: 1, 2)
  - [ ] Install Jest, RTL, and necessary related packages (e.g., `@testing-library/react`, `@testing-library/jest-dom`, `ts-jest`, `jest-environment-jsdom`).
  - [ ] Create/configure `jest.config.js` (or `jest.config.ts`) for Next.js compatibility (e.g., using Next.js's Jest preset, moduleNameMapper for path aliases `@/*`, setupFilesAfterEnv for `@testing-library/jest-dom`).
  - [ ] Ensure TypeScript (`ts-jest`) is correctly configured for Jest.
- [ ] Task 2: Create Sample Unit Test. (AC: 3)
  - [ ] Create a simple utility function (e.g., in `lib/utils.ts`, a date formatter or string utility).
  - [ ] Write a `*.test.ts` file for this utility (e.g., `lib/utils.test.ts`).
  - [ ] Write a basic test case for the utility function.
  - [ ] Run `jest` and confirm the test passes.
  - [ ] (Optional) Create a very simple React component and a basic RTL test for it.
- [ ] Task 3: Install and Configure Playwright. (AC: 4, 5)
  - [ ] Install Playwright (`@playwright/test`).
  - [ ] Initialize Playwright configuration (e.g., `playwright.config.ts` via `npx playwright init` or manual setup).
  - [ ] Configure base URL for tests (e.g., `http://localhost:3000` for local dev server).
  - [ ] Configure target browsers if needed (defaults are usually fine).
  - [ ] Set up test directory (e.g., `tests/e2e/` as per `[3-architecture.txt#Project Structure]`).
- [ ] Task 4: Create Sample E2E Test. (AC: 6)
  - [ ] Create a sample test file in the E2E test directory (e.g., `tests/e2e/homepage.spec.ts`).
  - [ ] Write a simple test to navigate to the homepage (`/`) and check for a known element (e.g., a heading or a specific text content expected on the default template page).
  - [ ] Run Playwright tests and confirm the sample test passes against the local dev server (`npm run dev` must be running).
- [ ] Task 5: Add Test Scripts to `package.json`. (AC: 7)
  - [ ] Add scripts like:
    - `"test:unit": "jest"`
    - `"test:unit:watch": "jest --watch"`
    - `"test:e2e": "playwright test"`
    - `"test": "npm run test:unit && npm run test:e2e"` (or similar combined script)

## Dev Technical Guidance

- **Jest Configuration for Next.js:**
  - Next.js provides guidance on setting up Jest: [https://nextjs.org/docs/app/building-your-application/testing/jest](https://nextjs.org/docs/app/building-your-application/testing/jest)
  - Ensure `moduleNameMapper` in `jest.config.js` is set up to handle path aliases like `@/*` (e.g., `"^@/(.*)$": "<rootDir>/$1"` if using `baseUrl: "."` and `paths: {"@/*": ["./*"]}` in `tsconfig.json`). The Vercel template might have `@/` map to `app/` or `src/`. Adjust accordingly. The architecture `[3-architecture.txt#Monorepo Management]` says `@/*` and `@shared/*`. `frontend-architecture.txt` (`[5-front-end-architecture.txt#Detailed Frontend Directory Structure]`) indicates `@/*` for `tsconfig.json`.
- **Playwright Configuration:**
  - Refer to Playwright documentation: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
  - `playwright.config.ts` will define projects (browsers), base URL, and other settings.
  - The E2E tests will be located in `tests/e2e/` as per `[3-architecture.txt#Project Structure]` and `[5-front-end-architecture.txt#End-to-End UI Testing Tools & Scope]`.
- **Sample Tests:**
  - Unit test: Keep it simple, just to verify the framework setup.
  - E2E test: A basic navigation and content check. The homepage might initially be the default Next.js template page before Epic 6 implements the newsletter list.
- **CI/CD Integration:** While not part of this story, these test scripts will be used in GitHub Actions (or other CI/CD) later.
- **Testing Strategy Document:** Adherence to `[3-architecture.txt#Overall Testing Strategy]` and `[5-front-end-architecture.txt#Frontend Testing Strategy]`. Unit tests are co-located, integration/E2E in `tests/` dir.

## Story Progress Notes

### Agent Model Used: `<Agent Model Name/Version>`

### Completion Notes List

{Any notes about implementation choices, difficulties, or follow-up needed}

### Change Log

---
