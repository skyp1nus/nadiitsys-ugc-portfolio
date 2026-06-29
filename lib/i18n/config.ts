// ============================================================
// i18n — locale config (single source of truth).
//
// European-market geo-localization with a "hidden default locale":
//   • `en` is the default and is served on CLEAN urls (/travel, /lifestyle, /)
//   • all other locales are prefixed (/de/travel, /fr, …)
// Routing/redirect logic lives in `middleware.ts`; this file only holds the data.
// ============================================================

export const LOCALES = ["en", "de", "fr", "it", "es", "pl"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Locales that carry a url prefix (everything except the hidden default). */
export const PREFIXED_LOCALES = LOCALES.filter(
  (l): l is Exclude<Locale, typeof DEFAULT_LOCALE> => l !== DEFAULT_LOCALE
);

/** Cookie that stores an explicit user choice — takes priority over geo. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Native language names shown in the switcher dropdown. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  es: "Español",
  pl: "Polski",
};

/** BCP-47 tags for <html lang> / hreflang / openGraph locale. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  de: "de",
  fr: "fr",
  it: "it",
  es: "es",
  pl: "pl",
};

export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  es: "es_ES",
  pl: "pl_PL",
};

// Country (ISO-3166 alpha-2, from Cloudflare `cf-ipcountry`) → locale.
// Countries outside this map (incl. non-Europe) fall back to `en`.
export const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  FR: "fr",
  BE: "fr",
  LU: "fr",
  MC: "fr",
  IT: "it",
  SM: "it",
  VA: "it",
  ES: "es",
  AD: "es",
  PL: "pl",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Map a Cloudflare country code to a locale (defaults to `en`). */
export function localeFromCountry(country: string | null | undefined): Locale {
  if (!country) return DEFAULT_LOCALE;
  return COUNTRY_TO_LOCALE[country.toUpperCase()] ?? DEFAULT_LOCALE;
}

/**
 * Build a localized href from a clean (en) path.
 *   localizedPath("/travel", "de") → "/de/travel"
 *   localizedPath("/travel", "en") → "/travel"
 *   localizedPath("/", "de")       → "/de"
 */
export function localizedPath(cleanPath: string, locale: Locale): string {
  const path = cleanPath === "" ? "/" : cleanPath;
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
