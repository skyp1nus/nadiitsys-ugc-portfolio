import { getByCategory } from "@/lib/content";
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

const CREATOR = "Nadii Tsys";
const TAGLINE = "Travel & Hospitality UGC Creator";
const LOCATION = "Based in Warszawa · Available Worldwide";

export default function TravelPage() {
  const videos = getByCategory("travel");
  return (
    <>
      <Nav />
      <Hero name={CREATOR} tagline={TAGLINE} location={LOCATION} />
      <Marquee />
      <Stills />
      <About />
      <Offer />
      <Collabs />
      <Reels videos={videos} />
      <TravelMap />
      <Contact name={CREATOR} />
    </>
  );
}
