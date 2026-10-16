"use client";

import { useActionState } from "react";
import { Field, FieldGroup } from "@/components/ui/field";
import type { ResetPasswordField } from "../schemas/password";
import { resetPasswordAction } from "../services/password";
import type { FormState } from "@/lib/form-state";
import { FormMessage } from "@/components/shared/form-message";
import { PasswordField } from "@/components/shared/password-field";
import { SubmitButton } from "@/components/shared/submit-button";

const INITIAL_STATE: FormState<ResetPasswordField> = { ok: false };

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, INITIAL_STATE);

  return (
    <form action={formAction} noValidate>
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
