"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { ROUTES } from "@/lib/routes";
import { AUTH_COPY } from "../constants/content";
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
  const copy = AUTH_COPY.signUp;

  return (
    <form action={formAction} noValidate>
      <FieldGroup className="gap-5">
        <FormMessage message={state.message} />

        <TextField
          name="name"
          label={copy.name}
          placeholder={copy.namePlaceholder}
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          errors={state.fieldErrors?.name}
        />
        <TextField
          name="email"
          type="email"
          label={AUTH_COPY.common.email}
          placeholder={AUTH_COPY.common.emailPlaceholder}
          autoComplete="email"
          required
          defaultValue={state.values?.email ?? defaultEmail}
          errors={state.fieldErrors?.email}
        />
        <PasswordField
          name="password"
          label={AUTH_COPY.common.password}
          placeholder={AUTH_COPY.common.passwordPlaceholder}
          autoComplete="new-password"
          required
          minLength={8}
          description={copy.passwordHint}
          errors={state.fieldErrors?.password}
        />

        <Field className="gap-4">
          <SubmitButton className="w-full">{copy.submit}</SubmitButton>
          <FieldDescription className="text-center text-sm">
            {copy.hasAccount}{" "}
            <Link href={ROUTES.login} className="font-medium text-foreground underline decoration-brand-orange decoration-2 underline-offset-4">
              {copy.toLogin}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
