// Dashboard admin (Controller). Ringkasan via dashboardService + shortcut.
import Link from "next/link";
import { Package, PackageCheck, PackageX, Tags, Plus, Settings } from "lucide-react";
import { dashboardService } from "@/lib/services/dashboardService";

export default async function AdminDashboardPage() {
  const summary = await dashboardService.getSummary();

  const stats = [
    { label: "Total Produk", value: summary.totalProducts, icon: Package },
    { label: "Produk Aktif", value: summary.activeProducts, icon: PackageCheck },
    { label: "Stok Habis", value: summary.outOfStock, icon: PackageX },
    { label: "Kategori", value: summary.categories, icon: Tags },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground mt-1 text-sm">Ringkasan toko Asterra Studio.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl border p-5">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Icon className="size-4" />
              {label}
            </div>
            <p className="mt-2 text-3xl font-extrabold tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/produk/baru"
          className="bg-brand text-foreground hover:bg-brand-deep inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors hover:text-white"
        >
          <Plus className="size-4" /> Tambah Produk
        </Link>
        <Link
          href="/admin/pengaturan"
          className="hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors"
        >
          <Settings className="size-4" /> Pengaturan
        </Link>
      </div>
    </div>
  );
}
