import { verifySession } from "@/lib/admin/auth";
import { logoutAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/AdminShell";

/** Every signed-in admin screen shares this frame; the sign-in page does not. */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();
  return (
    <AdminShell username={session.username} expiresAt={session.exp} logoutAction={logoutAction}>
      {children}
    </AdminShell>
  );
}
