# Routing Strategy

> This document is a granulated shard from the main "5-front-end-architecture.md" focusing on "Routing Strategy".

Navigation and routing will be handled by the Next.js App Router.

- **Routing Library:** **Next.js App Router** (as per `architecture.txt`)

### Route Definitions

Based on `ux-ui-spec.txt` and PRD.

| Path Pattern                  | Component/Page (`app/(web)/...`)      | Protection | Notes                                                                       |
| :---------------------------- | :------------------------------------ | :--------- | :-------------------------------------------------------------------------- |
| `/`                           | `newsletters/page.tsx` (effectively)  | Public     | Homepage displays the newsletter list.                                      |
| `/newsletters`                | `newsletters/page.tsx`                | Public     | Displays a list of current and past newsletters.                            |
| `/newsletters/[newsletterId]` | `newsletters/[newsletterId]/page.tsx` | Public     | Displays the detail page for a selected newsletter. `newsletterId` is UUID. |

_(Note: The main architecture document shows an `app/page.tsx` for the homepage. For MVP, this can either redirect to `/newsletters` or directly render the newsletter list content. The table above assumes it effectively serves the newsletter list.)_

### Route Guards / Protection

- **Authentication Guard:** The MVP frontend is public-facing, displaying newsletters and podcasts without user login. The Vercel/Supabase template includes middleware (`middleware.ts`) for protecting routes based on Supabase Auth. This will be relevant for any future admin sections but is not actively used to gate content for general users in MVP.
- **Authorization Guard:** Not applicable for MVP.
