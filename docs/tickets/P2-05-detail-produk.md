# P2-05 — Halaman detail produk

- **Fase:** 2
- **Fitur terkait (FEATURES.md):** D
- **Prioritas:** P0
- **Dependency:** P2-02
- **Status:** ✅ Done — lihat [`../implementations/P2-05-detail-produk.md`](../implementations/P2-05-detail-produk.md)

## Tujuan
Halaman detail per produk di `/produk/[slug]` dengan galeri, info lengkap, dan aksi keranjang/WA.

## Scope
- Controller `app/(public)/produk/[slug]/page.tsx` — `getDetail(slug)`; `null` → `notFound()` (404).
- `components/product/ProductGallery.tsx` (Client) — ganti foto aktif.
- Slot tombol `AddToCartButton` & "Pesan langsung via WhatsApp" (implementasi tombol di Fase 3;
  di tiket ini cukup placeholder/props siap-pasang bila Fase 3 belum ada).
- Info: nama, harga (`formatIDR`), deskripsi, kategori, status stok.

## Di luar scope
- Logika keranjang (P3), produk terkait (P2).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Controller | `app/(public)/produk/[slug]/page.tsx` |
| Komponen | `components/product/ProductGallery.tsx` (client) |

## Langkah kerja
1. Controller tipis; nonaktif/not found → `notFound()`.
2. Galeri `"use client"` (ganti foto); sisanya server.
3. Harga via `formatIDR`.

## Definition of Done
- [ ] `/produk/<slug>` menampilkan detail lengkap.
- [ ] Produk nonaktif / slug tak ada → 404 (aturan FEATURES D).
- [ ] Controller tipis; galeri satu-satunya bagian client.
- [ ] Dokumen implementasi di `docs/implementations/P2-05-detail-produk.md`.
