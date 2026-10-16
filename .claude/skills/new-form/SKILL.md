---
name: new-form
description: Construire un formulaire validé (schéma Zod, Server Action, UI shadcn) dans une feature. À utiliser pour connexion, inscription, création de site, paramètres.
---

# Nouveau formulaire

1. Identifier la feature propriétaire ; une action = un formulaire (connexion et inscription sont séparés).
2. `schemas/<nom>.ts` : schéma Zod et type `z.infer`. Messages d'erreur en français.
3. `services/<nom>.ts` avec `"use server"` : valider avec le schéma, vérifier la session et l'accès, puis écrire en base. Retourner `{ ok: true, data }` ou `{ ok: false, error, fieldErrors }`, sans lever d'exception.
4. Composant client en feuille (`components/<nom>-form.tsx`) : réutiliser `TextField`, `PasswordField`, `SubmitButton` et `FormMessage` (aujourd'hui dans `features/auth/components/` ; les déplacer vers `components/shared/` si une autre feature les utilise) plutôt que l'`Input` shadcn brut. Labels, erreurs par champ, état d'envoi, focus visible, utilisable au clavier. Style détaillé : `rules/design-and-dataviz.md` § Formulaires.
5. Pour l'authentification, passer par Better Auth plutôt que de réécrire la logique de session.
6. Après succès : `revalidatePath`/redirect adapté ; après échec : afficher les erreurs sans perdre la saisie.
7. Vérifier `pnpm lint` et `pnpm build`.
