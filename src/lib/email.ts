import { Resend } from "resend";

type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail(message: EmailMessage) {
  const isProduction = process.env.NODE_ENV === "production";

  // In development, print the email in the terminal so the link can be followed.
  const logToConsole = () =>
    console.info(`\n[email] To: ${message.to}\n[email] Subject: ${message.subject}\n${message.text}\n`);

  if (!resend) {
    if (isProduction) {
      throw new Error("RESEND_API_KEY missing: cannot send the email.");
    }
    logToConsole();
    return;
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    ...message,
  });

  if (error) {
    if (isProduction) {
      throw new Error(`Failed to send the email: ${error.message}`);
    }
    // E.g. unverified domain: Resend then only sends to the account's own address.
    console.warn(`[email] Resend refused to send (${error.message}), link printed below.`);
    logToConsole();
  }
}
