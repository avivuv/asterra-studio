# Implementasi P2-06 — SEO & metadata

- **Tiket:** [`../tickets/P2-06-seo-metadata.md`](../tickets/P2-06-seo-metadata.md)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
`generateMetadata` ditambahkan ke halaman detail produk: title & description dinamis dari data produk
+ Open Graph image (foto utama). Memakai `productService.getDetail` (reuse Service, bukan Prisma).

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `app/(public)/produk/[slug]/page.tsx` | tambah `generateMetadata` (title/description/openGraph) |

## Keputusan penting
- **Reuse `getDetail`** di metadata (bukan query Prisma langsung) — konsisten arsitektur; produk nonaktif
  → fallback title "Produk tidak ditemukan".
- **Description berlapis** — pakai `product.description` bila ada, jika tidak susun otomatis dari
  nama+kategori+harga (description nullable).
- **OG image = foto utama** (`images[0].url`); di-skip bila produk tanpa gambar.
- **Twitter card** ikut ter-generate otomatis oleh Next dari openGraph (bonus, tanpa kode tambahan).

## Cara verifikasi
- `curl /produk/casing-hp-bening` → `<title>Casing HP Bening — Asterra Studio</title>`, `<meta description>`,
  `og:title`/`og:description`/`og:image`/`og:type`, plus `twitter:*`.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` → lolos.

## Catatan / penyimpangan
- Sitemap (opsional di tiket) belum dibuat — bisa menyusul; belum krusial untuk MVP.
- OG image masih placeholder `picsum`; jadi foto produk asli setelah Cloudinary (P4-03).
