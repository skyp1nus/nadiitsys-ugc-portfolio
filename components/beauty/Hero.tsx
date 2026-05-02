import styles from "@/app/beauty/beauty.module.css";
import type { BeautyHero } from "@/lib/schemas/beauty-page";
import type { MediaItem } from "@/lib/repos/media";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";

interface Props {
  hero: BeautyHero;
  heroImage?: MediaItem | null;
}

export function Hero({ hero, heroImage }: Props) {
  const badgeText = (() => {
    const tokens = hero.badgeText.match(/[\p{L}\p{N}]+(?:[ &/-][\p{L}\p{N}]+)*/gu) ?? [];
    return tokens.length ? `${tokens.join(" · ")} · ` : "";
  })();
  return (
    <section className={styles.hero}>
      <div className={`${styles.section} ${styles.container}`} style={{ padding: 0 }}>
        <div className={styles.heroGrid}>
          <div>
            <Reveal>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroEyebrowLine} />
                <span className={styles.mono}>{hero.eyebrow}</span>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h1 className={styles.heroTitle}>
                {hero.titleLine1}
                <br />
                <AccentText text={hero.titleLine2} />
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className={styles.heroSub}>{hero.subtitle}</p>
            </Reveal>
            <Reveal delay={2}>
              <div className={styles.heroMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.mono}>{hero.metaBasedInLabel}</span>
                  <span className={styles.metaVal}>{hero.metaBasedInValue}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.mono}>{hero.metaNicheLabel}</span>
                  <span className={styles.metaVal}>{hero.metaNicheValue}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.mono}>{hero.metaLanguagesLabel}</span>
                  <span className={styles.metaVal}>{hero.metaLanguagesValue}</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={3}>
              <div className={styles.heroActions}>
                <a href={hero.primaryCta.href} className={`${styles.btn} ${styles.btnPrimary}`}>
                  {hero.primaryCta.label}
                  <span className={styles.btnArrow}>→</span>
                </a>
                <a href={hero.ghostCta.href} className={`${styles.btn} ${styles.btnGhost}`}>
                  {hero.ghostCta.label}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2} className={styles.heroVisual}>
            {hero.tagLabel ? (
              <div className={styles.heroTag}>
                {hero.tagOnline ? <span className={styles.heroTagDot} /> : null}
                <span>{hero.tagLabel}</span>
              </div>
            ) : null}
            <div className={styles.heroPortrait}>
              {heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroImage.url} alt={heroImage.alt ?? hero.titleLine1} />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "repeating-linear-gradient(135deg, var(--blush) 0 14px, var(--cream) 14px 28px)",
                  }}
                  aria-hidden
                />
              )}
            </div>
            <div className={styles.heroBadge} aria-hidden>
              <svg viewBox="0 0 200 200">
                <defs>
                  <path
                    id="beauty-badge-circle"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                  />
                </defs>
                <text
                  fontFamily="var(--font-mono), monospace"
                  fontSize="11"
                  fill="currentColor"
                >
                  <textPath
                    href="#beauty-badge-circle"
                    textLength="471"
                    lengthAdjust="spacing"
                    startOffset="0"
                  >
                    {badgeText}
                  </textPath>
                </text>
              </svg>
              <div className={styles.heroBadgeCenter}>{hero.badgeIcon}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
