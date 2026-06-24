import styles from "@/app/lifestyle/beauty.module.css";
import type { BeautySimpleSectionHeader } from "@/lib/schemas/beauty-page";
import type { MediaItem } from "@/lib/repos/media";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";
import { SkeletonImage } from "./SkeletonImage";

// Masonry rhythm: one cycle of 6 tiles fills two full 12-column rows with no
// gaps (6+3+3, then 4+4+4). The pattern repeats, so the grid grows gracefully
// with however many photos are uploaded — N tiles for N photos, no empty holes.
const GRID_PATTERN = [
  styles.gA,
  styles.gB,
  styles.gC,
  styles.gD,
  styles.gE,
  styles.gF,
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
            {photos.map((photo, i) => {
              const cls = GRID_PATTERN[i % GRID_PATTERN.length];
              return (
                <div key={photo.key ?? `gallery-${i}`} className={`${styles.galleryItem} ${cls}`}>
                  <SkeletonImage
                    src={photo.url}
                    alt={photo.alt ?? `Photo ${i + 1}`}
                    width={photo.width ?? undefined}
                    height={photo.height ?? undefined}
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
