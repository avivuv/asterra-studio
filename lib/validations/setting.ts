// Skema validasi Setting (Zod) — dipakai form & Server Action.
import { z } from "zod";

export const settingSchema = z.object({
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  // Nomor WA internasional tanpa "+"/"0" depan (mis. 628123456789).
  waNumber: z
    .string()
    .regex(/^[1-9]\d{7,14}$/, "Nomor WA harus format internasional tanpa + atau 0 (mis. 628xxx)"),
  messageTemplate: z.string().min(1, "Template pesan wajib diisi"),
});

export type SettingInput = z.infer<typeof settingSchema>;
