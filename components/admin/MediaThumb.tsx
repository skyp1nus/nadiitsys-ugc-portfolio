"use client";

import { useEffect, useRef } from "react";
import { showFirstFrame } from "@/lib/videoFirstFrame";
import type { MediaKind } from "@/lib/repos/media";

interface Props {
  url: string;
  kind: MediaKind;
  alt: string | null;
  dimmed?: boolean;
}

const SIZE = 96;

const containerStyle = (dimmed?: boolean): React.CSSProperties => ({
  width: SIZE,
  height: SIZE,
  flexShrink: 0,
  background: "#111",
  borderRadius: 6,
  overflow: "hidden",
  opacity: dimmed ? 0.5 : 1,
  position: "relative",
});

const fillStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

export default function MediaThumb({ url, kind, alt, dimmed }: Props) {
  if (kind !== "reel") {
    return (
      <div style={containerStyle(dimmed)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt ?? ""} style={fillStyle} />
      </div>
    );
  }
  return (
    <div style={containerStyle(dimmed)}>
      <ReelThumb url={url} alt={alt} />
    </div>
  );
}

function ReelThumb({ url, alt }: { url: string; alt: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stored poster .jpgs are unreliable (often black), so paint a real frame
  // from the video itself instead of trusting the poster attribute.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    return showFirstFrame(v);
  }, []);

  return (
    <video
      ref={videoRef}
      src={url}
      muted
      playsInline
      preload="metadata"
      aria-label={alt ?? ""}
      style={fillStyle}
    />
  );
}
