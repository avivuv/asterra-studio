# P3-03 — UI keranjang (CartButton, CartItem, CartSummary)

- **Fase:** 3
- **Fitur terkait (FEATURES.md):** E
- **Prioritas:** P0
- **Dependency:** P3-02
- **Status:** ✅ Done — lihat implementasi terkait di ../implementations/

## Tujuan
Tampilan keranjang: badge jumlah di header, halaman keranjang dengan ubah qty/hapus + ringkasan.

## Scope
- `components/cart/CartButton.tsx` (Client) — ikon + badge jumlah item; dipasang di Header (P1-05).
- `components/cart/CartItem.tsx` (Client) — baris item + kontrol qty (+/−) + hapus.
- `components/cart/CartSummary.tsx` (Client) — subtotal/total via `cartService` + `formatIDR`.
- `components/cart/AddToCartButton.tsx` (Client) — dipakai di detail produk (P2-05).
- Halaman `app/(public)/keranjang/page.tsx` — rakit item + summary; empty state "Keranjang masih kosong.".

## Di luar scope
- Tombol checkout WA (P3-04).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Controller | `app/(public)/keranjang/page.tsx` |
| Komponen | `CartButton`, `CartItem`, `CartSummary`, `AddToCartButton` (semua client) |

## Langkah kerja
1. Komponen keranjang `"use client"` (baca store Zustand).
2. Total/subtotal via `cartService`; tampilkan dengan `formatIDR`.
3. Pasang `CartButton` ke slot Header dari P1-05.

## Definition of Done
- [ ] Badge jumlah update saat add/remove.
- [ ] Ubah qty & hapus item bekerja; empty state muncul saat kosong.
- [ ] Perhitungan lewat `cartService` (bukan dihitung inline di komponen).
- [ ] Dokumen implementasi di `docs/implementations/P3-03-cart-ui.md`.
