# nadiitsys.com — UGC Portfolio

Beauty & travel content creator portfolio built on a zero-cost stack.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 |
| Runtime (local/CI) | Bun |
| Hosting | Cloudflare Workers (edge SSR) |
| CF adapter | `@opennextjs/cloudflare` |
| Content store | Cloudflare D1 (`pages` table JSON-blob + `media` index table) |
| Media store | Cloudflare R2 bucket `nadiitsys-media`, served via `media.nadiitsys.com` |
| Auth | `jose` (JWT HS256) + `bcryptjs` |

## Local development

```bash
bun install
bun run dev        # http://localhost:3000  — public site
```

### Two-host setup (admin subdomain)

The admin panel is served at `admin.nadiitsys.com` in production, and at `admin.localhost:3000` locally via the middleware host-based rewrite.

Add one line to `/etc/hosts` (required on macOS Safari/Firefox and all Linux browsers — Chrome is the only browser that resolves `*.localhost` automatically):

```bash
sudo sh -c 'echo "127.0.0.1 admin.localhost" >> /etc/hosts'
```

Then open `http://admin.localhost:3000` to access the admin panel locally.

## Generating ADMIN_PASSWORD_HASH

Run once and paste the result into your environment variables:

```bash
bun -e "console.log(require('bcryptjs').hashSync('your_password', 12))"
```

**Important:** when storing the hash in `.env.local`, escape every `$` as `\$` —
Next.js performs variable expansion on `.env*` files and will silently mangle
unescaped bcrypt hashes. Example:

```
ADMIN_PASSWORD_HASH=\$2b\$12\$rNDjKq...rest_of_hash
```

(In the Cloudflare Workers dashboard the value goes in unescaped — only `.env.local` needs the backslashes.)

## Deploy

Deployment runs automatically via GitHub Actions on every push to `main`.

Manual deploy:
```bash
bun run deploy     # runs opennextjs-cloudflare build + wrangler deploy
```

## Required secrets

Set these in the **Cloudflare Workers** dashboard (Settings → Variables and Secrets) and in **GitHub repository** secrets:

| Secret | Where | Description |
|---|---|---|
| `AUTH_SECRET` | CF Workers + GitHub | 32+ byte random string for JWT signing |
| `ADMIN_PASSWORD_HASH` | CF Workers | bcryptjs hash of admin password |
| `CLOUDFLARE_API_TOKEN` | GitHub | CF API token with Workers Scripts:Edit + D1:Edit |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub | Your Cloudflare account ID |

The D1 binding (`DB`) and R2 binding (`MEDIA`) are wired up in `wrangler.toml`; no secret is needed for them.

## Media uploads

Travel photos and reels live in the Cloudflare R2 bucket `nadiitsys-media` and are served from `https://media.nadiitsys.com` (custom domain, immutable cache). The admin panel exposes drag-and-drop tabs for both kinds:

- `/admin/travel` → **Photos** tab — JPEG/PNG/WebP, up to 10 MB
- `/admin/travel` → **Reels** tab — MP4/MOV/WebM, up to 50 MB

Each upload produces a row in the `media` D1 table (`page_slug`, `kind`, `position`, `alt`, `mime`, …) and writes the file under a UUID key (`travel/photos/<uuid>.jpg`). The public Travel page (`app/travel/page.tsx`) fetches `listMedia('travel', 'photo' | 'reel')` server-side and renders native `<img>` / `<video>` elements.

Apply DB migrations with:

```bash
bunx wrangler d1 execute nadiitsys --local  --file=db/migrations/001_add_media_table.sql
bunx wrangler d1 execute nadiitsys --remote --file=db/migrations/001_add_media_table.sql
```

---

## License

This repository uses a **dual-license** model:

### Code — [PolyForm Noncommercial 1.0.0](./LICENSE)

All source code files (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`, configuration
files, build scripts, and similar technical files) are licensed under
**PolyForm Noncommercial 1.0.0**. You may use, modify, and redistribute
the code for any noncommercial purpose (personal study, hobby projects,
research, education). **Commercial use is not permitted.**

### Content — [CC BY-NC 4.0](./LICENSE-CONTENT.md)

All creative content — including but not limited to materials in
`content/`, `public/images/`, `public/videos/`, and `public/posters/`
(photographs, videos, video posters, written descriptions, illustrations)
— is © 2026 Nadiia Tsysaruk, licensed under
**Creative Commons Attribution-NonCommercial 4.0 International**.
You must credit the author and may not use the content commercially.

### Commercial licensing

For any commercial use of the code or content, please contact:
**[vy.skyp1nus@gmail.com]**
