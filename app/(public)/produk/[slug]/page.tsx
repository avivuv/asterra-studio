// Detail produk (Controller — Server Component). Tipis: getDetail → null? notFound() : render.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productService } from "@/lib/services/productService";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ShareButton } from "@/components/product/ShareButton";
import { formatIDR, discountPercent } from "@/lib/format";

// SEO: title/description/OG dari data produk. Reuse Service (bukan query Prisma di metadata).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getDetail(slug);
  if (!product) return { title: "Produk tidak ditemukan — Asterra Studio" };

  const description =
    product.description?.trim() ||
    `${product.name} — ${product.category.name} di Asterra Studio. ${formatIDR(product.price)}.`;
  const image = product.images[0]?.url;

  return {
    title: `${product.name} — Asterra Studio`,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productService.getDetail(slug);
  if (!product) notFound(); // produk nonaktif / tidak ada → 404 (aturan FEATURES D)

  const soldOut = product.stock === 0;
  const discount = discountPercent(product.price, product.promoPrice);
  const displayPrice = discount > 0 ? product.promoPrice! : product.price;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
        ← Kembali ke katalog
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-brand-deep font-bold">{product.category.name}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground tabular-nums">Kode: {product.code}</span>
          </div>
          <h1 className="font-heading mt-1 text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3 flex items-baseline gap-3">
            <p className="text-brand-deep text-2xl font-extrabold tabular-nums">
              {formatIDR(displayPrice)}
            </p>
            {discount > 0 && (
              <>
                <p className="text-muted-foreground text-base line-through tabular-nums">
                  {formatIDR(product.price)}
                </p>
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-1 text-sm">
            {soldOut ? (
              <span className="font-bold text-red-500">Stok habis</span>
            ) : (
              <span className="text-muted-foreground">Stok: {product.stock}</span>
            )}
          </p>

          {product.description && (
            <p className="text-muted-foreground mt-5 whitespace-pre-line leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Tambah ke keranjang + bagikan (client). Checkout WA dari halaman keranjang. */}
          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton
              productId={product.id}
              code={product.code}
              name={product.name}
              price={displayPrice}
              imageUrl={product.images[0]?.url}
              disabled={soldOut}
              label="+ Tambah ke keranjang"
            />
            <ShareButton name={product.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
