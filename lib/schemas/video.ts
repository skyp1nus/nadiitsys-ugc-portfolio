import { z } from "zod";

export const VideoSchema = z.object({
  id: z.string().min(1),
  category: z.enum(["beauty", "travel"]),
  title: z.string().min(1),
  description: z.string(),
  instagramUrl: z.string().url(),
  posterKey: z.string().min(1),
  fallbackVideoKey: z.string().optional(),
  publishedAt: z.string().datetime(),
  tags: z.array(z.string()),
});

export const VideosFileSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string(),
  videos: z.array(VideoSchema),
});

export type VideosFileInput = z.infer<typeof VideosFileSchema>;
