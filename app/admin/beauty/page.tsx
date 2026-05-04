import { loadBeautyPage } from "@/lib/content";
import { BeautyPageEditor } from "@/components/admin/BeautyPageEditor";

export const dynamic = "force-dynamic";

export default async function AdminBeautyPage() {
  const initial = await loadBeautyPage();
  return <BeautyPageEditor initial={initial} />;
}
