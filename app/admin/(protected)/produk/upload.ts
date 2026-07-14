"use server";

// Server Action upload gambar produk → Cloudinary via imageService. Dipakai ImageUploader (client).
import { auth } from "@/lib/auth";
import { imageService } from "@/lib/services/imageService";

export async function uploadImageAction(
  formData: FormData,
): Promise<{ ok: true; url: string; publicId: string } | { ok: false; error: string }> {
  const session = await auth();
  if (!session) return { ok: false, error: "Tidak diizinkan." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Pilih file gambar dulu." };
  }

  try {
    const { url, publicId } = await imageService.upload(file);
    return { ok: true, url, publicId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Upload gagal." };
  }
}
