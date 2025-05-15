# BMad DiCaster Product Requirements Document (PRD)

## Goal, Objective and Context

**Goal:** To develop a web application that provides a daily, concise summary of top Hacker News (HN) posts, delivered as a newsletter and accessible via a web interface. [cite: 1, 2, 3, 4, 5, 6, 7, 8]

**Objective:** To streamline the consumption of HN content by curating the top stories, providing AI-powered summaries, and offering an optional AI-generated podcast version. [cite: 1, 2, 3, 4, 5, 6, 7, 8]

**Context:** Busy professionals and enthusiasts want to stay updated on HN but lack the time to sift through numerous posts and discussions. [cite: 17, 18, 19, 20, 21, 22, 67] This application will address this problem by automating the delivery of summarized content. [cite: 2, 3, 9, 10, 11, 12, 13, 14, 15, 16]

## Functional Requirements (MVP)

- **HN Content Retrieval & Storage:**
  - Daily retrieval of the top 30 Hacker News posts and associated comments using the HN Algolia API. [cite: 20, 21, 22]
  - Scraping and storage of up to 10 linked articles per day. [cite: 20, 21, 22]
  - Storage of all retrieved data (posts, comments, articles) with date association. [cite: 20, 21, 22]
- **AI-Powered Summarization:**
  - AI-powered summarization of the 10 selected articles (2-paragraph summaries). [cite: 23, 24, 25]
  - AI-powered summarization of comments for the 10 selected posts (2-paragraph summaries highlighting interesting interactions). [cite: 23, 24, 25]
  - Configuration for local or remote LLM usage via environment variables. [cite: 25, 26, 27, 28, 29, 30, 31, 32, 33]
- **Newsletter Generation & Delivery:**
  - Generation of a daily newsletter in HTML format, including summaries, links to HN posts and articles, and original post dates/times. [cite: 25, 26, 27, 28, 29, 30, 31, 32, 33]
  - Automated delivery of the newsletter to a manually configured list of subscribers in Supabase. [cite: 25, 26, 27, 28, 29, 30, 31, 32, 33] The list of emails will be manually populated in the database. Account information for the Nodemailer service will be provided via environment variables.
- **Podcast Generation & Integration:**
  - Integration with Play.ht's PlayNote API for AI-generated podcast creation from the newsletter content. [cite: 28, 29, 30, 31, 32, 33]
  - Webhook handler to update the newsletter with the generated podcast link. [cite: 28, 29, 30, 31, 32, 33]
- **Web Interface (MVP):**
  - Display of current and past newsletters. [cite: 30, 31, 32, 33]
  - Functionality to read the newsletter content within the web page. [cite: 30, 31, 32, 33]
  - Download option for newsletters. [cite: 30, 31, 32, 33]
  - Web player for listening to generated podcasts. [cite: 30, 31, 32, 33]
  - Basic mobile responsiveness for displaying newsletters and podcasts.
- **API & Triggering:**
  - Secure API endpoint to manually trigger the daily workflow, secured with API keys. [cite: 32, 33]
  - CLI command to manually trigger the daily workflow locally. [cite: 32, 33]

## Non-Functional Requirements (MVP)

- **Performance:**
  - The system should retrieve HN posts and generate the newsletter within a reasonable timeframe (e.g., under 30 minutes) to ensure timely delivery.
  - The web interface should load quickly (e.g., within 2 seconds) to provide a smooth user experience.
- **Scalability:**
  - The system is designed for an initial MVP delivery to 3-5 email subscribers. Scalability beyond this will be considered post-MVP.
- **Security:**
  - The API endpoint for triggering the daily workflow must be secure, using API keys.
  - User data (email addresses) should be stored securely. No other security measures are required for the MVP.
- **Reliability:**
  - No specific uptime or availability requirements are defined for the MVP.
  - The newsletter generation and delivery process should be robust and handle potential errors gracefully.
  - The system must be executable from a local development environment.
- **Maintainability:**
  - The codebase should adhere to good quality coding standards, including separation of concerns.
  - The system should employ facades and factories to facilitate future expansion.
  - The system should be built as an event-driven pipeline, leveraging Supabase to capture data at each stage and trigger subsequent functions asynchronously. This approach aims to mitigate potential timeout issues with Vercel hosting.

## User Interaction and Design Goals

This section captures the high-level vision and goals for the User Experience (UX) to guide the Design Architect. [cite: 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]

- **Overall Vision & Experience:**
  - The desired look and feel is modern and minimalist, with synthwave technical glowing purple vibes.
  - Users should have a clean and efficient experience when accessing and consuming newsletter content and podcasts.
- **Key Interaction Paradigms:**
  - Interaction paradigms will be determined by the Design Architect.
- **Core Screens/Views (Conceptual):**
  - The MVP will consist of two pages:
    - A list page to display current and past newsletters.
    - A detail page to display the selected newsletter content, including:
      - Download option for the newsletter.
      - Web player for listening to the generated podcast.
      - The article laid out for viewing.
- **Accessibility Aspirations:**
  - No specific accessibility goals are defined for the MVP.
- **Branding Considerations (High-Level):**
  - A logo for the application will be provided.
  - The application will use the name "BMad DiCaster".
- **Target Devices/Platforms:**
  - The application will be designed as a mobile-first responsive web app, ensuring it looks good on both mobile and desktop devices.

## Technical Assumptions

This section captures any existing technical information that will guide the Architect in the technical design. [cite: 57, 58, 59, 60, 61, 62]

- The application will be developed using the Next.js/Supabase template and hosted entirely on Vercel. [cite: 39, 40, 41, 42]
- This implies a monorepo structure, as the frontend (Next.js) and backend (Supabase functions) will reside within the same repository. [cite: 59, 60, 61, 62]
- The backend will primarily leverage serverless functions provided by Vercel and Supabase. [cite: 59, 60, 61, 62]
- Frontend development will be in Next.js with React.
- Data storage will be handled by Supabase's PostgreSQL database.
- Separate Supabase instances will be used for development and production environments to ensure data isolation and stability.
- For local development, developers can utilize the Supabase CLI and Vercel CLI to emulate the production environment, primarily for testing functions and deployments, but the development Supabase instance will be the primary source of dev data.
- Testing will include unit tests, integration tests (especially for interactions with Supabase), and end-to-end tests.

## Epic Overview

_(Note: Epics will be developed sequentially. Development will start with Epic 1 and proceed to the next epic only after the previous one is fully completed and verified.)_

_(Note: All UI development across all epics must adhere to mobile responsiveness and Tailwind CSS/theming principles to ensure a consistent and maintainable user experience.)_

- **Epic 1: Project Initialization, Setup, and HN Content Acquisition**

  - Goal: Establish the foundational project structure, including the Next.js application, Supabase integration, and deployment pipeline, implement the initial API and CLI trigger mechanisms, and implement the functionality to retrieve, process, and store Hacker News posts and comments, providing the necessary data for newsletter generation.

- **Epic 2: Article Scraping**

  - Goal: Implement the functionality to scrape and store linked articles from HN posts, enriching the data available for summarization and the newsletter, and ensure this functionality can be triggered via the API and CLI.

- **Epic 3: AI-Powered Content Summarization**

  - Goal: Integrate AI summarization capabilities to generate concise summaries of articles and comments, enriching the newsletter content, and ensure this functionality can be triggered via the API and CLI.

- **Epic 4: Automated Newsletter Creation and Distribution**

  - Goal: Automate the generation and delivery of the daily newsletter, including a placeholder for the podcast URL and conditional logic with configurable delay/retry parameters to handle podcast link availability. Ensure this functionality can be triggered via the API and CLI.

- **Epic 5: Podcast Generation Integration**

  - Goal: Integrate with the Play.ht's PlayNote API to generate and incorporate podcast versions of the newsletter, including a webhook to update the newsletter data with the podcast URL in Supabase. Ensure this functionality can be triggered via the API and CLI.

- **Epic 6: Web Interface for Initial Structure and Content Access**

  - Goal: Develop a user-friendly web interface, starting with an initial structure generated by a tool like Vercel v0, to display newsletters and provide access to podcast content.

**Epic 1: Project Initialization, Setup, and HN Content Acquisition**

- **Story 1.1:** As a developer, I want to set up the Next.js project with Supabase integration, so that I have a functional foundation for building the application.

  - Acceptance Criteria:
    - The Next.js project is initialized using the Vercel/Supabase template.
    - Supabase is successfully integrated with the Next.js project.
    - The project codebase is initialized in a Git repository.

- **Story 1.2:** As a developer, I want to configure the deployment pipeline to Vercel with separate development and production environments, so that I can easily deploy and update the application.

  - Acceptance Criteria:
    - The project is successfully linked to a Vercel project with separate environments.
    - Automated deployments are configured for the main branch to the production environment.
    - Environment variables are set up for local development and Vercel deployments.

- **Story 1.3:** As a developer, I want to implement the API and CLI trigger mechanisms, so that I can manually trigger the workflow during development and testing.

  - Acceptance Criteria:
    - A secure API endpoint is created.
    - The API endpoint requires authentication (API key).
    - The API endpoint triggers the execution of the functionality implemented in this epic.
    - The API endpoint returns an appropriate response to indicate success or failure.
    - A CLI command is created.
    - The CLI command triggers the execution of the functionality implemented in this epic.
    - The CLI command provides informative output to the console.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The API and CLI interfaces adhere to mobile responsiveness and Tailwind/theming principles.

- **Story 1.4:** As a system, I want to retrieve the top 30 Hacker News posts and associated comments daily, so that the data is available for summarization and newsletter generation.

  - Acceptance Criteria:
    - The system retrieves the top 30 Hacker News posts daily using the HN Algolia API.
    - The system retrieves associated comments for the top 30 posts.
    - Retrieved data (posts and comments) is stored in the Supabase database with date association.
    - This functionality can be triggered via the API and CLI.
    - The system logs the start and completion of the retrieval process, including any errors.

**Epic 2: Article Scraping**

- **Story 2.1:** As a system, I want to identify URLs within the top 30 (configurable via environment variable) Hacker News posts, so that I can extract the content of linked articles.

  - Acceptance Criteria:
    - The system parses the top N (configurable via env var) Hacker News posts to identify URLs.
    - The system filters out any URLs that are not relevant to article scraping (e.g., links to images, videos, etc.).

- **Story 2.2:** As a system, I want to scrape the content of the identified article URLs using Cheerio, so that I can provide summaries in the newsletter.

  - Acceptance Criteria:
    - The system scrapes the content from the identified article URLs using Cheerio.
    - The system extracts relevant content such as the article title, author, publication date, and main text.
    - The system handles potential issues during scraping, such as website errors or changes in website structure, logging errors for review.

- **Story 2.3:** As a system, I want to store the scraped article content in the Supabase database, associated with the corresponding Hacker News post, so that it can be used for summarization and newsletter generation.

  - Acceptance Criteria:
    - The system stores the scraped article content in the Supabase database, associated with the corresponding Hacker News post.
    - The system ensures that the stored data includes all extracted information (title, author, date, text).

- **Story 2.4:** As a developer, I want to trigger the article scraping process via the API and CLI, so that I can manually initiate it for testing and debugging.

  - Acceptance Criteria:
    - The API endpoint can trigger the article scraping process.
    - The CLI command can trigger the article scraping process locally.
    - The system logs the start and completion of the scraping process, including any errors encountered.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The system handles partial execution gracefully (i.e., if triggered before Epic 1 is complete, it logs a message and exits).

**Epic 3: AI-Powered Content Summarization**

- **Story 3.1:** As a system, I want to integrate an AI summarization library or API, so that I can generate concise summaries of articles and comments.

  - Acceptance Criteria:
    - The system integrates a suitable AI summarization library or API (e.g., a local LLM or a cloud-based service).
    - The integration is configurable via environment variables (e.g., to switch between local and remote LLMs).

- **Story 3.2:** As a system, I want to retrieve summarization prompts from the database, and then use them to generate 2-paragraph summaries of the scraped articles, so that users can quickly grasp the main content and the prompts can be easily updated.

  - Acceptance Criteria:
    - The system retrieves the appropriate summarization prompt from the database.
    - The system generates a 2-paragraph summary for each scraped article using the retrieved prompt.
    - The summaries are accurate and capture the key information from the article.

- **Story 3.3:** As a system, I want to retrieve summarization prompts from the database, and then use them to generate 2-paragraph summaries of the comments for the selected HN posts, so that users can understand the main discussions and the prompts can be easily updated.

  - Acceptance Criteria:
    - The system retrieves the appropriate summarization prompt from the database.
    - The system generates a 2-paragraph summary of the comments for each selected HN post using the retrieved prompt.
    - The summaries highlight interesting interactions and key points from the discussion.

- **Story 3.4:** As a developer, I want to trigger the AI summarization process via the API and CLI, so that I can manually initiate it for testing and debugging.

  - Acceptance Criteria:
    - The API endpoint can trigger the AI summarization process.
    - The CLI command can trigger the AI summarization process locally.
    - The system logs the input and output of the summarization process, including the summarization prompt used and any errors.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The system handles partial execution gracefully (i.e., if triggered before Epic 2 is complete, it logs a message and exits).

**Epic 4: Automated Newsletter Creation and Distribution**

- **Story 4.1:** As a system, I want to retrieve the newsletter template from the database, so that the newsletter's design and structure can be updated without code changes.

  - Acceptance Criteria:
    - The system retrieves the newsletter template from the database.

- **Story 4.2:** As a system, I want to generate a daily newsletter in HTML format using the retrieved template, so that users can receive a concise summary of Hacker News content.

  - Acceptance Criteria:
    - The system generates a newsletter in HTML format using the template retrieved from the database.
    - The newsletter includes summaries of selected articles and comments.
    - The newsletter includes links to the original HN posts and articles.
    - The newsletter includes the original post dates/times.

- **Story 4.3:** As a system, I want to send the generated newsletter to a list of subscribers using Nodemailer, with credentials securely provided via environment variables, so that users receive the daily summary in their inbox.

  - Acceptance Criteria:
    - The system retrieves the list of subscriber email addresses from the Supabase database.
    - The system sends the HTML newsletter to all active subscribers using Nodemailer.
    - Nodemailer credentials (e.g., Gmail account information) are securely accessed via environment variables.
    - The system logs the delivery status for each subscriber.
    - The initial email template includes a placeholder for the podcast URL.
    - The system implements conditional logic and a configurable delay/retry mechanism (via environment variables) to handle podcast link availability before sending the email.

- **Story 4.4:** As a developer, I want to trigger the newsletter generation and distribution process via the API and CLI, so that I can manually initiate it for testing and debugging.

  - Acceptance Criteria:
    - The API endpoint can trigger the newsletter generation and distribution process.
    - The CLI command can trigger the newsletter generation and distribution process locally.
    - The system logs the start and completion of the process, including any errors.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The system handles partial execution gracefully (i.e., if triggered before Epic 3 is complete, it logs a message and exits).

**Epic 5: Podcast Generation Integration**

- **Story 5.1:** As a system, I want to integrate with the Play.ht's PlayNote API, so that I can generate AI-powered podcast versions of the newsletter content.

  - Acceptance Criteria:
    - The system integrates with the Play.ht's PlayNote API using webhooks for asynchronous updates.
    - The integration is configurable via environment variables (e.g., API key, user ID, webhook URL).

- **Story 5.2:** As a system, I want to send the newsletter content to the Play.ht API to initiate podcast generation, and receive a job ID or initial response, so that I can track the podcast creation process.

  - Acceptance Criteria:
    - The system sends the newsletter content to the Play.ht API to generate a podcast.
    - The system receives a job ID or initial response from the Play.ht API.
    - The system stores the job ID for tracking purposes.

- **Story 5.3:** As a system, I want to implement a webhook handler to receive the podcast URL from Play.ht, and update the newsletter data, so that the podcast link can be included in the newsletter and web interface.

  - Acceptance Criteria:
    - The system implements a webhook handler to receive the podcast URL from Play.ht.
    - The system extracts the podcast URL from the webhook payload.
    - The system updates the newsletter data in the Supabase database with the podcast URL.

- **Story 5.4:** As a developer, I want to trigger the podcast generation process via the API and CLI, so that I can manually initiate it for testing and debugging.

  - Acceptance Criteria:
    - The API endpoint can trigger the podcast generation process.
    - The CLI command can trigger the podcast generation process locally.
    - The system logs the start and completion of the process, including any intermediate steps, responses from the Play.ht API, and webhook interactions.
    - All API requests and CLI command executions are logged, including timestamps and any relevant data.
    - The system handles partial execution gracefully (i.e., if triggered before Epic 4 is complete, it logs a message and exits).
  - _(Note for Architect: The Play.ht API - [https://docs.play.ai/api-reference/playnote/post](https://docs.play.ai/api-reference/playnote/post) - supports both webhook and polling mechanisms for receiving the podcast URL. We will use the webhook approach for real-time updates and efficiency.)_

**Epic 6: Web Interface for Initial Structure and Content Access**

- **Story 6.1:** As a developer, I want to use a tool like Vercel v0 to generate the initial structure of the web interface, so that I have a basic layout to work with.

  - Acceptance Criteria:
    - A tool (e.g., Vercel v0) is used to generate the initial HTML/CSS structure for the web interface.
    - The generated structure includes basic layouts for the newsletter list and detail pages, as well as podcast display.

- **Story 6.2:** As a user, I want to see a list of current and past newsletters, so that I can easily browse available content.

  - Acceptance Criteria:
    - The web interface displays a list of newsletters.
    - The list includes relevant information such as the newsletter title and date.
    - The list is paginated or provides scrolling functionality to handle a large number of newsletters.

- **Story 6.3:** As a user, I want to be able to read the newsletter content within the web page, so that I can conveniently consume the information.

  - Acceptance Criteria:
    - Clicking on a newsletter in the list displays the full newsletter content.
    - The newsletter content is displayed in a readable format.

- **Story 6.4:** As a user, I want to have the option to download newsletters, so that I can access them offline.

  - Acceptance Criteria:
    - The web interface provides a download option for each newsletter.
    - Newsletters can be downloaded in a suitable format (e.g., HTML, PDF).

- **Story 6.5:** As a user, I want to listen to generated podcasts within the web interface, so that I can consume the content in audio format.

  - Acceptance Criteria:
    - The web interface includes a web player for listening to podcasts.
    - The player includes standard playback controls (e.g., play, pause, volume).
    - The podcast player is integrated with the display of the corresponding newsletter.

## Key Reference Documents

_(This section will be created later, from the sections prior to this being carved up into smaller documents)_

## Out of Scope Ideas Post MVP

- User Authentication and Management [cite: 34, 35, 36, 37, 38, 67]
- Subscription Management [cite: 34, 35, 36, 37, 38, 67]
- Admin Dashboard [cite: 34, 35, 36, 37, 38, 67]
  - Viewing and updating daily podcast settings
  - Prompt management for summarization
  - UI for template modification
- Enhanced Newsletter Customization [cite: 34, 35, 36, 37, 38, 67]
- Additional Content Digests [cite: 34, 35, 36, 37, 38, 67]
  - Configuration and creation of different digests
  - Support for content sources beyond Hacker News
- Advanced scraping techniques (e.g., Playwright)

## Change Log

| Change        | Date       | Version | Description                                        | Author |
| ------------- | ---------- | ------- | -------------------------------------------------- | ------ |
| Initial Draft | 2025-05-13 | 0.1     | Initial draft of the Product Requirements Document | 2-pm   |

----- END PRD START CHECKLIST OUTPUT ------

## Checklist Results Report

**Category Statuses**

| Category                         | Status  | Critical Issues                                                                                                                                                                                             |
| -------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Problem Definition & Context  | PARTIAL | Quantification of problem impact, baseline measurements, timeframe for goals, user research, competitive analysis, market context                                                                           |
| 2. MVP Scope Definition          | PASS    | None                                                                                                                                                                                                        |
| 3. User Experience Requirements  | PARTIAL | User flows, entry/exit points, decision points, critical path, edge cases, accessibility, performance expectations, error handling, information architecture, visual design guidelines, content, navigation |
| 4. Functional Requirements       | PASS    | None                                                                                                                                                                                                        |
| 5. Non-Functional Requirements   | PARTIAL | Compliance, security testing, privacy                                                                                                                                                                       |
| 6. Epic & Story Structure        | PASS    | None                                                                                                                                                                                                        |
| 7. Technical Guidance            | PARTIAL | Technical decision framework details                                                                                                                                                                        |
| 8. Cross-Functional Requirements | PARTIAL | Data migration                                                                                                                                                                                              |
| 9. Clarity & Communication       | PARTIAL | Diagrams/visuals, stakeholder details, disagreement resolution, communication plan, approval process                                                                                                        |

**Critical Deficiencies**

- Lack of quantification of problem impact, baseline measurements, timeframe for achieving goals, user research findings, competitive analysis, and market context.
- Absence of details on user flows, entry/exit points, decision points, critical path, edge cases, accessibility considerations, performance expectations from the user perspective, error handling and recovery approaches, information architecture, visual design guidelines, content requirements, and high-level navigation structure.
- Missing information on compliance requirements, security testing requirements, and privacy considerations.
- Absence of a detailed technical decision framework.
- Lack of details on data migration needs.
- Absence of diagrams/visuals and information on key stakeholders, disagreement resolution, a communication plan for updates, and the approval process.

**Recommendations**

- For "Problem Definition & Context," consider adding quantitative data to demonstrate the impact of the problem. If possible, include baseline measurements and a timeline for achieving the stated goals.
- For "User Experience Requirements," collaborate with the Design Architect to define user flows, address usability concerns, and outline UI requirements in more detail.
- For "Non-Functional Requirements," consult with relevant experts to address compliance, security testing, and privacy considerations.
- For "Technical Guidance," work with the Architect to establish a technical decision framework.
- For "Cross-Functional Requirements," determine if data migration will be necessary and document the requirements accordingly.
- For "Clarity & Communication," enhance the document with diagrams/visuals where appropriate and define key stakeholders, a disagreement resolution process, a communication plan, and an approval process.

**Final Decision**

READY FOR ARCHITECT: The PRD and epics are comprehensive, properly structured, and ready for architectural design.

----- END Checklist START Architect Prompt ------

## Initial Architect Prompt

Based on our discussions and requirements analysis for the BMad DiCaster, I've compiled the following technical guidance to inform your architecture analysis and decisions to kick off Architecture Creation Mode:

### Technical Infrastructure

- **Repository & Service Architecture Decision:** Monorepo with Next.js frontend and Supabase functions within the same repo.
- **Starter Project/Template:** Vercel/Supabase template
- **Hosting/Cloud Provider:** Vercel
- **Frontend Platform:** Next.js with React
- **Backend Platform:** Supabase functions (serverless)
- **Database Requirements:** Supabase's PostgreSQL

### Technical Constraints

- The application will be developed using the Next.js/Supabase template and hosted entirely on Vercel.
- Separate Supabase instances will be used for development and production environments.

### Deployment Considerations

- Automated deployments from the main branch to the production environment.
- Separate Vercel environments for development and production.

### Local Development & Testing Requirements

- Developers can use the Supabase CLI and Vercel CLI for local development and testing.
- Testing will include unit tests, integration tests, and end-to-end tests.

### Other Technical Considerations

- The system should be built as an event-driven pipeline, leveraging Supabase to capture data at each stage and trigger subsequent functions asynchronously to mitigate potential timeout issues with Vercel.

----- END Prompt -----
