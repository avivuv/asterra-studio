// Service kategori — logika bisnis (RULES §1.3). Slug unik; larang hapus kategori yang dipakai produk.
import { categoryRepository } from "@/lib/repositories/categoryRepository";
import { slugify } from "@/lib/format";

export const categoryService = {
  listAll: () => categoryRepository.findAll(),
  getById: (id: string) => categoryRepository.findById(id),

  async makeUniqueSlug(name: string, excludeId?: string) {
    const base = slugify(name);
    let slug = base;
    let n = 2;
    while ((await categoryRepository.countBySlug(slug, excludeId)) > 0) {
      slug = `${base}-${n++}`;
    }
    return slug;
  },

  async createCategory(name: string) {
    const slug = await this.makeUniqueSlug(name);
    return categoryRepository.create({ name, slug });
  },

  async updateCategory(id: string, name: string) {
    const slug = await this.makeUniqueSlug(name, id);
    return categoryRepository.update(id, { name, slug });
  },

  // Aturan: kategori yang masih dipakai produk tidak boleh dihapus (FEATURES J).
  async deleteCategory(id: string) {
    const used = await categoryRepository.countProducts(id);
    if (used > 0) {
      return { ok: false as const, error: `Tidak bisa dihapus: masih dipakai ${used} produk.` };
    }
    await categoryRepository.delete(id);
    return { ok: true as const };
  },
};
