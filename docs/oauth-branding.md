# OAuth / branding assets (RatePocket)

## Google Cloud verification status (reviewed Sep 20, 2026)

| Check | Status | Notes |
|---|---|---|
| Privacy policy | Passed | `https://ratepocket.tradali.com/privacy/` |
| Homepage | Failed — “behind a login page” | Homepage is public (no app login). Likely Cloudflare bot challenge and/or weak brand-first signal confused the crawler. Site updates below address identity + explicit no-login copy. |
| Branding / logo | Failed — “does not uniquely identify” | Upload the **lockup** (R mark + **RatePocket** wordmark), not the R-only icon. |

Official Google requirements: [Verification requirements](https://support.google.com/cloud/answer/13464321), [Manage OAuth App Branding](https://support.google.com/cloud/answer/10311615).

## Production mark

| Asset | Path |
|---|---|
| Nav mark (transparent R) | `public/brand/ratepocket-mark-purple.svg` |
| Favicon | `public/brand/logo-r.png` |
| **OAuth upload (lockup)** | `public/brand/oauth/ratepocket-oauth-logo.png` |
| Editable OAuth SVG | `public/brand/oauth/ratepocket-oauth-logo.svg` |

OAuth logo = purple R + **RatePocket** wordmark on `#0A0A0E`, square 512×512, well under 1 MB. Rebuild: `node scripts/build-oauth-logo.cjs`.

**Not trademark-cleared. Not guaranteed to pass Google review.**

## Manual Google Cloud steps

1. Confirm OAuth **Homepage URI** is exactly `https://ratepocket.tradali.com/` (not Play Store, not `tradali.com` alone, not a workers.dev URL).
2. Privacy URI: `https://ratepocket.tradali.com/privacy/`
3. App name: **RatePocket**
4. Support: `support.tradali@gmail.com`
5. Upload `ratepocket-oauth-logo.png` on Branding.
6. In Cloudflare (tradali.com zone): ensure Google’s crawler is not blocked by Bot Fight Mode / “I’m Under Attack” for `ratepocket.tradali.com` (or temporarily allowlisted), then re-check that an anonymous browser / curl sees HTML with “RatePocket” without a challenge interstitial.
7. Reply in the Trust & Safety email thread (see draft below). Do not promise approval.

### Suggested Trust & Safety reply

```
Hello Trust & Safety team,

We resolved the open verification items for RatePocket (OAuth brand verification):

1) Homepage (“behind a login page”)
- Application home page: https://ratepocket.tradali.com/
- This page is public and does not require login. It describes RatePocket (Android calculator, currency converter, spending tracker), links to Privacy Policy and Terms in the page HTML, and states that Google sign-in is optional (Cloud Backup only).
- Privacy Policy (passed): https://ratepocket.tradali.com/privacy/
- Please re-crawl the homepage. If a Cloudflare challenge previously appeared, that is not an application login wall.

2) Branding / logo uniqueness
- We updated the OAuth logo to a RatePocket lockup: the RatePocket wordmark plus our purple R mark (not a generic icon and not a Google/third-party mark).
- App name on the consent screen: RatePocket
- Please re-review with the newly uploaded logo asset.

Support email: support.tradali@gmail.com

Thank you,
Tradali (individual developer operating RatePocket)
```
