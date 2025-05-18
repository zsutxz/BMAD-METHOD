# Project Structure

> This document is a granulated shard from the main "3-architecture.md" focusing on "Project Structure".

The BMad DiCaster project is organized as a monorepo, leveraging the Vercel/Supabase Next.js App Router template as its foundation.

```plaintext
{project-root}/
├── app/                        # Next.js App Router
│   ├── (api)/                  # API route handlers
│   │   ├── system/
│   │   │   ├── trigger-workflow/route.ts
│   │   │   └── workflow-status/[jobId]/route.ts
│   │   └── webhooks/
│   │       └── playht/route.ts
│   ├── components/             # Application-specific UI react components
│   │   └── core/               # e.g., NewsletterCard, PodcastPlayer
│   ├── newsletters/
│   │   ├── [newsletterId]/page.tsx
│   │   └── page.tsx
│   ├── auth/                   # Auth-related pages and components (from template)
│   ├── login/page.tsx          # Login page (from template)
│   ├── layout.tsx
│   └── page.tsx                # Homepage
├── components/                 # Shadcn UI components root (as configured by components.json)
│   ├── tutorial/               # Example/template components (can be removed)
│   ├── typography/             # Example/template components (can be removed)
│   └── ui/                     # Base UI elements (button.tsx, card.tsx etc.)
├── docs/                       # Project documentation
│   ├── prd.md                  # Or prd-incremental-full-agile-mode.txt
│   ├── architecture.md         # This document
│   ├── ui-ux-spec.md           # Or ui-ux-spec.txt
│   ├── technical-preferences.md # Or technical-preferences copy.txt
│   ├── ADR/                    # Architecture Decision Records (to be created as needed)
│   └── environment-vars.md     # (To be created)
├── lib/                        # General utility functions for frontend (e.g., utils.ts from template)
│   └── utils.ts
├── supabase/                   # Supabase specific project files (backend logic)
│   ├── functions/              # Supabase Edge Functions (for event-driven pipeline)
│   │   ├── hn-content-service/index.ts
│   │   ├── article-scraper-service/index.ts
│   │   ├── summarization-service/index.ts
│   │   ├── podcast-generation-service/index.ts
│   │   ├── newsletter-generation-service/index.ts
│   │   ├── check-workflow-completion-service/index.ts # Cron-triggered orchestrator
│   │   └── _shared/            # Shared utilities/facades FOR Supabase backend functions
│   │       ├── supabase-admin-client.ts
│   │       ├── llm-facade.ts
│   │       ├── playht-facade.ts
│   │       ├── nodemailer-facade.ts
│   │       └── workflow-tracker-service.ts # For updating workflow_runs table
│   ├── migrations/             # Database schema migrations
│   │   └── YYYYMMDDHHMMSS_initial_schema.sql
│   └── config.toml             # Supabase project configuration (for CLI)
├── public/                     # Static assets (images, favicon, etc.)
├── shared/                     # Shared code/types between frontend and Supabase functions
│   └── types/
│       ├── api-schemas.ts      # Request/response types for app/(api) routes
│       ├── domain-models.ts    # Core entity types (HNPost, ArticleSummary etc.)
│       └── index.ts            # Barrel file for shared types
├── styles/                     # Global styles (e.g., globals.css for Tailwind base)
├── tests/                      # Automated tests
│   ├── e2e/                    # Playwright E2E tests
│   │   ├── newsletter-view.spec.ts
│   │   └── playwright.config.ts
│   └── integration/            # Integration tests
│       └── api-trigger-workflow.integration.test.ts
│   # Unit tests are co-located with source files, e.g., app/components/core/MyComponent.test.tsx
├── utils/                      # Root utilities (from template)
│   └── supabase/               # Supabase helper functions FOR FRONTEND (from template)
│       ├── client.ts           # Client-side Supabase client
│       ├── middleware.ts       # Logic for Next.js middleware
│       └── server.ts           # Server-side Supabase client
├── .env.example
├── .gitignore
├── components.json             # Shadcn UI configuration
├── middleware.ts               # Next.js middleware (root, uses utils/supabase/middleware.ts)
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

### Key Directory Descriptions:

- **`app/`**: Next.js frontend (pages, UI components, Next.js API routes).
  - **`app/(api)/`**: Backend API routes hosted on Vercel, including webhook receivers and system triggers.
  - **`app/components/core/`**: Application-specific reusable React components.
- **`components/`**: Root for Shadcn UI components.
- **`docs/`**: All project documentation.
- **`lib/`**: Frontend-specific utility functions.
- **`supabase/functions/`**: Backend serverless functions (event-driven pipeline steps).
  - **`supabase/functions/_shared/`**: Utilities and facades for these backend functions, including `WorkflowTrackerService`.
- **`supabase/migrations/`**: Database migrations managed by Supabase CLI.
- **`shared/types/`**: TypeScript types/interfaces shared between frontend and `supabase/functions/`. Path alias `@shared/*` to be configured in `tsconfig.json`.
- **`tests/`**: Contains E2E and integration tests. Unit tests are co-located with source files.
- **`utils/supabase/`**: Frontend-focused Supabase client helpers provided by the starter template.

### Monorepo Management:

- Standard `npm` (or `pnpm`/`yarn` workspaces if adopted later) for managing dependencies.
- The root `tsconfig.json` includes path aliases (`@/*`, `@shared/*`).

### Notes:

- Supabase functions in `supabase/functions/` are deployed to Vercel via Supabase CLI and Vercel integration.
- The `CheckWorkflowCompletionService` might be invoked via a Vercel Cron Job calling a simple HTTP trigger endpoint for that function, or via `pg_cron` if direct database scheduling is preferred.
