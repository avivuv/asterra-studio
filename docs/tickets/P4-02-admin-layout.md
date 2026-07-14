# P4-02 — Layout admin + AdminSidebar + logout

- **Fase:** 4
- **Fitur terkait (FEATURES.md):** G
- **Prioritas:** P0
- **Dependency:** P4-01
- **Status:** ✅ Done — lihat ../implementations/P4-fase4-admin.md

## Tujuan
Kerangka area admin: proteksi auth di `app/admin/layout.tsx`, sidebar navigasi, dan logout.

## Scope
- `app/admin/layout.tsx` — cek session; belum login → redirect ke `/admin/login`.
- `components/layout/AdminSidebar.tsx` — link ke Produk, Kategori, Pengaturan, Dashboard.
- Tombol logout.

## Di luar scope
- Isi tiap halaman admin (tiket masing-masing).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Controller | `app/admin/layout.tsx` |
| Komponen | `components/layout/AdminSidebar.tsx` |

## Langkah kerja
1. Layout admin baca session (server); redirect bila tidak ada.
2. Sidebar sebagai Server Component kecuali butuh interaksi (mis. active state → boleh client minimal).
3. Semua route `/admin/**` otomatis terlindungi via layout ini (RULES §5).

## Definition of Done
- [ ] Akses `/admin/**` tanpa login → redirect ke login.
- [ ] Setelah login → area admin + sidebar tampil; logout bekerja.
- [ ] Proteksi terpusat di `app/admin/layout.tsx`.
- [ ] Dokumen implementasi di `docs/implementations/P4-02-admin-layout.md`.
