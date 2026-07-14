// Service dashboard — agregasi ringkasan (RULES §1.3). Gabung count dari beberapa repository.
import { productRepository } from "@/lib/repositories/productRepository";
import { categoryRepository } from "@/lib/repositories/categoryRepository";

export const dashboardService = {
  async getSummary() {
    const [total, active, outOfStock, categories] = await Promise.all([
      productRepository.countAll(),
      productRepository.countActive(),
      productRepository.countOutOfStock(),
      categoryRepository.countAll(),
    ]);
    return {
      totalProducts: total,
      activeProducts: active,
      inactiveProducts: total - active,
      outOfStock,
      categories,
    };
  },
};
