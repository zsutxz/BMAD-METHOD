# Epic 4: Automated Newsletter Creation and Distribution

> This document is a granulated shard from the main "BETA-V3/v3-demos/full-stack-app-demo/8-prd-po-updated.md" focusing on "Epic 4: Automated Newsletter Creation and Distribution".

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
