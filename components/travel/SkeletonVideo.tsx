"use client";

import { useRef, type CSSProperties } from "react";
import { useVideoReady } from "@/lib/useVideoReady";
import styles from "@/app/travel/travel.module.css";

interface SkeletonVideoProps {
  src: string;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Autoplaying video with a site-toned shimmer skeleton covering the box until a
 * real frame paints (no black gap while the clip loads below the fold).
 */
export function SkeletonVideo({ src, ariaLabel, className, style }: SkeletonVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const ready = useVideoReady(ref);

  return (
    <div className={`${styles.skeletonWrap} ${className ?? ""}`.trim()} style={style}>
      <video
        ref={ref}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={ariaLabel}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <span
        aria-hidden
        className={`${styles.skeletonShimmer}${ready ? ` ${styles.skeletonHidden}` : ""}`}
      />
    </div>
  );
}
