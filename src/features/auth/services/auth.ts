import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db, schema } from "@/db";
import { sendEmail } from "./send-email";

// Better Auth instance: sessions, password hashing, verification and reset tokens live in the `user`,
// `session`, `account` and `verification` tables. Google is enabled only when its credentials are set.
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      // Not awaited: answering faster than the email provider would reveal whether the account exists.
      void sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe",
        text: `Bonjour,\n\nPour choisir un nouveau mot de passe, ouvrez ce lien (valable 1 heure) :\n${url}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.`,
      }).catch((error) =>
        console.error(
          "sendResetPassword failed",
          error instanceof Error ? error.message : "unknown error",
        ),
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Confirmez votre adresse e-mail",
        text: `Bonjour ${user.name},\n\nPour activer votre compte, ouvrez ce lien (valable 1 heure) :\n${url}\n\nSi vous n'avez pas créé de compte, ignorez cet e-mail.`,
      }).catch((error) =>
        console.error(
          "sendVerificationEmail failed",
          error instanceof Error ? error.message : "unknown error",
        ),
      );
    },
  },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
  // Must stay last: lets Server Actions set the session cookie.
  plugins: [nextCookies()],
});
