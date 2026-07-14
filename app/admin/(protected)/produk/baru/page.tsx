// Tambah produk (Controller). Ambil kategori → render form → Action create.
import Link from "next/link";
import { categoryService } from "@/lib/services/categoryService";
import { ProductForm } from "@/components/product/ProductForm";
import { createProductAction } from "../actions";

export default async function ProdukBaruPage() {
  const categories = await categoryService.listAll();

  return (
    <div>
      <Link href="/admin/produk" className="text-muted-foreground hover:text-foreground text-sm">
        ← Kembali
      </Link>
      <h1 className="font-heading mb-6 mt-3 text-2xl font-semibold tracking-tight">Tambah Produk</h1>
      <ProductForm categories={categories} action={createProductAction} />
    </div>
  );
}
