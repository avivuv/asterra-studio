# P1-01 — Scaffold Next.js + TS + Tailwind + shadcn

- **Fase:** 1
- **Fitur terkait (FEATURES.md):** —
- **Prioritas:** P0
- **Dependency:** —
- **Status:** ✅ Done — lihat [`../implementations/P1-01-scaffold.md`](../implementations/P1-01-scaffold.md)

## Tujuan
Menyiapkan project Next.js 16 (App Router) + TypeScript strict + Tailwind + shadcn/ui sebagai fondasi
semua fitur berikutnya.

## Scope
- Init Next.js 15 App Router + TypeScript (`strict: true`).
- Setup Tailwind CSS.
- Init shadcn/ui (`components/ui/`), tambah beberapa komponen dasar (button, input, card).
- Alias import `@/` ke root.
- Struktur folder awal sesuai `CLAUDE.md` §4 (`app/(public)`, `app/admin`, `lib/`, `components/`).
- `.env.example` awal (`DATABASE_URL`, `NEXTAUTH_*`, `CLOUDINARY_*`).
- Script `dev/build/lint` di `package.json`.

## Di luar scope
- Prisma/DB (P1-02), auth (P4-01), fitur apa pun.

## Layer yang disentuh
| Layer | File |
|-------|------|
| Config | `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `components.json` |
| Struktur | `app/`, `lib/`, `components/ui/` |
| Env | `.env.example` |

## Langkah kerja
1. `npx create-next-app@latest` (TS, App Router, Tailwind, alias `@/`).
2. `npx shadcn@latest init`, lalu tambah button/input/card.
3. Buat folder kosong sesuai peta folder (jangan bikin file service/repo kosong — RULES §7).
4. Isi `.env.example`.
5. Pastikan `npm run dev` jalan (halaman default), `npm run lint` & `npm run build` lolos.

## Definition of Done
- [ ] `npm run dev` menampilkan halaman di `localhost:3000`.
- [ ] `npm run lint` & `npm run build` lolos.
- [ ] TypeScript `strict` aktif, alias `@/` berfungsi.
- [ ] `.env.example` berisi semua variabel dari `CLAUDE.md` §8.
- [ ] Dokumen implementasi ditulis di `docs/implementations/P1-01-scaffold.md`.
