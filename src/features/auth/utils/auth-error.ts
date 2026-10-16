import { isAPIError } from "better-auth/api";
import { AUTH_COPY } from "../constants/content";

const MESSAGES_BY_CODE: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: AUTH_COPY.errors.invalidCredentials,
  EMAIL_NOT_VERIFIED: AUTH_COPY.errors.emailNotVerified,
  USER_ALREADY_EXISTS: AUTH_COPY.errors.userExists,
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: AUTH_COPY.errors.userExists,
  INVALID_TOKEN: AUTH_COPY.errors.invalidToken,
  TOKEN_EXPIRED: AUTH_COPY.errors.invalidToken,
};

export function getAuthErrorMessage(error: unknown) {
  if (isAPIError(error)) {
    if (error.statusCode === 429) return AUTH_COPY.errors.tooManyRequests;
    const code = error.body?.code;
    if (code && MESSAGES_BY_CODE[code]) return MESSAGES_BY_CODE[code];
  }
  return AUTH_COPY.errors.generic;
}

/** Only accepts an internal path ("/dashboard"), never an external URL. */
export function getSafeRedirectPath(value: FormDataEntryValue | string | null | undefined, fallback: string) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
