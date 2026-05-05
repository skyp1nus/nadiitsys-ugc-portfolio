import { loadTravelPage } from "@/lib/content";
import { listMedia, getSingleMedia } from "@/lib/repos/media";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadiitsys.com";

export default async function TravelPage() {
  const [data, photos, reels, heroImage, aboutVideo] = await Promise.all([
    loadTravelPage(),
    listMedia("travel", "photo"),
    listMedia("travel", "reel"),
    getSingleMedia("travel", "hero"),
    getSingleMedia("travel", "about-video"),
  ]);
  const { profile, hotels, countries, contact } = data;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Travel & Hospitality UGC Content Creation",
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: countries.length
      ? countries.map((c) => ({ "@type": "Country", name: c }))
      : "Worldwide",
    serviceType: "Travel UGC video and photography",
    description: profile.bio,
    url: `${SITE_URL}/travel`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Travel",
        item: `${SITE_URL}/travel`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceLd, breadcrumbLd]),
        }}
      />
      <Nav />
      <Hero
        name={profile.creatorName}
        tagline={profile.tagline}
        location={profile.location}
        heroImage={heroImage}
      />
      <Marquee />
      <Stills photos={photos} />
      <About
        bio={profile.bio}
        languages={profile.languages}
        gear={profile.gear}
        delivery={profile.delivery}
        aboutVideo={aboutVideo}
      />
      <Offer />
      <Collabs hotels={hotels} />
      <Reels reels={reels} />
      <TravelMap countries={countries} />
      <Contact name={profile.creatorName} contact={contact} />
    </>
  );
}
