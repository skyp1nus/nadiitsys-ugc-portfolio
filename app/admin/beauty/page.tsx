import { loadBeautyPage } from "@/lib/content";
import { PageEditor } from "@/components/admin/PageEditor";

export const dynamic = "force-dynamic";

export default async function AdminBeautyPage() {
  const initial = await loadBeautyPage();
  return <PageEditor slug="beauty" initial={initial} />;
}
