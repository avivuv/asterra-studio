# P4-06 — CRUD kategori

- **Fase:** 4
- **Fitur terkait (FEATURES.md):** J
- **Prioritas:** P1
- **Dependency:** P4-02
- **Status:** ✅ Done — lihat ../implementations/P4-fase4-admin.md

## Tujuan
Admin mengelola kategori di luar 3 kategori seed (tambah/edit/hapus), dengan proteksi hapus bila terpakai.

## Scope
- `lib/repositories/categoryRepository.ts` — CRUD + `countProducts(categoryId)`.
- `lib/services/categoryService.ts` — slug otomatis; **larang hapus** kategori yang masih dipakai produk.
- `lib/validations/category.ts` (Zod).
- Controller `app/admin/kategori/page.tsx` + actions.

## Di luar scope
- Reassign massal produk antar kategori (manual dulu).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Validasi | `lib/validations/category.ts` |
| Repository | `lib/repositories/categoryRepository.ts` |
| Service | `lib/services/categoryService.ts` |
| Controller | `app/admin/kategori/page.tsx`, `actions.ts` |

## Langkah kerja
1. Slug via `slugify`, dijaga unik.
2. Sebelum delete, cek `countProducts > 0` → tolak (aturan FEATURES J / DATABASE §2.2 Restrict).
3. Action tipis → service → repository.

## Definition of Done
- [ ] Tambah/edit/hapus kategori berfungsi.
- [ ] Kategori terpakai tidak bisa dihapus (pesan jelas).
- [ ] Slug otomatis & unik; logika di Service.
- [ ] Dokumen implementasi di `docs/implementations/P4-06-crud-kategori.md`.
