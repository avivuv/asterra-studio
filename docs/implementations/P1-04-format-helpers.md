# Implementasi P1-04 — Helper `formatIDR` + `slugify`

- **Tiket:** [`../tickets/P1-04-format-helpers.md`](../tickets/P1-04-format-helpers.md)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai

## Ringkasan
`lib/format.ts` dibuat berisi dua helper reusable: `formatIDR` (format rupiah integer) dan `slugify`
(slug URL bersih). Output diverifikasi sesuai target di docs.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `lib/format.ts` | dibuat: `formatIDR(amount)`, `slugify(text)` |

## Keputusan penting
- **`formatIDR` pakai `Intl.NumberFormat("id-ID")`** currency IDR, 0 desimal (Rupiah tak pakai sen).
  `Intl` menyisipkan NBSP setelah "Rp" → dibuang dengan `.replace(/\s/g,"")` agar hasil **`"Rp15.000"`**
  (tanpa spasi), sesuai target docs/tickets (dipilih pemilik).
- **`slugify` buang diakritik** via `normalize("NFKD")` + hapus combining marks, lalu lowercase,
  non-alfanumerik → `-`, rapikan `-` di tepi. Deterministik & aman untuk URL.

## Cara verifikasi
- `formatIDR(15000)` → `"Rp15.000"`, `formatIDR(0)` → `"Rp0"`, `formatIDR(1500000)` → `"Rp1.500.000"`.
- `slugify("Gantungan Kunci Lucu!")` → `"gantungan-kunci-lucu"`.
- `slugify("Cafe Edition — 2x")` → `"cafe-edition-2x"`; `slugify("  --Halo Dunia--  ")` → `"halo-dunia"`.
- `npx tsc --noEmit` → 0 error; `npm run lint` → lolos.

## Catatan / penyimpangan
- `formatIDR` sengaja tanpa spasi ("Rp15.000") mengikuti docs; kalau nanti mau gaya "Rp 15.000",
  cukup hapus `.replace(/\s/g,"")`.
- Belum ada unit test formal (test runner belum disiapkan) — verifikasi lewat skrip tsx sementara.
