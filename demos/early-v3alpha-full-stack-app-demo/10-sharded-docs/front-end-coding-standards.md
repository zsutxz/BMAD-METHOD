# Frontend Coding Standards & Accessibility

> This document is a granulated shard from the main "5-front-end-architecture.md" focusing on "Front-End Coding Standards and Accessibility Best Practices".

## General Coding Standards (from Overall Philosophy & Patterns)

- **Framework & Core Libraries:**
  - Next.js (Latest, App Router)
  - React (19.0.0)
  - TypeScript (5.7.2)
- **Component Architecture Approach:**
  - Shadcn UI for foundational elements.
  - Application-Specific Components in `app/components/core/`.
  - Prefer Server Components; use Client Components (`"use client"`) only when necessary for interactivity or browser APIs.
- **Data Flow:**
  - Unidirectional: Server Components (data fetching) -> Client Components (props).
  - Mutations/Actions: Next.js Server Actions or API Route Handlers, with data revalidation.
  - Supabase Client for DB interaction.
- **Key Design Patterns Used:**
  - Server Components & Client Components.
  - React Hooks (and custom hooks).
  - Provider Pattern (React Context API) when necessary.
  - Facade Pattern (conceptual for Supabase client).

## Naming & Organization Conventions (from Component Breakdown & Detailed Structure)

- **Component File Naming:**
  - React component files: `PascalCase.tsx` (e.g., `NewsletterCard.tsx`).
  - Next.js special files (`page.tsx`, `layout.tsx`, etc.): conventional lowercase/kebab-case.
- **Directory Naming:** `kebab-case`.
- **Non-Component TypeScript Files (.ts):** Primarily `camelCase.ts` (e.g., `utils.ts`, `uiSlice.ts`). Config files (`tailwind.config.ts`) and shared type definitions (`api-schemas.ts`) may use `kebab-case`.
- **Component Organization:**
  - Core application components: `app/components/core/`.
  - Layout components: `app/components/layout/`.
  - Shadcn UI components: `components/ui/`.
  - Page-specific components (if complex and not reusable) can be co-located within the page's route directory.

## Accessibility (AX) Implementation Details

> This section is directly from "Accessibility (AX) Implementation Details" in `5-front-end-architecture.md`.

The frontend will adhere to **WCAG 2.1 Level A** as a minimum target, as specified in `docs/ui-ux-spec.txt`.

- **Semantic HTML:** Emphasis on using correct HTML5 elements (`<nav>`, `<main>`, `<article>`, `<aside>`, `<button>`, etc.) to provide inherent meaning and structure.
- **ARIA Implementation:**
  - Shadcn UI components are built with accessibility in mind, often including appropriate ARIA attributes.
  - For custom components, relevant ARIA roles (e.g., `role="region"`, `role="alert"`) and attributes (e.g., `aria-label`, `aria-describedby`, `aria-live`, `aria-expanded`) will be used for dynamic content, interactive elements, and custom widgets to ensure assistive technologies can interpret them correctly.
- **Keyboard Navigation:** All interactive elements (links, buttons, inputs, custom controls) must be focusable and operable using only the keyboard in a logical order. Focus indicators will be clear and visible.
- **Focus Management:** For dynamic UI elements like modals or non-native dropdowns (if any are built custom beyond Shadcn capabilities), focus will be managed programmatically to ensure it moves to and is trapped within the element as appropriate, and returns to the trigger element upon dismissal.
- **Alternative Text:** All meaningful images will have descriptive `alt` text. Decorative images will have empty `alt=""`.
- **Color Contrast:** Adherence to WCAG 2.1 Level A color contrast ratios for text and interactive elements against their backgrounds. The "synthwave" theme's purple accents will be chosen carefully to meet these requirements. Tools will be used to verify contrast.
- **Testing Tools for AX:**
  - Automated: Axe DevTools browser extension, Lighthouse accessibility audits.
  - Manual: Keyboard-only navigation testing, screen reader testing (e.g., NVDA, VoiceOver) for key user flows.
