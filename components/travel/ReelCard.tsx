"use client";

import { useState } from "react";
import type { MediaItem } from "@/lib/repos/media";
import { PhoneFrame } from "./PhoneFrame";
import { Icon } from "./Icon";
import styles from "@/app/travel/travel.module.css";

interface ReelCardProps {
  reel: MediaItem;
}

export function ReelCard({ reel }: ReelCardProps) {
  const [playing, setPlaying] = useState(false);

  const tagsDisplay = reel.tags
    ? reel.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(" · ")
    : "";
  const hasMeta = Boolean(reel.location || tagsDisplay || reel.views);

  return (
    <PhoneFrame>
      {playing ? (
        <video
          src={reel.url}
          controls
          autoPlay
          playsInline
          preload="metadata"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            background: "#000",
          }}
        >
          Your browser doesn&apos;t support video playback.
        </video>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={reel.alt ? `Play reel: ${reel.alt}` : "Play reel"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            padding: 0,
            border: 0,
            background: "#000",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              zIndex: 2,
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
          {hasMeta && (
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "100px 16px 18px",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.22) 65%, rgba(0,0,0,0) 100%)",
                color: "#fff",
                zIndex: 2,
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
                      opacity: 0.7,
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
        </button>
      )}
    </PhoneFrame>
  );
}
