import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormMessage } from "@/components/shared/form-message";
import { buttonVariants } from "@/components/ui/button";
import { AuthPanel, AuthFormFallback, ResetPasswordForm, getSession } from "@/features/auth";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

// The recovery link signs the user in through /auth/callback; without that session the link is invalid or expired.
async function ResetPasswordContent() {
  if (await getSession()) return <ResetPasswordForm />;

  return (
    <div className="flex flex-col gap-4">
      <FormMessage message="Ce lien n'est plus valide. Demandez-en un nouveau." />
      <Link href={ROUTES.forgotPassword} className={buttonVariants({ size: "lg", className: "h-12 rounded-full text-base" })}>
        Demander un nouveau lien
      </Link>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthPanel
      title="Nouveau mot de passe"
      highlight="Nouveau"
      description="Choisissez un mot de passe d'au moins 8 caractères."
    >
      <Suspense fallback={<AuthFormFallback />}>
        <ResetPasswordContent />
      </Suspense>
    </AuthPanel>
  );
}
