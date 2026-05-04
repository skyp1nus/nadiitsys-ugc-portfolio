import type { CSSProperties, ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function PhoneFrame({ children, className, style }: PhoneFrameProps) {
  return (
    <div
      className={className}
      style={{
        aspectRatio: "9 / 19.5",
        borderRadius: 34,
        background: "var(--ink, #2b2a26)",
        padding: 8,
        boxShadow:
          "0 30px 60px -30px rgba(43,42,38,0.35), 0 10px 20px -10px rgba(43,42,38,0.2)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 26,
          overflow: "hidden",
          background: "#111",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 22,
            background: "#0a0a0a",
            borderRadius: 14,
            zIndex: 3,
          }}
        />
        {children}
      </div>
    </div>
  );
}
