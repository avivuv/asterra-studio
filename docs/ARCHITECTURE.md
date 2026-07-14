# Arsitektur — Service–Repository Pattern

Dokumen ini menjelaskan cara menyusun kode di project ini. Polanya meniru **Service–Repository
pattern** yang umum di Laravel, tapi diterjemahkan ke Next.js (App Router). Tujuannya: kode yang
**tidak redundan** dan **gampang di-maintain** — tiap urusan punya satu tempat.

> Baca dokumen ini sebelum menulis fitur. Untuk aturan penamaan detail, lihat `CONVENTIONS.md`.

---

## 1. Kenapa berlapis?

Tanpa lapisan, query database & logika bisnis tercampur di dalam halaman (`page.tsx`). Akibatnya:
query yang sama di-copy ke banyak halaman, aturan bisnis tersebar, dan saat ada perubahan kamu harus
menyunting banyak file. Dengan berlapis, tiap perubahan punya **satu alamat pasti**.

Analogi Laravel: `Controller` tipis, logika di `Service`, akses DB di `Repository`. Sama persis di sini.

---

## 2. Tiga lapisan

```
        Request (buka URL / submit form)
                    │
   ┌────────────────▼────────────────┐
   │ CONTROLLER                      │  app/**/page.tsx  |  app/**/actions.ts
   │ (Server Component / Action)     │
   │ • Baca input (params/formData)  │
   │ • Validasi (Zod)                │  ← TIPIS. Tidak ada logika bisnis.
   │ • Panggil Service               │  ← DILARANG query Prisma di sini.
   │ • Render JSX / redirect         │
   └────────────────┬────────────────┘
                    │ panggil
   ┌────────────────▼────────────────┐
   │ SERVICE                         │  lib/services/*.ts
   │ • Logika bisnis & aturan main   │
   │ • Filter, hitung total, susun   │  ← Otak aplikasi.
   │   pesan WA, cek stok, dll.      │  ← Tidak menyentuh JSX / request.
   │ • Boleh panggil >1 Repository   │  ← Tidak query Prisma langsung.
   └────────────────┬────────────────┘
                    │ panggil
   ┌────────────────▼────────────────┐
   │ REPOSITORY                      │  lib/repositories/*.ts
   │ • SATU-SATUNYA yang pegang      │  ← Murni CRUD.
   │   Prisma                        │  ← Tidak ada logika bisnis.
   │ • findMany, create, update, ... │
   └────────────────┬────────────────┘
                    │
              Database (MySQL)
```

**Aturan singkat siapa boleh apa:**

| Layer | Boleh | Dilarang |
|-------|-------|----------|
| Controller | baca input, validasi, panggil Service, render/redirect | query Prisma, logika bisnis |
| Service | logika bisnis, panggil Repository | akses JSX/request/response, query Prisma langsung |
| Repository | query Prisma (CRUD) | logika bisnis, tahu soal HTTP/UI |

---

## 3. Contoh end-to-end: menampilkan katalog

Satu fitur, ditelusuri dari database sampai layar. Perhatikan tiap file hanya punya satu tanggung jawab.

### 3.1 Repository — hanya bicara ke DB

```ts
// lib/repositories/productRepository.ts
import { prisma } from "@/lib/prisma";

// Murni ambil data. Tidak tahu soal filter/search — itu urusan Service.
export const productRepository = {
  findActive: () =>
    prisma.product.findMany({
      where: { isActive: true },
      include: { images: { orderBy: { order: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
    }),

  findBySlug: (slug: string) =>
    prisma.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } }, category: true },
    }),
};
```

### 3.2 Service — logika bisnis (filter & search)

```ts
// lib/services/productService.ts
import { productRepository } from "@/lib/repositories/productRepository";

type CatalogFilter = { category?: string; search?: string };

export const productService = {
  async getCatalog({ category, search }: CatalogFilter = {}) {
    const all = await productRepository.findActive();

    // ATURAN BISNIS ada di sini — bukan di Controller, bukan di Repository.
    return all
      .filter((p) => !category || p.category.slug === category)
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  },

  async getDetail(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product || !product.isActive) return null; // aturan: produk nonaktif dianggap tidak ada
    return product;
  },
};
```

### 3.3 Controller — `page.tsx`, tipis

```tsx
// app/(public)/page.tsx
import { productService } from "@/lib/services/productService";
import { ProductGrid } from "@/components/product/ProductGrid";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  // Cuma: baca input → panggil service → render. Tidak ada logika di sini.
  const products = await productService.getCatalog({
    category: searchParams.category,
    search: searchParams.search,
  });

  return <ProductGrid products={products} />;
}
```

### 3.4 View — komponen reusable

```tsx
// components/product/ProductGrid.tsx  (Server Component — tidak butuh interaktivitas)
import type { Product, ProductImage, Category } from "@prisma/client";
import { ProductCard } from "./ProductCard";

type Item = Product & { images: ProductImage[]; category: Category };

export function ProductGrid({ products }: { products: Item[] }) {
  if (products.length === 0) return <p>Belum ada produk.</p>; // teks UI → Indonesia
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
```

---

## 4. Contoh menulis data: Server Action (admin tambah produk)

Untuk create/update/delete, Controller-nya berupa **Server Action**, bukan `page.tsx`. Polanya sama:
Action tipis → Service → Repository.

```ts
// lib/validations/product.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  price: z.coerce.number().int().positive("Harga harus lebih dari 0"),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().optional(),
});
export type ProductInput = z.infer<typeof productSchema>;
```

```ts
// lib/repositories/productRepository.ts  (tambahan)
import type { Prisma } from "@prisma/client";

// ...gabung dengan objek productRepository sebelumnya
create: (data: Prisma.ProductCreateInput) => prisma.product.create({ data }),
```

```ts
// lib/services/productService.ts  (tambahan)
import { slugify } from "@/lib/format";
import type { ProductInput } from "@/lib/validations/product";

// ...gabung dengan objek productService sebelumnya
async createProduct(input: ProductInput) {
  // ATURAN BISNIS: slug dibuat otomatis dari name, produk baru default aktif.
  return productRepository.create({
    name: input.name,
    slug: slugify(input.name),
    price: input.price,
    stock: input.stock,
    description: input.description ?? "",
    isActive: true,
    category: { connect: { id: input.categoryId } },
  });
},
```

```ts
// app/admin/produk/actions.ts  (Controller — Server Action)
"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validations/product";
import { productService } from "@/lib/services/productService";

export async function createProductAction(formData: FormData) {
  // 1) Validasi input
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  // 2) Panggil Service (logika ada di sana)
  await productService.createProduct(parsed.data);
  // 3) Refresh & redirect
  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}
```

Perhatikan: Action tidak menyentuh Prisma dan tidak menyusun slug — semua itu di Service/Repository.

---

## 5. Kapan Service boleh "tipis"?

Untuk operasi yang benar-benar cuma teruskan data (tanpa aturan), Service memang terlihat tipis —
itu wajar dan tetap dipertahankan demi konsistensi. Tapi **jangan** menambah Repository/Service
kosong untuk sesuatu yang belum ada. Buat file saat fiturnya ada, bukan sebelumnya.

Logika yang **wajib** masuk Service (jangan di Controller): filter/search katalog, hitung total
keranjang, susun teks pesan WhatsApp, pembuatan slug, cek stok, aturan "produk nonaktif = tidak ada".

---

## 6. Peta "mau ubah X, edit di mana"

| Mau ubah… | Edit file |
|-----------|-----------|
| Cara ambil produk dari DB | `lib/repositories/productRepository.ts` |
| Aturan filter/search/stok | `lib/services/productService.ts` |
| Isi/format pesan WhatsApp | `lib/services/whatsappService.ts` |
| Format harga (Rupiah) | `lib/format.ts` |
| Aturan validasi form produk | `lib/validations/product.ts` |
| Tampilan kartu produk | `components/product/ProductCard.tsx` |
| Header / Footer | `components/layout/` |
| Struktur tabel database | `prisma/schema.prisma` |

---

## 7. Ringkasan alur (hafalkan ini)

1. **Controller** (`page.tsx` / `actions.ts`) — baca input, validasi, panggil Service, render/redirect. Tipis.
2. **Service** (`lib/services`) — semua logika bisnis. Panggil Repository.
3. **Repository** (`lib/repositories`) — satu-satunya yang query Prisma.
4. **View** (`components`) — tampilan reusable; `"use client"` hanya bila butuh interaktif.
