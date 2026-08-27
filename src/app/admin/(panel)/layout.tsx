import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const adminName = session?.user?.name || session?.user?.email || "Administrador";

  return <AdminShell adminName={adminName}>{children}</AdminShell>;
}
