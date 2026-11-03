// Single source of truth for the legal documents. Fill the placeholders before launch.
const TODO = "[À COMPLÉTER]";

export const PUBLISHER = {
  name: TODO,
  email: TODO,
  lastUpdated: "16 octobre 2026",
  hosting: {
    app: {
      name: "Vercel Inc.",
      address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    },
    database: {
      name: "Supabase Inc.",
      address: "970 Toa Payoh North #07-04, Singapour 318992",
    },
  },
  /** Days an analytics event is kept before deletion (no purge job exists yet: build it before launch). */
  eventRetentionMonths: 13,
} as const;
