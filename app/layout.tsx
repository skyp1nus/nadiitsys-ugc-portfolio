import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadiitsys.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nadii Tsys — Travel & Lifestyle UGC Creator",
    template: "%s — Nadii Tsys",
  },
  description:
    "Cinematic UGC content for hospitality and lifestyle brands. Based in Warsaw, working worldwide.",
  applicationName: "Nadiitsys",
  authors: [{ name: "Nadii Tsys", url: SITE_URL }],
  creator: "Nadii Tsys",
  publisher: "Nadii Tsys",
  keywords: [
    "UGC creator",
    "travel content creator",
    "lifestyle content creator",
    "home & lifestyle creator",
    "hospitality video",
    "short-form video",
    "Instagram Reels",
    "TikTok creator",
    "Warsaw",
    "Poland",
    "hotel UGC",
    "lifestyle UGC",
  ],
  category: "creative services",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "nadiitsys.com",
    locale: "en_US",
    url: SITE_URL,
    title: "Nadii Tsys — Travel & Lifestyle UGC Creator",
    description:
      "Cinematic UGC content for hospitality and lifestyle brands. Based in Warsaw, working worldwide.",
    // TODO: add og-default.jpg (1200×630) → images: ["/og-default.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Nadii Tsys — Travel & Lifestyle UGC Creator",
    description: "Cinematic UGC content for hospitality and lifestyle brands.",
    creator: "@naditsys",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${cormorant.variable} ${inter.variable} ${jbMono.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
