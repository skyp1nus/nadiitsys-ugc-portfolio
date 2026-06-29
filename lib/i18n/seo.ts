import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_HREFLANG,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";

interface Alternates {
  canonical: string;
  languages: Record<string, string>;
}

/**
 * Per-locale `canonical` + `hreflang` alternates for a page, given its clean
 * (en) base path. Relative urls resolve against `metadataBase` (root layout).
 *   buildAlternates("/travel", "de") → canonical "/de/travel" + all languages
 */
export function buildAlternates(basePath: string, locale: Locale): Alternates {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[LOCALE_HREFLANG[l]] = localizedPath(basePath, l);
  }
  languages["x-default"] = localizedPath(basePath, DEFAULT_LOCALE);
  return {
    canonical: localizedPath(basePath, locale),
    languages,
  };
}
