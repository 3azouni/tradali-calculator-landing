# RatePocket Landing

Product landing for **RatePocket** (currency calculator, expense tracker, and Family / Group shared budgets) by **Tradali**.

## URLs

- **Primary:** https://ratepocket.tradali.com/
- **Get on Google Play:** https://play.google.com/store/apps/details?id=com.tradali.calculator
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

Personal screenshots live in `public/screenshots/01-…` through `15-…`. Family marketing frames (`16-…` through `23-…`) are rasterized from Dark Family design SVGs in the App repo (`design/RatePocket-Family-Separate-SVG-Pages/Dark/`).

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
