# Tonric MarketingOS — Implementation Plan

An AI-powered marketing operations platform: campaign planning, content creation, human approval, publishing, leads and analytics — with a persistent Marketing Copilot. Traditional Chinese (Hong Kong) first, with English and Simplified Chinese.

Confirmed with you: real backend from day one, priority modules first, all three languages working.

## Phase 1 — Foundation

- Turn on Lovable Cloud (accounts, database, file storage, server-side AI).
- Sign-up / sign-in, plus a profile with display name, language, timezone, theme.
- Organisation + multi-brand data model; switching brand re-scopes everything on screen.
- Ten roles (platform admin, brand admin, marketing director, campaign manager, content marketer, designer, analyst, approver, sales user, client viewer) stored in a dedicated roles table; menu items and action buttons appear only for permitted roles.
- Seeded demo organisation with realistic Hong Kong SME marketing data in Traditional Chinese, so every screen is populated on first login.

## Phase 2 — Design system and shell

- Neutral zinc palette with one restrained accent, light + dark themes, 8px spacing, rounded cards with hairline borders, status pills, line icons.
- Inter + Noto Sans TC typography, 14px base, CJK-friendly.
- Collapsible left sidebar: Dashboard, Campaigns, Content Studio, Asset Library, Videos, Approvals, Calendar, Leads, Integrations, Publishing, Jobs, Audit Log, AI Models, Brand Hub.
- Top bar: organisation + brand selector, global search, notification bell with unread count, language switcher (繁中 / EN / 简中), theme toggle, user menu.
- Right-side Copilot panel on every page, collapsible and expandable to full screen.
- Three-language translation layer covering all interface labels; sample content is authored zh-HK with linked English adaptations.
- Loading skeletons and friendly dashed empty states as shared building blocks.

## Phase 3 — Priority modules

**Dashboard** — campaign health, approval inbox, publishing queue, production status by stage, lead funnel, performance summary with data-freshness stamps, AI recommendation cards that explain their reasoning. Each widget links into its module.

**Campaigns** — filterable list; 5-step creation wizard (objective, audience, offer & message, channels, AI-generated editable plan); campaign workspace with Overview, Strategy, Content, Creatives, Calendar, Leads, Analytics and Activity tabs.

**Content Studio** — list with filters; editor with zh-HK original and linked English adaptation side by side, version history recording author, model and prompt, version compare, comments and assignment, AI actions (draft, rewrite, variants, adapt) each creating a new version, automated advisory checks (channel limits, banned phrases, missing CTA), and the workflow bar driving draft → submitted → changes requested → approved → scheduled → published.

**Marketing Copilot** — editable context header, chat thread whose answers arrive as clickable artefact cards backed by real records, Ask / Draft / Propose / Execute mode indicator, full-screen command centre with live campaign artefacts, seeded example prompts.

**Confirmation cards** — the shared safety component gating every consequential action, showing full preview (copy, asset version, channel preview, account, timezone, approval and UTM state) with Confirm / Edit / Cancel.

## Phase 4 — Workflow modules

- Approvals: pending queue and decision history, approve / request changes / reject with notes, brand filter, requester notifications.
- Calendar: month / week / day views, channel colouring, filters, entry popovers; scheduling, rescheduling and cancelling all confirmation-gated.
- Publishing: items table with status machine, timestamps, remote and UTM links, attempt history with sanitised errors and safe retry.
- Asset Library: asset grid, version gallery with lineage, channel renditions, async generation jobs with status polling, approval submission.

## Phase 5 — Remaining modules

- Videos: full presenter-video pipeline — brief, scene-by-scene script with lock and approval, full-screen teleprompter (speed, font size, mirror, spacebar), takes upload and selection, edit requests, hand-off creating a content item.
- Leads & Outreach: list with consent enforcement, CSV import, suppression list, lead detail with state-machine transitions and audit timeline, AI outreach drafts that always require human approval — never auto-send.
- Brand Hub: brand cards with default/archive guards; identity editor for tone, value propositions, approved and prohibited claims, banned phrases, glossary, personas; visual identity with colours and fonts. These rules feed every AI draft.
- Integrations: provider app setup cards, channel connection cards with health, scopes and brand assignment, confirmation-gated disconnect, "coming soon" cards.
- AI Models, Notifications, Jobs, Audit Log (hash-chained with verify action), Profile settings.

## Technical notes

- TanStack Start with server functions; Lovable Cloud (Postgres) with row-level security scoped by organisation and brand; roles in a separate table checked by a security-definer function.
- AI generation runs server-side through the Lovable AI Gateway, with brand DNA injected into every prompt; long generations stream. Image generation for creative assets; async jobs recorded in the Jobs table with polling.
- Every write records an append-only, hash-chained audit event.
- Publishing and outreach execution are stubbed behind confirmation + approval until real channel OAuth connections are configured; the status machinery and retry idempotency are real.
- Translations in a typed message catalogue, with the active language stored on the profile.

## Out of scope for now

Live posting to LinkedIn/Meta requires OAuth apps and credentials from you; until then those connections run in mock mode and posts stop at "ready to publish".
