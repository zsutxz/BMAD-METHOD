# Project Brief: BMad Hacker Daily Digest

## Introduction / Problem Statement

Hacker News (HN) comment threads contain valuable insights but can be prohibitively long to read thoroughly. The BMad Hacker Daily Digest project aims to solve this by providing a time-efficient way to stay informed about the collective intelligence within HN discussions. The service will automatically fetch the top 10 HN stories daily, retrieve a manageable subset of their comments using the Algolia HN API, generate concise summaries of both the linked article (when possible) and the comment discussion using an LLM, and deliver these summaries in a daily email briefing. This project also serves as a practical learning exercise focused on agent-driven development, TypeScript, Node.js backend services, API integration, and local LLM usage with Ollama.

## Vision & Goals

- **Vision:** To provide a quick, reliable, and automated way for users to stay informed about the key insights and discussions happening within the Hacker News community without needing to read lengthy comment threads.
- **Primary Goals (MVP - SMART):**
  - **Fetch HN Story Data:** Successfully retrieve the IDs and metadata (title, URL, HN link) of the top 10 Hacker News stories using the Algolia HN Search API when triggered.
  - **Retrieve Limited Comments:** For each fetched story, retrieve a predefined, limited set of associated comments using the Algolia HN Search API.
  - **Attempt Article Scraping:** For each story's external URL, attempt to fetch the raw HTML and extract the main article text using basic methods (Node.js native fetch, article-extractor/Cheerio), handling failures gracefully.
  - **Generate Summaries (LLM):** Using a local LLM (via Ollama, configured endpoint), generate: an "Article Summary" from scraped text (if successful), and a separate "Discussion Summary" from fetched comments.
  - **Assemble & Send Digest (Manual Trigger):** Format results for 10 stories into a single HTML email and successfully send it to recipients (list defined in config) using Nodemailer when manually triggered via CLI.
- **Success Metrics (Initial Ideas for MVP):**
  - **Successful Execution:** The entire process completes successfully without crashing when manually triggered via CLI for 3 different test runs.
  - **Digest Content:** The generated email contains results for 10 stories (correct links, discussion summary, article summary where possible). Spot checks confirm relevance.
  - **Error Handling:** Scraping failures are logged, and the process continues using only comment summaries for affected stories without halting the script.

## Target Audience / Users

**Primary User (MVP):** The developer undertaking this project. The primary motivation is learning and demonstrating agent-driven development, TypeScript, Node.js (v22), API integration (Algolia, LLM, Email), local LLMs (Ollama), and configuration management ( .env ). The key need is an interesting, achievable project scope utilizing these technologies.

**Secondary User (Potential):** Time-constrained HN readers/tech enthusiasts needing automated discussion summaries. Addressing their needs fully is outside MVP scope but informs potential future direction.

## Key Features / Scope (High-Level Ideas for MVP)

- Fetch Top HN Stories (Algolia API).
- Fetch Limited Comments (Algolia API).
- Local File Storage (Date-stamped folder, structured text/JSON files).
- Attempt Basic Article Scraping (Node.js v22 native fetch, basic extraction).
- Handle Scraping Failures (Log error, proceed with comment-only summary).
- Generate Summaries (Local Ollama via configured endpoint: Article Summary if scraped, Discussion Summary always).
- Format Digest Email (HTML: Article Summary (opt.), Discussion Summary, HN link, Article link).
- Manual Email Dispatch (Nodemailer, credentials from .env , recipient list from .env ).
- CLI Trigger (Manual command to run full process).

**Explicitly OUT of Scope for MVP:** Advanced scraping (JS render, anti-bot), processing _all_ comments/MapReduce summaries, automated scheduling (cron), database integration, cloud deployment/web frontend, user management (sign-ups etc.), production-grade error handling/monitoring/deliverability, fine-tuning LLM prompts, sophisticated retry logic.

## Known Technical Constraints or Preferences

- **Constraints/Preferences:**

  - **Language/Runtime:** TypeScript running on Node.js v22.
  - **Execution Environment:** Local machine execution for MVP.
  - **Trigger Mechanism:** Manual CLI trigger only for MVP.
  - **Configuration Management:** Use a `.env` file for configuration: LLM endpoint URL, email credentials, recipient email list, potentially comment fetch limits etc.
  - **HTTP Requests:** Use Node.js v22 native fetch API (no Axios).
  - **HN Data Source:** Algolia HN Search API.
  - **Web Scraping:** Basic, best-effort only (native fetch + static HTML extraction). Must handle failures gracefully.
  - **LLM Integration:** Local Ollama via configurable endpoint for MVP. Design for potential swap to cloud LLMs. Functionality over quality for MVP.
  - **Summarization Strategy:** Separate Article/Discussion summaries. Limit comments processed per story (configurable). No MapReduce.
  - **Data Storage:** Local file system (structured text/JSON in date-stamped folders). No database.
  - **Email Delivery:** Nodemailer. Read credentials and recipient list from `.env`. Basic setup, no production deliverability focus.
  - **Primary Goal Context:** Focus on functional pipeline for learning/demonstration.

- **Risks:**
  - Algolia HN API Issues: Changes, rate limits, availability.
  - Web Scraping Fragility: High likelihood of failure limiting Article Summaries.
  - LLM Variability & Quality: Inconsistent performance/quality from local Ollama; potential errors.
    *Incomplete Discussion Capture: Limited comment fetching may miss key insights.
    *Email Configuration/Deliverability: Fragility of personal credentials; potential spam filtering.
    *Manual Trigger Dependency: Digest only generated on manual execution.
    *Configuration Errors: Incorrect `.env` settings could break the application.
    _(User Note: Risks acknowledged and accepted given the project's learning goals.)_

## Relevant Research (Optional)

Feasibility: Core concept confirmed technically feasible with available APIs/libraries.
Existing Tools & Market Context: Similar tools exist (validating interest), but daily email format appears distinct.
API Selection: Algolia HN Search API chosen for filtering/sorting capabilities.
Identified Technical Challenges: Confirmed complexities of scraping and handling large comment volumes within LLM limits, informing MVP scope.
Local LLM Viability: Ollama confirmed as viable for local MVP development/testing, with potential for future swapping.

## PM Prompt

**PM Agent Handoff Prompt: BMad Hacker Daily Digest**

**Summary of Key Insights:**

This Project Brief outlines the "BMad Hacker Daily Digest," a command-line tool designed to provide daily email summaries of discussions from top Hacker News (HN) comment threads. The core problem is the time required to read lengthy but valuable HN discussions. The MVP aims to fetch the top 10 HN stories, retrieve a limited set of comments via the Algolia HN API, attempt basic scraping of linked articles (with fallback), generate separate summaries for articles (if scraped) and comments using a local LLM (Ollama), and email the digest to the developer using Nodemailer. This project primarily serves as a learning exercise and demonstration of agent-driven development in TypeScript.

**Areas Requiring Special Attention (for PRD):**

- **Comment Selection Logic:** Define the specific criteria for selecting the "limited set" of comments from Algolia (e.g., number of comments, recency, token count limit).
- **Basic Scraping Implementation:** Detail the exact steps for the basic article scraping attempt (libraries like Node.js native fetch, article-extractor/Cheerio), including specific error handling and the fallback mechanism.
- **LLM Prompting:** Define the precise prompts for generating the "Article Summary" and the "Discussion Summary" separately.
- **Email Formatting:** Specify the exact structure, layout, and content presentation within the daily HTML email digest.
- **CLI Interface:** Define the specific command(s), arguments, and expected output/feedback for the manual trigger.
- **Local File Structure:** Define the structure for storing intermediate data and logs in local text files within date-stamped folders.

**Development Context:**

This brief was developed through iterative discussion, starting from general app ideas and refining scope based on user interest (HN discussions) and technical feasibility for a learning/demo project. Key decisions include prioritizing comment summarization, using the Algolia HN API, starting with local execution (Ollama, Nodemailer), and including only a basic, best-effort scraping attempt in the MVP.

**Guidance on PRD Detail:**

- Focus detailed requirements and user stories on the core data pipeline: HN API Fetch -> Comment Selection -> Basic Scrape Attempt -> LLM Summarization (x2) -> Email Formatting/Sending -> CLI Trigger.
- Keep potential post-MVP enhancements (cloud deployment, frontend, database, advanced scraping, scheduling) as high-level future considerations.
- Technical implementation details for API/LLM interaction should allow flexibility for potential future swapping (e.g., Ollama to cloud LLM).

**User Preferences:**

- Execution: Manual CLI trigger for MVP.
- Data Storage: Local text files for MVP.
- LLM: Ollama for local development/MVP. Ability to potentially switch to cloud API later.
- Summaries: Generate separate summaries for article (if available) and comments.
- API: Use Algolia HN Search API.
- Email: Use Nodemailer for self-send in MVP.
- Tech Stack: TypeScript, Node.js v22.
