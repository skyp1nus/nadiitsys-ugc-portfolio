import { Icon } from "./Icon";
import { Placeholder } from "./Placeholder";
import styles from "@/app/travel/travel.module.css";
import type { MediaItem } from "@/lib/repos/media";

interface HeroProps {
  name: string;
  tagline: string;
  location: string;
  heroImage?: MediaItem | null;
}

function HairRule({ w = "100%" }: { w?: string | number }) {
  return <div style={{ height: 1, background: "var(--hair)", width: w }} />;
}

export function Hero({ name, tagline, location, heroImage }: HeroProps) {
  return (
    <section
      className={styles.sectionPad}
      style={{
        padding: "64px 48px 96px",
        maxWidth: 1440,
        margin: "0 auto",
        position: "relative",
      }}
    >
      <div
        className={`${styles.monoXs} ${styles.hideOnMobile}`}
        style={{ position: "absolute", top: 70, right: 48 }}
      >
        N° 01 / 06
      </div>
      <div
        className={`${styles.monoXs} ${styles.hideOnMobile}`}
        style={{ position: "absolute", top: 70, left: 48 }}
      >
        Portfolio &amp; Rates
      </div>

      <div
        className={styles.heroGrid}
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr .9fr",
          gap: 64,
          alignItems: "end",
          marginTop: 80,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
            <Icon name="plane" size={18} stroke={1.1} />
            <div className={styles.monoXs}>Travel · Hospitality · Lifestyle</div>
          </div>
          <h1
            className={styles.serif}
            style={{
              fontSize: "clamp(48px, 8.4vw, 132px)",
              lineHeight: 0.92,
              margin: 0,
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            The art of
            <br />
            <i style={{ fontWeight: 400 }}>slow</i> travel,
            <br />
            told in frames.
          </h1>
          <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 24 }}>
            <HairRule w={80} />
            <div style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 420, lineHeight: 1.6 }}>
              {tagline}. I create cinematic UGC for hotels, resorts, airlines &amp; destination
              brands — content that makes travellers pause.
            </div>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {heroImage ? (
            <div
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                overflow: "hidden",
                background: "var(--cream)",
              }}
            >
              <img
                src={heroImage.url}
                alt={heroImage.alt ?? `${name} — hero portrait`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ) : (
            <Placeholder label="hero portrait · Amalfi" ratio="3/4" tone="sand" />
          )}
          <div
            className={styles.hideOnMobile}
            style={{
              position: "absolute",
              bottom: -18,
              left: -24,
              background: "var(--paper)",
              padding: "14px 18px",
              border: "1px solid var(--hair)",
            }}
          >
            <div className={styles.monoXs} style={{ marginBottom: 4 }}>
              Latest shoot
            </div>
            <span className={styles.monoXs}>40.6340°N / 14.6027°E · Positano, IT</span>
          </div>
          <div
            className={styles.hideOnMobile}
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "1px dashed var(--ink)",
              display: "grid",
              placeItems: "center",
              background: "var(--cream)",
            }}
          >
            <div
              className={styles.mono}
              style={{
                fontSize: 9,
                textAlign: "center",
                lineHeight: 1.3,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Est.
              <br />
              2021
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 96,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
          borderTop: "1px solid var(--ink)",
          paddingTop: 22,
        }}
      >
        <div className={styles.serif} style={{ fontSize: 22, fontStyle: "italic" }}>
          — {name}
        </div>
        <div className={styles.monoXs} style={{ textAlign: "right" }}>
          {location}
        </div>
      </div>
    </section>
  );
}
