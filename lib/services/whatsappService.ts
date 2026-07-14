// Service WhatsApp — susun pesan pesanan & link wa.me (RULES §1.3). Fungsi murni, tanpa DB/JSX.
import type { CartItem } from "@/lib/cart";
import { cartService } from "@/lib/services/cartService";
import { formatIDR } from "@/lib/format";

// Susun daftar item jadi teks. Contoh baris: "1. Gelang Manik — 2x @Rp15.000 = Rp30.000"
function renderItems(items: CartItem[]): string {
  const summary = cartService.buildOrderSummary(items);
  return summary.lines
    .map(
      (line, i) =>
        `${i + 1}. [${line.code}] ${line.name} — ${line.qty}x @${formatIDR(line.price)} = ${formatIDR(line.subtotal)}`,
    )
    .join("\n");
}

export const whatsappService = {
  // Susun teks pesan dari template. Placeholder yang didukung: {items}, {total}.
  // Bila template tak punya placeholder, daftar item + total ditambahkan setelahnya.
  buildOrderMessage(items: CartItem[], template: string): string {
    const itemsText = renderItems(items);
    const total = formatIDR(cartService.calculateTotal(items));

    if (template.includes("{items}") || template.includes("{total}")) {
      return template.replace("{items}", itemsText).replace("{total}", total);
    }
    return `${template}\n${itemsText}\nTotal: ${total}`;
  },

  // Bangun link wa.me. waNumber format internasional tanpa "+"/"0" (mis. 628xxx).
  buildWaLink(waNumber: string, message: string): string {
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  },
};
