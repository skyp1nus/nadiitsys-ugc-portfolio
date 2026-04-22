# PLAN.md — nadiitsys.com: трекер гочей

## 10 ключових гочей з архітектурного документа

Джерело: `Nadiitsys.com Architecture.md`, розділ «Ключові гочі, які легко прогавити».

| # | Гоча | Статус | Де враховано |
|---|------|--------|--------------|
| 1 | **Vercel Hobby забороняє комерційне використання** — UGC-портфоліо з брендовими колаборами = порушення ToS | ✅ враховано | Хостинг — Cloudflare Pages (комерційне використання дозволено без обмежень). `wrangler.toml`, `.github/workflows/deploy.yml` |
| 2 | **Supabase паузить проєкт після 7 днів неактивності** — при <1k відвідувачів реальний ризик падіння сайту | ✅ враховано | БД взагалі відсутня — контент зберігається в `content/videos.json` у репозиторії. Нуль ризику автопаузи |
| 3 | **GitHub Pages — один кастомний домен на репозиторій** — унеможливлює схему `nadiitsys.com` + `admin.nadiitsys.com` з одного репо | ✅ враховано | Cloudflare Pages підтримує 100 кастомних доменів на проєкт. Субдомен `admin` через middleware rewrite в одному деплої |
| 4 | **Mux Free — жорсткий ліміт 10 відео-активів** — 30 відео не влізуть | ✅ враховано | Mux не використовується. Відео — Instagram embed (blockquote, click-to-load). Постери — Cloudflare R2. `components/VideoCard.tsx` |
| 5 | **PlanetScale прибрав free tier 8 квітня 2024** — мінімум $39/міс | ✅ неактуально | PlanetScale не розглядався. SQL-БД взагалі не використовується — контент у `content/videos.json` |
| 6 | **Lucia Auth депрекована в березні 2025** — у нові проєкти не брати | ✅ враховано | Auth реалізована вручну: `jose` (JWT HS256) + `bcryptjs`. `lib/auth.ts`. Ніяких auth-фреймворків |
| 7 | **`output: 'export'` несумісний з middleware, API Routes, Server Actions** — ламає всю архітектуру | ✅ враховано | `output: 'export'` **явно відсутній** у `next.config.ts`. Адаптер `@opennextjs/cloudflare` обробляє гібридний білд (статика + Pages Functions). `next.config.ts`, `wrangler.toml` |
| 8 | **Next.js CVE-2025-29927** — middleware auth bypass (березень 2025) | ✅ враховано | Аутентифікація не покладається виключно на middleware — перевірка JWT відбувається також у `app/admin/layout.tsx` (Server Component) і `app/api/admin/save/route.ts` (`requireAdmin`). Дотримання принципу defense-in-depth |
| 9 | **Apex-домен на Cloudflare вимагає делегування nameservers на CF** — CNAME-only не підтримується на apex | ✅ враховано | Задокументовано в `README.md` (розділ «Deploy»): apex `nadiitsys.com` вимагає NS-делегування на CF; субдомен `admin.nadiitsys.com` — звичайний CNAME |
| 10 | **ImageKit free tier** — розбіжності між офіційними (20 ГБ) і сторонніми джерелами (3 ГБ) | ✅ неактуально | ImageKit не використовується. Постери — Cloudflare R2 (10 ГБ безкоштовно, 0$ egress — перевірено). `NEXT_PUBLIC_R2_PUBLIC_URL` env-var |

---

## Статус реалізації (оновлюється після кожного кроку)

| Крок | Опис | Статус |
|------|------|--------|
| 0 | Прочитав MD, створив PLAN.md | ✅ Готово |
| 1 | Init Next.js 16 + Tailwind v4 + залежності | ✅ `chore: bootstrap Next.js + Tailwind v4 + deps` |
| 2 | Структура директорій | ✅ `chore: scaffold directory tree and stub files` |
| 3 | Типи + videos.json + content loader | ✅ `feat(content): video types, seed JSON, bundled loader` |
| 4 | Proxy (host-based routing) | ✅ `feat(middleware): host-based admin routing` |
| 5 | Auth (jose + bcryptjs + rate-limit) | ✅ `feat(auth): JWT session, bcrypt, rate-limit, login/logout routes` |
| 6 | Admin UI (VideosEditor MVP) | ✅ `feat(admin): videos editor MVP` |
| 7 | Save API з Octokit + Zod | ✅ `feat(api): save route with Zod validation and Octokit commit` |
| 8 | Публічні сторінки + VideoCard click-to-load | ✅ `feat(public): beauty/travel pages, VideoCard click-to-load embed` |
| 9 | next.config + wrangler.toml + scripts | ✅ `chore(cf): next.config, wrangler.toml, updated .gitignore` |
| 10 | GitHub Actions CI/CD | ✅ `ci: deploy workflow with lint/typecheck gate` |
| 11 | .env.example + README | ✅ `docs: env.example with all required variables` |
| 12 | Санітарні перевірки | ✅ lint ✓ tsc ✓ build ✓ smoke: admin→login 307 ✓, public /admin 404 ✓, rate-limit 429 ✓ |

## Відкриті нюанси (знайдено під час реалізації)

- **Next.js 16 перейменував `middleware.ts` → `proxy.ts`** та `export function middleware` → `export function proxy`. Виправлено, білд чистий.
- **`@opennextjs/cloudflare` деплоїть як Worker**, а не Pages static. `wrangler deploy` (не `pages deploy`). `wrangler.toml` містить `main = ".open-next/worker.js"`.
- **`app/admin/page.tsx`** потрібна для того, щоб layout-guard спрацьовував при заходи на `admin.localhost/` (без неї Next.js повертав 404 до запуску layout).
