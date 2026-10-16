import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AUTH_COPY,
  AuthPanel,
  AuthDivider,
  AuthFormFallback,
  GoogleSignInButton,
  SignInForm,
  isGoogleEnabled,
} from "@/features/auth";

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
          reset === "success" ? AUTH_COPY.signIn.passwordResetDone : undefined
        }
        error={error === "google" ? AUTH_COPY.signIn.googleError : undefined}
      />
    </div>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <AuthPanel
      title={AUTH_COPY.signIn.title}
      highlight={AUTH_COPY.signIn.titleHighlight}
      description={AUTH_COPY.signIn.description}
    >
      <Suspense fallback={<AuthFormFallback />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </AuthPanel>
  );
}
