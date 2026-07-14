# Ticket Board — Asterra Studio

Status semua tiket. Kerjakan berurutan; dependency dirancang searah. Legenda status:
⬜ Todo · 🔄 In progress · ✅ Done.

> **Desain:** arah UI cute/pastel + switch tema sudah diterapkan (lintas-tiket) —
> lihat [`../implementations/UI-01-design-pastel-theme.md`](../implementations/UI-01-design-pastel-theme.md).

## Fase 1 — Fondasi (scaffold, DB, auth, layout)

| Tiket | Judul | Prioritas | Dep | Status |
|-------|-------|-----------|-----|--------|
| [P1-01](P1-01-scaffold.md) | Scaffold Next.js + TS + Tailwind + shadcn | P0 | — | ✅ |
| [P1-02](P1-02-prisma-schema.md) | Prisma singleton + schema + migrasi | P0 | P1-01 | ✅ |
| [P1-03](P1-03-seed.md) | Seed (kategori, admin, setting) | P0 | P1-02 | ✅ |
| [P1-04](P1-04-format-helpers.md) | Helper `formatIDR` + `slugify` | P0 | P1-01 | ✅ |
| [P1-05](P1-05-layout-publik.md) | Layout publik (Header, Footer) | P0 | P1-01 | ✅ |

## Fase 2 — Katalog publik

| Tiket | Judul | Fitur | Prioritas | Dep | Status |
|-------|-------|-------|-----------|-----|--------|
| [P2-01](P2-01-product-repository.md) | Product repository (read) | A,B,C,D | P0 | P1-02 | ✅ |
| [P2-02](P2-02-product-service-catalog.md) | Product service: katalog + detail | A,B,C,D | P0 | P2-01 | ✅ |
| [P2-03](P2-03-katalog-grid.md) | Katalog grid + ProductCard | A | P0 | P2-02,P1-05 | ✅ |
| [P2-04](P2-04-filter-search.md) | Filter kategori + pencarian | B,C | P0 | P2-03 | ✅ |
| [P2-05](P2-05-detail-produk.md) | Halaman detail produk | D | P0 | P2-02 | ✅ |
| [P2-06](P2-06-seo-metadata.md) | SEO & metadata (generateMetadata, OG) | P | P1 | P2-05 | ✅ |

## Fase 3 — Keranjang + Checkout WhatsApp

| Tiket | Judul | Fitur | Prioritas | Dep | Status |
|-------|-------|-------|-----------|-----|--------|
| [P3-01](P3-01-cart-store.md) | Cart store (Zustand + persist) | E | P0 | P1-04 | ✅ |
| [P3-02](P3-02-cart-service.md) | Cart service (hitung total/subtotal) | E | P0 | P3-01 | ✅ |
| [P3-03](P3-03-cart-ui.md) | UI keranjang (CartButton, CartItem, CartSummary) | E | P0 | P3-02 | ✅ |
| [P3-04](P3-04-whatsapp-checkout.md) | Setting repo + whatsappService + CheckoutButton | F | P0 | P3-02,P1-02 | ✅ |

## Fase 4 — Admin (auth + CRUD produk + gambar)

| Tiket | Judul | Fitur | Prioritas | Dep | Status |
|-------|-------|-------|-----------|-----|--------|
| [P4-01](P4-01-auth.md) | Auth.js credentials + proteksi /admin | G | P0 | P1-02,P1-03 | ✅ |
| [P4-02](P4-02-admin-layout.md) | Layout admin + AdminSidebar + logout | G | P0 | P4-01 | ✅ |
| [P4-03](P4-03-image-service.md) | imageService (Cloudinary) + productImageRepository | I | P0 | P1-02 | ✅ |
| [P4-04](P4-04-crud-produk.md) | CRUD produk (repo write + service + actions + form) | H | P0 | P4-02,P4-03 | ✅ |
| [P4-05](P4-05-status-stok.md) | Status stok / badge "Habis" | M | P1 | P2-03,P4-04 | ✅ |
| [P4-06](P4-06-crud-kategori.md) | CRUD kategori | J | P1 | P4-02 | ✅ |

## Fase 5 — Pengaturan + deploy

| Tiket | Judul | Fitur | Prioritas | Dep | Status |
|-------|-------|-------|-----------|-----|--------|
| [P5-01](P5-01-pengaturan-toko.md) | Pengaturan toko (settingService + form) | K | P0 | P4-02,P3-04 | ✅ |
| [P5-02](P5-02-dashboard.md) | Dashboard ringkasan admin | L | P1 | P4-04 | ✅ |
| [P5-03](P5-03-deploy.md) | Deploy Vercel + migrasi PlanetScale | — | P0 | semua P0 | ⬜ |

---

**Peningkatan P2 (diminta, selesai)** — Featured (N), Share (O), Promo/diskon (Q):
lihat [`../implementations/P6-featured-promo-share.md`](../implementations/P6-featured-promo-share.md).

**Masih out of scope** — lihat [`../FEATURES.md`](../FEATURES.md) §5:
payment gateway, akun pembeli, riwayat order di DB, ongkir, multi-admin, rating/ulasan.
Jangan dibangun sebelum diminta.
