"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "@/app/beauty/beauty.module.css";
import type { BeautySimpleSectionHeader } from "@/lib/schemas/beauty-page";
import type { MediaItem } from "@/lib/repos/media";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";

interface Props {
  header: BeautySimpleSectionHeader;
  reels: MediaItem[];
}

export function Videos({ header, reels }: Props) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [intersected, setIntersected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIntersected(true);
      return;
    }
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
      { threshold: 0.05, rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = reels.length > 0 ? reels : Array.from({ length: 8 }, () => null);

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

        <div
          ref={gridRef}
          className={`${styles.videoGrid}${intersected ? ` ${styles.videoGridIn}` : ""}`}
        >
          {items.map((reel, i) => {
            const style = { ["--reveal-delay" as never]: `${i * 90}ms` } as CSSProperties;
            const meta = reel?.location || `REEL · ${String(i + 1).padStart(2, "0")}`;
            const caption = reel?.caption || "";
            const link = caption.startsWith("http") ? caption : null;
            const Tag = link ? "a" : "div";
            const cardProps = link
              ? { href: link, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <Tag key={reel?.key ?? `placeholder-${i}`} className={styles.videoCard} style={style} {...cardProps}>
                {reel ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={reel.url.replace(/\.[^.]+$/, ".jpg")}
                    alt={reel.alt ?? `Reel ${i + 1}`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className={styles.videoPlaceholder}>
                    <span className={styles.mono}>REEL</span>
                  </div>
                )}
                <div className={styles.playOverlay}>
                  <span className={styles.playMeta}>{meta}</span>
                  <span className={styles.playBtn}>▶</span>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
