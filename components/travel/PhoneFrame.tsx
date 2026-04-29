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
        position: "relative",
        aspectRatio: "9 / 16",
        borderRadius: 34,
        border: "6px solid var(--phone-frame, #1a1a1a)",
        background: "#000",
        overflow: "hidden",
        boxShadow:
          "0 30px 60px -30px rgba(43,42,38,0.35), 0 10px 20px -10px rgba(43,42,38,0.2)",
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 80,
          height: 20,
          borderRadius: 12,
          background: "var(--phone-frame, #1a1a1a)",
          zIndex: 3,
        }}
      />
      {children}
    </div>
  );
}
