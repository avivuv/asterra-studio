# P1-04 — Helper `formatIDR` + `slugify`

- **Fase:** 1
- **Fitur terkait (FEATURES.md):** —
- **Prioritas:** P0
- **Dependency:** P1-01
- **Status:** ✅ Done — lihat [`../implementations/P1-04-format-helpers.md`](../implementations/P1-04-format-helpers.md)

## Tujuan
Menyediakan helper format yang dipakai ulang di seluruh app, agar tidak ada format manual (DRY).

## Scope
- `lib/format.ts`:
  - `formatIDR(n: number): string` — format rupiah (mis. `15000` → `"Rp15.000"`).
  - `slugify(text: string): string` — slug URL bersih dari nama produk.

## Di luar scope
- Pemakaian di UI (dipakai di tiket katalog/detail/keranjang).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Util | `lib/format.ts` |

## Langkah kerja
1. Implement `formatIDR` (Intl.NumberFormat `id-ID`, gaya currency IDR tanpa desimal).
2. Implement `slugify` (lowercase, ganti non-alfanumerik jadi `-`, trim `-` ganda).
3. (Opsional) unit test sederhana bila test runner sudah ada.

## Definition of Done
- [ ] `formatIDR(15000)` → `"Rp15.000"` (konsisten dengan CONVENTIONS §8).
- [ ] `slugify("Gantungan Kunci Lucu")` → `"gantungan-kunci-lucu"`.
- [ ] Nama simbol Inggris; tidak ada `any`.
- [ ] Dokumen implementasi di `docs/implementations/P1-04-format-helpers.md`.
