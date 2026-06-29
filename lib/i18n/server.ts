import "server-only";

import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

/** Current request locale, resolved from the `x-locale` header set by middleware.ts. */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const value = h.get("x-locale");
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Convenience: resolve both the locale and its (fallback-filled) dictionary. */
export async function getI18n(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}
