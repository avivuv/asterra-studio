# Implementasi UI-01 — Desain pastel + switch tema

- **Tiket:** — (pekerjaan desain lintas-tiket; menyempurnakan tampilan Fase 2)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai
- **Referensi:** artifact https://claude.ai/code/artifact/fda1a435-0ca9-4478-8f37-7d0a7f552f00

## Ringkasan
Menerapkan arah desain **cute/pastel** (disepakati pemilik) ke aplikasi: palet pink–peach, font
Fraunces + Nunito, kartu produk Gaya A, hero beranda, dan **switch tema dua sumbu** (warna
pink/lavender/mint + terang/gelap) dengan preferensi tersimpan & anti-FOUC.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `app/globals.css` | token skin (`data-skin`) + light/dark (`data-theme`); brand vars; dark variant via `data-theme` |
| `app/layout.tsx` | font Fraunces + Nunito (next/font); `<ThemeScript>`; `suppressHydrationWarning` |
| `components/theme/ThemeScript.tsx` | skrip inline set `data-theme`/`data-skin` dari localStorage/OS sebelum render |
| `components/theme/ThemeSwitcher.tsx` | kontrol warna + terang/gelap (client), simpan ke localStorage |
| `components/layout/Header.tsx` | pasang ThemeSwitcher, restyle (sticky, blur, tombol brand) |
| `components/layout/Hero.tsx` | hero gradient pastel (ikut skin) + blob |
| `components/product/ProductCard.tsx` | Gaya A: soft card + tombol "+ Keranjang" + badge |
| `app/(public)/page.tsx` | Hero + section katalog (anchor #katalog) |

## Keputusan penting
- **Sistem tema via token CSS** — `data-skin` (pink/lavender/mint) mengatur `--brand*` & gradient hero;
  `data-theme` (light/dark) mengatur netral. Terintegrasi ke token shadcn (`--primary`, `--card`, dll)
  supaya komponen shadcn ikut bertema. Default: **pink + light** (bukan ikut OS).
- **Dark variant pakai `data-theme`** (bukan class `.dark` bawaan shadcn) — `@custom-variant dark`
  diarahkan ke `[data-theme="dark"]`.
- **Anti-FOUC** — skrip init **inline sebagai string di `<body>`** (`layout.tsx`, via
  `dangerouslySetInnerHTML`) menyetel `data-theme`/`data-skin` sebelum paint; `<html suppressHydrationWarning>`.
  Skrip **tidak** boleh berupa komponen yang me-return `<script>` — React 19 tidak menjalankannya &
  memicu hydration error (bug ini sempat terjadi lalu diperbaiki).
- **ThemeSwitcher gated dengan `useSyncExternalStore`** (mounted-check) → render placeholder saat SSR,
  kontrol asli setelah mount. Menghindari hydration mismatch tanpa `setState`-in-effect (lolos lint).
- **Font via `next/font`** (Fraunces display, Nunito body) — tidak kena batasan CDN (beda dari artifact
  referensi yang pakai system font). Var `--font-fraunces`/`--font-nunito` → `--font-heading`/`--font-sans`.
- **Tombol "+ Keranjang" sementara menuju detail** — `AddToCartButton` (client, aksi nyata) menyusul
  di P3-03; struktur kartu sudah siap menerimanya.

## Cara verifikasi
- `curl /` → hero ("bikin gemas", "Lihat Katalog"), "+ Keranjang", tombol Warna Pink/Lavender/Mint.
- HTML memuat skrip init (`asterra-theme`) + var font `fraunces`/`nunito`.
- Manual: klik titik warna → aksen berubah; toggle ☀️/🌙 → light/dark; refresh → pilihan bertahan; **tanpa console error hydration**; buka default **light**.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` → semua lolos.

## Revisi lanjutan
- **Header nav** diganti dari link kategori (duplikat CategoryTabs) → "Katalog"/"Kontak" (`#katalog`/`#kontak`).
- **Hero** tombol "Lihat Katalog" dihapus (percuma—produk langsung di bawah); hero jadi banner sambutan.
- **Footer** dapat anchor `#kontak`.

## Catatan / penyimpangan
- Gambar produk masih placeholder `picsum` + `<img>`; migrasi ke Cloudinary + `next/image` di P4-03.
- Link "Kontak" ke `#kontak` (footer); jadi tautan WA nyata saat Setting siap (P3-04/P5-01).
- Switch tema = fitur toko (disetujui). Preferensi disimpan per-browser (localStorage), belum per-akun.
- Arah desain dicatat di memori proyek (`asterra-design-direction`).
