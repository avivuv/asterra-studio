// Edit produk (Controller). Ambil produk + kategori → form → Action update (bind id).
import Link from "next/link";
import { notFound } from "next/navigation";
import { productService } from "@/lib/services/productService";
import { categoryService } from "@/lib/services/categoryService";
import { ProductForm } from "@/components/product/ProductForm";
import { updateProductAction } from "../actions";

export default async function ProdukEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    productService.getById(id),
    categoryService.listAll(),
  ]);
  if (!product) notFound();

  const updateWithId = updateProductAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/produk" className="text-muted-foreground hover:text-foreground text-sm">
        ← Kembali
      </Link>
      <h1 className="font-heading mb-6 mt-3 text-2xl font-semibold tracking-tight">Edit Produk</h1>
      <ProductForm categories={categories} product={product} action={updateWithId} />
    </div>
  );
}
