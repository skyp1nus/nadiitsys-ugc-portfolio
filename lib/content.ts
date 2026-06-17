import type { TravelPageInput as TravelPage } from "@/lib/schemas/travel-page";
import type { BeautyPageInput as BeautyPage } from "@/lib/schemas/beauty-page";
import { getTravelPage, getBeautyPage } from "@/lib/repos/pages";
import { mockEnabled, mockTravelPage, mockBeautyPage } from "@/lib/dev-fixtures";

export async function loadTravelPage(): Promise<TravelPage> {
  if (mockEnabled()) return mockTravelPage;
  const page = await getTravelPage();
  if (!page) throw new Error("Travel page not seeded in D1");
  return page;
}

export async function loadBeautyPage(): Promise<BeautyPage> {
  if (mockEnabled()) return mockBeautyPage;
  const page = await getBeautyPage();
  if (!page) throw new Error("Beauty page not seeded in D1");
  return page;
}
