"use client";

// Form edit kategori — client. Submit ke Server Action; tampilkan error validasi.
import { useState } from "react";

type FormResult = { ok: false; errors: Record<string, string[]> } | { ok: true };

export function CategoryEditForm({
  defaultName,
  action,
}: {
  defaultName: string;
  action: (formData: FormData) => Promise<FormResult>;
}) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await action(formData);
    if (result && !result.ok) setError(result.errors.name?.[0] ?? "Gagal menyimpan.");
  }

  return (
    <form action={handleSubmit} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Nama</label>
        <input
          name="name"
          defaultValue={defaultName}
          required
          className="border-border bg-card focus:ring-brand rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <button
        type="submit"
        className="bg-brand text-foreground hover:bg-brand-deep rounded-lg py-2.5 text-sm font-bold transition-colors hover:text-white"
      >
        Simpan
      </button>
    </form>
  );
}
