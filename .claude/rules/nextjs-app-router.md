# Next.js App Router

- Check `node_modules/next/dist/docs` for caching, PPR and the conventions of the installed version; do not rely on old behaviors.
- `src/app/`: routing, layouts, `loading.tsx`, `error.tsx`, `not-found.tsx`, metadata. Nothing else.
- Route groups: `(marketing)` landing and public pages, `(auth)` sign-in/sign-up, `(dashboard)` signed-in area. Create a group only when a page needs it.
- URL segments in English and kebab-case (`/login`, `/register`, `/forgot-password`, `/dashboard`), like all the code; only displayed text is French. Paths are centralized in `src/lib/routes.ts`: never hardcode a path elsewhere.
- Server Components by default. `"use client"` only for state, effects, events, browser APIs (interactive charts, sidebar, filters), at leaf level.
- Data: read in Server Components through feature `services/`. TanStack Query only for client interactivity (filters, refresh).
- Mutations: Server Actions returning `{ ok, ... }`.
- Route Handlers (`app/api`) only for: `/api/collect` (public collection), the Supabase Auth callback (`/auth/callback`, outside `app/api`), and the script served to sites.
- Dashboard route protection checks the session on the server; never rely on the UI alone.
- Landing: careful SEO (metadata, Open Graph), statically rendered as much as possible.
- A single router: do not mix with the Pages Router.
