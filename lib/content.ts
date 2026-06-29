import type { TravelPageInput as TravelPage } from "@/lib/schemas/travel-page";
import type { BeautyPageInput as BeautyPage } from "@/lib/schemas/beauty-page";
import { getTravelPage, getBeautyPage } from "@/lib/repos/pages";
import { mockEnabled, mockTravelPage, mockBeautyPage } from "@/lib/dev-fixtures";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

export async function loadTravelPage(
  locale: Locale = DEFAULT_LOCALE
): Promise<TravelPage> {
  if (mockEnabled()) return mockTravelPage;
  const page = await getTravelPage(locale);
  if (!page) throw new Error("Travel page not seeded in D1");
  return page;
}

export async function loadBeautyPage(
  locale: Locale = DEFAULT_LOCALE
): Promise<BeautyPage> {
  if (mockEnabled()) return mockBeautyPage;
  const page = await getBeautyPage(locale);
  if (!page) throw new Error("Beauty page not seeded in D1");
  return page;
}
