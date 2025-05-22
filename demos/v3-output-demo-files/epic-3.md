# Epic 3: Web Application MVP & Podcast Consumption

**Goal:** To set up the frontend project in its dedicated repository and develop and deploy the Next.js frontend application MVP, enabling users to consume the "BMad Daily Digest." This includes initial project setup (AI-assisted UI kickstart from `bmad-daily-digest-ui` scaffold), pages for listing and detailing episodes, an about page, and deployment.

## User Stories

**Story 3.1: Frontend Project Repository & Initial UI Setup (AI-Assisted)**
* **User Story Statement:** As a Developer, I need to establish the `bmad-daily-digest-frontend` Git repository with a new Next.js (TypeScript, Node.js 22) project, using the provided `bmad-daily-digest-ui` V0 scaffold as the base. This setup must include all foundational tooling (ESLint, Prettier, Jest with React Testing Library, a basic CI stub), and an initial AWS CDK application structure, ensuring the "80s retro CRT terminal" aesthetic (with Tailwind CSS and shadcn/ui) is operational, so that a high-quality, styled, and standardized frontend development environment is ready.
* **Acceptance Criteria (ACs):**
    1.  A new, private Git repository `bmad-daily-digest-frontend` **must** be created on GitHub.
    2.  The `bmad-daily-digest-ui` V0 scaffold project files **must** be used as the initial codebase in this repository.
    3.  `package.json` **must** be updated (project name, version, description).
    4.  Project dependencies **must** be installable.
    5.  TypeScript (`tsconfig.json`), Next.js (`next.config.mjs`), Tailwind (`tailwind.config.ts`), ESLint, Prettier, Jest configurations from the scaffold **must** be verified and operational.
    6.  The application **must** build successfully (`npm run build`) with the scaffolded UI.
    7.  A basic CI pipeline stub (GitHub Actions) for lint, format check, test, build **must** be created.
    8.  A standard `.gitignore` and an updated `README.md` **must** be present.
    9.  An initial AWS CDK application structure **must** be created within a `cdk/` directory in this repository, ready for defining frontend-specific infrastructure (S3, CloudFront in Story 3.6).

**Story 3.2: Frontend API Service Layer for Backend Communication**
* **User Story Statement:** As a Frontend Developer, I need a dedicated and well-typed API service layer (e.g., `lib/api-client.ts`) within the Next.js frontend application to manage all HTTP communication with the "BMad Daily Digest" backend API (for fetching episode lists and specific episode details), so that UI components can cleanly and securely consume backend data with robust error handling.
* **Acceptance Criteria (ACs):**
    1.  A TypeScript module `lib/api-client.ts` (or similar) **must** encapsulate backend API interactions.
    2.  Functions **must** exist for: `getEpisodes(): Promise<EpisodeListItem[]>` and `getEpisodeDetails(episodeId: string): Promise<EpisodeDetail | null>`.
    3.  `axios` (or native `Workspace` with a wrapper if preferred for frontend) **must** be used for HTTP requests.
    4.  Backend API base URL (`NEXT_PUBLIC_BACKEND_API_URL`) and Frontend Read API Key (`NEXT_PUBLIC_FRONTEND_API_KEY`) **must** be configurable via public environment variables and used in requests.
    5.  TypeScript interfaces (`EpisodeListItem`, `EpisodeDetail`, `SourceHNPostDetail` from `lib/types.ts`) for API response data **must** be defined/used, matching backend API.
    6.  API functions **must** correctly parse JSON responses and transform data into defined interfaces.
    7.  Error handling (network errors, non-2xx responses from backend) **must** be implemented, providing clear error information/objects.
    8.  Unit tests (Jest) **must** mock the HTTP client and verify API calls, data parsing/transformation, and error handling. All tests **must** pass.

**Story 3.3: Episode List Page Implementation**
* **User Story Statement:** As a Busy Tech Executive, I want to view a responsive "Episode List Page" (based on `app/(pages)/episodes/page.tsx` from the scaffold) that clearly displays all available "BMad Daily Digest" episodes in reverse chronological order, showing the episode number, publication date, and podcast title for each, using themed components like `episode-card.tsx`, so that I can quickly find and select an episode.
* **Acceptance Criteria (ACs):**
    1.  The existing `app/(pages)/episodes/page.tsx` (or equivalent main list page from scaffold) **must** be updated.
    2.  It **must** use the API service layer (Story 3.2) to fetch episodes.
    3.  A themed loading state (e.g., using `loading-state.tsx`) **must** be shown.
    4.  A themed error message (e.g., using `error-state.tsx`) **must** be shown if fetching fails.
    5.  A "No episodes available yet" message **must** be shown for an empty list.
    6.  Episodes **must** be listed in reverse chronological order.
    7.  Each list item, potentially using a modified `episode-card.tsx` component, **must** display "Episode [EpisodeNumber]: [PublicationDate] - [PodcastGeneratedTitle]".
    8.  Each item **must** link to the Episode Detail Page for that episode using its `episodeId`.
    9.  Styling **must** adhere to the "80s retro CRT terminal" aesthetic.
    10. The page **must** be responsive.
    11. Unit/integration tests (Jest with RTL) **must** cover all states, data display, order, and navigation. All tests **must** pass.

**Story 3.4: Episode Detail Page Implementation**
* **User Story Statement:** As a Busy Tech Executive, after selecting an episode, I want to navigate to a responsive "Episode Detail Page" (based on `app/(pages)/episodes/[episodeId]/page.tsx`/page.tsx] from the scaffold) that features an embedded HTML5 audio player, displays the episode title/date/number, a list of the Hacker News stories covered (using components like `story-item.tsx`), and provides clear links to the original articles and HN discussions, so I can listen and explore sources.
* **Acceptance Criteria (ACs):**
    1.  The dynamic route page `app/(pages)/episodes/[episodeId]/page.tsx` **must** be implemented.
    2.  It **must** accept `episodeId` from the URL.
    3.  It **must** use the API service layer (Story 3.2) to fetch episode details.
    4.  Loading and error states **must** be handled and displayed with themed components.
    5.  If data found, **must** display: `podcastGeneratedTitle`, `publicationDate`, `episodeNumber`.
    6.  An embedded HTML5 audio player (`<audio controls>`) **must** play the podcast using the public `audioUrl` from the episode details.
    7.  A list of included Hacker News stories (from `sourceHNPosts`) **must** be displayed, potentially using a `story-item.tsx` component for each.
    8.  For each HN story: its title, a link to `originalArticleUrl` (new tab), and a link to `hnLink` (new tab) **must** be displayed.
    9.  Styling **must** adhere to the "80s retro CRT terminal" aesthetic.
    10. The page **must** be responsive.
    11. Unit/integration tests (Jest with RTL) **must** cover all states, rendering of details, player, links. All tests **must** pass.

**Story 3.5: "About" Page Implementation**
* **User Story Statement:** As a User, I want to access a minimalist, responsive "About Page" (based on `app/(pages)/about/page.tsx` from the scaffold) that clearly explains "BMad Daily Digest," its purpose, and how it works, styled consistently, so I can understand the service.
* **Acceptance Criteria (ACs):**
    1.  The `app/(pages)/about/page.tsx` component **must** be implemented.
    2.  It **must** display static informational content (Placeholder: "BMad Daily Digest provides a daily audio summary of top Hacker News discussions for busy tech professionals, generated using AI. Our mission is to keep you informed, efficiently. All content is curated and processed to deliver key insights in an easily digestible audio format, presented with a unique retro-tech vibe.").
    3.  Styling **must** adhere to the "80s retro CRT terminal" aesthetic.
    4.  The page **must** be responsive.
    5.  A link to "About Page" **must** be accessible from site navigation (e.g., via `header.tsx` or `footer.tsx`).
    6.  Unit tests (Jest with RTL) for rendering static content. All tests **must** pass.

**Story 3.6: Frontend Deployment to S3 & CloudFront via CDK**
* **User Story Statement:** As a Developer, I need the Next.js frontend application to be configured for static export (or an equivalent static-first deployment model) and have its AWS infrastructure (S3 for hosting, CloudFront for CDN and HTTPS) defined and managed via its own AWS CDK application within the frontend repository. This setup should automate the build and deployment of the static site, making the "BMad Daily Digest" web application publicly accessible, performant, and cost-effective.
* **Acceptance Criteria (ACs):**
    1.  Next.js app **must** be configured for static export suitable for S3/CloudFront.
    2.  The AWS CDK app within `bmad-daily-digest-frontend/cdk/` (from Story 3.1) **must** define the S3 bucket and CloudFront distribution.
    3.  CDK stack **must** define: S3 bucket (static web hosting), CloudFront distribution (S3 origin, HTTPS via default CloudFront domain or ACM cert for custom domain if specified for MVP, caching, OAC/OAI).
    4.  A `package.json` build script **must** generate the static output.
    5.  The CDK deployment process (`cdk deploy` run via CI or manually for MVP) **must** include steps/hooks to build the Next.js app and sync static files to S3.
    6.  Application **must** be accessible via its CloudFront URL.
    7.  All MVP functionalities **must** be operational on the deployed site.
    8.  HTTPS **must** be enforced.
    9.  CDK code **must** meet project standards. 