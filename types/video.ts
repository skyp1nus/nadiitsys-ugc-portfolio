export type Category = "beauty" | "travel";

export interface Video {
  id: string;
  category: Category;
  title: string;
  description: string;
  instagramUrl: string;
  posterKey: string;
  fallbackVideoKey?: string;
  publishedAt: string;
  tags: string[];
}

export interface VideosFile {
  version: 1;
  updatedAt: string;
  videos: Video[];
}
