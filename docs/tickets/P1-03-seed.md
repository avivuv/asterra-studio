# P1-03 — Seed (kategori, admin, setting)

- **Fase:** 1
- **Fitur terkait (FEATURES.md):** —
- **Prioritas:** P0
- **Dependency:** P1-02
- **Status:** ✅ Done — lihat [`../implementations/P1-03-seed.md`](../implementations/P1-03-seed.md)

## Tujuan
Mengisi data awal agar aplikasi bisa langsung dijalankan: 3 kategori, 1 admin, 1 baris Setting.

## Scope
- `prisma/seed.ts` sesuai [`../DATABASE.md`](../DATABASE.md) §5.
- 3 kategori: `phone-accessory`, `keychain`, `bag-charm`.
- 1 admin: email + password **hash bcrypt**; kredensial dari **env**, bukan hardcode.
- 1 baris `Setting` (`id: "default"`) via **upsert**.
- (Opsional) beberapa produk contoh + gambar dummy untuk uji tampilan.
- Config `prisma db seed` di `package.json`.

## Di luar scope
- Registrasi publik (admin dibuat via seed saja).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Seed | `prisma/seed.ts` |
| Config | `package.json` (`prisma.seed`) |

## Langkah kerja
1. `npm i bcrypt` (+ `@types/bcrypt`).
2. Tulis seed: kategori (create/upsert idempoten), admin (baca `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`
   dari env, hash bcrypt), Setting upsert `id:"default"`.
3. Daftarkan `"seed": "tsx prisma/seed.ts"` (atau ts-node) di `package.json`.
4. `npx prisma db seed`; verifikasi via `prisma studio`.

## Definition of Done
- [ ] `prisma db seed` idempoten (aman dijalankan ulang).
- [ ] Password admin tersimpan sebagai hash bcrypt, bukan plaintext (RULES §5).
- [ ] Kredensial admin dari env, tidak ada di repo.
- [ ] Setting tepat 1 baris (`id:"default"`).
- [ ] Dokumen implementasi di `docs/implementations/P1-03-seed.md`.
