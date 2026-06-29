import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_HREFLANG, localizedPath } from "@/lib/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadiitsys.com";

const PAGES: {
  path: string;
  changeFrequency: "monthly" | "weekly";
  priority: number;
}[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/travel", changeFrequency: "weekly", priority: 0.8 },
  { path: "/lifestyle", changeFrequency: "weekly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(({ path, changeFrequency, priority }) => {
    const languages: Record<string, string> = {};
    for (const l of LOCALES) {
      languages[LOCALE_HREFLANG[l]] = `${SITE_URL}${localizedPath(path, l)}`;
    }
    languages["x-default"] = `${SITE_URL}${localizedPath(path, "en")}`;
    return {
      url: `${SITE_URL}${localizedPath(path, "en")}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    };
  });
}
