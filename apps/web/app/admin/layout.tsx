import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";

/**
 * /admin 하위는 운영자(operator)만 접근 가능
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (!hasRole(user, "operator")) {
    redirect("/unauthorized?reason=admin_only");
  }
  return <>{children}</>;
}
