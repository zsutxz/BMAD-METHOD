#   Project Brief: BMad DiCaster

##   Introduction / Problem Statement

This project aims to develop a web application that provides a daily, concise summary of top Hacker News (HN) posts, delivered as a newsletter and accessible via a web interface.

The problem being addressed is the information overload faced by busy professionals and enthusiasts who want to stay updated on HN but lack the time to sift through numerous posts and discussions. This application will streamline the consumption of HN content by curating the top stories, providing AI-powered summaries of both articles and comments, and offering an optional AI-generated podcast version.

The solution will involve:

* Daily retrieval of top HN posts and comments.
* Scraping of linked articles.
* AI-powered summarization of articles and comments.
* Generation of a concise daily newsletter.
* Optional generation of an AI-powered podcast.
* Delivery of the newsletter via email.
* A web interface for accessing current and past newsletters and podcasts.

##   Vision & Goals

* **Vision:** To create a functional demonstration of a modern web application leveraging AI for content summarization and generation, both as a personal learning experience and as a helpful tool for individuals seeking concise summaries of Hacker News content and a showcase for others interested in building similar applications.
* **Primary Goals:**

    1.  **End-to-End Automation:** Successfully automate the daily workflow, from fetching HN posts to sending out the newsletter email, triggered by a scheduled process, with zero manual intervention required.
    2.  **Local/API Trigger:** Implement the ability to manually trigger the daily workflow, either via a command-line interface (CLI) when running locally or via a secure API endpoint, within the MVP.
    3.  **API Security:** Ensure the API endpoint used to trigger the daily workflow includes basic security measures to prevent unauthorized access.
* **Success Metrics (Initial Ideas):**

    1.  **Successful Deployment:** The application is successfully deployed to Vercel and accessible via a public URL.
    2.  **End-to-End Workflow Completion:** The daily workflow (HN post retrieval to newsletter delivery) completes successfully and automatically for at least 7 consecutive days.
    3.  **Manual Trigger Functionality:** The daily workflow can be successfully triggered both locally via CLI and remotely via a secure API call.
    4.  **Functional Newsletter & UI:** The generated newsletter is formatted correctly and delivered as expected, and the core features of the web UI (displaying newsletters, accessing podcasts) are functional.
    5.  **Codebase Quality:** The codebase demonstrates good practices, is well-structured, and serves as a valuable learning resource.

##   Target Audience / Users

The primary users of this application are:

* **Engineers:** Individuals with a technical background who are interested in staying up-to-date with Hacker News and learning about the application's architecture and AI implementation.
* **Busy Tech Professionals:** Professionals in the technology industry who have limited time but want to consume a concise summary of the day's top Hacker News stories.

These users share the need for a streamlined way to stay informed about relevant discussions and news within the tech community, without having to spend excessive time browsing Hacker News directly.

##   Key Features / Scope (High-Level Ideas for MVP)

* **HN Content Retrieval & Storage:**

    * Daily retrieval of the top 30 Hacker News posts and associated comments using the HN Algolia API.
    * Scraping and storage of up to 10 linked articles per day.
    * Storage of all retrieved data (posts, comments, articles) with date association.
* **AI-Powered Summarization:**

    * AI-powered summarization of the 10 selected articles (2-paragraph summaries).
    * AI-powered summarization of comments for the 10 selected posts (2-paragraph summaries highlighting interesting interactions).
    * Configuration for local or remote LLM usage via environment variables.
* **Newsletter Generation & Delivery:**

    * Generation of a daily newsletter in HTML format, including summaries, links to HN posts and articles, and original post dates/times.
    * Automated delivery of the newsletter to a manually configured list of subscribers in Supabase.
* **Podcast Generation & Integration:**

    * Integration with Play.ht's PlayNote API for AI-generated podcast creation from the newsletter content.
    * Webhook handler to update the newsletter with the generated podcast link.
* **Web Interface (MVP):**

    * Display of current and past newsletters.
    * Functionality to read the newsletter content within the web page.
    * Download option for newsletters.
    * Web player for listening to generated podcasts.
* **API & Triggering:**

    * Secure API endpoint to manually trigger the daily workflow.
    * CLI command to manually trigger the daily workflow locally.

##   Post MVP Features / Scope and Ideas

* User Authentication and Management: Functionality for user login, registration, and profile management.
* Subscription Management: Features to allow users to manage their newsletter subscriptions (e.g., modify, pause, or cancel).
* Admin Dashboard: An administrative interface for managing users, newsletters, and other application data.
* Enhanced Newsletter Customization: Options for users to customize their newsletter preferences (e.g., frequency, content filters).
* Additional Content Digests: Potential to offer different digests based on Hacker News categories or other content sources.

##   Known Technical Constraints or Preferences

* **Constraints:** None currently identified.
* **Initial Architectural Preferences (if any):**
    * The application will be developed using Next.js and hosted on Vercel, leveraging the Vercel/Supabase [template](https://vercel.com/templates/next.js/supabase) as a starting point.
    * A monorepo structure is not a requirement for this project.
    * The architecture will incorporate some microservices principles, alongside the frontend.
* **Risks:** None currently identified.
* **User Preferences:** None currently identified.

##   Relevant Research (Optional)

##   PM Prompt

This Project Brief provides the full context for BMad DiCaster. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section 1 at a time, asking for any necessary clarification or suggesting improvements as your mode 1 programming allows.
