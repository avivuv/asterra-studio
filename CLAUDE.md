# CLAUDE.md — Asterra Studio

Dokumentasi project untuk Claude Code. Baca file ini sebelum mengerjakan tugas apa pun di repo ini.

## 0. Peta Dokumentasi

Baca dokumen yang relevan sebelum mengerjakan tugas:

| Dokumen | Isi |
|---------|-----|
| `CLAUDE.md` (ini) | Ringkasan project, tech stack, folder, perintah, aturan inti |
| `docs/ARCHITECTURE.md` | Pola Service–Repository + contoh kode end-to-end |
| `docs/CONVENTIONS.md` | Aturan penamaan, bahasa, DRY, server/client |
| `docs/RULES.md` | Do & Don't tegas (logic di service, no direct DB, dll) |
| `docs/FEATURES.md` | Breakdown fitur komprehensif + prioritas + scope |
| `docs/DATABASE.md` | Rancangan skema DB, relasi, indeks, seed |
| `docs/tickets/` | Task development per tiket (board di `INDEX.md`), urut Fase 1–5 |
| `docs/implementations/` | Dokumen implementasi per tiket (ditulis setelah tiket selesai) |
| `docs/DEPLOY.md` | Panduan deploy produksi (Vercel + MySQL serverless) |

## 1. Tentang Project

**Asterra Studio** — website **katalog produk** untuk toko aksesoris HP & gantungan (kunci/tas).
"Asterra Studio" adalah nama brand/toko yang tampil ke pengunjung (header, judul halaman, metadata, footer). Tujuannya menampilkan katalog barang; pembeli menaruh barang ke keranjang lalu **checkout diarahkan ke chat WhatsApp** penjual (tanpa payment gateway). Pemilik toko mengelola produk lewat **admin panel** yang terhubung ke database.

**Karakteristik:**
- Skala kecil: target < 100 produk, update jarang.
- Kategori utama: `aksesoris-hp`, `gantungan-kunci`, `gantungan-tas`.
- Bahasa UI: **Indonesia**. Harga dalam **Rupiah (IDR)**.

## 2. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Database | MySQL + Prisma 7 ORM (driver adapter `@prisma/adapter-mariadb`) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth admin | Auth.js (NextAuth) — credentials provider |
| Upload gambar | Cloudinary (free tier) |
| State keranjang | Zustand + persist ke localStorage |
| Deploy | Vercel |

### ⚠️ Catatan MySQL + Vercel (WAJIB dipahami)
Vercel serverless → tiap request buka koneksi DB baru. MySQL biasa cepat kehabisan connection.
- **Development (lokal):** pakai MySQL via **Docker** (`docker compose up -d`, `localhost:3307`, user/pass `root`). **Bukan** Laragon — MySQL Windows memaksa `lower_case_table_names=1` (nama tabel dilowercase), sedangkan Docker (Linux, `=0`) meniru kondisi asli produksi (case-sensitive, tabel `Product`/`ProductImage` apa adanya). Detail: `docs/DATABASE.md` §0.
- **Production:** pakai **MySQL serverless** — rekomendasi **PlanetScale** (free tier, tetap MySQL) atau Railway/Aiven yang punya connection pooling. Hanya ganti `DATABASE_URL`, kode tidak berubah.
- Prisma Client harus di-instansiasi sebagai **singleton** (`lib/prisma.ts`) agar tidak membuat koneksi berlebih saat hot-reload/serverless.
- **Prisma 7:** URL koneksi ada di `prisma.config.ts` (untuk CLI Migrate/Studio) + driver adapter di `lib/prisma.ts` (runtime), **bukan** di `schema.prisma`. Client ter-generate ke `lib/generated/prisma` (gitignored; `postinstall: prisma generate`). Detail: `docs/DATABASE.md` §3.

## 3. Arsitektur: Service–Repository Pattern

Project ini memakai **Service–Repository pattern** ala Laravel (untuk keterbacaan & belajar).
Detail lengkap + contoh end-to-end ada di **`docs/ARCHITECTURE.md`** — baca itu sebelum menulis fitur.

**Alur data:** `page.tsx / Server Action (Controller)` → `Service (logika bisnis)` → `Repository (Prisma/DB)` → MySQL.

Pemetaan cepat Laravel → Next.js:

| Laravel | Next.js (project ini) | Lokasi |
|---------|-----------------------|--------|
| Eloquent Model | Prisma schema | `prisma/schema.prisma` |
| Controller | Server Component / Server Action (**tipis**) | `app/**/page.tsx`, `actions.ts` |
| Service | Logika bisnis | `lib/services/*.ts` |
| Repository | Query Prisma murni | `lib/repositories/*.ts` |
| FormRequest | Skema Zod | `lib/validations/*.ts` |
| Blade | JSX / komponen | `components/**` |
| Route (`web.php`) | Struktur folder `app/` | `app/**` |

**Aturan wajib per layer** (rinci di `docs/CONVENTIONS.md`):
- **Controller (`page.tsx`/action)**: tipis. Hanya validasi input, panggil Service, render/redirect. Dilarang query Prisma langsung.
- **Service**: semua logika bisnis (filter, hitung total, susun pesan WA). Tidak menyentuh `req/res` atau JSX. Boleh panggil banyak Repository.
- **Repository**: satu-satunya tempat memanggil Prisma. Murni CRUD, tanpa logika bisnis.

## 4. Struktur Folder (target)

```
asterra-studio/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Beranda: katalog + filter/search (Controller)
│   │   ├── produk/[slug]/page.tsx   # Detail produk (Controller)
│   │   └── keranjang/page.tsx       # Keranjang + tombol checkout WA
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── produk/
│   │   │   ├── page.tsx             # List produk
│   │   │   └── actions.ts           # Server Actions CRUD (Controller)
│   │   ├── kategori/
│   │   └── pengaturan/page.tsx      # Nomor WA, nama toko, template pesan
│   └── api/                         # Route handlers HANYA bila perlu (webhook/eksternal)
├── components/
│   ├── ui/                          # shadcn/ui (jangan bikin ulang)
│   ├── product/                     # ProductCard, ProductGrid, ...
│   ├── cart/                        # AddToCartButton, CartSummary, ...
│   └── layout/                      # Header, Footer, AdminSidebar
├── lib/
│   ├── prisma.ts                    # Prisma singleton (SATU-SATUNYA)
│   ├── auth.ts                      # Konfigurasi Auth.js
│   ├── cart.ts                      # Store keranjang (Zustand)
│   ├── format.ts                    # formatIDR, slugify, dll (dipakai ulang)
│   ├── repositories/                # ← Repository layer (query Prisma)
│   │   ├── productRepository.ts
│   │   ├── categoryRepository.ts
│   │   └── settingRepository.ts
│   ├── services/                    # ← Service layer (logika bisnis)
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   └── whatsappService.ts
│   └── validations/                 # ← Skema Zod
│       └── product.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docs/
│   ├── ARCHITECTURE.md              # Penjelasan layer + contoh end-to-end
│   ├── CONVENTIONS.md               # Aturan penamaan & konsistensi
│   ├── RULES.md                     # Do & Don't tegas
│   ├── FEATURES.md                  # Breakdown fitur + prioritas
│   └── DATABASE.md                  # Rancangan skema DB, relasi, indeks, seed
├── public/
├── .env.local                       # JANGAN di-commit
└── CLAUDE.md
```

## 5. Model Data (Prisma)

Nama field DB memakai **bahasa Inggris** (konsisten dengan aturan penamaan simbol).

```
Category    : id, name, slug (unique), createdAt
Product     : id, name, slug (unique), description, price (Int, rupiah),
              stock (Int), isActive (Boolean), categoryId, createdAt, updatedAt
ProductImage: id, productId, url, publicId, order, createdAt
User        : id, email (unique), password (hashed bcrypt), name, createdAt
Setting     : id, storeName, waNumber, messageTemplate, updatedAt  (singleton: 1 baris, id tetap "default")
```
- **price** disimpan sebagai integer rupiah (mis. `15000`), bukan desimal.
- **slug** dibuat dari `name` produk untuk URL yang bersih.

## 6. Alur Checkout WhatsApp

1. User klik "Tambah ke keranjang" → item masuk Zustand store (persist localStorage).
2. Di halaman keranjang, user bisa ubah qty / hapus item.
3. Tombol "Pesan via WhatsApp" memanggil `whatsappService` (`lib/services/whatsappService.ts`):
   - Susun teks: daftar produk (name, qty, subtotal) + total keseluruhan.
   - Ambil `waNumber` & `messageTemplate` dari Setting.
   - Buka `https://wa.me/<waNumber>?text=<encodeURIComponent(message)>`.
4. Nomor WA format internasional tanpa `+` atau `0` di depan (mis. `628123456789`).

## 7. Konvensi Kode

Ringkas di sini; lengkap di **`docs/CONVENTIONS.md`**.

- **TypeScript strict**. Hindari `any`.
- Komponen server by default (App Router); tandai `"use client"` hanya bila butuh interaktivitas (keranjang, form, filter).
- Format harga pakai helper `formatIDR(n)` — jangan hardcode string harga.
- **Penamaan simbol (fungsi/variabel/tipe/field DB) wajib bahasa Inggris.** Komentar boleh Bahasa Indonesia. Teks UI Bahasa Indonesia. (Detail: `docs/CONVENTIONS.md`.)
- Nama file: komponen `PascalCase.tsx`; repository/service/util `camelCase.ts`.
- **Query Prisma hanya di Repository** (`lib/repositories/`). Service & Controller dilarang query DB langsung.
- **Logika bisnis hanya di Service** (`lib/services/`). Controller & Repository tidak boleh berisi aturan bisnis.
- Validasi input pakai **Zod** (`lib/validations/`), skema dipakai bersama form & Server Action.
- Kalau sebuah UI muncul di ≥2 tempat → jadikan komponen di `components/`.
- Semua teks UI dalam Bahasa Indonesia.

## 8. Environment Variables

Buat `.env.local` (contoh ada di `.env.example`):
```
DATABASE_URL="mysql://root:root@localhost:3307/asterra_studio"   # MySQL via Docker (port 3307)
NEXTAUTH_SECRET="<random-string>"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```
- **Jangan pernah commit** `.env.local`. Selalu update `.env.example` saat menambah variabel baru.

## 9. Perintah Penting

> Ikuti aturan RTK global: awali perintah dengan `rtk` bila memungkinkan.

```bash
docker compose up -d   # jalankan MySQL (Docker, port 3307) — WAJIB sebelum migrate/dev
npm run dev            # jalankan dev server (localhost:3000)
npx prisma migrate dev # buat/apply migrasi DB
npx prisma studio      # GUI lihat isi database
npx prisma db seed     # isi data awal (kategori, admin default)
npm run build          # build produksi
npm run lint           # cek lint
```

Setup DB lokal: jalankan `docker compose up -d` (MySQL otomatis dibuat, port 3307), lalu `prisma migrate dev`. Container memakai default Linux case-sensitive — lihat `docs/DATABASE.md` §0. **Jangan** pakai MySQL Laragon untuk project ini.

## 10. Roadmap / Status

- [ ] **Fase 1** — Scaffold Next.js + Prisma + Tailwind + shadcn, schema & seed kategori.
- [ ] **Fase 2** — Katalog publik: grid produk, filter kategori, search, halaman detail.
- [ ] **Fase 3** — Keranjang (Zustand) + generator checkout WhatsApp.
- [ ] **Fase 4** — Auth admin + CRUD produk + upload gambar Cloudinary.
- [ ] **Fase 5** — Halaman Pengaturan toko + deploy Vercel + migrasi ke PlanetScale.

## 11. Yang HARUS diperhatikan Claude

- Patuhi Service–Repository: **Controller tipis → Service (logika) → Repository (Prisma)**. Jangan langsung query Prisma dari `page.tsx`/action.
- Selalu jaga Prisma sebagai singleton — jangan `new PrismaClient()` di banyak tempat.
- Ingat perbedaan DB **lokal (Laragon MySQL)** vs **produksi (serverless MySQL)**.
- Checkout **tidak** memproses pembayaran — hanya membangun link `wa.me`. Jangan menambah payment gateway kecuali diminta.
- Konfirmasi dulu sebelum aksi yang sulit dibatalkan (drop tabel, reset migrasi, hapus data).
- Sebelum menulis fitur baru, baca `docs/ARCHITECTURE.md` dan `docs/CONVENTIONS.md`.
