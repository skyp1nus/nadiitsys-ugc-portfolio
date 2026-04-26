import type { TravelPageInput as TravelPage } from "@/lib/schemas/travel-page";
import { getPage } from "@/lib/repos/pages";

export async function loadTravelPage(): Promise<TravelPage> {
  const page = await getPage("travel");
  if (!page) throw new Error("Travel page not seeded in D1");
  return page;
}

export async function loadBeautyPage(): Promise<TravelPage> {
  const page = await getPage("beauty");
  if (!page) throw new Error("Beauty page not seeded in D1");
  return page;
}
