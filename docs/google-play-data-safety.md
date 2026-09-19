# RatePocket — Google Play Data Safety (proposed mapping)

Prepared from the current RatePocket Android app and backend code (September 19, 2026).  
Use Google’s definitions in Play Console. Do **not** treat every external transfer as “sharing.” Apply service-provider / processing exceptions where Google’s form allows.

**App:** RatePocket · `com.tradali.calculator` · Brand: Tradali · Support: support.tradali@gmail.com

## Data types and purposes (proposed)

| Data type (Play category) | Collected? | Shared? | Purpose | Optional? | Notes from code |
|---|---|---|---|---|---|
| Email address | Yes (if Cloud Backup sign-in) | No (processing via Google/Supabase Auth) | Account management / App functionality | Yes — only with Cloud Backup | From Google OAuth via Supabase |
| User IDs | Yes (Google/Supabase user id; local install id for scan quotas) | No (providers process) | App functionality | Account id optional; install id created for receipt quotas | |
| App interactions | Yes (AdMob / Play / RevenueCat as part of SDKs) | Yes for ads (Google AdMob) | Advertising; Analytics/fraud as SDK default | Ads shown in free experience | Honor UMP where required |
| Device or other IDs (Advertising ID) | Yes (AdMob) | Yes (Google) | Advertising | Tied to ads / consent | |
| Financial info — User payment info | No (Google Play holds card data) | N/A | — | — | Play Billing + RevenueCat entitlements only |
| Purchase history / entitlements | Yes (via RevenueCat / Play) | Processing via RevenueCat/Google | App functionality | Paid features optional | |
| Photos (receipt images) | Yes when user starts AI scan | Processing via Supabase Edge Function → OpenAI | App functionality | Yes — optional scan | Not a permanent cloud photo library; quota counters stored |
| Other user content (spending notes, amounts, categories) | Yes locally; yes in cloud if Cloud Backup on | Processing via Supabase when backed up | App functionality | Cloud optional | |
| Approximate location | Possibly via AdMob IP | Google ads | Advertising | Ads | |

## Ephemeral / not stored by RatePocket as a product feature

- Receipt image bytes transmitted for a scan request; we store scan **counts** keyed by install id, not a user gallery of receipts.
- Exchange-rate network fetches for conversion.

## Deletion

- Local: Settings → Clear data / clear storage / uninstall.
- Cloud Backup account: **in-app** Settings → Account & data → Delete account (signed-in), web https://ratepocket.tradali.com/delete-account/, or email support.tradali@gmail.com.
- Endpoint `delete-account` verifies the Authorization session user and deletes that user’s spending rows + auth user.
- Play subscriptions: cancel in Google Play separately.
- `receipt_scan_usage` (install_id quotas) is **not** auto-deleted with the auth user.

## Outstanding manual Play Console / AdMob / OAuth steps

1. Align Data Safety form answers with this table.
2. Publish AdMob Privacy & messaging (UMP) forms for the AdMob app id `ca-app-pub-4873621164720937~4829629114`.
3. Confirm account-deletion URL in Play Console points at `https://ratepocket.tradali.com/delete-account/`.
4. Confirm OAuth branding assets in Google Cloud Console after logo candidate approval (see `oauth-branding.md`).
5. See `website-cleanup-internal-report.md` for verification notes and unresolved legal identity.
