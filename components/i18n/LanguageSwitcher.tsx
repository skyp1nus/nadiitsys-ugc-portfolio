"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useRouter } from "next/navigation";
import {
  LOCALES,
  LOCALE_NAMES,
  LOCALE_COOKIE,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";

type Variant = "travel" | "beauty" | "home";

interface LanguageSwitcherProps {
  /** Active locale for the current request. */
  locale: Locale;
  /** Clean (en) path of the current page, e.g. "/travel", "/lifestyle", "/". */
  basePath: string;
  /** Visual theme of the host page. */
  variant?: Variant;
  /** Localized aria label, e.g. dict.switcher.label ("Language"). */
  label?: string;
}

interface Theme {
  trigger: CSSProperties;
  panel: CSSProperties;
  item: (active: boolean) => CSSProperties;
}

const THEMES: Record<Variant, Theme> = {
  travel: {
    trigger: {
      color: "var(--ink, #1a1714)",
      border: "1px solid var(--ink, #1a1714)",
      background: "transparent",
      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
    },
    panel: {
      background: "var(--paper, #faf7f1)",
      border: "1px solid var(--hair, rgba(0,0,0,0.12))",
      color: "var(--ink, #1a1714)",
      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
    },
    item: (active) => ({
      color: active ? "var(--ink, #1a1714)" : "var(--ink-2, #6b6258)",
      background: active ? "var(--cream, rgba(0,0,0,0.04))" : "transparent",
    }),
  },
  beauty: {
    trigger: {
      color: "currentColor",
      border: "1px solid currentColor",
      background: "transparent",
      fontFamily: "inherit",
    },
    panel: {
      background: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(0,0,0,0.08)",
      color: "#2a2024",
      fontFamily: "inherit",
      boxShadow: "0 12px 32px rgba(120,80,90,0.14)",
    },
    item: (active) => ({
      color: active ? "#2a2024" : "rgba(42,32,36,0.6)",
      background: active ? "rgba(0,0,0,0.04)" : "transparent",
    }),
  },
  home: {
    trigger: {
      color: "rgba(255,255,255,0.92)",
      border: "1px solid rgba(255,255,255,0.45)",
      background: "rgba(0,0,0,0.18)",
      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
    },
    panel: {
      background: "rgba(18,16,15,0.92)",
      border: "1px solid rgba(255,255,255,0.16)",
      color: "rgba(255,255,255,0.92)",
      fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    },
    item: (active) => ({
      color: active ? "#fff" : "rgba(255,255,255,0.6)",
      background: active ? "rgba(255,255,255,0.1)" : "transparent",
    }),
  },
};

function GlobeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

function setLocaleCookie(locale: Locale) {
  // 1 year; lax so it survives top-level navigations. Mirrors middleware.ts priority.
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageSwitcher({
  locale,
  basePath,
  variant = "travel",
  label = "Language",
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const router = useRouter();
  const menuId = useId();
  const theme = THEMES[variant];
  const activeIndex = Math.max(0, LOCALES.indexOf(locale));

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // Move focus into the menu (to the active option) when it opens.
  useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  const closeToTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const choose = (next: Locale) => {
    setOpen(false);
    setLocaleCookie(next);
    triggerRef.current?.focus();
    if (next === locale) return;
    // The route always changes (en clean ↔ prefixed), so push re-renders the
    // server tree with the new x-locale; no refresh() needed.
    router.push(localizedPath(basePath, next));
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const n = LOCALES.length;
    const cur = itemRefs.current.indexOf(
      document.activeElement as HTMLButtonElement
    );
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        itemRefs.current[(cur + 1 + n) % n]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        itemRefs.current[(cur - 1 + n) % n]?.focus();
        break;
      case "Home":
        e.preventDefault();
        itemRefs.current[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        itemRefs.current[n - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        closeToTrigger();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={rootRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${label}: ${LOCALE_NAMES[locale]}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "7px 12px",
          borderRadius: 999,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          lineHeight: 1,
          cursor: "pointer",
          whiteSpace: "nowrap",
          ...theme.trigger,
        }}
      >
        <GlobeIcon />
        <span>{locale}</span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 60,
            minWidth: 150,
            padding: 6,
            borderRadius: 12,
            fontSize: 13,
            ...theme.panel,
          }}
        >
          {LOCALES.map((l, i) => {
            const active = l === locale;
            return (
              <button
                key={l}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                aria-current={active ? "true" : undefined}
                lang={l}
                onClick={() => choose(l)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  font: "inherit",
                  ...theme.item(active),
                }}
              >
                <span>{LOCALE_NAMES[l]}</span>
                <span
                  aria-hidden
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    opacity: active ? 1 : 0.55,
                  }}
                >
                  {active ? "●" : l}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
