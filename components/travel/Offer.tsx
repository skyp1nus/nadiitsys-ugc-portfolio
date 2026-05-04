import { Icon, type IconName } from "./Icon";
import { Reveal } from "./Reveal";
import styles from "@/app/travel/travel.module.css";

interface Item {
  n: string;
  icon: IconName;
  title: string;
  desc: string;
}

const ITEMS: Item[] = [
  {
    n: "I",
    icon: "camera",
    title: "UGC Reels",
    desc: "Vertical short-form video, edited & optimised for Reels and TikTok. Hooks that travel.",
  },
  {
    n: "II",
    icon: "hotel",
    title: "Hotel Stories",
    desc: "Full-stay editorial coverage — arrival, room, amenities, breakfast, sunset. 24h delivery option.",
  },
  {
    n: "III",
    icon: "palm",
    title: "Destination Campaign",
    desc: "Multi-day shoots for tourism boards and destinations. Photo + video + stills + voiceover.",
  },
  {
    n: "IV",
    icon: "plane",
    title: "Airline & Lounge",
    desc: "In-cabin and ground UGC for airlines, lounges, airport retail. Discreet, premium, on-brand.",
  },
];

export function Offer() {
  return (
    <section
      id="offer"
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
            § 02
          </div>
          <div
            className={styles.serif}
            style={{ fontSize: 40, lineHeight: 1, fontStyle: "italic" }}
          >
            Services
          </div>
        </Reveal>
        <Reveal>
          <div style={{ maxWidth: 560, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}>
            Four ways we can work together. Every package is tailored — reach out via DM or email
            for details.
          </div>
        </Reveal>
      </div>

      <div
        className={`${styles.grid4} ${styles.staggerChildren}`}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: "1px solid var(--ink)",
          borderLeft: "1px solid var(--hair)",
        }}
      >
        {ITEMS.map((it, i) => (
          <Reveal key={i}>
            <div
              className={styles.cellHover}
              style={{
                borderRight: "1px solid var(--hair)",
                borderBottom: "1px solid var(--hair)",
                padding: "32px 28px 40px",
                minHeight: 300,
                display: "flex",
                flexDirection: "column",
                background: i % 2 ? "var(--paper)" : "transparent",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 32,
                  }}
                >
                  <div className={styles.monoXs}>{it.n}</div>
                  <span className={styles.iconRotate} style={{ display: "inline-flex" }}>
                    <Icon name={it.icon} size={22} stroke={1} />
                  </span>
                </div>
                <div
                  className={styles.serif}
                  style={{
                    fontSize: 26,
                    lineHeight: 1.15,
                    marginBottom: 14,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {it.title}
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55 }}>
                  {it.desc}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
