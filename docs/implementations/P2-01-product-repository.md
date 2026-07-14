# Implementasi P2-01 — Product repository (read)

- **Tiket:** [`../tickets/P2-01-product-repository.md`](../tickets/P2-01-product-repository.md)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai

## Ringkasan
`lib/repositories/productRepository.ts` dibuat dengan dua method baca: `findActive` (katalog) dan
`findBySlug` (detail). Murni query Prisma, tanpa logika bisnis.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `lib/repositories/productRepository.ts` | dibuat: `findActive`, `findBySlug` |

## Keputusan penting
- **Import `prisma` dari singleton** `@/lib/prisma` (RULES §1.2) — bukan instansiasi baru.
- **Tanpa logika bisnis** — `findActive` hanya `where: { isActive: true }` + include `images` (urut
  `order asc`) + `category`, `orderBy createdAt desc`. Filter kategori/search dilakukan Service (P2-02).
- **`findBySlug` tanpa cek aktif** — aturan "nonaktif = 404" ditegakkan Service, bukan Repository.

## Cara verifikasi
- `npx tsc --noEmit` → 0 error; `npm run lint` → lolos.
- (Query nyata diuji end-to-end lewat P2-02/P2-03 setelah ada produk contoh.)

## Catatan / penyimpangan
- Method write (create/update/delete/findAll) belum dibuat — menyusul di P4-04 (CRUD admin), sesuai scope.
