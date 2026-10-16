---
name: new-page
description: Add an App Router route that composes feature components. Use for a page, layout, loading or error file under src/app.
---

# New page

1. Read `.claude/rules/nextjs-app-router.md` and check the local docs (`node_modules/next/dist/docs`) if the cache or PPR API is involved.
2. Choose the group: `(marketing)`, `(auth)` or `(dashboard)`. Create the group only if it is missing.
3. `page.tsx` is a Server Component that composes feature components and reads data through their `services/`. No business logic in the page.
4. Dashboard: check the session on the server and pass the user to the services.
5. Add `loading.tsx` (same-shape Skeleton) and `error.tsx` when the page loads data; `not-found.tsx` for a missing or non-owned site.
6. Export metadata (title, description); polish SEO for marketing pages.
7. Client Components at the leaves only.
8. Check in the browser on mobile and desktop, then `pnpm lint` and `pnpm build`.
