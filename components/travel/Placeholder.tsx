import type { CSSProperties } from "react";
import styles from "@/app/travel/travel.module.css";

export type PlaceholderTone = "warm" | "cool" | "dark" | "sand";

interface PlaceholderProps {
  label?: string;
  ratio?: string;
  tone?: PlaceholderTone;
  style?: CSSProperties;
  patternId?: string;
}

const FILLS: Record<PlaceholderTone, [string, string]> = {
  warm: ["#E8DFCB", "#DCCFB1"],
  cool: ["#DCD8CE", "#C9C3B3"],
  dark: ["#4A4741", "#3A3732"],
  sand: ["#D9BE95", "#C9A57B"],
};

export function Placeholder({
  label,
  ratio = "4/5",
  tone = "warm",
  style,
  patternId,
}: PlaceholderProps) {
  const [a, b] = FILLS[tone];
  const id = patternId ?? `sp-${tone}-${ratio.replace(/\W/g, "")}`;
  return (
    <div
      style={{
        aspectRatio: ratio,
        position: "relative",
        overflow: "hidden",
        background: a,
        ...style,
      }}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        <defs>
          <pattern
            id={id}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-35)"
          >
            <rect width="14" height="14" fill={a} />
            <rect width="1" height="14" fill={b} opacity="0.55" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      {label && (
        <div
          className={styles.mono}
          style={{
            position: "absolute",
            left: 10,
            bottom: 10,
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: tone === "dark" ? "#E8DFCB" : "#2B2A26",
            opacity: 0.7,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
