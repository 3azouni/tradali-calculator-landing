# RatePocket Landing

Product landing for **RatePocket** (currency calculator, expense tracker, Cloud Backup, and owner-funded Groups) by **Tradali**.

## Product facts (keep in sync with the App)

- **Closed-test winners spinning wheel:** completed testers may be reviewed and selected for a chance to win; visual wheel at `#winners` (edit `SELECTED_TESTERS` in `public/app.js`). No guaranteed award, no USDT prize offer, no automated payouts on this site.
- **Languages:** English, French, Spanish, Arabic, Urdu
- **Free:** local tools; ads may show; join invited groups free; 2 AI scan trial; export via ad cooldown or $0.99 credit
- **Lifetime Export Pass:** ~$6.99 one-time — unlimited personal export; no Cloud / groups / ad-free
- **Cloud Backup:** ~$3.99/mo or ~$29.99/yr — personal sync, ad-free, 55 AI scans/mo, own 1 group (7 seats); invitees free
- **No** separate Group Lifetime ($7.99) product; legacy Family SKUs not sold as a new plan

## URLs

- **Primary:** https://ratepocket.tradali.com/
- **Join testers (homepage funnel):** https://ratepocket.tradali.com/#testers
- **Winners wheel:** https://ratepocket.tradali.com/#winners
- **1. Email list (Google Form):** https://forms.gle/pYdKT3ir3ttVC4CcA
- **2. Install link:** emailed privately after you add their Google email in Play Console — **not published on the landing page**
- **3. Optional feedback:** mailto support.tradali@gmail.com · optional feedback form
- **Feedback form:** https://docs.google.com/forms/d/e/1FAIpQLSdqYBE1KaDMo2OUMkQHVsxYX60PA3T_Y0mqqHyJjTjnB-pN6g/viewform?usp=dialog

Responses land in your Google Form / linked Sheet. Add emails in Play Console, then email testers the private Play testing / store link. Do not put that link on the public homepage.
- **Terms of Service:** https://ratepocket.tradali.com/terms/
- **Privacy Policy:** https://ratepocket.tradali.com/privacy/
- **Delete account / data:** https://ratepocket.tradali.com/delete-account/
- **OAuth bridge (not the app):** https://ratepocket.tradali.com/auth/callback/ — forwards Google sign-in tokens to the RatePocket app (`ratepocket://` or local Expo web). This is not the product UI.
- **Family invite bridge (not the app):** https://ratepocket.tradali.com/invite/?id=… — opens `ratepocket://family/invite?id=…` (or local Expo web via `app_origin`). This is not the product UI.
- Support: support.tradali@gmail.com
- Legacy paths redirect to RatePocket:
  - `tradali.com/calculator` → `ratepocket.tradali.com`
  - `calculator.tradali.com` → `ratepocket.tradali.com`

## Marketing screenshots

Family campaign art lives in `public/marketing/family-*.jpg` (Better together, Shared budget, Members, Permissions). Personal tool screenshots remain in `public/screenshots/`. Older Family SVG rasters (`16-…` through `23-…`) are kept for reference but the homepage hero and Family sections use the campaign frames.

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
