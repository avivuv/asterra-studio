# Implementasi Fase 3 — Keranjang + Checkout WhatsApp (P3-01…P3-04)

- **Tiket:** P3-01, P3-02, P3-03, P3-04
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Fase keranjang lengkap: store Zustand (persist), service perhitungan, UI keranjang (badge, item,
ringkasan), dan checkout yang membuka chat WhatsApp berisi ringkasan pesanan. Tombol WA juga dipasang
di hero untuk chat/custom umum.

## File yang dibuat / diubah
| File | Tiket | Perubahan |
|------|-------|-----------|
| `lib/cart.ts` | P3-01 | store Zustand + persist (`asterra-cart`): addItem/updateQty/removeItem/clear |
| `lib/services/cartService.ts` | P3-02 | calculateSubtotal/Total, countItems, buildOrderSummary (murni) |
| `components/cart/AddToCartButton.tsx` | P3-03 | tombol tambah (detail) + feedback "✓ Ditambahkan" |
| `components/cart/CartButton.tsx` | P3-03 | ikon + badge jumlah (mounted-gate anti-hydration) |
| `components/cart/CartItem.tsx` | P3-03 | baris item + qty +/− + hapus |
| `components/cart/CartSummary.tsx` | P3-03 | total via cartService + slot checkout |
| `app/(public)/keranjang/page.tsx` | P3-03 | rakit item + summary + empty state |
| `components/layout/Header.tsx` | P3-03 | pasang CartButton (ganti link teks) |
| `lib/repositories/settingRepository.ts` | P3-04 | `get()` Setting singleton |
| `lib/services/whatsappService.ts` | P3-04 | buildOrderMessage (placeholder {items}/{total}) + buildWaLink |
| `app/(public)/keranjang/actions.ts` | P3-04 | Server Action `buildCheckoutLink` (repo → service) |
| `components/cart/CheckoutButton.tsx` | P3-04 | panggil action → buka wa.me |
| `app/(public)/produk/[slug]/page.tsx` | P3-04 | pasang AddToCartButton (ganti placeholder) |
| `components/layout/Hero.tsx` | (UI) | async: copy baru + tombol WA (chat/custom) dari Setting |

## Keputusan penting
- **Store Zustand tanpa logika hitung** (RULES §1.3) — perhitungan di `cartService` (murni), state di store.
- **Anti-hydration** — komponen yang baca store (CartButton, halaman keranjang) pakai mounted-gate
  `useSyncExternalStore` (persist localStorage baru ada di client) → tak ada mismatch, lolos lint.
- **Checkout via Server Action** — `buildCheckoutLink(items)` ambil Setting (repo) → susun pesan
  (whatsappService) → return `wa.me`. DB hanya diakses di server (repo), client cuma buka link.
- **Pesan pakai template Setting** — placeholder `{items}`/`{total}`; bila tak ada, item+total ditambah
  di akhir. `waNumber` format internasional (`628xxx`).
- **Hero tombol WA ≠ checkout** — sengaja chat umum/custom (pesan sapaan), bukan daftar keranjang;
  Hero jadi async Server Component untuk ambil `waNumber` dari Setting.
- **Snapshot harga di item** — harga disimpan saat ditambahkan; checkout menyusun ulang dari item.
  (Verifikasi harga terkini terhadap DB bisa ditambah kelak — FEATURES E catatan.)

## Cara verifikasi
- `whatsappService.buildOrderMessage` (uji tsx) → format persis FEATURES F:
  `1. Nama — 2x @Rp15.000 = Rp30.000` + `Total: Rp50.000`; `buildWaLink` ter-encode benar.
- `curl /` → hero "makin ceria" + tombol WA `wa.me/628123456789`.
- `curl /keranjang` → render (empty state via client); `curl /produk/<slug>` → "Tambah ke keranjang".
- `npx tsc --noEmit`, `npm run lint`, `npm run build` → lolos (route `/keranjang` masuk).

## Catatan / penyimpangan
- Uji interaktif penuh (klik add → badge → checkout buka WA) perlu browser; logika terverifikasi via
  build + uji unit whatsappService.
- Nomor WA masih placeholder seed (`628123456789`) — diatur admin di P5-01.
- Gambar item masih placeholder `<img>`; Cloudinary + next/image di P4-03.
- Hero copy final: "Hal-hal kecil, bikin hari makin ceria 🎀" + sub-judul produk & custom (pilihan pemilik).
