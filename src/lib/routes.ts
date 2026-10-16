export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  authCallback: "/auth/callback",
  dashboard: "/dashboard",
  newSite: "/dashboard/sites/new",
  site: (siteId: string) => `/dashboard/sites/${siteId}`,
} as const;
