# Operational Guidelines

> This document is a granulated shard from the main "3-architecture.md" focusing on "Operational Guidelines (Coding Standards, Testing, Error Handling, Security)".

### Error Handling Strategy

A robust error handling strategy is essential for the reliability of the BMad DiCaster pipeline. This involves consistent error logging, appropriate retry mechanisms, and clear error propagation. The `workflow_runs` table will be a central piece in tracking errors for entire workflow executions.

- **General Approach:**
  - Standard JavaScript `Error` objects (or custom extensions of `Error`) will be used for exceptions within TypeScript code.
  - Each Supabase Function in the pipeline will catch its own errors, log them using Pino, update the `workflow_runs` table with an error status/message (via `WorkflowTrackerService`), and prevent unhandled promise rejections.
  - Next.js API routes will catch errors, log them, and return appropriate HTTP error responses (e.g., 4xx, 500) with a JSON error payload.
- **Logging (Pino):**
  - **Library/Method:** Pino (`pino`) is the standard logging library for Supabase Functions and Next.js API routes.
  - **Configuration:** A shared Pino logger instance (e.g., `supabase/functions/_shared/logger.ts`) will be configured for JSON output, ISO timestamps, and environment-aware pretty-printing for development.
    ```typescript
    // Example: supabase/functions/_shared/logger.ts
    import pino from "pino";
    export const logger = pino({
      level: process.env.LOG_LEVEL || "info",
      formatters: { level: (label) => ({ level: label }) },
      timestamp: pino.stdTimeFunctions.isoTime,
      ...(process.env.NODE_ENV === "development" && {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      }),
    });
    ```
  - **Format:** Structured JSON.
  - **Levels:** `trace`, `debug`, `info`, `warn`, `error`, `fatal`.
  - **Context:** Logs must include `timestamp`, `severity`, `workflowRunId` (where applicable), `service` or `functionName`, a clear `message`, and relevant `details` (sanitized). **Sensitive data must NEVER be logged.** Pass error objects directly to Pino: `logger.error({ err: errorInstance, workflowRunId }, "Operation failed");`.
- **Specific Handling Patterns:**
  - **External API Calls (HN Algolia, Play.ht, LLM Provider):**
    - **Facades:** Calls made through dedicated facades in `supabase/functions/_shared/`.
    - **Timeouts:** Implement reasonable connect and read timeouts.
    - **Retries:** Facades implement limited retries (2-3) with exponential backoff for transient errors (network issues, 5xx errors).
    - **Error Propagation:** Facades catch, log, and throw standardized custom errors (e.g., `ExternalApiError`) containing contextual information.
  - **Internal Errors / Business Logic Exceptions (Supabase Functions):**
    - Use `try...catch`. Critical errors preventing task completion for a `workflow_run_id` must: 1. Log detailed error (Pino). 2. Call `WorkflowTrackerService.failWorkflow(...)`.
    - Next.js API routes return generic JSON errors (e.g., `{"error": "Internal server error"}`) and appropriate HTTP status codes.
  - **Database Operations (Supabase):** Critical errors treated as internal errors (log, update `workflow_runs` to 'failed').
  - **Scraping/Summarization/Podcast/Delivery Failures:** Individual item failures are logged and status updated (e.g., `scraped_articles.scraping_status`). The overall workflow may continue with available data, with partial success noted in `workflow_runs.details`. Systemic failures lead to `workflow_runs.status = 'failed'`.
  - **`CheckWorkflowCompletionService`:** Must be resilient. Errors processing one `workflow_run_id` should be logged but not prevent processing of other runs or subsequent scheduled invocations.

### Coding Standards

These standards are mandatory for all code generation by AI agents and human developers.

- **Primary Language & Runtime:** TypeScript `5.7.2`, Node.js `22.10.2`.
- **Style Guide & Linter:** ESLint (configured with Next.js defaults, TypeScript support) and Prettier (`3.3.3`). Configurations in root. Linting/formatting are mandatory.
- **Naming Conventions:**
  - Variables & Functions/Methods: `camelCase`
  - Classes/Types/Interfaces: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files (.ts, .tsx): `kebab-case` (e.g., `newsletter-card.tsx`)
  - Supabase function directories: `kebab-case` (e.g., `hn-content-service`)
- **File Structure:** Adhere to "Project Structure." Unit tests (`*.test.ts(x)`/`*.spec.ts(x)`) co-located with source files.
- **Asynchronous Operations:** Always use `async`/`await` for Promises; ensure proper handling.
- **Type Safety (TypeScript):** Adhere to `tsconfig.json` (`"strict": true`). Avoid `any`; use `unknown` with type narrowing. Shared types in `shared/types/`.
- **Comments & Documentation:** Explain _why_, not _what_. Use TSDoc for exported members. READMEs for modules/services.
- **Dependency Management:** Use `npm`. Vet new dependencies. Pin versions or use `^` for non-breaking updates. Resolve `latest` tags to specific versions upon setup.
- **Environment Variables:** Manage via environment variables (`.env.example` provided). Use Zod for runtime parsing/validation.
- **Modularity & Reusability:** Break down complexity. Use shared utilities/facades.

#### Detailed Language & Framework Conventions

##### TypeScript/Node.js (Next.js & Supabase Functions) Specifics:

- **Immutability:** Prefer immutable data structures (e.g., `Readonly<T>`, `as const`). Follow Zustand patterns for immutable state updates in React.
- **Functional vs. OOP:** Favor functional constructs for data transformation/utilities. Use classes for services/facades managing state or as per framework (e.g., React functional components with Hooks preferred).
- **Error Handling Specifics:** `throw new Error('...')` or custom error classes. Ensure `Promise` rejections are `Error` objects.
- **Null/Undefined Handling:** With `strictNullChecks`, handle explicitly. Avoid `!` non-null assertion; prefer explicit checks, `?.`, `??`.
- **Module System:** Use ES Modules (`import`/`export`) exclusively.
- **Logging Specifics (Pino):** Use shared Pino logger. Include context object (`logger.info({ context }, "message")`), especially `workflowRunId`.
- **Next.js Conventions:** Follow App Router conventions. Use Server Components for data fetching where appropriate. Route Handlers for API endpoints.
- **Supabase Function Conventions:** `index.ts` as entry. Self-contained or use `_shared/` utilities. Secure client initialization (admin vs. user).
- **Code Generation Anti-Patterns to Avoid:** Overly nested logic, single-letter variables (except trivial loops), disabling linter/TS errors without cause, bypassing framework security, monolithic functions.

### Overall Testing Strategy

- **Tools:** Jest (unit/integration), React Testing Library (RTL) (React components), Playwright (E2E). Supabase CLI for local DB/function testing.
- **Unit Tests:**
  - **Scope:** Isolate individual functions, methods, classes, React components. Focus on logic, transformations, component rendering.
  - **Location & Naming:** Co-located with source files (`*.test.ts`, `*.spec.ts`, `*.test.tsx`, `*.spec.tsx`).
  - **Mocking/Stubbing:** Jest mocks for dependencies. External API Facades are mocked when testing services that use them. Facades themselves are tested by mocking the underlying HTTP client or library's network calls.
  - **AI Agent Responsibility:** Generate unit tests covering logic paths, props, events, edge cases, error conditions for new/modified code.
- **Integration Tests:**
  - **Scope:** Interactions between components/services (e.g., API route -> service -> DB).
  - **Location:** `tests/integration/`.
  - **Environment:** Local Supabase dev environment. Consider `msw` for mocking HTTP services called by frontend/backend.
  - **AI Agent Responsibility:** Generate tests for key service interactions or API contracts.
- **End-to-End (E2E) Tests:**
  - **Scope:** Validate complete user flows via UI.
  - **Tool:** Playwright. Location: `tests/e2e/`.
  - **Key Scenarios (MVP):** View newsletter list, view detail, play podcast, download newsletter.
  - **AI Agent Responsibility:** Generate E2E test stubs/scripts for critical paths.
- **Test Coverage:**
  - **Target:** Aim for **80% unit test coverage** for new business logic and critical components. Quality over quantity.
  - **Measurement:** Jest coverage reports.
- **Mocking/Stubbing Strategy (General):** Test one unit at a time. Mock external dependencies for unit tests. For facade unit tests: use the real library but mock its external calls at the library's boundary.
- **Test Data Management:** Inline mock data for unit tests. Factories/fixtures or `seed.sql` for integration/E2E tests.

### Security Best Practices

- **Input Sanitization/Validation:** Zod for all external inputs (API requests, function payloads, external API responses). Validate at component boundaries.
- **Output Encoding:** Rely on React JSX auto-escaping for frontend. Ensure HTML for newsletters is sanitized if dynamic data is injected outside of a secure templating engine.
- **Secrets Management:** Via environment variables (Vercel UI, `.env.local`). Never hardcode or log secrets. Access via `process.env`. Use Supabase service role key only in backend functions.
- **Dependency Security:** Regular `npm audit`. Vet new dependencies.
- **Authentication/Authorization:**
  - Workflow Trigger/Status APIs: API Key (`X-API-KEY`).
  - Play.ht Webhook: Shared secret or signature verification.
  - Supabase RLS: Enable on tables, define policies (especially for `subscribers` and any data directly queried by frontend).
- **Principle of Least Privilege:** Scope API keys and database roles narrowly.
- **API Security (General):** HTTPS (Vercel default). Consider rate limiting for public APIs. Standard HTTP security headers.
- **Error Handling & Information Disclosure:** Log detailed errors server-side; return generic messages/error IDs to clients.
- **Regular Security Audits/Testing (Post-MVP):** Consider for future enhancements.
