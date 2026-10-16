const BOT_PATTERN =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|uptime|pingdom|curl|wget|python|java\/|go-http|httpclient|axios|node-fetch|phantom|scrapy|facebookexternalhit|whatsapp|telegram|discord/i;

/** Known bots and requests without a plausible user-agent are not counted. */
export function isBot(userAgent: string | null): boolean {
  return !userAgent || userAgent.length < 10 || BOT_PATTERN.test(userAgent);
}
