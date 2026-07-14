// Seed data awal — dijalankan via `prisma db seed` (lihat prisma.config.ts).
// Idempoten: aman dijalankan berulang (pakai upsert). Lihat docs/DATABASE.md §5.
import { config as loadEnv } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Seed jalan di luar Next.js → muat .env.local (fallback .env) manual.
loadEnv({ path: [".env.local", ".env"] });

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL as string),
});

// 3 kategori awal (slug Inggris konsisten — lihat CONVENTIONS.md §3).
const categories = [
  { name: "Aksesoris HP", slug: "phone-accessory" },
  { name: "Gantungan Kunci", slug: "keychain" },
  { name: "Gantungan Tas", slug: "bag-charm" },
];

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
  console.log(`✔ ${categories.length} kategori`);
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL & SEED_ADMIN_PASSWORD wajib diisi di .env.local");
  }
  // Password di-hash bcrypt — jangan pernah simpan plaintext (RULES §5).
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: passwordHash, name: "Admin" },
    create: { email, password: passwordHash, name: "Admin" },
  });
  console.log(`✔ admin (${email})`);
}

async function seedSetting() {
  // Setting singleton — id tetap "default", selalu satu baris (DATABASE.md §2.5).
  await prisma.setting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "Asterra Studio",
      waNumber: "628123456789", // placeholder — diatur admin lewat halaman Pengaturan (P5-01)
      messageTemplate: "Halo, saya mau pesan:\n{items}\nTotal: {total}",
    },
  });
  console.log("✔ setting (singleton)");
}

// Produk contoh untuk pengujian tampilan katalog. Idempoten via upsert by slug.
// Gambar pakai placeholder (Cloudinary asli menyusul di P4-03).
const sampleProducts = [
  { code: "AST-0001", name: "Casing HP Bening", slug: "casing-hp-bening", price: 25000, stock: 12, categorySlug: "phone-accessory" },
  { code: "AST-0002", name: "Popsocket Marmer", slug: "popsocket-marmer", price: 18000, stock: 8, categorySlug: "phone-accessory" },
  { code: "AST-0003", name: "Gantungan Kunci Lucu", slug: "gantungan-kunci-lucu", price: 15000, stock: 20, categorySlug: "keychain" },
  { code: "AST-0004", name: "Gantungan Kunci Resin", slug: "gantungan-kunci-resin", price: 22000, stock: 0, categorySlug: "keychain" },
  { code: "AST-0005", name: "Gantungan Tas Pom-Pom", slug: "gantungan-tas-pom-pom", price: 30000, stock: 5, categorySlug: "bag-charm" },
  { code: "AST-0006", name: "Gantungan Tas Boneka", slug: "gantungan-tas-boneka", price: 35000, stock: 3, categorySlug: "bag-charm" },
];

async function seedProducts() {
  for (const [index, item] of sampleProducts.entries()) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: item.categorySlug } });
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: { code: item.code, name: item.name, price: item.price, stock: item.stock, categoryId: category.id },
      create: {
        code: item.code,
        name: item.name,
        slug: item.slug,
        description: `Contoh produk ${item.name}.`,
        price: item.price,
        stock: item.stock,
        categoryId: category.id,
      },
    });
    // Satu gambar placeholder per produk (idempoten: buat hanya bila belum ada).
    const existing = await prisma.productImage.findFirst({ where: { productId: product.id } });
    if (!existing) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://picsum.photos/seed/${item.slug}/600/600`,
          publicId: `sample/${item.slug}`,
          order: index,
        },
      });
    }
  }
  console.log(`✔ ${sampleProducts.length} produk contoh`);
}

async function main() {
  await seedCategories();
  await seedAdmin();
  await seedSetting();
  await seedProducts();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed selesai.");
  })
  .catch(async (error) => {
    console.error("Seed gagal:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
