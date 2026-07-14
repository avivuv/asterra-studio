# Implementasi P6 — Featured, Promo, Share

- **Tiket:** N (Featured), O (Share), Q (Promo) — peningkatan P2 di luar MVP awal (diminta pemilik)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Tiga fitur produk ditambahkan: **Featured** (produk unggulan → section beranda), **Promo** (harga
coret/diskon + badge), **Share** (bagikan produk). Butuh migrasi DB (2 field di `Product`).

## File yang dibuat / diubah
| Fitur | File |
|-------|------|
| DB | `prisma/schema.prisma` (+`isFeatured`, `originalPrice`, index), migrasi `add_featured_promo` |
| Promo | `lib/validations/product.ts` (originalPrice + refine <price), `lib/format.ts` (`discountPercent`), `productService` create/update, `ProductForm` (input harga asli), `ProductCard` + detail page (harga coret + badge -N%) |
| Featured | `productRepository.findFeatured`, `productService.getFeatured`, `ProductForm` (checkbox), `app/(public)/page.tsx` (section "Produk Pilihan") |
| Share | `components/product/ShareButton.tsx` + dipasang di detail |

## Keputusan penting
- **Promo via `promoPrice` (nullable)** — `price` = **harga normal (tetap)**, `promoPrice` = harga jual
  saat diskon (opsional). Bila diisi: `promoPrice` tampil, `price` dicoret. Diskon `discountPercent(price,
  promoPrice)`. **Validasi `.refine`**: `promoPrice < price`. **Mengakhiri promo = kosongkan `promoPrice`**
  (harga normal tak perlu diubah — perbaikan dari desain awal `originalPrice` yang kebalik).
- **Keranjang pakai harga jual** — AddToCartButton di detail menerima `displayPrice` (promoPrice bila promo).
- **Section "Lagi Promo"** di beranda — `findPromo` (promoPrice not null, aktif), tampil saat tak browsing.
- **Section promo & unggulan selalu tampil** — di atas katalog, tak bergantung filter/cari (revisi dari
  desain awal yang menyembunyikannya saat browsing — terasa "hilang" saat klik kategori). `findFeatured`/
  `findPromo` batasi 4, hanya produk aktif.
- **Share: Web Share API + fallback** — `navigator.share` (mobile → sheet native termasuk WA/IG),
  fallback `clipboard.writeText` (desktop) dengan feedback "Link disalin". Tanpa perubahan DB.
- **Regenerate Prisma Client** wajib setelah migrasi agar tipe `isFeatured`/`originalPrice` dikenal
  (sempat TS error sebelum `prisma generate`).

## Cara verifikasi
- Set produk featured → beranda menampilkan section "Produk Pilihan" + produk itu.
- Set `originalPrice=25000, price=18000` → kartu & detail tampil harga promo + `Rp25.000` dicoret + badge -28%.
- ShareButton render di detail (Web Share/clipboard — interaksi client).
- `npx tsc --noEmit`, `npm run build` → lolos. Data uji sudah di-reset.

## Catatan / penyimpangan
- Tabel produk admin belum menampilkan kolom Featured/Promo (opsional) — bisa ditambah ke `ProductRow` kelak.
- Badge diskon merah (semantic), terpisah dari aksen brand.
