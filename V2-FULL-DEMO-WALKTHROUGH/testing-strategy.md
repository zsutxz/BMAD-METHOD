# BMad Hacker Daily Digest Testing Strategy

## Overall Philosophy & Goals

The testing strategy for the BMad Hacker Daily Digest MVP focuses on pragmatic validation of the core pipeline functionality and individual component logic. Given it's a local CLI tool with a sequential process, the emphasis is on:

1.  **Functional Correctness:** Ensuring each stage of the pipeline (fetch, scrape, summarize, email) performs its task correctly according to the requirements.
2.  **Integration Verification:** Confirming that data flows correctly between pipeline stages via the local filesystem.
3.  **Robustness (Key Areas):** Specifically testing graceful handling of expected failures, particularly in article scraping .
4.  **Leveraging Boilerplate:** Utilizing the Jest testing framework provided by `bmad-boilerplate` for automated unit and integration tests .
5.  **Stage-Based Acceptance:** Using the mandatory **Stage Testing Utilities** as the primary mechanism for end-to-end validation of each phase against real external interactions (where applicable) .

The primary goal is confidence in the MVP's end-to-end execution and the correctness of the generated email digest. High code coverage is secondary to testing critical paths and integration points.

## Testing Levels

### Unit Tests

- **Scope:** Test individual functions, methods, or modules in isolation. Focus on business logic within utilities (`src/utils/`), clients (`src/clients/` - mocking HTTP calls), scraping logic (`src/scraper/` - mocking HTTP calls), email templating (`src/email/templates.ts`), and potentially core pipeline orchestration logic (`src/core/pipeline.ts` - mocking stage implementations).
- **Tools:** Jest (provided by `bmad-boilerplate`). Use `npm run test`.
- **Mocking/Stubbing:** Utilize Jest's built-in mocking capabilities (`jest.fn()`, `jest.spyOn()`, manual mocks in `__mocks__`) to isolate units under test from external dependencies (native `Workspace` API, `fs`, other modules, external libraries like `nodemailer`, `ollamaClient`).
- **Location:** `test/unit/`, mirroring the `src/` directory structure.
- **Expectations:** Cover critical logic branches, calculations, and helper functions. Ensure tests are fast and run reliably. Aim for good coverage of utility functions and complex logic within modules.

### Integration Tests

- **Scope:** Verify the interaction between closely related modules. Examples:
  - Testing the `core/pipeline.ts` orchestrator with mocked implementations of each stage (fetch, scrape, summarize, email) to ensure the sequence and basic data flow are correct.
  - Testing a client module (e.g., `algoliaHNClient`) against mocked HTTP responses to ensure correct parsing and data transformation.
  - Testing the `email/contentAssembler.ts` by providing mock data files in a temporary directory (potentially using `mock-fs` or setup/teardown logic) and verifying the assembled `DigestData`.
- **Tools:** Jest. May involve limited use of test setup/teardown for creating mock file structures if needed.
- **Location:** `test/integration/`.
- **Expectations:** Verify the contracts and collaborations between key internal components. Slower than unit tests. Focus on module boundaries.

### End-to-End (E2E) / Acceptance Tests (Using Stage Runners)

- **Scope:** This is the **primary method for acceptance testing** the functionality of each major pipeline stage against real external services and the filesystem, as required by the PRD . This also includes manually running the full pipeline.
- **Process:**
  1.  **Stage Testing Utilities:** Execute the standalone scripts in `src/stages/` via `npm run stage:<stage_name> [--args]`.
      - `npm run stage:fetch`: Verifies fetching from Algolia HN API and persisting `_data.json` files locally.
      - `npm run stage:scrape`: Verifies reading `_data.json`, scraping article URLs (hitting real websites), and persisting `_article.txt` files locally.
      - `npm run stage:summarize`: Verifies reading local `_data.json` / `_article.txt`, calling the local Ollama API, and persisting `_summary.json` files. Requires a running local Ollama instance.
      - `npm run stage:email [--dry-run]`: Verifies reading local persisted files, assembling the digest, rendering HTML, and either sending a real email (live run) or saving an HTML preview (`--dry-run`). Requires valid SMTP credentials in `.env` for live runs.
  2.  **Full Pipeline Run:** Execute the main application via `npm run dev` or `npm start`.
  3.  **Manual Verification:** Check console logs for errors during execution. Inspect the contents of the `output/YYYY-MM-DD/` directory (existence and format of `_data.json`, `_article.txt`, `_summary.json`, `_digest_preview.html` if dry-run). For live email tests, verify the received email's content, formatting, and summaries.
- **Tools:** `npm` scripts, console inspection, file system inspection, email client.
- **Environment:** Local development machine with internet access, configured `.env` file, and a running local Ollama instance .
- **Location:** Scripts in `src/stages/`; verification steps are manual.
- **Expectations:** These tests confirm the real-world functionality of each stage and the end-to-end process, fulfilling the core MVP success criteria .

### Manual / Exploratory Testing

- **Scope:** Primarily focused on subjective assessment of the generated email digest: readability of HTML, coherence and quality of LLM summaries.
- **Process:** Review the output from E2E tests (`_digest_preview.html` or received email).

## Specialized Testing Types

- N/A for MVP. Performance, detailed security, accessibility, etc., are out of scope.

## Test Data Management

- **Unit/Integration:** Use hardcoded fixtures, Jest mocks, or potentially mock file systems.
- **Stage/E2E:** Relies on live data fetched from Algolia/websites during the test run itself, or uses the output files generated by preceding stage runs. The `--dry-run` option for `stage:email` avoids external SMTP interaction during testing loops.

## CI/CD Integration

- N/A for MVP (local execution only). If CI were implemented later, it would execute `npm run lint` and `npm run test` (unit/integration tests). Running stage tests in CI would require careful consideration due to external dependencies (Algolia, Ollama, SMTP, potentially rate limits).

## Change Log

| Change        | Date       | Version | Description             | Author      |
| ------------- | ---------- | ------- | ----------------------- | ----------- |
| Initial draft | 2025-05-04 | 0.1     | Draft based on PRD/Arch | 3-Architect |
