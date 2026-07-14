# P2-01 — Product repository (read)

- **Fase:** 2
- **Fitur terkait (FEATURES.md):** A, B, C, D
- **Prioritas:** P0
- **Dependency:** P1-02
- **Status:** ✅ Done — lihat [`../implementations/P2-01-product-repository.md`](../implementations/P2-01-product-repository.md)

## Tujuan
Menyediakan akses baca produk dari DB via Repository (satu-satunya tempat query Prisma).

## Scope
- `lib/repositories/productRepository.ts`:
  - `findActive()` — produk `isActive:true`, include `images` (order asc) + `category`, urut `createdAt desc`.
  - `findBySlug(slug)` — 1 produk by slug, include images + category.

## Di luar scope
- Filter/search (logika itu di Service, P2-02).
- Write (create/update/delete) → tiket CRUD (P4-04).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Repository | `lib/repositories/productRepository.ts` |

## Langkah kerja
1. Buat objek `productRepository` dengan method di atas (lihat contoh ARCHITECTURE §3.1).
2. **Tanpa** logika bisnis — murni query.

## Definition of Done
- [ ] Hanya query Prisma, tidak ada filter/aturan bisnis (RULES §1.1).
- [ ] `import { prisma }` dari `@/lib/prisma` (singleton).
- [ ] Include images (order asc) + category.
- [ ] Dokumen implementasi di `docs/implementations/P2-01-product-repository.md`.
