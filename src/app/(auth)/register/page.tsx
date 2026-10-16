import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AuthPanel,
  AuthDivider,
  AuthFormFallback,
  GoogleSignInButton,
  isGoogleEnabled,
} from "@/features/auth";
import { SignUpForm } from "@/features/register";

export const metadata: Metadata = { title: "Créer un compte" };

async function RegisterContent({ searchParams }: Pick<PageProps<"/register">, "searchParams">) {
  const { email } = await searchParams;

  return <SignUpForm defaultEmail={typeof email === "string" ? email : undefined} />;
}

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <AuthPanel
      title="Créons votre compte"
      highlight="compte"
      description="Deux minutes suffisent. Ensuite, une ligne de code et vos premières visites arrivent."
    >
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
