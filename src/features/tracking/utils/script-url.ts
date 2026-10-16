export function getScriptUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/script.js`;
}
