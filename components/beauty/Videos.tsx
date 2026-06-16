"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import styles from "@/app/beauty/beauty.module.css";
import type { BeautySimpleSectionHeader } from "@/lib/schemas/beauty-page";
import type { MediaItem } from "@/lib/repos/media";
import { REEL_CATEGORIES } from "@/lib/categories";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";
import { BeautyReelCard } from "./BeautyReelCard";

interface Props {
  header: BeautySimpleSectionHeader;
  reels: MediaItem[];
}

interface RegEntry {
  key: string;
  ratio: number;
}

export function Videos({ header, reels }: Props) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [intersected, setIntersected] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const [active, setActive] = useState<string>("all");
  const [soloKey, setSoloKey] = useState<string | null>(null);

  // ---- Reveal (entrance animation), unchanged behaviour ----
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
      { threshold: 0.05, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [intersected]);

  // ---- Autoplay-on-scroll: one shared observer + registry ----
  const registryRef = useRef(new Map<HTMLVideoElement, RegEntry>());
  const autoIoRef = useRef<IntersectionObserver | null>(null);
  const reducedMotionRef = useRef(false);
  const soloKeyRef = useRef<string | null>(null);

  const recompute = useCallback(() => {
    const entries = [...registryRef.current.entries()];
    const cap =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches
        ? 1
        : 2;
    const visible = entries
      .filter(([, v]) => v.ratio >= 0.5)
      .sort((a, b) => b[1].ratio - a[1].ratio);
    const playSet = new Set(visible.slice(0, cap).map(([el]) => el));
    // The soloed (user-tapped) reel always plays, regardless of cap.
    for (const [el, v] of entries) {
      if (v.key === soloKeyRef.current) playSet.add(el);
    }
    const reduce = reducedMotionRef.current;
    for (const [el, v] of entries) {
      const isSolo = v.key === soloKeyRef.current;
      const shouldPlay = playSet.has(el) && (!reduce || isSolo);
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
            <div className={styles.filterBar} role="tablist" aria-label="Reel categories">
              <button
                type="button"
                role="tab"
                aria-selected={active === "all"}
                className={`${styles.filterChip}${active === "all" ? ` ${styles.filterChipActive}` : ""}`}
                onClick={() => {
                  setActive("all");
                  setSoloKey(null);
                }}
              >
                All
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
                  }}
                >
                  {c.label}
                </button>
              ))}
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
