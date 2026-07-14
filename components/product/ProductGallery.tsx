"use client";

// Galeri foto produk — foto utama + thumbnail, klik ganti foto aktif. Client (butuh useState).
import { useState } from "react";
import type { ProductDetail } from "@/lib/services/productService";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductDetail["images"];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  if (images.length === 0) {
    return (
      <div className="bg-muted text-muted-foreground grid aspect-square place-items-center rounded-2xl text-sm">
        Tanpa gambar
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-muted aspect-square overflow-hidden rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element -- placeholder eksternal; Cloudinary + next/image di P4-03 */}
        <img src={active.url} alt={name} className="h-full w-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Foto ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={`size-16 overflow-hidden rounded-lg border-2 transition-colors ${
                index === activeIndex ? "border-brand-deep" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- lihat di atas */}
              <img src={image.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
