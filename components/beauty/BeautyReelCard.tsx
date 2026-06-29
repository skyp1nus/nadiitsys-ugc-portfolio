"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { MediaItem } from "@/lib/repos/media";
import { showFirstFrame } from "@/lib/videoFirstFrame";
import { useVideoReady } from "@/lib/useVideoReady";
import styles from "@/app/lifestyle/beauty.module.css";

interface Props {
  reel: MediaItem;
  index: number;
  soloed: boolean;
  register: (el: HTMLVideoElement, key: string) => void;
  unregister: (el: HTMLVideoElement) => void;
  onToggleSound: (key: string) => void;
  className?: string;
  style?: CSSProperties;
  openAria?: string;
}

export function BeautyReelCard({
  reel,
  index,
  soloed,
  register,
  unregister,
  onToggleSound,
  className,
  style,
  openAria = "Open on Instagram / TikTok",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const ready = useVideoReady(videoRef);

  // Register with the container's shared IntersectionObserver; paint a real
  // first frame (stored poster .jpgs are often black). Pause + unregister on
  // unmount (e.g. filter change) so off-screen audio never leaks.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const cleanupFrame = showFirstFrame(v);
    register(v, reel.key);
    return () => {
      unregister(v);
      cleanupFrame();
    };
  }, [register, unregister, reel.key]);

  // Sound follows the container's solo state. Tapping is a user gesture, so
  // unmuting + playing here is allowed even under reduced-motion / autoplay caps.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !soloed;
    if (soloed) v.play().catch(() => {});
  }, [soloed]);

  const poster = reel.url.replace(/\.[^.]+$/, ".jpg");
  const link =
    reel.caption && /^https?:\/\//.test(reel.caption) ? reel.caption : null;
  const meta = reel.location || `REEL · ${String(index + 1).padStart(2, "0")}`;

  function onSoundBtn(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onToggleSound(reel.key);
  }

  return (
    <div className={className} style={style}>
      <video
        ref={videoRef}
        src={reel.url}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={() => onToggleSound(reel.key)}
        aria-label={reel.alt ? `Reel: ${reel.alt}` : "Reel"}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          background: "#000",
          cursor: "pointer",
        }}
      >
        Your browser doesn&apos;t support video playback.
      </video>

      {/* Loading skeleton — covers the black box until a real frame paints. */}
      <span
        aria-hidden
        className={`${styles.skeletonShimmer}${ready ? ` ${styles.skeletonHidden}` : ""}`}
      />

      {/* Play indicator while paused (off-screen / reduced-motion / low-power). */}
      {!playing && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              display: "grid",
              placeItems: "center",
              color: "#000",
              fontSize: 16,
              paddingLeft: 3,
            }}
          >
            ▶
          </span>
        </span>
      )}

      {/* Optional external link (IG / TikTok) — top-left, doesn't trigger sound. */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={openAria}
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            zIndex: 3,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
          </svg>
        </a>
      )}

      {/* Sound toggle — top-right. */}
      <button
        type="button"
        onClick={onSoundBtn}
        aria-label={soloed ? "Mute" : "Unmute"}
        style={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 3,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: 0,
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        {soloed ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M16 9c1 .8 1 4.2 0 5M18.5 7c2 1.6 2 7.4 0 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Location / index label — bottom. */}
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "40px 14px 14px",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)",
          color: "#fff",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: "var(--font-mono), monospace",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {meta}
      </span>
    </div>
  );
}
