import type { CSSProperties } from "react";

export type IconName =
  | "plane"
  | "hotel"
  | "palm"
  | "camera"
  | "compass"
  | "pin"
  | "ig"
  | "tt"
  | "yt"
  | "mail"
  | "arrow"
  | "play";

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, stroke = 1.25, style }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style,
  };
  switch (name) {
    case "plane":
      return (
        <svg {...common}>
          <path d="M3 12.5l18-7-7 18-2.5-7.5L3 12.5z" />
        </svg>
      );
    case "hotel":
      return (
        <svg {...common}>
          <path d="M3 20V7l9-4 9 4v13" />
          <path d="M3 20h18" />
          <path d="M9 20v-5h6v5" />
          <circle cx="9" cy="11" r=".5" fill="currentColor" />
          <circle cx="15" cy="11" r=".5" fill="currentColor" />
        </svg>
      );
    case "palm":
      return (
        <svg {...common}>
          <path d="M12 22V10" />
          <path d="M12 10c-3-4-7-4-9-2 2-2 6-1 9 2z" />
          <path d="M12 10c3-4 7-4 9-2-2-2-6-1-9 2z" />
          <path d="M12 10c-1-4-5-6-8-5 3-1 7 1 8 5z" />
          <path d="M12 10c1-4 5-6 8-5-3-1-7 1-8 5z" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7l2-3h2l2 3" />
          <circle cx="12" cy="13.5" r="3.5" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9l-2 6-4 2 2-6 4-2z" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    case "ig":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" />
        </svg>
      );
    case "tt":
      return (
        <svg {...common}>
          <path d="M15 3v10a4 4 0 11-4-4" />
          <path d="M15 3c0 3 2 5 5 5" />
        </svg>
      );
    case "yt":
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
          <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 7 9-7" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case "play":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M8 5l12 7-12 7V5z" />
        </svg>
      );
    default:
      return null;
  }
}
