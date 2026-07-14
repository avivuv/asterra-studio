# Implementasi P2-02 — Product service: katalog + detail

- **Tiket:** [`../tickets/P2-02-product-service-catalog.md`](../tickets/P2-02-product-service-catalog.md)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai

## Ringkasan
`lib/services/productService.ts` dibuat dengan `getCatalog` (filter kategori + pencarian nama) dan
`getDetail` (aturan nonaktif = tidak ada). Logika bisnis di Service, tanpa akses Prisma langsung.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `lib/services/productService.ts` | dibuat: `getCatalog`, `getDetail` |

## Keputusan penting
- **Filter & search di memori** — data kecil (<100 produk), jadi ambil `findActive()` lalu filter di
  JS (FEATURES C). Search: substring case-insensitive pada `name`, keyword di-`trim`.
- **Tidak `import prisma`** di Service (RULES §1.1) — semua lewat `productRepository`.
- **`getDetail` → `null`** bila produk tidak ada **atau** `isActive:false`; Controller ubah jadi 404 (P2-05).

## Cara verifikasi
- `npx tsc --noEmit` → 0 error; `npm run lint` → lolos.
- (Perilaku filter/detail diuji end-to-end di P2-03/P2-05 dengan produk contoh.)

## Catatan / penyimpangan
- Belum ada produk contoh di DB; efek visual katalog diverifikasi di P2-03 (yang menambah seed produk).
