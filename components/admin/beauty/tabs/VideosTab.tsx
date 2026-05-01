"use client";

import type { BeautySimpleSectionHeader } from "@/lib/schemas/beauty-page";
import MediaManager from "@/components/admin/MediaManager";
import { SimpleHeaderTab } from "./SimpleHeaderTab";

interface Props {
  value: BeautySimpleSectionHeader;
  onChange: (next: BeautySimpleSectionHeader) => void;
}

export function VideosTab({ value, onChange }: Props) {
  return (
    <>
      <SimpleHeaderTab value={value} onChange={onChange} cardTitle="Videos section header" />
      <MediaManager
        pageSlug="beauty"
        kind="reel"
        accept="video/mp4,video/quicktime,video/webm"
        maxSizeMB={50}
        title="Reel videos"
        description="Drag-and-drop reel-відео. Перші 8 рендеряться у 4-колонній сітці."
      />
    </>
  );
}
