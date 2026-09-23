# Tonric MarketingOS — Mock-up Plan

A clickable, high-polish mock-up of the AI marketing operations platform to nail the look and feel. Everything runs on realistic Hong Kong demo data (Traditional Chinese first, English and Simplified Chinese switchable). No sign-in, database or live AI yet — those come after the design is approved.

## Step 0 — Pick a visual direction

Before building, I will generate three rendered design directions for you to choose from (e.g. calm editorial, bold command-centre, soft premium). Each keeps the spec's professional B2B restraint but pushes for a distinctive, attractive feel rather than a generic dashboard. Your pick sets colours, typography and mood for the whole app.

## Step 1 — Design system and shell

- Light + dark themes, one signature accent, soft layered surfaces, subtle gradients and glows for AI moments, crisp status pills, line icons.
- CJK-friendly typography (distinctive heading face + Noto Sans TC), generous spacing.
- Tasteful motion: smooth panel slides, card hover lift, skeleton shimmer, streaming-text effect in Copilot.
- Collapsible sidebar with all 14 modules; top bar with brand switcher, search (command palette style), notification bell, language switcher (繁中 / EN / 简中), theme toggle, user menu with a role switcher so you can preview what each role sees.
- Marketing Copilot panel on every page, expandable to full-screen command centre.

## Step 2 — Priority screens (richest detail)

- **Dashboard** — hero greeting with today's priorities, campaign health cards with KPI rings, approval inbox, publishing queue with a failed-post alert, production pipeline, lead funnel chart, performance charts with data-freshness stamps, AI recommendation cards with "why" text.
- **Campaigns** — card/table list with filters; animated 5-step creation wizard ending in a simulated AI-generated plan; campaign workspace with all 8 tabs (Overview, Strategy, Content, Creatives, Calendar, Leads, Analytics, Activity).
- **Content Studio** — filterable list; editor with zh-HK original beside the linked English adaptation, version history and compare, comments, AI action toolbar (simulated new versions), inline advisory checks, and the status workflow bar.
- **Marketing Copilot** — context chips header, scripted conversations answering with artefact cards (content options A/B/C, proposed calendar, campaign draft), Ask/Draft/Propose/Execute mode badges, seeded example prompts.
- **Confirmation card** — the signature safety modal with full preview (copy, asset, native channel preview, account, HKT time, approval + UTM checks) and Confirm / Edit / Cancel.

## Step 3 — Workflow screens

- Approvals: pending cards with approve / request changes / reject, decision history.
- Calendar: month / week / day with channel colours and entry popovers, confirmation-gated scheduling.
- Publishing: items table, status timeline, failed attempt drill-down with retry.
- Asset Library: visual grid, asset detail with version lineage and channel renditions, simulated generation job progress.

## Step 4 — Remaining screens

- Videos: project list, brief, scene-by-scene script, full-screen teleprompter (speed, size, mirror, spacebar), takes, edit requests, hand-off.
- Leads: list with consent badges, lead detail with status stepper and timeline, AI outreach drafts needing approval.
- Brand Hub: brand cards with colour swatches, "brand DNA" editor.
- Integrations, AI Models, Notifications, Jobs, Audit Log (with "verify chain" animation), Profile.

All screens get friendly empty states and loading skeletons. Interactions (approve, schedule, generate) update the on-screen demo data during the session so the flows feel real.

## Technical notes

- Separate route per module and campaign/content/video/lead detail pages, each with its own page title and description.
- Demo data lives in typed local modules; a small in-memory store lets actions change state until refresh.
- Typed translation catalogue for all interface labels in three languages; sample content in zh-HK with English adaptations.
- Theme and language remembered in the browser.
- Charts via a lightweight chart library; design tokens defined centrally for both themes.
- Built so a real backend (accounts, database, AI Copilot) can be plugged in later without redesigning screens.
