import styles from "@/app/travel/travel.module.css";

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

export function Marquee({ items }: { items: readonly string[] }) {
  const full = [...items, ...items, ...items];
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
