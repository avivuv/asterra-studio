"use client";

// Uploader multi-gambar produk — pilih beberapa file → upload Cloudinary → simpan array di hidden JSON.
// Foto pertama = foto utama. Bisa hapus per foto.
import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImageAction } from "@/app/admin/(protected)/produk/upload";

type Img = { url: string; publicId: string };

export function ImageUploader({ defaultImages = [] }: { defaultImages?: Img[] }) {
  const [images, setImages] = useState<Img[]>(defaultImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageAction(formData);
      if (!result.ok) {
        setError(result.error);
        continue;
      }
      setImages((prev) => [...prev, { url: result.url, publicId: result.publicId }]);
    }
    setUploading(false);
    e.target.value = ""; // reset agar file sama bisa dipilih lagi
  }

  function removeAt(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Array gambar (url+publicId) yang ikut submit form produk, sebagai JSON */}
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <div key={img.publicId || img.url} className="relative w-28">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview dari Cloudinary */}
            <img
              src={img.url}
              alt={`Foto ${index + 1}`}
              className="aspect-square w-28 rounded-lg border object-cover"
            />
            {index === 0 && (
              <span className="bg-brand-deep absolute left-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white">
                Utama
              </span>
            )}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Hapus foto ${index + 1}`}
              className="bg-background absolute -right-2 -top-2 grid size-6 place-items-center rounded-full border text-red-500 hover:bg-red-50"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        <label className="border-border hover:bg-muted flex size-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs transition-colors">
          {uploading ? (
            <>
              <Loader2 className="size-5 animate-spin" /> Mengunggah…
            </>
          ) : (
            <>
              <ImagePlus className="size-5" /> Tambah
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFiles}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-muted-foreground text-xs">
        JPG/PNG/WEBP, maks 5 MB per foto. Foto pertama jadi foto utama.
      </p>
    </div>
  );
}
