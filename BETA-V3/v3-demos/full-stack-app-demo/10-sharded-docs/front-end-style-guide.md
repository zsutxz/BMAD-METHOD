# Frontend Style Guide

> This document is a granulated shard from the main "5-front-end-architecture.md" focusing on "UI Style Guide, Brand Guidelines, Visual Design Specifications, or Styling Approach".

The frontend for BMad DiCaster will be built using modern, efficient, and maintainable practices, leveraging the Vercel/Supabase Next.js App Router template as a starting point. The core philosophy is to create a responsive, fast-loading, and accessible user interface that aligns with the "synthwave technical glowing purple vibes" aesthetic.

- **Framework & Core Libraries relevant to Styling:**

  - **Next.js (Latest, e.g., 14.x.x, App Router):** Chosen for its robust full-stack capabilities and seamless integration with Vercel for deployment.
  - **React (19.0.0):** As the underlying UI library for Next.js.
  - **TypeScript (5.7.2):** For strong typing and improved code quality.

- **Component Architecture relevant to Styling:**

  - **Shadcn UI (Latest):** This collection of reusable UI components, built on Radix UI and Tailwind CSS, will be used for foundational elements like buttons, cards, dialogs, etc.
  - **Application-Specific Components:** Custom components will be developed for unique UI parts.

- **Styling Approach:**

  - **Tailwind CSS (3.4.17):** A utility-first CSS framework for rapid UI development and consistent styling. It will be used for all styling, including achieving the "synthwave technical glowing purple vibes."
  - **Shadcn UI:** Leverages Tailwind CSS for its components.
  - **Global Styles:** `app/globals.css` will be used for base Tailwind directives and any genuinely global style definitions.
  - **Theme Customization:** `tailwind.config.ts` will be used to extend Tailwind's default theme with custom colors (e.g., synthwave purples like `#800080` as an accent), fonts, or spacing as needed to achieve the desired aesthetic. The "synthwave technical glowing purple vibes" will be achieved through a dark base theme, with purple accents for interactive elements, highlights, and potentially subtle text shadows or glows on specific headings or decorative elements. Font choices will lean towards modern, clean sans-serifs as specified in `ux-ui-spec.txt`, potentially with a more stylized font for major headings if it fits the theme without compromising readability.

- **Visual Design Specifications (derived from UI/UX Spec and Architecture):**
  - **Aesthetic:** "Synthwave technical glowing purple vibes."
  - **Layout:** Minimalist, clean, focusing on content readability.
  - **Color Palette:** Dark base theme with purple accents (e.g., `#800080`). Ensure high contrast for accessibility.
  - **Typography:** Modern, clean sans-serif fonts. Stylized font for major headings if it fits the theme and maintains readability.
  - **Iconography:** (To be determined, likely to use a standard library like Heroicons or Phosphor Icons, integrated as SVG or via Shadcn UI if applicable).
  - **Responsiveness:** The UI must be responsive and adapt to various screen sizes (desktop, tablet, mobile).
