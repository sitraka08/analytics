import { Resend } from "resend";

type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(message: EmailMessage) {
  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY manquante : impossible d'envoyer l'e-mail.");
    }
    // En développement sans Resend, on affiche l'e-mail dans le terminal pour pouvoir suivre le lien.
    console.info(`\n[email] À : ${message.to}\n[email] Objet : ${message.subject}\n${message.text}\n`);
    return;
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    ...message,
  });

  if (error) {
    throw new Error(`Échec de l'envoi de l'e-mail : ${error.message}`);
  }
}
