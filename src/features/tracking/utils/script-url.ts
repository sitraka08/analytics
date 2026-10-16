export function getScriptUrl(): string {
  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/script.js`;
}
