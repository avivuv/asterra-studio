// Helper format yang dipakai ulang di seluruh app. Jangan format harga/slug manual (DRY — RULES §2).

/**
 * Format harga rupiah dari integer. Contoh: 15000 → "Rp15.000".
 * Rupiah tak pakai desimal, jadi digit pecahan dibuang.
 */
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s/g, ""); // buang spasi/NBSP setelah "Rp" → "Rp15.000"
}

/**
 * Persen diskon dari harga normal → harga promo. Contoh: (20000, 15000) → 25.
 * Kembalikan 0 bila tak ada promo / tak valid.
 */
export function discountPercent(price: number, promoPrice: number | null | undefined): number {
  if (!promoPrice || promoPrice >= price) return 0;
  return Math.round(((price - promoPrice) / price) * 100);
}

/**
 * Ubah teks jadi slug URL yang bersih. Contoh: "Gantungan Kunci Lucu!" → "gantungan-kunci-lucu".
 * Lowercase, buang tanda diakritik, ganti non-alfanumerik jadi "-", rapikan "-" ganda/tepi.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFKD") // pisahkan huruf + diakritik
    .replace(/[̀-ͯ]/g, "") // buang diakritik (combining marks)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // non-alfanumerik → "-"
    .replace(/^-+|-+$/g, ""); // buang "-" di tepi
}
