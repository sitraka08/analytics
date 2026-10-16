import type { Metadata } from "next";
import { AuthPanel, ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <AuthPanel
      title="Mot de passe oublié ?"
      highlight="oublié"
      description="Indiquez votre adresse e-mail : nous vous enverrons un lien pour choisir un nouveau mot de passe."
    >
      <ForgotPasswordForm />
    </AuthPanel>
  );
}
