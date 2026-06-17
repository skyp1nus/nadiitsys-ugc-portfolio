import { Placeholder } from "./Placeholder";
import { Reveal } from "./Reveal";
import { SkeletonVideo } from "./SkeletonVideo";
import styles from "@/app/travel/travel.module.css";
import type { MediaItem } from "@/lib/repos/media";

interface AboutProps {
  bio: string;
  languages: string[];
  gear: string;
  delivery: string;
  aboutVideo?: MediaItem | null;
}

export function About({ bio, languages, gear, delivery, aboutVideo }: AboutProps) {
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
        <Reveal>
          <div className={styles.monoXs} style={{ marginBottom: 8 }}>
            § 01
          </div>
          <div
            className={styles.serif}
            style={{ fontSize: 40, lineHeight: 1, fontStyle: "italic" }}
          >
            About
          </div>
        </Reveal>

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
            <Reveal variant="lift">
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
                {bio}
              </p>
            </Reveal>
            <div
              className={styles.staggerChildren}
              style={{
                marginTop: 56,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 48,
              }}
            >
              <Reveal>
                <div className={styles.monoXs} style={{ marginBottom: 10 }}>
                  Specialty
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  Short-form vertical video (Reels / TikTok), editorial photography,
                  atmospheric hospitality storytelling.
                </div>
              </Reveal>
              <Reveal>
                <div className={styles.monoXs} style={{ marginBottom: 10 }}>
                  Approach
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  Calm pacing, natural light, understated luxury. No loud edits — the place is
                  the hero.
                </div>
              </Reveal>
              <Reveal>
                <div className={styles.monoXs} style={{ marginBottom: 10 }}>
                  Values
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  Authenticity over perfection, respect for the place and its people,
                  reliable on-brief delivery — content that still feels human.
                </div>
              </Reveal>
              <Reveal>
                <div className={styles.monoXs} style={{ marginBottom: 10 }}>
                  Formats
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  Solo on-camera, couple, and family content — including my husband and our
                  toddler — for warm, lived-in hospitality stories.
                </div>
              </Reveal>
            </div>
          </div>

          <div
            className={styles.staggerChildren}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <Reveal variant="fade">
              {aboutVideo ? (
                <SkeletonVideo
                  src={aboutVideo.url}
                  ariaLabel="About portrait"
                  style={{ aspectRatio: "4 / 5", overflow: "hidden" }}
                />
              ) : (
                <Placeholder
                  label="portrait · editorial"
                  ratio="4/5"
                  tone="warm"
                  patternId="about-portrait"
                />
              )}
            </Reveal>
            <Reveal>
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
                      {languages.join(" · ")}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>Gear</span>
                    <span className={styles.mono} style={{ fontSize: 12 }}>
                      {gear}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span>Delivery</span>
                    <span className={styles.mono} style={{ fontSize: 12 }}>
                      {delivery}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
