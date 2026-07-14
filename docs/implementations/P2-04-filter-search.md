# Implementasi P2-04 — Filter kategori + pencarian

- **Tiket:** [`../tickets/P2-04-filter-search.md`](../tickets/P2-04-filter-search.md)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Menambah UI interaktif untuk menyaring katalog: `CategoryTabs` (tab kategori) dan `SearchBox` (kotak
cari dengan debounce). Keduanya mengubah query string URL; logika filter tetap di `productService`
(Controller membaca `searchParams`). Filter + search bisa digabung.

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `components/product/CategoryTabs.tsx` | Client: tab kategori (termasuk "Semua") → set/hapus `?category` |
| `components/product/SearchBox.tsx` | Client: input + debounce 300ms → set/hapus `?search` |
| `app/(public)/page.tsx` | pasang SearchBox + CategoryTabs di atas grid |

## Keputusan penting
- **State ada di URL, bukan komponen** — sumber kebenaran tunggal `searchParams`; komponen hanya
  `router.push/replace`. Reload/share URL tetap konsisten (RULES §1.3: logika filter di Service).
- **CategoryTabs `push`, SearchBox `replace`** — klik kategori = navigasi (masuk history); ketik cari =
  ganti entri (tak menumpuk history tiap huruf). `scroll:false` agar posisi tak melompat.
- **Tab "Semua"** menghapus `?category` (toggle ke semua produk).
- **Debounce 300ms** pada search — tulis URL setelah user berhenti mengetik; membaca `searchParams`
  terkini saat efek jalan (deps `[value]`, dengan `eslint-disable exhaustive-deps` beralasan).
- **Filter + search digabung** — keduanya memodifikasi `URLSearchParams` yang sama, tidak saling hapus.

## Cara verifikasi
- `curl /` → "Cari produk…", tab "Semua"+3 kategori, `aria-pressed` menandai aktif.
- `/?category=keychain` → hanya keychain; ketik di kotak cari → grid menyaring (debounce).
- Klik kategori lalu ketik cari → keduanya aktif bersamaan.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` → lolos (route `/` ƒ Dynamic).

## Catatan / penyimpangan
- `useSearchParams` tidak butuh Suspense terpisah karena route sudah dynamic (baca searchParams di page).
- Tampilan tab & input mengikuti tema pastel (token `--brand`, `bg-muted`).
