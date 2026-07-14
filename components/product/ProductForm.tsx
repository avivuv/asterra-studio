"use client";

// Form produk (create/edit) — client. Submit ke Server Action; tampilkan error validasi Zod.
import { useState } from "react";
import type { ProductDetail } from "@/lib/services/productService";
import { ImageUploader } from "@/components/product/ImageUploader";

type Category = { id: string; name: string };
type ActionResult = { ok: false; errors: Record<string, string[]> } | { ok: true };

export function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: ProductDetail;
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    const result = await action(formData);
    setPending(false);
    // Bila sukses, Action melakukan redirect (tak sampai sini). Bila gagal → tampilkan error.
    if (result && !result.ok) setErrors(result.errors);
  }

  const err = (field: string) => errors[field]?.[0];

  return (
    <form action={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <Field
        label="Kode Produk"
        hint="Kode unik untuk identifikasi (mis. GK-001). Otomatis huruf besar."
        error={err("code")}
      >
        <input
          name="code"
          defaultValue={product?.code ?? ""}
          required
          placeholder="mis. GK-001"
          className={`${inputClass} uppercase`}
        />
      </Field>

      <Field label="Nama" error={err("name")}>
        <input name="name" defaultValue={product?.name} required className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Harga (Rp)" error={err("price")}>
          <NumberInput name="price" min={1} defaultValue={product?.price} required />
        </Field>
        <Field label="Stok" error={err("stock")}>
          <NumberInput name="stock" min={0} defaultValue={product?.stock ?? 0} required />
        </Field>
      </div>

      <Field
        label="Harga Promo (opsional)"
        hint="Isi bila sedang diskon — harga jual jadi harga ini, 'Harga' di atas dicoret. Kosongkan untuk mengakhiri promo."
        error={err("promoPrice")}
      >
        <NumberInput
          name="promoPrice"
          min={1}
          defaultValue={product?.promoPrice ?? ""}
          placeholder="Kosongkan bila tidak promo"
        />
      </Field>

      <Field label="Kategori" error={err("categoryId")}>
        <select name="categoryId" defaultValue={product?.categoryId ?? ""} required className={inputClass}>
          <option value="" disabled>
            Pilih kategori
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Deskripsi" error={err("description")}>
        <textarea name="description" defaultValue={product?.description ?? ""} rows={4} className={inputClass} />
      </Field>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Gambar Produk</label>
        <ImageUploader
          defaultImages={product?.images.map((i) => ({ url: i.url, publicId: i.publicId })) ?? []}
        />
        {err("images") && <p className="text-sm text-red-500">{err("images")}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} value="true" />
        Aktif (tampil di katalog)
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="isFeatured"
          type="checkbox"
          defaultChecked={product?.isFeatured ?? false}
          value="true"
        />
        Produk unggulan (tampil di section &quot;Produk Pilihan&quot;)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-brand text-foreground hover:bg-brand-deep mt-2 rounded-lg py-2.5 text-sm font-bold transition-colors hover:text-white disabled:opacity-50"
      >
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}

const inputClass =
  "border-border bg-card focus:ring-brand w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2";

// Input angka yang TIDAK berubah saat scroll mouse (cegah nilai bergeser tak sengaja, mis. 15000→14996).
function NumberInput(props: React.ComponentProps<"input">) {
  return (
    <input
      type="number"
      inputMode="numeric"
      onWheel={(e) => e.currentTarget.blur()}
      className={inputClass}
      {...props}
    />
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
