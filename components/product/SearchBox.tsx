"use client";

// Kotak cari — update ?search di URL dengan debounce. Digabung dengan ?category.
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce 300ms: tulis ?search ke URL setelah user berhenti mengetik.
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const keyword = value.trim();
      if (keyword) params.set("search", keyword);
      else params.delete("search");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
    // Hanya bergantung pada `value`; params lain diambil terkini saat efek jalan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full max-w-xs">
      <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari produk…"
        aria-label="Cari produk"
        className="border-border bg-card focus:ring-brand w-full rounded-full border py-2 pl-9 pr-4 text-sm outline-none focus:ring-2"
      />
    </div>
  );
}
