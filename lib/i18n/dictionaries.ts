import "server-only";

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";
import en from "@/lib/i18n/dictionaries/en.json";
import de from "@/lib/i18n/dictionaries/de.json";
import fr from "@/lib/i18n/dictionaries/fr.json";
import it from "@/lib/i18n/dictionaries/it.json";
import es from "@/lib/i18n/dictionaries/es.json";
import pl from "@/lib/i18n/dictionaries/pl.json";

import type { Dictionary } from "@/lib/i18n/dictionary-types";
export type { Dictionary };

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<unknown> ? T[K] : DeepPartial<T[K]>;
};

// Raw per-locale overlays. Any key a locale hasn't translated yet falls back
// to English via `mergeDict`, so partial/empty files render cleanly.
const OVERLAYS: Record<Locale, DeepPartial<Dictionary>> = {
  en: en,
  de: de as DeepPartial<Dictionary>,
  fr: fr as DeepPartial<Dictionary>,
  it: it as DeepPartial<Dictionary>,
  es: es as DeepPartial<Dictionary>,
  pl: pl as DeepPartial<Dictionary>,
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge an overlay over the English base. Arrays & primitives replace. */
function mergeDict<T>(base: T, overlay: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(overlay)) {
    return (overlay === undefined ? base : (overlay as T));
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base)) {
    out[key] = mergeDict((base as Record<string, unknown>)[key], overlay[key]);
  }
  return out as T;
}

const CACHE = new Map<Locale, Dictionary>();

/** Get the fully-resolved dictionary for a locale (English-filled fallback). */
export function getDictionary(locale: string | null | undefined): Dictionary {
  const loc: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const cached = CACHE.get(loc);
  if (cached) return cached;
  const merged = loc === DEFAULT_LOCALE ? en : mergeDict(en, OVERLAYS[loc]);
  CACHE.set(loc, merged);
  return merged;
}
