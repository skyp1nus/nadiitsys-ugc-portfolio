import type { ReactNode } from "react";
import styles from "@/app/beauty/beauty.module.css";

/**
 * Renders text with `*accent*` → italic rose span. No HTML injection — pure split.
 */
export function AccentText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split("*");
  const out: ReactNode[] = [];
  parts.forEach((p, i) => {
    if (i % 2 === 1) {
      out.push(
        <span key={i} className={styles.accent}>
          {p}
        </span>
      );
    } else {
      out.push(p);
    }
  });
  return <>{out}</>;
}

/** Same but splits on `\n` first, rendering each line separated by <br />. */
export function AccentTextMultiline({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          <AccentText text={line} />
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}
