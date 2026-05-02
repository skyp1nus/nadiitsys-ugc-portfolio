import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadiitsys.com";
const IS_PRODUCTION_DOMAIN = SITE_URL === "https://nadiitsys.com";

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DOMAIN) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
