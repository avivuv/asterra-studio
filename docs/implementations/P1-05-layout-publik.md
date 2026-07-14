# Implementasi P1-05 — Layout publik (Header, Footer)

- **Tiket:** [`../tickets/P1-05-layout-publik.md`](../tickets/P1-05-layout-publik.md)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai

## Ringkasan
Kerangka tampilan publik dibuat: `app/(public)/layout.tsx` membungkus semua halaman publik dengan
Header + Footer. Header berisi brand "Asterra Studio", link 3 kategori (via query string), dan slot
keranjang. Semua Server Component (statis). Build & render terverifikasi.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `app/(public)/layout.tsx` | dibuat: kolom flex Header → `<main>` → Footer |
| `components/layout/Header.tsx` | dibuat: brand + nav kategori + slot keranjang |
| `components/layout/Footer.tsx` | dibuat: brand + tagline + copyright tahun berjalan |

## Keputusan penting
- **Header/Footer = Server Component** (statis, tanpa `"use client"` — RULES §3). Belum butuh interaktivitas.
- **Link kategori via query string** `/?category=<slug>` (selaras rencana filter P2-04), slug sesuai
  seed (`phone-accessory`, `keychain`, `bag-charm`).
- **Slot keranjang** sementara berupa link teks "Keranjang" → `/keranjang`. `CartButton` (client, dengan
  badge jumlah) menggantikannya di P3-03 tanpa mengubah struktur Header.
- **Nav kategori disembunyikan di mobile** (`hidden md:flex`) — menu mobile penuh menyusul bila diperlukan
  (bukan scope P1-05).

## Cara verifikasi
- `curl http://localhost:3000/` menampilkan: "Asterra Studio", "Aksesoris HP", "Gantungan Kunci",
  "Gantungan Tas", "Keranjang" (Header) + "© 2026 Asterra Studio" (Footer).
- `npx tsc --noEmit` → 0 error; `npm run lint` → lolos; `npm run build` → **Compiled successfully**.

## Catatan / penyimpangan
- Slot keranjang masih link teks (bukan ikon+badge) — sesuai rencana, badge diisi P3-03.
- Belum ada menu navigasi mobile; ditambah bila dibutuhkan.
