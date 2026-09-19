# RatePocket website cleanup — internal report

**Date:** 2026-09-19  
**Scope:** Landing site (`Landing/`) aligned to App evidence (`App/`).  
**Not for public publication.**

## Evidence sources

| Area | Files inspected |
|---|---|
| Cloud Backup purchase / sign-in | `App/src/hooks/useTradali.ts` (`buyCloudBackup`, `enableCloudSignIn`, `requestCloudSignIn`); `App/App.tsx` Cloud Backup sheet (“Step 1 · Sign in…”) |
| Account deletion | `App/App.tsx` Settings → Delete account; `App/src/hooks/useTradali.ts` `deleteCloudAccount`; `App/src/services/auth.ts` `deleteAuthAccount`; `App/supabase/functions/delete-account/index.ts` |
| Receipt scan | `App/src/hooks/useTradali.ts` `scanReceipt` Alert; `App/src/services/receiptScan.ts`; `App/supabase/functions/analyze-receipt/index.ts`; `App/supabase/migrations/20260314120000_receipt_scan_and_groups.sql` |
| Ads / UMP | `App/src/ads/adsService.ts`; `App/src/ads/AdSlot.native.tsx`; Settings “Ad privacy options” in `App/App.tsx` |
| OpenAI retention (published docs) | https://developers.openai.com/api/docs/guides/your-data ; https://help.openai.com/en/articles/5722486-api-data-usage-policies |
| Play account deletion policy | https://support.google.com/googleplay/android-developer/answer/13327111 |

## 1. Privacy drafting comments removed

Removed from public privacy page:

- “Legal entity… may be updated when confirmed”
- “We do not invent fixed delete within X days…”
- Play Console / Data Safety mapping instruction

Unresolved legal-identity questions stay in this report (section 6), not on the live policy. **Confirmed:** individual developer using the name Tradali (not a registered company). Public pages use the consistent identification sentence.

## 2. Cloud Backup sequence

**App behavior (enforced):** subscribe purchase requires a signed-in Google session (`buyCloudBackup` returns early with “Sign in with Google first…”). Settings / sheet copy is “Sign in with Google · then subscribe.”

**Website:** previously homepage said subscribe-then-sign-in; FAQ said sign-in-first. Public copy now uses neutral wording everywhere: **“Cloud Backup requires an active subscription and Google sign-in.”** Local calculator / convert / spending remain without an account.

## 3. Account deletion

### Implemented (code-verified)

In-app path exists and is wired:

1. Settings  
2. Account & data  
3. Delete account (only when `signedIn`)  
4. Confirm → `deleteCloudAccount()` → `delete-account` Edge Function

Endpoint checks:

- Requires `Authorization` header  
- Resolves user via `auth.getUser()` for that session  
- Deletes `spending_entries` and `spending_periods` for **that** `user.id`  
- Deletes auth user via service role  
- Client then signs out and clears local spending storage  

**Play policy:** apps that create accounts need **both** in-app deletion and a web resource. Web email request remains valid as the external pathway.

### Distinctions (documented publicly)

| Action | Effect |
|---|---|
| Sign out | Stops sync; local data stays; account remains |
| Clear data | Clears local (+ cloud spends if signed in); sign-in/purchases stay |
| Delete account | Deletes auth user + cloud spending; resets local spending |
| Cancel Play subscription | Billing only; does not delete cloud account |

### Gaps / caveats (do not over-claim)

- `receipt_scan_usage` is keyed by **install_id**, not `user_id`. Account deletion does **not** remove those counters.
- Group-trip tables (`trip_groups`, etc.) use `ON DELETE CASCADE` from `auth.users` if rows exist; Cloud Backup personal tables are explicitly wiped. Trip features are not the current product focus.
- **30-day target** applies to **email/support** verification workflow as stated on the deletion page. In-app deletion is intended to complete when the Edge Function returns success. There is **no written support runbook** in-repo proving average email turnaround; treat 30 days as an operational aim, not a measured SLA.
- Device UI path was verified in source, not by running a signed-in Android deletion end-to-end in this session.

## 4. Receipt images & identifiers

| Fact | Evidence |
|---|---|
| Image uploaded only after disclosure Continue | `scanReceipt` Alert; Cancel → return, no upload |
| Image sent to Edge Function, then OpenAI Chat Completions vision | `analyze-receipt/index.ts` |
| RatePocket does not persist receipt images in DB/storage | No insert of image bytes; only `receipt_scan_usage` upsert of counts |
| Install id local + durable | `ratepocket_install_id_v1` in AsyncStorage |
| Quota counters persist | `receipt_scan_usage (install_id, year_month, scan_count)` |
| OpenAI default: no training on API data; abuse monitoring up to ~30 days unless ZDR | OpenAI public docs (linked on privacy page). RatePocket does **not** claim ZDR is enabled for this project |

## 5. Privacy controls verification

### Code-verified (Android paths)

| Control | Result | Paths |
|---|---|---|
| UMP gather before ads init | `gatherAdsConsent()` → `canRequestAds`; `initAds()` refuses init if false | `src/ads/adsService.ts` |
| Banner / native / rewarded / rewarded interstitial / app-open preload | All go through `initAds()` (app-open only after successful init) | `adsService.ts`, `AdSlot.native.tsx` |
| Privacy options reopen | Settings → Ad privacy options; checks `privacyOptionsRequirementStatus` | `App.tsx`, `adsService.ts` |
| Receipt disclosure before upload | Alert before picker/upload; Cancel sends nothing | `useTradali.ts` `scanReceipt` |

### Not device-tested in this session

- Live UMP form appearance in EEA debug geography on a physical device / emulator  
- Returning-user consent persistence across installs  
- AdMob Privacy & messaging form published status in AdMob console  

**Runtime device testing remains manual.** App repository for those checks: `d:\___Development\RatePocket\App`.

### Manual AdMob / Google steps still needed

1. Confirm AdMob Privacy & messaging (UMP) forms for app id `ca-app-pub-4873621164720937~4829629114`.  
2. Play Console Data Safety + account-deletion URL: `https://ratepocket.tradali.com/delete-account/`.  
3. OAuth branding upload / re-review after logo decision (section 7).

## 6. Legal identity (confirmed)

| Question | Answer |
|---|---|
| Operator | Individual developer |
| Tradali | Developer/publishing name — **not** a registered company (not LLC/Ltd/Inc or separate legal entity) |
| Business location | Not provided — not published |
| Governing law / venue | No preferred wording — site designates **none**; no inference from nationality/location |

Public identification (privacy, terms, deletion, structured data):  
**“RatePocket is operated by an individual developer using the name Tradali.”**

### Flagged for jurisdiction-specific legal review (do not invent fixes)

These Terms clauses are published but remain flagged for appropriate legal review; enforceability varies by jurisdiction:

- §14 Disclaimer of warranties  
- §15 Limitation of liability (including the USD $50 / 12-month fees cap)  
- §16 Indemnity  
- §19 Governing law (intentionally no chosen jurisdiction)  

Contact for support remains `support.tradali@gmail.com`.

## 7. Google OAuth logo

| Asset | Status |
|---|---|
| Selected mark | Official purple R SVG (`ratepocket-mark-purple.svg`) |
| Site usage | Nav/footer use SVG; favicon uses square PNG on dark |
| OAuth upload | `public/brand/oauth/ratepocket-oauth-logo.png` (~10 KB, square, &lt; 1 MB) |

**Remaining step:** upload the OAuth PNG in Google Cloud and request review if needed. Approval is not guaranteed. Production site assets updated locally; live site updates after deploy.


## 8. Deploy status

Changes are **local** under `d:\___Development\RatePocket\Landing\public\` (+ docs).  
Live `https://ratepocket.tradali.com` is unchanged until:

```bash
cd d:\___Development\RatePocket\Landing
npm run deploy
```

Worker: `tradali-calculator-landing` (see README). After deploy, recheck homepage, `/privacy/`, `/terms/`, `/delete-account/` without auth, mobile + desktop.
