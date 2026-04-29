"use client";

import MediaManager from "@/components/admin/MediaManager";
import type { PageSlug } from "@/lib/repos/media";

interface Props {
  pageSlug: PageSlug;
}

export function ReelsTab({ pageSlug }: Props) {
  return (
    <MediaManager
      pageSlug={pageSlug}
      kind="reel"
      accept="video/mp4,video/quicktime,video/webm"
      maxSizeMB={50}
    />
  );
}
