import { loadVideos } from "@/lib/content";
import { VideosEditor } from "@/components/admin/VideosEditor";

export default function VideosPage() {
  const data = loadVideos();
  return <VideosEditor initial={data} />;
}
