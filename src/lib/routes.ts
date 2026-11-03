export const ROUTES = {
  home: "/",
  terms: "/terms",
  privacy: "/privacy",
  legalNotice: "/legal-notice",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
  newSite: "/dashboard/sites/new",
  settings: "/dashboard/settings",
  site: (siteId: string) => `/dashboard/sites/${siteId}`,
  siteVisits: (siteId: string) => `/dashboard/sites/${siteId}/visits`,
  siteSettings: (siteId: string) => `/dashboard/sites/${siteId}/settings`,
  siteVisit: (siteId: string, sessionId: string) =>
    `/dashboard/sites/${siteId}/visits/${sessionId}`,
} as const;
