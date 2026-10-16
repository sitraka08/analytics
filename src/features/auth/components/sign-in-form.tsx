"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ROUTES } from "@/lib/routes";
import { AUTH_COPY } from "../constants/content";
import type { SignInField } from "../schemas/sign-in";
import { signInAction } from "../services/sign-in";
import type { FormState } from "../types/form-state";
import { FormMessage } from "./form-message";
import { PasswordField } from "./password-field";
import { SubmitButton } from "./submit-button";
import { TextField } from "./text-field";

const INITIAL_STATE: FormState<SignInField> = { ok: false };

type SignInFormProps = {
  next?: string;
  notice?: string;
  error?: string;
};

export function SignInForm({ next, notice, error }: SignInFormProps) {
  const [state, formAction] = useActionState(signInAction, INITIAL_STATE);
  const copy = AUTH_COPY.signIn;

  return (
    <form action={formAction} noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <FieldGroup className="gap-5">
        <FormMessage message={state.message ?? error} />
        {!state.message && !error ? <FormMessage message={notice} tone="success" /> : null}

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
        <PasswordField
          name="password"
          label={AUTH_COPY.common.password}
          placeholder={AUTH_COPY.common.passwordPlaceholder}
          autoComplete="current-password"
          required
          errors={state.fieldErrors?.password}
          labelAction={
            <Link href={ROUTES.forgotPassword} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              {copy.forgotPassword}
            </Link>
          }
        />

        <Field orientation="horizontal" className="gap-2.5">
          <Checkbox
            id="remember-me"
            name="rememberMe"
            defaultChecked
            className="size-4.5 rounded-md border-[1.5px] bg-surface data-checked:border-foreground data-checked:bg-foreground"
          />
          <FieldLabel htmlFor="remember-me" className="text-sm font-normal">
            {copy.rememberMe}
          </FieldLabel>
        </Field>

        <Field className="gap-4">
          <SubmitButton className="w-full">{copy.submit}</SubmitButton>
          <FieldDescription className="text-center text-sm">
            {copy.noAccount}{" "}
            <Link href={ROUTES.register} className="font-medium text-foreground underline decoration-brand-orange decoration-2 underline-offset-4">
              {copy.toRegister}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
