# Component View

The system is divided into distinct backend and frontend components.

## Backend Components (`bmad-daily-digest-backend` repository)

1.  **Daily Workflow Orchestrator (AWS Step Functions state machine):** Manages the end-to-end daily pipeline.
2.  **HN Data Fetcher Service (AWS Lambda):** Fetches HN posts/comments (Algolia), identifies repeats (via DynamoDB).
3.  **Article Scraping Service (AWS Lambda):** Scrapes/extracts content from external article URLs, handles fallbacks.
4.  **Content Formatting Service (AWS Lambda):** Aggregates and formats text payload for Play.ai.
5.  **Play.ai Interaction Service (AWS Lambda functions, orchestrated by Polling Step Function):** Submits job to Play.ai, polls for status.
6.  **Podcast Storage Service (AWS Lambda):** Downloads audio from Play.ai, stores to S3.
7.  **Metadata Persistence Service (AWS Lambda & DynamoDB Tables):** Manages episode and HN post processing state metadata in DynamoDB.
8.  **Backend API Service (AWS API Gateway + AWS Lambda functions):** Exposes endpoints for frontend (episode lists/details).

## Frontend Components (`bmad-daily-digest-frontend` repository)

1.  **Next.js Web Application (Static Site on S3/CloudFront):** Renders UI, handles navigation.
2.  **Frontend API Client Service (TypeScript module):** Encapsulates communication with the Backend API Service.

## External Services

- Algolia HN Search API
- Play.ai PlayNote API
- Various External Article Websites

## Component Interaction Diagram (Conceptual Backend Focus)

```mermaid
graph LR
    subgraph Frontend Application Space
        F_App[Next.js App on S3/CloudFront]
        F_APIClient[Frontend API Client]
        F_App --> F_APIClient
    end

    subgraph Backend API Space
        APIGW[API Gateway]
        API_L[Backend API Lambdas]
        APIGW --> API_L
    end

    subgraph Backend Daily Pipeline Space
        Scheduler[EventBridge Scheduler] --> Orchestrator[Step Functions Orchestrator]

        Orchestrator --> HNFetcher[HN Data Fetcher Lambda]
        HNFetcher -->|Reads/Writes Post Status| DDB
        HNFetcher --> Algolia[Algolia HN API]

        Orchestrator --> ArticleScraper[Article Scraper Lambda]
        ArticleScraper --> ExtWebsites[External Article Websites]

        Orchestrator --> ContentFormatter[Content Formatter Lambda]

        Orchestrator --> PlayAISubmit[Play.ai Submit Lambda]
        PlayAISubmit --> PlayAI_API[Play.ai PlayNote API]

        subgraph Polling_SF[Play.ai Polling (Step Functions)]
            direction LR
            PollTask[Poll Status Lambda] --> PlayAI_API
        end
        Orchestrator --> Polling_SF


        Orchestrator --> PodcastStorage[Podcast Storage Lambda]
        PodcastStorage --> PlayAI_API
        PodcastStorage --> S3Store[S3 Audio Storage]

        Orchestrator --> MetadataService[Metadata Persistence Lambda]
        MetadataService --> DDB[DynamoDB Episode/Post Metadata]
    end

    F_APIClient --> APIGW
    API_L --> DDB

    classDef external fill:#ddd,stroke:#333,stroke-width:2px;
    class Algolia,ExtWebsites,PlayAI_API external;
```

## Architectural / Design Patterns Adopted

The following key architectural and design patterns have been chosen for this project:

  * **Serverless Architecture:** Entire backend on AWS Lambda, API Gateway, S3, DynamoDB, Step Functions. Rationale: Minimized operations, auto-scaling, pay-per-use, cost-efficiency.
  * **Event-Driven Architecture:** Daily pipeline initiated by EventBridge Scheduler; Step Functions orchestrate based on state changes. Rationale: Decoupled components, reactive system for automation.
  * **Microservices-like Approach (Backend Lambda Functions):** Each Lambda handles a specific, well-defined task. Rationale: Modularity, independent scalability, easier testing/maintenance.
  * **Static Site Generation (SSG) for Frontend:** Next.js frontend exported as static files, hosted on S3/CloudFront. Rationale: Optimal performance, security, scalability, lower hosting costs.
  * **Infrastructure as Code (IaC):** AWS CDK in TypeScript for all AWS infrastructure in both repositories. Rationale: Repeatable, version-controlled, automated provisioning.
  * **Polling Pattern (External Job Status):** AWS Step Functions implement a polling loop for Play.ai job status. Rationale: Reliable tracking of asynchronous third-party jobs, based on Play.ai docs.
  * **Orchestration Pattern (AWS Step Functions):** End-to-end daily backend pipeline managed by a Step Functions state machine. Rationale: Robust workflow automation, state management, error handling for multi-step processes. 