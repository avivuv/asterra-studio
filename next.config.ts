import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Server Action default 1 MB — naikkan agar upload gambar (maks 5 MB/foto) muat.
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;
