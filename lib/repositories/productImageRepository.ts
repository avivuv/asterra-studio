// Repository ProductImage — query Prisma murni untuk gambar produk (RULES §1.2).
import { prisma } from "@/lib/prisma";

export const productImageRepository = {
  findByProduct: (productId: string) =>
    prisma.productImage.findMany({ where: { productId }, orderBy: { order: "asc" } }),

  createMany: (data: { productId: string; url: string; publicId: string; order: number }[]) =>
    prisma.productImage.createMany({ data }),

  deleteByProduct: (productId: string) =>
    prisma.productImage.deleteMany({ where: { productId } }),
};
