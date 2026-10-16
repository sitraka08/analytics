# Code quality

- Strict TypeScript; no `any` without a justified comment. Types derived from Zod (`z.infer`).
- Reuse what exists before creating; no duplication between features.
- No dependency without a clear need; inspect the code and `package.json` first.
- Performance: bounded queries, no large payloads to the client, `next/image` for images, minimal client bundles (import charts only where they are used).
- Dates: store in UTC, display in the browser's or the site's time zone; group by day in SQL with an explicit time zone.
- Numbers: format with `Intl` in `fr`.
- Security: validation at every boundary, secrets in env, access control on every read/write of site data.
- Errors: never swallow silently; clear user messages, details in server logs without personal data.
- Language: code, comments, docs and commit messages in English; only displayed UI text is French.
- Comments: only for non-obvious intent, in the style of the neighboring code.
- Before finishing: `pnpm lint` and `pnpm build` pass.
