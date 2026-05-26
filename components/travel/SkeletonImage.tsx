"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "@/app/travel/travel.module.css";

interface SkeletonImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  /** Applied to the underlying <img> — keeps hover styles (e.g. .stillsCell img) working. */
  imgClassName?: string;
  style?: CSSProperties;
}

/**
 * Image with a site-styled shimmer skeleton that covers the empty box until the
 * photo decodes, then fades out. Fixes the blank gaps on mobile while lazy
 * images below the fold are still loading.
 */
export function SkeletonImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  imgClassName,
  style,
}: SkeletonImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // The image can finish loading (or be cached) before React hydrates, so the
  // onLoad event never fires on the client — check completeness on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setLoaded(true);
  }, []);

  return (
    <div className={styles.skeletonWrap} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={imgClassName}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <span
        aria-hidden
        className={`${styles.skeletonShimmer}${loaded ? ` ${styles.skeletonHidden}` : ""}`}
      />
    </div>
  );
}
