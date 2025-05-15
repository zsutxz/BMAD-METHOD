# API Interaction Layer

> This document is a granulated shard from the main "5-front-end-architecture.md" focusing on "API Interaction Layer".

The frontend will interact with Supabase for data. Server Components will fetch data directly using server-side Supabase client. Client Components needing to mutate data or trigger backend logic will use Next.js Server Actions or, if necessary, dedicated Next.js API Route Handlers which then interact with Supabase.

### Client/Service Structure

- **HTTP Client Setup (for Next.js API Route Handlers, if used extensively):**

  - While Server Components and Server Actions are preferred for Supabase interactions, if direct calls from client to custom Next.js API routes are needed, a simple `fetch` wrapper or a lightweight client like `ky` could be used.
  - The Vercel/Supabase template provides `utils/supabase/client.ts` (for client-side components) and `utils/supabase/server.ts` (for Server Components, Route Handlers, Server Actions). These will be the primary interfaces to Supabase.
  - **Base URL:** Not applicable for direct Supabase client usage. For custom API routes: relative paths (e.g., `/api/my-route`).
  - **Authentication:** The Supabase clients handle auth token management. For custom API routes, Next.js middleware (`middleware.ts`) would handle session verification.

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
