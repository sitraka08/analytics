import { isAuthApiError } from "@supabase/supabase-js";

const USER_EXISTS = "Un compte existe déjà avec cette adresse. Connectez-vous ou réinitialisez votre mot de passe.";
const INVALID_LINK = "Ce lien n'est plus valide. Demandez-en un nouveau.";

const MESSAGES_BY_CODE: Record<string, string> = {
  invalid_credentials: "E-mail ou mot de passe incorrect.",
  email_not_confirmed: "Votre adresse e-mail n'est pas encore confirmée. Vérifiez votre boîte de réception.",
  user_already_exists: USER_EXISTS,
  email_exists: USER_EXISTS,
  weak_password: "Ce mot de passe est trop faible. Choisissez-en un plus long.",
  same_password: "Choisissez un mot de passe différent de l'ancien.",
  otp_expired: INVALID_LINK,
  session_not_found: INVALID_LINK,
  over_request_rate_limit: "Trop de tentatives. Patientez une minute puis réessayez.",
  over_email_send_rate_limit: "Trop d'e-mails envoyés. Patientez quelques minutes puis réessayez.",
};

export function getAuthErrorMessage(error: unknown) {
  if (isAuthApiError(error)) {
    if (error.status === 429) return "Trop de tentatives. Patientez une minute puis réessayez.";
    if (error.code && MESSAGES_BY_CODE[error.code]) return MESSAGES_BY_CODE[error.code];
  }
  return "Une erreur est survenue. Réessayez dans un instant.";
}

/** Only accepts an internal path ("/dashboard"), never an external URL. */
export function getSafeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback: string) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
