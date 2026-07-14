# P5-01 — Pengaturan toko

- **Fase:** 5
- **Fitur terkait (FEATURES.md):** K
- **Prioritas:** P0
- **Dependency:** P4-02, P3-04
- **Status:** ✅ Done — lihat ../implementations/P5-01-pengaturan-toko.md

## Tujuan
Admin mengatur data toko (nama, nomor WA, template pesan) yang dipakai fitur checkout WhatsApp.

## Scope
- `lib/repositories/settingRepository.ts` (tambah `upsert`).
- `lib/services/settingService.ts` — `get()`, `update(data)` (jaga singleton `id:"default"`).
- `lib/validations/setting.ts` (Zod) — validasi `waNumber` format `628xxx`, dll.
- Controller `app/admin/pengaturan/page.tsx` + action + form.

## Di luar scope
- Multi-toko / multi-config.

## Layer yang disentuh
| Layer | File |
|-------|------|
| Validasi | `lib/validations/setting.ts` |
| Repository | `lib/repositories/settingRepository.ts` |
| Service | `lib/services/settingService.ts` |
| Controller | `app/admin/pengaturan/page.tsx`, `actions.ts` |

## Langkah kerja
1. Form terisi nilai Setting saat ini (`settingService.get`).
2. Simpan via `update` → repository `upsert` (`id:"default"`) — tetap 1 baris.
3. Validasi `waNumber` tanpa `+`/`0`.

## Definition of Done
- [ ] Ubah nama toko/nomor WA/template tersimpan & langsung dipakai checkout (P3-04).
- [ ] Setting tetap tepat 1 baris (upsert).
- [ ] `waNumber` tervalidasi format internasional.
- [ ] Dokumen implementasi di `docs/implementations/P5-01-pengaturan-toko.md`.
