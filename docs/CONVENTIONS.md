# Konvensi Kode

Aturan penamaan & konsistensi agar kode tetap rapi dan tidak redundan. Lihat `ARCHITECTURE.md`
untuk penjelasan lapisan Service–Repository.

---

## 1. Penamaan file & folder

| Jenis | Aturan | Contoh |
|-------|--------|--------|
| Komponen React | `PascalCase.tsx` | `ProductCard.tsx`, `AddToCartButton.tsx` |
| Repository | `camelCase` + akhiran `Repository.ts` | `productRepository.ts` |
| Service | `camelCase` + akhiran `Service.ts` | `productService.ts`, `whatsappService.ts` |
| Validasi (Zod) | `camelCase.ts` di `lib/validations/` | `product.ts` |
| Util/helper | `camelCase.ts` | `format.ts` |
| Server Action | `actions.ts` di folder route terkait | `app/admin/produk/actions.ts` |
| Folder route | `kebab-case` | `app/produk/[slug]/` |

---

## 2. Penamaan simbol

- **Repository & Service** diekspor sebagai objek dengan method, mis. `productService.getCatalog()`.
  Konsisten, mudah di-autocomplete, dan jelas asalnya.
- **Fungsi** pakai kata kerja (Inggris): `getCatalog`, `createProduct`, `calculateTotal`, `buildWaLink`.
- **Boolean** pakai awalan `is/has`: `isActive`, `isLoading`, `hasStock`.
- **Tipe/Interface** `PascalCase` (Inggris): `ProductInput`, `CatalogFilter`.
- **Konstanta global** `UPPER_SNAKE_CASE` (Inggris): `DEFAULT_CATEGORY`.

---

## 3. Bahasa

| Bagian | Bahasa | Contoh |
|--------|--------|--------|
| **Nama simbol di kode** (fungsi, variabel, tipe, method, konstanta) | **Inggris — selalu** | `product`, `price`, `cart`, `getCatalog`, `buildWaLink` |
| **Komentar di kode** | Boleh Bahasa Indonesia | `// aturan bisnis: produk nonaktif dianggap tidak ada` |
| **Teks yang dilihat user** (UI, pesan, label) | Bahasa Indonesia | "Tambah ke keranjang", "Belum ada produk" |
| **String domain di DB** (slug kategori) | Inggris/kebab konsisten | `phone-accessory`, `keychain`, `bag-charm` |

Aturan tegas: **jangan campur** Indonesia di nama simbol. Tulis `product` bukan `produk`,
`getCatalog` bukan `getKatalog`, `ProductInput` bukan `ProdukInput`. Komentar yang menjelaskan
maksud kode boleh Bahasa Indonesia agar mudah dipahami saat belajar.

---

## 4. Aturan anti-redundansi (DRY)

1. **Satu logika, satu tempat.** Sebelum menulis, cek apakah sudah ada helper/service/repository
   yang serupa. Kalau ada, pakai ulang atau perluas — jangan copy-paste.
2. **Format harga** hanya lewat `formatIDR()` di `lib/format.ts`. Jangan format IDR manual.
3. **Query Prisma** hanya di Repository. Kalau butuh query baru, tambahkan method di Repository.
4. **Logika bisnis** hanya di Service. Controller & komponen tidak boleh menyimpan aturan bisnis.
5. **Validasi** hanya di `lib/validations/`. Skema Zod yang sama dipakai form (client) & Action (server).
6. **Komponen**: kalau sebuah tampilan muncul di ≥2 tempat → angkat jadi komponen di `components/`.
   Kalau baru 1 tempat → biarkan inline (jangan over-engineer).

---

## 5. Server vs Client Component

- **Default = Server Component.** Jangan tulis `"use client"` kecuali perlu.
- Tandai `"use client"` hanya bila komponen butuh: `useState`/`useEffect`, event handler (`onClick`,
  `onChange`), atau akses browser API (localStorage).
- Yang butuh client di project ini: tombol keranjang, form input, filter/search interaktif, komponen
  Zustand (keranjang).
- Yang tetap server: grid produk, kartu produk, detail produk, layout, header/footer.
- **Prisma tidak boleh** diimpor di Client Component. Data mengalir dari Server Component sebagai props.

---

## 6. TypeScript

- Mode **strict**. Dilarang `any` — pakai tipe dari `@prisma/client` atau `z.infer<typeof schema>`.
- Reuse tipe hasil validasi: `type ProductInput = z.infer<typeof productSchema>`.
- Untuk data dengan relasi, definisikan tipe gabungan (mis. `Product & { images: ProductImage[] }`).

---

## 7. Import & alias

- Pakai alias `@/` untuk root (`import { prisma } from "@/lib/prisma"`). Jangan `../../../lib/...`.
- Urutan import: library eksternal → alias `@/` → relatif (`./`).

---

## 8. Data & format

- **Harga**: integer rupiah (`15000`), bukan desimal. Tampilkan dengan `formatIDR()`.
- **Slug**: dibuat otomatis dari nama via helper `slugify()` di `lib/format.ts`. Jangan diketik manual.
- **Nomor WhatsApp**: format internasional tanpa `+`/`0` awal (`628123456789`).

---

## 9. Commit (saat repo sudah pakai git)

- Pesan singkat, imperatif (Indonesia boleh, karena ini bukan simbol kode): `tambah product repository`, `perbaiki format harga`.
- Satu commit = satu perubahan logis. Jangan campur banyak fitur dalam satu commit.
- Ikuti aturan RTK global: awali perintah git dengan `rtk` (mis. `rtk git status`).

---

## 10. Checklist sebelum menganggap fitur "selesai"

- [ ] Query DB ada di Repository, bukan di Service/Controller.
- [ ] Logika bisnis ada di Service, bukan di Controller/komponen.
- [ ] Input tervalidasi dengan Zod.
- [ ] Tidak ada duplikasi logika/format yang sudah punya helper.
- [ ] Komponen yang dipakai ulang sudah diekstrak ke `components/`.
- [ ] `npm run lint` dan `npm run build` lolos.
