# BMad DiCaster Product Requirements Document (PRD)

## Goal, Objective and Context

**Goal:** To develop a web application that provides a daily, concise summary of top Hacker News (HN) posts, delivered as a newsletter and accessible via a web interface.

**Objective:** To streamline the consumption of HN content by curating the top stories, providing AI-powered summaries, and offering an optional AI-generated podcast version.

**Context:** Busy professionals and enthusiasts want to stay updated on HN but lack the time to sift through numerous posts and discussions. This application will address this problem by automating the delivery of summarized content.

## Functional Requirements (MVP)

- **HN Content Retrieval & Storage:**
  - Daily retrieval of the top 30 Hacker News posts and associated comments using the HN Algolia API.
  - Scraping and storage of up to 10 linked articles per day.
  - Storage of all retrieved data (posts, comments, articles) with date association.
- **AI-Powered Summarization:**
  - AI-powered summarization of the 10 selected articles (2-paragraph summaries).
  - AI-powered summarization of comments for the 10 selected posts (2-paragraph summaries highlighting interesting interactions).
  - Configuration for local or remote LLM usage via environment variables.
- **Newsletter Generation & Delivery:**
  - Generation of a daily newsletter in HTML format, including summaries, links to HN posts and articles, and original post dates/times.
  - Automated delivery of the newsletter to a manually configured list of subscribers in Supabase. The list of emails will be manually populated in the database. Account information for the Nodemailer service will be provided via environment variables.
- **Podcast Generation & Integration:**
  - Integration with Play.ht's PlayNote API for AI-generated podcast creation from the newsletter content.
  - Webhook handler to update the newsletter with the generated podcast link.
- **Web Interface (MVP):**
  - Display of current and past newsletters.
  - Functionality to read the newsletter content within the web page.
  - Download option for newsletters.
  - Web player for listening to generated podcasts.
  - Basic mobile responsiveness for displaying newsletters and podcasts.
- **API & Triggering:**
  - Secure API endpoint to manually trigger the daily workflow, secured with API keys.
  - CLI command to manually trigger the daily workflow locally.

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

This section captures the high-level vision and goals for the User Experience (UX) to guide the Design Architect.

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
  - The web interface (Epic 6) will adhere to WCAG 2.1 Level A guidelines as detailed in `frontend-architecture.md`. (Updated during checklist review)
- **Branding Considerations (High-Level):**
  - A logo for the application will be provided.
  - The application will use the name "BMad DiCaster".
- **Target Devices/Platforms:**
  - The application will be designed as a mobile-first responsive web app, ensuring it looks good on both mobile and desktop devices.

## Technical Assumptions

This section captures any existing technical information that will guide the Architect in the technical design.

- The application will be developed using the Next.js/Supabase template and hosted entirely on Vercel.
- This implies a monorepo structure, as the frontend (Next.js) and backend (Supabase functions) will reside within the same repository.
- The backend will primarily leverage serverless functions provided by Vercel and Supabase.
- Frontend development will be in Next.js with React.
- Data storage will be handled by Supabase's PostgreSQL database.
- Separate Supabase instances will be used for development and production environments to ensure data isolation and stability.
- For local development, developers can utilize the Supabase CLI and Vercel CLI to emulate the production environment, primarily for testing functions and deployments, but the development Supabase instance will be the primary source of dev data.
- Testing will include unit tests, integration tests (especially for interactions with Supabase), and end-to-end tests.
- The system should be built as an event-driven pipeline, leveraging Supabase to capture data at each stage and trigger subsequent functions asynchronously to mitigate potential timeout issues with Vercel.

## Epic Overview

_(Note: Epics will be developed sequentially. Development will start with Epic 1 and proceed to the next epic only after the previous one is fully completed and verified. Per the BMAD method, every story must be self-contained and done before the next one is started.)_

_(Note: All UI development across all epics must adhere to mobile responsiveness and Tailwind CSS/theming principles to ensure a consistent and maintainable user experience.)_

**(General Note on Service Implementation for All Epics):** All backend services (Supabase Functions) developed as part of any epic must implement robust error handling. They should log extensively using Pino, ensuring that all log entries include the relevant `workflow_run_id` for traceability. Furthermore, services must interact with the `WorkflowTrackerService` to update the `workflow_runs` table appropriately on both successful completion of their tasks and in case of any failures, recording status and error messages as applicable.

- **Epic 1: Project Initialization, Setup, and HN Content Acquisition**
  - Goal: Establish the foundational project structure, including the Next.js application, Supabase integration, deployment pipeline, API/CLI triggers, core workflow orchestration, and implement functionality to retrieve, process, and store Hacker News posts/comments via a `ContentAcquisitionFacade`, providing data for newsletter generation. Implement the database event mechanism to trigger subsequent processing. Define core configuration tables, seed data, and set up testing frameworks.
- **Epic 2: Article Scraping**
  - Goal: Implement the functionality to scrape and store linked articles from HN posts, enriching the data available for summarization and the newsletter. Ensure this functionality is triggered by database events and can be tested via API/CLI (if retained). Implement the database event mechanism to trigger subsequent processing.
- **Epic 3: AI-Powered Content Summarization**
  - Goal: Integrate AI summarization capabilities, by implementing and using a configurable and testable `LLMFacade`, to generate concise summaries of articles and comments from prompts stored in the database. This will enrich the newsletter content, be triggerable via API/CLI, is triggered by database events, and track progress via `WorkflowTrackerService`.
- **Epic 4: Automated Newsletter Creation and Distribution**
  - Goal: Automate the generation and delivery of the daily newsletter by implementing and using a configurable `EmailDispatchFacade`. This includes handling podcast link availability, being triggerable via API/CLI, orchestration by `CheckWorkflowCompletionService`, and status tracking via `WorkflowTrackerService`.
- **Epic 5: Podcast Generation Integration**
  - Goal: Integrate with an audio generation API (initially Play.ht) by implementing and using a configurable `AudioGenerationFacade` to create podcast versions of the newsletter. This includes handling webhooks to update newsletter data and workflow status. Ensure this is triggerable via API/CLI, orchestrated appropriately, and uses `WorkflowTrackerService`.
- **Epic 6: Web Interface for Initial Structure and Content Access**
  - Goal: Develop a user-friendly, responsive, and accessible web interface, based on the `frontend-architecture.md`, to display newsletters and provide access to podcast content, aligning with the project's visual and technical guidelines. All UI development within this epic must adhere to the "synthwave technical glowing purple vibes" aesthetic using Tailwind CSS and Shadcn UI, ensure basic mobile responsiveness, meet WCAG 2.1 Level A accessibility guidelines (including semantic HTML, keyboard navigation, alt text, color contrast), and optimize images using `next/image`, as detailed in the `frontend-architecture.txt` and `ui-ux-spec.txt`.

---

**Epic 1: Project Initialization, Setup, and HN Content Acquisition**

> This section has been moved to a dedicated document: [Epic 1: Project Initialization, Setup, and HN Content Acquisition](./epic-1.md)

---

**Epic 2: Article Scraping**

> This section has been moved to a dedicated document: [Epic 2: Article Scraping](./epic-2.md)

---

**Epic 3: AI-Powered Content Summarization**

> This section has been moved to a dedicated document: [Epic 3: AI-Powered Content Summarization](./epic-3.md)

---

**Epic 4: Automated Newsletter Creation and Distribution**

> This section has been moved to a dedicated document: [Epic 4: Automated Newsletter Creation and Distribution](./epic-4.md)

---

**Epic 5: Podcast Generation Integration**

> This section has been moved to a dedicated document: [Epic 5: Podcast Generation Integration](./epic-5.md)

---

**Epic 6: Web Interface for Initial Structure and Content Access**

> This section has been moved to a dedicated document: [Epic 6: Web Interface for Initial Structure and Content Access](./epic-6.md)

---

## Out of Scope Ideas Post MVP

- User Authentication and Management
- Subscription Management
- Admin Dashboard
  - Viewing and updating daily podcast settings
  - Prompt management for summarization
  - UI for template modification
- Enhanced Newsletter Customization
- Additional Content Digests
  - Configuration and creation of different digests
  - Support for content sources beyond Hacker News
- Advanced scraping techniques (e.g., Playwright)

## Change Log

| Change                                           | Date       | Version | Description                                                                                                                                               | Author |
| :----------------------------------------------- | :--------- | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :----- |
| Initial Draft                                    | 2025-05-13 | 0.1     | Initial draft of the Product Requirements Document                                                                                                        | 2-pm   |
| Updates from Arch suggestions & Checklist Review | 2025-05-14 | 0.3     | Incorporated changes from `arch-suggested-changes.txt`, `fea-suggested-changes.txt`, and Master Checklist review, including new stories & AC refinements. | 5-posm |
