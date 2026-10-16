import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AUTH_COPY,
  AuthPanel,
  AuthDivider,
  AuthFormFallback,
  GoogleSignInButton,
  SignUpForm,
  isGoogleEnabled,
} from "@/features/auth";

export const metadata: Metadata = { title: "Créer un compte" };

async function RegisterContent({ searchParams }: Pick<PageProps<"/register">, "searchParams">) {
  const { email } = await searchParams;

  return <SignUpForm defaultEmail={typeof email === "string" ? email : undefined} />;
}

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <AuthPanel title={AUTH_COPY.signUp.title} highlight={AUTH_COPY.signUp.titleHighlight} description={AUTH_COPY.signUp.description}>
      <div className="flex flex-col gap-5">
        {isGoogleEnabled ? (
          <>
            <GoogleSignInButton />
            <AuthDivider />
          </>
        ) : null}
        <Suspense fallback={<AuthFormFallback fields={3} />}>
          <RegisterContent searchParams={searchParams} />
        </Suspense>
      </div>
    </AuthPanel>
  );
}
