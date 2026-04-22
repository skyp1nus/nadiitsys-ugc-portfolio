# Архітектура nadiitsys.com: безкоштовний стек для UGC-портфоліо

**Рекомендований стек: Cloudflare Pages + JSON-у-репозиторії + Instagram embed (blockquote) + Cloudflare R2 для постерів + кастомна JWT-автентифікація з `jose`.** Це єдиний повністю безкоштовний, комерційно-дозволений та довгостроково стабільний варіант для `nadiitsys.com` у 2026 році. Для ~30 відео та <1000 відвідувачів/місяць вся інфраструктура коштує **0 $** і не має жодних «пасток» типу автопаузи проєкту чи обмежень на бандвіз. Альтернативний шлях — Vercel Hobby + Supabase + on-demand ISR — простіший у налаштуванні, але Vercel Hobby формально забороняє комерційне використання, а Supabase ставить проєкт на паузу після 7 днів бездіяльності, що при твоєму трафіку — реальний ризик. Нижче — повне обґрунтування, гочі та конкретний код.

---

## Чому саме Cloudflare Pages, а не Vercel

Vercel — найзручніший варіант для Next.js і єдина платформа з **нативним Bun-рантаймом (Public Beta з 28 жовтня 2025)**, але його Hobby-тариф має дві жорсткі проблеми для `nadiitsys.com`. По-перше, Fair Use Guidelines прямо забороняють комерційне використання: «Hobby teams are restricted to non-commercial personal use only». UGC-портфоліо з рекламою платних брендових колаборацій — це саме те, що Vercel вважає комерційним. По-друге, ліміт **100 ГБ трафіку/місяць** — жорстка стіна, після якої сайт просто падає без опції овердрафту.

Cloudflare Pages / Workers натомість пропонує **необмежений трафік на безкоштовному тарифі** — унікальна пропозиція на ринку — **100 000 запитів до функцій на день**, **500 білдів на місяць** та **100 кастомних доменів на проєкт** (тобі потрібно лише 2: apex + `admin`). Комерційне використання дозволене без питань. Єдиний мінус: Bun тут лише як build-time інструмент (рантайм — Workers V8), але для статичного експорту Next.js це не має значення.

**GitHub Pages відразу відпадає** через критичну, але часто непомічену обмеженість: **один кастомний домен на репозиторій** (файл `CNAME`). Щоб обслуговувати `nadiitsys.com` + `admin.nadiitsys.com`, потрібно було б два окремих репозиторії — це ламає всю ідею моно-проєкту. Railway втратив free tier у серпні 2023, Fly.io — у жовтні 2024, Render має 15-хвилинний cold start. Netlify після 4 вересня 2025 перейшов на credit-based модель, яка дає ~300 кредитів/міс (≈20 деплоїв + 30 ГБ трафіку) — гірше за Cloudflare в усьому.

---

## Відео: Instagram embeds як основа, R2 як страховка

Для UGC-креатора, який і так активно публікується в Instagram, **статичний blockquote-embed** — це найдешевша, найпростіша і найавтентичніша опція. Ти копіюєш код із меню «Embed» на пості (`<blockquote class="instagram-media">` + `<script async src="//www.instagram.com/embed.js">`), і він працює **без жодної автентифікації, без Facebook App, без access token**. Працює як для Reels, так і для звичайних постів і фото. Старий oEmbed API Meta офіційно замінено на «oEmbed Read», який вимагає реєстрації Meta-додатку та апрувала — для 30 вручну підібраних посилань це абсолютний overkill.

Проблеми Instagram embeds чесно: якщо акаунт стане приватним або пост видалиться — embed покаже порожній блок; `embed.js` важить ~100 КБ і підтягує Facebook-піксели (шкодить LCP); **вміст iframe не індексується Google**. Тому рекомендую патерн **click-to-load**: показувати власну постер-картинку + кнопку play, а `embed.js` завантажувати тільки після кліку. Це також дає контроль над SEO — кожна картка отримує власний `<h2>`, опис, `VideoObject` JSON-LD, і сторінка нормально індексується.

Постери (та, за бажання, резервні MP4) зберігай у **Cloudflare R2**: **10 ГБ безкоштовного сховища, 1 млн Class A операцій/місяць, і найважливіше — нульова плата за egress**. Жодна інша платформа у світі такого не пропонує. 30 постерів × ~200 КБ + 30 резервних MP4 по ~15 МБ ≈ 500 МБ — у ліміт вміщуєшся в 20 разів.

### Що точно не брати

| Сервіс | Чому не підходить |
|---|---|
| **Mux Free** | Жорсткий ліміт **10 відео-активів** — твої 30 не влізуть |
| **Vercel Blob** | 1 ГБ сховища + ToS забороняє комерційне використання на Hobby |
| **Supabase Storage** | 1 ГБ + 5 ГБ egress + **проєкт засинає через 7 днів неактивності** |
| **GitHub LFS** | 1 ГБ bandwidth/міс + ToS прямо забороняє використання як CDN |
| **Cloudflare Stream** | Немає free tier, старт $5/міс |
| **Bunny Stream** | Дешево (~$1-2/міс), але не безкоштовно |

**YouTube unlisted** — життєздатна запасна опція (дійсно необмежено, адаптивний бітрейт, глобальний CDN), але брендинг YouTube + можливі кінцеві рекомендації не пасують професійному портфоліо. Cloudinary Free (25 кредитів/міс) теж вписується в сценарій, але ліміт **250 HD-секунд енкодингу/місяць** означає, що заливку 30 відео доведеться розтягнути на кілька місяців.

---

## Контент: JSON у репозиторії, а не база даних

Для 30 рядків метаданих, одного адміна та рідких оновлень **повноцінна БД — надлишок**. Файл `content/videos.json`, який адмінка комітить через Octokit, дає:

- **Нуль інфраструктури**, нуль vendor lock-in, нуль ризику автопаузи
- **Безкоштовну історію версій** через git (rollback, аудит — зі скриньки)
- **Найшвидше читання** у природі — статичний файл, вбудований у бандл, віддається з CDN
- Коміт → GitHub Actions ребілдить і деплоїть за 1-3 хв

Єдиний компроміс — **затримка 1-3 хв між збереженням і публікацією**, але для контенту, який оновлюється раз на тиждень, це непомітно. GitHub API має ліміт 5000 req/год автентифікованих запитів — ти ніколи його не торкнешся. Safe-concurrency не проблема, бо адмін один.

Якщо тобі критично **миттєве оновлення** і ти готовий на Vercel — бери **Turso (libSQL)**: **5 ГБ сховища, 500 млн читань/міс, 10 млн записів/міс, завжди активна (не засинає), нативна підтримка Bun** через `@libsql/client`. Це найкраща SQL-БД на ринку за free tier у 2026. **Neon Postgres** також хороший (0.5 ГБ, 100 CU-годин, має офіційний Bun-гайд, scale-to-zero з cold start ~300-500 мс), але для 30 рядків SQLite простіший.

**Чого не брати:** Supabase (7-денна пауза — **це реальний вбивця при <1k відвідувачів**), PlanetScale (free tier прибрали в квітні 2024, мінімум $39/міс), Vercel Postgres/KV (тепер просто обгортки над Neon/Upstash з гіршими лімітами — йди напряму до джерела), Cloudflare D1 (чудовий, але прив'язаний до Workers-рантайму).

---

## Архітектура: один проєкт, один деплой, middleware-роутинг

Не треба монорепозиторію з двома Next.js-додатками. **Одна Next.js-аплікація, один деплой, `middleware.ts` читає header `host` і переписує `admin.nadiitsys.com/*` → `/admin/*` внутрішньо.** Це економить build minutes, уніфікує типи/компоненти/auth, і при цьому Next.js автоматично code-split'ить по маршрутах — JS адмінки не потрапляє в бандл публічного сайту.

```ts
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const ROOT = 'nadiitsys.com';

export function middleware(req: NextRequest) {
  const host = (req.headers.get('host') || '').replace(/:\d+$/, '');
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith('/_next')) return NextResponse.next();

  const isAdmin = host === `admin.${ROOT}` || host === 'admin.localhost';

  if (isAdmin) {
    if (url.pathname.startsWith('/admin')) return NextResponse.next();
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Блокуємо прямий доступ до /admin через публічний домен
  if (url.pathname.startsWith('/admin')) {
    return new NextResponse('Not found', { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

Структура папок:
```
app/
  (public)/beauty/page.tsx
  (public)/travel/page.tsx
  admin/layout.tsx          # guard: перевіряє JWT
  admin/login/page.tsx
  admin/videos/page.tsx
  api/auth/login/route.ts
  api/admin/save/route.ts   # Octokit → commit JSON
content/
  videos.json
middleware.ts
```

**Гоча зі статичним експортом:** `output: 'export'` забороняє middleware, API Routes і Server Actions. Тому адмін-роути мають бути **динамічними** (deploy'яться як Pages Functions на Cloudflare), а публічні — статичними. `@opennextjs/cloudflare` (1.0.0-beta станом на квітень 2025; `@cloudflare/next-on-pages` застарів) робить це автоматично.

---

## Автентифікація: 30 рядків коду, нуль залежностей від вендорів

Для **одного користувача** NextAuth/Auth.js — це 5 МБ залежностей заради того, що робиться 30 рядками. Clerk (50k MAU безкоштовно станом на лютий 2026) — чудовий, але теж надмірний. **Lucia Auth офіційно депрекована в березні 2025** — у новий проєкт не брати. Better Auth — життєздатний спадкоємець, але для single-user теж overkill.

**Рекомендація:** `jose` + `bcryptjs` (не `bcrypt` — він native і ламається на edge runtime) + HttpOnly cookie. Пароль зберігається як bcrypt-хеш в env-змінній.

```ts
// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function verifyPassword(input: string) {
  return bcrypt.compare(input, process.env.ADMIN_PASSWORD_HASH!);
}

export async function signSession() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === 'admin';
  } catch { return false; }
}
```

Хеш генерується одноразово: `bun -e "console.log(require('bcryptjs').hashSync('твій_пароль', 12))"` → вставляєш у змінні оточення Cloudflare Pages. **Обов'язково додай rate-limit** на `/api/auth/login` (5 спроб / 15 хв по IP) — навіть для одного користувача, щоб унеможливити brute-force хешу.

---

## Admin save → rebuild: Octokit і repository_dispatch

Адмін натискає «Save», API-роут через Octokit комітить оновлений `videos.json` у main, GitHub Actions автоматично ребілдить і деплоїть.

```ts
// app/api/admin/save/route.ts
import { Octokit } from '@octokit/rest';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // перевірка JWT-сесії тут
  const body = await req.json();
  const gh = new Octokit({ auth: process.env.GH_TOKEN });

  const { data: existing } = await gh.repos.getContent({
    owner: 'nadiia', repo: 'nadiitsys', path: 'content/videos.json', ref: 'main',
  });
  const sha = 'sha' in existing ? existing.sha : undefined;

  await gh.repos.createOrUpdateFileContents({
    owner: 'nadiia', repo: 'nadiitsys', path: 'content/videos.json',
    message: `content: update (${new Date().toISOString()})`,
    content: Buffer.from(JSON.stringify(body, null, 2)).toString('base64'),
    sha, branch: 'main',
  });
  return NextResponse.json({ ok: true });
}
```

GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages
on:
  push: { branches: [main] }
  repository_dispatch: { types: [content-updated] }

jobs:
  deploy:
    runs-on: ubuntu-latest
    concurrency: { group: deploy, cancel-in-progress: true }
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy ./out --project-name=nadiitsys
```

GitHub Actions для публічних репозиторіїв — **необмежені хвилини**; для приватних дають 2000 хв/міс. 20 збережень × 2 хв білду = 40 хв, запас колосальний.

---

## ASCII-діаграма цільової архітектури

```
              ┌─────────────────────────────────────┐
              │         Cloudflare DNS              │
              │  nadiitsys.com       → CF Pages     │
              │  admin.nadiitsys.com → CF Pages     │
              └────────────────┬────────────────────┘
                               │
         ┌─────────────────────┴─────────────────────┐
         │     Cloudflare Pages (один проєкт)        │
         │  middleware.ts — host-based rewrite:      │
         │    admin.* → /admin/*                     │
         │    root    → (public)/*                   │
         └───┬──────────────────────────┬────────────┘
             │                          │
    ┌────────▼────────┐        ┌────────▼──────────┐
    │ ПУБЛІЧНИЙ САЙТ  │        │  АДМІНКА (JWT)    │
    │ /beauty /travel │        │  /admin/login     │
    │ читає bundled   │        │  /admin/videos    │
    │ videos.json     │        │  POST /api/save   │
    │ IG embed.js     │        └──────┬────────────┘
    │ постери з R2    │               │ Octokit
    └────────▲────────┘               ▼ commit
             │              ┌──────────────────┐
             │              │ GitHub repo main │
             │              │ content/videos.  │
             │              │ json             │
             │              └──────┬───────────┘
             │                     │ push trigger
             │                     ▼
             │              ┌──────────────────┐
             │              │ GitHub Actions   │
             │              │ bun build + CF   │
             │              │ wrangler deploy  │
             │              └──────┬───────────┘
             └─────────────────────┘  redeploy ~2 хв

    ┌─────────────────┐       ┌─────────────────┐
    │ Cloudflare R2   │       │ Instagram CDN   │
    │ постери, MP4    │       │ embed.js iframe │
    │ (0$ egress)     │       │                 │
    └─────────────────┘       └─────────────────┘
```

---

## Bun у 2026: де використовувати, а де ні

Консенсус станом на квітень 2026: **Bun як пакетний менеджер — безпечний виграш** (5-10× швидший за npm, працює ідеально); **Bun як рантайм Next.js у продакшні — обережно**. Vercel додав нативний Bun-рантайм у Public Beta 28 жовтня 2025 (`vercel.json` → `{ "bunVersion": "1.x" }`), але native addons типу `sharp`, `bcrypt`, `better-sqlite3` досі можуть ламатися. На Cloudflare Pages Bun — лише build-time (рантайм = workerd V8).

**Практична схема:** `bun install` + `bun run dev` локально, `bun run build` у GitHub Actions через `oven-sh/setup-bun@v2`, Node runtime у продакшні. Для хешування використовуй `bcryptjs` (pure JS, працює всюди), не `bcrypt`.

---

## Ключові гочі, які легко прогавити

1. **Vercel Hobby забороняє комерційне використання** — якщо nadiitsys.com рекламує платні колаборації, це порушення ToS. Cloudflare таких обмежень не має.
2. **Supabase паузить проєкт після 7 днів неактивності** — при <1k відвідувачів/міс це реальний ризик, який періодично покладе сайт.
3. **GitHub Pages — один кастомний домен на репозиторій**, що вбиває план з двома сабдоменами в одному проєкті.
4. **Mux Free — жорсткий ліміт 10 відео-активів**, твої 30 не влізуть.
5. **PlanetScale повністю прибрав free tier 8 квітня 2024**, тепер мінімум $39/міс.
6. **Lucia Auth офіційно депрекована в березні 2025** — у нові проєкти не брати.
7. **`output: 'export'` несумісний з middleware, API Routes, Server Actions** — на Cloudflare розв'язується через `@opennextjs/cloudflare`, який виносить динамічні роути в Pages Functions.
8. **Next.js CVE-2025-29927** (березень 2025, middleware auth bypass) — тримай Next.js оновленим, Cloudflare має керовану WAF-правило, увімкни його.
9. **Apex-домен на Cloudflare вимагає делегування nameservers на CF**, CNAME-only не підтримується на apex — сабдомен `admin` працює просто через CNAME.
10. **ImageKit free tier** — офіційна сторінка каже 20 ГБ, деякі сторонні джерела 3 ГБ. Перевіряй напряму при реєстрації.

---

## Резервні опції, якщо щось піде не так

Якщо Instagram зламає embeds (акаунт став приватним, API зміниться) — основна картка коректно деградує до постера з R2 + заголовка + опису з `videos.json`, і ти за 10 хв додаєш `<video>` тег з MP4-файлом, який уже лежить у R2. Якщо Cloudflare Pages раптом стане платним або заблокує акаунт — Vercel Hobby як міграційний шлях (з оглядкою на комерційний пункт) або платний Cloudflare Workers ($5/міс). Якщо JSON-in-repo стане занадто повільним (більше ніж ~100 редагувань/міс) — мігруй на Turso за півгодини, код зміниться на ~20 рядків `@libsql/client` викликів.

---

## Підсумок і ключові інсайти

Для задачі «UGC-портфоліо, 30 відео, <1k відвідувачів, один адмін, безкоштовно» правильна відповідь у 2026-му контрінтуїтивна: **не використовувати БД, не використовувати окрему media-платформу, не використовувати auth-SaaS**. JSON-файл у git'і + Instagram blockquote + Cloudflare R2 + 30 рядків JWT-коду + Cloudflare Pages дають стек, який **не коштує нічого, ніколи не падає через ліміти free tier, і залишається під твоїм повним контролем**.

Головна пастка, яку більшість робить — вибір Vercel «бо там Next.js зручно». Для комерційного домену це порушення ToS і 100 ГБ трафіку-стіна, тоді як Cloudflare дає необмежений трафік і відкрито дозволяє комерцію. Друга пастка — вибір Supabase «бо там є все». Для <1k відвідувачів 7-денна пауза активніше нашкодить, ніж допоможе. Третя — недооцінка сили «JSON у git» для рідко-оновлюваного контенту: ти отримуєш безкоштовну історію версій, rollback і atomic-оновлення, які у платних CMS коштують грошей.

Найважливіший практичний інсайт: **тримай шляхи відходу відкритими**. Кожен компонент стеку тут замінюваний за пів дня — JSON на Turso, R2 на Bunny, Cloudflare на Vercel, JWT на Clerk. Це і є справжня визначальна риса good-taste архітектури для маленького проєкту — не мінімум коду, а мінімум незворотних рішень.
