import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import styles from "./travel.module.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});

const jbMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Media Kit — Nadii Tsys",
  description:
    "Travel & Hospitality UGC Creator — Media Kit 2026. Cinematic short-form video for hotels, resorts, airlines and destination brands.",
  openGraph: {
    type: "website",
    title: "Media Kit — Nadii Tsys",
    description: "Travel & Hospitality UGC Creator — Media Kit 2026.",
    siteName: "nadiitsys.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Kit — Nadii Tsys",
    description: "Travel & Hospitality UGC Creator — Media Kit 2026.",
  },
};

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[playfair.variable, inter.variable, jbMono.variable, styles.shell].join(" ")}
    >
      {children}
    </div>
  );
}
