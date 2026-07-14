# Implementasi P5-02 — Dashboard ringkasan admin

- **Tiket:** [`../tickets/P5-02-dashboard.md`](../tickets/P5-02-dashboard.md)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Dashboard admin (`/admin`) menampilkan ringkasan: total produk, produk aktif, stok habis, jumlah
kategori — plus shortcut Tambah Produk & Pengaturan. Agregasi di `dashboardService`, count di repository.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `lib/repositories/productRepository.ts` | tambah `countAll`, `countActive`, `countOutOfStock` |
| `lib/repositories/categoryRepository.ts` | tambah `countAll` |
| `lib/services/dashboardService.ts` | `getSummary()` (Promise.all count → ringkasan) |
| `app/admin/(protected)/page.tsx` | ganti placeholder → kartu ringkasan + shortcut |

## Keputusan penting
- **Count di Repository, agregasi di Service** (RULES §1) — `dashboardService.getSummary` panggil
  beberapa `count*` via `Promise.all`, hitung `inactiveProducts = total - active` di Service.
- **Controller tipis** — halaman hanya panggil service & render kartu (Server Component).

## Cara verifikasi
- `/admin` (session) → 4 kartu (Total Produk, Produk Aktif, Stok Habis, Kategori) + shortcut.
- Angka cocok DB: total 6 / aktif 6 / stok habis 1 / kategori 3.
- `npx tsc --noEmit`, `npm run build` → lolos.

## Catatan / penyimpangan
- Ringkasan minimal (sesuai FEATURES L). Bisa ditambah grafik kelak; tidak untuk MVP.
