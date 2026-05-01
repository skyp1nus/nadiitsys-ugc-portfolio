"use client";

import type { PaletteKey } from "@/lib/schemas/beauty-page";
import { Card } from "../../travel/_ui";

interface Props {
  value: PaletteKey;
  onChange: (next: PaletteKey) => void;
}

interface PaletteInfo {
  key: PaletteKey;
  label: string;
  sub: string;
  swatches: [string, string, string, string];
}

const PALETTES: PaletteInfo[] = [
  {
    key: "blush",
    label: "Blush + Cream",
    sub: "soft, modern (default)",
    swatches: ["#FBF6F2", "#F4C9C1", "#C97B7A", "#2A201D"],
  },
  {
    key: "petal",
    label: "Petal Pink",
    sub: "romantic, dreamy",
    swatches: ["#FDF4F2", "#F8C5C2", "#D67383", "#3A1F25"],
  },
  {
    key: "mauve",
    label: "Mauve Editorial",
    sub: "rich, magazine",
    swatches: ["#F7F1EE", "#E2B6B4", "#9B5B6B", "#241419"],
  },
  {
    key: "peach",
    label: "Peach Glow",
    sub: "warm, sunlit",
    swatches: ["#FCF5EF", "#F5C6AE", "#C96E5E", "#2D1B14"],
  },
];

export function ThemeTab({ value, onChange }: Props) {
  return (
    <Card
      title="Color palette"
      description="Перемикач між 4 рожевими палітрами. Зміна одразу зберігається + reflect на /beauty після reload."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        {PALETTES.map((p) => {
          const active = value === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onChange(p.key)}
              style={{
                textAlign: "left",
                padding: 16,
                background: active ? "#fff" : "var(--bg)",
                border: active
                  ? "2px solid var(--ink)"
                  : "1px solid var(--line)",
                borderRadius: 10,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontFamily: "inherit",
                color: "inherit",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {p.swatches.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 24,
                      height: 24,
                      background: c,
                      borderRadius: 5,
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  />
                ))}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink)",
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--ink-3)",
                    marginTop: 2,
                  }}
                >
                  {p.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
