import type { Metadata } from "next";
import { loadBeautyPage } from "@/lib/content";
import { listMedia, getSingleMedia } from "@/lib/repos/media";
import { getI18n, getLocale } from "@/lib/i18n/server";
import { buildAlternates } from "@/lib/i18n/seo";
import { OG_LOCALE } from "@/lib/i18n/config";
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const alternates = buildAlternates("/lifestyle", locale);
  return {
    title: "Lifestyle UGC — Media Kit",
    description:
      "Lifestyle UGC content creator media kit — cinematic short-form video and photography for lifestyle, fashion and home brands. Based in Warsaw, working worldwide.",
    alternates,
    openGraph: {
      type: "website",
      siteName: "nadiitsys.com",
      locale: OG_LOCALE[locale],
      url: alternates.canonical,
      title: "Lifestyle UGC — Media Kit | Nadii Tsys",
      description: "Aesthetic lifestyle UGC for fashion, home and indie brands.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Lifestyle UGC — Media Kit | Nadii Tsys",
      description: "Aesthetic lifestyle UGC for fashion, home and indie brands.",
    },
  };
}

export default async function LifestylePage() {
  const { locale, dict } = await getI18n();
  const [data, heroImage, aboutPhotos, photos, reels] = await Promise.all([
    loadBeautyPage(locale),
    getSingleMedia("beauty", "hero"),
    listMedia("beauty", "about-photo"),
    listMedia("beauty", "photo"),
    listMedia("beauty", "reel"),
  ]);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Lifestyle UGC Content Creation",
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: "Worldwide",
    serviceType: "Lifestyle UGC video and photography",
    description: data.about.lead.replace(/\*/g, ""),
    url: `${SITE_URL}/lifestyle`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Lifestyle UGC services",
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
        name: "Lifestyle",
        item: `${SITE_URL}/lifestyle`,
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
      <Nav nav={data.nav} locale={locale} switcherLabel={dict.switcher.label} />
      <Hero hero={data.hero} heroImage={heroImage} />
      <Marquee items={data.marquee} />
      <About about={data.about} images={aboutPhotos} />
      <Videos header={data.videos} reels={reels} />
      <Gallery header={data.gallery} photos={photos} />
      <Brands brands={data.brands} />
      <Services services={data.services} priceFrom={dict.lifestyle.priceFrom} />
      <Contact contact={data.contact} />
      <Footer footer={data.footer} />
    </div>
  );
}
