import type { Metadata } from "next";
import { loadTravelPage } from "@/lib/content";
import { listMedia, getSingleMedia } from "@/lib/repos/media";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildAlternates } from "@/lib/i18n/seo";
import { OG_LOCALE } from "@/lib/i18n/config";
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = getDictionary(locale).meta;
  const alternates = buildAlternates("/travel", locale);
  return {
    title: m.travelTitle,
    description: m.travelDesc,
    alternates,
    openGraph: {
      type: "website",
      siteName: "nadiitsys.com",
      locale: OG_LOCALE[locale],
      url: alternates.canonical,
      title: `${m.travelTitle} — Nadii Tsys`,
      description: m.travelDesc,
    },
    twitter: {
      card: "summary_large_image",
      title: `${m.travelTitle} — Nadii Tsys`,
      description: m.travelDesc,
    },
  };
}

export default async function TravelPage() {
  const { locale, dict } = await getI18n();
  const [data, photos, reels, heroImage, aboutVideo] = await Promise.all([
    loadTravelPage(locale),
    listMedia("travel", "photo"),
    listMedia("travel", "reel"),
    getSingleMedia("travel", "hero"),
    getSingleMedia("travel", "about-video"),
  ]);
  const { profile, hotels, countries, contact } = data;
  const t = dict.travel;

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
      <Nav t={t.nav} locale={locale} switcherLabel={dict.switcher.label} />
      <Hero
        t={t.hero}
        name={profile.creatorName}
        tagline={profile.tagline}
        location={profile.location}
        heroImage={heroImage}
      />
      <Marquee items={t.marquee} />
      <About
        t={t.about}
        bio={profile.bio}
        languages={profile.languages}
        gear={profile.gear}
        delivery={profile.delivery}
        aboutVideo={aboutVideo}
      />
      <Stills t={t.stills} photos={photos} />
      <Reels t={t.reels} reels={reels} />
      <Offer t={t.offer} />
      <Collabs t={t.collabs} hotels={hotels} />
      <TravelMap t={t.map} countries={countries} />
      <Contact t={t.contact} name={profile.creatorName} contact={contact} />
    </>
  );
}
