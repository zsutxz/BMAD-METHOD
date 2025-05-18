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

> Key aspects of this section have been moved to dedicated documents:
>
> - For styling approach, theme customization, and visual design: See [Frontend Style Guide](./front-end-style-guide.md)
> - For core framework choices, component architecture, data flow, and general coding standards: See [Frontend Coding Standards & Accessibility](./front-end-coding-standards.md#general-coding-standards-from-overall-philosophy--patterns)

## Detailed Frontend Directory Structure

> This section has been moved to a dedicated document: [Detailed Frontend Directory Structure](./front-end-project-structure.md)

## Component Breakdown & Implementation Details

> This section has been moved to a dedicated document: [Component Breakdown & Implementation Details](./front-end-component-guide.md)

## State Management In-Depth

> This section has been moved to a dedicated document: [State Management In-Depth](./front-end-state-management.md)

## API Interaction Layer

> This section has been moved to a dedicated document: [API Interaction Layer](./front-end-api-interaction.md)

## Routing Strategy

> This section has been moved to a dedicated document: [Routing Strategy](./front-end-routing-strategy.md)

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

- **Target Platform:** **Vercel** (as per `architecture.txt`)
- **Deployment Trigger:** Automatic deployments via Vercel's Git integration (GitHub) on pushes/merges to specified branches (e.g., `main` for production, PR branches for previews). (Aligned with `architecture.txt`)
- **Asset Caching Strategy:** Vercel's Edge Network handles CDN caching for static assets and Server Component payloads. Cache-control headers will be configured according to Next.js defaults and can be customized if necessary (e.g., for `public/` assets).

## Frontend Testing Strategy

> This section has been moved to a dedicated document: [Frontend Testing Strategy](./front-end-testing-strategy.md)

## Accessibility (AX) Implementation Details

> This section has been moved to a dedicated document: [Frontend Coding Standards & Accessibility](./front-end-coding-standards.md#accessibility-ax-implementation-details)

## Performance Considerations

[cite_start] The goal is a fast-loading and responsive user experience. [cite: 360, 565]

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
