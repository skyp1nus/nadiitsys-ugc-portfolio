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

// Page-level metadata (title, per-locale canonical + hreflang) lives in
// app/travel/page.tsx via generateMetadata, so it can read the request locale.

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[playfair.variable, inter.variable, jbMono.variable, styles.shell].join(" ")}
    >
      {children}
    </div>
  );
}
