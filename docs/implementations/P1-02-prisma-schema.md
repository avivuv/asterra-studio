# Implementasi P1-02 — Prisma singleton + schema + migrasi

- **Tiket:** [`../tickets/P1-02-prisma-schema.md`](../tickets/P1-02-prisma-schema.md)
- **Tanggal:** 2026-07-13
- **Status:** ✅ Selesai

## Ringkasan
Prisma dipasang (v7.8) dengan pola **Prisma 7**: koneksi lewat `prisma.config.ts` + driver adapter
(`@prisma/adapter-mariadb`, kompatibel MySQL), bukan `url` di schema. Schema semua model dibuat sesuai
`DATABASE.md`, singleton `lib/prisma.ts` dibuat, dan migrasi diterapkan ke DB `asterra_studio` yang
dijalankan via **Docker** (MySQL 8.0, case-sensitive). Tabel tersimpan PascalCase asli
(`Category`, `Product`, `ProductImage`, `Setting`, `User`) + `_prisma_migrations`.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `prisma/schema.prisma` | dibuat: 5 model (Category, Product, ProductImage+`publicId`, User, Setting) + index; generator `prisma-client` output `lib/generated/prisma`; datasource tanpa `url` |
| `prisma.config.ts` | dibuat: muat `.env.local`/`.env` via dotenv, `datasource.url` untuk Migrate/Studio |
| `lib/prisma.ts` | dibuat: singleton `PrismaClient` + `PrismaMariaDb` adapter |
| `prisma/migrations/…_init/` | migrasi pertama (init) diterapkan |
| `package.json` | tambah `postinstall: prisma generate` |
| `.env.local` | dibuat (tidak di-commit): `DATABASE_URL` Laragon + secret dev |
| `.gitignore` | ignore `/lib/generated` |
| DB `asterra_studio` | dibuat utf8mb4 di MySQL Laragon |

## Keputusan penting
- **Prisma 7 + driver adapter (disepakati pemilik).** npm memasang Prisma 7 yang menghapus `url` dari
  schema. Dipilih mengikuti Prisma 7 (bukan downgrade): URL di `prisma.config.ts` (CLI) + adapter
  `@prisma/adapter-mariadb` di runtime. `docs/DATABASE.md` §3 & `CLAUDE.md` §2 sudah disesuaikan.
- **Generator `prisma-client` → `lib/generated/prisma`.** Prisma 7 default; client di-import dari
  `@/lib/generated/prisma/client` di `lib/prisma.ts`. Folder di-gitignore + di-generate via `postinstall`.
- **`prisma.config.ts` memuat `.env.local` manual.** Prisma CLI jalan di luar Next.js sehingga tidak
  otomatis membaca `.env.local`; dotenv diarahkan eksplisit `[".env.local", ".env"]`.
- **`datasource.url` tetap ada di config** (bukan hanya adapter) karena `migrate dev` mewajibkannya.
  Percobaan menaruh `adapter` di dalam `migrations` ditolak type-check → dihapus; `datasource.url`
  sudah cukup untuk Migrate.
- **Adapter MariaDB untuk MySQL** — adapter MySQL resmi Prisma; kompatibel penuh dengan MySQL 8 Docker
  dan MySQL serverless produksi (hanya `DATABASE_URL` yang berganti).
- **DB via Docker case-sensitive (bukan Laragon).** Awalnya migrate di Laragon (Windows, port 3306).
  Pemilik memilih pindah ke Docker agar DB lokal **meniru kondisi asli produksi (Linux)**. Setelah
  sempat menyetel `lower_case_table_names=1`, disepakati **menghapusnya** → container memakai default
  Linux `=0` (case-sensitive). Volume di-recreate (`down -v`) dan migrasi diterapkan ulang; tabel
  tersimpan PascalCase asli (`Product`, `ProductImage`, dst). Port host **3307** (hindari bentrok Laragon).
- **`description` jadi nullable (bukan `@default("")`).** MySQL strict menolak `DEFAULT` pada kolom
  `TEXT` (error 1101). Ketahuan hanya di Docker MySQL (Laragon longgar menerimanya) — bukti pindah ke
  Docker berguna. Schema diubah `String? @db.Text`; `DATABASE.md` disesuaikan.

## Cara verifikasi
- `docker compose up -d` → MySQL healthy; `lower_case_table_names=0`.
- `npx prisma migrate deploy` → migrasi `..._init` diterapkan.
- `SHOW TABLES` di `asterra_studio` → `Category, Product, ProductImage, Setting, User, _prisma_migrations` (PascalCase).
- `SHOW COLUMNS FROM Product LIKE 'description'` → `text, Null=YES, Default=NULL`.
- `npx prisma generate` → client ter-generate ke `lib/generated/prisma`.
- `npx tsc --noEmit` → 0 error.

## Catatan / penyimpangan
- Versi Prisma 6→7 mengubah pola koneksi; docs (`DATABASE.md`, `CLAUDE.md`) sudah diperbarui.
- DB pindah Laragon→Docker (case-sensitive) + `docker-compose.yml` ditambahkan; `DATABASE.md` §0 &
  `CLAUDE.md` §2/§9 diperbarui. **Jangan** pakai Laragon untuk project ini.
- `description` nullable (penyesuaian dari `@default("")`) — Repository/Service perlakukan `null` = tanpa deskripsi.
- Belum ada Repository yang meng-query Prisma (sesuai scope; query pertama muncul di P2-01).
- `.env.local` memakai secret dev sederhana — ganti untuk produksi (P5-03).
