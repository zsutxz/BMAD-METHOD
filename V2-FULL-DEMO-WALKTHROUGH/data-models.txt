# BMad Hacker Daily Digest Data Models

This document defines the core data structures used within the application, the format of persisted data files, and relevant API payload schemas. These types would typically reside in `src/types/`.

## 1. Core Application Entities / Domain Objects (In-Memory)

These TypeScript interfaces represent the main data objects manipulated during the pipeline execution.

### `Comment`

- **Description:** Represents a single Hacker News comment fetched from the Algolia API.
- **Schema / Interface Definition (`src/types/hn.ts`):**
  ```typescript
  export interface Comment {
    commentId: string; // Unique identifier (from Algolia objectID)
    commentText: string | null; // Text content of the comment (nullable from API)
    author: string | null; // Author's HN username (nullable from API)
    createdAt: string; // ISO 8601 timestamp string of comment creation
  }
  ```

### `Story`

- **Description:** Represents a Hacker News story, initially fetched from Algolia and progressively augmented with comments, scraped content, and summaries during pipeline execution.
- **Schema / Interface Definition (`src/types/hn.ts`):**

  ```typescript
  import { Comment } from "./hn";

  export interface Story {
    storyId: string; // Unique identifier (from Algolia objectID)
    title: string; // Story title
    articleUrl: string | null; // URL of the linked article (can be null from API)
    hnUrl: string; // URL to the HN discussion page (constructed)
    points?: number; // HN points (optional)
    numComments?: number; // Number of comments reported by API (optional)

    // Data added during pipeline execution
    comments: Comment[]; // Fetched comments [Added in Epic 2]
    articleContent: string | null; // Scraped article text [Added in Epic 3]
    articleSummary: string | null; // Generated article summary [Added in Epic 4]
    discussionSummary: string | null; // Generated discussion summary [Added in Epic 4]
    fetchedAt: string; // ISO 8601 timestamp when story/comments were fetched [Added in Epic 2]
    summarizedAt?: string; // ISO 8601 timestamp when summaries were generated [Added in Epic 4]
  }
  ```

### `DigestData`

- **Description:** Represents the consolidated data needed for a single story when assembling the final email digest. Created by reading persisted files.
- **Schema / Interface Definition (`src/types/email.ts`):**
  ```typescript
  export interface DigestData {
    storyId: string;
    title: string;
    hnUrl: string;
    articleUrl: string | null;
    articleSummary: string | null;
    discussionSummary: string | null;
  }
  ```

## 2. API Payload Schemas

These describe the relevant parts of request/response payloads for external APIs.

### Algolia HN API - Story Response Subset

- **Description:** Relevant fields extracted from the Algolia HN Search API response for front-page stories.
- **Schema (Conceptual JSON):**
  ```json
  {
    "hits": [
      {
        "objectID": "string", // Used as storyId
        "title": "string",
        "url": "string | null", // Used as articleUrl
        "points": "number",
        "num_comments": "number"
        // ... other fields ignored
      }
      // ... more hits (stories)
    ]
    // ... other top-level fields ignored
  }
  ```

### Algolia HN API - Comment Response Subset

- **Description:** Relevant fields extracted from the Algolia HN Search API response for comments associated with a story.
- **Schema (Conceptual JSON):**
  ```json
  {
    "hits": [
      {
        "objectID": "string", // Used as commentId
        "comment_text": "string | null",
        "author": "string | null",
        "created_at": "string" // ISO 8601 format
        // ... other fields ignored
      }
      // ... more hits (comments)
    ]
    // ... other top-level fields ignored
  }
  ```

### Ollama `/api/generate` Request

- **Description:** Payload sent to the local Ollama instance to generate a summary.
- **Schema (`src/types/ollama.ts` or inline):**
  ```typescript
  export interface OllamaGenerateRequest {
    model: string; // e.g., "llama3" (from config)
    prompt: string; // The full prompt including context
    stream: false; // Required to be false for single response
    // system?: string; // Optional system prompt (if used)
    // options?: Record<string, any>; // Optional generation parameters
  }
  ```

### Ollama `/api/generate` Response

- **Description:** Relevant fields expected from the Ollama API response when `stream: false`.
- **Schema (`src/types/ollama.ts` or inline):**
  ```typescript
  export interface OllamaGenerateResponse {
    model: string;
    created_at: string; // ISO 8601 timestamp
    response: string; // The generated summary text
    done: boolean; // Should be true if stream=false and generation succeeded
    // Optional fields detailing context, timings, etc. are ignored for MVP
    // total_duration?: number;
    // load_duration?: number;
    // prompt_eval_count?: number;
    // prompt_eval_duration?: number;
    // eval_count?: number;
    // eval_duration?: number;
  }
  ```
  _(Note: Error responses might have a different structure, e.g., `{ "error": "message" }`)_

## 3. Database Schemas

- **N/A:** This application does not use a database for MVP; data is persisted to the local filesystem.

## 4. State File Schemas (Local Filesystem Persistence)

These describe the format of files saved in the `output/YYYY-MM-DD/` directory.

### `{storyId}_data.json`

- **Purpose:** Stores fetched story metadata and associated comments.
- **Format:** JSON
- **Schema Definition (Matches `Story` type fields relevant at time of saving):**
  ```json
  {
    "storyId": "string",
    "title": "string",
    "articleUrl": "string | null",
    "hnUrl": "string",
    "points": "number | undefined",
    "numComments": "number | undefined",
    "fetchedAt": "string", // ISO 8601 timestamp
    "comments": [
      // Array of Comment objects
      {
        "commentId": "string",
        "commentText": "string | null",
        "author": "string | null",
        "createdAt": "string" // ISO 8601 timestamp
      }
      // ... more comments
    ]
  }
  ```

### `{storyId}_article.txt`

- **Purpose:** Stores the successfully scraped plain text content of the linked article.
- **Format:** Plain Text (`.txt`)
- **Schema Definition:** N/A (Content is the raw extracted string). File only exists if scraping was successful.

### `{storyId}_summary.json`

- **Purpose:** Stores the generated article and discussion summaries.
- **Format:** JSON
- **Schema Definition:**
  ```json
  {
    "storyId": "string",
    "articleSummary": "string | null", // Null if scraping failed or summarization failed
    "discussionSummary": "string | null", // Null if no comments or summarization failed
    "summarizedAt": "string" // ISO 8601 timestamp
  }
  ```

## Change Log

| Change        | Date       | Version | Description                  | Author      |
| ------------- | ---------- | ------- | ---------------------------- | ----------- |
| Initial draft | 2025-05-04 | 0.1     | Initial draft based on Epics | 3-Architect |
