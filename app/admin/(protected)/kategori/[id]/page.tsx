// Edit kategori (Controller). Ambil kategori → form → Action update (bind id).
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryService } from "@/lib/services/categoryService";
import { updateCategoryAction } from "../actions";
import { CategoryEditForm } from "@/components/category/CategoryEditForm";

export default async function KategoriEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await categoryService.getById(id);
  if (!category) notFound();

  const updateWithId = updateCategoryAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/kategori" className="text-muted-foreground hover:text-foreground text-sm">
        ← Kembali
      </Link>
      <h1 className="font-heading mb-6 mt-3 text-2xl font-semibold tracking-tight">Edit Kategori</h1>
      <CategoryEditForm defaultName={category.name} action={updateWithId} />
    </div>
  );
}
