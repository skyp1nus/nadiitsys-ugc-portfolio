import type { Video } from "@/types/video";
import type { PlaceholderTone } from "./Placeholder";
import { PhoneFrame } from "./PhoneFrame";
import { PhoneFramePlaceholder } from "./PhoneFramePlaceholder";
import styles from "@/app/travel/travel.module.css";

const SLOTS = 8;

const FALLBACKS: ReadonlyArray<{
  tone: PlaceholderTone;
  label: string;
  loc: string;
  views: string;
}> = [
  { tone: "sand", label: "amalfi · sunset", loc: "Positano, IT", views: "2.4M" },
  { tone: "warm", label: "aman · tokyo", loc: "Tokyo, JP", views: "1.1M" },
  { tone: "dark", label: "desert · sunrise", loc: "AlUla, SA", views: "890K" },
  { tone: "cool", label: "lounge · emirates", loc: "DXB, UAE", views: "1.7M" },
  { tone: "sand", label: "breakfast · santorini", loc: "Oia, GR", views: "620K" },
  { tone: "warm", label: "spa · como", loc: "Bellagio, IT", views: "340K" },
  { tone: "dark", label: "cabin · business class", loc: "LHR ↔ SIN", views: "2.9M" },
  { tone: "cool", label: "infinity pool · bali", loc: "Ubud, ID", views: "1.3M" },
];

interface ReelsProps {
  videos: Video[];
}

export function Reels({ videos }: ReelsProps) {
  const real = videos.slice(0, SLOTS);
  const placeholderCount = Math.max(0, SLOTS - real.length);
  const placeholders = FALLBACKS.slice(0, placeholderCount);

  return (
    <section
      id="work"
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
        <div>
          <div className={styles.monoXs} style={{ marginBottom: 8 }}>
            § 04
          </div>
          <div
            className={styles.serif}
            style={{ fontSize: 40, lineHeight: 1, fontStyle: "italic" }}
          >
            Reels
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ maxWidth: 560, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}
          >
            A selection of recent vertical video work. Each reel is scored, paced, and
            colour-graded in-house.
          </div>
          <div className={styles.monoXs} style={{ textAlign: "right" }}>
            Avg. reach · 480K
            <br />
            Avg. completion · 71%
          </div>
        </div>
      </div>

      <div
        className={styles.grid4}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 28,
        }}
      >
        {real.map((v, i) => (
          <PhoneFrame key={v.id} video={v} index={i} />
        ))}
        {placeholders.map((p, i) => (
          <PhoneFramePlaceholder
            key={`ph-${i}`}
            tone={p.tone}
            label={p.label}
            location={p.loc}
            views={p.views}
            index={real.length + i}
          />
        ))}
      </div>
    </section>
  );
}
