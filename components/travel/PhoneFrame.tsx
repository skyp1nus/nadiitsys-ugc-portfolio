"use client";

import { useState } from "react";
import type { Video } from "@/types/video";
import { Icon } from "./Icon";
import styles from "@/app/travel/travel.module.css";

const R2_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

interface PhoneFrameProps {
  video: Video;
  index: number;
}

export function PhoneFrame({ video, index }: PhoneFrameProps) {
  const [expanded, setExpanded] = useState(false);
  const posterUrl = `${R2_URL}/${video.posterKey}`;
  const location = video.tags?.[0] ?? "";

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: video.description,
            thumbnailUrl: posterUrl,
            uploadDate: video.publishedAt,
            url: video.instagramUrl,
          }),
        }}
      />

      {expanded ? (
        <PhoneEmbed url={video.instagramUrl} />
      ) : (
        <PhoneShell onClick={() => setExpanded(true)} title={video.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt={video.title}
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <NotchAndPlay />
          <Caption location={location} title={video.title} />
        </PhoneShell>
      )}

      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <div className={styles.serif} style={{ fontSize: 15, fontStyle: "italic" }}>
          {location || video.title}
        </div>
        <div className={styles.monoXs}>N° {String(index + 1).padStart(2, "0")}</div>
      </div>
    </div>
  );
}

function PhoneShell({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Play ${title}`}
      style={{
        position: "relative",
        width: "100%",
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          aspectRatio: "9 / 19.5",
          borderRadius: 34,
          background: "var(--ink)",
          padding: 8,
          boxShadow:
            "0 30px 60px -30px rgba(43,42,38,0.35), 0 10px 20px -10px rgba(43,42,38,0.2)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 26,
            overflow: "hidden",
            background: "#111",
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </button>
  );
}

function NotchAndPlay() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 80,
          height: 22,
          background: "#0a0a0a",
          borderRadius: 14,
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(251,247,240,0.92)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name="play" size={20} stroke={0} />
        </div>
      </div>
    </>
  );
}

function Caption({ location, title }: { location: string; title: string }) {
  return (
    <div
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
        pointerEvents: "none",
      }}
    >
      {location && (
        <div
          className={styles.mono}
          style={{
            fontSize: 9,
            opacity: 0.85,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {location}
        </div>
      )}
      <div
        className={styles.serif}
        style={{
          fontSize: 14,
          fontStyle: "italic",
          opacity: 0.9,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </div>
    </div>
  );
}

function PhoneEmbed({ url }: { url: string }) {
  if (typeof window !== "undefined" && !(window as Window & { instgrm?: unknown }).instgrm) {
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }
  return (
    <div
      style={{
        aspectRatio: "9 / 19.5",
        borderRadius: 34,
        overflow: "hidden",
        background: "var(--ink)",
        padding: 8,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 26,
          overflow: "auto",
          background: "#fff",
        }}
      >
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ margin: 0 }}
        />
      </div>
    </div>
  );
}
