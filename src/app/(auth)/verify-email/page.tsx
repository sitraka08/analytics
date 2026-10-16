import type { Metadata } from "next";
import { Suspense } from "react";
import { AUTH_COPY, AuthPanel, AuthFormFallback, ResendVerificationForm } from "@/features/auth";

export const metadata: Metadata = { title: "Vérifiez votre e-mail" };

async function VerifyEmailContent({ searchParams }: Pick<PageProps<"/verify-email">, "searchParams">) {
  const { email } = await searchParams;
  const address = typeof email === "string" ? email : undefined;
  const copy = AUTH_COPY.verifyEmail;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base leading-relaxed text-muted-foreground">
        {address ? (
          <>
            {copy.description} <strong className="font-medium text-foreground">{address}</strong>.
          </>
        ) : (
          copy.descriptionFallback
        )}{" "}
        {copy.hint}
      </p>
      <ResendVerificationForm email={address} />
    </div>
  );
}

export default function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  return (
    <AuthPanel title={AUTH_COPY.verifyEmail.title} highlight={AUTH_COPY.verifyEmail.titleHighlight}>
      <Suspense fallback={<AuthFormFallback fields={1} />}>
        <VerifyEmailContent searchParams={searchParams} />
      </Suspense>
    </AuthPanel>
  );
}
