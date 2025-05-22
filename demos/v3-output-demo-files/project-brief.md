# Project Brief: BMad Daily Digest

## 1. Introduction / Problem Statement

- **The Core Idea is**: To create a daily podcast, "BMad Daily Digest," by scraping top Hacker News posts and their comments, then using an AI service (play.ai PlayNote) to generate an audio summary with two speakers.
- **The Problem Being Solved is**: Busy professionals, especially in the tech world, find it hard to keep up with important discussions and news on platforms like Hacker News due to time constraints. They need a quick, digestible audio format to stay informed.

## 2. Vision & Goals

- **a. Vision**: To become the go-to daily audio source for busy professionals seeking to stay effortlessly informed on the most relevant and engaging discussions from Hacker News.
- **b. Primary Goals (for MVP)**:
  1.  Successfully scrape the top 10 Hacker News posts (articles and comments) and generate a coherent text file suitable for the play.ai API daily.
  2.  Reliably submit the generated text to play.ai PlayNote and receive a 2-agent audio podcast daily.
  3.  Ensure the produced podcast is easily accessible to a pilot group of users (e.g., via a simple download link or a basic podcast feed).
  4.  Deliver the daily digest by a consistent time each morning (e.g., by 8 AM local time).
- **c. Success Metrics (Initial Ideas)**:
  - Content Accuracy: X% of generated summaries accurately reflect the core topics of the Hacker News posts.
  - Production Reliability: Successfully produce a podcast on X out of Y days (e.g., 95% uptime).
  - User Feedback (Qualitative): Positive feedback from a small group of initial listeners regarding clarity, usefulness, and audio quality.
  - Listenership (Small Scale): Number of downloads/listens by the pilot user group.

## 3. Target Audience / Users

- **Primary Users**: Busy tech executives (e.g., VPs, Directors, C-suite in technology companies).
- **Characteristics**:
  - Extremely time-poor with demanding schedules.
  - Need to stay informed about technology trends, competitor moves, and industry sentiment for strategic decision-making.
  - Likely consume content during commutes, short breaks, or while multitasking.
  - Value high-signal, concise, and curated information.
  - Familiar with Hacker News but lack the time for in-depth daily reading.

## 4. Key Features / Scope (High-Level Ideas for MVP)

1.  **Hacker News Scraper:**
    - Automatically fetches the top X (e.g., 10) posts from Hacker News daily.
    - Extracts the main article content/summary for each post.
    - Extracts a selection of top/relevant comments for each post.
2.  **Content Aggregator & Formatter:**
    - Combines the scraped article content and comments into a single, structured text file.
    - Formats the text in a way that's optimal for the play.ai PlayNote API.
3.  **AI Podcast Generation:**
    - Submits the formatted text file to the play.ai PlayNote API.
    - Retrieves the generated audio file.
4.  **Basic Web Application (for MVP delivery):**
    - **List Page:** Displays a chronological list of daily "BMad Daily Digest" episodes.
    - **Detail Page (per episode):**
      - Shows the list of individual Hacker News stories included in that day's digest.
      - Provides direct links to the original Hacker News post for each story.
      - Provides direct links to the source article for each story.
      - Embeds an audio player to play the generated podcast for that day.
5.  **Scheduling/Automation:**
    - The entire backend process (scrape, format, generate podcast, update application data) runs automatically on a daily schedule.

## 5. Post MVP Features / Scope and Ideas

After the successful launch and validation of the MVP, "BMad Daily Digest" could be enhanced with the following features:

- **Daily Email Summary:**
  - Generate an email brief from the summarized transcript of the podcast (which can also be sourced from PlayNote).
  - Include a direct link to the day's podcast episode in the email.
- **RSS Feed:**
  - Provide a standard RSS feed, allowing users to subscribe to the "BMad Daily Digest" in their preferred podcast players.
- **User Accounts & Personalization:**
  - Allow users to create accounts.
  - Enable email subscription management through accounts.
  - Offer options to customize podcast hosts (e.g., select from different AI voices or styles available via play.ai).
- **Expanded Content & Features:**
  - Wider range of content sources (beyond Hacker News).
  - Advanced audio features (selectable narrators if not covered by customization, variable playback speed within the app).
  - Full podcast transcription available on the website.
  - Search functionality within the app for past digests or stories.
- **Community & Feedback:**
  - In-app user feedback mechanisms (e.g., rating episodes, suggesting improvements).

## 6. Known Technical Constraints or Preferences

- **Development Approach Preference:**
  - The full backend (scraping, content aggregation, podcast generation, data storage) is to be built and validated first.
  - The frontend UI will be developed subsequently to interact with the established backend API.
- **Technology Stack Preferences (Considered Solid by User):**
  - **Frontend:** NextJS React, planned to be hosted on a static S3 site.
  - **Backend Services:** AWS Lambda for compute, DynamoDB for storage.
  - **Automation Trigger:** Daily execution via a cron job or a REST API call to trigger the Lambda function.
- **Backend Language (Open for Discussion):**
  - The user is open to using either Python or TypeScript for the backend, with a note that web scraping capabilities and ease of use with the Algolia API are factors in this decision. This choice will be finalized during more detailed technical planning.
- **Data Source for Hacker News:**
  - Utilize the Algolia Hacker News Search API (hn.algolia.com) for fetching posts and comments, as it's generally easier to work with than direct site scraping.
- **Budget Constraints & API Usage:**
  - **AWS Services:** Strong preference to operate services (Lambda, DynamoDB, S3, etc.) within the limits of the AWS free tier where possible.
  - **play.ai PlayNote API:** The user has an existing purchased subscription, so this service is an exception to the free-tier goal for other services.
- **Timeline:** _(User has not specified a firm timeline for MVP at this stage of the brief)._
- **Risks:**
  - Dependency on Algolia HN API (availability, rate limits, potential changes).
  - Consistency and quality of AI-generated audio from play.ai.
  - Potential API changes or future costs associated with play.ai (beyond current subscription terms).
  - Managing daily automated processing effectively.
- **Other User Preferences:** _(User has not specified further preferences at this stage of the brief)._

## 7. Relevant Research (Optional)

- **Hacker News Data Acquisition:** The decision to use the Algolia Hacker News Search API (hn.algolia.com) is based on its known efficiency and ease of use for accessing posts and comments, which is preferable to direct website scraping.
