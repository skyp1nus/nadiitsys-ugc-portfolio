import type { Category, VideosFile } from "@/types/video";
import data from "@/content/videos.json";

export function loadVideos(): VideosFile {
  return data as VideosFile;
}

export function getByCategory(category: Category) {
  return loadVideos().videos.filter((v) => v.category === category);
}
