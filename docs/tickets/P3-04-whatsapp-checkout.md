# P3-04 — Setting repo + whatsappService + CheckoutButton

- **Fase:** 3
- **Fitur terkait (FEATURES.md):** F
- **Prioritas:** P0
- **Dependency:** P3-02, P1-02
- **Status:** ✅ Done — lihat implementasi terkait di ../implementations/

## Tujuan
Checkout membuka chat WhatsApp penjual berisi ringkasan pesanan (tanpa pembayaran).

## Scope
- `lib/repositories/settingRepository.ts` — `get()` (baca Setting singleton).
- `lib/services/whatsappService.ts`:
  - `buildOrderMessage(items)` — teks daftar produk + total (pakai `cartService` + `formatIDR`).
  - `buildWaLink(waNumber, message)` — `https://wa.me/<waNumber>?text=<encodeURIComponent(message)>`.
  - dukung placeholder `messageTemplate` (mis. `{items}`, `{total}`).
- `components/cart/CheckoutButton.tsx` (Client) — ambil setting (via server action/route tipis) → buka link.

## Di luar scope
- Payment gateway / order tersimpan di DB (out of scope — FEATURES §5).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Repository | `lib/repositories/settingRepository.ts` |
| Service | `lib/services/whatsappService.ts` |
| Komponen | `components/cart/CheckoutButton.tsx` (client) |

## Langkah kerja
1. `settingRepository.get()` — query Prisma murni.
2. `whatsappService` susun pesan (reuse `cartService.buildOrderSummary`, `formatIDR`).
3. `waNumber` format internasional tanpa `+`/`0`.
4. CheckoutButton buka `wa.me` di tab baru.

## Definition of Done
- [ ] Klik checkout membuka `wa.me` dengan pesan berisi item + total benar.
- [ ] Nomor WA format `628xxx`; pesan ter-`encodeURIComponent`.
- [ ] Penyusunan pesan di Service, bukan di komponen.
- [ ] Tidak ada proses pembayaran / order DB.
- [ ] Dokumen implementasi di `docs/implementations/P3-04-whatsapp-checkout.md`.
