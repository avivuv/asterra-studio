# Implementasi P1-01 — Scaffold Next.js + TS + Tailwind + shadcn

- **Tiket:** [`../tickets/P1-01-scaffold.md`](../tickets/P1-01-scaffold.md)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai

## Ringkasan
Project di-scaffold dengan `create-next-app` (Next.js 16 App Router, TypeScript strict, Tailwind v4,
ESLint) lalu shadcn/ui di-init dengan komponen dasar. Struktur folder target dibentuk sesuai
`CLAUDE.md` §4 dan beranda dipindah ke route group `(public)`. `lint` & `build` lolos.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` | dibuat oleh create-next-app; `name` diset `asterra-studio` |
| `components.json`, `lib/utils.ts`, `app/globals.css` | dibuat/diupdate oleh shadcn init (preset radix-nova) |
| `components/ui/{button,input,card}.tsx` | komponen shadcn dasar |
| `app/layout.tsx` | metadata → brand Asterra Studio; `lang="id"` |
| `app/(public)/page.tsx` | beranda dipindah ke route group `(public)` + placeholder Bahasa Indonesia |
| `app/page.tsx` | dihapus (dipindah ke `(public)`) |
| `.env.example` | dibuat: DATABASE_URL, NEXTAUTH_*, CLOUDINARY_*, SEED_ADMIN_* |
| `.gitignore` | tambah `!.env.example` agar contoh env tetap ter-commit |
| Folder + `.gitkeep` | `lib/{repositories,services,validations}`, `components/{product,cart,layout}`, `prisma/`, `app/admin/{login,produk,kategori,pengaturan}` |

## Keputusan penting
- **Next.js 16 (bukan 15).** `create-next-app@latest` memasang Next 16.2 + React 19. Disepakati
  dengan pemilik untuk memakai Next 16 dan memperbarui `CLAUDE.md` §2 (bukan downgrade) — semua pola
  arsitektur (Server Components, Server Actions, `generateMetadata`) tetap berlaku.
- **Scaffold via subfolder sementara** (`scaffold-tmp`) lalu isinya dipindah ke root, karena
  create-next-app menolak folder non-kosong. `CLAUDE.md` & `docs/` root dipertahankan; `CLAUDE.md`
  dan `AGENTS.md` bawaan generator dibuang agar tidak menimpa dokumentasi kita.
- **Tidak membuat file service/repository kosong** (RULES §7 / ARCHITECTURE §5). Folder ditandai
  `.gitkeep` saja; file diisi saat tiket terkait dikerjakan.
- **Beranda di `(public)`** sejak awal agar route publik & admin terpisah rapi untuk Fase 2–5.
- **shadcn preset:** `radix` base + preset `nova` (Lucide + Geist) — dipilih non-interaktif karena
  CLI versi ini mewajibkan preset.

## Cara verifikasi
- `npm run lint` → lolos tanpa warning.
- `npm run build` → **Compiled successfully**, TypeScript lolos, route `/` ter-generate (static)
  dari `app/(public)/page.tsx`.
- Hasil: kedua perintah hijau (Definition of Done terpenuhi).

## Catatan / penyimpangan
- Versi Next 15 → 16 (dijelaskan di atas); `CLAUDE.md` §2 & tiket P1-01 sudah disesuaikan.
- `npm audit` melaporkan 2 moderate vulnerability bawaan template — belum ditindak (di luar scope
  scaffold; tinjau saat mendekati deploy P5-03).
- Tailwind v4 (bukan config file lama) — konfigurasi via `app/globals.css` + `@tailwindcss/postcss`.
