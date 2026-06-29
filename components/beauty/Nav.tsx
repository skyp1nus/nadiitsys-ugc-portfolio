"use client";

import { useEffect, useState } from "react";
import styles from "@/app/lifestyle/beauty.module.css";
import type { BeautyNav } from "@/lib/schemas/beauty-page";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";

interface NavProps {
  nav: BeautyNav;
  locale: Locale;
  switcherLabel: string;
}

export function Nav({ nav, locale, switcherLabel }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 40);
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
    <nav className={navClass}>
      <div className={styles.navLogo}>
        <span>{nav.logoName}</span>
        <span className={styles.navDot} />
      </div>
      <div className={styles.navLinks}>
        {nav.links.map((l) => (
          <a key={l.href + l.label} href={l.href} className={styles.navLink}>
            {l.label}
          </a>
        ))}
        <a href={nav.cta.href} className={styles.navCta}>
          {nav.cta.label}
        </a>
        <LanguageSwitcher
          locale={locale}
          basePath="/lifestyle"
          variant="beauty"
          label={switcherLabel}
        />
      </div>
    </nav>
  );
}
