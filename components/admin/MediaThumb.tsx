"use client";

import { useEffect, useRef, useState } from "react";
import { derivePosterUrl } from "@/lib/posterUrl";
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
  const [posterOk, setPosterOk] = useState<boolean | null>(null);
  const posterUrl = derivePosterUrl(url);

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
      /* needs gesture; stay black until user interacts elsewhere */
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

  if (posterOk === true) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={posterUrl} alt={alt ?? ""} style={fillStyle} />;
  }
  if (posterOk === false) {
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
  return null;
}
