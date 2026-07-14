// Repository produk — SATU-SATUNYA tempat query Prisma untuk Product (RULES §1.2).
// Murni CRUD. Tidak ada logika bisnis (filter/search/slug itu urusan Service).
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const productRepository = {
  // Semua produk aktif untuk katalog publik: sertakan gambar (urut) + kategori, terbaru dulu.
  findActive: () =>
    prisma.product.findMany({
      where: { isActive: true },
      include: { images: { orderBy: { order: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
    }),

  // Produk unggulan aktif (untuk section "Produk Pilihan" di beranda).
  findFeatured: (take = 4) =>
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: { orderBy: { order: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
      take,
    }),

  // Produk promo aktif (promoPrice terisi) — untuk section "Lagi Promo".
  findPromo: (take = 4) =>
    prisma.product.findMany({
      where: { isActive: true, promoPrice: { not: null } },
      include: { images: { orderBy: { order: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
      take,
    }),

  // Satu produk berdasarkan slug (untuk halaman detail).
  findBySlug: (slug: string) =>
    prisma.product.findUnique({
      where: { slug },
      include: { images: { orderBy: { order: "asc" } }, category: true },
    }),

  // Semua produk (admin) — termasuk nonaktif, dengan kategori & gambar.
  findAll: () =>
    prisma.product.findMany({
      include: { images: { orderBy: { order: "asc" } }, category: true },
      orderBy: { createdAt: "desc" },
    }),

  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } }, category: true },
    }),

  countBySlug: (slug: string, excludeId?: string) =>
    prisma.product.count({ where: { slug, id: excludeId ? { not: excludeId } : undefined } }),

  countByCode: (code: string, excludeId?: string) =>
    prisma.product.count({ where: { code, id: excludeId ? { not: excludeId } : undefined } }),

  countAll: () => prisma.product.count(),
  countActive: () => prisma.product.count({ where: { isActive: true } }),
  countOutOfStock: () => prisma.product.count({ where: { stock: 0 } }),

  create: (data: Prisma.ProductCreateInput) => prisma.product.create({ data }),

  update: (id: string, data: Prisma.ProductUpdateInput) =>
    prisma.product.update({ where: { id }, data }),

  delete: (id: string) => prisma.product.delete({ where: { id } }),
};
