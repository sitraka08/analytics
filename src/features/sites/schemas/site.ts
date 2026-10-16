import { z } from "zod";

const HOSTNAME_PATTERN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

// Accepts a bare domain or a pasted URL and keeps only the hostname, without "www.".
function toHostname(value: string): string {
  const withoutProtocol = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  const host = withoutProtocol.split(/[/?#]/)[0].split(":")[0];
  return host.replace(/^www\./, "");
}

export const domainField = z
  .string()
  .trim()
  .toLowerCase()
  .transform(toHostname)
  .pipe(z.string().regex(HOSTNAME_PATTERN, { error: "Saisissez un domaine valide, par exemple exemple.fr." }));

export const createSiteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Donnez un nom au site (2 caractères minimum)." })
    .max(80, { error: "Le nom ne peut pas dépasser 80 caractères." }),
  domain: domainField,
});

export type CreateSiteField = keyof z.infer<typeof createSiteSchema>;
