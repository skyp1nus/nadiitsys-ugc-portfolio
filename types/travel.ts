export interface TravelProfile {
  creatorName: string;
  tagline: string;
  location: string;
  bio: string;
  languages: string[];
  gear: string;
  delivery: string;
}

export interface TravelHotel {
  name: string;
  stars: string;
  location: string;
}

export interface TravelContact {
  email: string;
  instagram: string;
  instagramUrl: string;
  tiktok: string;
  tiktokUrl: string;
  youtubeReady: boolean;
  youtube: string;
  youtubeUrl: string;
  responseTime: string;
  bookingWindow: string;
}

export interface TravelPage {
  version: 1;
  updatedAt: string;
  profile: TravelProfile;
  hotels: TravelHotel[];
  countries: string[];
  contact: TravelContact;
}
