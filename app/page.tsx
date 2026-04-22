// This file will be removed in Step 2 when app/(public)/page.tsx takes over the "/" route.
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/beauty");
}
