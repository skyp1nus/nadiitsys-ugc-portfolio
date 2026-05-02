import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getR2(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.MEDIA) {
    throw new Error('R2 binding "MEDIA" is not available. Check wrangler.toml.');
  }
  return env.MEDIA;
}

const PUBLIC_BASE = process.env.NEXT_PUBLIC_MEDIA_URL ?? "https://media.nadiitsys.com";

export function publicUrl(key: string): string {
  return `${PUBLIC_BASE}/${key}`;
}
