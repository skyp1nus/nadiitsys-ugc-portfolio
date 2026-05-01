import styles from "@/app/beauty/beauty.module.css";
import type { BeautyContact } from "@/lib/schemas/beauty-page";
import { AccentTextMultiline } from "./AccentText";
import { Reveal } from "./Reveal";

export function Contact({ contact }: { contact: BeautyContact }) {
  return (
    <section id="contact" className={styles.contact}>
      <div className={`${styles.container} ${styles.contactInner}`}>
        <Reveal>
          <div className={styles.contactEyebrow}>
            <span className={styles.contactEyebrowLine} />
            <span className={styles.mono}>{contact.eyebrow}</span>
          </div>
        </Reveal>
        <Reveal>
          <div className={styles.contactFinal}>
            <h2 className={styles.contactTitle}>
              <AccentTextMultiline text={contact.title} />
            </h2>
            <p className={styles.contactSub}>{contact.subtitle}</p>

            {contact.email ? (
              <Reveal delay={1}>
                <a href={`mailto:${contact.email}`} className={styles.contactEmail}>
                  <span className={`${styles.mono} ${styles.contactEmailLabel}`}>
                    {contact.emailLabel}
                  </span>
                  <span className={styles.contactEmailVal}>{contact.email}</span>
                  <span className={styles.contactEmailArrow}>→</span>
                </a>
              </Reveal>
            ) : null}

            <Reveal delay={2}>
              <div className={styles.contactSocials}>
                {contact.socials.map((s, i) => (
                  <a
                    key={i}
                    className={styles.socialLink}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{s.platform}</span>
                    <span style={{ opacity: 0.55 }}>{s.handle}</span>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={3}>
              <div className={styles.contactMeta}>
                <div className={styles.metaCol}>
                  <span className={styles.mono}>{contact.metaBasedInLabel}</span>
                  <span className={styles.metaColVal}>{contact.metaBasedInValue}</span>
                </div>
                <div className={styles.metaCol}>
                  <span className={styles.mono}>{contact.metaLanguagesLabel}</span>
                  <span className={styles.metaColVal}>{contact.metaLanguagesValue}</span>
                </div>
                <div className={styles.metaCol}>
                  <span className={styles.mono}>{contact.metaReplyLabel}</span>
                  <span className={styles.metaColVal}>{contact.metaReplyValue}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
