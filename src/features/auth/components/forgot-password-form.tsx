"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { ROUTES } from "@/lib/routes";
import { AUTH_COPY } from "../constants/content";
import type { ForgotPasswordField } from "../schemas/password";
import { requestPasswordResetAction } from "../services/password";
import type { FormState } from "../types/form-state";
import { FormMessage } from "./form-message";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

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
          label={AUTH_COPY.common.email}
          placeholder={AUTH_COPY.common.emailPlaceholder}
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          errors={state.fieldErrors?.email}
        />

        <Field className="gap-2">
          <SubmitButton>{AUTH_COPY.forgotPassword.submit}</SubmitButton>
          <Link href={ROUTES.login} className={buttonVariants({ variant: "ghost", size: "lg", className: "h-12 rounded-full text-base hover:bg-cream-deep" })}>
            {AUTH_COPY.common.backToLogin}
          </Link>
        </Field>
      </FieldGroup>
    </form>
  );
}
