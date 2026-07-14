"use client";

// Form pengaturan toko — client. Submit ke Server Action; tampilkan error/sukses.
import { useState } from "react";

type Setting = { storeName: string; waNumber: string; messageTemplate: string };
type FormResult =
  | { ok: false; errors: Record<string, string[]> }
  | { ok: true; message: string };

export function SettingForm({
  setting,
  action,
}: {
  setting: Setting;
  action: (formData: FormData) => Promise<FormResult>;
}) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setSuccess(null);
    setErrors({});
    const result = await action(formData);
    setPending(false);
    if (result.ok) setSuccess(result.message);
    else setErrors(result.errors);
  }

  const err = (f: string) => errors[f]?.[0];

  return (
    <form action={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <Field label="Nama Toko" error={err("storeName")}>
        <input name="storeName" defaultValue={setting.storeName} required className={inputClass} />
      </Field>

      <Field
        label="Nomor WhatsApp"
        hint="Format internasional tanpa + atau 0 di depan, mis. 628123456789"
        error={err("waNumber")}
      >
        <input name="waNumber" defaultValue={setting.waNumber} required className={inputClass} />
      </Field>

      <Field label="Template Pesan Checkout" error={err("messageTemplate")}>
        <textarea
          name="messageTemplate"
          defaultValue={setting.messageTemplate}
          rows={4}
          required
          className={inputClass}
        />
        <div className="bg-muted mt-2 rounded-lg p-3 text-xs">
          <p className="font-medium">Variabel yang bisa dipakai:</p>
          <ul className="text-muted-foreground mt-1 space-y-1">
            <li>
              <code className="font-bold">{"{items}"}</code> — daftar produk pesanan (sudah termasuk{" "}
              <strong>kode</strong>, nama, qty, harga per item).
            </li>
            <li>
              <code className="font-bold">{"{total}"}</code> — total keseluruhan.
            </li>
          </ul>
          <p className="text-muted-foreground mt-2">Contoh hasil {"{items}"}:</p>
          <pre className="bg-background mt-1 overflow-x-auto rounded p-2 text-[11px] leading-relaxed">
{`1. [GK-001] Gantungan Kunci Lucu — 2x @Rp15.000 = Rp30.000
2. [AST-0001] Casing HP Bening — 1x @Rp25.000 = Rp25.000`}
          </pre>
        </div>
      </Field>

      {success && <p className="text-sm font-medium text-green-600">{success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand text-foreground hover:bg-brand-deep mt-2 w-fit rounded-lg px-5 py-2.5 text-sm font-bold transition-colors hover:text-white disabled:opacity-50"
      >
        {pending ? "Menyimpan…" : "Simpan"}
      </button>
    </form>
  );
}

const inputClass =
  "border-border bg-card focus:ring-brand w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2";

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
