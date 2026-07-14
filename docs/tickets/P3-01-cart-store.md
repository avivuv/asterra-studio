# P3-01 — Cart store (Zustand + persist)

- **Fase:** 3
- **Fitur terkait (FEATURES.md):** E
- **Prioritas:** P0
- **Dependency:** P1-04
- **Status:** ✅ Done — lihat implementasi terkait di ../implementations/

## Tujuan
State keranjang di browser (Zustand + persist localStorage) sebagai satu-satunya sumber state keranjang.

## Scope
- `lib/cart.ts` — store Zustand + `persist`:
  - item: `{ productId, name, price, qty, imageUrl }`.
  - aksi: `addItem`, `updateQty`, `removeItem`, `clear`.

## Di luar scope
- Perhitungan total/subtotal (P3-02, di Service).
- Komponen UI (P3-03).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Store | `lib/cart.ts` |

## Langkah kerja
1. `npm i zustand`.
2. Buat store dengan `persist` (key mis. `asterra-cart`).
3. Snapshot data secukupnya untuk tampil (name, price, imageUrl).

## Definition of Done
- [ ] Item bertahan setelah refresh (localStorage).
- [ ] Aksi add/update/remove/clear berfungsi.
- [ ] Tidak ada logika perhitungan total di store (itu Service).
- [ ] Dokumen implementasi di `docs/implementations/P3-01-cart-store.md`.
