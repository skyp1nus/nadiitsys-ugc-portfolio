// DB-less local dev fixtures.
//
// When `MOCK_DATA=1` is set in a non-production build, the page loaders and the
// media repo return this in-memory sample content instead of touching D1 / R2 —
// so the site renders (real placeholder images + reels) with `next dev` and no
// Cloudflare bindings. Run it with `bun run dev:mock`.

import type { BeautyPageInput } from "@/lib/schemas/beauty-page";
import type { TravelPageInput } from "@/lib/schemas/travel-page";
import type { MediaItem, MediaKind, PageSlug, SingletonKind } from "@/lib/repos/media";
import { REEL_CATEGORIES } from "@/lib/categories";
import beautyPageJson from "@/lib/fixtures/beauty-page.json";
import travelPageJson from "@/lib/fixtures/travel-page.json";

/** True only when explicitly opted into DB-less dev (never in production). */
export function mockEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.MOCK_DATA === "1";
}

export const mockBeautyPage = beautyPageJson as unknown as BeautyPageInput;
export const mockTravelPage = travelPageJson as unknown as TravelPageInput;

// Public, CORS-friendly sample media so skeletons + reels actually load in dev.
const PHOTO = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;
const VIDEO_BASE =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const CLIPS = [
  "ForBiggerBlazes.mp4",
  "ForBiggerEscapes.mp4",
  "ForBiggerFun.mp4",
  "ForBiggerJoyrides.mp4",
  "ForBiggerMeltdowns.mp4",
  "BigBuckBunny.mp4",
  "ElephantsDream.mp4",
  "Sintel.mp4",
];
const clip = (i: number) => `${VIDEO_BASE}${CLIPS[i % CLIPS.length]}`;

type MediaSeed = Partial<MediaItem> &
  Pick<MediaItem, "pageSlug" | "kind" | "url">;

function item(seed: MediaSeed, i: number): MediaItem {
  return {
    key: seed.key ?? `mock-${seed.pageSlug}-${seed.kind}-${i}`,
    pageSlug: seed.pageSlug,
    kind: seed.kind,
    position: seed.position ?? i,
    alt: seed.alt ?? null,
    caption: seed.caption ?? null,
    width: seed.width ?? null,
    height: seed.height ?? null,
    sizeBytes: seed.sizeBytes ?? 0,
    mime: seed.mime ?? (seed.kind === "reel" || seed.kind === "about-video" ? "video/mp4" : "image/jpeg"),
    createdAt: seed.createdAt ?? 0,
    url: seed.url,
    location: seed.location ?? null,
    tags: seed.tags ?? null,
    views: seed.views ?? null,
    category: seed.category ?? null,
  };
}

const cat = (i: number) =>
  REEL_CATEGORIES[i % REEL_CATEGORIES.length]?.slug ?? "beauty";
const REEL_META = [
  { location: "Warsaw, PL", tags: "home, calm", views: "482K" },
  { location: "Milan, IT", tags: "fashion, edit", views: "1.2M" },
  { location: "Lisbon, PT", tags: "family, warm", views: "330K" },
  { location: "Vienna, AT", tags: "lifestyle", views: "210K" },
  { location: "Paris, FR", tags: "café, morning", views: "905K" },
  { location: "Kraków, PL", tags: "interior", views: "150K" },
  { location: "Barcelona, ES", tags: "wellness", views: "418K" },
  { location: "Prague, CZ", tags: "unboxing", views: "276K" },
];

function build(specs: MediaSeed[]): MediaItem[] {
  return specs.map((s, i) => item(s, i));
}

const MOCK_MEDIA: Record<PageSlug, Partial<Record<MediaKind, MediaItem[]>>> = {
  beauty: {
    hero: build([
      { pageSlug: "beauty", kind: "hero", url: PHOTO("beauty-hero", 900, 1100), width: 900, height: 1100, alt: "Portrait" },
    ]),
    "about-photo": build([
      { pageSlug: "beauty", kind: "about-photo", url: PHOTO("beauty-about-1", 800, 1000), width: 800, height: 1000, alt: "About 1" },
      { pageSlug: "beauty", kind: "about-photo", url: PHOTO("beauty-about-2", 800, 1000), width: 800, height: 1000, alt: "About 2" },
    ]),
    photo: build(
      Array.from({ length: 12 }, (_, i) => ({
        pageSlug: "beauty" as const,
        kind: "photo" as const,
        url: PHOTO(`beauty-photo-${i}`, 900, 900),
        width: 900,
        height: 900,
        alt: `Still ${i + 1}`,
      })),
    ),
    reel: build(
      Array.from({ length: 8 }, (_, i) => ({
        pageSlug: "beauty" as const,
        kind: "reel" as const,
        url: clip(i),
        alt: `Reel ${i + 1}`,
        category: cat(i),
        ...REEL_META[i % REEL_META.length],
      })),
    ),
  },
  travel: {
    hero: build([
      { pageSlug: "travel", kind: "hero", url: PHOTO("travel-hero", 1200, 1500), width: 1200, height: 1500, alt: "Hero" },
    ]),
    "about-video": build([
      { pageSlug: "travel", kind: "about-video", url: clip(5), alt: "About portrait" },
    ]),
    photo: build(
      Array.from({ length: 9 }, (_, i) => ({
        pageSlug: "travel" as const,
        kind: "photo" as const,
        url: PHOTO(`travel-photo-${i}`, 1000, 750),
        width: 1000,
        height: 750,
        alt: `Travel still ${i + 1}`,
      })),
    ),
    reel: build(
      Array.from({ length: 6 }, (_, i) => ({
        pageSlug: "travel" as const,
        kind: "reel" as const,
        url: clip(i),
        alt: `Travel reel ${i + 1}`,
        ...REEL_META[i % REEL_META.length],
      })),
    ),
  },
};

export function getMockMedia(pageSlug: PageSlug, kind: MediaKind): MediaItem[] {
  return MOCK_MEDIA[pageSlug][kind] ?? [];
}

export function getMockSingle(pageSlug: PageSlug, kind: SingletonKind): MediaItem | null {
  return MOCK_MEDIA[pageSlug][kind]?.[0] ?? null;
}
