"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether a <video> has a real frame painted (so a loading skeleton can
 * fade out). With `preload="metadata"` the element shows a black box until a
 * frame is decoded — `showFirstFrame` seeks to force that, which fires `seeked`;
 * autoplay clips fire `loadeddata` / `playing`. Any of those means a frame is up.
 *
 * Returns true once ready (also immediately if the frame is already cached).
 */
export function useVideoReady(
  ref: RefObject<HTMLVideoElement | null>,
  timeoutMs = 2500,
): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // HAVE_CURRENT_DATA or better — a frame is already available (cached).
    if (v.readyState >= 2) {
      setReady(true);
      return;
    }
    const mark = () => setReady(true);
    const events = ["loadeddata", "seeked", "playing", "error"] as const;
    for (const e of events) v.addEventListener(e, mark, { once: true });
    // Safety net: if muted autoplay is suppressed or the frame never decodes,
    // none of those events fire — reveal anyway so the skeleton can never cover
    // the video permanently.
    const fallback = window.setTimeout(mark, timeoutMs);
    return () => {
      for (const e of events) v.removeEventListener(e, mark);
      window.clearTimeout(fallback);
    };
  }, [ref, timeoutMs]);

  return ready;
}
