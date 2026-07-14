// Header publik — Server Component. ThemeSwitcher (client) & slot keranjang di kanan.
// Pemilihan kategori dilakukan lewat CategoryTabs di atas grid, bukan di header (hindari duplikasi).
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { CartButton } from "@/components/cart/CartButton";

// Navigasi umum (bukan kategori). Kontak WA disempurnakan saat Setting siap (P3-04/P5-01).
const navLinks = [
  { label: "Katalog", href: "/#katalog" },
  { label: "Kontak", href: "/#kontak" },
];

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
          Asterra Studio
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
