import { getCloudflareContext } from "@opennextjs/cloudflare";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CloudflareEnv extends Cloudflare.Env {}
}

export async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) {
    throw new Error('D1 binding "DB" is not available. Check wrangler.toml.');
  }
  return env.DB;
}
