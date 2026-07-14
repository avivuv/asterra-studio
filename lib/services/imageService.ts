// Service gambar — SATU-SATUNYA tempat yang tahu penyedia storage (Cloudinary). FEATURES I.
// Repository & komponen hanya pegang url/publicId. Ganti penyedia = ubah file ini saja.
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi lazy — dipanggil tiap operasi agar env pasti sudah termuat (aman di semua runtime).
function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const FOLDER = "asterra";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export type UploadedImage = { url: string; publicId: string };

export const imageService = {
  // Upload dari File (Web API). Kembalikan url publik + publicId (untuk hapus).
  async upload(file: File): Promise<UploadedImage> {
    if (!ALLOWED.includes(file.type)) {
      throw new Error("Format gambar harus JPG, PNG, atau WEBP.");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Ukuran gambar maksimal 5 MB.");
    }

    configure();
    const bytes = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: FOLDER, resource_type: "image" }, (error, res) => {
            if (error || !res) return reject(error ?? new Error("Upload gagal."));
            resolve(res);
          })
          .end(bytes);
      },
    );

    return { url: result.secure_url, publicId: result.public_id };
  },

  // Hapus objek di storage. publicId kosong (URL manual lama) diabaikan.
  async delete(publicId: string): Promise<void> {
    if (!publicId) return;
    configure();
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  },
};
