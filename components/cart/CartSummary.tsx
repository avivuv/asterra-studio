"use client";

// Ringkasan keranjang — total via cartService + slot tombol checkout. Client.
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { cartService } from "@/lib/services/cartService";
import { formatIDR } from "@/lib/format";

export function CartSummary({ children }: { children?: ReactNode }) {
  const items = useCart((s) => s.items);
  const total = cartService.calculateTotal(items);
  const count = cartService.countItems(items);

  return (
    <div className="bg-card rounded-2xl border p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Jumlah item</span>
        <span className="font-bold tabular-nums">{count}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold">Total</span>
        <span className="text-brand-deep text-xl font-extrabold tabular-nums">
          {formatIDR(total)}
        </span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
