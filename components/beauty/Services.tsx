import styles from "@/app/beauty/beauty.module.css";
import type { BeautyServices, BeautyServiceItem } from "@/lib/schemas/beauty-page";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";

function variantClass(v: BeautyServiceItem["variant"]): string {
  if (v === "featured") return styles.serviceCardFeatured ?? "";
  if (v === "dashed") return styles.serviceCardDashed ?? "";
  return "";
}

function isNumericPrice(price: string): boolean {
  return /^\d+([.,]\d+)?$/.test(price.trim());
}

function ServiceCard({ item, contactHref }: { item: BeautyServiceItem; contactHref: string }) {
  const cls = `${styles.serviceCard} ${variantClass(item.variant)}`.trim();
  return (
    <a className={cls} href={contactHref}>
      <div className={styles.cardTop}>
        <span className={styles.serviceNum}>{item.number}</span>
        <span className={styles.serviceTag}>{item.tag}</span>
      </div>
      <div className={styles.serviceName}>
        <AccentText text={item.name} />
      </div>
      <div className={styles.serviceDesc}>{item.desc}</div>
      <div className={styles.cardBottom}>
        <div
          className={`${styles.servicePrice}${isNumericPrice(item.price) ? "" : ` ${styles.servicePriceTalk}`}`}
        >
          {isNumericPrice(item.price) && item.currency ? (
            <span className={styles.servicePriceCur}>{item.currency}</span>
          ) : null}
          {item.price}
        </div>
        <span className={styles.serviceArrow}>→</span>
      </div>
    </a>
  );
}

export function Services({
  services,
  contactHref = "#contact",
}: {
  services: BeautyServices;
  contactHref?: string;
}) {
  return (
    <section id="services" className={`${styles.services} ${styles.section}`}>
      <div className={styles.container}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.label}>
                <span className={styles.labelNum}>{services.eyebrowNum}</span>
                <span className={styles.mono}>{services.eyebrowLabel}</span>
              </div>
              <h2 className={styles.sectionTitle}>
                <AccentText text={services.title} />
              </h2>
            </div>
            {services.intro ? (
              <div className={styles.sectionHeaderRight}>{services.intro}</div>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className={styles.servicesList}>
            {services.items.map((it, i) => (
              <ServiceCard key={i} item={it} contactHref={contactHref} />
            ))}
          </div>
        </Reveal>

        {services.note ? (
          <Reveal delay={2}>
            <div className={styles.servicesNote}>
              <span className={styles.servicesNoteIcon}>✦</span>
              <span>{services.note}</span>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
