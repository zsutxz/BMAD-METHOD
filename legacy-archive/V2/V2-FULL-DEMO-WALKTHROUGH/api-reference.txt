# BMad Hacker Daily Digest API Reference

This document describes the external APIs consumed by the BMad Hacker Daily Digest application.

## External APIs Consumed

### Algolia Hacker News (HN) Search API

- **Purpose:** Used to fetch the top Hacker News stories and the comments associated with each story.
- **Base URL:** `http://hn.algolia.com/api/v1`
- **Authentication:** None required for public search endpoints.
- **Key Endpoints Used:**

  - **`GET /search` (for Top Stories)**

    - Description: Retrieves stories based on search parameters. Used here to get top stories from the front page.
    - Request Parameters:
      - `tags=front_page`: Required to filter for front-page stories.
      - `hitsPerPage=10`: Specifies the number of stories to retrieve (adjust as needed, default is typically 20).
    - Example Request (Conceptual using native `Workspace`):
      ```typescript
      // Using Node.js native Workspace API
      const url =
        "[http://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10](http://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=10)";
      const response = await fetch(url);
      const data = await response.json();
      ```
    - Success Response Schema (Code: `200 OK`): See "Algolia HN API - Story Response Subset" in `docs/data-models.md`. Primarily interested in the `hits` array containing story objects.
    - Error Response Schema(s): Standard HTTP errors (e.g., 4xx, 5xx). May return JSON with an error message.

  - **`GET /search` (for Comments)**
    - Description: Retrieves comments associated with a specific story ID.
    - Request Parameters:
      - `tags=comment,story_{storyId}`: Required to filter for comments belonging to the specified `storyId`. Replace `{storyId}` with the actual ID (e.g., `story_12345`).
      - `hitsPerPage={maxComments}`: Specifies the maximum number of comments to retrieve (value from `.env` `MAX_COMMENTS_PER_STORY`).
    - Example Request (Conceptual using native `Workspace`):
      ```typescript
      // Using Node.js native Workspace API
      const storyId = "..."; // HN Story ID
      const maxComments = 50; // From config
      const url = `http://hn.algolia.com/api/v1/search?tags=comment,story_${storyId}&hitsPerPage=${maxComments}`;
      const response = await fetch(url);
      const data = await response.json();
      ```
    - Success Response Schema (Code: `200 OK`): See "Algolia HN API - Comment Response Subset" in `docs/data-models.md`. Primarily interested in the `hits` array containing comment objects.
    - Error Response Schema(s): Standard HTTP errors.

- **Rate Limits:** Subject to Algolia's public API rate limits (typically generous for HN search but not explicitly defined/guaranteed). Implementations should handle potential 429 errors gracefully if encountered.
- **Link to Official Docs:** [https://hn.algolia.com/api](https://hn.algolia.com/api)

### Ollama API (Local Instance)

- **Purpose:** Used to generate text summaries for scraped article content and HN comment discussions using a locally running LLM.
- **Base URL:** Configurable via the `OLLAMA_ENDPOINT_URL` environment variable (e.g., `http://localhost:11434`).
- **Authentication:** None typically required for default local installations.
- **Key Endpoints Used:**

  - **`POST /api/generate`**
    - Description: Generates text based on a model and prompt. Used here for summarization.
    - Request Body Schema: See `OllamaGenerateRequest` in `docs/data-models.md`. Requires `model` (from `.env` `OLLAMA_MODEL`), `prompt`, and `stream: false`.
    - Example Request (Conceptual using native `Workspace`):
      ```typescript
      // Using Node.js native Workspace API
      const ollamaUrl =
        process.env.OLLAMA_ENDPOINT_URL || "http://localhost:11434";
      const requestBody: OllamaGenerateRequest = {
        model: process.env.OLLAMA_MODEL || "llama3",
        prompt: "Summarize this text: ...",
        stream: false,
      };
      const response = await fetch(`${ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data: OllamaGenerateResponse | { error: string } =
        await response.json();
      ```
    - Success Response Schema (Code: `200 OK`): See `OllamaGenerateResponse` in `docs/data-models.md`. Key field is `response` containing the generated text.
    - Error Response Schema(s): May return non-200 status codes or a `200 OK` with a JSON body like `{ "error": "error message..." }` (e.g., if the model is unavailable).

- **Rate Limits:** N/A for a typical local instance. Performance depends on local hardware.
- **Link to Official Docs:** [https://github.com/ollama/ollama/blob/main/docs/api.md](https://github.com/ollama/ollama/blob/main/docs/api.md)

## Internal APIs Provided

- **N/A:** The application is a self-contained CLI tool and does not expose any APIs for other services to consume.

## Cloud Service SDK Usage

- **N/A:** The application runs locally and uses the native Node.js `Workspace` API for HTTP requests, not cloud provider SDKs.

## Change Log

| Change        | Date       | Version | Description                     | Author      |
| ------------- | ---------- | ------- | ------------------------------- | ----------- |
| Initial draft | 2025-05-04 | 0.1     | Draft based on PRD/Epics/Models | 3-Architect |
