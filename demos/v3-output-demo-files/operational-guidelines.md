# Operational Guidelines

## Coding Standards (Backend: `bmad-daily-digest-backend`)

**Scope:** Applies to `bmad-daily-digest-backend`. Frontend standards are separate.

  * **Primary Language:** TypeScript (Node.js 22).
  * **Style:** ESLint, Prettier.
  * **Naming:** Variables/Functions: `camelCase`. Constants: `UPPER_SNAKE_CASE`. Classes/Interfaces/Types/Enums: `PascalCase`. Files/Folders: `dash-case` (e.g., `episode-service.ts`, `content-ingestion/`).
  * **Structure:** Feature-based (`src/features/feature-name/`).
  * **Tests:** Unit/integration tests co-located (`*.test.ts`). E2E tests (if any for backend API) in root `tests/e2e/`.
  * **Async:** `async`/`await` for Promises.
  * **Types:** `strict: true`. No `any` without justification. JSDoc for exported items. Inline comments for clarity.
  * **Dependencies:** `npm` with `package-lock.json`. Pin versions or use tilde (`~`).
  * **Detailed Conventions:** Immutability preferred. Functional constructs for stateless logic, classes for stateful services/entities. Custom errors. Strict null checks. ESModules. Pino for logging (structured JSON, levels, context, no secrets). Lambda best practices (lean handlers, env vars, optimize size). `axios` with timeouts. AWS SDK v3 modular imports. Avoid common anti-patterns (deep nesting, large functions, `@ts-ignore`, hardcoded secrets, unhandled promises).

## Overall Testing Strategy

  * **Tools:** Jest, React Testing Library (frontend), ESLint, Prettier, GitHub Actions.
  * **Unit Tests:** Isolate functions/methods/components. Mock dependencies. Co-located. Developer responsibility.
  * **Integration Tests (Backend/Frontend):** Test interactions between internal components with external systems mocked (AWS SDK clients, third-party APIs).
  * **End-to-End (E2E) Tests (MVP):**
      * Backend API: Automated test for "Hello World"/status. Test daily job trigger verifies DDB/S3 output.
      * Frontend UI: Key user flows tested manually for MVP. (Playwright deferred to post-MVP).
  * **Coverage:** Guideline \>80% unit test coverage for critical logic. Quality over quantity. Measured by Jest.
  * **Mocking:** Jest's built-in system. `axios-mock-adapter` if needed.
  * **Test Data:** Inline mocks or small fixtures for unit/integration.

## Error Handling Strategy

  * **General Approach:** Custom `Error` classes hierarchy. Promises reject with `Error` objects.
  * **Logging:** Pino for structured JSON logs to CloudWatch. Standard levels (DEBUG, INFO, WARN, ERROR, CRITICAL). Contextual info (AWS Request ID, business IDs). No sensitive data in logs.
  * **Specific Patterns:**
      * **External API Calls (`axios`):** Timeouts, retries (e.g., `axios-retry`), wrap errors in custom types.
      * **Internal Errors:** Custom error types, detailed server-side logging.
      * **API Gateway Responses:** Translate internal errors to appropriate HTTP errors (4xx, 500) with generic client messages.
      * **Workflow (Step Functions):** Error handling, retries, catch blocks for states. Failed executions logged.
      * **Data Consistency:** Lambdas handle partial failures gracefully. Step Functions manage overall workflow state.

## Security Best Practices

  * **Input Validation:** API Gateway basic validation; Zod for detailed payload validation in Lambdas.
  * **Output Encoding:** Next.js/React handles XSS for frontend rendering. Backend API is JSON.
  * **Secrets Management:** Lambda environment variables via CDK (from local gitignored `.env` for MVP setup). No hardcoding. Pino redaction for logs if needed.
  * **Dependency Security:** `npm audit` in CI. Promptly address high/critical vulnerabilities.
  * **Authentication/Authorization:** API Gateway API Keys (Frontend Read Key, Admin Action Key). IAM roles with least privilege for service-to-service.
  * **Principle of Least Privilege (IAM):** Minimal permissions for all IAM roles (Lambdas, Step Functions, CDK).
  * **API Security:** HTTPS enforced by API Gateway/CloudFront. Basic rate limiting on API Gateway. Frontend uses HTTP security headers (via CloudFront/Next.js).
  * **Error Disclosure:** Generic errors to client, detailed logs server-side.
  * **Infrastructure Security:** S3 bucket access restricted (CloudFront OAC/OAI).
  * **Post-MVP:** Consider SAST/DAST, penetration testing.
  * **Adherence:** AWS Well-Architected Framework - Security Pillar. 