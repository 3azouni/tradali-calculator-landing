# RatePocket Landing

Product landing for **RatePocket** (daily budget, payday and income, Family and Split groups, AI receipt scan, cloud backup, reports, currency converter) by **Tradali**.

## Product facts (keep in sync with the App)

Checked against the app on 2026-10-06 (`src/theme.ts`, `src/budget/categories.ts`, `supabase/functions/analyze-receipt`, `supabase/functions/delete-account`).

- **Languages:** English, Arabic, Spanish, French, Urdu
- **Free:** budget, income, reports, converter, calculator; up to 2 categories; ads; join invited groups (one Family + one Split); 2 lifetime AI scans; export after a rewarded ad or $0.99 Export once
- **Personal** (`cloud_backup`): $3.99/mo or $39.99/yr; backup and sync, no ads, up to 14 categories, unlimited exports, 35 AI scans/month
- **Pro+** (`pro_plus`): $7.99/mo or $79.99/yr; everything in Personal, own 2 groups (1 Family + 1 Split, per-style cap since app commit 0e5f2fd) with up to 12 people each, 100 AI scans/month
- **Workspaces per account:** Personal + own 1 Family + own 1 Split (Pro+) + join 1 Family + join 1 Split (free) = 5
- **Lifetime Export Pass:** no longer sold; still honoured for owners
- **Group pause:** if the Owner's plan ends the whole group is read-only; Split groups can still record payments
- **Group delete:** every member is emailed a CSV copy (full report + payments), then the group row is deleted with its shared data
- **Account delete:** blocked while the user owns a group; deletes auth user, personal cloud entries/periods/prefs, memberships, sent invites, push tokens; group history shows "Former member"; scan counters are kept

## Store buttons

Neither store listing is public yet (both 404 on 2026-10-06), so the homepage shows non-link "Coming soon" store labels (`.store.soon`) in the hero and the final CTA. When a listing goes live, replace that `<span class="store soon">` with the official App Store / Google Play badge linking to the listing.

## URLs

- **Primary:** https://ratepocket.tradali.com/
- **Terms of Use:** https://ratepocket.tradali.com/terms/
- **Privacy Policy:** https://ratepocket.tradali.com/privacy/
- **Delete account / data:** https://ratepocket.tradali.com/delete-account/
- **OAuth bridge (not the app):** https://ratepocket.tradali.com/auth/callback/ — forwards Google sign-in tokens to the RatePocket app (`ratepocket://` or local Expo web). This is not the product UI.
- **Family invite bridge (not the app):** https://ratepocket.tradali.com/invite/?id=… — opens `ratepocket://family/invite?id=…` (or local Expo web via `app_origin`). This is not the product UI.
- Support: support.tradali@gmail.com
- Legacy paths redirect to RatePocket:
  - `tradali.com/calculator` → `ratepocket.tradali.com`
  - `calculator.tradali.com` → `ratepocket.tradali.com`

## Site structure

- `public/site.css`: one stylesheet for the homepage and legal pages (dark theme, WCAG AA colours, reduced motion)
- `scripts/stamp-assets.mjs`: runs on `npm run deploy` and adds a content hash to `site.css` / `site.js` links (`?v=…`). CSS and JS are cached for 7 days, so this is what lets returning visitors see new styles. Always deploy with `npm run deploy`, not a bare `wrangler deploy`.
- `public/fonts/`: Plus Jakarta Sans subset (WOFF, OFL), self-hosted so the site makes no Google Fonts requests
- `public/img/screens/`: app screens (example data) shown inside CSS phone frames, 440w and 660w WebP
- `public/img/gallery/`: the captioned App Store screenshots used in the Tour strip
- `public/marketing/`, `public/screenshots/`: older art, no longer used by the homepage

## Docs

- `docs/google-play-data-safety.md` — proposed Play Data Safety mapping
- `docs/oauth-branding.md` — OAuth logo candidate notes
- `docs/website-cleanup-internal-report.md` — internal evidence / gaps (not public)

## DNS (Cloudflare)

Add AAAA for RatePocket if missing:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| AAAA | `ratepocket` | `100::` | Proxied |

## Local / deploy

```bash
npm install
npm run dev
npm run deploy
```

Worker name: `tradali-calculator-landing`
