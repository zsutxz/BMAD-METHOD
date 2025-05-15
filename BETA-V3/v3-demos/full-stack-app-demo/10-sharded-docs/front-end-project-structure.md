# Detailed Frontend Directory Structure

> This document is a granulated shard from the main "5-front-end-architecture.md" focusing on "Detailed Frontend Directory Structure".

The BMad DiCaster frontend will adhere to the Next.js App Router conventions and build upon the structure provided by the Vercel/Supabase Next.js App Router template. The monorepo structure defined in the main Architecture Document (`docs/architecture.md`) already outlines the top-level directories. This section details the frontend-specific organization.

**Naming Conventions Adopted:**

- **Directories:** `kebab-case` (e.g., `app/(web)/newsletter-list/`, `app/components/core/`)
- **React Component Files (.tsx):** `PascalCase.tsx` (e.g., `NewsletterCard.tsx`, `PodcastPlayer.tsx`). Next.js App Router special files (e.g., `page.tsx`, `layout.tsx`, `loading.tsx`, `global-error.tsx`, `not-found.tsx`) retain their conventional lowercase or kebab-case names.
- **Non-Component TypeScript Files (.ts):** Primarily `camelCase.ts` (e.g., `utils.ts`, `uiSlice.ts`). Configuration files (e.g., `tailwind.config.ts`) and shared type definition files (e.g., `api-schemas.ts`, `domain-models.ts`) may retain `kebab-case` as per common practice or previous agreement.

```plaintext
{project-root}/
├── app/                        # Next.js App Router (Frontend Pages, Layouts, API Routes)
│   ├── (web)/                  # Group for user-facing web pages
│   │   ├── newsletters/        # Route group for newsletter features
│   │   │   ├── [newsletterId]/ # Dynamic route for individual newsletter detail
│   │   │   │   ├── page.tsx    # Newsletter Detail Page component
│   │   │   │   └── loading.tsx # Optional: Loading UI for this route
│   │   │   ├── page.tsx        # Newsletter List Page component
│   │   │   └── layout.tsx      # Optional: Layout specific to /newsletters routes
│   │   ├── layout.tsx          # Root layout for all (web) pages
│   │   └── page.tsx            # Homepage (displays newsletter list)
│   ├── (api)/                  # API route handlers (as defined in main architecture [cite: 82, 127, 130, 133])
│   │   ├── system/
│   │   │   └── ...
│   │   └── webhooks/
│   │       └── ...
│   ├── components/             # Application-specific UI React components (Core Logic)
│   │   ├── core/               # Core, reusable application components
│   │   │   ├── NewsletterCard.tsx
│   │   │   ├── PodcastPlayer.tsx
│   │   │   ├── DownloadButton.tsx
│   │   │   └── BackButton.tsx
│   │   └── layout/             # General layout components
│   │       └── PageWrapper.tsx   # Consistent padding/max-width for pages
│   ├── auth/                   # Auth-related pages and components (from template, MVP frontend is public)
│   ├── login/page.tsx          # Login page (from template, MVP frontend is public)
│   └── global-error.tsx        # Optional: Custom global error UI (Next.js special file)
│   └── not-found.tsx           # Optional: Custom 404 page UI (Next.js special file)
│   ├── components/                 # Shadcn UI components root (as configured by components.json [cite: 92])
│   │   └── ui/                     # Base UI elements from Shadcn (e.g., Button.tsx, Card.tsx)
│   ├── lib/                        # General utility functions for frontend [cite: 86, 309]
│   │   ├── utils.ts                # General utility functions (date formatting, etc.)
│   │   └── hooks/                  # Custom global React hooks
│   │       └── useScreenWidth.ts   # Example custom hook
│   ├── store/                      # Zustand state management
│   │   ├── index.ts                # Main store setup/export (can be store.ts or index.ts)
│   │   └── slices/                 # Individual state slices
│   │       └── podcastPlayerSlice.ts # State for the podcast player
│   ├── public/                     # Static assets (images, favicon, etc.) [cite: 89]
│   │   └── logo.svg                # Application logo (to be provided [cite: 379])
│   ├── shared/                     # Shared code/types between frontend and Supabase functions [cite: 89, 97]
│   │   └── types/
│   │       ├── api-schemas.ts      # Zod schemas for API req/res
│   │       └── domain-models.ts    # Core entity types (HNPost, Newsletter, etc. from main arch)
│   ├── styles/                     # Global styles [cite: 90]
│   │   └── globals.css             # Tailwind base styles, custom global styles
│   ├── utils/                      # Root utilities (from template [cite: 91])
│   │   └── supabase/               # Supabase helper functions FOR FRONTEND (from template [cite: 92, 309])
│   │       ├── client.ts           # Client-side Supabase client
│   │       ├── middleware.ts       # Logic for Next.js middleware (Supabase auth [cite: 92, 311])
│   │       └── server.ts           # Server-side Supabase client
│   ├── tailwind.config.ts          # Tailwind CSS configuration [cite: 93]
│   └── tsconfig.json               # TypeScript configuration (includes path aliases like @/* [cite: 101])
```

### Notes on Frontend Structure:

- **`app/(web)/`**: Route group for user-facing pages.
  - **`newsletters/page.tsx`**: Server Component for listing newsletters. [cite: 375, 573]
  - **`newsletters/[newsletterId]/page.tsx`**: Server Component for displaying a single newsletter. [cite: 376, 576]
- **`app/components/core/`**: Houses application-specific React components like `NewsletterCard.tsx`, `PodcastPlayer.tsx`, `DownloadButton.tsx`, `BackButton.tsx` (identified in `ux-ui-spec.txt`). Components follow `PascalCase.tsx`.
- **`app/components/layout/`**: For structural layout components, e.g., `PageWrapper.tsx`. Components follow `PascalCase.tsx`.
- **`components/ui/`**: Standard directory for Shadcn UI components (e.g., `Button.tsx`, `Card.tsx`).
- **`lib/hooks/`**: Custom React hooks (e.g., `useScreenWidth.ts`), files follow `camelCase.ts`.
- **`store/slices/`**: Zustand state slices. `podcastPlayerSlice.ts` for podcast player state. Files follow `camelCase.ts`.
- **`shared/types/`**: Type definitions. `api-schemas.ts` and `domain-models.ts` use `kebab-case.ts`.
- **`utils/supabase/`**: Template-provided Supabase clients. Files follow `camelCase.ts`.
- **Path Aliases**: `tsconfig.json` uses `@/*` aliases. [cite: 98, 101]
