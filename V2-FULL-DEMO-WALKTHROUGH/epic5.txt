# Epic 5: Digest Assembly & Email Dispatch

**Goal:** Assemble the collected story data and summaries from local files, format them into a readable HTML email digest, and send the email using Nodemailer with configured credentials. Implement a stage testing utility for emailing with a dry-run option.

## Story List

### Story 5.1: Implement Email Content Assembler

-   **User Story / Goal:** As a developer, I want a module that reads the persisted story metadata (`_data.json`) and summaries (`_summary.json`) from a specified directory, consolidating the necessary information needed to render the email digest.
-   **Detailed Requirements:**
    -   Create a new module: `src/email/contentAssembler.ts`.
    -   Define a TypeScript type/interface `DigestData` representing the data needed per story for the email template: `{ storyId: string, title: string, hnUrl: string, articleUrl: string | null, articleSummary: string | null, discussionSummary: string | null }`.
    -   Implement an async function `assembleDigestData(dateDirPath: string): Promise<DigestData[]>`.
    -   The function should:
        -   Use Node.js `fs` to read the contents of the `dateDirPath`.
        -   Identify all files matching the pattern `{storyId}_data.json`.
        -   For each `storyId` found:
            -   Read and parse the `{storyId}_data.json` file. Extract `title`, `hnUrl`, and `url` (use as `articleUrl`). Handle potential file read/parse errors gracefully (log and skip story).
            -   Attempt to read and parse the corresponding `{storyId}_summary.json` file. Handle file-not-found or parse errors gracefully (treat `articleSummary` and `discussionSummary` as `null`).
            -   Construct a `DigestData` object for the story, including the extracted metadata and summaries (or nulls).
        -   Collect all successfully constructed `DigestData` objects into an array.
        -   Return the array. It should ideally contain 10 items if all previous stages succeeded.
    -   Log progress (e.g., "Assembling digest data from directory...", "Processing story {storyId}...") and any errors encountered during file processing using the logger.
-   **Acceptance Criteria (ACs):**
    -   AC1: The `contentAssembler.ts` module exists and exports `assembleDigestData` and the `DigestData` type.
    -   AC2: `assembleDigestData` correctly reads `_data.json` files from the provided directory path.
    -   AC3: It attempts to read corresponding `_summary.json` files, correctly handling cases where the summary file might be missing or unparseable (resulting in null summaries for that story).
    -   AC4: The function returns a promise resolving to an array of `DigestData` objects, populated with data extracted from the files.
    -   AC5: Errors during file reading or JSON parsing are logged, and the function returns data for successfully processed stories.

---

### Story 5.2: Create HTML Email Template & Renderer

-   **User Story / Goal:** As a developer, I want a basic HTML email template and a function to render it with the assembled digest data, producing the final HTML content for the email body.
-   **Detailed Requirements:**
    -   Define the HTML structure. This can be done using template literals within a function or potentially using a simple template file (e.g., `src/email/templates/digestTemplate.html`) and `fs.readFileSync`. Template literals are simpler for MVP.
    -   Create a function `renderDigestHtml(data: DigestData[], digestDate: string): string` (e.g., in `src/email/contentAssembler.ts` or a new `templater.ts`).
    -   The function should generate an HTML string with:
        -   A suitable title in the body (e.g., `<h1>Hacker News Top 10 Summaries for ${digestDate}</h1>`).
        -   A loop through the `data` array.
        -   For each `story` in `data`:
            -   Display `<h2><a href="${story.articleUrl || story.hnUrl}">${story.title}</a></h2>`.
            -   Display `<p><a href="${story.hnUrl}">View HN Discussion</a></p>`.
            -   Conditionally display `<h3>Article Summary</h3><p>${story.articleSummary}</p>` *only if* `story.articleSummary` is not null/empty.
            -   Conditionally display `<h3>Discussion Summary</h3><p>${story.discussionSummary}</p>` *only if* `story.discussionSummary` is not null/empty.
            -   Include a separator (e.g., `<hr style="margin-top: 20px; margin-bottom: 20px;">`).
    -   Use basic inline CSS for minimal styling (margins, etc.) to ensure readability. Avoid complex layouts.
    -   Return the complete HTML document as a string.
-   **Acceptance Criteria (ACs):**
    -   AC1: A function `renderDigestHtml` exists that accepts the digest data array and a date string.
    -   AC2: The function returns a single, complete HTML string.
    -   AC3: The generated HTML includes a title with the date and correctly iterates through the story data.
    -   AC4: For each story, the HTML displays the linked title, HN link, and conditionally displays the article and discussion summaries with headings.
    -   AC5: Basic separators and margins are used for readability. The HTML is simple and likely to render reasonably in most email clients.

---

### Story 5.3: Implement Nodemailer Email Sender

-   **User Story / Goal:** As a developer, I want a module to send the generated HTML email using Nodemailer, configured with credentials stored securely in the environment file.
-   **Detailed Requirements:**
    -   Add Nodemailer dependencies: `npm install nodemailer @types/nodemailer --save-prod`.
    -   Add required configuration variables to `.env.example` (and local `.env`): `EMAIL_HOST`, `EMAIL_PORT` (e.g., 587), `EMAIL_SECURE` (e.g., `false` for STARTTLS on 587, `true` for 465), `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` (e.g., `"Your Name <you@example.com>"`), `EMAIL_RECIPIENTS` (comma-separated list).
    -   Create a new module: `src/email/emailSender.ts`.
    -   Implement an async function `sendDigestEmail(subject: string, htmlContent: string): Promise<boolean>`.
    -   Inside the function:
        -   Load the `EMAIL_*` variables from the config module.
        -   Create a Nodemailer transporter using `nodemailer.createTransport` with the loaded config (host, port, secure flag, auth: { user, pass }).
        -   Verify transporter configuration using `transporter.verify()` (optional but recommended). Log verification success/failure.
        -   Parse the `EMAIL_RECIPIENTS` string into an array or comma-separated string suitable for the `to` field.
        -   Define the `mailOptions`: `{ from: EMAIL_FROM, to: parsedRecipients, subject: subject, html: htmlContent }`.
        -   Call `await transporter.sendMail(mailOptions)`.
        -   If `sendMail` succeeds, log the success message including the `messageId` from the result. Return `true`.
        -   If `sendMail` fails (throws error), log the error using the logger. Return `false`.
-   **Acceptance Criteria (ACs):**
    -   AC1: `nodemailer` and `@types/nodemailer` dependencies are added.
    -   AC2: `EMAIL_*` variables are defined in `.env.example` and loaded from config.
    -   AC3: `emailSender.ts` module exists and exports `sendDigestEmail`.
    -   AC4: `sendDigestEmail` correctly creates a Nodemailer transporter using configuration from `.env`. Transporter verification is attempted (optional AC).
    -   AC5: The `to` field is correctly populated based on `EMAIL_RECIPIENTS`.
    -   AC6: `transporter.sendMail` is called with correct `from`, `to`, `subject`, and `html` options.
    -   AC7: Email sending success (including message ID) or failure is logged clearly.
    -   AC8: The function returns `true` on successful sending, `false` otherwise.

---

### Story 5.4: Integrate Email Assembly and Sending into Main Workflow

-   **User Story / Goal:** As a developer, I want the main application workflow (`src/index.ts`) to orchestrate the final steps: assembling digest data, rendering the HTML, and triggering the email send after all previous stages are complete.
-   **Detailed Requirements:**
    -   Modify the main execution flow in `src/index.ts`.
    -   Import `assembleDigestData`, `renderDigestHtml`, `sendDigestEmail`.
    -   Execute these steps *after* the main loop (where stories are fetched, scraped, summarized, and persisted) completes:
        -   Log "Starting final digest assembly and email dispatch...".
        -   Determine the path to the current date-stamped output directory.
        -   Call `const digestData = await assembleDigestData(dateDirPath)`.
        -   Check if `digestData` array is not empty.
            -   If yes:
                -   Get the current date string (e.g., 'YYYY-MM-DD').
                -   `const htmlContent = renderDigestHtml(digestData, currentDate)`.
                -   `const subject = \`BMad Hacker Daily Digest - ${currentDate}\``.
                -   `const emailSent = await sendDigestEmail(subject, htmlContent)`.
                -   Log the final outcome based on `emailSent` ("Digest email sent successfully." or "Failed to send digest email.").
            -   If no (`digestData` is empty or assembly failed):
                -   Log an error: "Failed to assemble digest data or no data found. Skipping email."
        -   Log "BMad Hacker Daily Digest process finished."
-   **Acceptance Criteria (ACs):**
    -   AC1: Running `npm run dev` executes all stages (Epics 1-4) and then proceeds to email assembly and sending.
    -   AC2: `assembleDigestData` is called correctly with the output directory path after other processing is done.
    -   AC3: If data is assembled, `renderDigestHtml` and `sendDigestEmail` are called with the correct data, subject, and HTML.
    -   AC4: The final success or failure of the email sending step is logged.
    -   AC5: If `assembleDigestData` returns no data, email sending is skipped, and an appropriate message is logged.
    -   AC6: The application logs a final completion message.

---

### Story 5.5: Implement Stage Testing Utility for Emailing

-   **User Story / Goal:** As a developer, I want a separate script/command to test the email assembly, rendering, and sending logic using persisted local data, including a crucial `--dry-run` option to prevent accidental email sending during tests.
-   **Detailed Requirements:**
    -   Add `yargs` dependency for argument parsing: `npm install yargs @types/yargs --save-dev`.
    -   Create a new standalone script file: `src/stages/send_digest.ts`.
    -   Import necessary modules: `fs`, `path`, `logger`, `config`, `assembleDigestData`, `renderDigestHtml`, `sendDigestEmail`, `yargs`.
    -   Use `yargs` to parse command-line arguments, specifically looking for a `--dry-run` boolean flag (defaulting to `false`). Allow an optional argument for specifying the date-stamped directory, otherwise default to current date.
    -   The script should:
        -   Initialize logger, load config.
        -   Determine the target date-stamped directory path (from arg or default). Log the target directory.
        -   Call `await assembleDigestData(dateDirPath)`.
        -   If data is assembled and not empty:
            -   Determine the date string for the subject/title.
            -   Call `renderDigestHtml(digestData, dateString)` to get HTML.
            -   Construct the subject string.
            -   Check the `dryRun` flag:
                -   If `true`: Log "DRY RUN enabled. Skipping actual email send.". Log the subject. Save the `htmlContent` to a file in the target directory (e.g., `_digest_preview.html`). Log that the preview file was saved.
                -   If `false`: Log "Live run: Attempting to send email...". Call `await sendDigestEmail(subject, htmlContent)`. Log success/failure based on the return value.
        -   If data assembly fails or is empty, log the error.
    -   Add script to `package.json`: `"stage:email": "ts-node src/stages/send_digest.ts --"`. The `--` allows passing arguments like `--dry-run`.
-   **Acceptance Criteria (ACs):**
    -   AC1: The file `src/stages/send_digest.ts` exists. `yargs` dependency is added.
    -   AC2: The script `stage:email` is defined in `package.json` allowing arguments.
    -   AC3: Running `npm run stage:email -- --dry-run` reads local data, renders HTML, logs the intent, saves `_digest_preview.html` locally, and does *not* call `sendDigestEmail`.
    -   AC4: Running `npm run stage:email` (without `--dry-run`) reads local data, renders HTML, and *does* call `sendDigestEmail`, logging the outcome.
    -   AC5: The script correctly identifies and acts upon the `--dry-run` flag.
    -   AC6: Logs clearly distinguish between dry runs and live runs and report success/failure.
    -   AC7: The script operates using only local files and the email configuration/service; it does not invoke prior pipeline stages (Algolia, scraping, Ollama).

## Change Log

| Change        | Date       | Version | Description               | Author         |
| ------------- | ---------- | ------- | ------------------------- | -------------- |
| Initial Draft | 2025-05-04 | 0.1     | First draft of Epic 5     | 2-pm           |