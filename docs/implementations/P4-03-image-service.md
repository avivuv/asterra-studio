# Implementasi P4-03 — imageService (Cloudinary) + upload multi-gambar

- **Tiket:** [`../tickets/P4-03-image-service.md`](../tickets/P4-03-image-service.md)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Upload gambar produk ke **Cloudinary** dengan penyedia terisolasi di `imageService`. Form produk kini
punya **uploader multi-gambar** (galeri) menggantikan input URL manual. Gambar tersimpan sebagai banyak
`ProductImage` (dengan `order`); foto pertama = utama. Hapus/ganti gambar juga menghapus file di Cloudinary.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `lib/services/imageService.ts` | Cloudinary upload/delete (isolasi provider); config lazy; validasi tipe/ukuran |
| `app/admin/(protected)/produk/upload.ts` | Server Action `uploadImageAction` (auth → imageService.upload) |
| `components/product/ImageUploader.tsx` | uploader **multi** (client): pilih banyak file → upload → array JSON di hidden input |
| `components/product/ProductForm.tsx` | ganti input URL → `<ImageUploader defaultImages>` |
| `lib/validations/product.ts` | `images: {url, publicId}[]` via `z.preprocess(JSON.parse)` |
| `lib/repositories/productImageRepository.ts` | `findByProduct`, `createMany`, `deleteByProduct` |
| `lib/services/productService.ts` | `saveImages`/`replaceImages`/`clearImages`; create/update/delete pakai galeri |
| `.env.local` | kredensial Cloudinary |

## Keputusan penting
- **Isolasi provider** — hanya `imageService` yang `import cloudinary`. Repository/komponen pegang
  `url`/`publicId`. Ganti penyedia = ubah `imageService` saja (FEATURES I).
- **Config Cloudinary lazy** (`configure()` tiap operasi) — hindari "Must supply api_key" saat env
  belum termuat di runtime tertentu.
- **Multi-image (galeri)** — DB & `ProductGallery` sudah mendukung; uploader dibuat multi. `order`
  mengikuti urutan upload; `images[0]` = foto utama (badge "Utama").
- **Update aman** — `replaceImages` hanya menghapus di Cloudinary gambar lama yang **tidak lagi dipakai**
  (bandingkan publicId), lalu tulis ulang baris DB. Gambar yang dipertahankan tak ikut terhapus.
- **Delete produk** — `clearImages` hapus semua file Cloudinary dulu, lalu produk (baris ProductImage
  ikut Cascade DB). Validasi: JPG/PNG/WEBP, maks 5 MB/foto.

## Cara verifikasi
- Uji nyata (tsx) ke Cloudinary: upload PNG → URL `res.cloudinary.com/aa3kzab3/.../asterra/...png` valid;
  delete sukses. Kredensial tervalidasi.
- `/admin/produk/baru` → form menampilkan uploader (`name="images"`, "maks 5 MB"), bukan input URL.
- Halaman detail publik: `ProductGallery` menampilkan semua foto (utama + thumbnail); katalog pakai foto utama.
- `npx tsc --noEmit`, `npm run build` → lolos.

## Catatan / penyimpangan
- Gambar seed lama pakai `publicId=""` (placeholder picsum) — `imageService.delete("")` diabaikan, aman.
- ⚠️ API Secret sempat ditempel di chat → disarankan regenerate di dashboard Cloudinary (opsional).
- **Server Action body limit** dinaikkan ke 8 MB di `next.config.ts` (`experimental.serverActions.bodySizeLimit`)
  — default 1 MB menolak foto >1 MB ("Body exceeded 1 MB limit"). Saat deploy, perhatikan limit body
  platform (mis. Vercel ~4.5 MB per function) — dipertimbangkan di P5-03.
