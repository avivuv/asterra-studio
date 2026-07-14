# Implementasi P7 — Kode Produk (SKU)

- **Tiket:** — (peningkatan diminta pemilik)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Produk kini punya **kode unik (SKU)** yang diisi admin — memudahkan identifikasi saat produk banyak &
mengecek pesanan spesifik dari chat WhatsApp. Kode tampil di kartu katalog, detail, tabel admin, dan
**pesan checkout WA**.

## File yang dibuat / diubah
| Area | File |
|------|------|
| DB | `Product.code` (String @unique, required); migrasi `add_product_code` + `product_code_required`; backfill `AST-0001…` |
| Validasi/Service | `product.ts` (code wajib, uppercase), `productRepository.countByCode`, `productService` (create/update simpan code + `assertCodeUnique` → `DuplicateCodeError`) |
| Actions | `produk/actions.ts` (tangkap DuplicateCodeError → error field `code`) |
| Form | `ProductForm` (field Kode di atas, uppercase) |
| Tampilan | `ProductCard` (kode kecil), detail page ("Kode: …"), `ProductTable` (kolom Kode width 120, searchable) |
| Keranjang/WA | `cart.ts` (CartItem+code), `AddToCartButton`, `cartService` (OrderLine+code), `whatsappService` (`[code]` di pesan) |
| Seed | sampleProducts + `code` |

## Keputusan penting
- **Kode manual, wajib, unik** (pilihan pemilik) — Zod `.transform(toUpperCase)`; unik dicek di Service
  (`assertCodeUnique`) → `DuplicateCodeError` ditangkap Action jadi error form (bukan crash).
- **Migrasi bertahap** — kolom ditambah nullable → backfill `AST-000N` (urut createdAt) → jadikan NOT NULL.
  Karena environment non-interaktif, migrasi unique ditulis manual (SQL) lalu `migrate deploy`.
- **Pesan WA sertakan `[kode]`** — inti tujuan: penjual cek pesanan spesifik. Snapshot code disimpan di
  cart item (seperti name/price).
- **Search admin** otomatis mencakup kode (DataTable global filter TanStack).

## Bonus — fix emoji WA
- Pesan WA default hero berisi `😊` yang tampil `�` di sebagian device → **emoji dibuang dari pesan WA**
  (emoji visual di heading/UI tetap aman; `encodeURIComponent` sendiri sudah benar).

## Cara verifikasi
- Pesan WA: `1. [GK-001] Gantungan Kunci Lucu — 2x @Rp15.000 = Rp30.000` (uji tsx).
- Kartu/detail/tabel admin menampilkan kode (AST-0001 dst). Hero WA tanpa emoji rusak.
- `npx tsc --noEmit`, `npm run build` → lolos.

## Catatan / penyimpangan
- Produk lama otomatis dapat kode `AST-0001…AST-0006`; admin bisa mengubah ke kode bermakna.
- `DATABASE.md`/`schema` perlu sinkron: `code` sekarang bagian model Product (lihat schema).
