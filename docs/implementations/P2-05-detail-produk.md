# Implementasi P2-05 — Halaman detail produk

- **Tiket:** [`../tickets/P2-05-detail-produk.md`](../tickets/P2-05-detail-produk.md)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Halaman `/produk/[slug]` dibuat: Controller tipis memanggil `productService.getDetail` dan `notFound()`
bila null. Menampilkan galeri (ganti foto), kategori, nama, harga, stok, deskripsi, dan tombol aksi
(placeholder untuk Fase 3). Aturan "produk nonaktif = 404" terverifikasi.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `app/(public)/produk/[slug]/page.tsx` | Controller: `await params` → `getDetail` → `notFound()`/render |
| `components/product/ProductGallery.tsx` | Client: foto utama + thumbnail, klik ganti foto |
| `lib/services/productService.ts` | export tipe `ProductDetail` (non-null, untuk View) |

## Keputusan penting
- **Controller tipis** — hanya `await params`, panggil service, `notFound()` bila null; tak ada Prisma/logika.
- **`params` di-`await`** (Next 16: params adalah Promise).
- **404 untuk nonaktif** ditegakkan di Service (`getDetail` → null bila `!isActive`), Controller ubah ke
  `notFound()`. Diuji: set produk `isActive=0` → halamannya 404 & hilang dari katalog; dikembalikan → 200.
- **ProductGallery satu-satunya bagian client** (butuh `useState` ganti foto); sisanya Server Component.
- **Tombol aksi placeholder** — "+ Tambah ke keranjang" & "Pesan via WhatsApp" masih `<button>` non-fungsional
  (disabled saat stok 0); aksi nyata di P3-03/P3-04. Deskripsi dirender hanya bila ada (`description` nullable).

## Cara verifikasi
- `/produk/casing-hp-bening` → 200, tampil nama/kategori/harga/tombol/galeri.
- `/produk/tidak-ada-xyz` → 404. Produk `isActive=0` → 404 + tak muncul di katalog; dikembalikan → 200.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` → lolos (route `/produk/[slug]` ƒ Dynamic).

## Catatan / penyimpangan
- Tombol keranjang/WA belum berfungsi (Fase 3). Gambar placeholder + `<img>` (Cloudinary + next/image di P4-03).
- "Produk terkait" (opsional P2) belum dibuat — di luar scope MVP.
