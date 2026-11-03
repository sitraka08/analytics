import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AuthPanel,
  AuthDivider,
  AuthFormFallback,
  AUTH_UNAVAILABLE_MESSAGE,
  GoogleSignInButton,
  isGoogleEnabled,
} from "@/features/auth";
import { SignInForm } from "@/features/login";

export const metadata: Metadata = { title: "Connexion" };

async function LoginContent({
  searchParams,
}: Pick<PageProps<"/login">, "searchParams">) {
  const { next, reset, error } = await searchParams;
  const nextPath = typeof next === "string" ? next : undefined;

  return (
    <div className="flex flex-col gap-5">
      {isGoogleEnabled ? (
        <>
          <GoogleSignInButton next={nextPath} />
          <AuthDivider />
        </>
      ) : null}
      <SignInForm
        next={nextPath}
        notice={
          reset === "success"
            ? "Mot de passe modifié. Vous pouvez vous connecter."
            : undefined
        }
        error={
          error === "google"
            ? "La connexion avec Google a échoué. Réessayez."
            : error === "unavailable"
              ? AUTH_UNAVAILABLE_MESSAGE
              : undefined
        }
      />
    </div>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthPanel
      title="Content de vous revoir"
      highlight="revoir"
      description="Vos statistiques vous attendent là où vous les avez laissées."
    >
      <Suspense fallback={<AuthFormFallback />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </AuthPanel>
  );
}
