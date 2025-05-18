# Epic 5: Podcast Generation Integration

> This document is a granulated shard from the main "BETA-V3/v3-demos/full-stack-app-demo/8-prd-po-updated.md" focusing on "Epic 5: Podcast Generation Integration".

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
