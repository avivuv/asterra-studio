# Implementasi P2-03 — Katalog grid + ProductCard

- **Tiket:** [`../tickets/P2-03-katalog-grid.md`](../tickets/P2-03-katalog-grid.md)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai

## Ringkasan
Beranda kini menampilkan katalog produk aktif: `page.tsx` (Controller tipis) → `productService.getCatalog`
→ `ProductGrid`/`ProductCard`. Ditambah 6 produk contoh ke seed untuk uji tampilan. Filter kategori &
pencarian (via query string) juga langsung berfungsi.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `app/(public)/page.tsx` | Controller: baca `searchParams` (await, Next 16) → `getCatalog` → `ProductGrid` |
| `components/product/ProductGrid.tsx` | grid responsif (2/3/4 kolom) + empty state "Belum ada produk." |
| `components/product/ProductCard.tsx` | foto utama, kategori, nama, harga (`formatIDR`), badge "Habis" |
| `lib/services/productService.ts` | export tipe `CatalogProduct` (dipakai komponen; View tak impor Prisma) |
| `prisma/seed.ts` | tambah `seedProducts` (6 produk contoh + 1 gambar placeholder each) |

## Keputusan penting
- **Controller tipis** — hanya `await searchParams` → service → render. Tidak ada Prisma/logika (RULES §1.1).
- **`searchParams` di-`await`** — di Next 16 `searchParams` adalah Promise.
- **Tipe `CatalogProduct` dari Service** (`Awaited<ReturnType<...>>[number]`) supaya komponen tidak
  mengimpor Prisma (RULES §3) tapi tetap type-safe atas relasi (images+category).
- **Gambar pakai `<img>` + placeholder `picsum.photos`** untuk sementara — menghindari whitelist domain
  `next/image` sekarang; diganti Cloudinary + `next/image` di P4-03. Ada `eslint-disable` beralasan pada baris img.
- **Badge "Habis"** sudah disertakan di kartu (produk `stock:0`); penyempurnaan tombol dll di P4-05.
- **Grid & Card Server Component** (statis, tanpa `"use client"`).

## Cara verifikasi
- `curl /` → 6 produk tampil dengan harga `Rp…`; 2 produk stok 0 menampilkan "Habis".
- `curl /?category=keychain` → hanya produk keychain.
- `curl /?search=casing` → hanya "Casing HP Bening".
- `npx tsc --noEmit`, `npm run lint`, `npm run build` → lolos. Route `/` jadi ƒ Dynamic (baca searchParams).

## Catatan / penyimpangan
- Filter/search UI (tab & kotak cari interaktif) belum ada — itu P2-04; di P2-03 filter sudah jalan
  lewat query string manual.
- Gambar placeholder eksternal; migrasi ke Cloudinary + `next/image` di P4-03.
