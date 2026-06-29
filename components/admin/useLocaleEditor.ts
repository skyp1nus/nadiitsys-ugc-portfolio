"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SaveState } from "@/components/admin/AdminShell";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

type Slug = "travel" | "beauty";

interface LocaleEditor<T> {
  locale: Locale;
  /** Whether a saved row exists for the current locale (false → en fallback shown). */
  exists: boolean;
  loading: boolean;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  switchLocale: (next: Locale) => void;
  saveAll: () => Promise<void>;
  saveState: SaveState;
  saveMessage: string | undefined;
  toast: string | null;
}

/**
 * Per-locale page editing. Owns the autosave loop and targets
 * `/api/admin/save-page/{slug}?locale=…`. Switching to an untranslated locale
 * seeds the editor with the English base ("save to create"): the first edit
 * autosaves and creates that locale's row.
 */
export function useLocaleEditor<T>(slug: Slug, initialEn: T): LocaleEditor<T> {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [exists, setExists] = useState(true); // the default (en) row always exists
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T>(initialEn);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);

  const enBaseRef = useRef<T>(initialEn);
  const localeRef = useRef<Locale>(locale);
  const dataRef = useRef<T>(data);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipAutosaveRef = useRef(true);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Keep the English base in sync with live edits so switching to an
  // untranslated locale (or back to en) never restores stale en content.
  useEffect(() => {
    if (locale === DEFAULT_LOCALE) enBaseRef.current = data;
  }, [data, locale]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const doSave = useCallback(
    async (payload: T, silent: boolean) => {
      const loc = localeRef.current;
      try {
        const res = await fetch(`/api/admin/save-page/${slug}?locale=${loc}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setSaveState("saved");
          setSaveMessage(undefined);
          setExists(true);
          if (!silent) showToast("Saved");
        } else {
          const text = await res.text();
          setSaveState("error");
          setSaveMessage(`Save failed (${res.status})`);
          if (!silent) showToast(`Error: ${text.slice(0, 80)}`);
        }
      } catch (err) {
        setSaveState("error");
        setSaveMessage(err instanceof Error ? err.message : "Network error");
      }
    },
    [showToast, slug]
  );

  // "Apply to all languages": write the current page to every locale row.
  const saveAll = useCallback(async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveState("saving");
    setSaveMessage(undefined);
    try {
      const res = await fetch(`/api/admin/save-page/${slug}?locale=all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataRef.current),
      });
      if (res.ok) {
        setSaveState("saved");
        setExists(true);
        showToast("Saved to all languages");
      } else {
        const text = await res.text();
        setSaveState("error");
        setSaveMessage(`Save failed (${res.status})`);
        showToast(`Error: ${text.slice(0, 80)}`);
      }
    } catch (err) {
      setSaveState("error");
      setSaveMessage(err instanceof Error ? err.message : "Network error");
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveState("dirty");
    setSaveMessage(undefined);
    debounceRef.current = setTimeout(() => {
      setSaveState("saving");
      void doSave(data, true);
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data, doSave]);

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === localeRef.current) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Always seed with a fresh clone so React never bails on an identical
      // reference (which would leave the skip-autosave flag unconsumed and
      // silently drop the first edit).
      const enClone = () => JSON.parse(JSON.stringify(enBaseRef.current)) as T;

      if (next === DEFAULT_LOCALE) {
        skipAutosaveRef.current = true;
        setData(enClone());
        setExists(true);
        setLocale(DEFAULT_LOCALE);
        setSaveState("idle");
        return;
      }

      setLoading(true);
      fetch(`/api/admin/load-page/${slug}?locale=${next}`)
        .then(async (r) => {
          if (!r.ok) throw new Error(`Load failed (${r.status})`);
          return (await r.json()) as { ok: boolean; exists?: boolean; data?: T | null; error?: string };
        })
        .then((json) => {
          if (!json.ok) throw new Error(json.error ?? "Load failed");
          skipAutosaveRef.current = true;
          if (json.exists && json.data) {
            setData(json.data);
            setExists(true);
          } else {
            // No translation yet → start from the English base.
            setData(enClone());
            setExists(false);
          }
          setLocale(next);
          setSaveState("idle");
        })
        .catch((err) => {
          // Stay on the current locale; never seed/clobber on a failed load.
          showToast(err instanceof Error ? err.message : "Load failed");
        })
        .finally(() => setLoading(false));
    },
    [showToast, slug]
  );

  return {
    locale,
    exists,
    loading,
    data,
    setData,
    switchLocale,
    saveAll,
    saveState,
    saveMessage,
    toast,
  };
}
