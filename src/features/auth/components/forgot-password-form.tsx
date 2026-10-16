"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { ROUTES } from "@/lib/routes";
import type { ForgotPasswordField } from "../schemas/password";
import { requestPasswordResetAction } from "../services/password";
import type { FormState } from "@/lib/form-state";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";
import { TextField } from "@/components/shared/text-field";

const INITIAL_STATE: FormState<ForgotPasswordField> = { ok: false };

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordResetAction, INITIAL_STATE);

  return (
    <form action={formAction} noValidate>
      <FieldGroup className="gap-5">
        <FormMessage message={state.message} tone={state.ok ? "success" : "error"} />

        <TextField
          name="email"
          type="email"
          label="Adresse e-mail"
          placeholder="vous@exemple.fr"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          errors={state.fieldErrors?.email}
        />

        <Field className="gap-2">
          <SubmitButton>Envoyer le lien</SubmitButton>
          <Link href={ROUTES.login} className={buttonVariants({ variant: "ghost", size: "lg", className: "h-12 rounded-full text-base hover:bg-cream-deep" })}>
            Retour à la connexion
          </Link>
        </Field>
      </FieldGroup>
    </form>
  );
}
