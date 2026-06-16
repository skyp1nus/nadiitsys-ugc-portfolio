import type { Metadata } from "next";
import { loadBeautyPage } from "@/lib/content";
import { listMedia, getSingleMedia } from "@/lib/repos/media";
import styles from "./beauty.module.css";
import { Nav } from "@/components/beauty/Nav";
import { Hero } from "@/components/beauty/Hero";
import { Marquee } from "@/components/beauty/Marquee";
import { About } from "@/components/beauty/About";
import { Brands } from "@/components/beauty/Brands";
import { Services } from "@/components/beauty/Services";
import { Videos } from "@/components/beauty/Videos";
import { Gallery } from "@/components/beauty/Gallery";
import { Contact } from "@/components/beauty/Contact";
import { Footer } from "@/components/beauty/Footer";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadiitsys.com";

export const metadata: Metadata = {
  title: "Beauty UGC — Media Kit",
  description:
    "Beauty UGC content creator media kit — cinematic short-form video and photography for skincare, cosmetics and lifestyle brands. Based in Warsaw, working worldwide.",
  alternates: { canonical: "/beauty" },
  openGraph: {
    type: "website",
    siteName: "nadiitsys.com",
    locale: "en_US",
    url: "/beauty",
    title: "Beauty UGC — Media Kit | Nadii Tsys",
    description:
      "Aesthetic beauty & lifestyle UGC for skincare, cosmetics and indie brands.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty UGC — Media Kit | Nadii Tsys",
    description:
      "Aesthetic beauty & lifestyle UGC for skincare, cosmetics and indie brands.",
  },
};

export default async function BeautyPage() {
  const [data, heroImage, aboutPhotos, photos, reels] = await Promise.all([
    loadBeautyPage(),
    getSingleMedia("beauty", "hero"),
    listMedia("beauty", "about-photo"),
    listMedia("beauty", "photo"),
    listMedia("beauty", "reel"),
  ]);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Beauty UGC Content Creation",
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: "Worldwide",
    serviceType: "Beauty UGC video and photography",
    description: data.about.lead.replace(/\*/g, ""),
    url: `${SITE_URL}/beauty`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Beauty UGC services",
      itemListElement: data.services.items.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        name: s.name.replace(/\*/g, ""),
        description: s.desc,
        ...(s.currency && /^\d+$/.test(s.price)
          ? {
              price: s.price,
              priceCurrency: s.currency === "€" ? "EUR" : "USD",
            }
          : {}),
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Beauty",
        item: `${SITE_URL}/beauty`,
      },
    ],
  };

  return (
    <div className={styles.shell} data-palette={data.paletteKey}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceLd, breadcrumbLd]),
        }}
      />
      <Nav nav={data.nav} />
      <Hero hero={data.hero} heroImage={heroImage} />
      <Marquee items={data.marquee} />
      <Videos header={data.videos} reels={reels} />
      <About about={data.about} images={aboutPhotos} />
      <Gallery header={data.gallery} photos={photos} />
      <Brands brands={data.brands} />
      <Services services={data.services} />
      <Contact contact={data.contact} />
      <Footer footer={data.footer} />
    </div>
  );
}
