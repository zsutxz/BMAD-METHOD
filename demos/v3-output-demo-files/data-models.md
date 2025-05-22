# Data Models

## Core Application Entities

**a. Episode**

  * Attributes: `episodeId` (PK, UUID), `publicationDate` (YYYY-MM-DD), `episodeNumber` (Number), `podcastGeneratedTitle` (String), `audioS3Bucket` (String), `audioS3Key` (String), `audioUrl` (String, derived for API), `playAiJobId` (String), `playAiSourceAudioUrl` (String), `sourceHNPosts` (List of `SourceHNPost`), `status` (String: "PROCESSING", "PUBLISHED", "FAILED"), `createdAt` (ISO Timestamp), `updatedAt` (ISO Timestamp).

**b. SourceHNPost (object within `Episode.sourceHNPosts`)**

  * Attributes: `hnPostId` (String), `title` (String), `originalArticleUrl` (String), `hnLink` (String), `isUpdateStatus` (Boolean), `oldRank` (Number, Optional), `lastCommentFetchTimestamp` (Number, Unix Timestamp), `articleScrapingFailed` (Boolean), `articleTitleFromScrape` (String, Optional).

**c. HackerNewsPostProcessState (DynamoDB Table)**

  * Attributes: `hnPostId` (PK, String), `originalArticleUrl` (String), `articleTitleFromScrape` (String, Optional), `lastSuccessfullyScrapedTimestamp` (Number, Optional), `lastCommentFetchTimestamp` (Number, Optional), `firstProcessedDate` (YYYY-MM-DD), `lastProcessedDate` (YYYY-MM-DD), `lastKnownRank` (Number, Optional).

## API Payload Schemas (Internal API)

**a. `EpisodeListItem` (for `GET /episodes`)**

  * `episodeId`, `publicationDate`, `episodeNumber`, `podcastGeneratedTitle`.

**b. `EpisodeDetail` (for `GET /episodes/{episodeId}`)**

  * `episodeId`, `publicationDate`, `episodeNumber`, `podcastGeneratedTitle`, `audioUrl`, `sourceHNPosts` (list of `SourceHNPostDetail` containing `hnPostId`, `title`, `originalArticleUrl`, `hnLink`, `isUpdateStatus`, `oldRank`), `playAiJobId` (optional), `playAiSourceAudioUrl` (optional), `createdAt`.

## Database Schemas (AWS DynamoDB)

**a. `BmadDailyDigestEpisodes` Table**

  * PK: `episodeId` (String).
  * Attributes: As per `Episode` entity.
  * GSI Example (`PublicationDateIndex`): PK: `status`, SK: `publicationDate`.
  * Billing: PAY\_PER\_REQUEST.

**b. `HackerNewsPostProcessState` Table**

  * PK: `hnPostId` (String).
  * Attributes: As per `HackerNewsPostProcessState` entity.
  * Billing: PAY\_PER\_REQUEST. 