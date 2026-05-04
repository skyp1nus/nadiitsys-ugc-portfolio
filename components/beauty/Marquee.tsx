import styles from "@/app/beauty/beauty.module.css";
import type { BeautyMarqueeItem } from "@/lib/schemas/beauty-page";

export function Marquee({ items }: { items: BeautyMarqueeItem[] }) {
  if (items.length === 0) return null;
  // Doubled track for seamless loop (CSS translates -50%)
  const doubled = [...items, ...items];
  return (
    <div className={`${styles.section} ${styles.container}`}>
      <div className={`${styles.marquee} ${styles.marqueeWrap}`}>
        <div className={styles.marqueeTrack}>
          {doubled.map((it, i) => (
            <span
              key={i}
              className={`${styles.marqueeItem}${it.italic ? ` ${styles.italic}` : ""}`}
            >
              {it.text}
              <span className={styles.marqueeStar}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
