# P1-05 — Layout publik (Header, Footer)

- **Fase:** 1
- **Fitur terkait (FEATURES.md):** —
- **Prioritas:** P0
- **Dependency:** P1-01
- **Status:** ✅ Done — lihat [`../implementations/P1-05-layout-publik.md`](../implementations/P1-05-layout-publik.md)

## Tujuan
Menyiapkan kerangka tampilan publik (Header + Footer + layout root) sebagai wadah semua halaman publik.

## Scope
- `app/(public)/layout.tsx` — layout area publik.
- `components/layout/Header.tsx` — brand "Asterra Studio", link kategori, slot ikon keranjang
  (badge diisi di P3-03).
- `components/layout/Footer.tsx`.
- Metadata dasar app (title/description brand) di root layout.

## Di luar scope
- Isi keranjang & badge jumlah (P3-03), filter interaktif (P2-04).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Layout | `app/(public)/layout.tsx`, `app/layout.tsx` |
| Komponen | `components/layout/Header.tsx`, `components/layout/Footer.tsx` |

## Langkah kerja
1. Header/Footer sebagai **Server Component** (statis; belum butuh interaktivitas).
2. Sediakan slot/placeholder untuk `CartButton` (client) yang dipasang di P3-03.
3. Semua teks UI Bahasa Indonesia; brand "Asterra Studio".

## Definition of Done
- [ ] Header & Footer tampil di semua halaman publik.
- [ ] Header/Footer tetap Server Component (tidak ada `"use client"` tak perlu — RULES §3).
- [ ] Teks UI Bahasa Indonesia, nama simbol Inggris.
- [ ] Dokumen implementasi di `docs/implementations/P1-05-layout-publik.md`.
