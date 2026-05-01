"use client";

import MediaManager from "@/components/admin/MediaManager";

export function AboutPhotosTab() {
  return (
    <MediaManager
      pageSlug="beauty"
      kind="about-photo"
      accept="image/jpeg,image/png,image/webp"
      maxSizeMB={10}
      title="About photos"
      description="2 фото у секції About. Перші 2 в списку — використовуються."
    />
  );
}
