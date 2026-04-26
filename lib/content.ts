import type { Category, VideosFile } from "@/types/video";
import type { TravelPage } from "@/types/travel";
import data from "@/content/videos.json";
import travelPage from "@/content/pages/travel.json";

export function loadVideos(): VideosFile {
  return data as VideosFile;
}

export function getByCategory(category: Category) {
  return loadVideos().videos.filter((v) => v.category === category);
}

export function loadTravelPage(): TravelPage {
  return travelPage as TravelPage;
}
