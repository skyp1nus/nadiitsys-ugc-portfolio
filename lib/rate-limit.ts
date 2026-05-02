import { getCloudflareContext } from "@opennextjs/cloudflare";

const LIMIT = 5;
const WINDOW_SEC = 15 * 60;
const WINDOW_MS = WINDOW_SEC * 1000;

const memStore = new Map<string, number[]>();

declare const globalThis: typeof global & { __rl_cleanup?: ReturnType<typeof setInterval> };
if (!globalThis.__rl_cleanup) {
  globalThis.__rl_cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, times] of memStore) {
      const fresh = times.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) memStore.delete(key);
      else memStore.set(key, fresh);
    }
  }, 5 * 60 * 1000);
}

function memCheck(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const times = (memStore.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= LIMIT) return { allowed: false, remaining: 0 };
  times.push(now);
  memStore.set(ip, times);
  return { allowed: true, remaining: LIMIT - times.length };
}

async function kvCheck(
  kv: KVNamespace,
  ip: string,
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rl:${ip}`;
  const now = Date.now();
  const raw = await kv.get(key);
  const times = (raw ? (JSON.parse(raw) as number[]) : []).filter(
    (t) => now - t < WINDOW_MS,
  );
  if (times.length >= LIMIT) return { allowed: false, remaining: 0 };
  times.push(now);
  await kv.put(key, JSON.stringify(times), { expirationTtl: WINDOW_SEC });
  return { allowed: true, remaining: LIMIT - times.length };
}

export async function checkRateLimit(
  ip: string,
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as Env & { RATE_LIMIT?: KVNamespace }).RATE_LIMIT;
    if (kv) return await kvCheck(kv, ip);
  } catch {
    // CF context unavailable (eg dev without wrangler) — fall through
  }
  return memCheck(ip);
}
