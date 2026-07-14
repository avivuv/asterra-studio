# Implementasi UI-02 — DataTable admin (paging/search/sort)

- **Tiket:** — (peningkatan UI admin; menyempurnakan tabel P4-04)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai

## Ringkasan
Tabel produk admin diganti dari tabel HTML polos → **DataTable** (TanStack Table + shadcn) dengan
pencarian global, sorting per kolom, dan pagination — semua client-side (cocok skala <100 produk).
Area admin sudah full width (layout `flex-1`, tanpa max-width).

## File yang dibuat / diubah
| File | Perubahan |
|------|-----------|
| `components/ui/data-table.tsx` | DataTable generic reusable (search/sort/paging) |
| `components/ui/table.tsx` | komponen shadcn Table (ditambahkan) |
| `components/product/ProductTable.tsx` | kolom produk + pakai DataTable; tipe `ProductRow` |
| `app/admin/(protected)/produk/page.tsx` | map produk → `ProductRow` → `<ProductTable>` |

## Keputusan penting
- **TanStack Table (headless) + shadcn** — dipilih pemilik. Client-side sorting/filter/pagination via
  `getSortedRowModel`/`getFilteredRowModel`/`getPaginationRowModel`. Tepat untuk <100 baris; tak perlu
  server-side pagination (over-engineering).
- **DataTable generic reusable** — menerima `columns` + `data`; bisa dipakai ulang untuk tabel lain
  (mis. kategori) tanpa duplikasi.
- **Server Component map ke row ringkas** — halaman (Server) ambil data via Service lalu map ke
  `ProductRow` (plain) dan lempar ke tabel (Client). View tak mengimpor Prisma (RULES §3).
- **Full width** — layout admin `(protected)` sudah `flex-1` tanpa max-width; tabel `overflow-x-auto`
  mengisi lebar konten (dikurangi sidebar).
- **Search = global filter** TanStack (cari di semua kolom); pageSize default 10.

## Cara verifikasi
- `/admin/produk` (session) → search "Cari produk…", header sortable (ikon), pagination
  ("Sebelumnya"/"Berikutnya" + "N baris · halaman X dari Y"), data produk tampil.
- `npx tsc --noEmit` → 0 error; `npm run build` → lolos.
- `npm run lint` → 0 error (1 warning `react-hooks/incompatible-library` dari useReactTable — benign).

## Revisi lanjutan
- **Aksi = button + icon** (bukan teks) — `components/ui/icon-button.tsx` (`IconLink`/`IconButton`,
  varian netral & danger). Edit = ikon Pencil, Hapus = ikon Trash2 (danger, spinner saat pending).
- **Tabel kategori diseragamkan ke DataTable** — `CategoryTable` (kolom Nama/Slug/Aksi) + `CategoryAddForm`
  (form tambah terpisah). `CategoryManager` lama dihapus. Halaman kategori = form tambah + DataTable.

## Lebar & align kolom terstandar
- DataTable pakai `table-layout: fixed` + `<colgroup>`. Lebar & perataan lewat **`columnDef.meta`**
  (`{ width?: number; align?: "left"|"right"|"center" }`) — **bukan** `columnDef.size` (TanStack meng-
  default `size` ke 150, jadi tak pernah undefined; itu sempat bikin kolom "auto" keliru dapat 150px).
- **Kolom tanpa `meta.width` = melar** mengisi sisa; distandarkan ke **Nama** di semua tabel.
- **Aksi: `width 100 + align right`** identik di produk & kategori → selalu menempel kanan, sejajar antar
  tabel. Produk: Kategori 160 / Harga 130 (right) / Stok 90 (right) / Status 110. Kategori: Slug 220.
- Cell teks pakai `truncate`. Hasil: struktur tabel seragam antar fitur; tabel baru ikuti pola
  (Nama tanpa width, Aksi `{width:100, align:"right"}`).

## Catatan / penyimpangan
- Lint warning TanStack (bukan error) — pola resmi library; tak menggagalkan build.
- Hapus kategori terpakai → alert berisi alasan (dari service guard FEATURES J).
