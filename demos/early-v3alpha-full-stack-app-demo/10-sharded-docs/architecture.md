# BMad DiCaster Architecture Document

## Introduction / Preamble

This document outlines the overall project architecture for BMad DiCaster, including backend systems, shared services, and non-UI specific concerns. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development, ensuring consistency and adherence to chosen patterns and technologies.

**Relationship to Frontend Architecture:**
This project includes a significant user interface. A separate Frontend Architecture Document (expected to be named `frontend-architecture.md` and linked in "Key Reference Documents" once created) will detail the frontend-specific design and MUST be used in conjunction with this document. Core technology stack choices documented herein (see "Definitive Tech Stack Selections") are definitive for the entire project, including any frontend components.

## Table of Contents

- [Introduction / Preamble](#introduction--preamble)
- [Technical Summary](#technical-summary)
- [High-Level Overview](#high-level-overview)
- [Component View](#component-view)
  - [Architectural / Design Patterns Adopted](#architectural--design-patterns-adopted)
- [Workflow Orchestration and Status Management](#workflow-orchestration-and-status-management)
- [Project Structure](#project-structure)
  - [Key Directory Descriptions](#key-directory-descriptions)
  - [Monorepo Management](#monorepo-management)
  - [Notes](#notes)
- [API Reference](#api-reference)
  - [External APIs Consumed](#external-apis-consumed)
    - [1. Hacker News (HN) Algolia API](#1-hacker-news-hn-algolia-api)
    - [2. Play.ht API](#2-playht-api)
    - [3. LLM Provider (Facade for Summarization)](#3-llm-provider-facade-for-summarization)
    - [4. Nodemailer (Email Delivery Service)](#4-nodemailer-email-delivery-service)
  - [Internal APIs Provided (by BMad DiCaster)](#internal-apis-provided-by-bmad-dicaster)
    - [1. Workflow Trigger API](#1-workflow-trigger-api)
    - [2. Workflow Status API](#2-workflow-status-api)
    - [3. Play.ht Webhook Receiver](#3-playht-webhook-receiver)
- [Data Models](#data-models)
  - [Core Application Entities / Domain Objects](#core-application-entities--domain-objects)
    - [1. `WorkflowRun`](#1-workflowrun)
    - [2. `HNPost`](#2-hnpost)
    - [3. `HNComment`](#3-hncomment)
    - [4. `ScrapedArticle`](#4-scrapedarticle)
    - [5. `ArticleSummary`](#5-articlesummary)
    - [6. `CommentSummary`](#6-commentsummary)
    - [7. `Newsletter`](#7-newsletter)
    - [8. `Subscriber`](#8-subscriber)
    - [9. `SummarizationPrompt`](#9-summarizationprompt)
    - [10. `NewsletterTemplate`](#10-newslettertemplate)
  - [Database Schemas (Supabase PostgreSQL)](#database-schemas-supabase-postgresql)
    - [1. `workflow_runs`](#1-workflow_runs)
    - [2. `hn_posts`](#2-hn_posts)
    - [3. `hn_comments`](#3-hn_comments)
    - [4. `scraped_articles`](#4-scraped_articles)
    - [5. `article_summaries`](#5-article_summaries)
    - [6. `comment_summaries`](#6-comment_summaries)
    - [7. `newsletters`](#7-newsletters)
    - [8. `subscribers`](#8-subscribers)
    - [9. `summarization_prompts`](#9-summarization_prompts)
    - [10. `newsletter_templates`](#10-newsletter_templates)
- [Core Workflow / Sequence Diagrams](#core-workflow--sequence-diagrams)
  - [1. Daily Workflow Initiation & HN Content Acquisition](#1-daily-workflow-initiation--hn-content-acquisition)
  - [2. Article Scraping & Summarization Flow](#2-article-scraping--summarization-flow)
  - [3. Newsletter, Podcast, and Delivery Flow](#3-newsletter-podcast-and-delivery-flow)
- [Definitive Tech Stack Selections](#definitive-tech-stack-selections)
- [Infrastructure and Deployment Overview](#infrastructure-and-deployment-overview)
- [Error Handling Strategy](#error-handling-strategy)
- [Coding Standards](#coding-standards)
  - [Detailed Language & Framework Conventions](#detailed-language--framework-conventions)
    - [TypeScript/Node.js (Next.js & Supabase Functions) Specifics](#typescriptnodejs-nextjs--supabase-functions-specifics)
- [Overall Testing Strategy](#overall-testing-strategy)
- [Security Best Practices](#security-best-practices)
- [Key Reference Documents](#key-reference-documents)
- [Change Log](#change-log)
- [Prompt for Design Architect: Frontend Architecture Definition](#prompt-for-design-architect-frontend-architecture-definition)

## Technical Summary

BMad DiCaster is a web application designed to provide daily, concise summaries of top Hacker News (HN) posts, delivered as an HTML newsletter and an optional AI-generated podcast, accessible via a Next.js web interface. The system employs a serverless, event-driven architecture hosted on Vercel, with Supabase providing PostgreSQL database services and function hosting. Key components include services for HN content retrieval, article scraping (using Cheerio), AI-powered summarization (via a configurable LLM facade for Ollama/remote APIs), podcast generation (Play.ht), newsletter generation (Nodemailer), and workflow orchestration. The architecture emphasizes modularity, clear separation of concerns (pragmatic hexagonal approach for complex functions), and robust error handling, aiming for efficient development, particularly by AI developer agents.

## High-Level Overview

The BMad DiCaster application will adopt a **serverless, event-driven architecture** hosted entirely on Vercel, with Supabase providing backend services (database and functions). The project will be structured as a **monorepo**, containing both the Next.js frontend application and the backend Supabase functions.

The core data processing flow is designed as an event-driven pipeline:

1.  A scheduled mechanism (Vercel Cron Job) or manual trigger (API/CLI) initiates the daily workflow, creating a `workflow_run` job.
2.  Hacker News posts and comments are retrieved (HN Algolia API) and stored in Supabase.
3.  This data insertion triggers a Supabase function (via database webhook) to scrape linked articles.
4.  Successful article scraping and storage trigger further Supabase functions for AI-powered summarization of articles and comments.
5.  The completion of summarization steps for a workflow run is tracked, and once all prerequisites are met, a newsletter generation service is triggered.
6.  The newsletter content is sent to the Play.ht API to generate a podcast.
7.  Play.ht calls a webhook to notify our system when the podcast is ready, providing the podcast URL.
8.  The newsletter data in Supabase is updated with the podcast URL.
9.  The newsletter is then delivered to subscribers via Nodemailer, after considering podcast availability (with delay/retry logic).
10. The Next.js frontend allows users to view current and past newsletters and listen to the podcasts.

This event-driven approach, using Supabase Database Webhooks (via `pg_net` or native functionality) to trigger Vercel-hosted Supabase Functions, aims to create a resilient and scalable system. It mitigates potential timeout issues by breaking down long-running processes into smaller, asynchronously triggered units.

Below is a system context diagram illustrating the primary services and user interactions:

```mermaid
graph TD
    User[Developer/Admin] -- "Triggers Daily Workflow (API/CLI/Cron)" --> BMadDiCasterBE[BMad DiCaster Backend Logic]
    UserWeb[End User] -- "Accesses Web Interface" --> BMadDiCasterFE[BMad DiCaster Frontend (Next.js on Vercel)]
    BMadDiCasterFE -- "Displays Data From" --> SupabaseDB[Supabase PostgreSQL]
    BMadDiCasterFE -- "Interacts With for Data/Triggers" --> SupabaseFunctions[Supabase Functions on Vercel]

    subgraph "BMad DiCaster Backend Logic (Supabase Functions & Vercel)"
        direction LR
        SupabaseFunctions
        HNAPI[Hacker News Algolia API]
        ArticleScraper[Article Scraper Service]
        Summarizer[Summarization Service (LLM Facade)]
        PlayHTAPI[Play.ht API]
        NewsletterService[Newsletter Generation & Delivery Service]
        Nodemailer[Nodemailer Service]
    end

    BMadDiCasterBE --> SupabaseDB
    SupabaseFunctions -- "Fetches HN Data" --> HNAPI
    SupabaseFunctions -- "Scrapes Articles" --> ArticleScraper
    ArticleScraper -- "Gets URLs from" --> SupabaseDB
    ArticleScraper -- "Stores Content" --> SupabaseDB
    SupabaseFunctions -- "Summarizes Content" --> Summarizer
    Summarizer -- "Uses Prompts from / Stores Summaries" --> SupabaseDB
    SupabaseFunctions -- "Generates Podcast" --> PlayHTAPI
    PlayHTAPI -- "Sends Webhook (Podcast URL)" --> SupabaseFunctions
    SupabaseFunctions -- "Updates Podcast URL" --> SupabaseDB
    SupabaseFunctions -- "Generates Newsletter" --> NewsletterService
    NewsletterService -- "Uses Template/Data from" --> SupabaseDB
    NewsletterService -- "Sends Emails Via" --> Nodemailer
    SupabaseDB -- "Stores Subscriber List" --> NewsletterService

    classDef user fill:#9cf,stroke:#333,stroke-width:2px;
    classDef fe fill:#f9f,stroke:#333,stroke-width:2px;
    classDef be fill:#ccf,stroke:#333,stroke-width:2px;
    classDef external fill:#ffc,stroke:#333,stroke-width:2px;
    classDef db fill:#cfc,stroke:#333,stroke-width:2px;

    class User,UserWeb user;
    class BMadDiCasterFE fe;
    class BMadDiCasterBE,SupabaseFunctions,ArticleScraper,Summarizer,NewsletterService be;
    class HNAPI,PlayHTAPI,Nodemailer external;
    class SupabaseDB db;
```

## Component View

> This section has been moved to a dedicated document: [Component View](./component-view.md)

## Workflow Orchestration and Status Management

The BMad DiCaster application employs an event-driven pipeline for its daily content processing. To manage, monitor, and ensure the robust execution of this multi-step workflow, the following orchestration strategy is implemented:

**1. Central Workflow Tracking (`workflow_runs` Table):**

- A dedicated table, `public.workflow_runs` (defined in Data Models), serves as the single source of truth for the state and progress of each initiated daily workflow.
- Each workflow execution is identified by a unique `id` (jobId) in this table.
- Key fields include `status`, `current_step_details`, `error_message`, and a `details` JSONB column to store metadata and progress counters (e.g., `posts_fetched`, `articles_scraped_successfully`, `summaries_generated`, `podcast_playht_job_id`, `podcast_status`).

**2. Workflow Initiation:**

- A workflow is initiated via the `POST /api/system/trigger-workflow` API endpoint (callable manually, by CLI, or by a cron job).
- Upon successful trigger, a new record is created in `workflow_runs` with an initial status (e.g., 'pending' or 'fetching_hn'), and the `jobId` is returned to the caller.
- This initial record creation triggers the first service in the pipeline (`HNContentService`) via a database webhook or an initial direct call from the trigger API logic.

**3. Service Function Responsibilities:**

- Each backend Supabase Function (`HNContentService`, `ArticleScrapingService`, `SummarizationService`, `PodcastGenerationService`, `NewsletterGenerationService`) participating in the workflow **must**:
  - Be aware of the `workflow_run_id` for the job it is processing. This ID should be passed along or retrievable based on the triggering event/data.
  - **Before starting its primary task:** Update the `workflow_runs` table for the current `workflow_run_id` to reflect its `current_step_details` (e.g., "Started scraping article X for workflow Y").
  - **Upon successful completion of its task:**
    - Update any relevant data tables (e.g., `scraped_articles`, `article_summaries`).
    - Update the `workflow_runs.details` JSONB field with relevant output or counters (e.g., increment `articles_scraped_successfully_count`).
  - **Upon failure:** Update the `workflow_runs` table for the `workflow_run_id` to set `status` to 'failed', and populate `error_message` and `current_step_details` with failure information.
  - Utilize the shared `WorkflowTrackerService` (see point 5) for consistent status updates.
- The `PlayHTWebhookHandlerAPI` (Next.js API route) updates the `newsletters` table and then the `workflow_runs.details` with podcast status.

**4. Orchestration and Progression (`CheckWorkflowCompletionService`):**

- A dedicated Supabase Function, `CheckWorkflowCompletionService`, will be scheduled to run periodically (e.g., every 5-10 minutes via Vercel Cron Jobs invoking a dedicated HTTP endpoint for this service, or Supabase's `pg_cron` if preferred for DB-centric scheduling).
- This service orchestrates progression between major stages by:
  - Querying `workflow_runs` for jobs in intermediate statuses.
  - Verifying if all prerequisite tasks for the next stage are complete by:
    - Querying related data tables (e.g., `scraped_articles`, `article_summaries`, `comment_summaries`) based on the `workflow_run_id`.
    - Checking expected counts against actual completed counts (e.g., all articles intended for summarization have an `article_summaries` entry for the current `workflow_run_id`).
    - Checking the status of the podcast generation in the `newsletters` table (linked to `workflow_run_id`) before proceeding to email delivery.
  - If conditions for the next stage are met, it updates the `workflow_runs.status` (e.g., to 'generating_newsletter') and then invokes the appropriate next service (e.g., `NewsletterGenerationService`), passing the `workflow_run_id`.

**5. Shared `WorkflowTrackerService`:**

- A utility service, `WorkflowTrackerService`, will be created in `supabase/functions/_shared/`.
- It will provide standardized methods for all backend functions to interact with the `workflow_runs` table (e.g., `updateWorkflowStep()`, `incrementWorkflowDetailCounter()`, `failWorkflow()`, `completeWorkflowStep()`).
- This promotes consistency in status updates and reduces redundant code.

**6. Podcast Link Before Email Delivery:**

- The `NewsletterGenerationService`, after generating the HTML and initiating podcast creation (via `PodcastGenerationService`), will set the `newsletters.podcast_status` to 'generating'.
- The `CheckWorkflowCompletionService` (or the `NewsletterGenerationService` itself if designed for polling/delay) will monitor the `newsletters.podcast_url` (populated by the `PlayHTWebhookHandlerAPI`) or `newsletters.podcast_status`.
- Email delivery is triggered by `CheckWorkflowCompletionService` once the podcast URL is available, a timeout is reached, or podcast generation fails (as per PRD's delay/retry logic). The final delivery status will be updated in `workflow_runs` and `newsletters`.

## Project Structure

> This section has been moved to a dedicated document: [Project Structure](./project-structure.md)

## API Reference

> This section has been moved to a dedicated document: [API Reference](./api-reference.md)

## Data Models

> This section has been moved to a dedicated document: [Data Models](./data-models.md)

## Core Workflow / Sequence Diagrams

> This section has been moved to a dedicated document: [Core Workflow / Sequence Diagrams](./sequence-diagrams.md)

## Definitive Tech Stack Selections

> This section has been moved to a dedicated document: [Definitive Tech Stack Selections](./tech-stack.md)

## Infrastructure and Deployment Overview

> This section has been moved to a dedicated document: [Infrastructure and Deployment Overview](./infra-deployment.md)

## Error Handling Strategy

> This section is part of the consolidated [Operational Guidelines](./operational-guidelines.md#error-handling-strategy).

## Coding Standards

> This section is part of the consolidated [Operational Guidelines](./operational-guidelines.md#coding-standards).

## Overall Testing Strategy

> This section is part of the consolidated [Operational Guidelines](./operational-guidelines.md#overall-testing-strategy).

## Security Best Practices

> This section is part of the consolidated [Operational Guidelines](./operational-guidelines.md#security-best-practices).

## Key Reference Documents

1.  **Product Requirements Document (PRD):** `docs/prd-incremental-full-agile-mode.txt`
2.  **UI/UX Specification:** `docs/ui-ux-spec.txt`
3.  **Technical Preferences:** `docs/technical-preferences copy.txt`
4.  **Environment Variables Documentation:** [Environment Variables Documentation](./environment-vars.md)
5.  **(Optional) Frontend Architecture Document:** `docs/frontend-architecture.md` (To be created by Design Architect)
6.  **Play.ht API Documentation:** [https://docs.play.ai/api-reference/playnote/post](https://docs.play.ai/api-reference/playnote/post)
7.  **Hacker News Algolia API:** [https://hn.algolia.com/api](https://hn.algolia.com/api)
8.  **Ollama API Documentation:** [https://github.com/ollama/ollama/blob/main/docs/api.md](https://www.google.com/search?q=https://github.com/ollama/ollama/blob/main/docs/api.md)
9.  **Supabase Documentation:** [https://supabase.com/docs](https://supabase.com/docs)
10. **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
11. **Vercel Documentation:** [https://vercel.com/docs](https://vercel.com/docs)
12. **Pino Logging Documentation:** [https://getpino.io/](https://getpino.io/)
13. **Zod Documentation:** [https://zod.dev/](https://zod.dev/)

## Change Log

| Change                                     | Date       | Version | Description                                                                                                                                                                                | Author         |
| :----------------------------------------- | :--------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- |
| Initial Draft based on PRD and discussions | 2025-05-13 | 0.1     | First complete draft covering project overview, components, data models, tech stack, deployment, error handling, coding standards, testing strategy, security, and workflow orchestration. | 3-arch (Agent) |

---

## Prompt for Design Architect: Frontend Architecture Definition

**To the Design Architect (Agent Specializing in Frontend Architecture):**

You are now tasked with defining the detailed **Frontend Architecture** for the BMad DiCaster project. This main Architecture Document and the `docs/ui-ux-spec.txt` are your primary input artifacts. Your goal is to produce a dedicated `frontend-architecture.md` document.

**Key Inputs & Constraints (from this Main Architecture Document & UI/UX Spec):**

1.  **Overall Project Architecture:** Familiarize yourself with the "High-Level Overview," "Component View," "Data Models" (especially any shared types in `shared/types/`), and "API Reference" (particularly internal APIs like `/api/system/trigger-workflow` and `/api/webhooks/playht` that the frontend might indirectly be aware of or need to interact with for admin purposes in the future, though MVP frontend primarily reads newsletter data).
2.  **UI/UX Specification (`docs/ui-ux-spec.txt`):** This document contains user flows, wireframes, core screens (Newsletter List, Newsletter Detail), component inventory (NewsletterCard, PodcastPlayer, DownloadButton, BackButton), branding considerations (synthwave, minimalist), and accessibility aspirations.
3.  **Definitive Technology Stack (Frontend Relevant):**
    - Framework: Next.js (`latest`, App Router)
    - Language: React (`19.0.0`) with TypeScript (`5.7.2`)
    - UI Libraries: Tailwind CSS (`3.4.17`), Shadcn UI (`latest`)
    - State Management: Zustand (`latest`)
    - Testing: React Testing Library (RTL) (`latest`), Jest (`latest`)
    - Starter Template: Vercel/Supabase Next.js App Router template ([https://vercel.com/templates/next.js/supabase](https://vercel.com/templates/next.js/supabase)). Leverage its existing structure for `app/`, `components/ui/` (from Shadcn), `lib/utils.ts`, and `utils/supabase/` (client, server, middleware helpers for Supabase).
4.  **Project Structure (Frontend Relevant):** Refer to the "Project Structure" section in this document, particularly the `app/` directory, `components/` (for Shadcn `ui` and your `core` application components), `lib/`, and `utils/supabase/`.
5.  **Existing Frontend Files (from template):** Be aware of `middleware.ts` (for Supabase auth) and any existing components or utility functions provided by the starter template.

**Tasks for Frontend Architecture Document (`frontend-architecture.md`):**

1.  **Refine Frontend Project Structure:**
    - Detail the specific folder structure within `app/`. Propose organization for pages (routes), layouts, application-specific components (`app/components/core/`), data fetching logic, context providers, and Zustand stores.
    - How will Shadcn UI components (`components/ui/`) be used and potentially customized?
2.  **Component Architecture:**
    - For each core screen identified in the UI/UX spec (Newsletter List, Newsletter Detail), define the primary React component hierarchy.
    - Specify responsibilities and key props for major reusable application components (e.g., `NewsletterCard`, `NewsletterDetailView`, `PodcastPlayerControls`).
    - How will components fetch and display data from Supabase? (e.g., Server Components, Client Components using Supabase client from `utils/supabase/client.ts` or `utils/supabase/server.ts`).
3.  **State Management (Zustand):**
    - Identify global and local state needs.
    - Define specific Zustand store(s): what data they will hold (e.g., current newsletter list, selected newsletter details, podcast player state), and what actions they will expose.
    - How will components interact with these stores?
4.  **Data Fetching & Caching (Frontend):**
    - Specify patterns for fetching newsletter data (lists and individual items) and podcast information.
    - How will Next.js data fetching capabilities (Server Components, Route Handlers, `Workspace` with caching options) be utilized with the Supabase client?
    - Address loading and error states for data fetching in the UI.
5.  **Routing:**
    - Confirm Next.js App Router usage and define URL structure for the newsletter list and detail pages.
6.  **Styling Approach:**
    - Reiterate use of Tailwind CSS and Shadcn UI.
    - Define any project-specific conventions for applying Tailwind classes or extending the theme (beyond what's in `tailwind.config.ts`).
    - How will the "synthwave technical glowing purple vibes" be implemented using Tailwind?
7.  **Error Handling (Frontend):**
    - How will errors from API calls (to Supabase or internal Next.js API routes if any) be handled and displayed to the user?
    - Strategy for UI error boundaries.
8.  **Accessibility (AX):**
    - Elaborate on how the WCAG 2.1 Level A requirements (keyboard navigation, semantic HTML, alt text, color contrast) will be met in component design and implementation, leveraging Next.js and Shadcn UI capabilities.
9.  **Testing (Frontend):**
    - Reiterate the use of Jest and RTL for unit/integration testing of React components.
    - Provide examples or guidelines for writing effective frontend tests.
10. **Key Frontend Libraries & Versioning:** Confirm versions from the main tech stack and list any additional frontend-only libraries required.

Your output should be a clean, well-formatted `frontend-architecture.md` document ready for AI developer agents to use for frontend implementation. Adhere to the output formatting guidelines. You are now operating in **Frontend Architecture Mode**.

---

This concludes the BMad DiCaster Architecture Document.
