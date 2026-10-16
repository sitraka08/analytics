"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import type { ForgotPasswordField } from "../schemas/password";
import { resendVerificationAction } from "../services/verification";
import type { FormState } from "@/lib/form-state";
import { FormMessage } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/shared/submit-button";

const INITIAL_STATE: FormState<ForgotPasswordField> = { ok: false };

export function ResendVerificationForm({ email }: { email?: string }) {
  const [state, formAction] = useActionState(resendVerificationAction, INITIAL_STATE);

  return (
    <div className="flex flex-col gap-3">
      <FormMessage message={state.message} tone={state.ok ? "success" : "error"} />
      {email ? (
        <form action={formAction}>
          <input type="hidden" name="email" value={email} />
          <SubmitButton variant="outline" className="w-full">
            Renvoyer l&apos;e-mail
          </SubmitButton>
        </form>
      ) : null}
      <Link href={ROUTES.login} className={buttonVariants({ variant: "ghost", size: "lg", className: "h-12 rounded-full text-base hover:bg-cream-deep" })}>
        Retour à la connexion
      </Link>
    </div>
  );
}
