# API Reference

> This document is a granulated shard from the main "3-architecture.md" focusing on "API Reference".

### External APIs Consumed

#### 1\. Hacker News (HN) Algolia API

- **Purpose:** To retrieve top Hacker News posts and their associated comments.
- **Base URL(s):** Production: `http://hn.algolia.com/api/v1/`
- **Authentication:** None required.
- **Key Endpoints Used:**
  - **`GET /search` (for top posts)**
    - Description: Retrieves stories currently on the Hacker News front page.
    - Request Parameters: `tags=front_page`
    - Example Request: `curl "http://hn.algolia.com/api/v1/search?tags=front_page"`
    - Post-processing: Application sorts fetched stories by `points` (descending), selects up to top 30.
    - Success Response Schema (Code: `200 OK`): Standard Algolia search response containing 'hits' array with story objects.
      ```json
      {
        "hits": [
          {
            "objectID": "string",
            "created_at": "string",
            "title": "string",
            "url": "string",
            "author": "string",
            "points": "number",
            "story_text": "string",
            "num_comments": "number",
            "_tags": ["string"]
          }
        ],
        "nbHits": "number",
        "page": "number",
        "nbPages": "number",
        "hitsPerPage": "number"
      }
      ```
  - **`GET /items/{objectID}` (for comments)**
    - Description: Retrieves a specific story item by its `objectID` to get its full comment tree from the `children` field. Called for each selected top story.
    - Success Response Schema (Code: `200 OK`): Standard Algolia item response.
      ```json
      {
        "id": "number",
        "created_at": "string",
        "author": "string",
        "text": "string",
        "parent_id": "number",
        "story_id": "number",
        "children": [
          {
            /* nested comment structure */
          }
        ]
      }
      ```
- **Rate Limits:** Generous for public use; daily calls are fine.
- **Link to Official Docs:** [https://hn.algolia.com/api](https://hn.algolia.com/api)

#### 2\. Play.ht API

- **Purpose:** To generate AI-powered podcast versions of the newsletter content.
- **Base URL(s):** Production: `https://api.play.ai/api/v1`
- **Authentication:** API Key (`X-USER-ID` header) and Bearer Token (`Authorization` header). Stored as `PLAYHT_USER_ID` and `PLAYHT_API_KEY`.
- **Key Endpoints Used:**
  - **`POST /playnotes`**
    - Description: Initiates the text-to-speech conversion.
    - Request Headers: `Authorization: Bearer {PLAYHT_API_KEY}`, `X-USER-ID: {PLAYHT_USER_ID}`, `Content-Type: multipart/form-data`, `Accept: application/json`.
    - Request Body Schema: `multipart/form-data`
      - `sourceFile`: `string (binary)` (Preferred: HTML newsletter content as file upload.)
      - `sourceFileUrl`: `string (uri)` (Alternative: URL to hosted newsletter content if `sourceFile` is problematic.)
      - `synthesisStyle`: `string` (Required, e.g., "podcast")
      - `voice1`: `string` (Required, Voice ID)
      - `voice1Name`: `string` (Required)
      - `voice1Gender`: `string` (Required)
      - `webHookUrl`: `string (uri)` (Required, e.g., `<YOUR_APP_DOMAIN>/api/webhooks/playht`)
    - **Note on Content Delivery:** MVP uses `sourceFile`. If issues arise, pivot to `sourceFileUrl` (e.g., content temporarily in Supabase Storage).
    - Success Response Schema (Code: `201 Created`):
      ```json
      {
        "id": "string",
        "ownerId": "string",
        "name": "string",
        "sourceFileUrl": "string",
        "audioUrl": "string",
        "synthesisStyle": "string",
        "voice1": "string",
        "voice1Name": "string",
        "voice1Gender": "string",
        "webHookUrl": "string",
        "status": "string",
        "duration": "number",
        "requestedAt": "string",
        "createdAt": "string"
      }
      ```
- **Webhook Handling:** Endpoint `/api/webhooks/playht` receives `POST` from Play.ht.
  - Request Body Schema (from Play.ht):
    ```json
    { "id": "string", "audioUrl": "string", "status": "string" }
    ```
- **Rate Limits:** Refer to official Play.ht documentation.
- **Link to Official Docs:** [https://docs.play.ai/api-reference/playnote/post](https://docs.play.ai/api-reference/playnote/post)

#### 3\. LLM Provider (Facade for Summarization)

- **Purpose:** To generate summaries for articles and comment threads.
- **Configuration:** Via environment variables (`LLM_PROVIDER_TYPE`, `OLLAMA_API_URL`, `REMOTE_LLM_API_KEY`, `REMOTE_LLM_API_URL`, `LLM_MODEL_NAME`).
- **Facade Interface (`LLMFacade` in `supabase/functions/_shared/llm-facade.ts`):**

  ```typescript
  // Located in supabase/functions/_shared/llm-facade.ts
  export interface LLMSummarizationOptions {
    prompt?: string;
    maxLength?: number;
  }

  export interface LLMFacade {
    generateSummary(
      textToSummarize: string,
      options?: LLMSummarizationOptions
    ): Promise<string>;
  }
  ```

- **Implementations:**
  - **Local Ollama Adapter:** HTTP requests to `OLLAMA_API_URL`.
    - Request Body (example for `/api/generate`): `{"model": "string", "prompt": "string", "stream": false}`
    - Response Body (example): `{"model": "string", "response": "string", ...}`
  - **Remote LLM API Adapter:** Authenticated HTTP requests to `REMOTE_LLM_API_URL`. Schemas depend on the provider.
- **Rate Limits:** Provider-dependent.
- **Link to Official Docs:** Ollama: [https://github.com/ollama/ollama/blob/main/docs/api.md](https://www.google.com/search?q=https://github.com/ollama/ollama/blob/main/docs/api.md)

#### 4\. Nodemailer (Email Delivery Service)

- **Purpose:** To send generated HTML newsletters.
- **Interaction Type:** Library integration within `NewsletterGenerationService` via `NodemailerFacade` in `supabase/functions/_shared/nodemailer-facade.ts`.
- **Configuration:** Via SMTP environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
- **Key Operations:** Create transporter, construct email message (From, To, Subject, HTML), send email.
- **Link to Official Docs:** [https://nodemailer.com/](https://nodemailer.com/)

### Internal APIs Provided (by BMad DiCaster)

#### 1\. Workflow Trigger API

- **Purpose:** To manually initiate the daily content processing pipeline.
- **Endpoint Path:** `/api/system/trigger-workflow` (Next.js API Route Handler)
- **Method:** `POST`
- **Authentication:** API Key in `X-API-KEY` header (matches `WORKFLOW_TRIGGER_API_KEY` env var).
- **Request Body:** MVP: Empty or `{}`.
- **Success Response (`202 Accepted`):** `{"message": "Daily workflow triggered successfully. Processing will occur asynchronously.", "jobId": "<UUID_of_the_workflow_run>"}`
- **Error Response:** `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`.
- **Action:** Creates a record in `workflow_runs` table and initiates the pipeline.

#### 2\. Workflow Status API

- **Purpose:** Allow developers/admins to check the status of a specific workflow run.
- **Endpoint Path:** `/api/system/workflow-status/{jobId}` (Next.js API Route Handler)
- **Method:** `GET`
- **Authentication:** API Key in `X-API-KEY` header.
- **Request Parameters:** `jobId` (Path parameter).
- **Success Response (`200 OK`):**
  ```json
  {
    "jobId": "<UUID>",
    "createdAt": "timestamp",
    "lastUpdatedAt": "timestamp",
    "status": "string",
    "currentStep": "string",
    "errorMessage": "string?",
    "details": {
      /* JSONB object with step-specific progress */
    }
  }
  ```
- **Error Response:** `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`.
- **Action:** Retrieves record from `workflow_runs` for the given `jobId`.

#### 3\. Play.ht Webhook Receiver

- **Purpose:** To receive status updates and podcast audio URLs from Play.ht.
- **Endpoint Path:** `/api/webhooks/playht` (Next.js API Route Handler)
- **Method:** `POST`
- **Authentication:** Implement verification (e.g., shared secret token).
- **Request Body Schema (Expected from Play.ht):**
  ```json
  { "id": "string", "audioUrl": "string", "status": "string" }
  ```
- **Success Response (`200 OK`):** `{"message": "Webhook received successfully"}`
- **Action:** Updates `newsletters` and `workflow_runs` tables.
