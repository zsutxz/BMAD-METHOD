# BMad DiCaster Frontend Architecture Document

## Table of Contents

- [Introduction](#introduction)
- [Overall Frontend Philosophy & Patterns](#overall-frontend-philosophy--patterns)
- [Detailed Frontend Directory Structure](#detailed-frontend-directory-structure)
- [Component Breakdown & Implementation Details](#component-breakdown--implementation-details)
  - [Component Naming & Organization](#component-naming--organization)
  - [Template for Component Specification](#template-for-component-specification)
- [State Management In-Depth](#state-management-in-depth)
  - [Chosen Solution](#chosen-solution)
  - [Rationale](#rationale)
  - [Store Structure / Slices](#store-structure--slices)
  - [Key Selectors](#key-selectors)
  - [Key Actions / Reducers / Thunks](#key-actions--reducers--thunks)
- [API Interaction Layer](#api-interaction-layer)
  - [Client/Service Structure](#clientservice-structure)
  - [Error Handling & Retries (Frontend)](#error-handling--retries-frontend)
- [Routing Strategy](#routing-strategy)
  - [Routing Library](#routing-library)
  - [Route Definitions](#route-definitions)
  - [Route Guards / Protection](#route-guards--protection)
- [Build, Bundling, and Deployment](#build-bundling-and-deployment)
  - [Build Process & Scripts](#build-process--scripts)
  - [Key Bundling Optimizations](#key-bundling-optimizations)
  - [Deployment to CDN/Hosting](#deployment-to-cdnhosting)
- [Frontend Testing Strategy](#frontend-testing-strategy)
  - [Link to Main Testing Strategy](#link-to-main-testing-strategy)
  - [Component Testing](#component-testing)
  - [UI Integration/Flow Testing](#ui-integrationflow-testing)
  - [End-to-End UI Testing Tools & Scope](#end-to-end-ui-testing-tools--scope)
- [Accessibility (AX) Implementation Details](#accessibility-ax-implementation-details)
- [Performance Considerations](#performance-considerations)
- [Change Log](#change-log)

## Introduction

This document details the technical architecture specifically for the frontend of BMad DiCaster. It complements the main BMad DiCaster Architecture Document and the UI/UX Specification. The goal is to provide a clear blueprint for frontend development, ensuring consistency, maintainability, and alignment with the overall system design and user experience goals.

- **Link to Main Architecture Document:** `docs/architecture.md` (Note: The overall system architecture, including Monorepo/Polyrepo decisions and backend structure, will influence frontend choices, especially around shared code or API interaction patterns.)
- **Link to UI/UX Specification:** `docs/ui-ux-spec.txt`
- **Link to Primary Design Files (Figma, Sketch, etc.):** N/A (Low-fidelity wireframes described in `docs/ui-ux-spec.txt`; detailed mockups to be created during development)
- **Link to Deployed Storybook / Component Showcase (if applicable):** N/A (To be developed)

## Overall Frontend Philosophy & Patterns

The frontend for BMad DiCaster will be built using modern, efficient, and maintainable practices, leveraging the Vercel/Supabase Next.js App Router template as a starting point. The core philosophy is to create a responsive, fast-loading, and accessible user interface that aligns with the "synthwave technical glowing purple vibes" aesthetic.

- **Framework & Core Libraries:**

  - **Next.js (Latest, e.g., 14.x.x, App Router):** Chosen for its robust full-stack capabilities, server-side rendering (SSR) and static site generation (SSG) options, optimized performance, and seamless integration with Vercel for deployment. The App Router will be used for routing and layouts. [cite_start] (Version: `latest`, aligned with `architecture.txt` [cite: 187, 188])
  - **React (19.0.0):** As the underlying UI library for Next.js, React's component-based architecture allows for modular and reusable UI elements. [cite_start] (Version: `19.0.0`, aligned with `architecture.txt` [cite: 190, 191])
  - **TypeScript (5.7.2):** For strong typing, improved code quality, and better developer experience. [cite_start] (Version: `5.7.2`, aligned with `architecture.txt` [cite: 178, 179])

- **Component Architecture:**

  - **Shadcn UI (Latest):** This collection of reusable UI components, built on Radix UI and Tailwind CSS, will be used for foundational elements like buttons, cards, dialogs, etc. Components will be added via its CLI, making them directly part of our codebase and easily customizable. [cite_start] (Aligned with `architecture.txt` [cite: 198, 199])
  - **Application-Specific Components:** Custom components will be developed for unique UI parts not covered by Shadcn UI (e.g., `NewsletterCard`, `PodcastPlayer`). These will be organized within `app/components/core/`.
  - **Structure:** Components will primarily be Server Components by default for optimal performance, with Client Components (`"use client"`) adopted only when interactivity or browser-specific APIs are required (e.g., event handlers, state hooks).

- **State Management Strategy:**

  - **Zustand (Latest):** A lightweight, unopinionated, and simple state management solution for React. It will be used for managing global client-side state that needs to be shared across multiple components, such as UI state (e.g., podcast player status). [cite_start] (Aligned with `architecture.txt` [cite: 228, 229])
  - **React Context API / Server Components:** For simpler state-sharing scenarios or passing data down component trees where Zustand might be overkill, React Context or relying on Next.js Server Component props will be preferred.

- **Data Flow:**

  - **Unidirectional Data Flow:** Data will primarily flow from Server Components (fetching data from Supabase) down to Client Components via props.
  - **Server Actions / Route Handlers:** For mutations or actions triggered from Client Components (e.g., future admin functionalities), Next.js Server Actions or dedicated API Route Handlers will be used to interact with the backend, which in turn updates the Supabase database. Data revalidation (e.g., using `revalidatePath` or `revalidateTag`) will be used to refresh data in Server Components.
  - **Supabase Client:** The Supabase JS client (from `utils/supabase/client.ts` for client components and `utils/supabase/server.ts` for server components/actions) will be the primary means of interacting with the Supabase backend for data fetching and mutations.

- **Styling Approach:**

  - **Tailwind CSS (3.4.17):** A utility-first CSS framework for rapid UI development and consistent styling. It will be used for all styling, including achieving the "synthwave technical glowing purple vibes." [cite_start] (Version `3.4.17`, aligned with `architecture.txt` [cite: 194, 195])
  - **Shadcn UI:** Leverages Tailwind CSS for its components.
  - **Global Styles:** `app/globals.css` will be used for base Tailwind directives and any genuinely global style definitions.
  - [cite_start] **Theme Customization:** `tailwind.config.ts` will be used to extend Tailwind's default theme with custom colors (e.g., synthwave purples like `#800080` as an accent [cite: 584]), fonts, or spacing as needed to achieve the desired aesthetic. The "synthwave technical glowing purple vibes" will be achieved through a dark base theme, with purple accents for interactive elements, highlights, and potentially subtle text shadows or glows on specific headings or decorative elements. [cite_start] Font choices will lean towards modern, clean sans-serifs as specified in `ux-ui-spec.txt`[cite: 585], potentially with a more stylized font for major headings if it fits the theme without compromising readability.

- **Key Design Patterns Used:**
  - **Server Components & Client Components:** Utilizing Next.js App Router paradigm.
  - **Hooks:** Extensive use of React hooks (`useState`, `useEffect`, `useContext`) and custom hooks for reusable logic.
  - **Provider Pattern:** For React Context API usage when necessary.
  - **Facade Pattern (Conceptual for API Interaction):** The Supabase client libraries (`utils/supabase/client.ts`, `utils/supabase/server.ts`) act as a facade abstracting direct database interactions. Data fetching logic will be encapsulated in Server Components or specific data-fetching functions.

## Detailed Frontend Directory Structure

The BMad DiCaster frontend will adhere to the Next.js App Router conventions and build upon the structure provided by the Vercel/Supabase Next.js App Router template. The monorepo structure defined in the main Architecture Document (`docs/architecture.md`) already outlines the top-level directories. This section details the frontend-specific organization.

**Naming Conventions Adopted:**

- **Directories:** `kebab-case` (e.g., `app/(web)/newsletter-list/`, `app/components/core/`)
- **React Component Files (.tsx):** `PascalCase.tsx` (e.g., `NewsletterCard.tsx`, `PodcastPlayer.tsx`). Next.js App Router special files (e.g., `page.tsx`, `layout.tsx`, `loading.tsx`, `global-error.tsx`, `not-found.tsx`) retain their conventional lowercase or kebab-case names.
- **Non-Component TypeScript Files (.ts):** Primarily `camelCase.ts` (e.g., `utils.ts`, `uiSlice.ts`). Configuration files (e.g., `tailwind.config.ts`) and shared type definition files (e.g., `api-schemas.ts`, `domain-models.ts`) may retain `kebab-case` as per common practice or previous agreement.

```plaintext
{project-root}/
├── app/                        # Next.js App Router (Frontend Pages, Layouts, API Routes)
│   ├── (web)/                  # Group for user-facing web pages
│   │   ├── newsletters/        # Route group for newsletter features
│   │   │   ├── [newsletterId]/ # Dynamic route for individual newsletter detail
│   │   │   │   ├── page.tsx    # Newsletter Detail Page component
│   │   │   │   └── loading.tsx # Optional: Loading UI for this route
│   │   │   ├── page.tsx        # Newsletter List Page component
│   │   │   └── layout.tsx      # Optional: Layout specific to /newsletters routes
│   │   ├── layout.tsx          # Root layout for all (web) pages
│   │   └── page.tsx            # Homepage (displays newsletter list)
[cite_start] │   ├── (api)/                  # API route handlers (as defined in main architecture [cite: 82, 127, 130, 133])
│   │   ├── system/
│   │   │   └── ...
│   │   └── webhooks/
│   │       └── ...
│   ├── components/             # Application-specific UI React components (Core Logic)
│   │   ├── core/               # Core, reusable application components
│   │   │   ├── NewsletterCard.tsx
│   │   │   ├── PodcastPlayer.tsx
│   │   │   ├── DownloadButton.tsx
│   │   │   └── BackButton.tsx
│   │   └── layout/             # General layout components
│   │       └── PageWrapper.tsx   # Consistent padding/max-width for pages
│   ├── auth/                   # Auth-related pages and components (from template, MVP frontend is public)
│   ├── login/page.tsx          # Login page (from template, MVP frontend is public)
│   └── global-error.tsx        # Optional: Custom global error UI (Next.js special file)
│   └── not-found.tsx           # Optional: Custom 404 page UI (Next.js special file)
[cite_start] ├── components/                 # Shadcn UI components root (as configured by components.json [cite: 92])
│   └── ui/                     # Base UI elements from Shadcn (e.g., Button.tsx, Card.tsx)
[cite_start] ├── lib/                        # General utility functions for frontend [cite: 86, 309]
│   ├── utils.ts                # General utility functions (date formatting, etc.)
│   └── hooks/                  # Custom global React hooks
│       └── useScreenWidth.ts   # Example custom hook
├── store/                      # Zustand state management
│   ├── index.ts                # Main store setup/export (can be store.ts or index.ts)
│   └── slices/                 # Individual state slices
│       └── podcastPlayerSlice.ts # State for the podcast player
[cite_start] ├── public/                     # Static assets (images, favicon, etc.) [cite: 89]
[cite_start] │   └── logo.svg                # Application logo (to be provided [cite: 379])
[cite_start] ├── shared/                     # Shared code/types between frontend and Supabase functions [cite: 89, 97]
│   └── types/
│       ├── api-schemas.ts      # Zod schemas for API req/res
│       └── domain-models.ts    # Core entity types (HNPost, Newsletter, etc. from main arch)
[cite_start] ├── styles/                     # Global styles [cite: 90]
│   └── globals.css             # Tailwind base styles, custom global styles
[cite_start] ├── utils/                      # Root utilities (from template [cite: 91])
[cite_start] │   └── supabase/               # Supabase helper functions FOR FRONTEND (from template [cite: 92, 309])
│       ├── client.ts           # Client-side Supabase client
[cite_start] │       ├── middleware.ts       # Logic for Next.js middleware (Supabase auth [cite: 92, 311])
│       └── server.ts           # Server-side Supabase client
[cite_start] ├── tailwind.config.ts          # Tailwind CSS configuration [cite: 93]
[cite_start] └── tsconfig.json               # TypeScript configuration (includes path aliases like @/* [cite: 101])
```

### Notes on Frontend Structure:

- **`app/(web)/`**: Route group for user-facing pages.
  - [cite\_start] **`newsletters/page.tsx`**: Server Component for listing newsletters. [cite: 375, 573]
  - [cite\_start] **`newsletters/[newsletterId]/page.tsx`**: Server Component for displaying a single newsletter. [cite: 376, 576]
- **`app/components/core/`**: Houses application-specific React components like `NewsletterCard.tsx`, `PodcastPlayer.tsx`, `DownloadButton.tsx`, `BackButton.tsx` (identified in `ux-ui-spec.txt`). Components follow `PascalCase.tsx`.
- **`app/components/layout/`**: For structural layout components, e.g., `PageWrapper.tsx`. Components follow `PascalCase.tsx`.
- **`components/ui/`**: Standard directory for Shadcn UI components (e.g., `Button.tsx`, `Card.tsx`).
- **`lib/hooks/`**: Custom React hooks (e.g., `useScreenWidth.ts`), files follow `camelCase.ts`.
- **`store/slices/`**: Zustand state slices. `podcastPlayerSlice.ts` for podcast player state. Files follow `camelCase.ts`.
- **`shared/types/`**: Type definitions. `api-schemas.ts` and `domain-models.ts` use `kebab-case.ts`.
- **`utils/supabase/`**: Template-provided Supabase clients. Files follow `camelCase.ts`.
- [cite\_start] **Path Aliases**: `tsconfig.json` uses `@/*` aliases. [cite: 98, 101]

## Component Breakdown & Implementation Details

This section outlines the conventions and templates for defining UI components. While a few globally shared or foundational components (e.g., main layout structures) might be specified here upfront to ensure consistency, the detailed specification for most feature-specific components will emerge as user stories are implemented. The key is for the development team (or AI agent) to follow the "Template for Component Specification" below whenever a new component is identified for development.

### Component Naming & Organization

- **Component File Naming:**

  - React component files will use `PascalCase.tsx`. For example, `NewsletterCard.tsx`, `PodcastPlayer.tsx`.
  - Next.js special files like `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, and `not-found.tsx` will use their conventional lowercase or kebab-case names.

- **Component Organization (Reiteration from Directory Structure):**

  - **Application-Specific Core Components:** Reusable components specific to BMad DiCaster (e.g., `NewsletterCard`, `PodcastPlayer`) will reside in `app/components/core/`.
  - **Application-Specific Layout Components:** Components used for structuring page layouts (e.g., `PageWrapper.tsx`) will reside in `app/components/layout/`.
  - **Shadcn UI Components:** Components added via the Shadcn UI CLI will reside in `components/ui/` (e.g., `Button.tsx`, `Card.tsx`).
  - **Page-Specific Components:** If a component is complex but _only_ used on a single page, it can be co-located with that page's route file, for instance, in a `components` subfolder within that route's directory. However, the preference is to place reusable components in `app/components/core/` or `app/components/layout/`.

### Template for Component Specification

This template should be used to define and document each significant UI component identified from the UI/UX Specification (`docs/ui-ux-spec.txt`) and any subsequent design iterations. The goal is to provide sufficient detail for a developer or an AI agent to implement the component with minimal ambiguity. Most feature-specific components will be detailed emergently during development, following this template.

---

#### Component: `{ComponentName}` (e.g., `NewsletterCard`, `PodcastPlayerControls`)

- **Purpose:** {Briefly describe what this component does and its primary role in the user interface. What user need does it address?}
- **Source File(s):** {e.g., `app/components/core/NewsletterCard.tsx`}
- **Visual Reference:** {Link to specific Figma frame/component if available, or a detailed description/sketch if not. If based on a Shadcn UI component, note that and any key customizations.}
- **Props (Properties):**
  {List each prop the component accepts. Specify its name, TypeScript type, whether it's required, any default value, and a clear description.}
  | Prop Name | Type | Required? | Default Value | Description |
  | :------------ | :------------------------------------ | :-------- | :------------ | :--------------------------------------------------- |
  | `exampleProp` | `string` | Yes | N/A | Example string prop. |
  | `items` | `Array<{id: string, name: string}>` | Yes | N/A | An array of item objects to display. |
  | `variant` | `'primary' \| 'secondary'` | No | `'primary'` | Visual variant of the component. |
  | `onClick` | `(event: React.MouseEvent) => void` | No | N/A | Optional click handler. |
- **Internal State (if any):**
  {Describe any significant internal state the component manages using React hooks (e.g., `useState`).}
  | State Variable | Type | Initial Value | Description |
  | :---------------- | :-------- | :------------ | :------------------------------------------------ |
  | `isLoading` | `boolean` | `false` | Tracks if data for the component is loading. |
  | `selectedItem` | `string \| null` | `null` | Stores the ID of the currently selected item. |
- **Key UI Elements / Structure (Conceptual):**
  {Describe the main visual parts of the component and their general layout. Reference Shadcn UI components if used as building blocks.}
  ```jsx
  // Example for a Card component
  <Card>
    <CardHeader>
      <CardTitle>{"{titleProp}"}</CardTitle>
      <CardDescription>{"{descriptionProp}"}</CardDescription>
    </CardHeader>
    <CardContent>{/* {list of items or main content} */}</CardContent>
    <CardFooter>{/* {action buttons or footer content} */}</CardFooter>
  </Card>
  ```
- **Events Handled / Emitted:**
  - **Handles:** {List significant DOM events the component handles directly.}
  - **Emits (Callbacks):** {If the component uses props to emit events (callbacks) to its parent, list them here.}
- **Actions Triggered (Side Effects):**
  - **State Management (Zustand):** {If the component interacts with a Zustand store, specify which store and actions.}
  - **API Calls / Data Fetching:** {Specify how Client Components trigger mutations or re-fetches (e.g., Server Actions).}
- **Styling Notes:**
  - {Reference to specific Shadcn UI components used.}
  - {Key Tailwind CSS classes or custom styles for the "synthwave" theme.}
  - {Specific responsiveness behavior.}
- **Accessibility (AX) Notes:**
  - {Specific ARIA attributes needed.}
  - {Keyboard navigation considerations.}
  - {Focus management details.}
  - {Notes on color contrast.}

---

_This template will be applied to each new significant component during the development process._

## State Management In-Depth

This section expands on the State Management strategy chosen (Zustand) and outlined in the "Overall Frontend Philosophy & Patterns".

- [cite\_start] **Chosen Solution:** **Zustand** (Latest version, as per `architecture.txt` [cite: 228, 229])
- **Rationale:** Zustand was chosen for its simplicity, small bundle size, and unopinionated nature, suitable for BMad DiCaster's relatively simple frontend state needs (e.g., podcast player status). Server-side data is primarily managed by Next.js Server Components.

### Store Structure / Slices

Global client-side state will be organized into distinct "slices" within `store/slices/`. Components can import and use individual stores directly.

- **Conventions:**
  - Each slice in its own file: `store/slices/camelCaseSlice.ts`.
  - Define state interface, initial state, and action functions.
- **Core Slice: `podcastPlayerSlice.ts`** (for MVP)

  - **Purpose:** Manages the state of the podcast player (current track, playback status, time, volume).
  - **Source File:** `store/slices/podcastPlayerSlice.ts`
  - **State Shape (Example):**

    ```typescript
    interface PodcastTrack {
      id: string; // Could be newsletterId or a specific audio ID
      title: string;
      audioUrl: string;
      duration?: number; // in seconds
    }

    interface PodcastPlayerState {
      currentTrack: PodcastTrack | null;
      isPlaying: boolean;
      currentTime: number; // in seconds
      volume: number; // 0 to 1
      isLoading: boolean;
      error: string | null;
    }

    interface PodcastPlayerActions {
      loadTrack: (track: PodcastTrack) => void;
      play: () => void;
      pause: () => void;
      setCurrentTime: (time: number) => void;
      setVolume: (volume: number) => void;
      setError: (message: string | null) => void;
      resetPlayer: () => void;
    }
    ```

  - **Key Actions:** `loadTrack`, `play`, `pause`, `setCurrentTime`, `setVolume`, `setError`, `resetPlayer`.
  - **Zustand Store Definition:**

    ```typescript
    import { create } from "zustand";

    // Previously defined interfaces: PodcastTrack, PodcastPlayerState, PodcastPlayerActions

    const initialPodcastPlayerState: PodcastPlayerState = {
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      volume: 0.75,
      isLoading: false,
      error: null,
    };

    export const usePodcastPlayerStore = create<
      PodcastPlayerState & PodcastPlayerActions
    >((set) => ({
      ...initialPodcastPlayerState,
      loadTrack: (track) =>
        set({
          currentTrack: track,
          isLoading: true, // Assume loading until actual audio element confirms
          error: null,
          isPlaying: false, // Usually don't autoplay on load
          currentTime: 0,
        }),
      play: () =>
        set((state) => {
          if (!state.currentTrack) return {}; // No track loaded
          return { isPlaying: true, isLoading: false, error: null };
        }),
      pause: () => set({ isPlaying: false }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      setError: (message) =>
        set({ error: message, isLoading: false, isPlaying: false }),
      resetPlayer: () => set({ ...initialPodcastPlayerState }),
    }));
    ```

### Key Selectors

Selectors are functions that derive data from the store state. With Zustand, state is typically accessed directly from the hook, but memoized selectors can be created with libraries like `reselect` if complex derived data is needed, though for simple cases direct access is fine.

- **Convention:** For direct state access, components will use: `const { currentTrack, isPlaying, play } = usePodcastPlayerStore();`
- **Example Selectors (if using `reselect` or similar, for more complex derivations later):**
  - `selectCurrentTrackTitle`: Returns `state.currentTrack?.title || 'No track loaded'`.
  - `selectIsPodcastPlaying`: Returns `state.isPlaying`.

### Key Actions / Reducers / Thunks

Zustand actions are functions defined within the `create` call that use `set` to update state. Asynchronous operations (like fetching data, though less common for Zustand which is often for UI state) can be handled by calling async functions within these actions and then calling `set` upon completion.

- **Convention:** Actions are part of the store hook: `const { loadTrack } = usePodcastPlayerStore();`.
- **Asynchronous Example (Conceptual, if a slice needed to fetch data):**
  ```typescript
  // In a hypothetical userSettingsSlice.ts
  // fetchUserSettings: async () => {
  //   set({ isLoading: true });
  //   try {
  //     const settings = await api.fetchUserSettings(); // api is an imported service
  //     set({ userSettings: settings, isLoading: false });
  //   } catch (error) {
  //     set({ error: 'Failed to fetch settings', isLoading: false });
  //   }
  // }
  ```
  For BMad DiCaster MVP, most data fetching is via Server Components. Client-side async actions in Zustand would primarily be for client-specific operations not directly tied to server data fetching.

## API Interaction Layer

The frontend will interact with Supabase for data. Server Components will fetch data directly using server-side Supabase client. Client Components needing to mutate data or trigger backend logic will use Next.js Server Actions or, if necessary, dedicated Next.js API Route Handlers which then interact with Supabase.

### Client/Service Structure

- **HTTP Client Setup (for Next.js API Route Handlers, if used extensively):**

  - While Server Components and Server Actions are preferred for Supabase interactions, if direct calls from client to custom Next.js API routes are needed, a simple `Workspace` wrapper or a lightweight client like `ky` could be used.
  - The Vercel/Supabase template provides `utils/supabase/client.ts` (for client-side components) and `utils/supabase/server.ts` (for Server Components, Route Handlers, Server Actions). These will be the primary interfaces to Supabase.
  - **Base URL:** Not applicable for direct Supabase client usage. For custom API routes: relative paths (e.g., `/api/my-route`).
  - **Authentication:** The Supabase clients handle auth token management. [cite\_start] For custom API routes, Next.js middleware (`middleware.ts` [cite: 92, 311]) would handle session verification.

- **Service Definitions (Conceptual for Supabase Data Access):**

  - No separate "service" files like `userService.ts` are strictly necessary for data fetching with Server Components. Data fetching logic will be co-located with the Server Components or within Server Actions.
  - **Example (Data fetching in a Server Component):**

    ```typescript
    // app/(web)/newsletters/page.tsx
    import { createClient } from "@/utils/supabase/server";
    import NewsletterCard from "@/app/components/core/NewsletterCard"; // Corrected path

    export default async function NewsletterListPage() {
      const supabase = createClient();
      const { data: newsletters, error } = await supabase
        .from("newsletters")
        .select("id, title, target_date, podcast_url") // Add podcast_url
        .order("target_date", { ascending: false });

      if (error) console.error("Error fetching newsletters:", error);
      // Render newsletters or error state
    }
    ```

  - **Example (Server Action for a hypothetical "subscribe" feature - future scope):**

    ```typescript
    // app/actions/subscribeActions.ts
    "use server";
    import { createClient } from "@/utils/supabase/server";
    import { z } from "zod";
    import { revalidatePath } from "next/cache";

    const EmailSchema = z.string().email();

    export async function subscribeToNewsletter(email: string) {
      const validation = EmailSchema.safeParse(email);
      if (!validation.success) {
        return { error: "Invalid email format." };
      }
      const supabase = createClient();
      const { error } = await supabase
        .from("subscribers")
        .insert({ email: validation.data });
      if (error) {
        return { error: "Subscription failed." };
      }
      revalidatePath("/"); // Example path revalidation
      return { success: true };
    }
    ```

### Error Handling & Retries (Frontend)

- **Server Component Data Fetching Errors:** Errors from Supabase in Server Components should be caught. The component can then render an appropriate error UI or pass error information as props. Next.js error handling (e.g. `error.tsx` files) can also be used for unrecoverable errors.
- **Client Component / Server Action Errors:**
  - Server Actions should return structured responses (e.g., `{ success: boolean, data?: any, error?: string }`). Client Components calling Server Actions will handle these responses to update UI (e.g., display error messages, toast notifications).
  - Shadcn UI includes a `Toast` component which can be used for non-modal error notifications.
- **UI Error Boundaries:** React Error Boundaries can be implemented at key points in the component tree (e.g., around major layout sections or complex components) to catch rendering errors in Client Components and display a fallback UI, preventing a full app crash. A root `global-error.tsx` can serve as a global boundary.
- **Retry Logic:** Generally, retry logic for data fetching should be handled by the user (e.g., a "Try Again" button) rather than automatic client-side retries for MVP, unless dealing with specific, known transient issues. Supabase client libraries might have their own internal retry mechanisms for certain types of network errors.

## Routing Strategy

Navigation and routing will be handled by the Next.js App Router.

- [cite\_start] **Routing Library:** **Next.js App Router** (as per `architecture.txt` [cite: 187, 188, 308])

### Route Definitions

[cite\_start] Based on `ux-ui-spec.txt` and PRD[cite: 352, 375, 376].

| Path Pattern                  | Component/Page (`app/(web)/...`)      | Protection | Notes                                                                       |
| :---------------------------- | :------------------------------------ | :--------- | :-------------------------------------------------------------------------- |
| `/`                           | `newsletters/page.tsx` (effectively)  | Public     | Homepage displays the newsletter list.                                      |
| `/newsletters`                | `newsletters/page.tsx`                | Public     | Displays a list of current and past newsletters.                            |
| `/newsletters/[newsletterId]` | `newsletters/[newsletterId]/page.tsx` | Public     | Displays the detail page for a selected newsletter. `newsletterId` is UUID. |

[cite\_start] _(Note: The main architecture document [cite: 83] shows an `app/page.tsx` for the homepage. For MVP, this can either redirect to `/newsletters` or directly render the newsletter list content. The table above assumes it effectively serves the newsletter list.)_

### Route Guards / Protection

- **Authentication Guard:** The MVP frontend is public-facing, displaying newsletters and podcasts without user login. [cite\_start] The Vercel/Supabase template includes middleware (`middleware.ts` [cite: 92, 311]) for protecting routes based on Supabase Auth. This will be relevant for any future admin sections but is not actively used to gate content for general users in MVP.
- **Authorization Guard:** Not applicable for MVP.

## Build, Bundling, and Deployment

Details align with the Vercel platform and Next.js capabilities.

### Build Process & Scripts

- **Key Build Scripts:**
  - `npm run dev`: Starts Next.js local development server.
  - `npm run build`: Generates an optimized production build of the Next.js application. (Script from `package.json`)
  - `npm run start`: Starts the Next.js production server after a build.
- **Environment Variables Handling during Build:**
  - Client-side variables must be prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - Server-side variables (used in Server Components, Server Actions, Route Handlers) are accessed directly via `process.env`.
  - Environment variables are managed in Vercel project settings for different environments (Production, Preview, Development). Local development uses `.env.local`.

### Key Bundling Optimizations

- **Code Splitting:** Next.js App Router automatically performs route-based code splitting. Dynamic imports (`next/dynamic`) can be used for further component-level code splitting if needed.
- **Tree Shaking:** Ensured by Next.js's Webpack configuration during the production build process.
- **Lazy Loading:** Next.js handles lazy loading of route segments by default. Images (`next/image`) are optimized and can be lazy-loaded.
- **Minification & Compression:** Handled automatically by Next.js during `npm run build` (JavaScript, CSS minification; Gzip/Brotli compression often handled by Vercel).

### Deployment to CDN/Hosting

- [cite\_start] **Target Platform:** **Vercel** (as per `architecture.txt` [cite: 206, 207, 382])
- **Deployment Trigger:** Automatic deployments via Vercel's Git integration (GitHub) on pushes/merges to specified branches (e.g., `main` for production, PR branches for previews). [cite\_start] (Aligned with `architecture.txt` [cite: 279, 280])
- **Asset Caching Strategy:** Vercel's Edge Network handles CDN caching for static assets and Server Component payloads. Cache-control headers will be configured according to Next.js defaults and can be customized if necessary (e.g., for `public/` assets).

## Frontend Testing Strategy

This section elaborates on the overall testing strategy defined in `architecture.txt`, focusing on frontend specifics.

- **Link to Main Testing Strategy:** `docs/architecture.md#overall-testing-strategy` (and `docs/architecture.md#coding-standards` for test file colocation).

### Component Testing

- **Scope:** Testing individual React components in isolation, primarily focusing on UI rendering based on props and basic interactions.
- [cite\_start] **Tools:** **Jest** (test runner, assertion library, mocking, as per `architecture.txt` [cite: 236, 237][cite\_start] ) and **React Testing Library (RTL)** (for user-centric component querying and interaction, as per `architecture.txt` [cite: 232, 233]).
- **Focus:**
  - Correct rendering based on props.
  - User interactions (e.g., button clicks triggering callbacks).
  - Conditional rendering logic.
  - Accessibility attributes.
- [cite\_start] **Location:** Test files (`*.test.tsx` or `*.spec.tsx`) will be co-located with the component files (e.g., `app/components/core/NewsletterCard.test.tsx`). [cite: 99, 295]
- **Example Guideline:** "A `NewsletterCard` component should render the title and date passed as props. Clicking the card should navigate (mocked) or call an `onClick` prop."

### UI Integration/Flow Testing

- **Scope:** Testing interactions between multiple components that compose a piece of UI or a small user flow, potentially with mocked Supabase client responses or Zustand store states.
- **Tools:** Jest and React Testing Library.
- **Focus:**
  - Data flow between a parent and its child components.
  - State updates in a Zustand store affecting multiple components.
  - Rendering of a sequence of UI elements in a simple flow (e.g., selecting an item from a list and seeing details appear).
- **Example Guideline:** "The `NewsletterListPage` should correctly render multiple `NewsletterCard` components when provided with mock newsletter data. Clicking a card should correctly invoke navigation logic."

### End-to-End UI Testing Tools & Scope

- [cite\_start] **Tools:** **Playwright** (as per `architecture.txt` [cite: 240, 241]).
- **Scope (Frontend Focus):**
  - Verify the "Viewing a Newsletter" user flow:
    1.  Navigate to the newsletter list page.
    2.  Verify newsletters are listed.
    3.  Click on a newsletter.
    4.  Verify the newsletter detail page loads with content.
    5.  Verify the podcast player is present if a podcast URL exists.
    6.  Verify the download button is present.
    7.  Verify the "Back to List" button works.
  - Basic mobile responsiveness checks for key pages (list and detail).
- **Test Data Management for UI:** E2E tests will rely on data populated in the development Supabase instance or use mocked API responses if targeting isolated frontend tests with Playwright's network interception. For true E2E against a live dev environment, pre-seeded data in Supabase dev instance will be used.

## Accessibility (AX) Implementation Details

[cite\_start] The frontend will adhere to **WCAG 2.1 Level A** as a minimum target, as specified in `docs/ui-ux-spec.txt`[cite: 588].

- [cite\_start] **Semantic HTML:** Emphasis on using correct HTML5 elements (`<nav>`, `<main>`, `<article>`, `<aside>`, `<button>`, etc.) to provide inherent meaning and structure. [cite: 589]
- **ARIA Implementation:**
  - Shadcn UI components are built with accessibility in mind, often including appropriate ARIA attributes.
  - For custom components, relevant ARIA roles (e.g., `role="region"`, `role="alert"`) and attributes (e.g., `aria-label`, `aria-describedby`, `aria-live`, `aria-expanded`) will be used for dynamic content, interactive elements, and custom widgets to ensure assistive technologies can interpret them correctly.
- [cite\_start] **Keyboard Navigation:** All interactive elements (links, buttons, inputs, custom controls) must be focusable and operable using only the keyboard in a logical order. [cite: 588] Focus indicators will be clear and visible.
- **Focus Management:** For dynamic UI elements like modals or non-native dropdowns (if any are built custom beyond Shadcn capabilities), focus will be managed programmatically to ensure it moves to and is trapped within the element as appropriate, and returns to the trigger element upon dismissal.
- **Alternative Text:** All meaningful images will have descriptive `alt` text. [cite\_start] Decorative images will have empty `alt=""`. [cite: 590]
- **Color Contrast:** Adherence to WCAG 2.1 Level A color contrast ratios for text and interactive elements against their backgrounds. [cite\_start] The "synthwave" theme's purple accents [cite: 584] will be chosen carefully to meet these requirements. [cite\_start] Tools will be used to verify contrast. [cite: 591]
- **Testing Tools for AX:**
  - Automated: Axe DevTools browser extension, Lighthouse accessibility audits.
  - Manual: Keyboard-only navigation testing, screen reader testing (e.g., NVDA, VoiceOver) for key user flows.

## Performance Considerations

[cite\_start] The goal is a fast-loading and responsive user experience. [cite: 360, 565]

- **Image Optimization:**
  - Use `next/image` for automatic image optimization (resizing, WebP format where supported, lazy loading by default).
- **Code Splitting & Lazy Loading:**
  - Next.js App Router handles route-based code splitting.
  - `next/dynamic` for client-side lazy loading of components that are not immediately visible or are heavy.
- **Minimizing Re-renders (React):**
  - Judicious use of `React.memo` for components that render frequently with the same props.
  - Optimizing Zustand selectors if complex derived state is introduced (though direct access is often sufficient).
  - Ensuring stable prop references where possible.
- **Debouncing/Throttling:** Not anticipated for MVP features, but will be considered for future interactive elements like search inputs.
- **Virtualization:** Not anticipated for MVP given the limited number of items (e.g., 30 newsletters per day). If lists become very long in the future, virtualization libraries like TanStack Virtual will be considered.
- **Caching Strategies (Client-Side):**
  - Leverage Next.js's built-in caching for Server Component payloads and static assets via Vercel's Edge Network.
  - Browser caching for static assets (`public/` folder) will use default optimal headers set by Vercel.
- **Performance Monitoring Tools:**
  - Browser DevTools (Performance tab, Lighthouse).
  - Vercel Analytics (if enabled) for real-user monitoring.
  - WebPageTest for detailed performance analysis.
- **Bundle Size Analysis:** Use tools like `@next/bundle-analyzer` to inspect production bundles and identify opportunities for optimization if bundle sizes become a concern.

## Change Log

| Date       | Version | Description                                      | Author             |
| :--------- | :------ | :----------------------------------------------- | :----------------- |
| 2025-05-13 | 0.1     | Initial draft of frontend architecture document. | 4-design-arch (AI) |
