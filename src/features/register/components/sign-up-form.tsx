"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CircleAlert } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ROUTES } from "@/lib/routes";
import type { SignUpField } from "../schemas/sign-up";
import { signUpAction } from "../services/sign-up";
import type { FormState } from "@/lib/form-state";
import { FormMessage } from "@/components/shared/form-message";
import { PasswordField } from "@/components/shared/password-field";
import { SubmitButton } from "@/components/shared/submit-button";
import { TextField } from "@/components/shared/text-field";

const INITIAL_STATE: FormState<SignUpField> = { ok: false };

export function SignUpForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, formAction] = useActionState(signUpAction, INITIAL_STATE);
  const termsErrors = state.fieldErrors?.terms;

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

        <Field
          className="gap-1.5"
          data-invalid={termsErrors ? true : undefined}
        >
          <div className="flex items-start gap-3 px-1">
            <Checkbox
              id="field-terms"
              name="terms"
              required
              defaultChecked={state.values?.terms === "on"}
              aria-invalid={termsErrors ? true : undefined}
              aria-describedby={termsErrors ? "field-terms-error" : undefined}
              className="mt-0.5 size-5 rounded-md border-2 border-foreground/30"
            />
            <FieldLabel
              htmlFor="field-terms"
              className="block text-sm font-normal leading-relaxed"
            >
              J&apos;accepte les{" "}
              <Link
                href={ROUTES.terms}
                target="_blank"
                className="font-medium underline underline-offset-4"
              >
                conditions d&apos;utilisation
              </Link>{" "}
              et la{" "}
              <Link
                href={ROUTES.privacy}
                target="_blank"
                className="font-medium underline underline-offset-4"
              >
                politique de confidentialité
              </Link>
              .
            </FieldLabel>
          </div>
          {termsErrors ? (
            <FieldError
              id="field-terms-error"
              className="flex items-start gap-1.5 px-1"
            >
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>{termsErrors[0]}</span>
            </FieldError>
          ) : null}
        </Field>

        <Field className="gap-4">
          <SubmitButton className="w-full">Créer mon compte</SubmitButton>
          <FieldDescription className="text-center text-sm">
            Déjà un compte ?{" "}
            <Link
              href={ROUTES.login}
              className="font-medium text-foreground underline decoration-brand-orange decoration-2 underline-offset-4"
            >
              Se connecter
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
