import styles from "@/app/travel/travel.module.css";

interface Brand {
  name: string;
  stars?: string;
  location: string;
}

interface CollabsProps {
  hotels: Brand[];
}

export function Collabs({ hotels }: CollabsProps) {
  const BRANDS = hotels;
  return (
    <section
      className={styles.sectionPad}
      style={{
        padding: "120px 48px",
        background: "var(--paper)",
        borderTop: "1px solid var(--hair)",
        borderBottom: "1px solid var(--hair)",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div
          className={styles.splitGrid}
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 64,
            marginBottom: 56,
          }}
        >
          <div>
            <div className={styles.monoXs} style={{ marginBottom: 8 }}>
              § 03
            </div>
            <div
              className={styles.serif}
              style={{ fontSize: 40, lineHeight: 1, fontStyle: "italic" }}
            >
              Trusted by
            </div>
          </div>
          <div
            style={{ maxWidth: 560, fontSize: 15, color: "var(--ink-2)", lineHeight: 1.6 }}
          >
            Hotels and properties I’ve created content for — with new collaborations always
            welcome.
          </div>
        </div>

        <div
          className={styles.grid3}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: "1px solid var(--ink)",
            borderLeft: "1px solid var(--line)",
          }}
        >
          {BRANDS.map((b, i) => (
            <div
              key={i}
              style={{
                borderRight: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
                padding: "48px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 180,
                justifyContent: "space-between",
              }}
            >
              <div className={styles.monoXs}>0{i + 1}</div>
              <div>
                <div
                  className={styles.serif}
                  style={{
                    fontSize: 24,
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    marginBottom: 8,
                  }}
                >
                  {b.name}
                </div>
                {b.stars && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--sand-d)",
                      letterSpacing: "0.2em",
                      marginBottom: 4,
                    }}
                  >
                    {b.stars}
                  </div>
                )}
                <div className={styles.monoXs} style={{ color: "var(--ink-2)" }}>
                  {b.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
