import type { Metadata } from "next";
import Link from "next/link";

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
  return (
    <main className="max-w-5xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Nadiia Tsysaruk</h1>
      <p className="text-gray-500 text-lg mb-8">Beauty & travel content creator</p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/beauty"
          className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700"
        >
          Beauty
        </Link>
        <Link
          href="/travel"
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-50"
        >
          Travel
        </Link>
      </div>
    </main>
  );
}
