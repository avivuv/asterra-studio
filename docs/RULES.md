# Rules Pengerjaan — Do & Don't

Aturan tegas yang **wajib dipatuhi** saat mengembangkan project ini (oleh manusia maupun AI/Claude).
Tujuannya menjaga arsitektur Service–Repository tetap bersih, kode tidak redundan, dan mudah dirawat.

> Referensi: `ARCHITECTURE.md` (penjelasan layer), `CONVENTIONS.md` (penamaan), `FEATURES.md` (fitur).
> Bila ragu, patuhi dokumen ini — ini yang paling mengikat.

Legenda: ✅ = HARUS / boleh · ❌ = DILARANG.

---

## 1. Aturan Arsitektur (paling penting)

### 1.1 Pemisahan layer
- ✅ Alur wajib: **Controller → Service → Repository → Database**. Selalu satu arah.
- ❌ Controller (`page.tsx` / `actions.ts`) **dilarang** memanggil Prisma langsung.
- ❌ Controller **dilarang** berisi logika bisnis (filter, hitung total, susun pesan, cek stok).
- ❌ Service **dilarang** mengakses database langsung (tidak boleh `import { prisma }`). Harus lewat Repository.
- ❌ Service **dilarang** menyentuh hal HTTP/UI: `req`, `res`, `formData`, `redirect`, `revalidatePath`, JSX.
- ❌ Repository **dilarang** berisi logika bisnis. Isinya murni query CRUD.
- ❌ Repository **dilarang** tahu soal request/response atau UI.
- ✅ Komponen (View) hanya menerima data via props; **dilarang** query DB atau memanggil Repository.

### 1.2 Akses database
- ✅ **Hanya Repository** yang boleh `import { prisma }` dan memanggil `prisma.*`.
- ✅ Prisma diinstansiasi **sekali** sebagai singleton di `lib/prisma.ts`.
- ❌ Dilarang `new PrismaClient()` di file lain mana pun.
- ❌ Dilarang raw SQL kecuali benar-benar perlu & disetujui; utamakan API Prisma.

### 1.3 Logika bisnis
- ✅ Semua aturan bisnis hidup di **Service** (`lib/services/`).
- ✅ Jika sebuah logika dipakai di ≥2 tempat → wajib diangkat ke Service (jangan copy-paste).
- ❌ Dilarang menaruh logika bisnis di komponen React atau di `page.tsx`.

---

## 2. Aturan Anti-Redundansi (DRY)

- ✅ Sebelum menulis fungsi/komponen baru, **cek dulu** apakah sudah ada yang serupa; pakai ulang/perluas.
- ✅ Format harga **hanya** lewat `formatIDR()` (`lib/format.ts`).
- ✅ Pembuatan slug **hanya** lewat `slugify()` (`lib/format.ts`).
- ✅ Skema validasi **hanya** di `lib/validations/`; skema yang sama dipakai form (client) & action (server).
- ✅ UI yang muncul di ≥2 tempat → ekstrak jadi komponen di `components/`.
- ❌ Dilarang menduplikasi query yang sama di banyak tempat — tambahkan method di Repository.
- ❌ Dilarang menuliskan ulang format mata uang / tanggal secara manual.

---

## 3. Aturan Server vs Client Component

- ✅ Default **Server Component**. Tambahkan `"use client"` **hanya** bila perlu interaktivitas
  (`useState`, `useEffect`, event handler, akses `localStorage`).
- ❌ Dilarang menaruh `"use client"` di komponen yang sebenarnya statis.
- ❌ Dilarang meng-`import { prisma }` atau memanggil Repository/Service DB dari Client Component.
- ✅ Data mengalir dari Server Component → Client Component lewat **props**.

---

## 4. Aturan Penamaan & Bahasa

- ✅ Nama simbol (fungsi, variabel, tipe, method, field DB) **wajib bahasa Inggris**.
- ✅ Komentar boleh **Bahasa Indonesia**.
- ✅ Teks yang dilihat user **Bahasa Indonesia**.
- ❌ Dilarang mencampur Indonesia di nama simbol (`produk`, `harga`, `getKatalog` → salah).
- ✅ Ikuti konvensi file: komponen `PascalCase.tsx`, service/repo/util `camelCase.ts`.
- (Detail lengkap: `CONVENTIONS.md`.)

---

## 5. Aturan Validasi & Keamanan

- ✅ Semua input dari user (form/action/query) **wajib** divalidasi dengan Zod sebelum diproses.
- ✅ Password admin **wajib** di-hash (bcrypt); jangan simpan plaintext.
- ✅ Semua route `/admin/**` wajib terlindungi auth (cek di `app/admin/layout.tsx`).
- ❌ Dilarang menaruh secret/kredensial di kode. Gunakan environment variables.
- ❌ Dilarang commit `.env.local`. Setiap variabel baru → tambahkan ke `.env.example`.
- ✅ Jangan percaya harga/qty dari client untuk perhitungan final; verifikasi terhadap data terkini.

---

## 6. Aturan Data & Domain

- ✅ Harga disimpan sebagai **integer rupiah** (`15000`), bukan desimal/float.
- ✅ Slug produk **unik**, dibuat otomatis dari `name`.
- ✅ Nomor WhatsApp format internasional tanpa `+`/`0` (`628xxx`).
- ✅ Produk `isActive = false` tidak tampil di katalog publik (diperlakukan seperti tidak ada).
- ❌ Dilarang menampilkan produk nonaktif atau stok negatif ke pengunjung.

---

## 7. Aturan Scope (jangan over-engineer)

- ❌ Dilarang menambah fitur di luar scope tanpa diminta: payment gateway, akun pembeli, riwayat order
  di DB, ongkir otomatis, multi-role admin, rating/ulasan. (Lihat `FEATURES.md` §5.)
- ❌ Dilarang membuat Service/Repository "kosong" untuk fitur yang belum ada. Buat file saat dibutuhkan.
- ✅ Utamakan solusi paling sederhana yang memenuhi kebutuhan skala kecil (<100 produk).
- ✅ Checkout **hanya** membangun link `wa.me` — tidak memproses pembayaran.

---

## 8. Aturan Proses Kerja

- ✅ Sebelum menulis fitur, baca `ARCHITECTURE.md` & `FEATURES.md` untuk fitur terkait.
- ✅ Setelah selesai, jalankan `npm run lint` dan `npm run build` — keduanya harus lolos.
- ✅ Konfirmasi ke pemilik sebelum aksi sulit dibatalkan: `drop table`, reset migrasi, hapus data massal.
- ✅ Perubahan schema DB lewat migrasi Prisma (`prisma migrate dev`), bukan edit manual DB.
- ✅ Ikuti aturan RTK global (awali perintah dengan `rtk`).
- ❌ Dilarang menyimpan file sementara di project; gunakan folder scratchpad.

---

## 9. Checklist "Definition of Done" per fitur

Sebuah fitur baru dianggap selesai bila **semua** terpenuhi:

- [ ] Query DB berada di Repository (bukan Service/Controller/komponen).
- [ ] Logika bisnis berada di Service.
- [ ] Controller tipis (baca input → validasi → panggil service → render/redirect).
- [ ] Input tervalidasi Zod.
- [ ] Nama simbol berbahasa Inggris; teks UI Bahasa Indonesia.
- [ ] Tidak ada duplikasi logika/format yang sudah punya helper.
- [ ] Komponen reusable diekstrak bila dipakai ≥2 tempat.
- [ ] `"use client"` hanya pada komponen yang benar-benar interaktif.
- [ ] `npm run lint` & `npm run build` lolos.

---

## 10. Ringkasan "Jangan Pernah" (paling sering dilanggar)

1. ❌ Query Prisma dari `page.tsx` atau komponen.
2. ❌ `import { prisma }` di dalam Service.
3. ❌ Logika bisnis di Controller/komponen.
4. ❌ Nama simbol berbahasa Indonesia.
5. ❌ `new PrismaClient()` di luar `lib/prisma.ts`.
6. ❌ Format rupiah / slug manual (bukan lewat helper).
7. ❌ Commit `.env.local`.
8. ❌ Menambah fitur di luar scope tanpa diminta.
