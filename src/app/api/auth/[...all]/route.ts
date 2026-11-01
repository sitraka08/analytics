import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/features/auth/services/auth";

// Better Auth endpoints: OAuth callback, email verification and password reset links.
export const { GET, POST } = toNextJsHandler(auth);
