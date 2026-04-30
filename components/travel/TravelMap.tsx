"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DOTS } from "./travel-map-dots";
import { PINS, COUNTRIES as DEFAULT_COUNTRIES, STATS } from "./travel-map-data";
import { Reveal } from "./Reveal";
import styles from "@/app/travel/travel.module.css";

interface TravelMapProps {
  countries?: string[];
}

const mapBtn: CSSProperties = {
  width: 32,
  height: 32,
  padding: 0,
  border: "1px solid var(--ink)",
  background: "var(--paper)",
  color: "var(--ink)",
  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
  fontSize: 16,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

interface View {
  z: number;
  tx: number;
  ty: number;
}

interface DragState {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  moved: boolean;
}

export function TravelMap({ countries }: TravelMapProps = {}) {
  const list = countries && countries.length > 0 ? countries : DEFAULT_COUNTRIES;
  const [view, setView] = useState<View>({ z: 1, tx: 0, ty: 0 });
  const [hover, setHover] = useState(-1);
  const [focused, setFocused] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const applyView = (next: View) => {
    const z = clamp(next.z, 1, 6);
    const box = boxRef.current;
    const w = box?.clientWidth || 1000;
    const h = box?.clientHeight || 450;
    const maxX = (w * (z - 1)) / 2;
    const maxY = (h * (z - 1)) / 2;
    setView({ z, tx: clamp(next.tx, -maxX, maxX), ty: clamp(next.ty, -maxY, maxY) });
  };

  // wheel needs non-passive listener to call preventDefault in React 19
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = box.getBoundingClientRect();
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      setView((cur) => {
        const nz = clamp(cur.z * factor, 1, 6);
        const ratio = nz / cur.z;
        const z = nz;
        const w = box.clientWidth || 1000;
        const h = box.clientHeight || 450;
        const maxX = (w * (z - 1)) / 2;
        const maxY = (h * (z - 1)) / 2;
        const tx = clamp(cx - (cx - cur.tx) * ratio, -maxX, maxX);
        const ty = clamp(cy - (cy - cur.ty) * ratio, -maxY, maxY);
        return { z, tx, ty };
      });
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => box.removeEventListener("wheel", onWheel);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      tx: view.tx,
      ty: view.ty,
      moved: false,
    };
    setIsDragging(true);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    applyView({ z: view.z, tx: d.tx + dx, ty: d.ty + dy });
  };
  const onMouseUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const zoomIn = () => applyView({ ...view, z: view.z * 1.4 });
  const zoomOut = () => applyView({ ...view, z: view.z / 1.4 });
  const reset = () => setView({ z: 1, tx: 0, ty: 0 });

  const invZ = 1 / view.z;

  return (
    <section
      id="map"
      className={styles.sectionPad}
      style={{
        padding: "120px 48px",
        background: "var(--paper)",
        borderTop: "1px solid var(--hair)",
        borderBottom: "1px solid var(--hair)",
      }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div
          className={styles.splitGrid}
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 64,
            marginBottom: 56,
          }}
        >
          <Reveal>
            <div className={styles.monoXs} style={{ marginBottom: 8 }}>
              § 06
            </div>
            <div
              className={styles.serif}
              style={{ fontSize: 40, lineHeight: 1, fontStyle: "italic" }}
            >
              Travels
            </div>
          </Reveal>
          <Reveal
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                maxWidth: 560,
                fontSize: 15,
                color: "var(--ink-2)",
                lineHeight: 1.6,
              }}
            >
              Countries I’ve created content in — organically, and for clients. Scroll or drag
              the map to explore — hover a pin to see its city.
            </div>
            <div className={`${styles.monoXs}`} style={{ display: "flex", gap: 48 }}>
              {[
                { n: list.length, l: "countries" },
                { n: STATS.cities, l: "cities" },
                { n: STATS.continents, l: "continents" },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className={styles.serif}
                    style={{
                      fontSize: 32,
                      color: "var(--ink)",
                      fontStyle: "italic",
                      marginBottom: 4,
                    }}
                  >
                    {s.n}
                  </div>
                  {s.l}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal variant="fade">
          <div
            ref={boxRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            style={{
              position: "relative",
              aspectRatio: "2.2 / 1",
              background: "var(--cream)",
              border: "1px solid var(--hair)",
              overflow: "hidden",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              touchAction: "none",
            }}
          >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.z})`,
              transformOrigin: "center center",
              transition: isDragging
                ? "none"
                : "transform 0.25s cubic-bezier(0.3, 0.7, 0.2, 1)",
            }}
          >
            <svg
              viewBox="0 0 1000 450"
              preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              aria-hidden
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={(i + 1) * (450 / 6)}
                  x2="1000"
                  y2={(i + 1) * (450 / 6)}
                  stroke="#E6DFD1"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
              ))}
              {Array.from({ length: 12 }, (_, i) => i).map((i) => (
                <line
                  key={`v${i}`}
                  x1={(i + 1) * (1000 / 12)}
                  y1="0"
                  x2={(i + 1) * (1000 / 12)}
                  y2="450"
                  stroke="#E6DFD1"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
              ))}
              <line
                x1="0"
                y1="225"
                x2="1000"
                y2="225"
                stroke="#D9D0C1"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.8"
              />
              {DOTS.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="1.4"
                  fill="var(--sand)"
                  opacity="0.85"
                />
              ))}
            </svg>

            {PINS.map((p, i) => {
              const active = hover === i || focused === i;
              return (
                <div
                  key={`dot-${i}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(-1)}
                  onClick={(e) => {
                    if (dragRef.current?.moved) return;
                    e.stopPropagation();
                    setFocused(focused === i ? -1 : i);
                  }}
                  style={{
                    position: "absolute",
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: `translate(-50%, -50%) scale(${invZ})`,
                    cursor: "pointer",
                    zIndex: active ? 20 : 10,
                  }}
                >
                  <div
                    style={{
                      width: active ? 14 : 10,
                      height: active ? 14 : 10,
                      borderRadius: "50%",
                      background: active ? "var(--sand)" : "var(--ink)",
                      border: "2px solid var(--paper)",
                      boxShadow: "0 0 0 1px var(--ink), 0 2px 6px rgba(0,0,0,0.15)",
                      transition: "width 0.18s, height 0.18s, background 0.18s",
                    }}
                  />
                  {active && (
                    <div
                      className={styles.monoXs}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: -10,
                        transform: "translate(-50%, -100%)",
                        background: "var(--ink)",
                        color: "var(--paper)",
                        padding: "5px 10px",
                        whiteSpace: "nowrap",
                        fontSize: 10,
                        letterSpacing: "0.16em",
                        border: "1px solid var(--ink)",
                      }}
                    >
                      {p.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              zIndex: 30,
            }}
          >
            <button onClick={zoomIn} style={mapBtn} aria-label="Zoom in">
              +
            </button>
            <button onClick={zoomOut} style={mapBtn} aria-label="Zoom out">
              −
            </button>
            <button
              onClick={reset}
              style={{ ...mapBtn, fontSize: 9 }}
              aria-label="Reset view"
            >
              ⟲
            </button>
          </div>
          <div
            className={styles.monoXs}
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              background: "var(--paper)",
              padding: "5px 10px",
              border: "1px solid var(--hair)",
            }}
          >
            {view.z.toFixed(1)}×
          </div>

          <div
            className={styles.monoXs}
            style={{ position: "absolute", bottom: 12, left: 12 }}
          >
            DRAG · SCROLL TO ZOOM
          </div>
          <div
            className={styles.monoXs}
            style={{ position: "absolute", bottom: 12, right: 12 }}
          >
            UPDATED APR 2026
          </div>
          </div>
        </Reveal>

        <Reveal>
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "10px 20px",
            }}
          >
            {list.map((c) => (
              <div
                key={c}
                className={styles.mono}
                style={{
                  fontSize: 12,
                  color: "var(--ink-2)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--sand)",
                  }}
                />
                {c}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
