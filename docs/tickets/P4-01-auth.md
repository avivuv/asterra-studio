# P4-01 — Auth.js credentials + proteksi /admin

- **Fase:** 4
- **Fitur terkait (FEATURES.md):** G
- **Prioritas:** P0
- **Dependency:** P1-02, P1-03
- **Status:** ✅ Done — lihat ../implementations/P4-fase4-admin.md

## Tujuan
Login admin (email + password) via Auth.js credentials, dengan proteksi seluruh route `/admin/**`.

## Scope
- `lib/auth.ts` — konfigurasi Auth.js (credentials provider).
- `lib/repositories/userRepository.ts` — `findByEmail(email)`.
- `lib/services/authService.ts` — `verifyCredentials(email, password)` (bandingkan hash bcrypt).
- Halaman `app/admin/login/page.tsx` + form login.
- Handler route Auth.js (`app/api/auth/[...nextauth]/route.ts` atau sesuai versi).

## Di luar scope
- Layout/sidebar admin (P4-02), registrasi publik (tidak ada).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Config | `lib/auth.ts`, `app/api/auth/[...]/route.ts` |
| Repository | `lib/repositories/userRepository.ts` |
| Service | `lib/services/authService.ts` |
| Controller | `app/admin/login/page.tsx` |

## Langkah kerja
1. `npm i next-auth` (Auth.js) + gunakan bcrypt (dari P1-03).
2. `authService.verifyCredentials` — cari user via repo, `bcrypt.compare`.
3. `NEXTAUTH_SECRET`/`NEXTAUTH_URL` dari env.
4. Proteksi diverifikasi lengkap di P4-02 (layout), tapi session sudah aktif di sini.

## Definition of Done
- [ ] Login dengan kredensial seed berhasil; salah → ditolak.
- [ ] Password dibandingkan via bcrypt (tak pernah plaintext — RULES §5).
- [ ] Query user hanya di `userRepository`.
- [ ] Secret dari env, tidak di kode.
- [ ] Dokumen implementasi di `docs/implementations/P4-01-auth.md`.
