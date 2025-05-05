# BMad Hacker Daily Digest Environment Variables

## Configuration Loading Mechanism

Environment variables for this project are managed using a standard `.env` file in the project root. The application leverages the native support for `.env` files built into Node.js (v20.6.0 and later) , meaning **no external `dotenv` package is required**.

Variables defined in the `.env` file are automatically loaded into `process.env` when the Node.js application starts. Accessing and potentially validating these variables should be centralized, ideally within the `src/utils/config.ts` module .

## Required Variables

The following table lists the environment variables used by the application. An `.env.example` file should be maintained in the repository with these variables set to placeholder or default values .

| Variable Name                   | Description                                                       | Example / Default Value                  | Required? | Sensitive? | Source        |
| :------------------------------ | :---------------------------------------------------------------- | :--------------------------------------- | :-------- | :--------- | :------------ |
| `OUTPUT_DIR_PATH`               | Filesystem path for storing output data artifacts                 | `./output`                               | Yes       | No         | Epic 1        |
| `MAX_COMMENTS_PER_STORY`        | Maximum number of comments to fetch per HN story                  | `50`                                     | Yes       | No         | PRD           |
| `OLLAMA_ENDPOINT_URL`           | Base URL for the local Ollama API instance                        | `http://localhost:11434`                 | Yes       | No         | Epic 4        |
| `OLLAMA_MODEL`                  | Name of the Ollama model to use for summarization                 | `llama3`                                 | Yes       | No         | Epic 4        |
| `EMAIL_HOST`                    | SMTP server hostname for sending email                            | `smtp.example.com`                       | Yes       | No         | Epic 5        |
| `EMAIL_PORT`                    | SMTP server port                                                  | `587`                                    | Yes       | No         | Epic 5        |
| `EMAIL_SECURE`                  | Use TLS/SSL (`true` for port 465, `false` for 587/STARTTLS)       | `false`                                  | Yes       | No         | Epic 5        |
| `EMAIL_USER`                    | Username for SMTP authentication                                  | `user@example.com`                       | Yes       | **Yes**    | Epic 5        |
| `EMAIL_PASS`                    | Password for SMTP authentication                                  | `your_smtp_password`                     | Yes       | **Yes**    | Epic 5        |
| `EMAIL_FROM`                    | Sender email address (may need specific format)                   | `"BMad Digest <digest@example.com>"`     | Yes       | No         | Epic 5        |
| `EMAIL_RECIPIENTS`              | Comma-separated list of recipient email addresses                 | `recipient1@example.com,r2@test.org`     | Yes       | No         | Epic 5        |
| `NODE_ENV`                      | Runtime environment (influences some library behavior)            | `development`                            | No        | No         | Standard Node |
| `SCRAPE_TIMEOUT_MS`             | _Optional:_ Timeout in milliseconds for article scraping requests | `15000` (15s)                            | No        | No         | Good Practice |
| `OLLAMA_TIMEOUT_MS`             | _Optional:_ Timeout in milliseconds for Ollama API requests       | `120000` (2min)                          | No        | No         | Good Practice |
| `LOG_LEVEL`                     | _Optional:_ Control log verbosity (e.g., debug, info)             | `info`                                   | No        | No         | Good Practice |
| `MAX_COMMENT_CHARS_FOR_SUMMARY` | _Optional:_ Max chars of combined comments sent to LLM            | 10000 / null (uses all if not set)       | No        | No         | Arch Decision |
| `SCRAPER_USER_AGENT`            | _Optional:_ Custom User-Agent header for scraping requests        | "BMadHackerDigest/0.1" (Default in code) | No        | No         | Arch Decision |

## Notes

- **Secrets Management:** Sensitive variables (`EMAIL_USER`, `EMAIL_PASS`) must **never** be committed to version control. The `.env` file should be included in `.gitignore` (as per boilerplate ).
- **`.env.example`:** Maintain an `.env.example` file in the repository mirroring the variables above, using placeholders or default values for documentation and local setup .
- **Validation:** It is recommended to implement validation logic in `src/utils/config.ts` to ensure required variables are present and potentially check their format on application startup .

## Change Log

| Change        | Date       | Version | Description                           | Author      |
| ------------- | ---------- | ------- | ------------------------------------- | ----------- |
| Initial draft | 2025-05-04 | 0.1     | Draft based on PRD/Epics requirements | 3-Architect |
