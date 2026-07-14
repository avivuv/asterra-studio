// Kartu produk (Gaya A: soft card + tombol) — Server Component.
import Link from "next/link";
import type { CatalogProduct } from "@/lib/services/productService";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatIDR, discountPercent } from "@/lib/format";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const mainImage = product.images[0]?.url;
  const soldOut = product.stock === 0;
  const discount = discountPercent(product.price, product.promoPrice);
  const displayPrice = discount > 0 ? product.promoPrice! : product.price;

  return (
    <div className="bg-card group flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg">
      <Link href={`/produk/${product.slug}`} className="relative block aspect-square overflow-hidden">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- placeholder eksternal; Cloudinary + next/image di P4-03
          <img
            src={mainImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground bg-muted flex h-full items-center justify-center text-sm">
            Tanpa gambar
          </div>
        )}
        <span className="bg-background/90 text-brand-deep absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold">
          {product.category.name}
        </span>
        {discount > 0 && !soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-0 grid place-items-center bg-black/45">
            <span className="bg-background text-foreground rounded-full px-3 py-1 text-xs font-bold">
              Habis
            </span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link href={`/produk/${product.slug}`}>
          <p className="text-muted-foreground text-[11px] font-medium tabular-nums">{product.code}</p>
          <h3 className="line-clamp-1 text-sm font-bold">{product.name}</h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <p className="text-brand-deep text-base font-extrabold tabular-nums">
            {formatIDR(displayPrice)}
          </p>
          {discount > 0 && (
            <p className="text-muted-foreground text-xs line-through tabular-nums">
              {formatIDR(product.price)}
            </p>
          )}
        </div>
        <div className="mt-2">
          <AddToCartButton
            productId={product.id}
            code={product.code}
            name={product.name}
            price={displayPrice}
            imageUrl={mainImage}
            disabled={soldOut}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}
