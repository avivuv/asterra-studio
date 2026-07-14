# P4-04 — CRUD produk

- **Fase:** 4
- **Fitur terkait (FEATURES.md):** H
- **Prioritas:** P0
- **Dependency:** P4-02, P4-03
- **Status:** ✅ Done — lihat ../implementations/P4-fase4-admin.md

## Tujuan
Admin mengelola produk: list, tambah, edit, hapus, toggle aktif — lengkap dengan gambar & validasi.

## Scope
- `lib/validations/product.ts` (Zod) — dipakai form (client) & action (server).
- `lib/repositories/productRepository.ts` (tambahan write): `create`, `update`, `delete`, `findAll`.
- `lib/services/productService.ts` (tambahan): `createProduct`, `updateProduct`, `deleteProduct`
  (slug otomatis via `slugify`, jaga unik; hapus produk → hapus gambar via `imageService`).
- Controller `app/admin/produk/page.tsx` (tabel) + `app/admin/produk/actions.ts` (Server Actions CRUD).
- Form produk (nama, harga, stok, kategori, deskripsi, aktif, upload gambar).

## Di luar scope
- Badge "Habis" publik (P4-05), CRUD kategori (P4-06).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Validasi | `lib/validations/product.ts` |
| Repository | `productRepository.ts`, `productImageRepository.ts` |
| Service | `productService.ts`, `imageService.ts` |
| Controller | `app/admin/produk/page.tsx`, `actions.ts` |
| Komponen | form produk, tabel produk |

## Langkah kerja
1. Skema Zod (`ARCHITECTURE §4`) — reuse form & action.
2. Action tipis: validasi → service → `revalidatePath`/`redirect`. Tanpa Prisma/slug di action.
3. Slug otomatis dari `name`; harga integer > 0; stok ≥ 0 (ditegakkan di Service).
4. Delete: konfirmasi; hapus gambar (DB Cascade + `imageService.delete(publicId)`).

## Definition of Done
- [ ] Create/edit/delete/toggle aktif berfungsi end-to-end.
- [ ] Slug otomatis & unik; harga>0; stok≥0 (di Service).
- [ ] Query DB hanya di repo; logika di service; action tipis (RULES §1).
- [ ] Zod dipakai form & action.
- [ ] Hapus produk juga menghapus gambar di storage.
- [ ] Dokumen implementasi di `docs/implementations/P4-04-crud-produk.md`.
