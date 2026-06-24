import styles from "@/app/lifestyle/beauty.module.css";
import type { BeautyFooter } from "@/lib/schemas/beauty-page";

export function Footer({ footer }: { footer: BeautyFooter }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLogo}>{footer.logo}</div>
      <div>{footer.copyright}</div>
      <div>{footer.tagline}</div>
    </footer>
  );
}
