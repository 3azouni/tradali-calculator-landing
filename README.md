# RatePocket Landing

Product landing for **RatePocket** (currency calculator & expense tracker).

## URLs

- **Primary:** https://ratepocket.tradali.com/
- **Join Android testing:** https://play.google.com/apps/testing/com.tradali.calculator
- **Privacy Policy:** https://ratepocket.tradali.com/privacy/
- **Delete account / data:** https://ratepocket.tradali.com/delete-account/
- Legacy paths redirect to RatePocket:
  - `tradali.com/calculator` → `ratepocket.tradali.com`
  - `calculator.tradali.com` → `ratepocket.tradali.com`

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
