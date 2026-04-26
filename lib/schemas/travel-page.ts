import { z } from "zod";

export const TravelProfileSchema = z.object({
  creatorName: z.string(),
  tagline: z.string(),
  location: z.string(),
  bio: z.string(),
  languages: z.array(z.string()),
  gear: z.string(),
  delivery: z.string(),
});

export const TravelHotelSchema = z.object({
  name: z.string(),
  stars: z.string(),
  location: z.string(),
});

export const TravelPhotoSchema = z.object({
  url: z.string(),
  caption: z.string(),
  link: z.string(),
});

export const TravelReelSchema = z.object({
  url: z.string(),
  title: z.string(),
  location: z.string(),
  views: z.string(),
  posterUrl: z.string().optional(),
});

export const TravelContactSchema = z.object({
  email: z.string(),
  instagram: z.string(),
  instagramUrl: z.string(),
  tiktok: z.string(),
  tiktokUrl: z.string(),
  youtubeReady: z.boolean(),
  youtube: z.string(),
  youtubeUrl: z.string(),
  responseTime: z.string(),
  bookingWindow: z.string(),
});

export const TravelPageSchema = z.object({
  version: z.literal(1),
  updatedAt: z.string(),
  profile: TravelProfileSchema,
  hotels: z.array(TravelHotelSchema),
  countries: z.array(z.string()),
  photos: z.array(TravelPhotoSchema),
  reels: z.array(TravelReelSchema),
  contact: TravelContactSchema,
});

export type TravelPageInput = z.infer<typeof TravelPageSchema>;
