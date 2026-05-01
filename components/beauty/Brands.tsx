import styles from "@/app/beauty/beauty.module.css";
import type { BeautyBrands, BeautyBrandItem } from "@/lib/schemas/beauty-page";
import { AccentText } from "./AccentText";
import { Reveal } from "./Reveal";

function BrandCell({ item }: { item: BeautyBrandItem }) {
  const cellClass = `${styles.brandCell}${item.isOpenSlot ? ` ${styles.brandCellOpen}` : ""}`;
  const inner = (
    <>
      <span className={styles.brandCorner}>{item.corner}</span>
      <span className={styles.brandName}>
        <AccentText text={item.name} />
      </span>
      <span className={styles.brandCat}>{item.category}</span>
      {!item.isOpenSlot ? (
        <span className={styles.brandVisit}>
          {item.link.includes("tiktok") ? "View tok →" : "View reel →"}
        </span>
      ) : null}
    </>
  );

  if (item.isOpenSlot || !item.link) {
    return <div className={cellClass}>{inner}</div>;
  }

  const isExternal = item.link.startsWith("http");
  return (
    <a
      className={cellClass}
      href={item.link}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {inner}
    </a>
  );
}

export function Brands({ brands }: { brands: BeautyBrands }) {
  return (
    <section className={styles.brands}>
      <div className={styles.container}>
        <Reveal>
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.label}>
                <span className={styles.labelNum}>{brands.eyebrowNum}</span>
                <span className={styles.mono}>{brands.eyebrowLabel}</span>
              </div>
              <h2 className={styles.sectionTitle}>
                <AccentText text={brands.title} />
              </h2>
            </div>
            {brands.intro ? (
              <div className={styles.sectionHeaderRight}>{brands.intro}</div>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className={styles.brandsGrid}>
            {brands.items.map((b, i) => (
              <BrandCell key={i} item={b} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
