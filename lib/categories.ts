// Єдине джерело правди для reel-категорій.
// Імпортується і адмін-select-ом, і публічним фільтр-баром → значення не розходяться.
// У БД зберігається `slug` (стабільний); `label` можна переписувати без міграції даних.

export interface ReelCategory {
  slug: string;
  label: string;
}

export const REEL_CATEGORIES: ReelCategory[] = [
  { slug: "beauty", label: "Beauty" },
  { slug: "fashion", label: "Fashion & Accessories" },
  { slug: "family-kids", label: "Family & Kids" },
  { slug: "couple-lifestyle", label: "Couple / Lifestyle" },
  { slug: "food-drinks", label: "Food & Drinks" },
  { slug: "home-living", label: "Home & Living" },
  { slug: "fitness-wellness", label: "Fitness & Wellness" },
];

export const REEL_CATEGORY_SLUGS: string[] = REEL_CATEGORIES.map((c) => c.slug);

export function isReelCategory(v: unknown): v is string {
  return typeof v === "string" && REEL_CATEGORY_SLUGS.includes(v);
}

export function categoryLabel(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return REEL_CATEGORIES.find((c) => c.slug === slug)?.label ?? null;
}
