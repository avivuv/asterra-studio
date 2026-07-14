// Skema validasi produk (Zod) — dipakai bersama form (client) & Server Action (server). RULES §5.
import { z } from "zod";

// Harga promo (originalPrice) opsional. Field kosong "" → undefined (tak promo).
const optionalPrice = z.preprocess(
  (val) => (val === "" || val === undefined || val === null ? undefined : val),
  z.coerce.number().int().positive().optional(),
);

export const productSchema = z
  .object({
    // Kode produk (SKU) unik & wajib. Diseragamkan uppercase & tanpa spasi tepi.
    code: z
      .string()
      .trim()
      .min(1, "Kode produk wajib diisi")
      .transform((v) => v.toUpperCase()),
    name: z.string().min(1, "Nama wajib diisi"),
    // Harga normal (tetap). Saat promo, harga ini yang dicoret.
    price: z.coerce.number().int().positive("Harga harus lebih dari 0"),
    // Harga promo (opsional) — bila diisi, produk sedang diskon dan harga inilah yang dijual.
    promoPrice: optionalPrice,
    stock: z.coerce.number().int().min(0, "Stok tidak boleh negatif"),
    categoryId: z.string().min(1, "Kategori wajib dipilih"),
    description: z.string().optional(),
    isActive: z.coerce.boolean().optional().default(true),
    isFeatured: z.coerce.boolean().optional().default(false),
    // Galeri gambar hasil upload Cloudinary (dari ImageUploader) — dikirim sebagai JSON string.
    images: z.preprocess(
      (val) => {
        if (typeof val !== "string" || val.trim() === "") return [];
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      },
      z.array(z.object({ url: z.string().url(), publicId: z.string() })).default([]),
    ),
  })
  // Aturan promo: harga promo harus lebih kecil dari harga normal.
  .refine((data) => data.promoPrice === undefined || data.promoPrice < data.price, {
    message: "Harga promo harus lebih kecil dari harga normal",
    path: ["promoPrice"],
  });

export type ProductInput = z.infer<typeof productSchema>;
