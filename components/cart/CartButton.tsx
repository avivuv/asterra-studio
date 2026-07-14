"use client";

// Tombol keranjang di header — ikon + badge jumlah item. Client (baca store Zustand).
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cartService } from "@/lib/services/cartService";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function CartButton() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const count = cartService.countItems(items);

  return (
    <Link
      href="/keranjang"
      aria-label="Keranjang"
      className="hover:bg-muted relative grid size-9 place-items-center rounded-full transition-colors"
    >
      <ShoppingBag className="size-5" />
      {mounted && count > 0 && (
        <span className="bg-brand-deep absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
