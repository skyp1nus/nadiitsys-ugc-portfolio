"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "@/app/beauty/beauty.module.css";

interface SkeletonImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  /** Applied to the underlying <img> if a hover style needs to target it. */
  imgClassName?: string;
  style?: CSSProperties;
}

/**
 * Image with a palette-toned shimmer skeleton that fills the box until the photo
 * decodes, then fades out — kills the blank gaps while lazy images below the
 * fold are still loading. Mirrors the travel SkeletonImage (beauty palette).
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

  // A cached/early image can finish before hydration, so onLoad never fires on
  // the client — check completeness on mount.
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
