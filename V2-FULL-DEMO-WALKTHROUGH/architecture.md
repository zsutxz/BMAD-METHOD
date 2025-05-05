# BMad Hacker Daily Digest Architecture Document

## Technical Summary

The BMad Hacker Daily Digest is a command-line interface (CLI) tool designed to provide users with concise summaries of top Hacker News (HN) stories and their associated comment discussions . Built with TypeScript and Node.js (v22) , it operates entirely on the user's local machine . The core functionality involves a sequential pipeline: fetching story and comment data from the Algolia HN Search API , attempting to scrape linked article content , generating summaries using a local Ollama LLM instance , persisting intermediate data to the local filesystem , and finally assembling and emailing an HTML digest using Nodemailer . The architecture emphasizes modularity and testability, including mandatory standalone scripts for testing each pipeline stage . The project starts from the `bmad-boilerplate` template .

## High-Level Overview

The application follows a simple, sequential pipeline architecture executed via a manual CLI command (`npm run dev` or `npm start`) . There is no persistent database; the local filesystem is used to store intermediate data artifacts (fetched data, scraped text, summaries) between steps within a date-stamped directory . All external HTTP communication (Algolia API, article scraping, Ollama API) utilizes the native Node.js `Workspace` API .

```mermaid
graph LR
    subgraph "BMad Hacker Daily Digest (Local CLI)"
        A[index.ts / CLI Trigger] --> B(core/pipeline.ts);
        B --> C{Fetch HN Data};
        B --> D{Scrape Articles};
        B --> E{Summarize Content};
        B --> F{Assemble & Email Digest};
        C --> G["Local FS (_data.json)"];
        D --> H["Local FS (_article.txt)"];
        E --> I["Local FS (_summary.json)"];
        F --> G;
        F --> H;
        F --> I;
    end

    subgraph External Services
        X[Algolia HN API];
        Y[Article Websites];
        Z["Ollama API (Local)"];
        W[SMTP Service];
    end

    C --> X;
    D --> Y;
    E --> Z;
    F --> W;

    style G fill:#eee,stroke:#333,stroke-width:1px
    style H fill:#eee,stroke:#333,stroke-width:1px
    style I fill:#eee,stroke:#333,stroke-width:1px
```

## Component View

The application code (`src/`) is organized into logical modules based on the defined project structure (`docs/project-structure.md`). Key components include:

- **`src/index.ts`**: The main entry point, handling CLI invocation and initiating the pipeline.
- **`src/core/pipeline.ts`**: Orchestrates the sequential execution of the main pipeline stages (fetch, scrape, summarize, email).
- **`src/clients/`**: Modules responsible for interacting with external APIs.
  - `algoliaHNClient.ts`: Communicates with the Algolia HN Search API.
  - `ollamaClient.ts`: Communicates with the local Ollama API.
- **`src/scraper/articleScraper.ts`**: Handles fetching and extracting text content from article URLs.
- **`src/email/`**: Manages digest assembly, HTML rendering, and email dispatch via Nodemailer.
  - `contentAssembler.ts`: Reads persisted data.
  - `templates.ts`: Renders HTML.
  - `emailSender.ts`: Sends the email.
- **`src/stages/`**: Contains standalone scripts (`Workspace_hn_data.ts`, `scrape_articles.ts`, etc.) for testing individual pipeline stages independently using local data where applicable.
- **`src/utils/`**: Shared utilities for configuration loading (`config.ts`), logging (`logger.ts`), and date handling (`dateUtils.ts`).
- **`src/types/`**: Shared TypeScript interfaces and types.

```mermaid
graph TD
    subgraph AppComponents ["Application Components (src/)"]
        Idx(index.ts) --> Pipe(core/pipeline.ts);
        Pipe --> HNClient(clients/algoliaHNClient.ts);
        Pipe --> Scraper(scraper/articleScraper.ts);
        Pipe --> OllamaClient(clients/ollamaClient.ts);
        Pipe --> Assembler(email/contentAssembler.ts);
        Pipe --> Renderer(email/templates.ts);
        Pipe --> Sender(email/emailSender.ts);

        Pipe --> Utils(utils/*);
        Pipe --> Types(types/*);
        HNClient --> Types;
        OllamaClient --> Types;
        Assembler --> Types;
        Renderer --> Types;

        subgraph StageRunnersSubgraph ["Stage Runners (src/stages/)"]
            SFetch(fetch_hn_data.ts) --> HNClient;
            SFetch --> Utils;
            SScrape(scrape_articles.ts) --> Scraper;
            SScrape --> Utils;
            SSummarize(summarize_content.ts) --> OllamaClient;
            SSummarize --> Utils;
            SEmail(send_digest.ts) --> Assembler;
            SEmail --> Renderer;
            SEmail --> Sender;
            SEmail --> Utils;
        end
    end

    subgraph Externals ["Filesystem & External"]
        FS["Local Filesystem (output/)"]
        Algolia((Algolia HN API))
        Websites((Article Websites))
        Ollama["Ollama API (Local)"]
        SMTP((SMTP Service))
    end

    HNClient --> Algolia;
    Scraper --> Websites;
    OllamaClient --> Ollama;
    Sender --> SMTP;

    Pipe --> FS;
    Assembler --> FS;

    SFetch --> FS;
    SScrape --> FS;
    SSummarize --> FS;
    SEmail --> FS;

    %% Apply style to the subgraph using its ID after the block
    style StageRunnersSubgraph fill:#f9f,stroke:#333,stroke-width:1px
```

## Key Architectural Decisions & Patterns

- **Architecture Style:** Simple Sequential Pipeline executed via CLI.
- **Execution Environment:** Local machine only; no cloud deployment, no database for MVP.
- **Data Handling:** Intermediate data persisted to local filesystem in a date-stamped directory.
- **HTTP Client:** Mandatory use of native Node.js v22 `Workspace` API for all external HTTP requests.
- **Modularity:** Code organized into distinct modules for clients, scraping, email, core logic, utilities, and types to promote separation of concerns and testability.
- **Stage Testing:** Mandatory standalone scripts (`src/stages/*`) allow independent testing of each pipeline phase.
- **Configuration:** Environment variables loaded natively from `.env` file; no `dotenv` package required.
- **Error Handling:** Graceful handling of scraping failures (log and continue); basic logging for other API/network errors.
- **Logging:** Basic console logging via a simple wrapper (`src/utils/logger.ts`) for MVP; structured file logging is a post-MVP consideration.
- **Key Libraries:** `@extractus/article-extractor`, `date-fns`, `nodemailer`, `yargs`. (See `docs/tech-stack.md`)

## Core Workflow / Sequence Diagram (Main Pipeline)

```mermaid
sequenceDiagram
    participant CLI_User as CLI User
    participant Idx as src/index.ts
    participant Pipe as core/pipeline.ts
    participant Cfg as utils/config.ts
    participant Log as utils/logger.ts
    participant HN as clients/algoliaHNClient.ts
    participant FS as Local FS [output/]
    participant Scr as scraper/articleScraper.ts
    participant Oll as clients/ollamaClient.ts
    participant Asm as email/contentAssembler.ts
    participant Tpl as email/templates.ts
    participant Snd as email/emailSender.ts
    participant Alg as Algolia HN API
    participant Web as Article Website
    participant Olm as Ollama API [Local]
    participant SMTP as SMTP Service

    Note right of CLI_User: Triggered via 'npm run dev'/'start'

    CLI_User ->> Idx: Execute script
    Idx ->> Cfg: Load .env config
    Idx ->> Log: Initialize logger
    Idx ->> Pipe: runPipeline()
    Pipe ->> Log: Log start
    Pipe ->> HN: fetchTopStories()
    HN ->> Alg: Request stories
    Alg -->> HN: Story data
    HN -->> Pipe: stories[]
    loop For each story
        Pipe ->> HN: fetchCommentsForStory(storyId, max)
        HN ->> Alg: Request comments
        Alg -->> HN: Comment data
        HN -->> Pipe: comments[]
        Pipe ->> FS: Write {storyId}_data.json
    end
    Pipe ->> Log: Log HN fetch complete

    loop For each story with URL
        Pipe ->> Scr: scrapeArticle(story.url)
        Scr ->> Web: Request article HTML [via Workspace]
        alt Scraping Successful
            Web -->> Scr: HTML content
            Scr -->> Pipe: articleText: string
            Pipe ->> FS: Write {storyId}_article.txt
        else Scraping Failed / Skipped
            Web -->> Scr: Error / Non-HTML / Timeout
            Scr -->> Pipe: articleText: null
            Pipe ->> Log: Log scraping failure/skip
        end
    end
    Pipe ->> Log: Log scraping complete

    loop For each story
        alt Article content exists
            Pipe ->> Oll: generateSummary(prompt, articleText)
            Oll ->> Olm: POST /api/generate [article]
            Olm -->> Oll: Article Summary / Error
            Oll -->> Pipe: articleSummary: string | null
        else No article content
            Pipe -->> Pipe: Set articleSummary = null
        end
        alt Comments exist
            Pipe ->> Pipe: Format comments to text block
            Pipe ->> Oll: generateSummary(prompt, commentsText)
            Oll ->> Olm: POST /api/generate [comments]
            Olm -->> Oll: Discussion Summary / Error
            Oll -->> Pipe: discussionSummary: string | null
        else No comments
            Pipe -->> Pipe: Set discussionSummary = null
        end
        Pipe ->> FS: Write {storyId}_summary.json
    end
    Pipe ->> Log: Log summarization complete

    Pipe ->> Asm: assembleDigestData(dateDirPath)
    Asm ->> FS: Read _data.json, _summary.json files
    FS -->> Asm: File contents
    Asm -->> Pipe: digestData[]
    alt Digest data assembled
        Pipe ->> Tpl: renderDigestHtml(digestData, date)
        Tpl -->> Pipe: htmlContent: string
        Pipe ->> Snd: sendDigestEmail(subject, htmlContent)
        Snd ->> Cfg: Load email config
        Snd ->> SMTP: Send email
        SMTP -->> Snd: Success/Failure
        Snd -->> Pipe: success: boolean
        Pipe ->> Log: Log email result
    else Assembly failed / No data
        Pipe ->> Log: Log skipping email
    end
    Pipe ->> Log: Log finished
```

## Infrastructure and Deployment Overview

- **Cloud Provider(s):** N/A. Executes locally on the user's machine.
- **Core Services Used:** N/A (relies on external Algolia API, local Ollama, target websites, SMTP provider).
- **Infrastructure as Code (IaC):** N/A.
- **Deployment Strategy:** Manual execution via CLI (`npm run dev` or `npm run start` after `npm run build`). No CI/CD pipeline required for MVP.
- **Environments:** Single environment: local development machine.

## Key Reference Documents

- `docs/prd.md`
- `docs/epic1.md` ... `docs/epic5.md`
- `docs/tech-stack.md`
- `docs/project-structure.md`
- `docs/data-models.md`
- `docs/api-reference.md`
- `docs/environment-vars.md`
- `docs/coding-standards.md`
- `docs/testing-strategy.md`
- `docs/prompts.md`

## Change Log

| Change        | Date       | Version | Description                | Author      |
| ------------- | ---------- | ------- | -------------------------- | ----------- |
| Initial draft | 2025-05-04 | 0.1     | Initial draft based on PRD | 3-Architect |
