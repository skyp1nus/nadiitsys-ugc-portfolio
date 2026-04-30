import type { Metadata } from "next";
import HomeSplit from "./HomeSplit";

export const metadata: Metadata = {
  title: "Nadii Tsys — Travel & Beauty UGC Creator",
  description:
    "Cinematic UGC content for hospitality and beauty brands. Based in Warsaw, working worldwide.",
  openGraph: {
    type: "website",
    title: "Nadii Tsys — Travel & Beauty UGC Creator",
    description: "Cinematic UGC content for hospitality and beauty brands.",
    siteName: "nadiitsys.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadii Tsys — Travel & Beauty UGC Creator",
    description: "Cinematic UGC content for hospitality and beauty brands.",
  },
};

export default function HomePage() {
  return <HomeSplit />;
}
