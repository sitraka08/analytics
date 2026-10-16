import { BRAND } from "@/lib/brand";

type AuthEmail = { subject: string; html: string; text: string };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function layout(title: string, intro: string, cta: string, url: string) {
  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#f6f5f1;font-family:Arial,Helvetica,sans-serif;color:#121212">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px">
          <tr><td style="font-size:18px;font-weight:bold">${BRAND.name}</td></tr>
          <tr><td style="padding-top:24px;font-size:22px;font-weight:bold">${title}</td></tr>
          <tr><td style="padding-top:12px;font-size:15px;line-height:1.6;color:#6f6b62">${intro}</td></tr>
          <tr><td style="padding-top:24px">
            <a href="${url}" style="display:inline-block;background:#121212;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:bold">${cta}</a>
          </td></tr>
          <tr><td style="padding-top:24px;font-size:12px;line-height:1.6;color:#6f6b62">Si le bouton ne fonctionne pas, copiez ce lien :<br>${url}</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function verificationEmail(name: string, url: string): AuthEmail {
  const intro = `Bonjour ${escapeHtml(name)}, confirmez votre adresse e-mail pour activer votre compte. Ce lien est valable 1 heure.`;
  return {
    subject: `Confirmez votre adresse e-mail · ${BRAND.name}`,
    html: layout("Confirmez votre adresse e-mail", intro, "Confirmer mon adresse", url),
    text: `Bonjour ${name}, confirmez votre adresse e-mail : ${url}`,
  };
}

export function resetPasswordEmail(name: string, url: string): AuthEmail {
  const intro = `Bonjour ${escapeHtml(name)}, vous avez demandé à réinitialiser votre mot de passe. Ce lien est valable 1 heure. Si ce n'est pas vous, ignorez cet e-mail.`;
  return {
    subject: `Réinitialisez votre mot de passe · ${BRAND.name}`,
    html: layout("Réinitialisez votre mot de passe", intro, "Choisir un nouveau mot de passe", url),
    text: `Bonjour ${name}, réinitialisez votre mot de passe : ${url}`,
  };
}
