import { Placeholder, type PlaceholderTone } from "./Placeholder";
import { Reveal } from "./Reveal";
import styles from "@/app/travel/travel.module.css";
import type { MediaItem } from "@/lib/repos/media";

interface Cell {
  col: string;
  row: string;
  tone: PlaceholderTone;
  label: string;
}

const CELLS: Cell[] = [
  { col: "span 2", row: "span 2", tone: "sand", label: "detail · robe & key" },
  { col: "span 1", row: "span 1", tone: "warm", label: "espresso" },
  { col: "span 1", row: "span 2", tone: "dark", label: "corridor" },
  { col: "span 1", row: "span 1", tone: "cool", label: "ceramics" },
  { col: "span 1", row: "span 1", tone: "sand", label: "sandals" },
  { col: "span 2", row: "span 1", tone: "warm", label: "balcony · morning" },
  { col: "span 1", row: "span 1", tone: "dark", label: "silver" },
  { col: "span 1", row: "span 1", tone: "cool", label: "pool · overhead" },
];

interface StillsProps {
  photos: MediaItem[];
}

export function Stills({ photos }: StillsProps) {
  return (
    <section
      className={styles.sectionPad}
      style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto" }}
    >
      <div
        className={styles.splitGrid}
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 64,
          marginBottom: 64,
        }}
      >
        <Reveal>
          <div className={styles.monoXs} style={{ marginBottom: 8 }}>
            § 05
          </div>
          <div
            className={styles.serif}
            style={{ fontSize: 40, lineHeight: 1, fontStyle: "italic" }}
          >
            Stills
          </div>
        </Reveal>
        <Reveal>
          <div
            style={{ maxWidth: 560, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}
          >
            Photography shot alongside video — for social grids, press, brochures and ad
            placements.
          </div>
        </Reveal>
      </div>

      <div
        className={`${styles.stillsGrid} ${styles.staggerChildren}`}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: 220,
          gap: 12,
        }}
      >
        {CELLS.map((c, i) => {
          const photo = photos[i];
          const wrapStyle = {
            gridColumn: c.col,
            gridRow: c.row,
          } as const;
          return (
            <Reveal key={photo?.key ?? `ph-${i}`} style={wrapStyle}>
              <div className={styles.stillsCell} style={{ width: "100%", height: "100%" }}>
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.url}
                    alt={photo.alt ?? c.label}
                    width={photo.width ?? undefined}
                    height={photo.height ?? undefined}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <Placeholder
                    label={c.label}
                    tone={c.tone}
                    ratio="auto"
                    style={{ height: "100%", aspectRatio: "unset" }}
                    patternId={`stills-${i}`}
                  />
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
