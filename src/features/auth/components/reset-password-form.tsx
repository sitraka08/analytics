"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { ROUTES } from "@/lib/routes";
import type { ResetPasswordField } from "../schemas/password";
import { resetPasswordAction } from "../services/password";
import type { FormState } from "../types/form-state";
import { FormMessage } from "./form-message";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";

const INITIAL_STATE: FormState<ResetPasswordField> = { ok: false };

export function ResetPasswordForm({ token }: { token?: string }) {
  const [state, formAction] = useActionState(resetPasswordAction, INITIAL_STATE);

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <FormMessage message="Ce lien n'est plus valide. Demandez-en un nouveau." />
        <Link href={ROUTES.forgotPassword} className={buttonVariants({ size: "lg", className: "h-12 rounded-full text-base" })}>
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="token" value={token} />
      <FieldGroup className="gap-5">
        <FormMessage message={state.message} />

        <PasswordField
          name="password"
          label="Nouveau mot de passe"
          autoComplete="new-password"
          required
          minLength={8}
          errors={state.fieldErrors?.password}
        />
        <PasswordField
          name="confirmPassword"
          label="Confirmer le mot de passe"
          autoComplete="new-password"
          required
          errors={state.fieldErrors?.confirmPassword}
        />

        <Field>
          <SubmitButton>Enregistrer</SubmitButton>
        </Field>
      </FieldGroup>
    </form>
  );
}
