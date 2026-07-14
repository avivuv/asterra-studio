# Implementasi P1-03 — Seed (kategori, admin, setting)

- **Tiket:** [`../tickets/P1-03-seed.md`](../tickets/P1-03-seed.md)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai

## Ringkasan
`prisma/seed.ts` dibuat & dijalankan: mengisi 3 kategori, 1 admin (password hash bcrypt dari env), dan
1 baris `Setting` singleton. Seed **idempoten** (semua `upsert`) — diuji jalan 2× tetap 3/1/1 tanpa
duplikat. Didaftarkan lewat `prisma.config.ts` (`migrations.seed`).

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `prisma/seed.ts` | dibuat: seedCategories/seedAdmin/seedSetting + koneksi via adapter |
| `prisma.config.ts` | tambah `migrations.seed = "tsx prisma/seed.ts"` |
| `package.json` | tambah dep `bcryptjs`, devDep `@types/bcryptjs`, `tsx` |

## Keputusan penting
- **`bcryptjs` (bukan `bcrypt` native).** Pure-JS, tanpa kompilasi native — lebih andal di Windows &
  serverless (Vercel). Menghasilkan hash bcrypt kompatibel (`$2b$10$…`, 60 char), tetap memenuhi
  aturan "password wajib hash bcrypt" (RULES §5).
- **Kredensial admin dari env** (`SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`), bukan hardcode — seed
  melempar error bila kosong. Tidak ada kredensial di repo.
- **Seed via `tsx`** (Prisma 7 `migrations.seed`), memuat `.env.local` manual (jalan di luar Next.js),
  konek pakai `PrismaMariaDb` adapter yang sama dengan `lib/prisma.ts`.
- **Semua `upsert`** (kategori by `slug`, admin by `email`, setting by `id:"default"`) → idempoten,
  aman dijalankan berkali-kali. Setting selalu satu baris (singleton).
- **`waNumber` & `messageTemplate` placeholder** — nilai final diatur admin lewat halaman Pengaturan (P5-01).

## Cara verifikasi
- `npx prisma db seed` → output `✔ 3 kategori / ✔ admin / ✔ setting`.
- Jalankan **2×** → `SELECT COUNT(*)`: Category=3, User=1, Setting=1 (tidak bertambah = idempoten).
- `SELECT slug FROM Category` → `bag-charm, keychain, phone-accessory`.
- `SELECT LEFT(password,7), LENGTH(password) FROM User` → `$2b$10$`, `60` (hash bcrypt, bukan plaintext).
- `SELECT id, storeName FROM Setting` → `default`, `Asterra Studio`.
- `npx tsc --noEmit` & `npm run lint` → lolos.

## Catatan / penyimpangan
- Tiket menyebut "bcrypt" generik; dipakai `bcryptjs` (hash tetap bcrypt-kompatibel).
- Produk contoh (opsional di tiket) **tidak** di-seed — belum diperlukan; ditambah bila butuh uji tampilan.
- `.env.local` memakai password admin dev sederhana (`admin12345`) — ganti untuk produksi (P5-03).
