// Store keranjang (Zustand + persist localStorage) — SATU-SATUNYA sumber state keranjang.
// Tanpa logika perhitungan total (itu cartService). FEATURES E.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  code: string; // kode produk (untuk pesan WA)
  name: string;
  price: number; // rupiah integer (snapshot saat ditambahkan)
  qty: number;
  imageUrl?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),

      updateQty: (productId, qty) =>
        set((state) => ({
          // qty minimal 1; hapus item dilakukan lewat removeItem.
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i,
          ),
        })),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      clear: () => set({ items: [] }),
    }),
    { name: "asterra-cart" },
  ),
);
