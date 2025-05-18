# Epic 6: Web Interface for Initial Structure and Content Access

> This document is a granulated shard from the main "BETA-V3/v3-demos/full-stack-app-demo/8-prd-po-updated.md" focusing on "Epic 6: Web Interface for Initial Structure and Content Access".

- Goal: Develop a user-friendly, responsive, and accessible web interface, based on the `frontend-architecture.md`, to display newsletters and provide access to podcast content, aligning with the project's visual and technical guidelines. All UI development within this epic must adhere to the "synthwave technical glowing purple vibes" aesthetic using Tailwind CSS and Shadcn UI, ensure basic mobile responsiveness, meet WCAG 2.1 Level A accessibility guidelines (including semantic HTML, keyboard navigation, alt text, color contrast), and optimize images using `next/image`, as detailed in the `frontend-architecture.txt` and `ui-ux-spec.txt`.

- **Story 6.1:** As a developer, I want to establish the initial Next.js App Router structure for the web interface, including core layouts and routing, using `frontend-architecture.md` as a guide, so that I have a foundational frontend structure.
  - Acceptance Criteria:
    - Initial HTML/CSS mockups (e.g., from Vercel v0, if used) serve as a visual guide, but implementation uses Next.js and Shadcn UI components as per `frontend-architecture.md`.
    - Next.js App Router routes are set up for `/newsletters` (listing page) and `/newsletters/[newsletterId]` (detail page) within an `app/(web)/` route group.
    - Root layout (`app/(web)/layout.tsx`) and any necessary feature-specific layouts (e.g., `app/(web)/newsletters/layout.tsx`) are implemented using Next.js App Router conventions and Tailwind CSS.
    - A `PageWrapper.tsx` component (as defined in `frontend-architecture.txt`) is implemented and used for consistent page styling (e.g., padding, max-width).
    - Basic page structure renders correctly in development environment.
- **Story 6.2:** As a user, I want to see a list of current and past newsletters on the `/newsletters` page, so that I can easily browse available content.
  - Acceptance Criteria:
    - The `app/(web)/newsletters/page.tsx` route displays a list of newsletters.
    - Newsletter items are displayed using a `NewsletterCard.tsx` component.
    - The `NewsletterCard.tsx` component is developed (e.g., using Shadcn UI `Card` as a base), displaying at least the newsletter title, target date, and a link/navigation to its detail page.
    - `NewsletterCard.tsx` is styled using Tailwind CSS to fit the "synthwave" theme.
    - Data for the newsletter list (e.g., ID, title, date) is fetched server-side on `app/(web)/newsletters/page.tsx` using the Supabase server client.
    - The newsletter list page is responsive across common device sizes (mobile, desktop).
    - The list includes relevant information such as the newsletter title and date.
    - The list is paginated or provides scrolling functionality to handle a large number of newsletters.
    - Key page load performance (e.g., Largest Contentful Paint) for the newsletter list page is benchmarked (e.g., using browser developer tools or Lighthouse) during development testing to ensure it aligns with the target of fast load times (target < 2 seconds).
- **Story 6.3:** As a user, I want to be able to select a newsletter from the list and read its full content within the web page on the `/newsletters/[newsletterId]` page.
  - Acceptance Criteria:
    - Clicking on a `NewsletterCard` navigates to the corresponding `app/(web)/newsletters/[newsletterId]/page.tsx` route.
    - The full HTML content of the selected newsletter is retrieved server-side using the Supabase server client and displayed in a readable format.
    - A `BackButton.tsx` component is developed (e.g., using Shadcn UI `Button` as a base) and integrated on the newsletter detail page, allowing users to navigate back to the newsletter list.
    - The newsletter detail page content area is responsive across common device sizes.
    - Key page load performance (e.g., Largest Contentful Paint) for the newsletter detail page is benchmarked (e.g., using browser developer tools or Lighthouse) during development testing to ensure it aligns with the target of fast load times (target < 2 seconds).
- **Story 6.4:** As a user, I want to have the option to download the currently viewed newsletter from its detail page, so that I can access it offline.
  - Acceptance Criteria:
    - A `DownloadButton.tsx` component is developed (e.g., using Shadcn UI `Button` as a base).
    - The `DownloadButton.tsx` is integrated and visible on the newsletter detail page (`/newsletters/[newsletterId]`).
    - Clicking the button initiates a download of the newsletter content (e.g., HTML format for MVP).
- **Story 6.5:** As a user, I want to listen to the generated podcast associated with a newsletter within the web interface on its detail page, if a podcast is available.
  - Acceptance Criteria:
    - A `PodcastPlayer.tsx` React component with standard playback controls (play, pause, seek bar, volume control) is developed.
    - An `podcastPlayerSlice.ts` Zustand store is implemented to manage podcast player state (e.g., current track URL, playback status, current time, volume).
    - The `PodcastPlayer.tsx` component integrates with the `podcastPlayerSlice.ts` Zustand store for its state management.
    - If a podcast URL is available for the displayed newsletter (fetched from Supabase), the `PodcastPlayer.tsx` component is displayed on the newsletter detail page.
    - The `PodcastPlayer.tsx` can load and play the podcast audio from the provided URL.
    - The `PodcastPlayer.tsx` is styled using Tailwind CSS to fit the "synthwave" theme and is responsive.
