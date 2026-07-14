"use client";

// Tab kategori — update ?category di URL. Kategori aktif ditandai. Digabung dengan ?search.
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
  { label: "Semua", slug: "" },
  { label: "Aksesoris HP", slug: "phone-accessory" },
  { label: "Gantungan Kunci", slug: "keychain" },
  { label: "Gantungan Tas", slug: "bag-charm" },
];

export function CategoryTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";

  function selectCategory(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = active === category.slug;
        return (
          <button
            key={category.slug || "all"}
            type="button"
            onClick={() => selectCategory(category.slug)}
            aria-pressed={isActive}
            className={
              isActive
                ? "bg-brand text-foreground rounded-full px-4 py-1.5 text-sm font-bold"
                : "bg-muted text-muted-foreground hover:text-foreground rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
            }
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
