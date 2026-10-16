---
name: new-form
description: Build a validated form (Zod schema, Server Action, shadcn UI) in a feature. Use for sign-in, sign-up, site creation, settings.
---

# New form

1. Identify the owning feature; one action = one form (sign-in and sign-up are separate).
2. `schemas/<name>.ts`: Zod schema and `z.infer` type. Error messages in French (displayed text).
3. `services/<name>.ts` with `"use server"`: validate with the schema, check the session and access, then write to the database. Return `{ ok: true, data }` or `{ ok: false, error, fieldErrors }`, without throwing.
4. Leaf client component (`components/<name>-form.tsx`): reuse `TextField`, `PasswordField`, `SubmitButton` and `FormMessage` (currently in `features/auth/components/`; move them to `components/shared/` if another feature uses them) rather than the raw shadcn `Input`. Labels, per-field errors, submitting state, visible focus, keyboard-usable. Detailed style: `rules/design-and-dataviz.md` § Forms.
5. For authentication, go through Better Auth rather than rewriting session logic.
6. After success: suitable `revalidatePath`/redirect; after failure: show the errors without losing the input.
7. Check `pnpm lint` and `pnpm build`.
