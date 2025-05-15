# Frontend Testing Strategy

> This document is a granulated shard from the main "5-front-end-architecture.md" focusing on "Frontend Testing Strategy".

This section elaborates on the overall testing strategy defined in `architecture.txt`, focusing on frontend specifics.

- **Link to Main Testing Strategy:** `docs/architecture.md#overall-testing-strategy` (and `docs/architecture.md#coding-standards` for test file colocation).

### Component Testing

- **Scope:** Testing individual React components in isolation, primarily focusing on UI rendering based on props and basic interactions.
- **Tools:** **Jest** (test runner, assertion library, mocking) and **React Testing Library (RTL)** (for user-centric component querying and interaction).
- **Focus:**
  - Correct rendering based on props.
  - User interactions (e.g., button clicks triggering callbacks).
  - Conditional rendering logic.
  - Accessibility attributes.
- **Location:** Test files (`*.test.tsx` or `*.spec.tsx`) will be co-located with the component files (e.g., `app/components/core/NewsletterCard.test.tsx`).
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

- **Tools:** **Playwright**.
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
