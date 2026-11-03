# Product and domain

## Vision

A simple web analytics tool: add a script to your site and understand in a few seconds where visitors come from, what they read and how long they stay. Inspired by Vercel Analytics, but with charts and labels that are easier to read.

## Problem solved

Existing dashboards are dense or cryptic. Here: few numbers per screen, titles in plain language, comparison with the previous period, empty states that explain what to do.

## Target

Independent developers, creators and small teams who want to track their sites without heavy setup.

## Model

- **User**: account (Better Auth).
- **Site**: tracked domain, belongs to a user, has a public collection key.
- **Event**: pageview (and custom events later): site, path, referrer, UTM, country, device, browser, OS, timestamp.
- **Visitor**: anonymous identifier = salted daily hash (see tracking-and-privacy.md).
- **Session**: sequence of events from the same visitor, cut after 30 min of inactivity.

## Metrics

- Unique visitors, pageviews, average visit duration, bounce rate (single-page session).
- Top pages, top referrers, countries, devices, browsers, OS, UTM campaigns.
- Periods: 24 h, 7 d, 30 d, 90 d, custom, with comparison to the previous period.

## Out of MVP scope

Custom events, funnels, real time, multi-member teams, alerts, export, billing.
