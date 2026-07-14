// Repository Category — query Prisma murni (RULES §1.2).
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const categoryRepository = {
  findAll: () => prisma.category.findMany({ orderBy: { name: "asc" } }),

  countAll: () => prisma.category.count(),

  findById: (id: string) => prisma.category.findUnique({ where: { id } }),

  countBySlug: (slug: string, excludeId?: string) =>
    prisma.category.count({ where: { slug, id: excludeId ? { not: excludeId } : undefined } }),

  countProducts: (categoryId: string) => prisma.product.count({ where: { categoryId } }),

  create: (data: Prisma.CategoryCreateInput) => prisma.category.create({ data }),

  update: (id: string, data: Prisma.CategoryUpdateInput) =>
    prisma.category.update({ where: { id }, data }),

  delete: (id: string) => prisma.category.delete({ where: { id } }),
};
