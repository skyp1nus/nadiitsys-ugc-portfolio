"use client";

import { LOCALES, LOCALE_NAMES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

interface LocaleBarProps {
  locale: Locale;
  exists: boolean;
  loading: boolean;
  onSwitch: (next: Locale) => void;
  onSaveAll: () => void;
}

export function LocaleBar({ locale, exists, loading, onSwitch, onSaveAll }: LocaleBarProps) {
  const handleSaveAll = () => {
    if (
      window.confirm(
        "Copy the current page content to ALL languages? This overwrites every language's content with what you see now."
      )
    ) {
      onSaveAll();
    }
  };
  const status =
    locale === DEFAULT_LOCALE
      ? "Editing English — the default version other locales fall back to."
      : exists
        ? `Editing ${LOCALE_NAMES[locale]}.`
        : `No ${LOCALE_NAMES[locale]} translation yet — showing English as a starting point. Your edits will create it.`;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        marginBottom: 18,
        border: "1px solid var(--line, #e6e1da)",
        borderRadius: 10,
        background: "var(--surface-2, #faf8f5)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-3, #8a8178)",
        }}
      >
        Language
      </span>
      <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
        {LOCALES.map((l) => {
          const active = l === locale;
          return (
            <button
              key={l}
              type="button"
              disabled={loading}
              onClick={() => onSwitch(l)}
              aria-pressed={active}
              title={LOCALE_NAMES[l]}
              style={{
                padding: "6px 11px",
                borderRadius: 7,
                fontSize: 12,
                cursor: loading ? "wait" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                border: active
                  ? "1px solid var(--ink, #1a1714)"
                  : "1px solid var(--line, #e6e1da)",
                background: active ? "var(--ink, #1a1714)" : "transparent",
                color: active ? "var(--surface, #fff)" : "var(--ink-2, #6b6258)",
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
      <span style={{ fontSize: 12.5, color: "var(--ink-2, #6b6258)" }}>
        {loading ? "Loading…" : status}
      </span>
      <button
        type="button"
        disabled={loading}
        onClick={handleSaveAll}
        title="Save the current content to every language at once"
        style={{
          marginLeft: "auto",
          padding: "7px 13px",
          borderRadius: 7,
          fontSize: 12,
          cursor: loading ? "wait" : "pointer",
          border: "1px solid var(--ink, #1a1714)",
          background: "var(--ink, #1a1714)",
          color: "var(--surface, #fff)",
          whiteSpace: "nowrap",
        }}
      >
        Save to all languages
      </button>
    </div>
  );
}
