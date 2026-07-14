# P4-03 — imageService (Cloudinary) + productImageRepository

- **Fase:** 4
- **Fitur terkait (FEATURES.md):** I
- **Prioritas:** P0
- **Dependency:** P1-02
- **Status:** ✅ Done — lihat ../implementations/P4-03-image-service.md

## Tujuan
Upload/hapus gambar produk ke object storage (Cloudinary), dengan penyedia terisolasi di satu Service.

## Scope
- `lib/services/imageService.ts` — **satu-satunya** tempat yang tahu penyedia storage:
  - `upload(file)` → `{ url, publicId }`.
  - `delete(publicId)`.
  - validasi tipe (jpg/png/webp) & ukuran.
- `lib/repositories/productImageRepository.ts`:
  - `create({ productId, url, publicId, order })`.
  - `deleteByProduct(productId)`.

## Di luar scope
- Form/CRUD produk (P4-04) yang memanggil service ini.

## Layer yang disentuh
| Layer | File |
|-------|------|
| Service | `lib/services/imageService.ts` |
| Repository | `lib/repositories/productImageRepository.ts` |

## Langkah kerja
1. `npm i cloudinary`; kredensial dari env (`CLOUDINARY_*`).
2. `imageService.upload` kembalikan `url` + `publicId`; simpan keduanya (DATABASE §2.3).
3. Repository murni CRUD `ProductImage`.
4. Dev lokal & produksi upload ke storage yang sama (tak ada jalur simpan-ke-disk — FEATURES I).

## Definition of Done
- [ ] Upload menghasilkan `url` + `publicId` yang tersimpan.
- [ ] `delete(publicId)` menghapus objek di storage.
- [ ] Hanya `imageService` yang mengimpor SDK penyedia (isolasi provider).
- [ ] Validasi tipe & ukuran file.
- [ ] Dokumen implementasi di `docs/implementations/P4-03-image-service.md`.
