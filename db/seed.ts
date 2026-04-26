// db/seed.ts
import travelJson from "../content/pages/travel.json" with { type: "json" };
import { writeFileSync } from "fs";

// ── Шаблон порожньої сторінки (та сама структура що Travel) ──
const emptyPage = {
  version: 1,
  updatedAt: new Date().toISOString(),
  profile: {
    creatorName: "",
    tagline: "",
    location: "",
    bio: "",
    languages: [],
    gear: "",
    delivery: "",
  },
  hotels: [],
  countries: [],
  photos: [],
  reels: [],
  contact: {
    email: "",
    instagram: "",
    instagramUrl: "",
    tiktok: "",
    tiktokUrl: "",
    youtubeReady: false,
    youtube: "",
    youtubeUrl: "",
    responseTime: "",
    bookingWindow: "",
  },
};

// ── Екранування одинарних лапок для SQL ──
const sqlEscape = (s: string) => s.replace(/'/g, "''");

const travelData = sqlEscape(JSON.stringify(travelJson));
const beautyData = sqlEscape(JSON.stringify(emptyPage));

const sql = `INSERT INTO pages (slug, data) VALUES ('travel', '${travelData}')
  ON CONFLICT(slug) DO UPDATE SET data = excluded.data;

INSERT INTO pages (slug, data) VALUES ('beauty', '${beautyData}')
  ON CONFLICT(slug) DO UPDATE SET data = excluded.data;
`;

writeFileSync("db/seed.sql", sql);
console.log("✅ Seed згенеровано: travel + beauty (заглушка)");
console.log(`   travel.json: ${travelData.length} символів`);
console.log(`   beauty empty: ${beautyData.length} символів`);
