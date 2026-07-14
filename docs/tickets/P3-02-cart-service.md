# P3-02 — Cart service (hitung total/subtotal)

- **Fase:** 3
- **Fitur terkait (FEATURES.md):** E
- **Prioritas:** P0
- **Dependency:** P3-01
- **Status:** ✅ Done — lihat implementasi terkait di ../implementations/

## Tujuan
Logika perhitungan keranjang (subtotal per item, total keseluruhan) di Service, bukan di komponen.

## Scope
- `lib/services/cartService.ts`:
  - `calculateSubtotal(item)`, `calculateTotal(items)`.
  - `buildOrderSummary(items)` — struktur ringkasan (dipakai UI & whatsappService).

## Di luar scope
- Susun teks WA final (P3-04, whatsappService).
- State (di store, P3-01).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Service | `lib/services/cartService.ts` |

## Langkah kerja
1. Fungsi murni atas array item (tanpa akses DB/JSX).
2. Nilai uang tetap integer rupiah; format ke string dilakukan di UI via `formatIDR`.

## Definition of Done
- [ ] Perhitungan total/subtotal ada di Service (RULES §1.3).
- [ ] Fungsi murni, tidak menyentuh Prisma/JSX.
- [ ] Dokumen implementasi di `docs/implementations/P3-02-cart-service.md`.
