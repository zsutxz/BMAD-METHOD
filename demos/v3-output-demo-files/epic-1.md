# Epic 1: Backend Foundation, Tooling & "Hello World" API

**Goal:** To establish the core backend project infrastructure in its dedicated repository, including robust development tooling and initial AWS CDK setup for essential services. By the end of this epic:
1.  A simple "hello world" API endpoint (AWS API Gateway + Lambda) **must** be deployed and testable via `curl`, returning a dynamic message.
2.  The backend project **must** have ESLint, Prettier, Jest (unit testing), and esbuild (TypeScript bundling) configured and operational.
3.  Basic unit tests **must** exist for the "hello world" Lambda function.
4.  Code formatting and linting checks **should** be integrated into a pre-commit hook and/or a basic CI pipeline stub.

## User Stories

**Story 1.1: Initialize Backend Project using TS-TEMPLATE-STARTER**
* **User Story Statement:** As a Developer, I want to create the `bmad-daily-digest-backend` Git repository and initialize it using the existing `TS-TEMPLATE-STARTER`, ensuring all foundational tooling (TypeScript, Node.js 22, ESLint, Prettier, Jest, esbuild) is correctly configured and operational for this specific project, so that I have a high-quality, standardized development environment ready for application logic.
* **Acceptance Criteria (ACs):**
    1.  A new, private Git repository named `bmad-daily-digest-backend` **must** be created on GitHub.
    2.  The contents of the `TS-TEMPLATE-STARTER` project **must** be copied/cloned into this new repository.
    3.  `package.json` **must** be updated (project name, version, description).
    4.  Project dependencies **must** be installable.
    5.  TypeScript setup (`tsconfig.json`) **must** be verified for Node.js 22, esbuild compatibility; project **must** compile.
    6.  ESLint and Prettier configurations **must** be operational; lint/format scripts **must** execute successfully.
    7.  Jest configuration **must** be operational; test scripts **must** execute successfully with any starter example tests.
    8.  Irrelevant generic demo code from starter **should** be removed. `index.ts`/`index.test.ts` can remain as placeholders.
    9.  A standard `.gitignore` and an updated project `README.md` **must** be present.

**Story 1.2: Pre-commit Hook Implementation**
* **User Story Statement:** As a Developer, I want pre-commit hooks automatically enforced in the `bmad-daily-digest-backend` repository, so that code quality standards (like linting and formatting) are checked and applied to staged files before any code is committed, thereby maintaining codebase consistency and reducing trivial errors.
* **Acceptance Criteria (ACs):**
    1.  A pre-commit hook tool (e.g., Husky) **must** be installed and configured.
    2.  A tool for running linters/formatters on staged files (e.g., `lint-staged`) **must** be installed and configured.
    3.  Pre-commit hook **must** trigger `lint-staged` on staged `.ts` files.
    4.  `lint-staged` **must** be configured to run ESLint (`--fix`) and Prettier (`--write`).
    5.  Attempting to commit files with auto-fixable issues **must** result in fixes applied and successful commit.
    6.  Attempting to commit files with non-auto-fixable linting errors **must** abort the commit with error messages.
    7.  Committing clean files **must** proceed without issues.

**Story 1.3: "Hello World" Lambda Function Implementation & Unit Tests**
* **User Story Statement:** As a Developer, I need a simple "Hello World" AWS Lambda function implemented in TypeScript within the `bmad-daily-digest-backend` project. This function, when invoked, should return a dynamic greeting message including the current date and time, and it must be accompanied by comprehensive Jest unit tests, so that our basic serverless compute functionality, testing setup, and TypeScript bundling are validated.
* **Acceptance Criteria (ACs):**
    1.  A `src/features/publicApi/statusHandler.ts` file (or similar according to final backend structure) **must** contain the Lambda handler.
    2.  Handler **must** be AWS Lambda compatible (event, context, Promise response).
    3.  Successful execution **must** return JSON: `statusCode: 200`, body with `message: "Hello from BMad Daily Digest Backend, today is [current_date] at [current_time]."`.
    4.  Date and time in message **must** be dynamic.
    5.  A corresponding Jest unit test file (e.g., `src/features/publicApi/statusHandler.test.ts`) **must** be created.
    6.  Unit tests **must** verify: 200 status, valid JSON body, expected `message` field, "Hello from..." prefix, dynamic date/time portion (use mocked `Date`).
    7.  All unit tests **must** pass.
    8.  esbuild configuration **must** correctly bundle the handler.

**Story 1.4: AWS CDK Setup for "Hello World" API (Lambda & API Gateway)**
* **User Story Statement:** As a Developer, I want to define the necessary AWS infrastructure (Lambda function and API Gateway endpoint) for the "Hello World" service using AWS CDK (Cloud Development Kit) in TypeScript, so that the infrastructure is version-controlled, repeatable, and can be deployed programmatically.
* **Acceptance Criteria (ACs):**
    1.  AWS CDK (v2) **must** be a development dependency.
    2.  CDK app structure **must** be initialized (e.g., in `cdk/`).
    3.  A new CDK stack (e.g., `BmadDailyDigestBackendStack`) **must** be defined in TypeScript.
    4.  CDK stack **must** define an AWS Lambda resource for the "Hello World" function (Node.js 22, bundled code reference, handler entry point, basic IAM role for CloudWatch logs, free-tier conscious settings).
    5.  CDK stack **must** define an AWS API Gateway (HTTP API preferred) with a route (e.g., `GET /status` or `GET /hello`) triggering the Lambda, secured with the "Frontend Read API Key".
    6.  CDK stack **must** be synthesizable (`cdk synth`) without errors.
    7.  CDK code **must** adhere to project ESLint/Prettier standards.
    8.  Mechanism for passing Lambda environment variables via CDK **must** be in place.

**Story 1.5: "Hello World" API Deployment & Manual Invocation Test**
* **User Story Statement:** As a Developer, I need to deploy the "Hello World" API (defined in AWS CDK) to an AWS environment and successfully invoke its endpoint using a tool like `curl` (including the API Key), so that I can verify the end-to-end deployment process and confirm the basic API is operational in the cloud.
* **Acceptance Criteria (ACs):**
    1.  The AWS CDK stack for "Hello World" API **must** deploy successfully to a designated AWS account/region.
    2.  The API Gateway endpoint URL for the `/status` (or `/hello`) route **must** be retrievable post-deployment.
    3.  A `GET` request to the deployed endpoint, including the correct `x-api-key` header, **must** receive a response.
    4.  HTTP response status **must** be 200 OK.
    5.  Response body **must** be JSON containing the expected dynamic "Hello..." message.
    6.  Basic Lambda invocation logs **must** be visible in AWS CloudWatch Logs.

**Story 1.6: Basic CI/CD Pipeline Stub with Quality Gates**
* **User Story Statement:** As a Developer, I need a basic Continuous Integration (CI) pipeline established for the `bmad-daily-digest-backend` repository, so that code quality checks (linting, formatting, unit tests) and the build process are automated upon code pushes and pull requests, ensuring early feedback and maintaining codebase health.
* **Acceptance Criteria (ACs):**
    1.  A CI workflow file (e.g., GitHub Actions in `.github/workflows/main.yml`) **must** be created.
    2.  Pipeline **must** trigger on pushes to `main` and PRs targeting `main`.
    3.  Pipeline **must** include steps for: checkout, Node.js 22 setup, dependency install, ESLint check, Prettier format check, Jest unit tests, esbuild bundle.
    4.  Pipeline **must** fail if any lint, format, test, or bundle step fails.
    5.  A successful CI run on the `main` branch **must** be demonstrated.
    6.  CI pipeline for MVP **does not** need to perform AWS deployment. 