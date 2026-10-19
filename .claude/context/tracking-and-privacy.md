# Tracking and privacy

## Collection flow
1. The client site loads a tiny script (`/script.js`, served by the app) with its site key.
2. The script sends a `POST /api/collect` (`navigator.sendBeacon` or keepalive `fetch`) on each navigation, SPA included (History API).
3. Duration is sent when the page is closed or hidden (`visibilitychange`).
4. The server validates (Zod), filters bots, enriches (country, region, city, device), computes the visitor hash, then inserts the event. Response `202` with no body.

## Script details
- The script is skipped when Do Not Track is on or the browser is automated (webdriver).
- Each pageview gets a random id generated in memory (never stored in the browser). The duration message carries the same id so the server can update that pageview. It identifies a page view, not a person.
- Duration is the visible time of the page, reported when the tab is hidden and when the SPA navigates.
- Payloads are sent as `text/plain` JSON, which avoids a CORS preflight.

## Cookie-less visitor identity
`visitor_id = hash(daily_salt + site_id + IP + user-agent)`.
- The salt is `HMAC(VISITOR_SALT_SECRET, UTC date)`: it changes every day and nothing is stored, so a visitor cannot be linked from one day to the next.
- A session continues while the visitor's last event is less than 30 minutes old (computed server-side from the hash).
- The raw IP and user-agent are never stored.
- Accepted consequence: a visitor returning on another day counts as new.

## Enrichment
- Country: Vercel headers (`x-vercel-ip-country`); region (`x-vercel-ip-country-region`) and city (`x-vercel-ip-city`) are stored as text, computed at Vercel's edge: the IP is never read or stored by us. No coordinates, no postal code. City is justified by the "where do visitors come from" widget and the per-visit view; it is not precise enough to identify a person alone, and the daily-rotating hash still prevents linking visits across days.
- Owner opt-out: opening the site with `?no-track` stores a local flag (`statly_ignore`) so the script sends nothing from that browser; `?no-track=0` removes it.
- Device, browser, OS: parsed from the user-agent, then the user-agent is discarded.
- Referrer: domain only by default; UTM from the page URL.

## Public endpoint protection
- CORS limited to the domains declared for the site key.
- Rate limit per IP and per site.
- Bounded payload size, validated and truncated fields.
- Rejection of known bots and of requests without a user-agent.

## Compliance
No personal data, no cookie, no browser storage: no consent banner. Documented on `/privacy` (`features/legal/constants/privacy.ts`); keep it in sync with any change to the collected data.
