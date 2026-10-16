# Tracking and privacy

## Collection flow
1. The client site loads a tiny script (`/script.js`, served by the app) with its site key.
2. The script sends a `POST /api/collect` (`navigator.sendBeacon` or keepalive `fetch`) on each navigation, SPA included (History API).
3. Duration is sent when the page is closed or hidden (`visibilitychange`).
4. The server validates (Zod), filters bots, enriches (country, device), computes the visitor hash, then inserts the event. Response `202` with no body.

## Cookie-less visitor identity
`visitor_id = hash(daily_salt + site_id + IP + user-agent)`.
- The salt changes every day and is not kept after rotation: a visitor cannot be linked from one day to the next.
- The raw IP and user-agent are never stored.
- Accepted consequence: a visitor returning on another day counts as new.

## Enrichment
- Country: Vercel headers (`x-vercel-ip-country`); region/city only if useful and not precise.
- Device, browser, OS: parsed from the user-agent, then the user-agent is discarded.
- Referrer: domain only by default; UTM from the page URL.

## Public endpoint protection
- CORS limited to the domains declared for the site key.
- Rate limit per IP and per site.
- Bounded payload size, validated and truncated fields.
- Rejection of known bots and of requests without a user-agent.

## Compliance
No personal data, no cookie, no browser storage: no consent banner. Document this behavior on the privacy page.
