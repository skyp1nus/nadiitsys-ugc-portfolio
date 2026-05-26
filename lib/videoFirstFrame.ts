/**
 * Force a paused <video> to decode and paint a real frame as its still preview.
 *
 * Why: the `poster` attribute is unreliable here — many stored poster .jpgs are
 * black (a decode race during generation), and with `preload` the compositor
 * keeps showing that black poster until a frame is actually presented. Nudging
 * `currentTime` off zero forces the browser to decode and paint an early frame,
 * which reflects the true video content regardless of the poster.
 *
 * Returns a cleanup function that detaches the listener.
 */
export function showFirstFrame(v: HTMLVideoElement): () => void {
  let cancelled = false;
  const seek = () => {
    if (cancelled) return;
    try {
      v.currentTime = Math.min(0.1, Math.max(0, (v.duration || 1) - 0.05));
    } catch {
      /* seek can throw before metadata; ignore */
    }
  };
  if (v.readyState >= 1) {
    seek();
  } else {
    v.addEventListener("loadedmetadata", seek, { once: true });
  }
  return () => {
    cancelled = true;
    v.removeEventListener("loadedmetadata", seek);
  };
}
