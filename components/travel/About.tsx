import { Placeholder } from "./Placeholder";
import styles from "@/app/travel/travel.module.css";

export function About() {
  return (
    <section
      id="about"
      className={styles.sectionPad}
      style={{ padding: "120px 48px", maxWidth: 1440, margin: "0 auto" }}
    >
      <div
        className={styles.splitGrid}
        style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 64 }}
      >
        <div>
          <div className={styles.monoXs} style={{ marginBottom: 8 }}>
            § 01
          </div>
          <div
            className={styles.serif}
            style={{ fontSize: 40, lineHeight: 1, fontStyle: "italic" }}
          >
            About
          </div>
        </div>

        <div
          className={styles.heroGrid}
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 72,
            alignItems: "start",
          }}
        >
          <div>
            <p
              className={styles.serif}
              style={{
                fontSize: "clamp(22px, 2.4vw, 32px)",
                lineHeight: 1.25,
                margin: 0,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
              }}
            >
              A creator who turns hotel rooms into stories, flights into cinema, and breakfast
              tables into the kind of frame people save at 2&nbsp;a.m.
            </p>
            <div
              style={{
                marginTop: 56,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
              }}
            >
              <div>
                <div className={styles.monoXs} style={{ marginBottom: 10 }}>
                  Specialty
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  Short-form vertical video (Reels / TikTok), editorial photography,
                  atmospheric hospitality storytelling.
                </div>
              </div>
              <div>
                <div className={styles.monoXs} style={{ marginBottom: 10 }}>
                  Approach
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  Calm pacing, natural light, understated luxury. No loud edits — the place is
                  the hero.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Placeholder
              label="portrait · editorial"
              ratio="4/5"
              tone="warm"
              patternId="about-portrait"
            />
            <div
              style={{
                border: "1px solid var(--hair)",
                padding: 20,
                background: "var(--paper)",
              }}
            >
              <div className={styles.monoXs} style={{ marginBottom: 12 }}>
                On rotation
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>Languages</span>
                  <span className={styles.mono} style={{ fontSize: 12 }}>
                    EN · PL · UA · RU
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>Gear</span>
                  <span className={styles.mono} style={{ fontSize: 12 }}>
                    iPhone 17 Pro Max
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>Delivery</span>
                  <span className={styles.mono} style={{ fontSize: 12 }}>
                    5–7 days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
