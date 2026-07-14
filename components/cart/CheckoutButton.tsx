"use client";

// Tombol checkout WhatsApp — panggil server action → buka wa.me. Client (baca store + interaksi).
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { buildCheckoutLink } from "@/app/(public)/keranjang/actions";

export function CheckoutButton() {
  const items = useCart((s) => s.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    const result = await buildCheckoutLink(items);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Buka chat WhatsApp di tab baru.
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
        className="bg-brand text-foreground hover:bg-brand-deep w-full rounded-xl py-3 text-sm font-bold transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Menyiapkan…" : "Pesan via WhatsApp"}
      </button>
      {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
    </div>
  );
}
