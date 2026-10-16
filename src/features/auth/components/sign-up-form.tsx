"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { ROUTES } from "@/lib/routes";
import type { SignUpField } from "../schemas/sign-up";
import { signUpAction } from "../services/sign-up";
import type { FormState } from "../types/form-state";
import { FormMessage } from "./form-message";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

const INITIAL_STATE: FormState<SignUpField> = { ok: false };

export function SignUpForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, formAction] = useActionState(signUpAction, INITIAL_STATE);

  return (
    <form action={formAction} noValidate>
      <FieldGroup className="gap-5">
        <FormMessage message={state.message} />

        <TextField
          name="name"
          label="Comment vous appeler ?"
          placeholder="Camille Martin"
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          errors={state.fieldErrors?.name}
        />
        <TextField
          name="email"
          type="email"
          label="Adresse e-mail"
          placeholder="vous@exemple.fr"
          autoComplete="email"
          required
          defaultValue={state.values?.email ?? defaultEmail}
          errors={state.fieldErrors?.email}
        />
        <PasswordField
          name="password"
          label="Mot de passe"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          minLength={8}
          description="8 caractères minimum."
          errors={state.fieldErrors?.password}
        />

        <Field className="gap-4">
          <SubmitButton className="w-full">Créer mon compte</SubmitButton>
          <FieldDescription className="text-center text-sm">
            Déjà un compte ?{" "}
            <Link href={ROUTES.login} className="font-medium text-foreground underline decoration-brand-orange decoration-2 underline-offset-4">
              Se connecter
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
