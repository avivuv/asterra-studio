"use client";

// Tombol bagikan produk — Web Share API bila didukung, fallback salin link. Client.
import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    // Web Share API (mobile) → sheet native (termasuk WhatsApp/IG).
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
        return;
      } catch {
        // dibatalkan user → tak masalah
        return;
      }
    }
    // Fallback desktop: salin link.
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition-colors"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {copied ? "Link disalin" : "Bagikan"}
    </button>
  );
}
