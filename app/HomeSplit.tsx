"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary-types";

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
  cta: string;
  ariaLabel: string;
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
  cta,
  ariaLabel,
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
      aria-label={ariaLabel}
    >
      <div className={`${styles.content} ${intro ? styles.in : ""}`}>
        <span className={styles.kicker}>{kicker}</span>
        <div className={styles.headlineWrap}>
          <h2 className={styles.headline}>{headline}</h2>
          <em className={styles.italic}>{italic}</em>
        </div>
        <span className={styles.cta}>
          <span>{cta}</span>
          <span className={styles.ctaArrow} aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

interface HomeSplitProps {
  dict: Dictionary["home"];
  locale: Locale;
  switcherLabel: string;
}

export default function HomeSplit({ dict, locale, switcherLabel }: HomeSplitProps) {
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
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 40,
        }}
      >
        <LanguageSwitcher
          locale={locale}
          basePath="/"
          variant="home"
          label={switcherLabel}
        />
      </div>
      <div className={`${styles.brand} ${intro ? styles.in : ""}`}>
        <span className={styles.brandName}>Nadii Tsys</span>
        <span className={styles.brandSub}>{dict.brandSub}</span>
      </div>
      <div className={styles.split}>
        <SidePanel
          side="beauty"
          href={localizedPath("/lifestyle", locale)}
          hover={hover}
          intro={intro}
          onEnter={() => setHover("beauty")}
          onLeave={() => setHover(null)}
          kicker={dict.lifestyle.kicker}
          headline={dict.lifestyle.headline}
          italic={dict.lifestyle.italic}
          cta={dict.enter}
          ariaLabel={dict.lifestyle.enterAria}
        />
        <SidePanel
          side="travel"
          href={localizedPath("/travel", locale)}
          hover={hover}
          intro={intro}
          onEnter={() => setHover("travel")}
          onLeave={() => setHover(null)}
          kicker={dict.travel.kicker}
          headline={dict.travel.headline}
          italic={dict.travel.italic}
          cta={dict.enter}
          ariaLabel={dict.travel.enterAria}
        />
      </div>
    </div>
  );
}
