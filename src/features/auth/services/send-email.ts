import "server-only";

type Email = { to: string; subject: string; text: string };

/**
 * Sends a transactional email through Resend when `RESEND_API_KEY` is set. Without it (local development),
 * the message is printed to the server console so links can be followed by hand.
 */
export async function sendEmail({ to, subject, text }: Email) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info(`[email] to=${to} subject="${subject}"\n${text}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM ?? "Statly <onboarding@resend.dev>", to, subject, text }),
  });

  if (!response.ok) throw new Error(`Email provider answered ${response.status}`);
}
