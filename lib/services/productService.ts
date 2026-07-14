// Service produk — logika bisnis katalog & detail (RULES §1.3). Tidak menyentuh Prisma/JSX.
import { productRepository } from "@/lib/repositories/productRepository";
import { productImageRepository } from "@/lib/repositories/productImageRepository";
import { imageService } from "@/lib/services/imageService";
import { slugify } from "@/lib/format";
import type { ProductInput } from "@/lib/validations/product";

type CatalogFilter = { category?: string; search?: string };

// Error khusus: kode produk sudah dipakai (ditangani Controller jadi error form).
export class DuplicateCodeError extends Error {
  constructor() {
    super("Kode produk sudah dipakai produk lain.");
    this.name = "DuplicateCodeError";
  }
}

// Bentuk produk katalog (produk + relasi) — dipakai bersama komponen agar tak mengimpor Prisma di View.
export type CatalogProduct = Awaited<ReturnType<typeof productRepository.findActive>>[number];

// Bentuk produk detail (produk + relasi, non-null) — untuk halaman detail.
export type ProductDetail = NonNullable<Awaited<ReturnType<typeof productRepository.findBySlug>>>;

export const productService = {
  // Katalog: ambil produk aktif lalu terapkan filter kategori + pencarian nama.
  // Data kecil (<100 produk) → filter di memori sudah cukup (FEATURES C).
  async getCatalog({ category, search }: CatalogFilter = {}) {
    const products = await productRepository.findActive();
    const keyword = search?.trim().toLowerCase();

    return products
      .filter((product) => !category || product.category.slug === category)
      .filter((product) => !keyword || product.name.toLowerCase().includes(keyword));
  },

  // Detail: produk nonaktif / tidak ada diperlakukan sebagai tidak ada (→ 404 di Controller).
  async getDetail(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product || !product.isActive) return null;
    return product;
  },

  // Produk unggulan untuk beranda (section "Produk Pilihan").
  getFeatured: () => productRepository.findFeatured(),

  // Produk promo untuk beranda (section "Lagi Promo").
  getPromo: () => productRepository.findPromo(),

  // ── Admin ──
  listAll: () => productRepository.findAll(),
  getById: (id: string) => productRepository.findById(id),

  // Buat slug unik dari nama; bila bentrok tambah suffix -2, -3, dst (excludeId untuk update).
  async makeUniqueSlug(name: string, excludeId?: string) {
    const base = slugify(name);
    let slug = base;
    let n = 2;
    while ((await productRepository.countBySlug(slug, excludeId)) > 0) {
      slug = `${base}-${n++}`;
    }
    return slug;
  },

  // Simpan galeri: buat baris ProductImage berurutan (order 0 = foto utama).
  async saveImages(productId: string, images: ProductInput["images"]) {
    if (images.length === 0) return;
    await productImageRepository.createMany(
      images.map((img, order) => ({ productId, url: img.url, publicId: img.publicId, order })),
    );
  },

  // Hapus semua gambar produk di DB + Cloudinary (dipakai saat delete produk).
  async clearImages(productId: string) {
    const existing = await productImageRepository.findByProduct(productId);
    await Promise.all(existing.map((img) => imageService.delete(img.publicId)));
    await productImageRepository.deleteByProduct(productId);
  },

  // Set ulang galeri (update): hapus di Cloudinary HANYA gambar lama yang tak lagi dipakai,
  // lalu tulis ulang baris DB sesuai input (menjaga urutan). Gambar yang tetap dipakai tak disentuh.
  async replaceImages(productId: string, images: ProductInput["images"]) {
    const existing = await productImageRepository.findByProduct(productId);
    const keepIds = new Set(images.map((i) => i.publicId));
    const removed = existing.filter((img) => img.publicId && !keepIds.has(img.publicId));
    await Promise.all(removed.map((img) => imageService.delete(img.publicId)));

    // Tulis ulang baris DB (Cloudinary file untuk yang dipertahankan tetap ada).
    await productImageRepository.deleteByProduct(productId);
    await this.saveImages(productId, images);
  },

  // Cek kode unik; lempar error bila dipakai produk lain (ditangkap Action → error form).
  async assertCodeUnique(code: string, excludeId?: string) {
    const used = await productRepository.countByCode(code, excludeId);
    if (used > 0) throw new DuplicateCodeError();
  },

  async createProduct(input: ProductInput) {
    await this.assertCodeUnique(input.code);
    const slug = await this.makeUniqueSlug(input.name);
    const product = await productRepository.create({
      code: input.code,
      name: input.name,
      slug,
      description: input.description ?? null,
      price: input.price,
      promoPrice: input.promoPrice ?? null,
      stock: input.stock,
      isActive: input.isActive ?? true,
      isFeatured: input.isFeatured ?? false,
      category: { connect: { id: input.categoryId } },
    });
    await this.saveImages(product.id, input.images);
    return product;
  },

  async updateProduct(id: string, input: ProductInput) {
    await this.assertCodeUnique(input.code, id);
    const slug = await this.makeUniqueSlug(input.name, id);
    const product = await productRepository.update(id, {
      code: input.code,
      name: input.name,
      slug,
      description: input.description ?? null,
      price: input.price,
      promoPrice: input.promoPrice ?? null,
      stock: input.stock,
      isActive: input.isActive ?? true,
      isFeatured: input.isFeatured ?? false,
      category: { connect: { id: input.categoryId } },
    });
    // Set galeri baru; hanya hapus di Cloudinary gambar yang benar-benar dibuang.
    await this.replaceImages(id, input.images);
    return product;
  },

  // Hapus produk → hapus gambar di Cloudinary dulu, lalu produk (baris ProductImage ikut Cascade DB).
  async deleteProduct(id: string) {
    await this.clearImages(id);
    return productRepository.delete(id);
  },
};
