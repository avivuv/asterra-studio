# P5-03 — Deploy Vercel + migrasi PlanetScale

- **Fase:** 5
- **Fitur terkait (FEATURES.md):** —
- **Prioritas:** P0
- **Dependency:** semua tiket P0
- **Status:** ⬜ Todo

## Tujuan
Menerbitkan aplikasi ke Vercel dengan DB MySQL serverless (PlanetScale), tanpa mengubah kode aplikasi.

## Scope
- Provisioning DB produksi (PlanetScale free / alternatif berpooling).
- `relationMode = "prisma"` bila PlanetScale (FK fisik tak didukung — DATABASE §3 catatan).
- Set env produksi di Vercel (`DATABASE_URL`, `NEXTAUTH_*`, `CLOUDINARY_*`).
- Jalankan migrasi ke DB produksi + seed admin/kategori/setting.
- Verifikasi Prisma singleton menahan ledakan koneksi serverless (CLAUDE.md §2).

## Di luar scope
- CDN kustom, domain (opsional, di luar tiket ini).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Prisma | `prisma/schema.prisma` (`relationMode` bila perlu) |
| Config | env Vercel |

## Langkah kerja
1. Buat DB produksi; ambil `DATABASE_URL` berpooling.
2. Bila PlanetScale: set `relationMode="prisma"`, pastikan `@@index` FK ada.
3. Isi env di Vercel; deploy.
4. `prisma migrate deploy` + seed (admin dari env produksi).
5. Uji alur publik (katalog→keranjang→checkout WA) & admin (login→CRUD) di produksi.

## Definition of Done
- [ ] Aplikasi live di Vercel; DB produksi terhubung.
- [ ] Hanya `DATABASE_URL` yang berubah dari lokal (kode tak berubah — CLAUDE.md §2).
- [ ] Tidak ada error "too many connections" (singleton bekerja).
- [ ] Alur publik & admin lolos uji di produksi.
- [ ] Dokumen implementasi di `docs/implementations/P5-03-deploy.md`.
