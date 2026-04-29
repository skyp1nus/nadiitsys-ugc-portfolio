"use client";

import MediaManager from "@/components/admin/MediaManager";
import type { PageSlug } from "@/lib/repos/media";

interface Props {
  pageSlug: PageSlug;
}

export function PhotosTab({ pageSlug }: Props) {
  return (
    <MediaManager
      pageSlug={pageSlug}
      kind="photo"
      accept="image/jpeg,image/png,image/webp"
      maxSizeMB={10}
    />
  );
}
