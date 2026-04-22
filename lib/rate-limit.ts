// In-memory sliding window rate limiter.
// NOTE: for multi-region Cloudflare production, migrate to KV or Durable Objects
// since in-memory state doesn't survive between isolated Workers instances.

const LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const store = new Map<string, number[]>();

// Cleanup stale entries every 5 minutes.
// Guard against HMR creating multiple intervals in dev.
declare const globalThis: typeof global & { __rl_cleanup?: ReturnType<typeof setInterval> };
if (!globalThis.__rl_cleanup) {
  globalThis.__rl_cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, times] of store) {
      const fresh = times.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) store.delete(key);
      else store.set(key, fresh);
    }
  }, 5 * 60 * 1000);
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const times = (store.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  times.push(now);
  store.set(ip, times);
  return { allowed: true, remaining: LIMIT - times.length };
}
