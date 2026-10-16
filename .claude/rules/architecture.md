# Architecture by feature

Organize by business capability, then by technical responsibility.

```text
src/
├── app/          # routing, layouts, page composition, metadata
├── features/     # auth, sites, analytics, tracking, landing, settings
├── components/   # ui/ (shadcn), shared/, layout/
├── db/           # Supabase clients (server, admin) and generated types; SQL migrations live in `supabase/`
└── lib/          # truly shared utilities
```

## Inside a feature (create only what is needed)
```text
features/<name>/
├── components/  hooks/  schemas/  services/  types/  utils/  constants/
└── index.ts     # optional public entry point
```

## Naming
The folder already carries the role: no suffix.
- `schemas/site.ts`, `types/site.ts`, `services/site.ts`, `utils/period.ts`, `constants/periods.ts`.
- Components: kebab-case file, PascalCase declaration (`StatCard` in `components/stat-card.tsx`).
- Hooks: `use-` prefix kept (`hooks/use-sites-query.ts`, `useSitesQuery`).
- Server Actions: in `services/`, marked by `"use server"`, no suffix.
- Avoid generic names (`helpers.ts`, `data.ts`). Variables and functions in camelCase.

## Responsibilities
- Pages compose; presentation components receive props.
- `services/`: data access (Supabase) and server logic, no UI.
- `schemas/`: Zod validation only. `utils/`: pure functions.
- Hooks: the feature's client state and queries, nothing else.

## Dependencies
- A feature imports another only through its `index.ts`, never its internals.
- No circular dependency: extract the neutral part to a shared folder.
- Share only from two truly consuming features.
- No generalized `index.ts` barrel.
