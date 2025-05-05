# BMad Hacker Daily Digest Technology Stack

## Technology Choices

| Category              | Technology                     | Version / Details        | Description / Purpose                                                                                      | Justification (Optional)                           |
| :-------------------- | :----------------------------- | :----------------------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| **Languages**         | TypeScript                     | 5.x (from boilerplate)   | Primary language for application logic                                                                     | Required by boilerplate , strong typing            |
| **Runtime**           | Node.js                        | 22.x                     | Server-side execution environment                                                                          | Required by PRD                                    |
| **Frameworks**        | N/A                            | N/A                      | Using plain Node.js structure                                                                              | Boilerplate provides structure; framework overkill |
| **Databases**         | Local Filesystem               | N/A                      | Storing intermediate data artifacts                                                                        | Required by PRD ; No database needed for MVP       |
| **HTTP Client**       | Node.js `Workspace` API        | Native (Node.js >=21)    | **Mandatory:** Fetching external resources (Algolia, URLs, Ollama). **Do NOT use libraries like `axios`.** | Required by PRD                                    |
| **Configuration**     | `.env` Files                   | Native (Node.js >=20.6)  | Managing environment variables. **`dotenv` package is NOT needed.**                                        | Standard practice; Native support                  |
| **Logging**           | Simple Console Wrapper         | Custom (`src/logger.ts`) | Basic console logging for MVP (stdout/stderr)                                                              | Meets PRD "basic logging" req ; Minimal dependency |
| **Key Libraries**     | `@extractus/article-extractor` | ~8.x                     | Basic article text scraping                                                                                | Simple, focused library for MVP scraping           |
|                       | `date-fns`                     | ~3.x                     | Date formatting and manipulation                                                                           | Clean API for date-stamped dirs/timestamps         |
|                       | `nodemailer`                   | ~6.x                     | Sending email digests                                                                                      | Required by PRD                                    |
|                       | `yargs`                        | ~17.x                    | Parsing CLI args for stage runners                                                                         | Handles stage runner options like `--dry-run`      |
| **Testing**           | Jest                           | (from boilerplate)       | Unit/Integration testing framework                                                                         | Provided by boilerplate; standard                  |
| **Linting**           | ESLint                         | (from boilerplate)       | Code linting                                                                                               | Provided by boilerplate; ensures code quality      |
| **Formatting**        | Prettier                       | (from boilerplate)       | Code formatting                                                                                            | Provided by boilerplate; ensures consistency       |
| **External Services** | Algolia HN Search API          | N/A                      | Fetching HN stories and comments                                                                           | Required by PRD                                    |
|                       | Ollama API                     | N/A (local instance)     | Generating text summaries                                                                                  | Required by PRD                                    |

## Future Considerations (Post-MVP)

- **Logging:** Implement structured JSON logging to files (e.g., using Winston or Pino) for better analysis and persistence.
