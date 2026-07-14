# P2-04 — Filter kategori + pencarian

- **Fase:** 2
- **Fitur terkait (FEATURES.md):** B, C
- **Prioritas:** P0
- **Dependency:** P2-03
- **Status:** ✅ Done — lihat [`../implementations/P2-04-filter-search.md`](../implementations/P2-04-filter-search.md)

## Tujuan
Pengunjung bisa menyaring katalog per kategori dan mencari produk berdasarkan nama, via query string URL.

## Scope
- `components/product/CategoryTabs.tsx` (Client) — tab kategori; klik → update `?category=<slug>`.
- `components/product/SearchBox.tsx` (Client) — input + debounce → update `?search=<q>`.
- Controller `page.tsx` meneruskan `searchParams.category` & `.search` ke `getCatalog`.
- Filter & search bisa digabung.

## Di luar scope
- Full-text search DB (tidak perlu, skala kecil — FEATURES C).

## Layer yang disentuh
| Layer | File |
|-------|------|
| Controller | `app/(public)/page.tsx` (teruskan searchParams) |
| Komponen | `CategoryTabs.tsx`, `SearchBox.tsx` (client) |

## Langkah kerja
1. Komponen filter/search `"use client"` (butuh interaksi + update URL via router).
2. Logika filter tetap di `productService.getCatalog` (jangan di komponen — RULES §1.3).
3. Kategori aktif ditandai; state diambil dari URL (bukan state lokal terpisah).

## Definition of Done
- [ ] `/?category=keychain` menyaring; `/?search=gantungan` mencari; keduanya bisa digabung.
- [ ] Logika filter/search ada di Service, komponen hanya update URL.
- [ ] `"use client"` hanya di komponen interaktif.
- [ ] Dokumen implementasi di `docs/implementations/P2-04-filter-search.md`.
