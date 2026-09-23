# Refine campaign, leads, and dashboard UI

## What will change

- **Campaign wizard:** Make all five steps feel complete and guided, with clearer progress, richer objective/channel choices, a campaign summary, believable AI generation feedback, editable AI-plan sections, and safe back/close behavior.
- **Lead scores:** Replace the tiny uniform bars with readable, color-coded score meters, score bands, accessible labels, and a mobile-friendly lead list while retaining the current table on larger screens.
- **Dashboard charts:** Improve KPI hierarchy, chart legends and tooltips, comparison context, period controls, and the lead funnel so trends and conversion drop-offs are easier to scan.

## Interaction and visual quality

- Reuse the existing jade/amber design tokens, typography, buttons, status styles, translations, and light/dark themes.
- Keep all behavior as session-only demo data with no sign-in, database, or live AI.
- Preserve existing routes and navigation.
- Respect reduced-motion settings and ensure controls have clear focus and accessible labels.

## Verification

- Check the dashboard, leads page, and every campaign wizard step on desktop and the current narrow preview size.
- Confirm AI-plan generation, editing, navigation, lead links, period switching, and chart tooltips work without console or runtime errors.
- Confirm the latest preview build succeeds.
