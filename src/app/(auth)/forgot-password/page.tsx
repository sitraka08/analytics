import type { Metadata } from "next";
import { AUTH_COPY, AuthPanel, ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <AuthPanel title={AUTH_COPY.forgotPassword.title} highlight={AUTH_COPY.forgotPassword.titleHighlight} description={AUTH_COPY.forgotPassword.description}>
      <ForgotPasswordForm />
    </AuthPanel>
  );
}
