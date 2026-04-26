import { Icon, type IconName } from "./Icon";
import styles from "@/app/travel/travel.module.css";

interface ContactProps {
  name: string;
}

interface Channel {
  i: IconName;
  l: string;
  v: string;
  href: string | null;
  soon?: boolean;
}

const CHANNELS: Channel[] = [
  { i: "mail", l: "Email", v: "hello@yourname.co", href: "mailto:hello@yourname.co" },
  {
    i: "ig",
    l: "Instagram",
    v: "@yourname.travels",
    href: "https://instagram.com/yourname.travels",
  },
  { i: "tt", l: "TikTok", v: "@yourname", href: "https://tiktok.com/@yourname" },
  { i: "yt", l: "YouTube", v: "—", href: null, soon: true },
];

export function Contact({ name }: ContactProps) {
  return (
    <section
      id="contact"
      className={styles.sectionPad}
      style={{ padding: "140px 48px 80px", maxWidth: 1440, margin: "0 auto" }}
    >
      <div
        className={styles.heroGrid}
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr .9fr",
          gap: 64,
          alignItems: "start",
        }}
      >
        <div>
          <div className={styles.monoXs} style={{ marginBottom: 16 }}>
            § 07 · Let’s work
          </div>
          <div
            className={styles.serif}
            style={{
              fontSize: "clamp(40px, 6vw, 96px)",
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Have a place
            <br />
            worth telling
            <br />
            <i>a story about?</i>
          </div>
          <div style={{ marginTop: 48, display: "flex", gap: 16, alignItems: "center" }}>
            <a
              href="mailto:hello@yourname.co"
              style={{
                padding: "16px 28px",
                background: "var(--ink)",
                color: "var(--paper)",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontSize: 14,
              }}
            >
              hello@yourname.co <Icon name="arrow" size={14} stroke={1.4} />
            </a>
          </div>
        </div>

        <div
          style={{ border: "1px solid var(--hair)", padding: 32, background: "var(--paper)" }}
        >
          <div className={styles.monoXs} style={{ marginBottom: 24 }}>
            Direct channels
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {CHANNELS.map((r, i) => {
              const inner = (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Icon name={r.i} size={16} stroke={1.1} />
                    <span style={{ fontSize: 14, color: "var(--ink-2)" }}>{r.l}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      className={styles.serif}
                      style={{
                        fontSize: 17,
                        fontStyle: "italic",
                        color: r.soon ? "var(--ink-2)" : "var(--ink)",
                      }}
                    >
                      {r.v}
                    </div>
                    {r.soon ? (
                      <span
                        className={styles.monoXs}
                        style={{
                          padding: "3px 8px",
                          border: "1px solid var(--hair)",
                          color: "var(--ink-2)",
                          background: "var(--cream)",
                        }}
                      >
                        soon
                      </span>
                    ) : (
                      <span className={styles.arrowI}>
                        <Icon name="arrow" size={12} stroke={1.3} />
                      </span>
                    )}
                  </div>
                </>
              );
              const rowStyle = {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: i < CHANNELS.length - 1 ? "1px solid var(--hair)" : "none",
                color: "var(--ink)",
                textDecoration: "none",
                cursor: r.soon ? "default" : "pointer",
              };
              if (r.soon || !r.href) {
                return (
                  <div key={i} style={rowStyle} title="Coming soon">
                    {inner}
                  </div>
                );
              }
              const isExternal = r.href.startsWith("http");
              return (
                <a
                  key={i}
                  href={r.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={styles.contactRow}
                  style={rowStyle}
                >
                  {inner}
                </a>
              );
            })}
          </div>

          <div
            style={{ height: 1, background: "var(--hair)", width: "100%", margin: "24px 0" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div className={styles.monoXs} style={{ marginBottom: 6 }}>
                Response time
              </div>
              <div style={{ fontSize: 14 }}>Within 24 hours</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className={styles.monoXs} style={{ marginBottom: 6 }}>
                Booking window
              </div>
              <div style={{ fontSize: 14 }}>May–September open</div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 120,
          paddingTop: 28,
          borderTop: "1px solid var(--ink)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <div className={styles.serif} style={{ fontSize: 32, fontStyle: "italic" }}>
          {name}
        </div>
        <div className={styles.monoXs} style={{ textAlign: "right" }}>
          © {new Date().getFullYear()} · Media Kit v.3 · All rights reserved
        </div>
      </div>
    </section>
  );
}
