# Design and visualization

## Identity
- Landing inspiration: warm cream background, large sections with very rounded corners, strong headings, dark pill CTAs, colored stat cards (blue, green, orange, yellow), sober photos/illustrations.
- The product must feel hand-made, not "generated UI": avoid centered card + logo above + big shadow, blue focus halos, dark backgrounds with decorative circles. Prefer left-aligned editorial layouts, drawn details (`HandDrawnUnderline`, `bg-highlight` marker), warm text tone.
- Reference palette (do not change without being asked): background `#f6f5f1`, cream `#efebe1`, text `#121212`, blue `#4a6cf7`, green `#7dd389`, orange `#ff6633`, yellow `#ffde2e`. Panel gradients via `panel-*` tokens (`bg-linear-160 from-panel-sand-from to-panel-sand-to`).
- Colored cards and badges: background via `toneClass` from `src/lib/tones.ts`, text always white (`text-tone-foreground`), a deliberate choice even on yellow/green.
- Illustrations: inline SVG drawn in line style (outline `var(--foreground)`, fills `var(--brand-*)`), `aria-hidden`, no dependency or external image. Shared ones in `components/shared/illustrations/` (`DeskScene`), otherwise in the feature (`GlobeScene` of the landing).
- Fonts via `next/font/google` in `src/app/layout.tsx`, mapped in `globals.css`:
  - `font-heading` → Manrope: `h1`–`h3` (applied globally), card titles, big numbers/KPIs.
  - `font-sans` → Google Sans: body text, forms, navigation.
  - `font-mono` → Google Sans Code: code snippets, number tables (with `tabular-nums`).
- shadcn/ui (base-nova style, Base UI); `@shadcn-space` registry in `components.json` to start from free blocks: adapt them in the relevant feature then delete the generated files (`components/shadcn-space/`, demo routes).
- Animations: `motion` (`motion/react`) through `MotionProvider` (LazyMotion + `reducedMotion="user"`) and the `Reveal`/`RevealGroup`/`RevealItem` primitives from `components/shared/reveal.tsx`. Animate entrance and hover, never block reading.
- Tokens as CSS variables in `globals.css` (colors, radii, shadows). No hardcoded color in components.
- Light and dark: both, via tokens. Mobile-first and responsive.

## Forms and auth pages
- Auth layout (`AuthShell`): two columns on cream background; form on the left (`max-w-sm`, left-aligned, title via `AuthPanel` with an underlined word), `AuthAside` brand panel on the right (`rounded-4xl bg-cream-deep`, illustration + colored tiles), hidden below `lg`.
- Fields: reuse `TextField` / `PasswordField` from `features/auth/components/` (extract to shared as soon as a 2nd feature needs them). Style: white `bg-surface` box, 2 px `border-foreground/15` border, small label inside, hover `border-foreground/35`, focus `border-foreground` without halo, error `border-destructive` + message with icon below. Never make a field look disabled (gray background without border).
- Password: show/hide button (`aria-label`, `aria-pressed`).
- Buttons: `SubmitButton` = dark `h-12` pill with an arrow badge (spinner while submitting); secondary ones as outline pills; links as underlined text.

## Dashboard
- shadcn/ui: collapsible `Sidebar` (icons only when collapsed, remembered state), `Card`, `Tabs`, `Select`, `Skeleton`, `Chart`.
- Layout: sidebar on the left, header with site and period selectors, content as a grid of cards.
- Components in `components/ui/` come from shadcn; do not rewrite them.

## Chart readability
- One idea per chart; a title that says what is shown ("Visitors per day", not "Time series").
- Start with 3 to 4 KPIs with change vs previous period (arrow + percentage, color and icon, never color alone).
- Charts via shadcn Chart (Recharts); suitable types: area/line for time, horizontal bars for rankings, no pie beyond 4 slices.
- Readable tooltip, sober axes, discreet grid, compact values (`1,2 k`) with `Intl.NumberFormat('fr')`.
- Limited, accessible categorical palette; sufficient contrast in light and dark.

## Required states
Every widget handles: loading (same-shape `Skeleton`), empty (message explaining what to do, e.g. install the script), error (clear message + retry), and low data.

## Accessibility
Semantic HTML, labels on fields, keyboard-usable controls, visible focus, text equivalent or table for every chart.

## Text
French only for displayed UI text, in a simple tone. Centralize labels (feature constants) so they can be extracted later. Code, comments and docs stay in English.
