import type { MediaItem } from "@/lib/repos/media";
import { ReelCard } from "./ReelCard";
import { PhoneFrame } from "./PhoneFrame";
import styles from "@/app/travel/travel.module.css";

interface ReelsProps {
  reels: MediaItem[];
}

export function Reels({ reels }: ReelsProps) {
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

      {reels.length === 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            placeItems: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 320 }}>
            <PhoneFrame>
              <div
                className={styles.monoXs}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                No reels yet
              </div>
            </PhoneFrame>
          </div>
        </div>
      ) : (
        <div
          className={styles.grid4}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 28,
          }}
        >
          {reels.map((r) => (
            <ReelCard key={r.key} reel={r} />
          ))}
        </div>
      )}
    </section>
  );
}
