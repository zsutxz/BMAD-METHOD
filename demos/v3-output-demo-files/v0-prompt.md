# V0.dev Prompt for BMad Daily Digest

**"BMad Daily Digest" MVP UI**

**Overall Project & Theme:**

"Create a 3-page responsive web application called 'BMad Daily Digest' using Next.js (App Router), React, Tailwind CSS, and aiming for shadcn/ui compatible component structures where possible.

The entire application must have a strong '80s retro CRT terminal' aesthetic. This means:
* **Overall Dark Mode:** Use a near-black background (e.g., #0A0A0A or a very dark desaturated green like #051005).
* **Primary Text Color:** A vibrant, "glowing" phosphor green (e.g., #39FF14 or #00FF00). This should be the main color for text, active links, and key interface elements.
* **Secondary Text Color:** A dimmer or slightly desaturated green for less emphasized text.
* **Font:** Use a monospaced, pixelated, or classic computer terminal-style font throughout the application (e.g., VT323, Press Start 2P for headings, or a highly readable system monospaced font like Consolas or Menlo for body copy if specific retro fonts prove hard to read for longer text). Prioritize readability within the theme.
* **Visual Style:** Think minimalist, text-heavy, with sharp edges. Subtle effects like faint scanlines or a very slight screen curvature are a bonus if they don't clutter the UI or impact performance, but not essential for the first pass. No modern rounded corners or gradients unless they specifically enhance the retro terminal feel (e.g., a subtle glow).
* **Interactions:** Links and interactive elements should have a clear hover/focus state, perhaps a brighter green or a block cursor effect, fitting the terminal theme.

The application needs to be responsive, adapting to single-column layouts on mobile."

**Shared Elements:**

"1.  **Main Layout Wrapper:** A full-screen component that establishes the dark background and CRT theme for all pages.
2.  **Header Component:**
    * Displays the site title 'BMad Daily Digest' in the primary glowing green, styled prominently (perhaps with a slightly larger or more distinct retro font). Clicking the title should navigate to the Home/Episode List page.
    * Contains simple text-based navigation links: 'Episodes' (links to home/list) and 'About'. These links should also use the glowing green text style and have clear hover/focus states.
    * The header should be responsive; on smaller screens, if navigation links become crowded, they can stack or be accessible via a simple themed menu icon (e.g., an ASCII-art style hamburger `☰`).
3.  **Footer Component (Optional, Minimalist):**
    * If included, a very simple text-based footer with a copyright notice (e.g., '© 2025 BMad Daily Digest') and perhaps repeat navigation links ('Episodes', 'About'), styled minimally in the secondary green text color."

**Page 1: Home / Episode List Page (Default Route `/`)**

"This page lists the daily podcast episodes.
* It should use the shared Header and Footer (if applicable).
* Below the header, display a clear heading like 'LATEST DIGESTS' or 'EPISODE LOG' in the primary glowing green.
* The main content area should display a reverse chronological list of podcast episodes.
* Each episode in the list should be a clickable item/card that navigates to its specific Episode Detail Page (e.g., `/episodes/[id]`).
* The display format for each list item should be: 'EPISODE [EpisodeNumber]: [PublicationDate] - [PodcastGeneratedTitle]'. For example: 'EPISODE 042: 2025-05-20 - Tech Highlights & Discussions'.
    * `[EpisodeNumber]` is a number.
    * `[PublicationDate]` is a date string (e.g., YYYY-MM-DD).
    * `[PodcastGeneratedTitle]` is the title of the podcast for that day.
* The list items should have a clear visual separation and a hover/focus state.
* If there are no episodes, display a message like 'NO DIGESTS AVAILABLE. CHECK BACK TOMORROW.' in the themed style.
* Include a themed loading state (e.g., 'LOADING EPISODES...') to be shown while data is being fetched.
* Include a themed error state (e.g., 'ERROR: COULD NOT LOAD EPISODES.') if data fetching fails."

**Page 2: Episode Detail Page (Dynamic Route, e.g., `/episodes/[episodeId]`)**

"This page displays the details for a single selected podcast episode.
* It should use the shared Header and Footer (if applicable).
* Prominently display the `PodcastGeneratedTitle`, `EpisodeNumber`, and `PublicationDate` of the current episode at the top of the main content area, styled in the primary glowing green.
* Below this, embed a standard HTML5 audio player (`<audio controls>`). The player itself will likely have default browser styling, but ensure the container or area around it fits the overall dark retro theme. The `src` for the audio will be dynamic.
* Below the audio player, include a section with a clear heading like 'STORIES COVERED IN THIS DIGEST' or 'SOURCE LOG'.
* Under this heading, display a list of the Hacker News stories that were included in this podcast episode.
* For each story in this list, display:
    * Its title (as plain text).
    * A clearly labeled link: 'Read Article' (linking to the original source article URL, should open in a new tab).
    * A clearly labeled link: 'HN Discussion' (linking to its Hacker News discussion page URL, should open in a new tab).
    * These links should be styled according to the theme (glowing green, clear hover/focus).
* Include themed loading and error states for fetching episode details."

**Page 3: About Page (Static Route, e.g., `/about`)**

"This page provides information about the 'BMad Daily Digest' service.
* It should use the shared Header and Footer (if applicable).
* Display a clear heading like 'ABOUT BMAD DAILY DIGEST'.
* The main content area should display static informational text. For placeholder text, use: 'BMad Daily Digest provides a daily audio summary of top Hacker News discussions for busy tech professionals, generated using AI. Our mission is to keep you informed, efficiently. All content is curated and processed to deliver key insights in an easily digestible audio format, presented with a unique retro-tech vibe.'
* All text and headings should adhere to the '80s retro CRT terminal' theme."

---

**Key Instructions for V0:**
* Prioritize the "80s retro CRT terminal" aesthetic in all generated components: dark background, glowing green text, monospaced/pixel fonts.
* Use Tailwind CSS for all styling.
* Generate React components using TypeScript for a Next.js (App Router) application.
* Ensure layouts are responsive and adapt to a single column on mobile.
* Focus on clean, readable code structure for the generated components.
* The HTML5 audio player controls will likely be browser default, but any surrounding elements should be themed.
* Links for "Read Article" and "HN Discussion" must be distinct and clearly indicate they are external links that open in new tabs.
