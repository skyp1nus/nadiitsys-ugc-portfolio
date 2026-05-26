type RVFC = (cb: () => void) => number;

/** Resolve once the frame for the current `currentTime` is actually decoded and painted. */
function waitForPaintedFrame(v: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    const rvfc = (
      v as HTMLVideoElement & { requestVideoFrameCallback?: RVFC }
    ).requestVideoFrameCallback?.bind(v);
    if (rvfc) {
      // One callback fires on the next presented frame after the seek.
      rvfc(() => resolve());
      return;
    }
    // Fallback: `seeked` plus two rAFs to let the compositor paint the frame.
    const onSeeked = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    };
    v.addEventListener("seeked", onSeeked, { once: true });
  });
}

function seekTo(v: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onError = () => reject(new Error("seek failed"));
    v.addEventListener("error", onError, { once: true });
    void waitForPaintedFrame(v).then(() => {
      v.removeEventListener("error", onError);
      resolve();
    });
    v.currentTime = t;
  });
}

/** Mean luma of a downscaled draw; used to reject near-black frames (fade-ins). */
function meanLuma(ctx: CanvasRenderingContext2D, w: number, h: number): number {
  const { data } = ctx.getImageData(0, 0, w, h);
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    sum += 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
  }
  return sum / (data.length / 4);
}

export async function extractPoster(file: File): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const url = URL.createObjectURL(file);
  const v = document.createElement("video");
  // iOS Safari: video must be in DOM, otherwise drawImage gets blank pixels.
  v.style.cssText =
    "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none";
  v.muted = true;
  v.playsInline = true;
  v.preload = "auto";
  document.body.appendChild(v);

  try {
    v.src = url;

    await new Promise<void>((resolve, reject) => {
      const onError = () => reject(new Error("video load failed"));
      v.addEventListener("loadedmetadata", () => resolve(), { once: true });
      v.addEventListener("error", onError, { once: true });
    });

    const maxW = 720;
    const vw = v.videoWidth || maxW;
    const vh = v.videoHeight || maxW;
    const scale = Math.min(1, maxW / vw);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(vw * scale));
    canvas.height = Math.max(1, Math.round(vh * scale));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    const dur = v.duration || 1;
    // Reels often fade in from black; walk forward until we land on a frame
    // with real content rather than capturing the black intro.
    const offsets = [
      Math.min(0.1, dur * 0.02),
      Math.min(1, dur * 0.1),
      Math.min(2.5, dur * 0.25),
      Math.min(5, dur * 0.5),
    ];

    let drawn = false;
    for (const t of offsets) {
      await seekTo(v, t);
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      drawn = true;
      if (meanLuma(ctx, canvas.width, canvas.height) > 12) break;
    }
    if (!drawn) return null;

    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.82),
    );
  } catch {
    return null;
  } finally {
    v.removeAttribute("src");
    v.load();
    v.remove();
    URL.revokeObjectURL(url);
  }
}
