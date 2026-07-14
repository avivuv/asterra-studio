# P1-02 — Prisma singleton + schema + migrasi

- **Fase:** 1
- **Fitur terkait (FEATURES.md):** —
- **Prioritas:** P0
- **Dependency:** P1-01
- **Status:** ✅ Done — lihat [`../implementations/P1-02-prisma-schema.md`](../implementations/P1-02-prisma-schema.md)

## Tujuan
Menyiapkan Prisma: client singleton, schema semua model, dan migrasi pertama ke MySQL lokal (Docker).

## Scope
- Install Prisma + `@prisma/client`.
- `lib/prisma.ts` — **singleton** (hindari koneksi berlebih saat hot-reload/serverless).
- `prisma/schema.prisma` sesuai [`../DATABASE.md`](../DATABASE.md) §3: `Category`, `Product`,
  `ProductImage` (termasuk `publicId`), `User`, `Setting`.
- Index sesuai DATABASE §6.
- Migrasi pertama (`prisma migrate dev --name init`) ke DB `asterra_studio`.

## Di luar scope
- Seed (P1-03), repository apa pun (query Prisma baru muncul di tiket repository).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Prisma | `prisma/schema.prisma` |
| Singleton | `lib/prisma.ts` |

## Langkah kerja
1. `npm i -D prisma` + `npm i @prisma/client`; `npx prisma init`.
2. `docker compose up -d` (MySQL Docker, port 3307, DB `asterra_studio` otomatis dibuat).
3. Set `DATABASE_URL` di `.env.local` (`mysql://root:root@localhost:3307/asterra_studio`).
4. Tulis schema persis mengikuti DATABASE.md (jangan lupa `publicId` di `ProductImage`).
5. `lib/prisma.ts` pola singleton `globalThis`.
6. `npx prisma migrate dev --name init`; verifikasi dengan `npx prisma studio`.

## Definition of Done
- [ ] Migrasi sukses; tabel muncul di `prisma studio`.
- [ ] `lib/prisma.ts` satu-satunya instansiasi `PrismaClient` (RULES §1.2).
- [ ] Schema cocok 100% dengan DATABASE.md (kolom + index + `onDelete`).
- [ ] Dokumen implementasi di `docs/implementations/P1-02-prisma-schema.md`.
