"use client";

import { useEffect, useState } from "react";
import styles from "@/app/beauty/beauty.module.css";
import type { BeautyNav } from "@/lib/schemas/beauty-page";

export function Nav({ nav }: { nav: BeautyNav }) {
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
      </div>
    </nav>
  );
}
