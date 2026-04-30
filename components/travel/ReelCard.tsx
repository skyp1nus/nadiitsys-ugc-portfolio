"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { MediaItem } from "@/lib/repos/media";
import { PhoneFrame } from "./PhoneFrame";
import { Icon } from "./Icon";
import styles from "@/app/travel/travel.module.css";

interface ReelCardProps {
  reel: MediaItem;
}

function derivePosterUrl(videoUrl: string): string {
  try {
    const isAbsolute = /^https?:\/\//i.test(videoUrl);
    const u = new URL(videoUrl, isAbsolute ? undefined : "http://_local_");
    u.pathname = u.pathname.replace(/\.[^./]+$/, ".jpg");
    return isAbsolute ? u.toString() : u.pathname + u.search + u.hash;
  } catch {
    return videoUrl.replace(/\.[^./?#]+(\?|#|$)/, ".jpg$1");
  }
}

export function ReelCard({ reel }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [posterOk, setPosterOk] = useState<boolean | null>(null);

  const posterUrl = derivePosterUrl(reel.url);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setPosterOk(true);
    };
    img.onerror = () => {
      if (!cancelled) setPosterOk(false);
    };
    img.src = posterUrl;
    return () => {
      cancelled = true;
    };
  }, [posterUrl]);

  useEffect(() => {
    if (posterOk !== false) return;
    const v = videoRef.current;
    if (!v) return;
    let triggered = false;
    const onLoaded = () => {
      triggered = true;
      try {
        v.pause();
      } catch {
        /* noop */
      }
    };
    v.addEventListener("loadeddata", onLoaded, { once: true });
    v.muted = true;
    v.play().catch(() => {
      /* needs gesture; stay black until user clicks */
    });
    return () => {
      v.removeEventListener("loadeddata", onLoaded);
      if (!triggered) {
        try {
          v.pause();
        } catch {
          /* noop */
        }
      }
    };
  }, [posterOk]);

  const tagsDisplay = reel.tags
    ? reel.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(" · ")
    : "";
  const hasMeta = Boolean(reel.location || tagsDisplay || reel.views);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {
        /* swallow AbortError on rapid toggle */
      });
    } else {
      v.pause();
    }
  }

  function toggleMute(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  return (
    <PhoneFrame>
      <video
        ref={videoRef}
        src={reel.url}
        poster={posterUrl}
        muted
        playsInline
        preload={posterOk === true ? "none" : "metadata"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
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
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(251,247,240,0.92)",
              display: "grid",
              placeItems: "center",
              color: "var(--ink, #2b2a26)",
            }}
          >
            <Icon name="play" size={20} stroke={0} />
          </span>
        </span>
      )}

      {hasMeta && (
        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "100px 16px 18px",
            background: playing
              ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 90%)"
              : "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.22) 65%, rgba(0,0,0,0) 100%)",
            transition: "background 200ms ease",
            color: "#fff",
            zIndex: 2,
            pointerEvents: "none",
            display: "block",
            textAlign: "left",
          }}
        >
          {reel.location && (
            <span
              className={styles.mono}
              style={{
                display: "block",
                fontSize: 9,
                opacity: 0.9,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {reel.location}
            </span>
          )}
          <span
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            {tagsDisplay && (
              <span
                className={styles.serif}
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  opacity: 0.85,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tagsDisplay}
              </span>
            )}
            {reel.views && (
              <span
                className={styles.mono}
                style={{
                  fontSize: 11,
                  opacity: 0.9,
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                  marginLeft: "auto",
                }}
              >
                {reel.views}
              </span>
            )}
          </span>
        </span>
      )}

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        style={{
          position: "absolute",
          right: 6,
          top: 6,
          zIndex: 3,
          width: 44,
          height: 44,
          padding: 4,
          borderRadius: "50%",
          border: 0,
          background: "transparent",
          color: "#fff",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={muted ? "volumeOff" : "volumeOn"} size={16} />
        </span>
      </button>
    </PhoneFrame>
  );
}
