// List/kelola kategori (Controller). Form tambah + DataTable. Tipis: service → map → render.
import { categoryService } from "@/lib/services/categoryService";
import { CategoryAddForm } from "@/components/category/CategoryAddForm";
import { CategoryTable, type CategoryRow } from "@/components/category/CategoryTable";

export default async function AdminKategoriPage() {
  const categories = await categoryService.listAll();
  const rows: CategoryRow[] = categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Kategori</h1>
      <CategoryAddForm />
      <CategoryTable data={rows} />
    </div>
  );
}
