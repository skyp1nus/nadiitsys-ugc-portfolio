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
  // x-pathname is set by proxy.ts to the rewritten internal path (e.g., /admin/login).
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";

  if (!pathname.startsWith("/admin/login")) {
    const ok = await getSession();
    // Redirect to the user-facing path (admin host strips the /admin prefix).
    if (!ok) redirect("/login");
  }

  return <>{children}</>;
}
