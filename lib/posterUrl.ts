export function derivePosterUrl(videoUrl: string): string {
  try {
    const isAbsolute = /^https?:\/\//i.test(videoUrl);
    const u = new URL(videoUrl, isAbsolute ? undefined : "http://_local_");
    u.pathname = u.pathname.replace(/\.[^./]+$/, ".jpg");
    return isAbsolute ? u.toString() : u.pathname + u.search + u.hash;
  } catch {
    return videoUrl.replace(/\.[^./?#]+(\?|#|$)/, ".jpg$1");
  }
}
