# Definitive Tech Stack Selections

> This document is a granulated shard from the main "3-architecture.md" focusing on "Definitive Tech Stack Selections".

This section outlines the definitive technology choices for the BMad DiCaster project. These selections are the single source of truth for all technology choices. "Latest" implies the latest stable version available at the time of project setup (2025-05-13); the specific version chosen should be pinned in `package.json` and this document updated accordingly.

- **Preferred Starter Template Frontend & Backend:** Vercel/Supabase Next.js App Router Template ([https://vercel.com/templates/next.js/supabase](https://vercel.com/templates/next.js/supabase))

| Category             | Technology                  | Version / Details                          | Description / Purpose                                                     | Justification (Optional, from PRD/User)                      |
| :------------------- | :-------------------------- | :----------------------------------------- | :------------------------------------------------------------------------ | :----------------------------------------------------------- |
| **Languages**        | TypeScript                  | `5.7.2`                                    | Primary language for backend/frontend                                     | Strong typing, community support, aligns with Next.js/React  |
| **Runtime**          | Node.js                     | `22.10.2`                                  | Server-side execution environment for Next.js & Supabase Functions        | Compatible with Next.js, Vercel environment                  |
| **Frameworks**       | Next.js                     | `latest` (e.g., 14.2.3 at time of writing) | Full-stack React framework                                                | App Router, SSR, API routes, Vercel synergy                  |
|                      | React                       | `19.0.0`                                   | Frontend UI library                                                       | Component-based, declarative                                 |
| **UI Libraries**     | Tailwind CSS                | `3.4.17`                                   | Utility-first CSS framework                                               | Rapid UI development, consistent styling                     |
|                      | Shadcn UI                   | `latest` (CLI based)                       | React component library (via CLI)                                         | Pre-styled, accessible components, built on Radix & Tailwind |
| **Databases**        | PostgreSQL                  | (via Supabase)                             | Primary relational data store                                             | Provided by Supabase, robust, scalable                       |
| **Cloud Platform**   | Vercel                      | N/A                                        | Hosting platform for Next.js app & Supabase Functions                     | Seamless Next.js/Supabase deployment, Edge Network           |
| **Cloud Services**   | Supabase Functions          | N/A (via Vercel deploy)                    | Serverless compute for backend pipeline & APIs                            | Integrated with Supabase DB, event-driven capabilities       |
|                      | Supabase Auth               | N/A                                        | User authentication and management                                        | Integrated with Supabase, RLS                                |
|                      | Supabase Storage            | N/A                                        | File storage (e.g., for temporary newsletter files if needed for Play.ht) | Integrated with Supabase                                     |
| **Infrastructure**   | Supabase CLI                | `latest`                                   | Local development, migrations, function deployment                        | Official tool for Supabase development                       |
|                      | Docker                      | `latest` (via Supabase CLI)                | Containerization for local Supabase services                              | Local development consistency                                |
| **State Management** | Zustand                     | `latest`                                   | Frontend state management                                                 | Simple, unopinionated, performant for React                  |
| **Testing**          | React Testing Library (RTL) | `latest`                                   | Testing React components                                                  | User-centric testing, works well with Jest                   |
|                      | Jest                        | `latest`                                   | Unit/Integration testing framework for JS/TS                              | Widely used, good support for Next.js/React                  |
|                      | Playwright                  | `latest`                                   | End-to-end testing framework                                              | Modern, reliable, cross-browser                              |
| **CI/CD**            | GitHub Actions              | N/A                                        | Continuous Integration/Deployment                                         | Integration with GitHub, automation of build/deploy/test     |
| **Other Tools**      | Cheerio                     | `latest`                                   | HTML parsing/scraping for articles                                        | Server-side HTML manipulation                                |
|                      | Nodemailer                  | `latest`                                   | Email sending library for newsletters                                     | Robust email sending from Node.js                            |
|                      | Zod                         | `latest`                                   | TypeScript-first schema declaration and validation                        | Data validation for API inputs, environment variables etc.   |
|                      | `tsx` / `ts-node`           | `latest` (for scripts)                     | TypeScript execution for Node.js scripts (e.g. `scripts/`)                | Running TS scripts directly                                  |
|                      | Prettier                    | `3.3.3`                                    | Code formatter                                                            | Consistent code style                                        |
|                      | ESLint                      | `latest`                                   | Linter for TypeScript/JavaScript                                          | Code quality and error prevention                            |
|                      | Pino                        | `latest`                                   | High-performance JSON logger for Node.js                                  | Structured and efficient logging                             |

</rewritten_file>
