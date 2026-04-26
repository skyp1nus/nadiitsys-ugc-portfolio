import { loadTravelPage } from "@/lib/content";
import { TravelEditor } from "@/components/admin/travel/TravelEditor";

export default function AdminTravelPage() {
  const data = loadTravelPage();
  return <TravelEditor initial={data} />;
}
