"use server";

// Server Actions CRUD kategori (Controller tipis). Validasi Zod → Service → revalidate/redirect.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { categorySchema } from "@/lib/validations/category";
import { categoryService } from "@/lib/services/categoryService";

type FormResult = { ok: false; errors: Record<string, string[]> } | { ok: true };

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect("/admin/login");
}

export async function createCategoryAction(formData: FormData): Promise<FormResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  await categoryService.createCategory(parsed.data.name);
  revalidatePath("/admin/kategori");
  redirect("/admin/kategori");
}

export async function updateCategoryAction(id: string, formData: FormData): Promise<FormResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  await categoryService.updateCategory(id, parsed.data.name);
  revalidatePath("/admin/kategori");
  redirect("/admin/kategori");
}

// Hapus dengan aturan: kategori terpakai tak boleh dihapus (service kembalikan error).
export async function deleteCategoryAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireAdmin();
  const result = await categoryService.deleteCategory(id);
  revalidatePath("/admin/kategori");
  return result;
}
