// Service keranjang — logika perhitungan (RULES §1.3). Fungsi murni, tanpa DB/JSX.
import type { CartItem } from "@/lib/cart";

export type OrderLine = {
  code: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
};

export type OrderSummary = {
  lines: OrderLine[];
  total: number;
  itemCount: number; // total qty semua item
};

export const cartService = {
  calculateSubtotal: (item: CartItem): number => item.price * item.qty,

  calculateTotal: (items: CartItem[]): number =>
    items.reduce((sum, item) => sum + item.price * item.qty, 0),

  countItems: (items: CartItem[]): number => items.reduce((sum, item) => sum + item.qty, 0),

  // Ringkasan pesanan — dipakai UI keranjang & whatsappService (susun pesan).
  buildOrderSummary: (items: CartItem[]): OrderSummary => ({
    lines: items.map((item) => ({
      code: item.code,
      name: item.name,
      qty: item.qty,
      price: item.price,
      subtotal: item.price * item.qty,
    })),
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    itemCount: items.reduce((sum, item) => sum + item.qty, 0),
  }),
};
