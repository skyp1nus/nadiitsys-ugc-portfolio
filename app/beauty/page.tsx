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
export const metadata = { title: "Nadia Tsys — Media Kit" };

export default async function BeautyPage() {
  const [data, heroImage, aboutPhotos, photos, reels] = await Promise.all([
    loadBeautyPage(),
    getSingleMedia("beauty", "hero"),
    listMedia("beauty", "about-photo"),
    listMedia("beauty", "photo"),
    listMedia("beauty", "reel"),
  ]);

  return (
    <div className={styles.shell} data-palette={data.paletteKey}>
      <Nav nav={data.nav} />
      <Hero hero={data.hero} heroImage={heroImage} />
      <Marquee items={data.marquee} />
      <About about={data.about} images={aboutPhotos} />
      <Brands brands={data.brands} />
      <Services services={data.services} />
      <Videos header={data.videos} reels={reels} />
      <Gallery header={data.gallery} photos={photos} />
      <Contact contact={data.contact} />
      <Footer footer={data.footer} />
    </div>
  );
}
