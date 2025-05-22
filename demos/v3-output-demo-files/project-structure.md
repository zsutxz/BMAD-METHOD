# Project Structure

The project utilizes a polyrepo structure with separate backend and frontend repositories, each with its own CDK application.

## 1. Backend Repository (`bmad-daily-digest-backend`)
Organized by features within `src/`, using `dash-case` for folders and files (e.g., `src/features/content-ingestion/hn-fetcher-service.ts`).

```plaintext
bmad-daily-digest-backend/
├── .github/
├── cdk/
│   ├── bin/
│   ├── lib/ # Backend Stack, Step Function definitions
│   └── test/
├── src/
│   ├── features/
│   │   ├── dailyJobOrchestrator/ # Main Step Function trigger/definition support
│   │   ├── hnContentPipeline/    # Services for Algolia, scraping, formatting
│   │   ├── playAiIntegration/    # Services for Play.ai submit & polling Lambda logic
│   │   ├── podcastPersistence/   # Services for S3 & DynamoDB storage
│   │   └── publicApi/            # Handlers for API Gateway (status, episodes)
│   ├── shared/
│   │   ├── utils/
│   │   ├── types/
│   │   └── services/ # Optional shared low-level AWS SDK wrappers
├── tests/ # Unit/Integration tests, mirroring src/features/
│   └── features/
... (root config files: .env.example, .eslintrc.js, .gitignore, .prettierrc.js, jest.config.js, package.json, README.md, tsconfig.json)
```

*Key Directories: `cdk/` for IaC, `src/features/` for modular backend logic, `src/shared/` for reusable code, `tests/` for Jest tests.*

## 2. Frontend Repository (`bmad-daily-digest-frontend`)
Aligns with V0.dev generated Next.js App Router structure, using `dash-case` for custom files/folders where applicable.

```plaintext
bmad-daily-digest-frontend/
├── .github/
├── app/
│   ├── (pages)/
│   │   ├── episodes/
│   │   │   ├── page.tsx          # List page
│   │   │   └── [episode-id]/
│   │   │       └── page.tsx      # Detail page
│   │   └── about/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn/ui based components
│   └── domain/                 # Custom composite components (e.g., episode-card)
├── cdk/                        # AWS CDK application for frontend infra (S3, CloudFront)
│   ├── bin/
│   └── lib/
├── hooks/
├── lib/
│   ├── types.ts
│   ├── utils.ts
│   └── api-client.ts           # Backend API communication
├── public/
├── tests/ # Jest & RTL tests
... (root config files: .env.local.example, .eslintrc.js, components.json, next.config.mjs, package.json, tailwind.config.ts, tsconfig.json)
```

*Key Directories: `app/` for Next.js routes, `components/` for UI, `cdk/` for frontend IaC, `lib/` for utilities and `api-client.ts`.* 