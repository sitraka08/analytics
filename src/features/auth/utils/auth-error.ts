import { isAPIError } from "better-auth/api";

const USER_EXISTS = "Un compte existe déjà avec cette adresse. Connectez-vous ou réinitialisez votre mot de passe.";
const INVALID_LINK = "Ce lien n'est plus valide. Demandez-en un nouveau.";

const MESSAGES_BY_CODE: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou mot de passe incorrect.",
  EMAIL_NOT_VERIFIED: "Votre adresse e-mail n'est pas encore confirmée. Vérifiez votre boîte de réception.",
  USER_ALREADY_EXISTS: USER_EXISTS,
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: USER_EXISTS,
  PASSWORD_TOO_SHORT: "Ce mot de passe est trop court. Choisissez-en un plus long.",
  PASSWORD_TOO_LONG: "Ce mot de passe est trop long.",
  INVALID_TOKEN: INVALID_LINK,
};

export function getAuthErrorMessage(error: unknown) {
  if (isAPIError(error)) {
    if (error.status === "TOO_MANY_REQUESTS") return "Trop de tentatives. Patientez une minute puis réessayez.";
    const code = error.body?.code;
    if (code && MESSAGES_BY_CODE[code]) return MESSAGES_BY_CODE[code];
  }
  console.error("Unexpected auth error:", error instanceof Error ? error.message : error);
  return "Une erreur est survenue. Réessayez dans un instant.";
}

/** Only accepts an internal path ("/dashboard"), never an external URL. */
export function getSafeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback: string) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
