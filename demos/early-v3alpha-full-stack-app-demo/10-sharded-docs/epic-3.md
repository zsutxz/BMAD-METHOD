# Epic 3: AI-Powered Content Summarization

> This document is a granulated shard from the main "BETA-V3/v3-demos/full-stack-app-demo/8-prd-po-updated.md" focusing on "Epic 3: AI-Powered Content Summarization".

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
