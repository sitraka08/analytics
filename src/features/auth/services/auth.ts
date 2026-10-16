import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { resetPasswordEmail, verificationEmail } from "../utils/emails";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const isGoogleEnabled = Boolean(googleClientId && googleClientSecret);

// Disabled until a sending domain is verified; REQUIRE_EMAIL_VERIFICATION=true turns it back on.
export const isEmailVerificationRequired = process.env.REQUIRE_EMAIL_VERIFICATION === "true";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: isEmailVerificationRequired,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({ to: user.email, ...resetPasswordEmail(user.name, url) });
    },
  },
  emailVerification: {
    sendOnSignUp: isEmailVerificationRequired,
    sendOnSignIn: isEmailVerificationRequired,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({ to: user.email, ...verificationEmail(user.name, url) });
    },
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? { google: { clientId: googleClientId, clientSecret: googleClientSecret } }
      : {},
  // nextCookies must stay the last plugin: it applies cookies from Server Actions.
  plugins: [nextCookies()],
});
