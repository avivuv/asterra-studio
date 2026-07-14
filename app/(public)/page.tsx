// Beranda katalog (Controller — Server Component). Tipis: baca input → service → render.
import { productService } from "@/lib/services/productService";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryTabs } from "@/components/product/CategoryTabs";
import { SearchBox } from "@/components/product/SearchBox";
import { Hero } from "@/components/layout/Hero";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  // Section promo & unggulan selalu tampil (tak bergantung filter/cari) agar tidak "hilang".
  const [products, featured, promo] = await Promise.all([
    productService.getCatalog({ category, search }),
    productService.getFeatured(),
    productService.getPromo(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 md:px-6">
      <Hero />

      {promo.length > 0 && (
        <section>
          <h2 className="font-heading mb-4 text-2xl font-semibold tracking-tight">Lagi Promo 🔥</h2>
          <ProductGrid products={promo} />
        </section>
      )}

      {featured.length > 0 && (
        <section>
          <h2 className="font-heading mb-4 text-2xl font-semibold tracking-tight">Produk Pilihan ✨</h2>
          <ProductGrid products={featured} />
        </section>
      )}

      <div id="katalog" className="scroll-mt-20">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">Katalog Produk</h2>
          <SearchBox />
        </div>
        <div className="mb-6">
          <CategoryTabs />
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
