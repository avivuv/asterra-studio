# P2-02 — Product service: katalog + detail

- **Fase:** 2
- **Fitur terkait (FEATURES.md):** A, B, C, D
- **Prioritas:** P0
- **Dependency:** P2-01
- **Status:** ✅ Done — lihat [`../implementations/P2-02-product-service-catalog.md`](../implementations/P2-02-product-service-catalog.md)

## Tujuan
Menaruh logika bisnis katalog (filter kategori, pencarian nama) dan detail (aturan nonaktif = 404) di Service.

## Scope
- `lib/services/productService.ts`:
  - `getCatalog({ category?, search? })` — ambil `findActive()`, filter by `category.slug`,
    search substring case-insensitive pada `name` (di memori; skala <100 produk).
  - `getDetail(slug)` — `findBySlug`; kembalikan `null` bila tidak ada **atau** `isActive:false`.

## Di luar scope
- Rendering (Controller/komponen), write.

## Layer yang disentuh
| Layer | File |
|-------|------|
| Service | `lib/services/productService.ts` |

## Langkah kerja
1. Implement `getCatalog` & `getDetail` (lihat ARCHITECTURE §3.2).
2. **Tidak** `import { prisma }` di Service (RULES §1.1) — semua lewat repository.
3. Aturan "produk nonaktif dianggap tidak ada" ditegakkan di sini.

## Definition of Done
- [ ] Filter & search berada di Service, bukan Controller/Repository.
- [ ] Service tidak menyentuh Prisma/JSX/request.
- [ ] `getDetail` mengembalikan `null` untuk produk nonaktif.
- [ ] Dokumen implementasi di `docs/implementations/P2-02-product-service-catalog.md`.
