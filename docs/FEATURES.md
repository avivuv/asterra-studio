# Rancangan Fitur — Asterra Studio

Breakdown fitur aplikasi secara komprehensif: apa yang dibangun, siapa penggunanya, dan bagaimana
tiap fitur dipetakan ke arsitektur Service–Repository (lihat `ARCHITECTURE.md`).

Legenda prioritas:
- **P0** = wajib ada di rilis pertama (MVP).
- **P1** = penting, menyusul setelah MVP.
- **P2** = nice-to-have / masa depan.

Legenda peran pengguna:
- **Pengunjung** = calon pembeli (publik, tanpa login).
- **Admin** = pemilik toko (login).

---

## 1. Peta Fitur (ringkas)

| # | Fitur | Peran | Prioritas | Fase |
|---|-------|-------|-----------|------|
| A | Katalog produk (grid) | Pengunjung | P0 | 2 |
| B | Filter kategori | Pengunjung | P0 | 2 |
| C | Pencarian produk | Pengunjung | P0 | 2 |
| D | Halaman detail produk | Pengunjung | P0 | 2 |
| E | Keranjang belanja | Pengunjung | P0 | 3 |
| F | Checkout via WhatsApp | Pengunjung | P0 | 3 |
| G | Login admin | Admin | P0 | 4 |
| H | CRUD produk | Admin | P0 | 4 |
| I | Upload gambar produk | Admin | P0 | 4 |
| J | CRUD kategori | Admin | P1 | 4 |
| K | Pengaturan toko | Admin | P0 | 5 |
| L | Dashboard ringkasan | Admin | P1 | 5 |
| M | Status stok / habis | Pengunjung+Admin | P1 | 4 |
| N | Produk unggulan (featured) | Admin | P2 | — |
| O | Berbagi produk (share) | Pengunjung | P2 | — |
| P | SEO & metadata | Sistem | P1 | 2 |

---

## 2. Fitur Pengunjung (Publik)

### A. Katalog Produk (grid) — P0
**Deskripsi:** Halaman utama menampilkan semua produk aktif dalam bentuk grid kartu.

- **Isi kartu:** foto utama, nama, harga (`formatIDR`), badge kategori, badge "Habis" bila stok 0.
- **Urutan default:** produk terbaru dulu (`createdAt desc`).
- **Responsif:** 2 kolom di HP, 3–4 kolom di desktop.
- **Empty state:** "Belum ada produk." bila kosong.

**Arsitektur:**
- Controller: `app/(public)/page.tsx` (Server Component).
- Service: `productService.getCatalog()`.
- Repository: `productRepository.findActive()`.
- Komponen: `ProductGrid`, `ProductCard`.

**Aturan bisnis:** hanya produk `isActive = true` yang tampil.

---

### B. Filter Kategori — P0
**Deskripsi:** Pengunjung memilih kategori (Aksesoris HP / Gantungan Kunci / Gantungan Tas) untuk
menyaring katalog.

- Diimplementasikan lewat query string URL: `/?category=phone-accessory`.
- Tombol/tab kategori terlihat di atas grid; kategori aktif ditandai.
- Bisa digabung dengan pencarian.

**Arsitektur:**
- Controller membaca `searchParams.category`.
- Service `getCatalog({ category })` menyaring berdasarkan `category.slug`.
- Komponen filter (`CategoryTabs`) — Client Component (butuh interaksi klik → update URL).

---

### C. Pencarian Produk — P0
**Deskripsi:** Kotak cari untuk mencari produk berdasarkan nama.

- Diimplementasikan lewat query string: `/?search=gantungan`.
- Case-insensitive, cocok sebagian (substring) pada `name`.
- Bisa digabung dengan filter kategori.
- **Skala kecil (<100 produk):** filter di memori (JS) sudah cukup; belum perlu full-text search DB.

**Arsitektur:**
- Controller membaca `searchParams.search`.
- Service `getCatalog({ search })`.
- Komponen `SearchBox` — Client Component (input + debounce → update URL).

---

### D. Halaman Detail Produk — P0
**Deskripsi:** Halaman khusus tiap produk di `/produk/[slug]`.

- **Isi:** galeri foto (multi-gambar), nama, harga, deskripsi lengkap, kategori, status stok.
- Tombol **"Tambah ke keranjang"** (nonaktif bila stok 0).
- Tombol **"Pesan langsung via WhatsApp"** (shortcut checkout 1 produk).
- Produk terkait (opsional, P2): produk lain di kategori yang sama.

**Arsitektur:**
- Controller: `app/(public)/produk/[slug]/page.tsx`.
- Service: `productService.getDetail(slug)` → `null` bila tidak ada / nonaktif → tampilkan 404.
- Repository: `productRepository.findBySlug(slug)`.
- Komponen: `ProductGallery` (client, ganti foto), `AddToCartButton` (client).

**Aturan bisnis:** produk `isActive = false` diperlakukan seperti tidak ada (404).

---

### E. Keranjang Belanja — P0
**Deskripsi:** Pengunjung mengumpulkan beberapa produk sebelum checkout.

- **Penyimpanan:** state di browser (Zustand + persist `localStorage`). **Tidak** disimpan di DB —
  keranjang milik perangkat pengunjung.
- **Isi item:** productId, name, price, qty, foto (snapshot secukupnya untuk tampil).
- **Operasi:** tambah, ubah qty (+/−), hapus item, kosongkan keranjang.
- **Ringkasan:** subtotal per item + total keseluruhan (`formatIDR`).
- **Indikator:** badge jumlah item di ikon keranjang (header).
- **Empty state:** "Keranjang masih kosong."

**Arsitektur:**
- Store: `lib/cart.ts` (Zustand) — satu-satunya sumber state keranjang.
- Service: `cartService.calculateTotal(items)`, `cartService.buildOrderSummary(items)` — logika hitung.
- Komponen: `CartButton` (header), `CartItem`, `CartSummary` — semua Client Component.

**Catatan:** harga dihitung ulang dari data, jangan percaya angka lama di localStorage untuk total final
(pada checkout, sebaiknya validasi harga terkini — lihat F).

---

### F. Checkout via WhatsApp — P0
**Deskripsi:** Alih-alih pembayaran, checkout membuka chat WhatsApp penjual berisi ringkasan pesanan.

**Alur:**
1. Pengunjung klik "Pesan via WhatsApp" di keranjang (atau detail produk).
2. `whatsappService.buildOrderMessage(items)` menyusun teks:
   ```
   Halo, saya mau pesan:
   1. Gantungan Kunci Lucu — 2x @Rp15.000 = Rp30.000
   2. Casing HP Bening — 1x @Rp25.000 = Rp25.000
   Total: Rp55.000
   ```
3. Ambil `waNumber` & `messageTemplate` dari Setting toko.
4. Buka `https://wa.me/<waNumber>?text=<encodeURIComponent(message)>` di tab baru.

**Arsitektur:**
- Service: `whatsappService.buildOrderMessage()`, `whatsappService.buildWaLink()`.
- Repository: `settingRepository.get()` untuk ambil nomor & template.
- Komponen: `CheckoutButton` (client).

**Aturan bisnis:**
- Tidak ada proses pembayaran / order tersimpan di DB (MVP). Transaksi lanjut manual via chat.
- Nomor WA format internasional tanpa `+`/`0` (`628xxx`).
- Template pesan bisa mengandung placeholder (mis. `{items}`, `{total}`) yang diisi service.

---

## 3. Fitur Admin (Login)

### G. Login Admin — P0
**Deskripsi:** Halaman `/admin/login` untuk pemilik toko.

- Auth.js (NextAuth) credentials provider (email + password).
- Password disimpan ter-hash (bcrypt).
- Semua route `/admin/**` dilindungi via `app/admin/layout.tsx` (redirect ke login bila belum masuk).
- Logout tersedia di area admin.

**Arsitektur:**
- Config: `lib/auth.ts`.
- Repository: `userRepository.findByEmail()`.
- Service: `authService.verifyCredentials()` (bandingkan hash).

**Aturan bisnis:** akun admin dibuat via seed / manual, **bukan** registrasi publik.

---

### H. CRUD Produk — P0
**Deskripsi:** Admin mengelola produk: tambah, lihat daftar, edit, hapus.

- **List:** tabel produk (nama, harga, stok, kategori, status aktif) + aksi edit/hapus + tombol "Tambah".
- **Create/Edit:** form (nama, harga, stok, kategori, deskripsi, gambar, aktif on/off).
- **Delete:** konfirmasi dulu; hapus produk beserta gambarnya.
- **Toggle aktif:** produk nonaktif tidak tampil di katalog publik tapi tetap tersimpan.
- **Slug:** dibuat otomatis dari nama (`slugify`), dijaga unik.

**Arsitektur:**
- Controller: `app/admin/produk/page.tsx` (list) + `app/admin/produk/actions.ts` (Server Actions CRUD).
- Service: `productService.createProduct/updateProduct/deleteProduct`.
- Repository: `productRepository.create/update/delete/findAll`.
- Validasi: `lib/validations/product.ts` (Zod) — dipakai form & action.

**Aturan bisnis:** slug unik; harga integer > 0; stok ≥ 0.

---

### I. Upload Gambar Produk — P0
**Deskripsi:** Admin mengunggah satu atau beberapa foto per produk.

- Upload ke **object storage** (default **Cloudinary**; Vercel filesystem read-only → tidak bisa simpan lokal di produksi). Dev lokal (Laragon) **tetap** upload ke storage yang sama — jangan bikin jalur simpan-ke-disk khusus lokal.
- Hasil upload disimpan di tabel `ProductImage`: `url` (untuk ditampilkan) + `publicId` (untuk menghapus) + `order` (urutan galeri).
- Foto pertama = foto utama di kartu katalog.
- Batasi tipe (jpg/png/webp) & ukuran file.

**Arsitektur:**
- Service: `imageService.upload()` (bungkus SDK penyedia), `imageService.delete(publicId)`.
- Repository: `productImageRepository.create/deleteByProduct`.
- **Isolasi penyedia:** `imageService` adalah **satu-satunya** tempat yang tahu penyedia storage dipakai (Cloudinary/R2/S3/dll). Repository & komponen hanya pegang `url`/`publicId`. Mengganti penyedia = ubah isi `imageService` saja, skema & layer lain tidak berubah.

**Aturan bisnis:** hapus produk → hapus gambar terkait di DB (Cascade) **dan** di storage via `imageService.delete(publicId)`.

---

### J. CRUD Kategori — P1
**Deskripsi:** Admin mengelola kategori (di luar 3 kategori awal dari seed).

- Tambah/edit/hapus kategori (nama + slug otomatis).
- **Aturan:** kategori yang masih dipakai produk tidak boleh dihapus (atau produk dipindah dulu).

**Arsitektur:** `categoryService`, `categoryRepository`. Untuk MVP, 3 kategori seed sudah cukup;
fitur ini menyusul.

---

### K. Pengaturan Toko — P0
**Deskripsi:** Halaman `/admin/pengaturan` untuk data toko.

- **Field:** nama toko (`storeName`), nomor WhatsApp (`waNumber`), template pesan (`messageTemplate`).
- Disimpan sebagai satu baris (singleton) di tabel `Setting`.
- Nomor WA & template dipakai fitur checkout (F).

**Arsitektur:**
- Controller: `app/admin/pengaturan/page.tsx` + action.
- Service: `settingService.get/update`.
- Repository: `settingRepository.get/upsert`.

**Aturan bisnis:** selalu tepat satu baris Setting (upsert, bukan insert baru).

---

### L. Dashboard Ringkasan — P1
**Deskripsi:** Halaman awal admin menampilkan ringkasan cepat.

- Jumlah produk (aktif/nonaktif), jumlah kategori, produk stok habis.
- Shortcut ke tambah produk & pengaturan.

**Arsitektur:** `dashboardService.getSummary()` memanggil beberapa repository (count).

---

## 4. Fitur Sistem / Lintas-halaman

### M. Status Stok / Habis — P1
- Produk `stock = 0` → badge "Habis", tombol keranjang nonaktif.
- Admin tetap bisa mengedit stok kapan saja.
- (MVP boleh menampilkan stok sebagai info saja tanpa mengurangi otomatis, karena order lewat WA manual.)

### P. SEO & Metadata — P1
- Tiap halaman produk punya `<title>` & `<meta description>` dari data produk (via `generateMetadata`).
- Open Graph image = foto produk (agar rapi saat dibagikan di WA/medsos).
- Sitemap sederhana (opsional).

### N. Produk Unggulan (Featured) — ✅ Diimplementasikan
- Field `isFeatured` (toggle di form admin) → section **"Produk Pilihan"** di beranda (di atas katalog,
  hanya saat tidak filter/cari). Repo `findFeatured`, service `getFeatured`.

### O. Berbagi Produk (Share) — ✅ Diimplementasikan
- Tombol **Bagikan** di halaman detail (`ShareButton`): Web Share API (mobile → WA/IG/dll), fallback
  salin link (desktop).

### Q. Produk Promo / Diskon — ✅ Diimplementasikan
- Field `promoPrice` (opsional). `price` = harga normal (tetap). Bila `promoPrice` diisi → produk diskon:
  harga jual = `promoPrice`, `price` **dicoret** + badge `-N%` (`discountPercent`). Validasi: `promoPrice < price`.
  Mengakhiri promo cukup **kosongkan `promoPrice`** (harga normal tak perlu diubah).
- Tampil di kartu katalog, halaman detail, dan **section "Lagi Promo 🔥"** di beranda.
- Keranjang/checkout memakai harga jual (promo bila ada).

---

## 5. Yang SECARA SENGAJA tidak dibuat (out of scope MVP)

Agar fokus dan tidak over-engineer:

- ❌ Payment gateway / pembayaran online — checkout hanya via WhatsApp.
- ❌ Akun & login untuk pembeli — pengunjung tidak perlu daftar.
- ❌ Riwayat pesanan / order tersimpan di DB — transaksi lanjut manual via chat.
- ❌ Pengiriman/ongkir otomatis — dibahas manual via WhatsApp.
- ❌ Multi-admin / role & permission kompleks — cukup satu peran admin.
- ❌ Rating & ulasan produk.

Fitur di atas bisa dipertimbangkan nanti bila kebutuhan tumbuh, tapi **jangan** dibangun sebelum diminta.

---

## 6. Ringkasan pemetaan fitur → layer

| Fitur | Repository | Service | Controller | Komponen kunci |
|-------|-----------|---------|------------|----------------|
| Katalog | `productRepository.findActive` | `productService.getCatalog` | `(public)/page.tsx` | `ProductGrid`, `ProductCard` |
| Detail | `productRepository.findBySlug` | `productService.getDetail` | `produk/[slug]/page.tsx` | `ProductGallery`, `AddToCartButton` |
| Keranjang | — (localStorage) | `cartService.*` | — (client) | `CartItem`, `CartSummary` |
| Checkout WA | `settingRepository.get` | `whatsappService.*` | — (client) | `CheckoutButton` |
| Login | `userRepository.findByEmail` | `authService.verifyCredentials` | `admin/login` | form login |
| CRUD Produk | `productRepository.*` | `productService.*` | `admin/produk/actions.ts` | form produk, tabel |
| Upload gambar | `productImageRepository.*` | `imageService.*` | (dalam form produk) | uploader |
| Pengaturan | `settingRepository.*` | `settingService.*` | `admin/pengaturan` | form setting |
