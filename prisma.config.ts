// Konfigurasi Prisma 7 — koneksi DB tidak lagi di schema.prisma, tapi di sini via driver adapter.
// Lihat docs/DATABASE.md. Adapter MariaDB kompatibel dengan MySQL (Docker lokal / serverless).
import { config as loadEnv } from "dotenv";
import path from "node:path";

// Prisma CLI berjalan di luar Next.js, jadi muat .env.local (fallback .env) secara eksplisit.
loadEnv({ path: [".env.local", ".env"] });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    // Dipakai Prisma Migrate (migrate dev/deploy) & Studio untuk konek ke DB.
    url: env("DATABASE_URL"),
  },
  migrations: {
    // `prisma db seed` menjalankan skrip ini.
    seed: "tsx prisma/seed.ts",
  },
});
