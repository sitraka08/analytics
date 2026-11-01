import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormMessage } from "@/components/shared/form-message";
import { buttonVariants } from "@/components/ui/button";
import { AuthPanel, AuthFormFallback, ResetPasswordForm } from "@/features/auth";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

// Better Auth redirects here with `?token=` when the emailed link is valid, or `?error=INVALID_TOKEN` when it is not.
async function ResetPasswordContent({ searchParams }: Pick<PageProps<"/reset-password">, "searchParams">) {
  const { token, error } = await searchParams;
  if (typeof token === "string" && token && !error) return <ResetPasswordForm token={token} />;

  return (
    <div className="flex flex-col gap-4">
      <FormMessage message="Ce lien n'est plus valide. Demandez-en un nouveau." />
      <Link href={ROUTES.forgotPassword} className={buttonVariants({ size: "lg", className: "h-12 rounded-full text-base" })}>
        Demander un nouveau lien
      </Link>
    </div>
  );
}

export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <AuthPanel
      title="Nouveau mot de passe"
      highlight="Nouveau"
      description="Choisissez un mot de passe d'au moins 8 caractères."
    >
      <Suspense fallback={<AuthFormFallback />}>
        <ResetPasswordContent searchParams={searchParams} />
      </Suspense>
    </AuthPanel>
  );
}
