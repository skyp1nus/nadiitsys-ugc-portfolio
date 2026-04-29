# Nadiitsys.com — Roadmap

> Status: post-migration. Production live at `nadiitsys.naditsys-ugc.workers.dev`, custom domain pending. Audit findings in [`AUDIT.md`](./AUDIT.md).

## Legend
- 🚨 — blocker for the public user-facing release
- ⚠️ — debt that compounds; should be addressed
- 💡 — nice-to-have, not blocking
- 🔒 — blocked by an external dependency

---

## Now (current iteration)

### 🚨 Custom domain hookup
**Why:** the site is on `*.workers.dev`, which is not appropriate for a public portfolio.
**How:**
1. Buy `nadiitsys.com` from a registrar.
2. Cloudflare dashboard → Websites → Add site → grab the assigned NS records.
3. Delegate NS at the registrar (1–24 h propagation).
4. Cloudflare dashboard → Workers → Routes:
   - `nadiitsys.com/*` → `nadiitsys`
   - `admin.nadiitsys.com/*` → `nadiitsys`
5. In `wrangler.toml` add `workers_dev = false` (disable the default URL once Routes are live).
6. Set `NEXT_PUBLIC_SITE_URL=https://nadiitsys.com` so `app/robots.ts` and `app/sitemap.ts` flip to production-allow rules.
7. Smoke test on both hostnames; verify `admin.nadiitsys.com/admin/travel` editor flow + public `nadiitsys.com/travel` render.

---

## Next (following iteration)

### 🔒 Switch back to `proxy.ts`
**Status:** blocked.
**Tracking:** [opennextjs-cloudflare#962](https://github.com/opennextjs/opennextjs-cloudflare/issues/962) — Node-runtime middleware support.
**When:** after the issue closes AND the regression noted in [vercel/next.js#86122](https://github.com/vercel/next.js/issues/86122) (CF + `proxy.ts` compatibility) is verified clean.
**How (once unblocked):**
1. `git mv middleware.ts proxy.ts`.
2. Rename the exported function from `middleware` to `proxy`.
3. Drop the `export const config = { matcher: ... }`; `proxy.ts` uses a different shape.
4. Local smoke: `bunx opennextjs-cloudflare preview`.
5. If green, push and watch CI.

### Beauty page redesign
**Why:** the public `/beauty` is a "Coming soon" placeholder, and the admin editor reuses the Travel schema as a stub. Real Beauty fields (brands, services, before/after, etc.) won't fit.
**How:**
1. Author `lib/schemas/beauty-page.ts` with beauty-specific fields.
2. Update the `beauty` row in D1 with the new shape (admin will rewrite via UI once the editor lands).
3. Either fork `PageEditor` into `BeautyEditor` or generalize it to accept a `schema + tabs` props.
4. Build the public `/beauty` server component with beauty-style sections.

### Settings page (admin)
**Why:** today, password rotation is a CLI ritual: `bun -e bcrypt` → `wrangler secret put`. A UI step that prints the hash for paste-into-CF would be friendlier.
**How:** an admin route `/admin/settings`, a "current password / new password" form, server-side bcrypt, copy-to-clipboard for the resulting hash. The actual `wrangler secret put` stays manual (no CLI proxy).

### ⚠️ Multi-region rate limiter
**Why:** [AUDIT 3.2](./AUDIT.md#3-security) — in-memory map is per-isolate; an attacker landing on a fresh isolate gets a fresh budget.
**How:** swap the in-memory store for a KV-backed sliding window (5 attempts / 15 min keyed on IP). Keep the in-memory path as a `bun run dev` fallback.

### ⚠️ CSP header (additional)
**Why:** baseline security headers are in middleware (HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options for admin). CSP intentionally deferred — Instagram embed (`*.cdninstagram.com`) needs end-to-end testing under a strict policy before rollout.
**How:** start with `default-src 'self'; img-src 'self' *.cdninstagram.com data:; frame-src www.instagram.com; frame-ancestors 'none';` in middleware. Test reels + photos under Report-Only first.

---

## Later (backlog)

### 💡 Restructure `app/`
**Why:** Travel lives at `app/travel/` (top-level), Beauty lives in the `(public)` group. Asymmetric. Cleanest moment to align is during the Beauty redesign.
**Risk:** layout collision (double header) — Travel has its own typography layout. Plan migration carefully.

### 💡 ISR via Cloudflare KV
**Why:** [AUDIT 4.1](./AUDIT.md#4-performance) — `/travel` is currently `force-dynamic`, so every request hits D1. KV-backed ISR would amortize reads.
**How:** wire a KV-based incremental cache via OpenNext's `incrementalCache` override in `open-next.config.ts`. Add `[[kv_namespaces]]` to `wrangler.toml`.

### ⚠️ Collapse `types/travel.ts` into Zod-derived types
**Why:** [AUDIT 6.1](./AUDIT.md#6-code-organization) — two parallel models drift silently. Tabs use the manual interfaces; the rest uses `TravelPageInput` from Zod.
**How:** export `TravelHotel`, `TravelProfile`, etc. from `lib/schemas/travel-page.ts` as `z.infer<...>`. Search-replace the imports in `components/admin/travel/tabs/*`. Delete `types/travel.ts`.

### 💡 OG image
**Why:** OpenGraph and Twitter meta are wired (commit `056d682`) but no `images` field — links unfurl without a hero. Needs a designed 1200×630 `og.jpg` in `public/`.

### 💡 Pre-commit hook
**Why:** [AUDIT 10.2](./AUDIT.md#10-dx--tooling) — local feedback before CI.
**How:** husky + lint-staged running `eslint --fix` + `tsc --noEmit` on staged files.

### 💡 CSRF tokens for save-page
**Why:** [AUDIT 3.4](./AUDIT.md#3-security) — currently relying on `sameSite: lax`. OWASP-acceptable but tighter is double-submit cookie or per-session token.

---

## Done ✅

### R2 media migration (photos + reels)
Travel photos and reels migrated from fragile Instagram CDN URLs / IG embed.js to a self-hosted Cloudflare R2 bucket (`nadiitsys-media`, served via `media.nadiitsys.com`). Admin gets drag-and-drop tabs (`MediaManager`); public Travel page renders native `<img>` / `<video>` from R2.

- `wrangler.toml`: bound `MEDIA` R2 bucket.
- `db/migrations/001_add_media_table.sql`: new `media` table (key, page_slug, kind, position, alt, mime, …).
- `lib/r2.ts`, `lib/repos/media.ts`: accessor + CRUD repo (`listMedia`, `uploadMedia`, `deleteMedia`, `reorderMedia`, `updateMediaMeta`).
- `app/api/admin/media/{,[...key],reorder}/route.ts`: list/upload/delete/patch/reorder endpoints with size + MIME validation (10 MB photos, 50 MB reels).
- `components/admin/MediaManager.tsx`: native HTML5 drag-drop, optimistic UI, no external libs.
- `components/admin/travel/tabs/PhotosTab.tsx` + `ReelsTab.tsx`: thin wrappers over `MediaManager`; PageEditor no longer keeps photos/reels in JSON state.
- `components/travel/Stills.tsx` + `Reels.tsx`: render directly from `MediaItem[]`. `ReelFrame.tsx` deleted (IG embed dead code).
- `db/migrations/002_strip_photos_reels_from_pages.sql`: cleans legacy keys from `pages.data` JSON. Schemas / types / seed updated to match.

### Quality pass (post-audit)
8 fixes from [`AUDIT.md`](./AUDIT.md) in 8 atomic commits — 1 high + 1 medium + 5 low + 1 SEO follow-up resolved, zero runtime regressions.

- `8e2eb02` `fix(security): require AUTH_SECRET, fail-fast if missing` — closes AUDIT 3.1 (high).
- `396f6b1` `fix(a11y): add hidden label to admin password input` — closes AUDIT 7.1 (medium).
- `7e37b19` `feat(security): set baseline HTTP security headers` — closes part of AUDIT 3.3 (CSP follow-up tracked under "Next").
- `056d682` `feat(seo): OpenGraph and Twitter meta on home and travel` — closes AUDIT 8.1, 8.2.
- `cc708a1` `fix(db): wrap JSON.parse with slug context for clearer corruption errors` — closes AUDIT 2.1.
- `6187d57` `fix(api): narrow save-page error payload, log details server-side` — closes AUDIT 2.2.
- `6c763d3` `feat(seo): robots.ts and sitemap.ts (production-domain-aware)` — closes AUDIT 8.3.
- `e9b9b99` `chore(dx): add db and secrets convenience scripts` — closes AUDIT 10.1.

### Migration & infra
- Octokit pipeline removed and replaced with Cloudflare D1 (12 commits, see `git log --grep=migration`).
- D1 schema, seed, repository layer (`lib/repos/pages.ts`).
- `PageEditor` generalized for Travel + Beauty admin (commit `6be291c`).
- GitHub Actions CI/CD with `wrangler types` step.
- Production deploy on Cloudflare Workers.
- Login redirect bug fix (`/videos` → `/travel`, commits `b5abd33` + follow-up). Earlier note was inaccurate — push was on `/`, causing double-bounce via `app/admin/page.tsx` to `/admin/travel`.
- Logout flow: 405 fix (`<a>` GET → `<button>` POST), redirect to `/login` + `router.refresh()`; cookie cleanup unchanged (already correct).
- Doc drift cleanup: README "Pages" → "Workers"; `app/admin/page.tsx` comment `proxy.ts` → `middleware.ts`.
- `worker-configuration.d.ts` untracked + regenerated in CI.
- Post-migration audit ([`AUDIT.md`](./AUDIT.md)) and roadmap (this file).
