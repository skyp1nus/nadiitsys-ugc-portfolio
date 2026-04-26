import { loadTravelPage } from "@/lib/content";
import { Nav } from "@/components/travel/Nav";
import { Hero } from "@/components/travel/Hero";
import { Marquee } from "@/components/travel/Marquee";
import { Stills } from "@/components/travel/Stills";
import { About } from "@/components/travel/About";
import { Offer } from "@/components/travel/Offer";
import { Collabs } from "@/components/travel/Collabs";
import { Reels } from "@/components/travel/Reels";
import { TravelMap } from "@/components/travel/TravelMap";
import { Contact } from "@/components/travel/Contact";

export const dynamic = "force-dynamic";

export default async function TravelPage() {
  const data = await loadTravelPage();
  const { profile, hotels, countries, photos, reels, contact } = data;
  return (
    <>
      <Nav />
      <Hero
        name={profile.creatorName}
        tagline={profile.tagline}
        location={profile.location}
      />
      <Marquee />
      <Stills photos={photos} />
      <About
        bio={profile.bio}
        languages={profile.languages}
        gear={profile.gear}
        delivery={profile.delivery}
      />
      <Offer />
      <Collabs hotels={hotels} />
      <Reels reels={reels} />
      <TravelMap countries={countries} />
      <Contact name={profile.creatorName} contact={contact} />
    </>
  );
}
