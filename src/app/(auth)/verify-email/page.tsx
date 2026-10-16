import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPanel, AuthFormFallback } from "@/features/auth";
import { ResendVerificationForm } from "@/features/register";

export const metadata: Metadata = { title: "Vérifiez votre e-mail" };

async function VerifyEmailContent({ searchParams }: Pick<PageProps<"/verify-email">, "searchParams">) {
  const { email } = await searchParams;
  const address = typeof email === "string" ? email : undefined;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base leading-relaxed text-muted-foreground">
        {address ? (
          <>
            Nous avons envoyé un lien de confirmation à <strong className="font-medium text-foreground">{address}</strong>.
          </>
        ) : (
          "Nous vous avons envoyé un lien de confirmation."
        )}{" "}
        Cliquez sur le lien pour activer votre compte. Il est valable 1 heure.
      </p>
      <ResendVerificationForm email={address} />
    </div>
  );
}

export default function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  return (
    <AuthPanel title="Vérifiez votre boîte mail" highlight="boîte mail">
      <Suspense fallback={<AuthFormFallback fields={1} />}>
        <VerifyEmailContent searchParams={searchParams} />
      </Suspense>
    </AuthPanel>
  );
}
