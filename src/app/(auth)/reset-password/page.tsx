import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPanel, AuthFormFallback, ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

async function ResetPasswordContent({ searchParams }: Pick<PageProps<"/reset-password">, "searchParams">) {
  const { token, error } = await searchParams;
  const validToken = typeof token === "string" && !error ? token : undefined;

  return <ResetPasswordForm token={validToken} />;
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
