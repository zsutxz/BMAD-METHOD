# Data Models

> This document is a granulated shard from the main "3-architecture.md" focusing on "Data Models".

This section defines the core data structures used within the BMad DiCaster application, including conceptual domain entities and their corresponding database schemas in Supabase PostgreSQL.

### Core Application Entities / Domain Objects

(Conceptual types, typically defined in `shared/types/domain-models.ts`)

#### 1\. `WorkflowRun`

- **Description:** A single execution of the daily workflow.
- **Schema:** `id (string UUID)`, `createdAt (string ISO)`, `lastUpdatedAt (string ISO)`, `status (enum string: 'pending' | 'fetching_hn' | 'scraping_articles' | 'summarizing_content' | 'generating_podcast' | 'generating_newsletter' | 'delivering_newsletter' | 'completed' | 'failed')`, `currentStepDetails (string?)`, `errorMessage (string?)`, `details (object?: { postsFetched?: number, articlesAttempted?: number, articlesScrapedSuccessfully?: number, summariesGenerated?: number, podcastJobId?: string, podcastStatus?: string, newsletterGeneratedAt?: string, subscribersNotified?: number })`

#### 2\. `HNPost`

- **Description:** A post from Hacker News.
- **Schema:** `id (string HN_objectID)`, `hnNumericId (number?)`, `title (string)`, `url (string?)`, `author (string)`, `points (number)`, `createdAt (string ISO)`, `retrievedAt (string ISO)`, `hnStoryText (string?)`, `numComments (number?)`, `tags (string[]?)`, `workflowRunId (string UUID?)`

#### 3\. `HNComment`

- **Description:** A comment on an HN post.
- **Schema:** `id (string HN_commentID)`, `hnPostId (string)`, `parentId (string?)`, `author (string?)`, `text (string HTML)`, `createdAt (string ISO)`, `retrievedAt (string ISO)`, `children (HNComment[]?)`

#### 4\. `ScrapedArticle`

- **Description:** Content scraped from an article URL.
- **Schema:** `id (string UUID)`, `hnPostId (string)`, `originalUrl (string)`, `resolvedUrl (string?)`, `title (string?)`, `author (string?)`, `publicationDate (string ISO?)`, `mainTextContent (string?)`, `scrapedAt (string ISO)`, `scrapingStatus (enum string: 'pending' | 'success' | 'failed_unreachable' | 'failed_paywall' | 'failed_parsing')`, `errorMessage (string?)`, `workflowRunId (string UUID?)`

#### 5\. `ArticleSummary`

- **Description:** AI-generated summary of a `ScrapedArticle`.
- **Schema:** `id (string UUID)`, `scrapedArticleId (string UUID)`, `summaryText (string)`, `generatedAt (string ISO)`, `llmPromptVersion (string?)`, `llmModelUsed (string?)`, `workflowRunId (string UUID)`

#### 6\. `CommentSummary`

- **Description:** AI-generated summary of comments for an `HNPost`.
- **Schema:** `id (string UUID)`, `hnPostId (string)`, `summaryText (string)`, `generatedAt (string ISO)`, `llmPromptVersion (string?)`, `llmModelUsed (string?)`, `workflowRunId (string UUID)`

#### 7\. `Newsletter`

- **Description:** The daily generated newsletter.
- **Schema:** `id (string UUID)`, `workflowRunId (string UUID)`, `targetDate (string YYYY-MM-DD)`, `title (string)`, `generatedAt (string ISO)`, `htmlContent (string)`, `mjmlTemplateVersion (string?)`, `podcastPlayhtJobId (string?)`, `podcastUrl (string?)`, `podcastStatus (enum string?: 'pending' | 'generating' | 'completed' | 'failed')`, `deliveryStatus (enum string: 'pending' | 'sending' | 'sent' | 'partially_failed' | 'failed')`, `scheduledSendAt (string ISO?)`, `sentAt (string ISO?)`

#### 8\. `Subscriber`

- **Description:** An email subscriber.
- **Schema:** `id (string UUID)`, `email (string)`, `subscribedAt (string ISO)`, `isActive (boolean)`, `unsubscribedAt (string ISO?)`

#### 9\. `SummarizationPrompt`

- **Description:** Stores prompts for AI summarization.
- **Schema:** `id (string UUID)`, `promptName (string)`, `promptText (string)`, `version (string)`, `createdAt (string ISO)`, `updatedAt (string ISO)`, `isDefaultArticlePrompt (boolean)`, `isDefaultCommentPrompt (boolean)`

#### 10\. `NewsletterTemplate`

- **Description:** HTML/MJML templates for newsletters.
- **Schema:** `id (string UUID)`, `templateName (string)`, `mjmlContent (string?)`, `htmlContent (string)`, `version (string)`, `createdAt (string ISO)`, `updatedAt (string ISO)`, `isDefault (boolean)`

### Database Schemas (Supabase PostgreSQL)

#### 1\. `workflow_runs`

```sql
CREATE TABLE public.workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending', -- pending, fetching_hn, scraping_articles, summarizing_content, generating_podcast, generating_newsletter, delivering_newsletter, completed, failed
    current_step_details TEXT NULL,
    error_message TEXT NULL,
    details JSONB NULL -- {postsFetched, articlesAttempted, articlesScrapedSuccessfully, summariesGenerated, podcastJobId, podcastStatus, newsletterGeneratedAt, subscribersNotified}
);
COMMENT ON COLUMN public.workflow_runs.status IS 'Possible values: pending, fetching_hn, scraping_articles, summarizing_content, generating_podcast, generating_newsletter, delivering_newsletter, completed, failed';
COMMENT ON COLUMN public.workflow_runs.details IS 'Stores step-specific progress or metadata like postsFetched, articlesScraped, podcastJobId, etc.';
```

#### 2\. `hn_posts`

```sql
CREATE TABLE public.hn_posts (
    id TEXT PRIMARY KEY, -- HN's objectID
    hn_numeric_id BIGINT NULL UNIQUE,
    title TEXT NOT NULL,
    url TEXT NULL,
    author TEXT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL, -- HN post creation time
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    hn_story_text TEXT NULL,
    num_comments INTEGER NULL DEFAULT 0,
    tags TEXT[] NULL,
    workflow_run_id UUID NULL REFERENCES public.workflow_runs(id) ON DELETE SET NULL -- The run that fetched this instance of the post
);
COMMENT ON COLUMN public.hn_posts.id IS 'Hacker News objectID for the story.';
```

#### 3\. `hn_comments`

```sql
CREATE TABLE public.hn_comments (
    id TEXT PRIMARY KEY, -- HN's comment ID
    hn_post_id TEXT NOT NULL REFERENCES public.hn_posts(id) ON DELETE CASCADE,
    parent_comment_id TEXT NULL REFERENCES public.hn_comments(id) ON DELETE CASCADE,
    author TEXT NULL,
    comment_text TEXT NOT NULL, -- HTML content of the comment
    created_at TIMESTAMPTZ NOT NULL, -- HN comment creation time
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_hn_comments_post_id ON public.hn_comments(hn_post_id);
```

#### 4\. `scraped_articles`

```sql
CREATE TABLE public.scraped_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hn_post_id TEXT NOT NULL REFERENCES public.hn_posts(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    resolved_url TEXT NULL,
    title TEXT NULL,
    author TEXT NULL,
    publication_date TIMESTAMPTZ NULL,
    main_text_content TEXT NULL,
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    scraping_status TEXT NOT NULL DEFAULT 'pending', -- pending, success, failed_unreachable, failed_paywall, failed_parsing
    error_message TEXT NULL,
    workflow_run_id UUID NULL REFERENCES public.workflow_runs(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX idx_scraped_articles_hn_post_id_workflow_run_id ON public.scraped_articles(hn_post_id, workflow_run_id);
COMMENT ON COLUMN public.scraped_articles.scraping_status IS 'Possible values: pending, success, failed_unreachable, failed_paywall, failed_parsing, failed_generic';
```

#### 5\. `article_summaries`

```sql
CREATE TABLE public.article_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scraped_article_id UUID NOT NULL REFERENCES public.scraped_articles(id) ON DELETE CASCADE,
    summary_text TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    llm_prompt_version TEXT NULL,
    llm_model_used TEXT NULL,
    workflow_run_id UUID NOT NULL REFERENCES public.workflow_runs(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_article_summaries_scraped_article_id_workflow_run_id ON public.article_summaries(scraped_article_id, workflow_run_id);
COMMENT ON COLUMN public.article_summaries.llm_prompt_version IS 'Version or identifier of the summarization prompt used.';
```

#### 6\. `comment_summaries`

```sql
CREATE TABLE public.comment_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hn_post_id TEXT NOT NULL REFERENCES public.hn_posts(id) ON DELETE CASCADE,
    summary_text TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    llm_prompt_version TEXT NULL,
    llm_model_used TEXT NULL,
    workflow_run_id UUID NOT NULL REFERENCES public.workflow_runs(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_comment_summaries_hn_post_id_workflow_run_id ON public.comment_summaries(hn_post_id, workflow_run_id);
```

#### 7\. `newsletters`

```sql
CREATE TABLE public.newsletters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_run_id UUID NOT NULL UNIQUE REFERENCES public.workflow_runs(id) ON DELETE CASCADE,
    target_date DATE NOT NULL UNIQUE,
    title TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    html_content TEXT NOT NULL,
    mjml_template_version TEXT NULL,
    podcast_playht_job_id TEXT NULL,
    podcast_url TEXT NULL,
    podcast_status TEXT NULL DEFAULT 'pending', -- pending, generating, completed, failed
    delivery_status TEXT NOT NULL DEFAULT 'pending', -- pending, sending, sent, failed, partially_failed
    scheduled_send_at TIMESTAMPTZ NULL,
    sent_at TIMESTAMPTZ NULL
);
CREATE INDEX idx_newsletters_target_date ON public.newsletters(target_date);
COMMENT ON COLUMN public.newsletters.target_date IS 'The date this newsletter pertains to. Ensures uniqueness.';
```

#### 8\. `subscribers`

```sql
CREATE TABLE public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    unsubscribed_at TIMESTAMPTZ NULL
);
CREATE INDEX idx_subscribers_email_active ON public.subscribers(email, is_active);
```

#### 9\. `summarization_prompts`

```sql
CREATE TABLE public.summarization_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_name TEXT NOT NULL UNIQUE,
    prompt_text TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_default_article_prompt BOOLEAN NOT NULL DEFAULT FALSE,
    is_default_comment_prompt BOOLEAN NOT NULL DEFAULT FALSE
);
COMMENT ON COLUMN public.summarization_prompts.prompt_name IS 'Unique identifier for the prompt, e.g., article_summary_v2.1';
-- Application logic will enforce that only one prompt of each type is marked as default.
```

#### 10\. `newsletter_templates`

```sql
CREATE TABLE public.newsletter_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT NOT NULL UNIQUE,
    mjml_content TEXT NULL,
    html_content TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_default BOOLEAN NOT NULL DEFAULT FALSE
);
-- Application logic will enforce that only one template is marked as default.
```
