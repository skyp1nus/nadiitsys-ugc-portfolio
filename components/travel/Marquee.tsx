import styles from "@/app/travel/travel.module.css";

const ITEMS = [
  "Hotels",
  "Resorts",
  "Airlines",
  "Restaurants",
  "Spa & Wellness",
  "Destinations",
  "Lifestyle",
  "Hospitality",
];

function Dot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--sand)",
      }}
    />
  );
}

export function Marquee() {
  const full = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div
      className={styles.marqueeWrap}
      style={{
        borderTop: "1px solid var(--hair)",
        borderBottom: "1px solid var(--hair)",
        padding: "22px 0",
        overflow: "hidden",
        background: "var(--paper)",
      }}
    >
      <div className={styles.marqueeTrack}>
        {full.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <div
              className={styles.serif}
              style={{ fontSize: 28, fontStyle: "italic", color: "var(--ink-2)" }}
            >
              {it}
            </div>
            <Dot />
          </div>
        ))}
      </div>
    </div>
  );
}
