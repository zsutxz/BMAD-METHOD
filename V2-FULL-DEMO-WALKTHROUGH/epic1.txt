# Epic 1: Project Initialization & Core Setup

**Goal:** Initialize the project using the "bmad-boilerplate", manage dependencies, setup `.env` and config loading, establish basic CLI entry point, setup basic logging and output directory structure. This provides the foundational setup for all subsequent development work.

## Story List

### Story 1.1: Initialize Project from Boilerplate

-   **User Story / Goal:** As a developer, I want to set up the initial project structure using the `bmad-boilerplate`, so that I have the standard tooling (TS, Jest, ESLint, Prettier), configurations, and scripts in place.
-   **Detailed Requirements:**
    -   Copy or clone the contents of the `bmad-boilerplate` into the new project's root directory.
    -   Initialize a git repository in the project root directory (if not already done by cloning).
    -   Ensure the `.gitignore` file from the boilerplate is present.
    -   Run `npm install` to download and install all `devDependencies` specified in the boilerplate's `package.json`.
    -   Verify that the core boilerplate scripts (`lint`, `format`, `test`, `build`) execute without errors on the initial codebase.
-   **Acceptance Criteria (ACs):**
    -   AC1: The project directory contains the files and structure from `bmad-boilerplate`.
    -   AC2: A `node_modules` directory exists and contains packages corresponding to `devDependencies`.
    -   AC3: `npm run lint` command completes successfully without reporting any linting errors.
    -   AC4: `npm run format` command completes successfully, potentially making formatting changes according to Prettier rules. Running it a second time should result in no changes.
    -   AC5: `npm run test` command executes Jest successfully (it may report "no tests found" which is acceptable at this stage).
    -   AC6: `npm run build` command executes successfully, creating a `dist` directory containing compiled JavaScript output.
    -   AC7: The `.gitignore` file exists and includes entries for `node_modules/`, `.env`, `dist/`, etc. as specified in the boilerplate.

---

### Story 1.2: Setup Environment Configuration

-   **User Story / Goal:** As a developer, I want to establish the environment configuration mechanism using `.env` files, so that secrets and settings (like output paths) can be managed outside of version control, following boilerplate conventions.
-   **Detailed Requirements:**
    -   Verify the `.env.example` file exists (from boilerplate).
    -   Add an initial configuration variable `OUTPUT_DIR_PATH=./output` to `.env.example`.
    -   Create the `.env` file locally by copying `.env.example`. Populate `OUTPUT_DIR_PATH` if needed (can keep default).
    -   Implement a utility module (e.g., `src/config.ts`) that loads environment variables from the `.env` file at application startup.
    -   The utility should export the loaded configuration values (initially just `OUTPUT_DIR_PATH`).
    -   Ensure the `.env` file is listed in `.gitignore` and is not committed.
-   **Acceptance Criteria (ACs):**
    -   AC1: Handle `.env` files with native node 22 support, no need for `dotenv`
    -   AC2: The `.env.example` file exists, is tracked by git, and contains the line `OUTPUT_DIR_PATH=./output`.
    -   AC3: The `.env` file exists locally but is NOT tracked by git.
    -   AC4: A configuration module (`src/config.ts` or similar) exists and successfully loads the `OUTPUT_DIR_PATH` value from `.env` when the application starts.
    -   AC5: The loaded `OUTPUT_DIR_PATH` value is accessible within the application code.

---

### Story 1.3: Implement Basic CLI Entry Point & Execution

-   **User Story / Goal:** As a developer, I want a basic `src/index.ts` entry point that can be executed via the boilerplate's `dev` and `start` scripts, providing a working foundation for the application logic.
-   **Detailed Requirements:**
    -   Create the main application entry point file at `src/index.ts`.
    -   Implement minimal code within `src/index.ts` to:
        -   Import the configuration loading mechanism (from Story 1.2).
        -   Log a simple startup message to the console (e.g., "BMad Hacker Daily Digest - Starting Up...").
        -   (Optional) Log the loaded `OUTPUT_DIR_PATH` to verify config loading.
    -   Confirm execution using boilerplate scripts.
-   **Acceptance Criteria (ACs):**
    -   AC1: The `src/index.ts` file exists.
    -   AC2: Running `npm run dev` executes `src/index.ts` via `ts-node` and logs the startup message to the console.
    -   AC3: Running `npm run build` successfully compiles `src/index.ts` (and any imports) into the `dist` directory.
    -   AC4: Running `npm start` (after a successful build) executes the compiled code from `dist` and logs the startup message to the console.

---

### Story 1.4: Setup Basic Logging and Output Directory

-   **User Story / Goal:** As a developer, I want a basic console logging mechanism and the dynamic creation of a date-stamped output directory, so that the application can provide execution feedback and prepare for storing data artifacts in subsequent epics.
-   **Detailed Requirements:**
    -   Implement a simple, reusable logging utility module (e.g., `src/logger.ts`). Initially, it can wrap `console.log`, `console.warn`, `console.error`.
    -   Refactor `src/index.ts` to use this `logger` for its startup message(s).
    -   In `src/index.ts` (or a setup function called by it):
        -   Retrieve the `OUTPUT_DIR_PATH` from the configuration (loaded in Story 1.2).
        -   Determine the current date in 'YYYY-MM-DD' format.
        -   Construct the full path for the date-stamped subdirectory (e.g., `${OUTPUT_DIR_PATH}/YYYY-MM-DD`).
        -   Check if the base output directory exists; if not, create it.
        -   Check if the date-stamped subdirectory exists; if not, create it recursively. Use Node.js `fs` module (e.g., `fs.mkdirSync(path, { recursive: true })`).
        -   Log (using the logger) the full path of the output directory being used for the current run (e.g., "Output directory for this run: ./output/2025-05-04").
-   **Acceptance Criteria (ACs):**
    -   AC1: A logger utility module (`src/logger.ts` or similar) exists and is used for console output in `src/index.ts`.
    -   AC2: Running `npm run dev` or `npm start` logs the startup message via the logger.
    -   AC3: Running the application creates the base output directory (e.g., `./output` defined in `.env`) if it doesn't already exist.
    -   AC4: Running the application creates a date-stamped subdirectory (e.g., `./output/2025-05-04`) within the base output directory if it doesn't already exist.
    -   AC5: The application logs a message indicating the full path to the date-stamped output directory created/used for the current execution.
    -   AC6: The application exits gracefully after performing these setup steps (for now).

## Change Log

| Change        | Date       | Version | Description               | Author         |
| ------------- | ---------- | ------- | ------------------------- | -------------- |
| Initial Draft | 2025-05-04 | 0.1     | First draft of Epic 1     | 2-pm           |