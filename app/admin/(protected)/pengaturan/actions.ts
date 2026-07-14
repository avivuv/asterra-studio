"use server";

// Server Action pengaturan toko (Controller tipis). Validasi Zod → Service → revalidate.
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { settingSchema } from "@/lib/validations/setting";
import { settingService } from "@/lib/services/settingService";

type FormResult =
  | { ok: false; errors: Record<string, string[]> }
  | { ok: true; message: string };

export async function updateSettingAction(formData: FormData): Promise<FormResult> {
  const session = await auth();
  if (!session) return { ok: false, errors: { _: ["Tidak diizinkan."] } };

  const parsed = settingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };

  await settingService.update(parsed.data);
  revalidatePath("/admin/pengaturan");
  revalidatePath("/"); // hero & checkout memakai Setting
  return { ok: true, message: "Pengaturan tersimpan." };
}
