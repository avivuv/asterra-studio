# Implementasi P5-03 — Persiapan Deploy (Vercel + MySQL serverless)

- **Tiket:** [`../tickets/P5-03-deploy.md`](../tickets/P5-03-deploy.md)
- **Tanggal:** 2026-07-14
- **Status:** 🟡 Siap deploy — kode production-ready; langkah live butuh aksi user (lihat `../DEPLOY.md`)

## Ringkasan
Repo disiapkan untuk deploy ke **Vercel + MySQL serverless** (gambar tetap Cloudinary). Kode & konfigurasi
sudah production-ready; go-live tinggal ikuti panduan langkah demi langkah di `docs/DEPLOY.md`.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `lib/prisma.ts` | catatan pooling; koneksi via `DATABASE_URL` (limit diatur via `?connectionLimit=N`) |
| `package.json` | script `db:deploy` (migrate deploy) & `db:seed` |
| `docs/DEPLOY.md` | **panduan deploy lengkap** (DB serverless → GitHub → Vercel → migrasi/seed → verifikasi) |
| (git) | `git init` + commit awal (152 file; secret/node_modules/generated ter-ignore) |

## Keputusan penting
- **Vercel + DB serverless** (pilihan pemilik) — Docker hanya untuk dev lokal, tidak ikut produksi.
- **Connection pooling via URL** — `PrismaMariaDb` adapter menerima string; batasi koneksi dengan
  `?connectionLimit=3` di `DATABASE_URL` produksi agar serverless tak menghabiskan koneksi MySQL.
  (Config object `{url, connectionLimit}` ditolak tipe adapter — pakai query param.)
- **Migrasi manual, bukan di build** — `npm run db:deploy` dijalankan terpisah menunjuk DB produksi,
  supaya build Vercel tak gagal karena kondisi DB. Seed via `npm run db:seed`.
- **Secret aman** — `.env.local` ter-gitignore; diverifikasi tak ter-stage sebelum commit. Kredensial
  produksi diisi di Environment Variables Vercel.
- **Catatan limit upload** — Vercel function body ~4.5 MB; `imageService` batasi 5 MB (bisa diturunkan).

## Cara verifikasi
- `npx tsc --noEmit`, `npm run build` → lolos dengan konfigurasi produksi.
- `git status` → `.env.local` tidak ter-stage; `git ls-files` 152 file bersih.
- Langkah live (DB provisioning, push GitHub, deploy Vercel, migrate/seed) didokumentasikan di `DEPLOY.md`
  — dieksekusi oleh pemilik karena butuh akun eksternal.

## Catatan / penyimpangan
- Tiket menyebut PlanetScale; panduan merekomendasikan **Railway** (MySQL asli, paling gampang) dengan
  catatan PlanetScale (`relationMode="prisma"`) bila dipilih.
- Belum benar-benar live — status 🟡 sampai pemilik menjalankan `DEPLOY.md`.
