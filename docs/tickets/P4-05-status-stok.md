# P4-05 — Status stok / badge "Habis"

- **Fase:** 4
- **Fitur terkait (FEATURES.md):** M
- **Prioritas:** P1
- **Dependency:** P2-03, P4-04
- **Status:** ✅ Done — lihat ../implementations/P4-fase4-admin.md

## Tujuan
Menandai produk `stock = 0` sebagai "Habis" di katalog & detail, dan menonaktifkan tombol keranjang.

## Scope
- Badge "Habis" di `ProductCard` (katalog) & halaman detail bila `stock === 0`.
- `AddToCartButton` nonaktif saat stok 0.
- (MVP) stok hanya info; tidak dikurangi otomatis (order via WA manual — FEATURES M).

## Di luar scope
- Pengurangan stok otomatis / manajemen inventori.

## Layer yang disentuh
| Layer | File |
|-------|------|
| Komponen | `ProductCard.tsx`, detail page, `AddToCartButton.tsx` |

## Langkah kerja
1. Tambah kondisi `stock === 0` → badge + tombol disabled.
2. Aturan "stok negatif tak tampil" sudah dijaga di data; komponen hanya menyajikan.

## Definition of Done
- [ ] Produk stok 0 menampilkan badge "Habis" di katalog & detail.
- [ ] Tombol tambah keranjang nonaktif saat stok 0.
- [ ] Dokumen implementasi di `docs/implementations/P4-05-status-stok.md`.
