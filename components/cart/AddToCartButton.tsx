"use client";

// Tombol tambah ke keranjang — client (akses store Zustand). Dipakai di kartu katalog & detail.
import { useState } from "react";
import { useCart } from "@/lib/cart";

type Props = {
  productId: string;
  code: string;
  name: string;
  price: number;
  imageUrl?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string;
};

export function AddToCartButton({
  productId,
  code,
  name,
  price,
  imageUrl,
  disabled,
  fullWidth,
  label = "+ Keranjang",
}: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ productId, code, name, price, imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className={`bg-brand text-foreground hover:bg-brand-deep rounded-xl py-2.5 text-sm font-bold transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${
        fullWidth ? "w-full" : "px-6"
      }`}
    >
      {disabled ? "Stok habis" : added ? "✓ Ditambahkan" : label}
    </button>
  );
}
