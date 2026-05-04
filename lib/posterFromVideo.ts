export async function extractPoster(file: File): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const url = URL.createObjectURL(file);
  const v = document.createElement("video");
  // iOS Safari: video must be in DOM, otherwise drawImage gets blank pixels.
  v.style.cssText =
    "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none";
  v.muted = true;
  v.playsInline = true;
  v.preload = "metadata";
  v.crossOrigin = "anonymous";
  document.body.appendChild(v);

  try {
    v.src = url;

    await new Promise<void>((resolve, reject) => {
      const onError = () => reject(new Error("video load failed"));
      v.addEventListener("loadedmetadata", () => resolve(), { once: true });
      v.addEventListener("error", onError, { once: true });
    });

    const target = Math.min(1, (v.duration || 1) * 0.1);
    await new Promise<void>((resolve, reject) => {
      const onError = () => reject(new Error("seek failed"));
      v.addEventListener("seeked", () => resolve(), { once: true });
      v.addEventListener("error", onError, { once: true });
      v.currentTime = target;
    });

    const maxW = 720;
    const vw = v.videoWidth || maxW;
    const vh = v.videoHeight || maxW;
    const scale = Math.min(1, maxW / vw);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(vw * scale));
    canvas.height = Math.max(1, Math.round(vh * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

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
