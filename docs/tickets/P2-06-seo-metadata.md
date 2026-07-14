# P2-06 — SEO & metadata

- **Fase:** 2
- **Fitur terkait (FEATURES.md):** P
- **Prioritas:** P1
- **Dependency:** P2-05
- **Status:** ✅ Done — lihat [`../implementations/P2-06-seo-metadata.md`](../implementations/P2-06-seo-metadata.md)

## Tujuan
Tiap halaman produk punya title/description dinamis + Open Graph image agar rapi saat dibagikan.

## Scope
- `generateMetadata` di `app/(public)/produk/[slug]/page.tsx` — `<title>` & `<meta description>`
  dari data produk.
- Open Graph image = foto utama produk.
- (Opsional) sitemap sederhana.

## Di luar scope
- Structured data / analytics.

## Layer yang disentuh
| Layer | File |
|-------|------|
| Controller | `app/(public)/produk/[slug]/page.tsx` (`generateMetadata`) |
| (Opsional) | `app/sitemap.ts` |

## Langkah kerja
1. `generateMetadata` panggil `productService.getDetail` (reuse; jangan query Prisma langsung).
2. Isi `openGraph.images` dari `images[0].url`.
3. Fallback title/description brand bila produk tak ada.

## Definition of Done
- [ ] View-source halaman produk menampilkan title/description sesuai produk.
- [ ] OG image terisi foto produk.
- [ ] Reuse Service (bukan query Prisma di metadata).
- [ ] Dokumen implementasi di `docs/implementations/P2-06-seo-metadata.md`.
