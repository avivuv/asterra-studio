"use client";

// Halaman keranjang — rakit item + ringkasan. Client (baca store Zustand).
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { CheckoutButton } from "@/components/cart/CheckoutButton";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function CartPage() {
  const mounted = useMounted();
  const items = useCart((s) => s.items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <h1 className="font-heading mb-6 text-2xl font-semibold tracking-tight">Keranjang</h1>

      {!mounted ? (
        <p className="text-muted-foreground">Memuat…</p>
      ) : items.length === 0 ? (
        <div className="text-muted-foreground py-16 text-center">
          <p>Keranjang masih kosong.</p>
          <Link href="/" className="text-brand-deep mt-3 inline-block font-bold">
            ← Lihat katalog
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="divide-y">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>
          <div className="md:sticky md:top-20 md:self-start">
            <CartSummary>
              <CheckoutButton />
            </CartSummary>
          </div>
        </div>
      )}
    </div>
  );
}
