# BMad Hacker Daily Digest Project Structure

This document outlines the standard directory and file structure for the project. Adhering to this structure ensures consistency and maintainability.

```plaintext
bmad-hacker-daily-digest/
├── .github/                    # Optional: GitHub Actions workflows (if used)
│   └── workflows/
├── .vscode/                    # Optional: VSCode editor settings
│   └── settings.json
├── dist/                       # Compiled JavaScript output (from 'npm run build', git-ignored)
├── docs/                       # Project documentation (PRD, Architecture, Epics, etc.)
│   ├── architecture.md
│   ├── tech-stack.md
│   ├── project-structure.md    # This file
│   ├── data-models.md
│   ├── api-reference.md
│   ├── environment-vars.md
│   ├── coding-standards.md
│   ├── testing-strategy.md
│   ├── prd.md                  # Product Requirements Document
│   ├── epic1.md .. epic5.md    # Epic details
│   └── ...
├── node_modules/               # Project dependencies (managed by npm, git-ignored)
├── output/                     # Default directory for data artifacts (git-ignored)
│   └── YYYY-MM-DD/             # Date-stamped subdirectories for runs
│       ├── {storyId}_data.json
│       ├── {storyId}_article.txt
│       └── {storyId}_summary.json
├── src/                        # Application source code
│   ├── clients/                # Clients for interacting with external services
│   │   ├── algoliaHNClient.ts  # Algolia HN Search API interaction logic [Epic 2]
│   │   └── ollamaClient.ts     # Ollama API interaction logic [Epic 4]
│   ├── core/                   # Core application logic & orchestration
│   │   └── pipeline.ts         # Main pipeline execution flow (fetch->scrape->summarize->email)
│   ├── email/                  # Email assembly, templating, and sending logic [Epic 5]
│   │   ├── contentAssembler.ts # Reads local files, prepares digest data
│   │   ├── emailSender.ts      # Sends email via Nodemailer
│   │   └── templates.ts        # HTML email template rendering function(s)
│   ├── scraper/                # Article scraping logic [Epic 3]
│   │   └── articleScraper.ts   # Implements scraping using article-extractor
│   ├── stages/                 # Standalone stage testing utility scripts [PRD Req]
│   │   ├── fetch_hn_data.ts    # Stage runner for Epic 2
│   │   ├── scrape_articles.ts  # Stage runner for Epic 3
│   │   ├── summarize_content.ts# Stage runner for Epic 4
│   │   └── send_digest.ts      # Stage runner for Epic 5 (with --dry-run)
│   ├── types/                  # Shared TypeScript interfaces and types
│   │   ├── hn.ts               # Types: Story, Comment
│   │   ├── ollama.ts           # Types: OllamaRequest, OllamaResponse
│   │   ├── email.ts            # Types: DigestData
│   │   └── index.ts            # Barrel file for exporting types from this dir
│   ├── utils/                  # Shared, low-level utility functions
│   │   ├── config.ts           # Loads and validates .env configuration [Epic 1]
│   │   ├── logger.ts           # Simple console logger wrapper [Epic 1]
│   │   └── dateUtils.ts        # Date formatting helpers (using date-fns)
│   └── index.ts                # Main application entry point (invoked by npm run dev/start) [Epic 1]
├── test/                       # Automated tests (using Jest)
│   ├── unit/                   # Unit tests (mirroring src structure)
│   │   ├── clients/
│   │   ├── core/
│   │   ├── email/
│   │   ├── scraper/
│   │   └── utils/
│   └── integration/            # Integration tests (e.g., testing pipeline stage interactions)
├── .env.example                # Example environment variables file [Epic 1]
├── .gitignore                  # Git ignore rules (ensure node_modules, dist, .env, output/ are included)
├── package.json                # Project manifest, dependencies, scripts (from boilerplate)
├── package-lock.json           # Lockfile for deterministic installs
└── tsconfig.json               # TypeScript compiler configuration (from boilerplate)
```

## Key Directory Descriptions

- `docs/`: Contains all project planning, architecture, and reference documentation.
- `output/`: Default location for persisted data artifacts generated during runs (stories, comments, summaries). Should be in `.gitignore`. Path configurable via `.env`.
- `src/`: Main application source code.
  - `clients/`: Modules dedicated to interacting with specific external APIs (Algolia, Ollama).
  - `core/`: Orchestrates the main application pipeline steps.
  - `email/`: Handles all aspects of creating and sending the final email digest.
  - `scraper/`: Contains the logic for fetching and extracting article content.
  - `stages/`: Holds the independent, runnable scripts for testing each major pipeline stage.
  - `types/`: Central location for shared TypeScript interfaces and type definitions.
  - `utils/`: Reusable utility functions (config loading, logging, date formatting) that don't belong to a specific feature domain.
  - `index.ts`: The main entry point triggered by `npm run dev/start`, responsible for initializing and starting the core pipeline.
- `test/`: Contains automated tests written using Jest. Structure mirrors `src/` for unit tests.

## Notes

- This structure promotes modularity by separating concerns (clients, scraping, email, core logic, stages, utils).
- Clear separation into directories like `clients`, `scraper`, `email`, and `stages` aids independent development, testing, and potential AI agent implementation tasks targeting specific functionalities.
- Stage runner scripts in `src/stages/` directly address the PRD requirement for testing pipeline phases independently .
