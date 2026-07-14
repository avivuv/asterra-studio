# Implementasi Fase 4 — Admin (P4-01, 02, 04, 05, 06)

- **Tiket:** P4-01, P4-02, P4-04, P4-05, P4-06 (P4-03 upload Cloudinary **ditunda**)
- **Tanggal:** 2026-07-14
- **Status:** ✅ Selesai (kecuali P4-03)

## Ringkasan
Area admin lengkap: login Auth.js, layout terproteksi + sidebar + logout, CRUD produk (validasi Zod,
slug unik, gambar via URL manual), status stok (badge Habis), dan CRUD kategori (dengan larangan hapus
kategori terpakai). Upload gambar Cloudinary (P4-03) ditunda sampai kredensial siap; sementara gambar
diisi via URL manual di form.

## File utama
| Area | File |
|------|------|
| Auth | `lib/auth.ts`, `lib/services/authService.ts`, `lib/repositories/userRepository.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/admin/login/page.tsx` |
| Layout admin | `app/admin/(protected)/layout.tsx`, `app/admin/(protected)/page.tsx`, `components/layout/AdminSidebar.tsx` |
| CRUD produk | `lib/validations/product.ts`, `productRepository`(+write), `productImageRepository`, `productService`(+write), `app/admin/(protected)/produk/{page,actions,baru,[id]}`, `components/product/{ProductForm,DeleteProductButton}` |
| CRUD kategori | `lib/validations/category.ts`, `categoryRepository`, `categoryService`, `app/admin/(protected)/kategori/{page,actions,[id]}`, `components/category/{CategoryManager,CategoryEditForm}` |

## Keputusan penting
- **Auth.js v5 (NextAuth beta)** credentials + `AUTH_SECRET`. `authorize()` → `authService.verifyCredentials`
  (bcrypt compare). Session JWT. `authService`/`userRepository` ikut pola layer.
- **Route group `(protected)`** — `app/admin/(protected)/layout.tsx` cek `auth()` → redirect login bila
  null. Halaman `/admin/login` **di luar** grup ini agar tak kena loop redirect.
- **Controller (actions) tipis** — tiap Server Action: `requireAdmin()` → `safeParse` Zod → Service →
  `revalidatePath`/`redirect`. Tak ada Prisma/slug di action (RULES §1.1).
- **Slug unik di Service** — `makeUniqueSlug(name, excludeId?)` tambah suffix `-2`, `-3` bila bentrok.
- **Gambar via URL manual (sementara)** — `imageUrl` opsional di Zod; disimpan ke `ProductImage`
  (`publicId=""`). Diganti upload Cloudinary di P4-03.
- **Kategori: larang hapus bila terpakai** — `categoryService.deleteCategory` cek `countProducts>0`
  → kembalikan `{ok:false,error}` (FEATURES J).
- **P4-05 status stok** sudah terpenuhi sejak P2-03/P2-05 (badge "Habis" di card+detail, AddToCartButton
  disabled saat stok 0) — tidak ada kode baru, hanya diverifikasi.

## Cara verifikasi
- `/admin` tanpa login → **307** ke `/admin/login`. POST credentials seed → **302** + cookie
  `authjs.session-token`; akses `/admin` dgn cookie → **200**.
- `/admin/produk` (session) → tabel produk; `/admin/produk/<id>` → form terisi (`value="Casing HP Bening"`);
  `/admin/produk/baru` → form kosong. `/admin/kategori` → daftar + form tambah.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` → lolos; semua route admin ter-generate.

## Catatan / penyimpangan
- **P4-03 (Cloudinary) ditunda** — form pakai URL gambar manual. Saat kredensial siap: buat `imageService`,
  ganti input URL dengan uploader, isi `publicId`.
- Uji CRUD lewat HTTP + session (bukan tsx — tsx punya isu resolusi adapter di luar Next; runtime Next
  terbukti jalan via 200 di semua halaman ber-DB).
- Toggle aktif via checkbox `isActive` (Zod coerce boolean).
