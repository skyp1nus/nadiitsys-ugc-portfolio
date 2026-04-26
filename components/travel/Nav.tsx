import { Icon } from "./Icon";
import styles from "@/app/travel/travel.module.css";

export function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(245,239,230,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--hair)",
      }}
    >
      <div
        className={styles.navInner}
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "18px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid var(--ink)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="compass" size={16} stroke={1} />
          </div>
          <div className={styles.monoXs} style={{ color: "var(--ink)" }}>
            Media Kit · 2026
          </div>
        </div>

        <div className={`${styles.monoXs} ${styles.navLinks}`} style={{ display: "flex", gap: 40 }}>
          <a href="#about">About</a>
          <a href="#offer">Services</a>
          <a href="#work">Work</a>
          <a href="#map">Travels</a>
          <a href="#contact">Contact</a>
        </div>

        <a
          href="#contact"
          className={styles.monoXs}
          style={{
            padding: "10px 18px",
            border: "1px solid var(--ink)",
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
          }}
        >
          Book a collab <Icon name="arrow" size={12} stroke={1.4} />
        </a>
      </div>
    </nav>
  );
}
