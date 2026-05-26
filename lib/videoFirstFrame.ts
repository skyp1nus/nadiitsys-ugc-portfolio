/**
 * Force a paused <video> to decode and paint a real frame as its still preview.
 *
 * Why: the `poster` attribute is unreliable here — many stored poster .jpgs are
 * black (a decode race during generation), and with `preload` the compositor
 * keeps showing that black poster until a frame is actually presented. Nudging
 * `currentTime` off zero forces the browser to decode and paint an early frame,
 * which reflects the true video content regardless of the poster.
 *
 * Safari also discards the decoded frame of a paused video when its tab/window
 * is backgrounded, leaving a black box on return — so we re-paint on
 * visibilitychange / pageshow by nudging currentTime a hair to force a redecode.
 *
 * Returns a cleanup function that detaches the listeners.
 */
export function showFirstFrame(v: HTMLVideoElement): () => void {
  let cancelled = false;

  const seekToStart = () => {
    if (cancelled) return;
    try {
      v.currentTime = Math.min(0.1, Math.max(0, (v.duration || 1) - 0.05));
    } catch {
      /* seek can throw before metadata; ignore */
    }
  };

  // Nudge currentTime a hair (without jumping the still) to force Safari to
  // re-decode and paint the frame it dropped while backgrounded.
  const repaint = () => {
    if (cancelled || document.visibilityState !== "visible" || !v.paused) return;
    try {
      v.currentTime += v.currentTime > 0.05 ? -0.001 : 0.001;
    } catch {
      /* ignore */
    }
  };

  if (v.readyState >= 1) {
    seekToStart();
  } else {
    v.addEventListener("loadedmetadata", seekToStart, { once: true });
  }

  document.addEventListener("visibilitychange", repaint);
  window.addEventListener("pageshow", repaint);

  return () => {
    cancelled = true;
    v.removeEventListener("loadedmetadata", seekToStart);
    document.removeEventListener("visibilitychange", repaint);
    window.removeEventListener("pageshow", repaint);
  };
}
