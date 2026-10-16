---
name: review-architecture
description: Audit recent changes against the architecture, naming, privacy and quality rules. Use before finishing a task or on request for a structure review.
---

# Architecture review

Go through the modified files and report each deviation with its path and a proposed fix.

- **Placement**: the code is in the right feature; nothing shared without two consumers; `src/app/` only holds routing and composition.
- **Naming**: kebab-case, no role suffix (except `use-` for hooks); no generic names.
- **Imports**: no import of another feature's internals, no cycle.
- **Responsibilities**: services without UI, schemas without side effects, presentation components without data calls.
- **Next.js**: Server Components by default, `"use client"` at the leaf, Route Handlers limited to collection, auth and script.
- **Data**: SQL aggregation, bounded queries, site access control in every service, Zod at the boundaries.
- **Privacy**: no cookie, browser storage, raw IP or user-agent.
- **UX**: loading/empty/error states, centralized French texts, accessibility.
- **Language**: code, comments, docs and commit messages in English; French only in displayed UI text.
- **Design**: no hardcoded color (`globals.css` tokens, `panel-*`, `toneClass`), white text on colored cards, reused fields and buttons (`TextField`, `SubmitButton`), nothing that looks "generated UI" (see `rules/design-and-dataviz.md`).
- **Hygiene**: no empty folder or placeholder, no unjustified dependency, `pnpm lint` and `pnpm build` pass.
