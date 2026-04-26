import { redirect } from "next/navigation";

export default function AdminRootPage() {
  // Admin host strips the /admin prefix via proxy.ts; redirect to /travel
  // (resolves to /admin/travel internally on the admin host).
  redirect("/travel");
}
