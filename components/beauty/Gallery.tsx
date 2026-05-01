import styles from "@/app/beauty/beauty.module.css";
import type { BeautySimpleSectionHeader } from "@/lib/schemas/beauty-page";
import type { MediaItem } from "@/lib/repos/media";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";

const GRID_CLASSES = [
  styles.g1,
  styles.g2,
  styles.g3,
  styles.g4,
  styles.g5,
  styles.g6,
  styles.g7,
];

interface Props {
  header: BeautySimpleSectionHeader;
  photos: MediaItem[];
}

export function Gallery({ header, photos }: Props) {
  return (
    <section id="gallery" className={`${styles.gallery} ${styles.section}`}>
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

        <Reveal delay={1}>
          <div className={styles.galleryGrid}>
            {GRID_CLASSES.map((cls, i) => {
              const photo = photos[i];
              return (
                <div key={photo?.key ?? `gallery-${i}`} className={`${styles.galleryItem} ${cls}`}>
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.url} alt={photo.alt ?? `Photo ${i + 1}`} loading="lazy" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
