// Layout area admin terproteksi — cek session; belum login → redirect ke /admin/login.
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
