# BMad Hacker Daily Digest Coding Standards and Patterns

This document outlines the coding standards, design patterns, and best practices to be followed during the development of the BMad Hacker Daily Digest project. Adherence to these standards is crucial for maintainability, readability, and collaboration.

## Architectural / Design Patterns Adopted

- **Sequential Pipeline:** The core application follows a linear sequence of steps (fetch, scrape, summarize, email) orchestrated within `src/core/pipeline.ts`.
- **Modular Design:** The application is broken down into distinct modules based on responsibility (e.g., `clients/`, `scraper/`, `email/`, `utils/`) to promote separation of concerns, testability, and maintainability. See `docs/project-structure.md`.
- **Client Abstraction:** External service interactions (Algolia, Ollama) are encapsulated within dedicated client modules in `src/clients/`.
- **Filesystem Persistence:** Intermediate data is persisted to the local filesystem instead of a database, acting as a handoff between pipeline stages.

## Coding Standards

- **Primary Language:** TypeScript (v5.x, as configured in boilerplate)
- **Primary Runtime:** Node.js (v22.x, as required by PRD )
- **Style Guide & Linter:** ESLint and Prettier. Configuration is provided by the `bmad-boilerplate`.
  - **Mandatory:** Run `npm run lint` and `npm run format` regularly and before committing code. Code must be free of lint errors.
- **Naming Conventions:**
  - Variables & Functions: `camelCase`
  - Classes, Types, Interfaces: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `kebab-case.ts` (e.g., `article-scraper.ts`) or `camelCase.ts` (e.g., `ollamaClient.ts`). Be consistent within module types (e.g., all clients follow one pattern, all utils another). Let's default to `camelCase.ts` for consistency with class/module names where applicable (e.g. `ollamaClient.ts`) and `kebab-case.ts` for more descriptive utils or stage runners (e.g. `Workspace-hn-data.ts`).
  - Test Files: `*.test.ts` (e.g., `ollamaClient.test.ts`)
- **File Structure:** Adhere strictly to the layout defined in `docs/project-structure.md`.
- **Asynchronous Operations:** **Mandatory:** Use `async`/`await` for all asynchronous operations (e.g., native `Workspace` HTTP calls , `fs/promises` file operations, Ollama client calls, Nodemailer `sendMail`). Avoid using raw Promises `.then()`/`.catch()` syntax where `async/await` provides better readability.
- **Type Safety:** Leverage TypeScript's static typing. Use interfaces and types defined in `src/types/` where appropriate. Assume `strict` mode is enabled in `tsconfig.json` (from boilerplate). Avoid using `any` unless absolutely necessary and justified.
- **Comments & Documentation:**
  - Use JSDoc comments for exported functions, classes, and complex logic.
  - Keep comments concise and focused on the _why_, not the _what_, unless the code is particularly complex.
  - Update READMEs as needed for setup or usage changes.
- **Dependency Management:**
  - Use `npm` for package management.
  - Keep production dependencies minimal, as required by the PRD . Justify any additions.
  - Use `devDependencies` for testing, linting, and build tools.

## Error Handling Strategy

- **General Approach:** Use standard JavaScript `try...catch` blocks for operations that can fail (I/O, network requests, parsing, etc.). Throw specific `Error` objects with descriptive messages. Avoid catching errors without logging or re-throwing unless intentionally handling a specific case.
- **Logging:**
  - **Mandatory:** Use the central logger utility (`src/utils/logger.ts`) for all console output (INFO, WARN, ERROR). Do not use `console.log` directly in application logic.
  - **Format:** Basic text format for MVP. Structured JSON logging to files is a post-MVP enhancement.
  - **Levels:** Use appropriate levels (`logger.info`, `logger.warn`, `logger.error`).
  - **Context:** Include relevant context in log messages (e.g., Story ID, function name, URL being processed) to aid debugging.
- **Specific Handling Patterns:**
  - **External API Calls (Algolia, Ollama via `Workspace`):**
    - Wrap `Workspace` calls in `try...catch`.
    - Check `response.ok` status; if false, log the status code and potentially response body text, then treat as an error (e.g., return `null` or throw).
    - Log network errors caught by the `catch` block.
    - No automated retries required for MVP.
  - **Article Scraping (`articleScraper.ts`):**
    - Wrap `Workspace` and text extraction (`article-extractor`) logic in `try...catch`.
    - Handle non-2xx responses, timeouts, non-HTML content types, and extraction errors.
    - **Crucial:** If scraping fails for any reason, log the error/reason using `logger.warn` or `logger.error`, return `null`, and **allow the main pipeline to continue processing the story** (using only comment summary). Do not throw an error that halts the entire application.
  - **File I/O (`fs` module):**
    - Wrap `fs` operations (especially writes) in `try...catch`. Log any file system errors using `logger.error`.
  - **Email Sending (`Nodemailer`):**
    - Wrap `transporter.sendMail()` in `try...catch`. Log success (including message ID) or failure clearly using the logger.
  - **Configuration Loading (`config.ts`):**
    - Check for the presence of all required environment variables at startup. Throw a fatal error and exit if required variables are missing.
    - **LLM Interaction (Ollama Client):**
      - **LLM Prompts:** Use the standardized prompts defined in `docs/prompts.md` when interacting with the Ollama client for consistency.
      - Wrap `generateSummary` calls in `try...catch`. Log errors from the client (which handles API/network issues).
      - **Comment Truncation:** Before sending comments for discussion summary, check for the `MAX_COMMENT_CHARS_FOR_SUMMARY` env var. If set to a positive number, truncate the combined comment text block to this length. Log a warning if truncation occurs. If not set, send the full text.

## Security Best Practices

- **Input Sanitization/Validation:** While primarily a local tool, validate critical inputs like external URLs (`story.articleUrl`) before attempting to fetch them. Basic checks (e.g., starts with `http://` or `https://`) are sufficient for MVP .
- **Secrets Management:**
  - **Mandatory:** Store sensitive data (`EMAIL_USER`, `EMAIL_PASS`) only in the `.env` file.
  - **Mandatory:** Ensure the `.env` file is included in `.gitignore` and is never committed to version control.
  - Do not hardcode secrets anywhere in the source code.
- **Dependency Security:** Periodically run `npm audit` to check for known vulnerabilities in dependencies. Consider enabling Dependabot if using GitHub.
- **HTTP Client:** Use the native `Workspace` API as required ; avoid introducing less secure or overly complex HTTP client libraries.
- **Scraping User-Agent:** Set a default User-Agent header in the scraper code (e.g., "BMadHackerDigest/0.1"). Allow overriding this default via the optional SCRAPER_USER_AGENT environment variable. 

## Change Log

| Change        | Date       | Version | Description                 | Author      |
| ------------- | ---------- | ------- | --------------------------- | ----------- |
| Initial draft | 2025-05-04 | 0.1     | Initial draft based on Arch | 3-Architect |
