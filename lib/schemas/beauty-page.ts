import { z } from "zod";

export const PaletteKeySchema = z.enum(["blush", "petal", "mauve", "peach"]);

export const BeautyNavLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const BeautyNavSchema = z.object({
  logoName: z.string(),
  links: z.array(BeautyNavLinkSchema),
  cta: BeautyNavLinkSchema,
});

export const BeautyCtaSchema = z.object({
  label: z.string(),
  href: z.string(),
});

export const BeautyHeroSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleLine2: z.string(),
  subtitle: z.string(),
  metaBasedInLabel: z.string(),
  metaBasedInValue: z.string(),
  metaNicheLabel: z.string(),
  metaNicheValue: z.string(),
  metaLanguagesLabel: z.string(),
  metaLanguagesValue: z.string(),
  primaryCta: BeautyCtaSchema,
  ghostCta: BeautyCtaSchema,
  badgeText: z.string(),
  badgeIcon: z.string(),
  tagLabel: z.string(),
  tagOnline: z.boolean(),
});

export const BeautyMarqueeItemSchema = z.object({
  text: z.string(),
  italic: z.boolean(),
});

export const BeautyStatSchema = z.object({
  num: z.string(),
  accentSuffix: z.string(),
  label: z.string(),
});

export const BeautyAboutSchema = z.object({
  eyebrowNum: z.string(),
  eyebrowLabel: z.string(),
  title: z.string(),
  lead: z.string(),
  paragraphs: z.array(z.string()),
  categories: z.array(z.string()),
  stats: z.array(BeautyStatSchema),
});

export const BeautyBrandItemSchema = z.object({
  corner: z.string(),
  name: z.string(),
  category: z.string(),
  link: z.string(),
  isOpenSlot: z.boolean(),
});

export const BeautyBrandsSchema = z.object({
  eyebrowNum: z.string(),
  eyebrowLabel: z.string(),
  title: z.string(),
  intro: z.string(),
  items: z.array(BeautyBrandItemSchema),
});

export const ServiceVariantSchema = z.enum(["regular", "featured", "dashed"]);

export const BeautyServiceItemSchema = z.object({
  number: z.string(),
  tag: z.string(),
  name: z.string(),
  desc: z.string(),
  currency: z.string(),
  price: z.string(),
  variant: ServiceVariantSchema,
});

export const BeautyServicesSchema = z.object({
  eyebrowNum: z.string(),
  eyebrowLabel: z.string(),
  title: z.string(),
  intro: z.string(),
  items: z.array(BeautyServiceItemSchema),
  note: z.string(),
});

export const BeautySimpleSectionHeaderSchema = z.object({
  eyebrowNum: z.string(),
  eyebrowLabel: z.string(),
  title: z.string(),
});

export const BeautySocialSchema = z.object({
  platform: z.string(),
  handle: z.string(),
  url: z.string(),
});

export const BeautyContactSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  emailLabel: z.string(),
  email: z.string(),
  socials: z.array(BeautySocialSchema),
  metaBasedInLabel: z.string(),
  metaBasedInValue: z.string(),
  metaLanguagesLabel: z.string(),
  metaLanguagesValue: z.string(),
  metaReplyLabel: z.string(),
  metaReplyValue: z.string(),
});

export const BeautyFooterSchema = z.object({
  logo: z.string(),
  copyright: z.string(),
  tagline: z.string(),
});

export const BeautyPageSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string(),
  paletteKey: PaletteKeySchema,
  nav: BeautyNavSchema,
  hero: BeautyHeroSchema,
  marquee: z.array(BeautyMarqueeItemSchema),
  about: BeautyAboutSchema,
  brands: BeautyBrandsSchema,
  services: BeautyServicesSchema,
  videos: BeautySimpleSectionHeaderSchema,
  gallery: BeautySimpleSectionHeaderSchema,
  contact: BeautyContactSchema,
  footer: BeautyFooterSchema,
});

export type BeautyPageInput = z.infer<typeof BeautyPageSchema>;
export type BeautyHero = z.infer<typeof BeautyHeroSchema>;
export type BeautyAbout = z.infer<typeof BeautyAboutSchema>;
export type BeautyBrands = z.infer<typeof BeautyBrandsSchema>;
export type BeautyBrandItem = z.infer<typeof BeautyBrandItemSchema>;
export type BeautyServices = z.infer<typeof BeautyServicesSchema>;
export type BeautyServiceItem = z.infer<typeof BeautyServiceItemSchema>;
export type BeautyContact = z.infer<typeof BeautyContactSchema>;
export type BeautyFooter = z.infer<typeof BeautyFooterSchema>;
export type BeautyMarqueeItem = z.infer<typeof BeautyMarqueeItemSchema>;
export type BeautyStat = z.infer<typeof BeautyStatSchema>;
export type BeautySocial = z.infer<typeof BeautySocialSchema>;
export type BeautySimpleSectionHeader = z.infer<typeof BeautySimpleSectionHeaderSchema>;
export type BeautyNav = z.infer<typeof BeautyNavSchema>;
export type BeautyCta = z.infer<typeof BeautyCtaSchema>;
export type PaletteKey = z.infer<typeof PaletteKeySchema>;
export type ServiceVariant = z.infer<typeof ServiceVariantSchema>;
