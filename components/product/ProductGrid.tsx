// Grid katalog produk — Server Component. Responsif: 2 kolom HP, 3–4 desktop.
import type { CatalogProduct } from "@/lib/services/productService";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) {
    return <p className="text-muted-foreground py-12 text-center">Belum ada produk.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
