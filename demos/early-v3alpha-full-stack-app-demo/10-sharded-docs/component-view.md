# Component View

> This document is a granulated shard from the main "3-architecture.md" focusing on "Component View".

The BMad DiCaster system is composed of several key logical components, primarily implemented as serverless functions (Supabase Functions deployed on Vercel) and a Next.js frontend application. These components work together in an event-driven manner.

```mermaid
graph TD
    subgraph FrontendApp [Frontend Application (Next.js)]
        direction LR
        WebAppUI["Web Application UI (React Components)"]
        APIServiceFE["API Service (Frontend - Next.js Route Handlers)"]
    end

    subgraph BackendServices [Backend Services (Supabase Functions & Core Logic)]
        direction TB
        WorkflowTriggerAPI["Workflow Trigger API (/api/system/trigger-workflow)"]
        HNContentService["HN Content Service (Supabase Fn)"]
        ArticleScrapingService["Article Scraping Service (Supabase Fn)"]
        SummarizationService["Summarization Service (LLM Facade - Supabase Fn)"]
        PodcastGenerationService["Podcast Generation Service (Supabase Fn)"]
        NewsletterGenerationService["Newsletter Generation Service (Supabase Fn)"]
        PlayHTWebhookHandlerAPI["Play.ht Webhook API (/api/webhooks/playht)"]
        CheckWorkflowCompletionService["CheckWorkflowCompletionService (Supabase Cron Fn)"]
    end

    subgraph ExternalIntegrations [External APIs & Services]
        direction TB
        HNAlgoliaAPI["Hacker News Algolia API"]
        PlayHTAPI["Play.ht API"]
        LLMProvider["LLM Provider (Ollama/Remote API)"]
        NodemailerService["Nodemailer (Email Delivery)"]
    end

    subgraph DataStorage [Data Storage (Supabase PostgreSQL)]
        direction TB
        DB_WorkflowRuns["workflow_runs Table"]
        DB_Posts["hn_posts Table"]
        DB_Comments["hn_comments Table"]
        DB_Articles["scraped_articles Table"]
        DB_Summaries["article_summaries / comment_summaries Tables"]
        DB_Newsletters["newsletters Table"]
        DB_Subscribers["subscribers Table"]
        DB_Prompts["summarization_prompts Table"]
        DB_NewsletterTemplates["newsletter_templates Table"]
    end

    UserWeb[End User] --> WebAppUI
    WebAppUI --> APIServiceFE
    APIServiceFE --> WorkflowTriggerAPI
    APIServiceFE --> DataStorage


    DevAdmin[Developer/Admin/Cron] --> WorkflowTriggerAPI

    WorkflowTriggerAPI --> DB_WorkflowRuns

    DB_WorkflowRuns -- "Triggers (via CheckWorkflowCompletion or direct)" --> HNContentService
    HNContentService --> HNAlgoliaAPI
    HNContentService --> DB_Posts
    HNContentService --> DB_Comments
    HNContentService --> DB_WorkflowRuns


    DB_Posts -- "Triggers (via DB Webhook)" --> ArticleScrapingService
    ArticleScrapingService --> DB_Articles
    ArticleScrapingService --> DB_WorkflowRuns

    DB_Articles -- "Triggers (via DB Webhook)" --> SummarizationService
    SummarizationService --> LLMProvider
    SummarizationService --> DB_Prompts
    SummarizationService --> DB_Summaries
    SummarizationService --> DB_WorkflowRuns

    CheckWorkflowCompletionService -- "Monitors & Triggers Next Steps Based On" --> DB_WorkflowRuns
    CheckWorkflowCompletionService -- "Monitors & Triggers Next Steps Based On" --> DB_Summaries
    CheckWorkflowCompletionService -- "Monitors & Triggers Next Steps Based On" --> DB_Newsletters


    CheckWorkflowCompletionService --> NewsletterGenerationService
    NewsletterGenerationService --> DB_NewsletterTemplates
    NewsletterGenerationService --> DB_Summaries
    NewsletterGenerationService --> DB_Newsletters
    NewsletterGenerationService --> DB_WorkflowRuns


    CheckWorkflowCompletionService --> PodcastGenerationService
    PodcastGenerationService --> PlayHTAPI
    PodcastGenerationService --> DB_Newsletters
    PodcastGenerationService --> DB_WorkflowRuns

    PlayHTAPI -- "Webhook" --> PlayHTWebhookHandlerAPI
    PlayHTWebhookHandlerAPI --> DB_Newsletters
    PlayHTWebhookHandlerAPI --> DB_WorkflowRuns


    CheckWorkflowCompletionService -- "Triggers Delivery" --> NewsletterGenerationService
    NewsletterGenerationService -- "(For Delivery)" --> NodemailerService
    NewsletterGenerationService -- "(For Delivery)" --> DB_Subscribers
    NewsletterGenerationService -- "(For Delivery)" --> DB_Newsletters
    NewsletterGenerationService -- "(For Delivery)" --> DB_WorkflowRuns


    classDef user fill:#9cf,stroke:#333,stroke-width:2px;
    classDef feapp fill:#f9d,stroke:#333,stroke-width:2px;
    classDef beapp fill:#cdf,stroke:#333,stroke-width:2px;
    classDef external fill:#ffc,stroke:#333,stroke-width:2px;
    classDef db fill:#cfc,stroke:#333,stroke-width:2px;

    class UserWeb,DevAdmin user;
    class FrontendApp,WebAppUI,APIServiceFE feapp;
    class BackendServices,WorkflowTriggerAPI,HNContentService,ArticleScrapingService,SummarizationService,PodcastGenerationService,NewsletterGenerationService,PlayHTWebhookHandlerAPI,CheckWorkflowCompletionService beapp;
    class ExternalIntegrations,HNAlgoliaAPI,PlayHTAPI,LLMProvider,NodemailerService external;
    class DataStorage,DB_WorkflowRuns,DB_Posts,DB_Comments,DB_Articles,DB_Summaries,DB_Newsletters,DB_Subscribers,DB_Prompts,DB_NewsletterTemplates db;
```

- **Frontend Application (Next.js on Vercel):**
  - **Web Application UI (React Components):** Renders UI, displays newsletters/podcasts, handles user interactions.
  - **API Service (Frontend - Next.js Route Handlers):** Handles frontend-initiated API calls (e.g., for future admin functions) and receives incoming webhooks (Play.ht).
- **Backend Services (Supabase Functions & Core Logic):**
  - **Workflow Trigger API (`/api/system/trigger-workflow`):** Secure Next.js API route to manually initiate the daily workflow.
  - **HN Content Service (Supabase Fn):** Retrieves posts/comments from HN Algolia API, stores them.
  - **Article Scraping Service (Supabase Fn):** Triggered by new HN posts, scrapes article content.
  - **Summarization Service (LLM Facade - Supabase Fn):** Triggered by new articles/comments, generates summaries using LLM.
  - **Podcast Generation Service (Supabase Fn):** Sends newsletter content to Play.ht API.
  - **Newsletter Generation Service (Supabase Fn):** Compiles newsletter, handles podcast link logic, triggers email delivery.
  - **Play.ht Webhook API (`/api/webhooks/playht`):** Next.js API route to receive podcast status from Play.ht.
  - **CheckWorkflowCompletionService (Supabase Cron Fn):** Periodically monitors `workflow_runs` and related tables to orchestrate the progression between pipeline stages (e.g., from summarization to newsletter generation, then to delivery).
- **Data Storage (Supabase PostgreSQL):** Stores all application data including workflow state, content, summaries, newsletters, subscribers, prompts, and templates.
- **External APIs & Services:** HN Algolia API, Play.ht API, LLM Provider (Ollama/Remote), Nodemailer.

### Architectural / Design Patterns Adopted

- **Event-Driven Architecture:** Core backend processing is a series of steps triggered by database events (Supabase Database Webhooks calling Supabase Functions hosted on Vercel) and orchestrated via the `workflow_runs` table and the `CheckWorkflowCompletionService`.
- **Serverless Functions:** Backend logic is encapsulated in Supabase Functions (running on Vercel).
- **Monorepo:** All code resides in a single repository.
- **Facade Pattern:** Encapsulates interactions with external services (HN API, Play.ht API, LLM, Nodemailer) within `supabase/functions/_shared/`.
- **Factory Pattern (for LLM Service):** The `LLMFacade` will use a factory to instantiate the appropriate LLM client based on environment configuration.
- **Hexagonal Architecture (Pragmatic Application):** For complex Supabase Functions, core business logic will be separated from framework-specific handlers and data interaction code (adapters) to improve testability and maintainability. Simpler functions may have a more direct implementation.
- **Repository Pattern (for Data Access - Conceptual):** Data access logic within services will be organized, conceptually resembling repositories, even if not strictly implemented with separate repository classes for all entities in MVP Supabase Functions.
- **Configuration via Environment Variables:** All sensitive and environment-specific configurations managed via environment variables.
