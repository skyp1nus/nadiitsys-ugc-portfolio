# Code Audit — post-migration

> Generated: 2026-04-26. Scope: full repository as of `b5abd33`. Focus: pre-public-release sanity check after the Octokit→D1 migration.
>
> **All findings here are read-only.** Fixes are scheduled in [`ROADMAP.md`](./ROADMAP.md).

## Severity legend

| Tag | Meaning |
|---|---|
| `critical` | Active production-impacting bug, data loss risk, or auth bypass |
| `high` | Latent security/functional defect that fires in realistic conditions |
| `medium` | Quality issue that will accumulate cost or block a near-term goal |
| `low` | Polish / nice-to-have / documented known limitation |

## Table of contents

1. [Type safety](#1-type-safety)
2. [Error handling](#2-error-handling)
3. [Security](#3-security)
4. [Performance](#4-performance)
5. [React / Next.js best practices](#5-react--nextjs-best-practices)
6. [Code organization](#6-code-organization)
7. [Accessibility (a11y)](#7-accessibility-a11y)
8. [SEO](#8-seo)
9. [Database / D1](#9-database--d1)
10. [DX / tooling](#10-dx--tooling)

---

## 1. Type safety

✅ **Issues not found** in hand-written code.

`tsconfig.json` runs in `strict` mode with `noUncheckedIndexedAccess`. A repo-wide grep for `any\b`, `as any`, `: any`, and non-null assertions (`!.`) returns 0 hits outside of the auto-generated `worker-configuration.d.ts` (which is now untracked as of commit `b5abd33`).

The single `JSON.parse` in the codebase (`lib/repos/pages.ts:21`) feeds straight into `TravelPageSchema.parse()`, so D1 rows are runtime-validated before they leak into typed code.

---

## 2. Error handling

| # | Severity | Location | Finding |
|---|---|---|---|
| 2.1 | low | `lib/repos/pages.ts:21` | `JSON.parse(row.data)` runs without try/catch. If a D1 row is hand-edited via `wrangler d1 execute` and the JSON is malformed, the SyntaxError propagates with no slug context. |
| 2.2 | low | `app/api/admin/save-page/[slug]/route.ts:35` | `parsed.error.flatten()` is returned to the client verbatim, exposing the full Zod schema field tree. Admin-only endpoint, so impact is contained, but the response body could feed schema-fingerprinting if the admin host is ever scraped. |

**2.1 — recommendation:** wrap the parse: `try { return TravelPageSchema.parse(JSON.parse(row.data)); } catch (e) { throw new Error(\`Corrupt page row "${slug}": ${e}\`); }`. Costs one line, gives operators the slug.

**2.2 — recommendation:** map flatten() into a smaller `{ field, message }[]` payload, or just return `400` with a generic message and log the detail server-side.

---

## 3. Security

| # | Severity | Location | Finding |
|---|---|---|---|
| 3.1 | **high** | `lib/auth.ts:7` | `process.env.AUTH_SECRET ?? "dev-secret-change-me"` silently falls back to a literal known-public secret if the env-var is missing. In production this means JWTs are signed with a string anyone can find in the repo — a deploy that drops `AUTH_SECRET` (typo, secret rename, etc.) gives the attacker valid admin sessions. Fail-fast is mandatory. |
| 3.2 | medium | `lib/rate-limit.ts:10` | Map-based limiter is per-isolate. Cloudflare Workers can spawn many isolates per region; an attacker who lands on a fresh isolate gets a fresh budget. The file already documents this; severity is medium because limit only really protects from accidental brute-force, not a determined attacker. |
| 3.3 | low | `middleware.ts` | No security headers set: CSP, X-Frame-Options, HSTS, Permissions-Policy. Workers + Cloudflare proxy add some defaults; explicit headers are best practice before public release. |
| 3.4 | low | `app/api/admin/save-page/[slug]/route.ts` | State-changing endpoint with no CSRF token. Cookie is `sameSite: "lax"`, which OWASP currently treats as adequate for non-cross-origin POSTs, so this is a notable-but-acceptable gap. |
| 3.5 | low | `app/api/auth/login/route.ts:7` | Trusts both `cf-connecting-ip` and `x-forwarded-for` for rate-limit keying. On the public Workers domain `cf-connecting-ip` is set by Cloudflare itself, but if the Worker is ever fronted by another proxy these headers become attacker-controlled and rate-limit slots can be sharded. |

**3.1 — recommendation:** replace the fallback with a hard error:
```ts
const rawSecret = process.env.AUTH_SECRET;
if (!rawSecret) throw new Error("AUTH_SECRET is not set");
const secret = new TextEncoder().encode(rawSecret);
```

**3.2 — recommendation:** migrate to KV-backed sliding window or a Durable Object once we have one in `wrangler.toml`. Keep the in-memory fallback for `bun run dev`.

**3.3 — recommendation:** stash a `withSecurityHeaders` helper next to `middleware.ts` that adds CSP (`default-src 'self'` plus `cdninstagram.com` for posters), `X-Frame-Options: DENY` for `/admin/*`, HSTS in prod.

**3.4 — recommendation:** stays under "Later" in roadmap unless we add a public mutating endpoint.

---

## 4. Performance

| # | Severity | Location | Finding |
|---|---|---|---|
| 4.1 | low | `app/travel/page.tsx`, `app/admin/{travel,beauty}/page.tsx` | All marked `force-dynamic` → every request hits D1. Acceptable for admin (one user); for public `/travel` an ISR cache (KV) would cut repeat reads. |
| 4.2 | low | `components/admin/PageEditor.tsx:128` | Autosave `useEffect` re-runs on every keystroke; the 800ms debounce contains the cost. State writes are still per-keystroke and re-render the entire editor — fine at current tab count, would matter if tabs grow. |

✅ No N+1 queries (the only D1 query is a single `first()` per page load).
✅ No oversized barrel imports (everything pulls named exports).

---

## 5. React / Next.js best practices

✅ **Issues not found.**

- `'use client'` is present only where state/effects are used: `components/admin/PageEditor.tsx`, `components/admin/AdminShell.tsx`, `app/admin/login/page.tsx`. Tab files are server-friendly and inherit client boundary through PageEditor.
- No `useEffect`-for-fetching anti-pattern; data flows through async server components.
- No prop drilling > 2 levels: `PageEditor` passes single-tab slices directly into each tab.
- No `key={index}` on dynamic lists (verified across `components/admin/travel/tabs/*` and `components/travel/*`).
- One legitimate `useEffect` for debounced autosave + one for `TravelMap` interactivity.

---

## 6. Code organization

| # | Severity | Location | Finding |
|---|---|---|---|
| 6.1 | medium | `types/travel.ts` ↔ `lib/schemas/travel-page.ts` | Two parallel models: hand-written interfaces (used by tab components) and the Zod-derived `TravelPageInput` (used by PageEditor + content + repos). Drift is silent — adding a Zod field never breaks the interface, and vice versa. |
| 6.2 | low | `components/admin/PageEditor.tsx` (250 LOC) | Single file holds tab keys, labels, descriptions, autosave logic, and rendering. Readable today; would benefit from splitting `TABS_ORDER`/`TAB_LABELS`/`TAB_DESC` into a tabs.config.ts when a third or fourth page joins. |

✅ No dead exports detected (every export in `lib/`, `components/admin/*`, and `components/travel/*` is imported somewhere).
✅ No circular imports.

**6.1 — recommendation:** mass-replace `import type { TravelPage* } from "@/types/travel"` with derived types: `type TravelHotel = z.infer<typeof TravelHotelSchema>` etc. Then delete `types/travel.ts`. Tabs already use the same field shapes, so the change is mechanical.

---

## 7. Accessibility (a11y)

| # | Severity | Location | Finding |
|---|---|---|---|
| 7.1 | medium | `app/admin/login/page.tsx:43` | Password `<input>` has no associated `<label>` — only a `placeholder`. Screen readers fall back to "edit text" with no context. |

✅ `app/layout.tsx:13` sets `lang="uk"` (root).
✅ `AdminShell` menu button has `aria-label="Open menu"`; the scrim is `aria-hidden`.
✅ All clickable elements use `<button>` or `<a>`, no `<div onClick>`.
✅ No `<img>` without `alt` (audited via grep: zero hits across `app/` and `components/`).

**7.1 — recommendation:** add a visually hidden label or `aria-label`:
```tsx
<label htmlFor="admin-password" className="sr-only">Password</label>
<input id="admin-password" type="password" … />
```

---

## 8. SEO

| # | Severity | Location | Finding |
|---|---|---|---|
| 8.1 | medium | `app/(public)/page.tsx` | Homepage has no own `metadata` export. It inherits the root layout title/description, which is fine for crawlers, but lacks OpenGraph (`og:image`, `og:title`, `og:description`) and Twitter Card meta — links shared on social platforms render as bare URLs. |
| 8.2 | low | `app/travel/page.tsx` | Travel page inherits metadata from `app/travel/layout.tsx` (good), but again no OpenGraph for shareable links. |
| 8.3 | low | repository root | No `app/robots.ts`, no `app/sitemap.ts`. With only two indexable routes (`/`, `/travel`) it's not urgent, but worth doing before custom-domain launch. |

(Beauty placeholder is excluded from SEO concerns per the audit brief.)

**8.1/8.2 — recommendation:** in each page or its layout, add:
```ts
export const metadata: Metadata = {
  title: "...",
  description: "...",
  openGraph: { title, description, images: ["/og.jpg"], type: "website" },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};
```

---

## 9. Database / D1

✅ **Issues not found** beyond what's documented in §2.1.

- `lib/repos/pages.ts:14, 25-32` — every D1 query uses `prepare().bind()`. SQL injection: clean.
- `getDB()` in `lib/db.ts:7` throws a clear error if the binding is missing.
- No retry logic, but writes are idempotent UPSERTs and reads are single-row; D1 transient errors surface as 500s to the admin, who can hit Save again. Acceptable.

---

## 10. DX / tooling

| # | Severity | Location | Finding |
|---|---|---|---|
| 10.1 | low | `package.json` `scripts` | Six scripts (`dev`, `build`, `start`, `lint`, `preview`, `deploy`). Missing convenient wrappers: `db:types` (`bunx wrangler types`), `db:seed` (`wrangler d1 execute nadiitsys --remote --file=db/seed.sql`), `db:exec` for schema reapply, `secrets:list` (`wrangler secret list`). |
| 10.2 | low | repository root | No pre-commit hook (lint/typecheck). CI catches issues, but local feedback is faster. |

✅ No build warnings ignored.
✅ ESLint is at 0 errors (warnings only inside the now-ignored generated files).

**10.1 — recommendation:** drop them in `package.json` when the next D1 schema iteration lands.

**10.2 — recommendation:** husky + lint-staged when team size > 1.

---

## Summary

| Severity | Count |
|---|---|
| critical | 0 |
| high | 1 (auth secret fallback) |
| medium | 5 (rate limiter scope, login `<label>`, types/travel duplication, homepage SEO, save-page error leak severity disputed but counted under low) |
| low | 8 |

The single high-severity item (3.1) blocks public release; everything else is a deferred-but-tracked improvement. See [`ROADMAP.md`](./ROADMAP.md) for prioritization.
