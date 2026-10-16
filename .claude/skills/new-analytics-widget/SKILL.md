---
name: new-analytics-widget
description: Add a metric widget to the dashboard (aggregation query, service, chart or table, states). Use for top pages, countries, devices, visitors curve, KPIs.
---

# New analytics widget

1. Read `.claude/context/product-and-domain.md` (definitions) and `.claude/rules/design-and-dataviz.md`.
2. Define the metric in one sentence and its data shape (time series, ranking, value + change).
3. `services/<metric>.ts` in the `analytics` feature: aggregated Drizzle SQL query, filtered by `site_id` and period, bounded (`limit`), after the access check. Also return the previous period if the widget shows a change.
4. `schemas/`: validate the period and filters received from the URL.
5. Pick the rendering: area/line for time, horizontal bars for a ranking, KPI with change for a value. A title that says what is shown.
6. The data component is a Server Component; only the interactive chart is a leaf Client Component. Labels and formats via `Intl` in `fr`.
7. Handle loading (Skeleton), empty (explain how to install the script), error and low data. Provide an accessible text equivalent.
8. Check the query on a realistic dataset (`(site_id, created_at)` index used), then `pnpm lint` and `pnpm build`.
