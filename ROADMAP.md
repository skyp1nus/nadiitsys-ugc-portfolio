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
6. Smoke test on both hostnames; verify `admin.nadiitsys.com/admin/travel` editor flow + public `nadiitsys.com/travel` render.

### 🚨 Strip `AUTH_SECRET` dev fallback
**Why:** [AUDIT 3.1](./AUDIT.md#3-security) — `lib/auth.ts:7` silently falls back to a known-public string if the env-var is missing. A misconfigured deploy hands attackers valid sessions.
**How:** replace the `??` fallback with a fail-fast check:
```ts
const rawSecret = process.env.AUTH_SECRET;
if (!rawSecret) throw new Error("AUTH_SECRET is not set");
const secret = new TextEncoder().encode(rawSecret);
```
Verify locally: a build without `AUTH_SECRET` should refuse to boot.

### ⚠️ Login form a11y
**Why:** [AUDIT 7.1](./AUDIT.md#7-accessibility-a11y) — password input has no `<label>`, only a placeholder. Screen readers fall back to "edit text".
**How:** add a `sr-only` label or `aria-label="Password"` on the input in `app/admin/login/page.tsx`.

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

### ⚠️ OpenGraph + Twitter meta
**Why:** [AUDIT 8.1, 8.2](./AUDIT.md#8-seo) — public links unfurl as bare URLs on Slack/Twitter/LinkedIn.
**How:** add `metadata.openGraph` and `metadata.twitter` exports on `app/(public)/page.tsx` and `app/travel/layout.tsx`. Provide a `/public/og.jpg` (1200×630) baseline.

### ⚠️ Security headers in middleware
**Why:** [AUDIT 3.3](./AUDIT.md#3-security) — no explicit CSP / X-Frame-Options / HSTS / Permissions-Policy. Cloudflare adds defaults; explicit headers are best practice before public launch.
**How:** in `middleware.ts`, attach a `headers` block to every `NextResponse.next()` and `NextResponse.rewrite()`. Start with `default-src 'self'; img-src 'self' *.cdninstagram.com data:; frame-ancestors 'none';` and tighten as needed.

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

### 💡 DX scripts
**Why:** [AUDIT 10.1](./AUDIT.md#10-dx--tooling).
**How:** add to `package.json`:
- `"db:types": "wrangler types"`
- `"db:exec": "wrangler d1 execute nadiitsys --remote --file=db/schema.sql"`
- `"db:seed": "wrangler d1 execute nadiitsys --remote --file=db/seed.sql"`
- `"secrets:list": "wrangler secret list"`

### 💡 robots.ts + sitemap.ts
**Why:** [AUDIT 8.3](./AUDIT.md#8-seo). Two routes today (`/`, `/travel`); not urgent, low cost.

### 💡 Pre-commit hook
**Why:** [AUDIT 10.2](./AUDIT.md#10-dx--tooling) — local feedback before CI.
**How:** husky + lint-staged running `eslint --fix` + `tsc --noEmit` on staged files.

### 💡 CSRF tokens for save-page
**Why:** [AUDIT 3.4](./AUDIT.md#3-security) — currently relying on `sameSite: lax`. OWASP-acceptable but tighter is double-submit cookie or per-session token.

### 💡 D1 row corruption guard
**Why:** [AUDIT 2.1](./AUDIT.md#2-error-handling) — `JSON.parse` in `lib/repos/pages.ts:21` lacks slug context on failure.
**How:** wrap the parse, rethrow with `\`Corrupt page row "${slug}": ${e}\``.

### 💡 Save-page error payload narrowing
**Why:** [AUDIT 2.2](./AUDIT.md#2-error-handling) — Zod `flatten()` returned to client.
**How:** map to `{ field, message }[]` or return a generic 400 + server log.

---

## Done ✅
- Octokit pipeline removed and replaced with Cloudflare D1 (12 commits, see `git log --grep=migration`).
- D1 schema, seed, repository layer (`lib/repos/pages.ts`).
- `PageEditor` generalized for Travel + Beauty admin (commit `6be291c`).
- GitHub Actions CI/CD with `wrangler types` step.
- Production deploy on Cloudflare Workers.
- Login redirect bug fix (`/videos` → `/`, commit `b5abd33`).
- Doc drift cleanup: README "Pages" → "Workers"; `app/admin/page.tsx` comment `proxy.ts` → `middleware.ts`.
- `worker-configuration.d.ts` untracked + regenerated in CI.
- Post-migration audit ([`AUDIT.md`](./AUDIT.md)) and roadmap (this file).
