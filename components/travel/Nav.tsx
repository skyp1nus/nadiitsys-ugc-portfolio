"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { TravelDict } from "@/lib/i18n/dictionary-types";
import styles from "@/app/travel/travel.module.css";

interface NavProps {
  t: TravelDict["nav"];
  locale: Locale;
  switcherLabel: string;
}

export function Nav({ t, locale, switcherLabel }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const navClass = `${styles.nav} ${scrolled ? styles.navScrolled : ""}`.trim();

  return (
    <nav
      className={navClass}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(245,239,230,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--hair)",
      }}
    >
      <div
        className={styles.navInner}
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "18px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className={styles.navCompass}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid var(--ink)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="compass" size={16} stroke={1} />
          </div>
          <div className={styles.monoXs} style={{ color: "var(--ink)" }}>
            {t.mediaKit}
          </div>
        </div>

        <div className={`${styles.monoXs} ${styles.navLinks}`} style={{ display: "flex", gap: 40 }}>
          <a className={styles.navLink} href="#about">
            {t.about}
          </a>
          <a className={styles.navLink} href="#offer">
            {t.services}
          </a>
          <a className={styles.navLink} href="#work">
            {t.work}
          </a>
          <a className={styles.navLink} href="#map">
            {t.travels}
          </a>
          <a className={styles.navLink} href="#contact">
            {t.contact}
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LanguageSwitcher
            locale={locale}
            basePath="/travel"
            variant="travel"
            label={switcherLabel}
          />
          <a
            href="#contact"
            className={`${styles.monoXs} ${styles.navCta}`}
            style={{
              padding: "10px 18px",
              border: "1px solid var(--ink)",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            {t.cta} <Icon name="arrow" size={12} stroke={1.4} />
          </a>
        </div>
      </div>
    </nav>
  );
}
