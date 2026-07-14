// List produk admin (Controller). DataTable (search/sort/paging). Tipis: service → map → render.
import Link from "next/link";
import { productService } from "@/lib/services/productService";
import { ProductTable, type ProductRow } from "@/components/product/ProductTable";

export default async function AdminProdukPage() {
  const products = await productService.listAll();
  const rows: ProductRow[] = products.map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    category: p.category.name,
    price: p.price,
    stock: p.stock,
    isActive: p.isActive,
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Produk</h1>
        <Link
          href="/admin/produk/baru"
          className="bg-brand text-foreground hover:bg-brand-deep rounded-lg px-4 py-2 text-sm font-bold transition-colors hover:text-white"
        >
          + Tambah Produk
        </Link>
      </div>
      <ProductTable data={rows} />
    </div>
  );
}
