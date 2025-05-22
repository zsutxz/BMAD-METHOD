# BMad Daily Digest Frontend Architecture Document

**Version:** 0.1
**Date:** May 20, 2025
**Author:** Jane (Design Architect) & User

## Table of Contents

1.  Introduction
2.  Overall Frontend Philosophy & Patterns
3.  Detailed Frontend Directory Structure
4.  Component Breakdown & Implementation Details
    - Component Naming & Organization
    - Template for Component Specification
    - Example Key Custom Component: `EpisodeCard`
5.  State Management In-Depth
6.  API Interaction Layer (`lib/api-client.ts`)
7.  Routing Strategy
8.  Build, Bundling, and Deployment
9.  Frontend Testing Strategy
10. Accessibility (AX) Implementation Details
11. Performance Considerations
12. Internationalization (i18n) and Localization (l10n) Strategy
13. Feature Flag Management
14. Frontend Security Considerations
15. Browser Support and Progressive Enhancement
16. Change Log

---

## 1\. Introduction

This document details the technical architecture specifically for the frontend of "BMad Daily Digest." It complements the main "BMad Daily Digest" System Architecture Document (v0.1) and the UI/UX Specification (v0.1). This document builds upon the foundational decisions (e.g., overall tech stack, CI/CD, primary testing tools) defined in the System Architecture Document and the visual/UX direction from the UI/UX Specification. The initial frontend structure has been scaffolded using an AI UI generation tool (V0.dev), and this document outlines how that scaffold will be developed into the full MVP application.

- **Link to Main System Architecture Document (REQUIRED):** `docs/architecture.md` (Conceptual path, refers to the doc created by Fred).
- **Link to UI/UX Specification (REQUIRED):** `docs/ui-ux-specification.md` (Conceptual path, refers to the doc we created).
- **Link to Primary Design Files (Figma, Sketch, etc.):** As per UI/UX Spec, detailed visual mockups in separate design files are not planned for MVP. Design is derived from UI/UX Spec and this document.
- **Link to Deployed Storybook / Component Showcase:** Not an initial deliverable for MVP. May evolve post-MVP.
- **Link to Frontend Source Code Repository:** `bmad-daily-digest-frontend` (GitHub).

## 2\. Overall Frontend Philosophy & Patterns

The frontend for "BMad Daily Digest" aims for a unique user experience based on an "80s retro CRT terminal" aesthetic, while being efficient, responsive, and maintainable.

- **Framework & Core Libraries:** Next.js (vLatest stable, e.g., 14.x, using App Router) with React (vLatest stable, e.g., 18.x) and TypeScript. These are derived from the "Definitive Tech Stack Selections" in the System Architecture Document.
- **Component Architecture:**
  - Leverage **shadcn/ui** components as a base for building accessible and customizable UI elements.
  - These components will be heavily themed using **Tailwind CSS** to match the "80s retro CRT terminal" style.
  - Custom components (like `EpisodeCard`, `StoryItem` from the V0 scaffold) will be developed for application-specific needs, following a presentational/container pattern where appropriate, though for many Next.js App Router components, data fetching will be co-located or handled by Server Components if applicable to the static export strategy.
- **State Management Strategy (MVP):**
  - Primarily **local component state** (`useState`, `useReducer`) for UI-specific logic.
  - **React Context API** for simple, shared state if needed across a limited part of the component tree (e.g., `ThemeProvider` from V0 scaffold).
  - No complex global state management library (like Redux or Zustand) is planned for the MVP, as the application's state needs are currently simple (fetching and displaying data). This can be reassessed post-MVP if complexity grows.
- **Data Flow:** Client-side data fetching via the API Interaction Layer (`lib/api-client.ts`) which communicates with the backend API. Next.js App Router conventions for data fetching in pages/components will be used (e.g., `async` Server Components, or `useEffect` in Client Components for data fetching).
- **Styling Approach:**
  - **Tailwind CSS:** Primary utility-first framework for all styling. Configuration in `tailwind.config.ts`.
  - **Global Styles:** Base styles, CSS variable definitions for the theme (e.g., glowing green color, retro fonts), and Tailwind base/components/utilities in `app/globals.css`.
  - The "80s retro CRT terminal" aesthetic (dark mode, glowing green text, monospaced/pixel fonts) is paramount.
- **Key Design Patterns Used:**
  - Server Components & Client Components (Next.js App Router).
  - Custom Hooks (e.g., `use-mobile.tsx`, `use-toast.ts` from V0 scaffold) for reusable logic.
  - Composition over inheritance for UI components.

## 3\. Detailed Frontend Directory Structure

The project structure is based on the initial V0.dev scaffold for `bmad-daily-digest-frontend` and standard Next.js App Router conventions. The `cdk/` directory is added for managing frontend-specific AWS infrastructure.

```plaintext
bmad-daily-digest-frontend/
├── .github/                    # GitHub Actions for CI/CD
│   └── workflows/
│       └── main.yml
├── app/                        # Next.js App Router
│   ├── (pages)/                # Route group for main pages (as per V0 screenshot)
│   │   ├── episodes/           # Route group for episodes
│   │   │   ├── page.tsx          # List Page (e.g., /episodes or /)
│   │   │   └── [episode-id]/     # Dynamic route for episode detail
│   │   │       └── page.tsx      # Detail Page (e.g., /episodes/123)
│   │   └── about/
│   │       └── page.tsx          # About Page (e.g., /about)
│   ├── globals.css             # Global styles, Tailwind base
│   └── layout.tsx              # Root layout, includes ThemeProvider
├── components/                 # UI components
│   ├── ui/                     # Base UI elements (likely shadcn/ui based, themed)
│   ├── episode-card.tsx        # Custom component for episode list items
│   ├── error-state.tsx         # Component for displaying error states
│   ├── footer.tsx              # Footer component
│   ├── header.tsx              # Header component with navigation
│   ├── loading-state.tsx       # Component for displaying loading states
│   └── story-item.tsx          # Component for HN story items on detail page
├── cdk/                        # AWS CDK application for frontend infra (S3, CloudFront)
│   ├── bin/                    # CDK app entry point
│   └── lib/                    # CDK stack definitions
├── hooks/                      # Custom React Hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                        # Utility functions, types, API client
│   ├── data.ts                 # Initial V0 mock data (TO BE REMOVED/REPLACED)
│   ├── types.ts                # Frontend-specific TypeScript types (e.g., API responses)
│   ├── utils.ts                # Utility functions
│   └── api-client.ts           # NEW: Service for backend API communication
├── public/                     # Static assets (e.g., favicons, images if any)
├── styles/                     # Additional global styles or CSS modules (if any)
├── .env.local.example          # Example environment variables
├── .eslintrc.js
├── .gitignore
├── .prettierrc.js
├── components.json             # shadcn/ui configuration
├── jest.config.js
├── next-env.d.ts
├── next.config.mjs             # Next.js configuration
├── package.json
├── package-lock.json
├── postcss.config.js           # For Tailwind CSS
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

**Key Directory Descriptions:**

- `app/`: Core Next.js App Router directory for pages, layouts, and global styles. The `(pages)` group organizes user-facing routes.
- `components/`: Contains reusable React components, with `ui/` for base shadcn/ui elements (customized for the theme) and other files for application-specific composite components (e.g., `episode-card.tsx`).
- `cdk/`: Houses the AWS CDK application for defining and deploying the frontend's S3 bucket and CloudFront distribution.
- `hooks/`: For custom React Hooks providing reusable stateful logic.
- `lib/`: For shared utilities (`utils.ts`), TypeScript type definitions (`types.ts`), and crucially, the `api-client.ts` which will encapsulate all communication with the backend. The initial `data.ts` (mock data from V0) will be phased out as `api-client.ts` is implemented.
- Root configuration files (`next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, etc.) manage the Next.js, Tailwind, and TypeScript settings.

## 4\. Component Breakdown & Implementation Details

Components will be developed adhering to React best practices and Next.js App Router conventions (Server and Client Components). The V0 scaffold provides a good starting point for several components (`episode-card.tsx`, `header.tsx`, etc.) which will be refined and made dynamic.

### a. Component Naming & Organization

- **Naming Convention:** `PascalCase` for component file names and component names themselves (e.g., `EpisodeCard.tsx`, `LoadingState.tsx`). Folder names for components (if grouping) will be `dash-case`.
- **Organization:** Shared, primitive UI elements (heavily themed shadcn/ui components) in `components/ui/`. More complex, domain-specific components directly under `components/` (e.g., `EpisodeCard.tsx`) or grouped into feature-specific subdirectories if the application grows significantly post-MVP.

### b. Template for Component Specification

_(This template should be used when defining new significant components or detailing existing ones that require complex logic or props. For many simple V0-generated presentational components, this level of formal spec might be overkill for MVP if their structure is clear from the code and UI/UX spec)._

#### Component: `{ComponentName}` (e.g., `EpisodeCard`, `StoryItem`)

- **Purpose:** {Briefly describe what this component does and its role.}
- **Source File(s):** {e.g., `components/episode-card.tsx`}
- **Visual Reference from UI/UX Spec:** {Link to relevant section/description in UI/UX Spec or conceptual layout.}
- **Props (Properties):**
  | Prop Name | Type | Required? | Default Value | Description |
  | :-------------- | :------------------------ | :-------- | :------------ | :---------------------------------------- |
  | `{propName}` | `{type}` | Yes/No | N/A | {Description, constraints} |
- **Internal State (if any):**
  | State Variable | Type | Initial Value | Description |
  | :-------------- | :------- | :------------ | :---------------------------------------- |
  | `{stateName}` | `{type}` | `{value}` | {Description} |
- **Key UI Elements / Structure (Conceptual JSX/HTML):** {Describe the primary DOM structure and key elements, especially focusing on thematic styling classes from Tailwind.}
- **Events Handled / Emitted:** {e.g., `onClick` for navigation, custom events.}
- **Actions Triggered (Side Effects):** {e.g., API calls via `apiClient`, state updates.}
- **Styling Notes:** {Key Tailwind classes, specific retro theme applications.}
- **Accessibility Notes:** {ARIA attributes, keyboard navigation specifics.}

### c. Example Key Custom Component: `EpisodeCard.tsx`

_(This is an example of how the template might be briefly applied to an existing V0 component that needs to be made dynamic)._

- **Purpose:** Displays a single episode summary in the Episode List Page, acting as a link to the Episode Detail Page.
- **Source File(s):** `components/episode-card.tsx`
- **Props:**
  | Prop Name | Type | Required? | Description |
  | :---------------------- | :------------------------------------ | :-------- | :----------------------------------------------- |
  | `episode` | `EpisodeListItem` (from `lib/types.ts`) | Yes | Data object for the episode to display. |
- **Key UI Elements / Structure:**
  - A clickable root container (e.g., `Link` component from Next.js).
  - Displays "Episode `episode.episodeNumber`: `episode.publicationDate` - `episode.podcastGeneratedTitle`" using themed text components.
  - Styled with Tailwind to match the "80s retro CRT terminal" aesthetic.
- **Actions Triggered:** Navigates to `/episodes/${episode.episodeId}` on click.
- **Styling Notes:** Uses primary glowing green text on dark background. Clear hover/focus state.
- **Accessibility Notes:** Ensures the entire card is keyboard focusable and clearly indicates it's a link.

## 5\. State Management In-Depth

For the MVP, the state management strategy will be kept simple and align with modern React/Next.js best practices, leveraging built-in capabilities.

- **Chosen Solution(s):**
  - **Local Component State (`useState`, `useReducer`):** This will be the primary method for managing UI-specific state within individual components (e.g., dropdown open/close, input field values, loading states for component-specific data fetches).
  - **React Context API:** Will be used for sharing simple, global-like state that doesn't change frequently, such as theme information (e.g., the `ThemeProvider` from the V0 scaffold if it manages aspects of the dark mode or retro theme dynamically) or potentially user authentication status if added post-MVP. For MVP, its use will be minimal.
  - **URL State:** Next.js App Router's dynamic routes and search parameters will be used to manage state where appropriate (e.g., current `episodeId` in the URL).
- **No Global State Library for MVP:** A dedicated global state management library (e.g., Redux Toolkit, Zustand, Jotai, Zustand) is **not planned for the initial MVP** due to the current simplicity of application-wide state requirements. Data fetching will be handled by components or page-level Server Components, with data passed down via props or managed via React Context if shared across a limited tree. This decision can be revisited post-MVP if state complexity grows.
- **Conventions:**
  - Keep state as close as possible to where it's used.
  - Lift state up only when necessary for sharing between siblings.
  - For data fetched from the API, components will typically manage their own loading/error/data states locally (e.g., using custom hooks that wrap calls to `apiClient.ts`).

## 6\. API Interaction Layer (`lib/api-client.ts`)

This module will encapsulate all communication with the `bmad-daily-digest-backend` API.

- **HTTP Client Setup:**
  - Will use the browser's native **`Workspace` API**, wrapped in utility functions within `api-client.ts` for ease of use, error handling, and request/response processing.
  - The Backend API Base URL will be sourced from the `NEXT_PUBLIC_BACKEND_API_URL` environment variable.
  - The "Frontend Read API Key" (if decided upon for backend API access, as discussed with Fred) will be sourced from `NEXT_PUBLIC_FRONTEND_API_KEY` and included in requests via the `x-api-key` header.
- **Service Functions (examples):**
  - `async function getEpisodes(): Promise<EpisodeListItem[]>`: Fetches the list of all episodes.
  - `async function getEpisodeDetails(episodeId: string): Promise<EpisodeDetail | null>`: Fetches details for a specific episode.
  - These functions will handle constructing request URLs, adding necessary headers (API Key, `Content-Type: application/json` for POST/PUT if any), making the `Workspace` call, parsing JSON responses, and transforming data into the frontend TypeScript types defined in `lib/types.ts`.
- **Error Handling:**
  - The `api-client.ts` functions will implement robust error handling for network issues and non-successful HTTP responses from the backend.
  - Errors will be processed and returned in a consistent format (e.g., throwing a custom `ApiError` object or returning a result object like `{ data: null, error: { message: string, status?: number } }`) that UI components can easily consume to display appropriate feedback to the user (using `error-state.tsx` component).
  - Detailed errors will be logged to the browser console for debugging during development.
- **Data Types:** All request and response payloads will be typed using interfaces defined in `lib/types.ts`, aligning with the backend API's data models.

## 7\. Routing Strategy

Routing will be handled by the **Next.js App Router**, leveraging its file-system based routing conventions.

- **Routing Library:** Next.js App Router (built-in).
- **Route Definitions (MVP):**
  | Path Pattern | Page Component File Path (`app/...`) | Protection | Notes |
  | :--------------------- | :------------------------------------------ | :------------- | :---------------------------------- |
  | `/` or `/episodes` | `(pages)/episodes/page.tsx` | Public | Episode List Page (Homepage) |
  | `/episodes/[episodeId]`| `(pages)/episodes/[episodeId]/page.tsx` | Public | Episode Detail Page (Dynamic route) |
  | `/about` | `(pages)/about/page.tsx` | Public | About Page |
- **Route Guards / Protection (MVP):** No specific client-side route protection (e.g., auth guards) is required for the MVP, as all content is public. The backend API endpoints used by the frontend are protected by an API Key.

## 8\. Build, Bundling, and Deployment

This section aligns with the "Frontend Deployment to S3 & CloudFront via CDK" (Story 3.6) from the PRD and System Architecture Document.

- **Build Process & Scripts (`package.json`):**
  - `"dev": "next dev"`: Starts the Next.js development server.
  - `"build": "next build"`: Builds the application for production. For static export, this may be followed by `next export` if using an older Next.js pattern, or newer Next.js versions handle static/hybrid output more directly with the build command for S3/CloudFront compatible deployment. We will aim for a fully static export if all pages support it.
  - `"start": "next start"`: Starts a production server (less relevant for pure SSG to S3, but good for local production testing).
  - `"lint": "next lint"`
  - `"test": "jest"`
- **Environment Configuration Management:**
  - Public environment variables (prefixed with `NEXT_PUBLIC_`) like `NEXT_PUBLIC_BACKEND_API_URL` and `NEXT_PUBLIC_FRONTEND_API_KEY` will be managed via `.env.local` (gitignored), `.env.development`, `.env.production` files, and corresponding build-time environment variables in the CI/CD deployment process.
- **Key Bundling Optimizations (largely handled by Next.js):**
  - **Code Splitting:** Automatic per-page code splitting by Next.js. Dynamic imports (`next/dynamic` or `React.lazy`) can be used for further component-level splitting if needed post-MVP.
  - **Tree Shaking:** Handled by Next.js's underlying Webpack/SWC bundler.
  - **Lazy Loading:** Next.js `next/image` component for image lazy loading. `next/dynamic` for component lazy loading.
  - **Minification & Compression:** Handled by Next.js production build.
- **Deployment to S3/CloudFront (via Frontend CDK App):**
  - The `next build` (and potentially `next export` if using that pattern) output will be synced to an AWS S3 bucket configured for static website hosting.
  - An AWS CloudFront distribution will serve the content from S3, providing CDN caching, HTTPS, and custom domain support (post-MVP for custom domain).
  - The CDK app in the `bmad-daily-digest-frontend` repository will manage this S3 bucket and CloudFront distribution.

## 9\. Frontend Testing Strategy

This elaborates on the "Overall Testing Strategy" from the System Architecture Document, focusing on frontend specifics. E2E testing with Playwright is post-MVP.

- **Tools:** Jest with React Testing Library (RTL) for unit and component integration tests.
- **Unit Tests:**
  - **Scope:** Individual utility functions, custom hooks, and simple presentational components.
  - **Focus:** Logic correctness, handling of different inputs/props.
- **Component Tests / UI Integration Tests (using RTL):**
  - **Scope:** Testing individual React components or small groups of interacting components in isolation from the full application, but verifying their rendering, interactions, and basic state changes.
  - **Focus:** Correct rendering based on props/state, user interactions (clicks, form inputs if any using `@testing-library/user-event`), event emission, accessibility attributes. API calls from components (via `apiClient.ts`) will be mocked.
  - **Location:** Co-located with components (e.g., `MyComponent.test.tsx`).
- **Test Coverage:** Aim for meaningful coverage of critical components and logic (\>70-80% as a guideline). Quality over quantity.
- **Mocking:** Jest mocks for API service layer (`apiClient.ts`), Next.js router (`next/router` or `next/navigation`), and any browser APIs not available in JSDOM.

## 10\. Accessibility (AX) Implementation Details

This section details how the AX requirements from the UI/UX Specification will be technically implemented.

- **Semantic HTML:** Prioritize using correct HTML5 elements (e.g., `<nav>`, `<main>`, `<article>`, `<button>`) as provided by Next.js and React, or within custom JSX, to ensure inherent accessibility.
- **ARIA Implementation:** `shadcn/ui` components generally provide good ARIA support out-of-the-box. For any custom components or interactions not covered, appropriate ARIA roles, states, and properties will be added as per WAI-ARIA authoring practices.
- **Keyboard Navigation:** Ensure all interactive elements (links, custom components from shadcn/ui, audio player) are focusable and operable via keyboard. Logical focus order will be maintained. Focus visible styles will adhere to the retro theme (e.g., brighter green outline or block cursor).
- **Focus Management:** For any future modals or dynamic UI changes that might trap focus, proper focus management techniques will be implemented.
- **Contrast & Theming:** The "80s retro CRT terminal" theme (glowing green on dark) requires careful selection of shades to meet WCAG AA contrast ratios for text. This will be verified using accessibility tools during development and testing.
- **Testing Tools for AX:**
  - Browser extensions like Axe DevTools or WAVE during development.
  - Automated checks using `jest-axe` for component tests where applicable.
  - Lighthouse accessibility audits in browser developer tools.
  - Manual keyboard navigation and screen reader (e.g., NVDA, VoiceOver) checks for key user flows.

## 11\. Performance Considerations

Frontend performance is key for a good user experience, especially for busy executives.

- **Next.js Optimizations:** Leverage built-in Next.js features:
  - Static Site Generation (SSG) for all pages where possible for fastest load times.
  - `next/image` for optimized image loading (formats, sizes, lazy loading), though MVP is text-heavy.
  - `next/font` for optimized web font loading if custom retro fonts are used.
  - Automatic code splitting.
- **Minimizing Re-renders (React):** Use `React.memo` for components that render frequently with the same props. Optimize data structures passed as props. Use `useCallback` and `useMemo` judiciously for expensive computations or to preserve reference equality for props.
- **Bundle Size:** Monitor frontend bundle size. While Next.js optimizes, be mindful of large dependencies. Use dynamic imports for non-critical, large components/libraries if they arise post-MVP.
- **Efficient Data Fetching:** Ensure API calls via `apiClient.ts` are efficient and only fetch necessary data for each view.
- **Debouncing/Throttling:** Not anticipated for MVP core features, but if any real-time input features were added post-MVP (e.g., search), these techniques would be applied.
- **Performance Monitoring Tools:** Browser DevTools (Lighthouse, Performance tab), Next.js build output analysis.

## 12\. Internationalization (i18n) and Localization (l10n) Strategy

- **Not a requirement for MVP.** The application will be developed in English only. This can be revisited post-MVP if there's a need to support other languages.

## 13\. Feature Flag Management

- **Not a requirement for MVP.** No complex feature flagging system will be implemented for the initial release. New features will be released directly.

## 14\. Frontend Security Considerations

Aligns with "Security Best Practices" in the System Architecture Document.

- **XSS Prevention:** Rely on React's JSX auto-escaping. Avoid `dangerouslySetInnerHTML`.
- **API Key Handling:** The `NEXT_PUBLIC_FRONTEND_API_KEY` for accessing the backend API will be embedded in the static build. While "public," it's specific to this frontend and can be rotated if necessary. This key should grant minimal (read-only) privileges on the backend.
- **Third-Party Scripts:** Minimize use for MVP. If any are added (e.g., analytics post-MVP), vet for security and use Subresource Integrity (SRI) if loaded from CDNs.
- **HTTPS:** Enforced by CloudFront.
- **Dependency Vulnerabilities:** `npm audit` in CI.

## 15\. Browser Support and Progressive Enhancement

- **Target Browsers:** Latest 2 stable versions of modern evergreen browsers (Chrome, Firefox, Safari, Edge). Internet Explorer is NOT supported.
- **Polyfill Strategy:** Next.js handles most necessary polyfills based on browser targets and features used. `core-js` might be implicitly included.
- **JavaScript Requirement:** The application is a Next.js (React) Single Page Application and **requires JavaScript to be enabled** for all functionality. No significant progressive enhancement for non-JS environments is planned for MVP.
- **CSS Compatibility:** Use Tailwind CSS with Autoprefixer (handled by Next.js build process) to ensure CSS compatibility with target browsers.

## 16\. Change Log

| Version | Date         | Author                         | Summary of Changes                                   |
| :------ | :----------- | :----------------------------- | :--------------------------------------------------- |
| 0.1     | May 20, 2025 | Jane (Design Architect) & User | Initial draft of the Frontend Architecture Document. |
