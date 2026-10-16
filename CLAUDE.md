# CLAUDE.md

Web analytics SaaS (countries, pages, durations, devices, sources…) with **readable** charts: the clear alternative to Vercel Analytics. Fullstack Next.js, no separate backend.

## Stack
Next.js (latest, App Router) · React · strict TypeScript · Tailwind CSS 4 · shadcn/ui · Neon Postgres + Drizzle ORM · Better Auth · Zod · TanStack Query (client interactivity only) · pnpm · Vercel. Alias `@/*` → `src/*`.

Next.js moves fast: check `node_modules/next/dist/docs` before using an unfamiliar API.

## Commands
- `pnpm dev` · `pnpm build` · `pnpm lint`
- `pnpm db:generate` · `pnpm db:migrate` · `pnpm db:studio` (Drizzle)

## Context (read before changing anything)
- `.claude/context/product-and-domain.md` — vision, model, metrics
- `.claude/context/tracking-and-privacy.md` — collection, visitor hash, GDPR

## Rules (`.claude/rules/`)
`architecture.md` · `nextjs-app-router.md` · `database-and-api.md` · `tracking-privacy.md` · `design-and-dataviz.md` · `code-quality.md`

## Skills (`.claude/skills/`)
`new-feature` · `new-page` · `new-form` · `new-analytics-widget` · `review-architecture`

## Non-negotiables
1. Privacy-first: no cookie, no stored IP, no fingerprinting.
2. Readability over density: one idea per chart, explicit titles, polished empty states.
3. Aggregate on the server (SQL), never send large event sets to the client.
4. Every data request checks that the user has access to the requested site.
5. Organize by feature first (`src/features/<name>/...`), share only what is truly multi-feature.
6. Files and folders in `kebab-case`, no role suffix (the folder carries it); components in PascalCase.
7. Server Components by default; `"use client"` only at the leaf, for interactivity.
8. No new dependency without a clear need; reuse what exists.
9. No empty folder or placeholder file.
10. **Everything is in English** — code, identifiers, routes, comments, docs, `CLAUDE.md` and `.claude/` files, commit messages, PR descriptions. **Only the text displayed in the site UI is French**, kept in easy-to-extract constants. Fonts: Manrope (headings, big numbers), Google Sans (text/UI), Google Sans Code (code, aligned numbers).
11. Ambiguous rule: state the assumption and ask before inventing.
12. Before finishing: `pnpm lint` and `pnpm build` pass.
