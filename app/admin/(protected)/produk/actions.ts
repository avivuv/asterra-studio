"use server";

// Server Actions CRUD produk (Controller — tipis). Validasi Zod → Service → revalidate/redirect.
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations/product";
import { productService, DuplicateCodeError } from "@/lib/services/productService";

type ActionResult = { ok: false; errors: Record<string, string[]> } | { ok: true };

async function requireAdmin() {
  const session = await auth();
  if (!session) redirect("/admin/login");
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  try {
    await productService.createProduct(parsed.data);
  } catch (e) {
    if (e instanceof DuplicateCodeError) return { ok: false, errors: { code: [e.message] } };
    throw e;
  }
  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

export async function updateProductAction(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  try {
    await productService.updateProduct(id, parsed.data);
  } catch (e) {
    if (e instanceof DuplicateCodeError) return { ok: false, errors: { code: [e.message] } };
    throw e;
  }
  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireAdmin();
  await productService.deleteProduct(id);
  revalidatePath("/admin/produk");
}
