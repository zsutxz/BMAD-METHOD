# Epic 3: AI-Powered Content Summarization Stories

## Story 3.1: Implement LLMFacade for AI Summarization

### Status: Approved

### Story

- As a system
- I want to integrate an AI summarization capability by implementing and using an `LLMFacade`
- so that I can generate concise summaries of articles and comments using various configurable LLM providers.

### Acceptance Criteria (ACs)

1. An `LLMFacade` interface and concrete implementations (e.g., `OllamaAdapter`, `RemoteLLMApiAdapter`) are created in `supabase/functions/_shared/llm-facade.ts`.
2. A factory function is implemented within or alongside the facade to select the appropriate LLM adapter based on environment variables (e.g., `LLM_PROVIDER_TYPE`, `OLLAMA_API_URL`, `REMOTE_LLM_API_KEY`, `REMOTE_LLM_API_URL`, `LLM_MODEL_NAME`).
3. The `LLMFacade` handles making requests to the respective LLM APIs (as configured) and parsing their responses to extract the summary.
4. Robust error handling and retry logic for transient API errors are implemented within the facade.
5. Unit tests for the `LLMFacade` and its adapters (mocking actual HTTP calls) achieve >80% coverage.
6. The system utilizes this `LLMFacade` for all summarization tasks (articles and comments).
7. The integration is configurable via environment variables to switch between local and remote LLMs and specify model names.

### Tasks / Subtasks

- [ ] Create the `LLMFacade` interface in `supabase/functions/_shared/llm-facade.ts` (AC: 1)
  - [ ] Define core interface methods like `summarize(content: string, instructions: string): Promise<string>`
  - [ ] Include retry count, timeout, and other configurable parameters
- [ ] Implement the `OllamaAdapter` class (AC: 1, 3, 4)
  - [ ] Create HTTP client to communicate with Ollama API
  - [ ] Implement retry logic for transient errors
  - [ ] Add appropriate logging and error handling
  - [ ] Format response parsing to extract the summary text
- [ ] Implement the `RemoteLLMApiAdapter` class for commercial APIs (AC: 1, 3, 4)
  - [ ] Create HTTP client to communicate with remote API (e.g., OpenAI, Amazon Bedrock, etc.)
  - [ ] Implement retry logic for transient errors
  - [ ] Add appropriate logging and error handling
  - [ ] Format response parsing to extract the summary text
- [ ] Create a factory function for instantiating the right adapter (AC: 2)
  - [ ] Implement logic to choose adapter based on environment variables
  - [ ] Add validation for required environment variables
  - [ ] Create helpful error messages for missing/invalid configurations
- [ ] Add appropriate TypeScript interfaces and types (AC: 1-3)
- [ ] Add unit tests for the `LLMFacade` and adapters (AC: 5)
  - [ ] Test factory function with different environment configurations
  - [ ] Test retry logic with mocked API responses
  - [ ] Test error handling with different error scenarios
  - [ ] Test response parsing with sample API responses
- [ ] Create documentation in code comments (AC: 6)
  - [ ] Document the facade pattern implementation
  - [ ] Document environment variable requirements
  - [ ] Include examples of usage for future services

### Dev Technical Guidance

The `LLMFacade` follows the facade design pattern to abstract away the complexity of interacting with different LLM providers. This is a critical component that will be used by both article and comment summarization services.

#### Environment Variables

The facade should look for these environment variables:

- `LLM_PROVIDER_TYPE`: Values like "ollama" or "remote"
- `OLLAMA_API_URL`: URL for Ollama API (e.g., "http://localhost:11434")
- `REMOTE_LLM_API_KEY`: API key for remote LLM service
- `REMOTE_LLM_API_URL`: URL endpoint for remote LLM service
- `LLM_MODEL_NAME`: Model name to use (e.g., "llama2" for Ollama or specific model IDs for remote providers)

Refer to `environment-vars.md` for the exact format and required variables.

#### Error Handling

Implement robust error handling with categorization of errors:

- Network/connectivity issues (should trigger retries)
- Authentication failures (should fail immediately with clear message)
- Rate limiting issues (should backoff and retry)
- Malformed responses (should be logged in detail)

Use exponential backoff for retries with configurable maximum attempts (default: 3).

#### Testing

Mock the HTTP calls to external APIs in tests. For adapter tests, use sample API responses from real LLM providers to ensure proper parsing. Test both successful and error scenarios.

## Story Progress Notes

### Agent Model Used: `Claude 3.7 Sonnet`

### Completion Notes List

### Change Log

---

## Story 3.2: Implement Article Summarization Service

### Status: Approved

### Story

- As a system
- I want to retrieve summarization prompts from the database, and then use them via the `LLMFacade` to generate 2-paragraph summaries of the scraped articles
- so that users can quickly grasp the main content and the prompts can be easily updated.

### Acceptance Criteria (ACs)

1. The service retrieves the appropriate summarization prompt from the `summarization_prompts` table.
2. The system generates a 2-paragraph summary for each scraped article using the retrieved prompt via the `LLMFacade`.
3. Generated summaries are stored in the `article_summaries` table, linked to the `scraped_article_id` and the current `workflow_run_id`.
4. The summaries are accurate and capture the key information from the article.
5. Upon completion of each article summarization task, the service updates `workflow_runs.details` (e.g., incrementing article summaries generated counts) via `WorkflowTrackerService`.
6. (System Note: The `CheckWorkflowCompletionService` monitors the `article_summaries` table as part of determining overall summarization completion for a `workflow_run_id`).
7. A Supabase migration for the `article_summaries` table (as defined in `architecture.txt`) is created and applied before data operations.

### Tasks / Subtasks

- [ ] Create Supabase migration for `article_summaries` table if not already exists (AC: 7)
  - [ ] Use the SQL schema from `data-models.md`
  - [ ] Include proper indexes and foreign key constraints
  - [ ] Add migration to appropriate migration folder
- [ ] Implement the article summarization service in `supabase/functions/summarization-service/index.ts` (AC: 1-6)
  - [ ] Implement function to retrieve default article summarization prompt from database
  - [ ] Import and use the `LLMFacade` from `_shared/llm-facade.ts`
  - [ ] Add logic to get scraped articles for the current workflow run
  - [ ] Process each article sequentially to avoid rate limiting
- [ ] Implement error handling and status tracking (AC: 5)
  - [ ] Use the `WorkflowTrackerService` to update workflow status
  - [ ] Implement appropriate error handling for failed summarizations
  - [ ] Update workflow details with counts of successful/failed summarizations
- [ ] Add logging for monitoring and debugging (AC: 2-5)
  - [ ] Log start and end of summarization process
  - [ ] Log key metrics (articles processed, time taken, etc.)
  - [ ] Log errors with appropriate context
- [ ] Create unit tests for the service
  - [ ] Test prompt retrieval logic
  - [ ] Test article processing logic with mocked LLMFacade
  - [ ] Test error handling scenarios

### Dev Technical Guidance

This service is triggered after article scraping is completed. It should batch-process articles but be mindful of potential rate limits from LLM providers. Consider processing articles with an appropriate delay between requests.

#### Database Interactions

The service needs to:

1. Retrieve the default article summarization prompt (where `is_default_article_prompt = true`)
2. Fetch all scraped articles for the current workflow run
3. Insert summaries into the `article_summaries` table
4. Update workflow status via the `WorkflowTrackerService`

The service should check if summaries already exist for the article+workflow combination to avoid duplicates.

#### Prompt Engineering

The service should combine the template prompt with the article text in a format that gives the LLM sufficient context but stays within token limits. A simple approach:

```
{summarization_prompt_text}

ARTICLE TEXT:
{article_text}

SUMMARY:
```

#### WorkflowTracker Integration

Use the `WorkflowTrackerService` to:

1. Update the workflow status to "summarizing_articles" at start
2. Increment the "article_summaries_generated" counter in the workflow details for each success
3. Update workflow status appropriately on completion or failure

## Story Progress Notes

### Agent Model Used: `Claude 3.7 Sonnet`

### Completion Notes List

### Change Log

---

## Story 3.3: Implement Comment Summarization Service

### Status: Approved

### Story

- As a system
- I want to retrieve summarization prompts from the database, and then use them via the `LLMFacade` to generate 2-paragraph summaries of the comments for the selected HN posts
- so that users can understand the main discussions and the prompts can be easily updated.

### Acceptance Criteria (ACs)

1. The service retrieves the appropriate summarization prompt from the `summarization_prompts` table.
2. The system generates a 2-paragraph summary of the comments for each selected HN post using the retrieved prompt via the `LLMFacade`.
3. Generated summaries are stored in the `comment_summaries` table, linked to the `hn_post_id` and the current `workflow_run_id`.
4. The summaries highlight interesting interactions and key points from the discussion.
5. Upon completion of each comment summarization task, the service updates `workflow_runs.details` (e.g., incrementing comment summaries generated counts) via `WorkflowTrackerService`.
6. (System Note: The `CheckWorkflowCompletionService` monitors the `comment_summaries` table as part of determining overall summarization completion for a `workflow_run_id`).
7. A Supabase migration for the `comment_summaries` table (as defined in `architecture.txt`) is created and applied before data operations.

### Tasks / Subtasks

- [ ] Create Supabase migration for `comment_summaries` table if not already exists (AC: 7)
  - [ ] Use the SQL schema from `data-models.md`
  - [ ] Include proper indexes and foreign key constraints
  - [ ] Add migration to appropriate migration folder
- [ ] Implement the comment summarization service in the same `supabase/functions/summarization-service/index.ts` file as the article summarization (AC: 1-6)
  - [ ] Add function to retrieve default comment summarization prompt from database
  - [ ] Add logic to fetch all comments for selected HN posts in current workflow run
  - [ ] Concatenate comments with appropriate context before sending to LLM
- [ ] Group comments by HN post for summarization (AC: 2, 4)
  - [ ] Implement logic to combine comments for each post
  - [ ] Format grouped comments in a way that preserves threading information
  - [ ] Handle potentially large comment volumes (pagination/chunking)
- [ ] Use the `LLMFacade` to generate summaries (AC: 2, 4)
  - [ ] Pass comments along with the prompt to the facade
  - [ ] Implement error handling for individual summarization failures
- [ ] Store results in database (AC: 3)
  - [ ] Insert summaries into the `comment_summaries` table
  - [ ] Link to appropriate `hn_post_id` and `workflow_run_id`
- [ ] Track workflow progress (AC: 5)
  - [ ] Update workflow status via `WorkflowTrackerService`
  - [ ] Increment comment summary count in workflow details
- [ ] Create unit tests for the service
  - [ ] Test comment grouping logic
  - [ ] Test integration with LLMFacade (with mocks)
  - [ ] Test error handling scenarios

### Dev Technical Guidance

The comment summarization service follows a similar pattern to the article summarization service but has additional complexity due to the comment threading structure and potential volume of comments.

#### Handling Comment Threads

HN comments can be deeply nested. When presenting comments to the LLM, maintain context by:

1. Sorting comments by timestamp
2. Including parent-child relationships with simple indentation or prefixing
3. Including usernames to maintain conversation flow

#### Token Limit Management

Comments for popular posts can exceed LLM context windows. Consider:

1. Limiting to top N comments by points/engagement
2. Chunking comments and generating multiple summaries, then combining
3. Including a "summarize the most interesting discussions" instruction in the prompt

#### Error Handling

Comments may contain challenging content. Implement robust error handling:

1. Track which HN posts have failed summarization
2. Implement a fallback mechanism for failed summaries
3. Continue processing other posts if one fails

#### WorkflowTracker Integration

Similar to article summarization, use the `WorkflowTrackerService` to track progress and update workflow status.

## Story Progress Notes

### Agent Model Used: `Claude 3.7 Sonnet`

### Completion Notes List

### Change Log

---

## Story 3.4: Implement API and CLI for Triggering AI Summarization

### Status: Approved

### Story

- As a developer
- I want to trigger the AI summarization process via the API and CLI
- so that I can manually initiate it for testing and debugging.

### Acceptance Criteria (ACs)

1. The API endpoint can trigger the AI summarization process.
2. The CLI command can trigger the AI summarization process locally.
3. The system logs the input and output of the summarization process, including the summarization prompt used and any errors.
4. All API requests and CLI command executions are logged, including timestamps and any relevant data.
5. The system handles partial execution gracefully (i.e., if triggered before Epic 2 is complete, it logs a message and exits).
6. All summarization operations initiated via this trigger must be associated with a valid `workflow_run_id` and update the `workflow_runs` table accordingly via `WorkflowTrackerService`.

### Tasks / Subtasks

- [ ] Extend the existing API endpoint in `app/(api)/system/trigger-workflow/route.ts` (AC: 1, 3, 4, 6)
  - [ ] Add option to trigger only summarization step
  - [ ] Add parameter to specify workflow_run_id for existing workflow
  - [ ] Add validation to check workflow prerequisites are met
  - [ ] Implement appropriate error handling and logging
- [ ] Create CLI command for triggering summarization (AC: 2, 3, 4, 6)
  - [ ] Create entry in `package.json` scripts for CLI command
  - [ ] Implement CLI logic in appropriate location
  - [ ] Add option to specify workflow_run_id
  - [ ] Add help text and usage examples
- [ ] Implement validation logic for prerequisites (AC: 5)
  - [ ] Check if required data exists in database for specified workflow
  - [ ] Return appropriate error messages if prerequisites are not met
  - [ ] Log validation failures in detail
- [ ] Add detailed logging (AC: 3, 4)
  - [ ] Log API/CLI invocation details
  - [ ] Log validation results
  - [ ] Log summarization prompt retrieval
  - [ ] Log workflow progression
- [ ] Implement workflow progress tracking (AC: 6)
  - [ ] Update workflow status via `WorkflowTrackerService`
  - [ ] Ensure workflow details are updated appropriately
- [ ] Create unit tests for new functionality
  - [ ] Test API endpoint with various scenarios
  - [ ] Test CLI command functionality
  - [ ] Test validation logic with valid/invalid workflows

### Dev Technical Guidance

The API endpoint and CLI should both leverage the same core logic for triggering the summarization process. Consider implementing a shared service that both can call.

#### API Endpoint Design

Extend the existing workflow trigger API to support:

1. Triggering specific steps (like summarization) by adding a `step` parameter
2. Providing an existing `workflow_run_id` to continue processing
3. Returning detailed validation results for failed requests

Example request:

```json
{
  "step": "summarization",
  "workflow_run_id": "123e4567-e89b-12d3-a456-426614174000",
  "options": {
    "force": false
  }
}
```

#### CLI Design

Use a command like:

```bash
npm run summarize -- --workflow-id=123e4567-e89b-12d3-a456-426614174000 [--force]
```

#### Validation Logic

Before triggering summarization, validate:

1. The workflow exists in the database
2. The workflow has scraped articles ready for summarization
3. The summarization hasn't already been completed for this workflow

If validation fails, provide clear error messages that help diagnose the issue.

#### Error Handling

Implement robust error handling that:

1. Distinguishes between client errors (invalid input) and server errors
2. Provides actionable error messages
3. Logs detailed context for debugging
4. Tracks failures in the workflow status

## Story Progress Notes

### Agent Model Used: `Claude 3.7 Sonnet`

### Completion Notes List

### Change Log
