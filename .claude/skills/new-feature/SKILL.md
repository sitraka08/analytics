---
name: new-feature
description: Create a new feature under src/features following the feature architecture. Use to add a capability such as sites, analytics, tracking, auth or settings.
---

# New feature

1. Read `.claude/rules/architecture.md` and list `src/features/`: does the capability already exist? If so, extend it.
2. Choose the feature name (kebab-case, one business capability).
3. Create only the needed subfolders among `components/ hooks/ schemas/ services/ types/ utils/ constants/`. No empty folder.
4. Name without role suffix: `schemas/site.ts`, `services/site.ts`, `types/site.ts`. Hooks: `use-*.ts`.
5. Data: database access only in `services/`, with site access control. Zod validation in `schemas/`.
6. Add `index.ts` only if other features or pages must import from it; expose only the intended API there.
7. Wire the feature from `src/app/` (see the `new-page` skill).
8. Check: no circular dependency, no import of another feature's internals, `pnpm lint` and `pnpm build`.
