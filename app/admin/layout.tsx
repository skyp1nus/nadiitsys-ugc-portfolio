import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login route has its own layout (app/admin/login/layout.tsx) without a guard,
  // but Next.js still renders this parent layout. We skip the check for the login path.
  const hdrs = await headers();
  const pathname = hdrs.get("x-invoke-path") ?? hdrs.get("x-pathname") ?? "";

  if (!pathname.startsWith("/admin/login")) {
    const ok = await getSession();
    if (!ok) redirect("/admin/login");
  }

  return <>{children}</>;
}
