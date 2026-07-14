# P5-02 — Dashboard ringkasan admin

- **Fase:** 5
- **Fitur terkait (FEATURES.md):** L
- **Prioritas:** P1
- **Dependency:** P4-04
- **Status:** ✅ Done — lihat ../implementations/P5-02-dashboard.md

## Tujuan
Halaman awal admin menampilkan ringkasan cepat + shortcut aksi utama.

## Scope
- `lib/services/dashboardService.ts` — `getSummary()` (jumlah produk aktif/nonaktif, jumlah kategori,
  produk stok habis) memanggil beberapa repository `count`.
- Method `count` di repository terkait bila belum ada.
- Controller `app/admin/page.tsx` — render kartu ringkasan + shortcut (tambah produk, pengaturan).

## Di luar scope
- Grafik/analitik lanjutan.

## Layer yang disentuh
| Layer | File |
|-------|------|
| Service | `lib/services/dashboardService.ts` |
| Repository | `productRepository`, `categoryRepository` (count) |
| Controller | `app/admin/page.tsx` |

## Langkah kerja
1. Repository sediakan `count` (murni query).
2. `dashboardService.getSummary` gabungkan angka (logika di Service).
3. Controller tipis render kartu.

## Definition of Done
- [ ] Dashboard menampilkan angka ringkasan benar.
- [ ] Count query di repository; agregasi di service.
- [ ] Dokumen implementasi di `docs/implementations/P5-02-dashboard.md`.
