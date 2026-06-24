import type { Metadata } from "next";
import HomeSplit from "./HomeSplit";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadiitsys.com";

export const metadata: Metadata = {
  title: "Nadii Tsys — Travel & Lifestyle UGC Creator",
  description:
    "Cinematic UGC content for hospitality and lifestyle brands. Based in Warsaw, working worldwide.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "nadiitsys.com",
    locale: "en_US",
    url: "/",
    title: "Nadii Tsys — Travel & Lifestyle UGC Creator",
    description: "Cinematic UGC content for hospitality and lifestyle brands.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadii Tsys — Travel & Lifestyle UGC Creator",
    description: "Cinematic UGC content for hospitality and lifestyle brands.",
  },
};

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

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Nadii Tsys — UGC Portfolio",
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#person` },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([personLd, serviceLd, websiteLd]),
        }}
      />
      <HomeSplit />
    </>
  );
}
