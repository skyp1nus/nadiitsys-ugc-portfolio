import { loadTravelPage } from "@/lib/content";
import { PageEditor } from "@/components/admin/PageEditor";

export const dynamic = "force-dynamic";

export default async function AdminTravelPage() {
  const initial = await loadTravelPage();
  return <PageEditor slug="travel" initial={initial} />;
}
