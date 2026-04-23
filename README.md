# nadiitsys.com — UGC Portfolio

Beauty & travel content creator portfolio built on a zero-cost stack.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 |
| Runtime (local/CI) | Bun |
| Hosting | Cloudflare Pages |
| CF adapter | `@opennextjs/cloudflare` |
| Content | `content/videos.json` in-repo |
| Auth | `jose` (JWT HS256) + `bcryptjs` |
| GitHub API | `@octokit/rest` |
| Media storage | Cloudflare R2 |

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

(In Cloudflare Pages dashboard the value goes in unescaped — only `.env.local` needs the backslashes.)

## Deploy

Deployment runs automatically via GitHub Actions on every push to `main`.

Manual deploy:
```bash
bun run deploy     # runs opennextjs-cloudflare build + wrangler deploy
```

## Required secrets

Set these in **Cloudflare Pages** dashboard (Settings → Environment variables) and in **GitHub repository** secrets:

| Secret | Where | Description |
|---|---|---|
| `AUTH_SECRET` | CF Pages + GitHub | 32+ byte random string for JWT signing |
| `ADMIN_PASSWORD_HASH` | CF Pages | bcryptjs hash of admin password |
| `GH_TOKEN` | CF Pages | Fine-grained PAT, `contents:write` on this repo only |
| `GH_OWNER` | CF Pages | GitHub repo owner username |
| `GH_REPO` | CF Pages | GitHub repo name |
| `NEXT_PUBLIC_R2_PUBLIC_URL` | CF Pages + GitHub | Public R2 base URL (e.g. `https://media.nadiitsys.com`) |
| `CLOUDFLARE_API_TOKEN` | GitHub | CF API token with Pages:Edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub | Your Cloudflare account ID |

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
