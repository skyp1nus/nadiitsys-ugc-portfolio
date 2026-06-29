"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import styles from "@/app/lifestyle/beauty.module.css";
import type { BeautySimpleSectionHeader } from "@/lib/schemas/beauty-page";
import type { MediaItem } from "@/lib/repos/media";
import type { Dictionary } from "@/lib/i18n/dictionary-types";
import { REEL_CATEGORIES } from "@/lib/categories";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";
import { BeautyReelCard } from "./BeautyReelCard";

type ReelsDict = Dictionary["lifestyle"]["reels"];

interface Props {
  header: BeautySimpleSectionHeader;
  reels: MediaItem[];
  t: ReelsDict;
}

interface RegEntry {
  key: string;
  ratio: number;
}

const HINT_SEEN_KEY = "nd_reels_filter_hint_seen";

export function Videos({ header, reels, t }: Props) {
  // One-time affordance: hint that the category chips are tappable. Dismissed
  // on first interaction and remembered, so it never nags returning visitors.
  const [hintDone, setHintDone] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_SEEN_KEY)) {
        // Mount-time sync with localStorage (unavailable during SSR/render),
        // so the server and first client render agree on showing the hint.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHintDone(true);
      }
    } catch {
      /* ignore */
    }
  }, []);
  const dismissHint = useCallback(() => {
    setHintDone(true);
    try {
      localStorage.setItem(HINT_SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);
  const gridRef = useRef<HTMLDivElement | null>(null);
  // Always start false so server and client first render agree (no hydration
  // mismatch). Reduced-motion visibility is guaranteed by CSS (.videoCard gets
  // opacity:1 !important under the reduced-motion query), not by this flag.
  const [intersected, setIntersected] = useState(false);

  const [active, setActive] = useState<string>("all");
  const [soloKey, setSoloKey] = useState<string | null>(null);

  // ---- Reveal (entrance animation) ----
  // threshold 0 + a timeout fallback: on mobile the single-column grid is taller
  // than the viewport, so a fractional threshold (0.05) could never be reached and
  // the cards stayed at opacity 0 until a filter change shrank the grid. Fire on
  // any intersection, and reveal regardless after 1.5s so reels are never hidden.
  useEffect(() => {
    if (intersected) return;
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setIntersected(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setIntersected(true), 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [intersected]);

  // ---- Autoplay-on-scroll: one shared observer + registry ----
  const registryRef = useRef(new Map<HTMLVideoElement, RegEntry>());
  const autoIoRef = useRef<IntersectionObserver | null>(null);
  const reducedMotionRef = useRef(false);
  const soloKeyRef = useRef<string | null>(null);

  const recompute = useCallback(() => {
    const entries = [...registryRef.current.entries()];
    const reduce = reducedMotionRef.current;
    // Play every sufficiently-visible reel (a full row autoplays at once),
    // plus the soloed (user-tapped) one. Muted unless soloed.
    for (const [el, v] of entries) {
      const isSolo = v.key === soloKeyRef.current;
      const shouldPlay = (v.ratio >= 0.5 || isSolo) && (!reduce || isSolo);
      el.muted = !isSolo;
      if (shouldPlay) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    }
  }, []);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const rec = registryRef.current.get(e.target as HTMLVideoElement);
          if (rec) rec.ratio = e.isIntersecting ? e.intersectionRatio : 0;
        }
        recompute();
      },
      { threshold: [0, 0.5, 0.75, 1], rootMargin: "0px 0px -10% 0px" },
    );
    autoIoRef.current = io;
    return () => io.disconnect();
  }, [recompute]);

  // Sound state mirrored into a ref (read inside the IO callback) + re-apply.
  useEffect(() => {
    soloKeyRef.current = soloKey;
    recompute();
  }, [soloKey, recompute]);

  const register = useCallback(
    (el: HTMLVideoElement, key: string) => {
      registryRef.current.set(el, { key, ratio: 0 });
      autoIoRef.current?.observe(el);
    },
    [],
  );

  const unregister = useCallback(
    (el: HTMLVideoElement) => {
      autoIoRef.current?.unobserve(el);
      registryRef.current.delete(el);
      try {
        el.pause();
      } catch {
        /* ignore */
      }
      recompute();
    },
    [recompute],
  );

  const onToggleSound = useCallback((key: string) => {
    setSoloKey((prev) => (prev === key ? null : key));
  }, []);

  // ---- Categories present + filtered list ----
  const present = useMemo(
    () => new Set(reels.map((r) => r.category).filter(Boolean) as string[]),
    [reels],
  );
  const visibleCats = useMemo(
    () => REEL_CATEGORIES.filter((c) => present.has(c.slug)),
    [present],
  );
  const filtered = useMemo(
    () => (active === "all" ? reels : reels.filter((r) => r.category === active)),
    [reels, active],
  );

  // Re-sync the autoplay observer after filtering changes the mounted card set.
  // (Solo is cleared in the chip handlers, so no setState needed here.)
  useEffect(() => {
    const io = autoIoRef.current;
    if (!io) return;
    io.disconnect();
    for (const el of registryRef.current.keys()) io.observe(el);
    recompute();
  }, [filtered, recompute]);

  const hasReels = reels.length > 0;
  const placeholders = Array.from({ length: 8 }, (_, i) => i);

  return (
    <section id="videos" className={styles.videos}>
      <div className={styles.container}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.label}>
                <span className={styles.labelNum}>{header.eyebrowNum}</span>
                <span className={styles.mono}>{header.eyebrowLabel}</span>
              </div>
              <h2 className={styles.sectionTitle}>
                <AccentText text={header.title} />
              </h2>
            </div>
          </div>
        </Reveal>

        {visibleCats.length > 0 && (
          <Reveal delay={1}>
            <div
              className={`${styles.filterBar}${hintDone ? "" : ` ${styles.filterBarHinting}`}`}
              role="tablist"
              aria-label={t.categoriesAria}
            >
              <button
                type="button"
                role="tab"
                aria-selected={active === "all"}
                className={`${styles.filterChip}${active === "all" ? ` ${styles.filterChipActive}` : ""}`}
                onClick={() => {
                  setActive("all");
                  setSoloKey(null);
                  dismissHint();
                }}
              >
                {t.all}
              </button>
              {visibleCats.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  role="tab"
                  aria-selected={active === c.slug}
                  className={`${styles.filterChip}${active === c.slug ? ` ${styles.filterChipActive}` : ""}`}
                  onClick={() => {
                    setActive(c.slug);
                    setSoloKey(null);
                    dismissHint();
                  }}
                >
                  {t.categories[c.slug as keyof ReelsDict["categories"]] ?? c.label}
                </button>
              ))}

              {!hintDone && (
                <span className={styles.filterHint} aria-hidden="true">
                  <span className={styles.filterHintDot} />
                  {t.filterHint}
                  <span className={styles.filterHintSwipe}>
                    <svg
                      width="15"
                      height="9"
                      viewBox="0 0 15 9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 4.5h12M9 1l4 3.5L9 8" />
                    </svg>
                  </span>
                </span>
              )}
            </div>
          </Reveal>
        )}

        <div
          ref={gridRef}
          className={`${styles.videoGrid}${intersected ? ` ${styles.videoGridIn}` : ""}`}
        >
          {hasReels
            ? filtered.map((reel, i) => {
                const style = {
                  ["--reveal-delay" as never]: `${i * 90}ms`,
                } as CSSProperties;
                return (
                  <BeautyReelCard
                    key={reel.key}
                    reel={reel}
                    index={i}
                    soloed={soloKey === reel.key}
                    register={register}
                    unregister={unregister}
                    onToggleSound={onToggleSound}
                    className={styles.videoCard}
                    style={style}
                  />
                );
              })
            : placeholders.map((i) => {
                const style = {
                  ["--reveal-delay" as never]: `${i * 90}ms`,
                } as CSSProperties;
                return (
                  <div key={`placeholder-${i}`} className={styles.videoCard} style={style}>
                    <div className={styles.videoPlaceholder}>
                      <span className={styles.mono}>REEL</span>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
