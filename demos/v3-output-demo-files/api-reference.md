# API Reference

## External APIs Consumed

**1. Algolia Hacker News Search API**

  * **Base URL:** `http://hn.algolia.com/api/v1/`
  * **Authentication:** None.
  * **Endpoints Used:**
      * `GET /search_by_date?tags=story&hitsPerPage={N}` (For top posts)
      * `GET /items/{POST_ID}` (For comments/post details)
  * **Key Data Extracted:** Post title, article URL, HN link, HN Post ID, author, points, creation timestamp; Comment text, author, creation timestamp.

**2. Play.ai PlayNote API**

  * **Base URL:** `https://api.play.ai/api/v1/`
  * **Authentication:** Headers: `Authorization: Bearer <PLAY_AI_BEARER_TOKEN>`, `X-USER-ID: <PLAY_AI_USER_ID>`.
  * **Endpoints Used:**
      * `POST /playnotes` (Submit job)
          * Request: `application/json` with `sourceText`, `title`, voice params (from env vars: `PLAY_AI_VOICE1_ID`, `PLAY_AI_VOICE1_NAME`, `PLAY_AI_VOICE2_ID`, `PLAY_AI_VOICE2_NAME`), style (`PLAY_AI_STYLE`).
          * Response: JSON with `jobId`.
      * `GET /playnote/{jobId}` (Poll status)
          * Response: JSON with `status`, `audioUrl` (if completed).

## Internal APIs Provided (by backend for frontend)

  * **Base URL Path Prefix:** `/v1` (Full URL from `NEXT_PUBLIC_BACKEND_API_URL`).
  * **Authentication:** Requires "Frontend Read API Key" via `x-api-key` header for GET endpoints. A separate "Admin Action API Key" for trigger endpoint.
  * **Endpoints:**
      * **`GET /status`**: Health/status check. Response: `{"message": "BMad Daily Digest Backend is operational.", "timestamp": "..."}`.
      * **`GET /episodes`**: Lists episodes. Response: `{ "episodes": [EpisodeListItem, ...] }`.
      * **`GET /episodes/{episodeId}`**: Episode details. Response: `EpisodeDetail` object.
      * **`POST /jobs/daily-digest/trigger`**: (Admin Key) Triggers daily pipeline. Response: `{"message": "...", "executionArn": "..."}`.
  * **Common Errors:** 401 Unauthorized, 404 Not Found, 500 Internal Server Error. 