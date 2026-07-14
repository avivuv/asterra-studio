# Implementasi P5-01 — Pengaturan toko

- **Tiket:** [`../tickets/P5-01-pengaturan-toko.md`](../tickets/P5-01-pengaturan-toko.md)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Halaman `/admin/pengaturan` untuk mengatur nama toko, nomor WhatsApp, dan template pesan checkout.
Disimpan sebagai singleton (`id="default"`) via upsert. Nomor WA & template langsung dipakai hero &
checkout.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `lib/repositories/settingRepository.ts` | tambah `upsert` (singleton) |
| `lib/services/settingService.ts` | `get()`, `update(input)` |
| `lib/validations/setting.ts` | Zod: storeName, waNumber (regex internasional), messageTemplate |
| `app/admin/(protected)/pengaturan/{page,actions}.tsx` | Controller + Server Action |
| `components/setting/SettingForm.tsx` | form (client) dengan error/sukses |

## Keputusan penting
- **Singleton via upsert** (`id:"default"`) — selalu satu baris (DATABASE §2.5).
- **Validasi `waNumber`** regex `^[1-9]\d{7,14}$` — internasional tanpa `+`/`0` depan (mis. 628xxx).
- **Controller tipis** — action `safeParse` → `settingService.update` → `revalidatePath("/admin/pengaturan")`
  **dan `revalidatePath("/")`** agar hero/katalog memakai nomor WA baru.
- **Form feedback inline** — sukses tampil "Pengaturan tersimpan."; error per-field dari Zod.

## Cara verifikasi
- `/admin/pengaturan` (session) → form terisi (storeName, waNumber `628…`, template).
- Ubah `Setting.waNumber` → beranda hero langsung memakai `wa.me/<nomor baru>` (Setting live).
- `npx tsc --noEmit`, `npm run build` → lolos.

## Catatan / penyimpangan
- Nomor WA seed masih `628123456789` (placeholder) — admin ganti ke nomor asli lewat halaman ini.
