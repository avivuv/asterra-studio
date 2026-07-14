"use client";

// Sidebar admin — navigasi + logout. Client (active state + signOut).
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Tags, Settings, LogOut } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-card flex w-56 shrink-0 flex-col border-r p-4">
      <Link href="/admin" className="font-heading mb-6 px-2 text-lg font-semibold">
        Asterra Admin
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-brand text-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="text-muted-foreground hover:bg-muted flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
      >
        <LogOut className="size-4" />
        Keluar
      </button>
    </aside>
  );
}
