# Tracking and privacy (rules)

Flow details: `.claude/context/tracking-and-privacy.md`.

## Forbidden
- Cookies, `localStorage`, `sessionStorage` or any browser storage from the tracking script.
- Storing the raw IP or user-agent, in the database as well as in logs.
- Fingerprinting (canvas, fonts, etc.) or any identifier persisting across days.
- Collecting form fields, page text or personal data.

## Required
- Salted visitor hash with daily rotation; the salt is never exposed.
- `/api/collect`: strict Zod validation, bounded payload, per-site-domain CORS, rate limit, bot filter, `202` response with no body.
- Tiny tracking script (target < 2 KB gzip), dependency-free, that never blocks rendering and never fails noisily on the client site.
- Any new collected data is justified in the context file and cannot identify a person.
