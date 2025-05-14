# My Frontend Tech Preferences (Next.js & React)

Just some notes for myself and the AI on how I like to build my Next.js apps. Trying to keep things consistent.

## Overall Project Structure

- **`/app` directory for routing (Next.js App Router):**
  - Really like this new router. Makes sense to group UI and logic by route.
  - `layout.tsx` and `page.tsx` as the main files for each route.
  - Loading UI: `loading.tsx` is pretty cool.
  - Error UI: `error.tsx` for catching errors.
- **`/components` directory (root level):**
  - For all shared/reusable React components.
  - Sub-folders per component: e.g., `/components/Button/Button.tsx`, `/components/Button/Button.stories.tsx`, `/components/Button/Button.test.tsx`.
  - I like to keep stories and unit tests with the component.
- **`/lib` directory (root level):**
  - Helper functions, utilities, constants, type definitions that are not components.
  - e.g., `lib/utils.ts`, `lib/hooks.ts`, `lib/types.ts`
- **`/styles` directory (root level):**
  - Global styles in `globals.css`.
  - Maybe Tailwind CSS config here if I use it (`tailwind.config.js`).
- **`/public` directory:** For static assets, as usual.
- **`/store` or `/contexts` directory (root level):**
  - For state management. If using Zustand, maybe `/store/userStore.ts`. If React Context, `/contexts/ThemeContext.tsx`.

## React & Next.js Conventions

- **TypeScript Everywhere:**
  - Definitely. Helps catch a lot of bugs.
  - Use `interface` for public API type definitions (props), `type` for internal/utility types.
- **Functional Components with Hooks:**
  - Standard practice.
- **Server Components vs. Client Components (Next.js App Router):**
  - Try to use Server Components by default as much as possible for performance.
  - `"use client";` only when necessary (event handlers, state, browser-only APIs).
- **Routing:**
  - Next.js App Router.
  - Dynamic routes with `[]` and `[... ]` folders.
- **API Routes:**
  - In the `/app/api/...` folders.
  - Good for small backend-for-frontend tasks.
- **State Management:**
  - **Zustand:** My go-to for most global state. Simple, less boilerplate than Redux.
  - **React Context:** For simpler, localized state sharing (like theme, user auth status if not too complex).
  - Avoid Prop Drilling: Use Zustand or Context if props go more than 2-3 levels deep without being used.
- **Component Design:**
  - Small, focused components.
  - Props should be clear. Destructure props.
  - Use `React.FC<Props>` for component typings.
  - Fragments (`<>...</>`) when no extra DOM node is needed.
- **Styling:**
  - **Tailwind CSS:** Strongly preferred. Makes styling fast and keeps HTML cleaner than tons of CSS Modules files.
  - CSS Modules as a fallback or for very specific component-level styles if Tailwind isn't a good fit for some reason.
- **Environment Variables:**
  - `NEXT_PUBLIC_` prefix for client-side accessible env vars.
  - Standard `.env.local` for local development.

## Testing

- **E2E Testing Tool: Playwright**
  - Love Playwright. It's fast and has great features (auto-waits, good selectors).
  - Tests in an `/e2e` folder at the root.
  - Page Object Model (POM) pattern is good for maintainable E2E tests.
    - e.g., `e2e/pages/loginPage.ts`, `e2e/tests/auth.spec.ts`
- **Unit Testing: Jest & React Testing Library**
  - Standard for React components.
  - Focus on testing component behavior from a user's perspective, not implementation details.
  - Mock API calls using `jest.mock`.
- **Integration Testing:**
  - Could be a mix of Jest/RTL for testing how multiple components work together, or focused Playwright tests for small user flows.

## Other Preferred Libraries/Tools

- **Linting/Formatting:**
  - ESLint with standard configs (e.g., `eslint-config-next`).
  - Prettier for code formatting.
  - Run on pre-commit hook (Husky + lint-staged).
- **Data Fetching:**
  - Next.js built-in `fetch` (extended for server components, automatic caching).
  - SWR or React Query if client-side data fetching gets complex (caching, revalidation, etc.), but try to use Server Components for data fetching first.
- **Forms:**
  - React Hook Form: Good for handling forms with validation.
  - Schema validation with Zod.
- **Storybook:**
  - Yes, for component development and UI documentation.
  - Keep stories next to components.

## Things I'm still learning/exploring:

- Advanced Next.js features (Route Handlers, Server Actions in more depth).
- More sophisticated testing strategies for server components.
- Performance optimization beyond the basics.
