"use client";

// Form tambah kategori — client. Submit ke Server Action; tampilkan error validasi.
import { useState } from "react";
import { Plus } from "lucide-react";
import { createCategoryAction } from "@/app/admin/(protected)/kategori/actions";

export function CategoryAddForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(formData: FormData) {
    setError(null);
    const result = await createCategoryAction(formData);
    if (result && !result.ok) setError(result.errors.name?.[0] ?? "Gagal menambah kategori.");
  }

  return (
    <div>
      <form action={handleAdd} className="flex max-w-md gap-2">
        <input
          name="name"
          placeholder="Nama kategori baru"
          required
          className="border-border bg-card focus:ring-brand flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
        />
        <button
          type="submit"
          className="bg-brand text-foreground hover:bg-brand-deep inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-colors hover:text-white"
        >
          <Plus className="size-4" /> Tambah
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
