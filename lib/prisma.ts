// Prisma Client singleton — SATU-SATUNYA instansiasi (lihat CLAUDE.md §2, RULES §1.2).
// Mencegah ledakan koneksi saat hot-reload (dev) & serverless (produksi).
// Prisma 7: koneksi lewat driver adapter (MariaDB adapter, kompatibel MySQL).
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  // Adapter menerima connection string. Batasi koneksi lewat query param di DATABASE_URL
  // (mis. `?connectionLimit=3`) agar tiap serverless function Vercel tak buka banyak koneksi
  // → MySQL tak cepat kehabisan connection. Lihat CLAUDE.md §2 & docs/DEPLOY.md.
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
