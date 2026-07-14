"use client";

// Baris item keranjang — kontrol qty (+/−) + hapus. Client (mutasi store).
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartItem as TCartItem } from "@/lib/cart";
import { cartService } from "@/lib/services/cartService";
import { formatIDR } from "@/lib/format";

export function CartItem({ item }: { item: TCartItem }) {
  const updateQty = useCart((s) => s.updateQty);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = cartService.calculateSubtotal(item);

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-lg">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- placeholder eksternal (Cloudinary + next/image di P4-03)
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{item.name}</p>
        <p className="text-muted-foreground text-sm">{formatIDR(item.price)}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => updateQty(item.productId, item.qty - 1)}
          disabled={item.qty <= 1}
          aria-label="Kurangi"
          className="hover:bg-muted grid size-8 place-items-center rounded-full disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center text-sm font-bold tabular-nums">{item.qty}</span>
        <button
          type="button"
          onClick={() => updateQty(item.productId, item.qty + 1)}
          aria-label="Tambah"
          className="hover:bg-muted grid size-8 place-items-center rounded-full"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="w-24 text-right text-sm font-bold tabular-nums">{formatIDR(subtotal)}</div>

      <button
        type="button"
        onClick={() => removeItem(item.productId)}
        aria-label="Hapus"
        className="text-muted-foreground hover:text-red-500 grid size-8 place-items-center rounded-full transition-colors"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
