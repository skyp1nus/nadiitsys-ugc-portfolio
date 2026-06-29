import type { Metadata } from "next";
import HomeSplit from "./HomeSplit";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { buildAlternates } from "@/lib/i18n/seo";
import { OG_LOCALE } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadiitsys.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = getDictionary(locale).meta;
  const alternates = buildAlternates("/", locale);
  return {
    // Absolute opts out of the root layout's "%s — Nadii Tsys" template
    // (otherwise the brand would be duplicated).
    title: { absolute: m.homeTitle },
    description: m.homeDesc,
    alternates,
    openGraph: {
      type: "website",
      siteName: "nadiitsys.com",
      locale: OG_LOCALE[locale],
      url: alternates.canonical,
      title: m.homeTitle,
      description: m.homeDesc,
    },
    twitter: {
      card: "summary_large_image",
      title: m.homeTitle,
      description: m.homeDesc,
    },
  };
}

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Nadii Tsys",
  alternateName: "Nadia Tsys",
  url: SITE_URL,
  jobTitle: "UGC Content Creator",
  description:
    "Cinematic UGC creator producing short-form video and photography for hospitality and lifestyle brands.",
  knowsLanguage: ["en", "uk", "pl", "ru"],
  knowsAbout: [
    "UGC",
    "Short-form video",
    "Travel content",
    "Hospitality marketing",
    "Lifestyle content",
    "Lifestyle photography",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Warsaw",
    addressCountry: "PL",
  },
  sameAs: [
    "https://www.instagram.com/naditsys/",
    "https://www.tiktok.com/@nadii.tsys",
  ],
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#service`,
  name: "Nadiitsys",
  url: SITE_URL,
  image: `${SITE_URL}/icon.png`,
  description:
    "UGC creation studio — cinematic short-form video and photography for hospitality (hotels, resorts, airlines) and lifestyle (fashion, home, wellness) brands.",
  areaServed: "Worldwide",
  serviceType: ["UGC video", "Short-form video", "Brand storytelling"],
  provider: { "@id": `${SITE_URL}/#person` },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Warsaw",
    addressCountry: "PL",
  },
};

export default async function HomePage() {
  const { locale, dict } = await getI18n();

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Nadii Tsys — UGC Portfolio",
    inLanguage: locale,
    publisher: { "@id": `${SITE_URL}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([personLd, serviceLd, websiteLd]),
        }}
      />
      <HomeSplit dict={dict.home} locale={locale} switcherLabel={dict.switcher.label} />
    </>
  );
}
