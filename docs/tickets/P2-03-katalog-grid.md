# P2-03 — Katalog grid + ProductCard

- **Fase:** 2
- **Fitur terkait (FEATURES.md):** A
- **Prioritas:** P0
- **Dependency:** P2-02, P1-05
- **Status:** ✅ Done — lihat [`../implementations/P2-03-katalog-grid.md`](../implementations/P2-03-katalog-grid.md)

## Tujuan
Menampilkan katalog produk aktif sebagai grid kartu di beranda.

## Scope
- Controller `app/(public)/page.tsx` (Server Component) — baca `searchParams`, panggil
  `productService.getCatalog`, render `ProductGrid`.
- `components/product/ProductGrid.tsx` — grid responsif (2 kolom HP, 3–4 desktop) + empty state
  "Belum ada produk.".
- `components/product/ProductCard.tsx` — foto utama (`images[0]`), nama, harga (`formatIDR`),
  badge kategori.

## Di luar scope
- Filter/search UI (P2-04), badge "Habis" (P4-05), detail (P2-05).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Controller | `app/(public)/page.tsx` |
| Komponen | `components/product/ProductGrid.tsx`, `ProductCard.tsx` |

## Langkah kerja
1. Controller tipis (baca input → service → render), tanpa query Prisma.
2. Grid & Card **Server Component** (statis).
3. Harga selalu via `formatIDR`; foto utama = `images` order 0.

## Definition of Done
- [ ] Beranda menampilkan produk aktif (urut terbaru).
- [ ] Empty state muncul saat kosong.
- [ ] Controller tipis; tidak ada logika/Prisma di `page.tsx`.
- [ ] `formatIDR` dipakai (tidak ada format harga manual).
- [ ] Dokumen implementasi di `docs/implementations/P2-03-katalog-grid.md`.
