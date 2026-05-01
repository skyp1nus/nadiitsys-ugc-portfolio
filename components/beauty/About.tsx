import styles from "@/app/beauty/beauty.module.css";
import type { BeautyAbout } from "@/lib/schemas/beauty-page";
import type { MediaItem } from "@/lib/repos/media";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";

interface Props {
  about: BeautyAbout;
  images: MediaItem[];
}

export function About({ about, images }: Props) {
  const [img1, img2] = images;
  return (
    <section id="about" className={`${styles.about} ${styles.section}`}>
      <div className={styles.container}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.label}>
                <span className={styles.labelNum}>{about.eyebrowNum}</span>
                <span className={styles.mono}>{about.eyebrowLabel}</span>
              </div>
              <h2 className={styles.sectionTitle}>
                <AccentText text={about.title} />
              </h2>
            </div>
          </div>
        </Reveal>

        <div className={styles.aboutGrid}>
          <Reveal>
            <div className={styles.aboutImages}>
              <div className={`${styles.aboutImg} ${styles.aboutImgFirst}`}>
                {img1 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img1.url} alt={img1.alt ?? "About 1"} />
                ) : null}
              </div>
              <div className={styles.aboutImg}>
                {img2 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img2.url} alt={img2.alt ?? "About 2"} />
                ) : null}
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className={styles.aboutText}>
              <p className={styles.aboutLead}>
                <AccentText text={about.lead} />
              </p>
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <div className={styles.categories}>
                {about.categories.map((c) => (
                  <span key={c} className={styles.catPill}>
                    {c}
                  </span>
                ))}
              </div>

              <div className={styles.statsRow}>
                {about.stats.map((s, i) => (
                  <div key={i}>
                    <div className={styles.statNum}>
                      {s.num}
                      {s.accentSuffix ? <span className={styles.accent}>{s.accentSuffix}</span> : null}
                    </div>
                    <div className={`${styles.statLabel} ${styles.mono}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
