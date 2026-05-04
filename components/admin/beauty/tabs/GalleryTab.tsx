"use client";

import type { BeautySimpleSectionHeader } from "@/lib/schemas/beauty-page";
import MediaManager from "@/components/admin/MediaManager";
import { SimpleHeaderTab } from "./SimpleHeaderTab";

interface Props {
  value: BeautySimpleSectionHeader;
  onChange: (next: BeautySimpleSectionHeader) => void;
}

export function GalleryTab({ value, onChange }: Props) {
  return (
    <>
      <SimpleHeaderTab value={value} onChange={onChange} cardTitle="Gallery section header" />
      <MediaManager
        pageSlug="beauty"
        kind="photo"
        accept="image/jpeg,image/png,image/webp"
        maxSizeMB={10}
        title="Gallery photos"
        description="Bento-grid з 7 spans. Перші 7 фото в списку — рендеряться."
      />
    </>
  );
}
