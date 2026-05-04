"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

const HOVER_RATIO = 62;

type Side = "beauty" | "travel";

type SidePanelProps = {
  side: Side;
  href: string;
  hover: Side | null;
  intro: boolean;
  onEnter: () => void;
  onLeave: () => void;
  kicker: string;
  headline: string;
  italic: string;
};

function SidePanel({
  side,
  href,
  hover,
  intro,
  onEnter,
  onLeave,
  kicker,
  headline,
  italic,
}: SidePanelProps) {
  const isHovered = hover === side;
  const otherHovered = hover !== null && hover !== side;
  const flexBasis = isHovered
    ? `${HOVER_RATIO}%`
    : otherHovered
      ? `${100 - HOVER_RATIO}%`
      : "50%";
  const sideClass = side === "beauty" ? styles.sideBeauty : styles.sideTravel;
  return (
    <Link
      href={href}
      className={`${styles.side} ${sideClass} ${isHovered ? styles.isHovered : ""}`}
      style={{ flexBasis }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      aria-label={`Enter ${side}`}
    >
      <div className={`${styles.content} ${intro ? styles.in : ""}`}>
        <span className={styles.kicker}>{kicker}</span>
        <div className={styles.headlineWrap}>
          <h2 className={styles.headline}>{headline}</h2>
          <em className={styles.italic}>{italic}</em>
        </div>
        <span className={styles.cta}>
          <span>Enter</span>
          <span className={styles.ctaArrow} aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function HomeSplit() {
  const [hover, setHover] = useState<Side | null>(null);
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const trigger = () => {
      timer = setTimeout(() => setIntro(true), 80);
    };
    if (document.visibilityState === "visible") {
      trigger();
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
    const onVis = () => {
      if (document.visibilityState === "visible") {
        document.removeEventListener("visibilitychange", onVis);
        trigger();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.stage}>
      <div className={`${styles.brand} ${intro ? styles.in : ""}`}>
        <span className={styles.brandName}>Nadii Tsys</span>
        <span className={styles.brandSub}>UGC · Warsaw</span>
      </div>
      <div className={styles.split}>
        <SidePanel
          side="beauty"
          href="/beauty"
          hover={hover}
          intro={intro}
          onEnter={() => setHover("beauty")}
          onLeave={() => setHover(null)}
          kicker="N° 01 — BEAUTY"
          headline="Beauty,"
          italic="softly told."
        />
        <SidePanel
          side="travel"
          href="/travel"
          hover={hover}
          intro={intro}
          onEnter={() => setHover("travel")}
          onLeave={() => setHover(null)}
          kicker="N° 02 — TRAVEL"
          headline="Slow"
          italic="travel, in frames."
        />
      </div>
    </div>
  );
}
