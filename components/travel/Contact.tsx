import { Icon, type IconName } from "./Icon";
import { Reveal } from "./Reveal";
import styles from "@/app/travel/travel.module.css";
import type { TravelContact } from "@/types/travel";
import type { TravelDict } from "@/lib/i18n/dictionary-types";

interface ContactProps {
  t: TravelDict["contact"];
  name: string;
  contact: TravelContact;
}

interface Channel {
  i: IconName;
  l: string;
  v: string;
  href: string | null;
  soon?: boolean;
}

function buildChannels(c: TravelContact, emailLabel: string): Channel[] {
  return [
    { i: "mail", l: emailLabel, v: c.email, href: c.email ? `mailto:${c.email}` : null },
    { i: "ig", l: "Instagram", v: c.instagram, href: c.instagramUrl || null },
    { i: "tt", l: "TikTok", v: c.tiktok, href: c.tiktokUrl || null },
    c.youtubeReady
      ? { i: "yt", l: "YouTube", v: c.youtube || "—", href: c.youtubeUrl || null }
      : { i: "yt", l: "YouTube", v: "—", href: null, soon: true },
  ];
}

export function Contact({ t, name, contact }: ContactProps) {
  const channels = buildChannels(contact, t.emailLabel);
  const ctaHref = contact.email ? `mailto:${contact.email}` : "#";
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
        <div className={styles.staggerChildren}>
          <Reveal variant="lift">
            <div className={styles.monoXs} style={{ marginBottom: 16 }}>
              § 07 · {t.letsWork}
            </div>
          </Reveal>
          <Reveal variant="lift">
            <div
              className={styles.serif}
              style={{
                fontSize: "clamp(40px, 6vw, 96px)",
                lineHeight: 0.95,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {t.title1}
              <br />
              {t.title2}
              <br />
              <i>{t.titleItalic}</i>
            </div>
          </Reveal>
          <Reveal variant="lift">
            <div style={{ marginTop: 48, display: "flex", gap: 16, alignItems: "center" }}>
              <a
                href={ctaHref}
                className={styles.contactCta}
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
                {contact.email || t.getInTouch} <Icon name="arrow" size={14} stroke={1.4} />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal
          variant="fade"
          style={{ border: "1px solid var(--hair)", padding: 32, background: "var(--paper)" }}
        >
          <div className={styles.monoXs} style={{ marginBottom: 24 }}>
            {t.directChannels}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {channels.map((r, i) => {
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
                        {t.soon}
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
                borderBottom: i < channels.length - 1 ? "1px solid var(--hair)" : "none",
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
                {t.responseTime}
              </div>
              <div style={{ fontSize: 14 }}>{contact.responseTime}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className={styles.monoXs} style={{ marginBottom: 6 }}>
                {t.bookingWindow}
              </div>
              <div style={{ fontSize: 14 }}>{contact.bookingWindow}</div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal
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
          © {new Date().getFullYear()} · {t.mediaKit} · {t.rights}
        </div>
      </Reveal>
    </section>
  );
}
