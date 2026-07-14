# Rancangan Database — Asterra Studio

Skema database untuk aplikasi katalog. DB: **MySQL** (lokal via Docker, produksi via MySQL
serverless seperti PlanetScale). ORM: **Prisma**. Nama tabel/kolom **bahasa Inggris** (konsisten
dengan aturan penamaan — lihat `CONVENTIONS.md`).

> Perubahan skema **wajib** lewat migrasi Prisma (`prisma migrate dev`), bukan edit manual DB.

---

## 0. Environment Development (Docker)

DB development dijalankan lewat **Docker** (`docker-compose.yml`), **bukan** MySQL Laragon.

**Alasan:** MySQL di Windows memaksa `lower_case_table_names=1` (nama tabel dilowercase & banding
case-insensitive), sedangkan produksi (Linux) memakai `=0` (case-sensitive). Docker MySQL memakai
default Linux (`=0`) sehingga **lokal meniru kondisi asli produksi** — nama tabel tersimpan apa adanya
(`Product`, `ProductImage`, dst, dari model Prisma), menghindari kejutan casing saat deploy.

```bash
docker compose up -d       # jalankan MySQL (port 3307, user root, pass root)
docker compose down        # stop (data tetap ada di volume)
docker compose down -v     # stop + hapus data (reset total)
```

- Koneksi: `mysql://root:root@localhost:3307/asterra_studio` (port **3307** agar tak bentrok Laragon 3306).
- **Jangan** memakai MySQL Laragon untuk project ini — perilaku casing-nya beda dari produksi.
- `lower_case_table_names` hanya bisa diset saat inisialisasi; mengubahnya perlu `down -v` + recreate.

---

## 1. Diagram Relasi (ERD)

```
┌──────────────┐          ┌──────────────────┐          ┌────────────────┐
│  Category    │ 1      * │     Product      │ 1      * │  ProductImage  │
├──────────────┤──────────├──────────────────┤──────────├────────────────┤
│ id (PK)      │          │ id (PK)          │          │ id (PK)        │
│ name         │          │ name             │          │ productId (FK) │
│ slug (UQ)    │          │ slug (UQ)        │          │ url            │
│ createdAt    │          │ description      │          │ order          │
└──────────────┘          │ price (Int)      │          │ createdAt      │
                          │ stock (Int)      │          └────────────────┘
                          │ isActive (Bool)  │
                          │ categoryId (FK)  │
                          │ createdAt        │
                          │ updatedAt        │
                          └──────────────────┘

┌──────────────┐          ┌──────────────────┐
│    User      │          │     Setting      │  (singleton — hanya 1 baris)
├──────────────┤          ├──────────────────┤
│ id (PK)      │          │ id (PK)          │
│ name         │          │ storeName        │
│ email (UQ)   │          │ waNumber         │
│ password     │          │ messageTemplate  │
│ createdAt    │          │ updatedAt        │
└──────────────┘          └──────────────────┘
```

**Relasi:**
- `Category 1 — * Product` : satu kategori punya banyak produk.
- `Product 1 — * ProductImage` : satu produk punya banyak gambar (galeri).
- `User` : akun admin (berdiri sendiri, dipakai untuk auth).
- `Setting` : konfigurasi toko, satu baris (singleton).

---

## 2. Detail Tabel

### 2.1 `Category`
Kategori produk (Aksesoris HP, Gantungan Kunci, Gantungan Tas).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | String (cuid) | Primary key |
| `name` | String | Nama tampilan, mis. "Aksesoris HP" |
| `slug` | String **UNIQUE** | Untuk URL/filter, mis. `phone-accessory` |
| `createdAt` | DateTime | Otomatis |

- Index: `slug` (unique) — sering dipakai untuk filter katalog.

### 2.2 `Product`
Produk yang dijual.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | String (cuid) | Primary key |
| `code` | String **UNIQUE** | Kode produk (SKU) unik, wajib, diisi admin (uppercase). Tampil di katalog/detail/pesan WA |
| `name` | String | Nama produk |
| `slug` | String **UNIQUE** | URL detail, dibuat dari `name` via `slugify` |
| `description` | String? (`@db.Text`) | Deskripsi panjang; **nullable** (kolom TEXT MySQL tak boleh punya DEFAULT). `null` = tanpa deskripsi |
| `price` | Int | **Rupiah sebagai integer** (15000), bukan desimal |
| `stock` | Int | Jumlah stok; default 0; tidak boleh negatif (dijaga di Service) |
| `isActive` | Boolean | `true` = tampil di katalog; default `true` |
| `isFeatured` | Boolean | produk unggulan → section "Produk Pilihan" di beranda; default `false` |
| `promoPrice` | Int? | harga promo (opsional); bila diisi → produk diskon & harga inilah yang dijual. `price` = harga normal (dicoret). Harus < `price`. `null` = tak promo |
| `categoryId` | String (FK) | Relasi ke `Category.id` |
| `createdAt` | DateTime | Otomatis |
| `updatedAt` | DateTime | Otomatis (`@updatedAt`) |

- Index: `slug` (unique), `categoryId` (FK lookup), `isActive` (filter katalog).
- **On delete category:** dibatasi (`Restrict`) atau atur agar kategori terpakai tidak bisa dihapus (lihat `FEATURES.md` §J).

### 2.3 `ProductImage`
Galeri foto per produk (di-host di object storage; default Cloudinary).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | String (cuid) | Primary key |
| `productId` | String (FK) | Relasi ke `Product.id` |
| `url` | String | URL publik gambar untuk ditampilkan |
| `publicId` | String | ID objek di penyedia storage (mis. `public_id` Cloudinary); dipakai untuk menghapus file |
| `order` | Int | Urutan tampil; `0` = foto utama; default 0 |
| `createdAt` | DateTime | Otomatis |

- Index: `productId`.
- **On delete product:** `Cascade` — hapus produk otomatis hapus barisnya di DB. File di storage dihapus oleh `imageService` memakai `publicId`.
- `url` untuk *menampilkan*, `publicId` untuk *menghapus*. Simpan keduanya: URL saja tidak cukup untuk menghapus objek secara andal.

### 2.4 `User`
Akun admin (pemilik toko). **Tidak** untuk pembeli.

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | String (cuid) | Primary key |
| `name` | String | Nama admin |
| `email` | String **UNIQUE** | Untuk login |
| `password` | String | **Hash bcrypt**, jangan plaintext |
| `createdAt` | DateTime | Otomatis |

- Dibuat via seed/manual, bukan registrasi publik.

### 2.5 `Setting`
Konfigurasi toko, **singleton** (selalu satu baris).

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | String (cuid) | Primary key (nilai tetap, mis. `"default"`) |
| `storeName` | String | Nama toko |
| `waNumber` | String | Nomor WhatsApp internasional tanpa `+`/`0` (`628xxx`) |
| `messageTemplate` | String (`@db.Text`) | Template pesan checkout, boleh berisi placeholder |
| `updatedAt` | DateTime | Otomatis |

- Akses via `upsert` (id tetap) agar selalu satu baris.

---

## 3. Skema Prisma (referensi implementasi)

> **Prisma 7:** URL koneksi **tidak lagi** di `schema.prisma`. Datasource hanya menyebut provider;
> URL diletakkan di `prisma.config.ts` (dipakai Migrate/Studio) dan koneksi runtime lewat **driver
> adapter** (`@prisma/adapter-mariadb`, kompatibel MySQL) di `lib/prisma.ts`. Generator memakai
> `prisma-client` (bukan `prisma-client-js` lama) dengan `output` ke `lib/generated/prisma`.

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "mysql"
  // Prisma 7: URL koneksi ada di prisma.config.ts + driver adapter, bukan di sini.
}

model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
}

model Product {
  id          String         @id @default(cuid())
  code        String         @unique // kode produk (SKU) unik, wajib
  name        String
  slug        String         @unique
  description String?        @db.Text // nullable: TEXT tak boleh punya DEFAULT (MySQL strict)
  price       Int            // rupiah sebagai integer
  stock       Int            @default(0)
  isActive    Boolean        @default(true)
  isFeatured  Boolean        @default(false) // produk unggulan (section "Produk Pilihan")
  promoPrice  Int?           // harga promo (opsional); bila diisi → diskon. price = harga normal
  categoryId  String
  category    Category       @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([categoryId])
  @@index([isActive])
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String   // URL publik untuk ditampilkan
  publicId  String   // ID objek di penyedia storage; dipakai imageService untuk menghapus
  order     Int      @default(0)
  createdAt DateTime @default(now())

  @@index([productId])
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // hash bcrypt
  createdAt DateTime @default(now())
}

model Setting {
  id              String   @id @default("default")
  storeName       String
  waNumber        String
  messageTemplate String   @db.Text
  updatedAt       DateTime @updatedAt
}
```

### Konfigurasi koneksi (Prisma 7)

URL koneksi dipisah dari schema. `prisma.config.ts` dipakai Prisma CLI (Migrate/Studio):

```ts
// prisma.config.ts
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

// Prisma CLI berjalan di luar Next.js → muat .env.local (fallback .env) manual.
loadEnv({ path: [".env.local", ".env"] });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: { url: env("DATABASE_URL") },
});
```

Koneksi runtime aplikasi lewat driver adapter di singleton `lib/prisma.ts` (lihat `ARCHITECTURE.md`
& `RULES.md` — ini satu-satunya instansiasi `PrismaClient`):

```ts
// lib/prisma.ts
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb"; // kompatibel MySQL

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL as string) });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

> Catatan PlanetScale: bila deploy ke PlanetScale, foreign key constraint fisik tidak didukung —
> tambahkan `relationMode = "prisma"` di `datasource` dan Prisma menegakkan relasi di level aplikasi.
> Index pada kolom FK (`@@index`) wajib ada dalam mode ini. Untuk MySQL biasa (Docker lokal), tidak perlu.
> Adapter yang dipakai (`@prisma/adapter-mariadb`) tetap sama; hanya `DATABASE_URL` yang berganti.

---

## 4. Keputusan Desain (kenapa begini)

- **`id` cuid (String), bukan auto-increment Int** — aman dipakai di URL/klien, tidak bocorkan jumlah data, portabel antar-DB.
- **`price` integer rupiah** — hindari galat pembulatan float; Rupiah tidak pakai sen.
- **Keranjang tidak ada di DB** — keranjang milik perangkat pengunjung (localStorage/Zustand). DB hanya menyimpan katalog & konfigurasi.
- **Tidak ada tabel Order** (MVP) — transaksi berlanjut manual via WhatsApp; tidak menyimpan pesanan. Bisa ditambah kelak bila perlu.
- **`Setting` singleton** — hanya butuh satu konfigurasi toko; disederhanakan jadi satu baris via `upsert`.
- **`ProductImage` terpisah** (bukan kolom array) — mendukung galeri multi-foto + urutan, relasional & rapi.
- **Simpan `url` + `publicId`, bukan file/blob** — DB hanya menyimpan referensi; file ada di object storage (Cloudinary). `publicId` diperlukan agar `imageService` bisa menghapus objek saat produk dihapus. Penyedia storage bisa diganti tanpa mengubah skema ini (hanya isi `imageService`).

---

## 5. Seed Data Awal

Dijalankan via `prisma db seed` (`prisma/seed.ts`). Isi minimal:

- **3 kategori:**
  - `{ name: "Aksesoris HP", slug: "phone-accessory" }`
  - `{ name: "Gantungan Kunci", slug: "keychain" }`
  - `{ name: "Gantungan Tas", slug: "bag-charm" }`
- **1 akun admin** (email + password ter-hash bcrypt) — kredensial dari env, jangan hardcode di repo.
- **1 baris Setting** default (`storeName`, `waNumber` placeholder, `messageTemplate` contoh).
- (Opsional) beberapa produk contoh untuk pengujian tampilan.

---

## 6. Indeks & Performa

Skala kecil (<100 produk), jadi kebutuhan indeks minimal:

| Tabel | Index | Alasan |
|-------|-------|--------|
| Category | `slug` (unique) | Filter katalog per kategori |
| Product | `slug` (unique) | Buka halaman detail by slug |
| Product | `categoryId` | Join/filter per kategori |
| Product | `isActive` | Filter produk aktif untuk katalog publik |
| ProductImage | `productId` | Ambil galeri per produk |
| User | `email` (unique) | Login |

Belum perlu full-text search di DB; pencarian nama dilakukan di memori (Service) karena data kecil.

---

## 7. Kaitan ke layer lain

- Setiap tabel diakses **hanya** lewat Repository-nya (`productRepository`, `categoryRepository`,
  `productImageRepository`, `userRepository`, `settingRepository`).
- Aturan main (slug unik, stok ≥ 0, produk nonaktif disembunyikan, Setting upsert) ditegakkan di
  **Service**, bukan di Repository. Lihat `ARCHITECTURE.md` & `RULES.md`.
