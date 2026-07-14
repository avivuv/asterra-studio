"use client";

// Tombol hapus produk (ikon) — konfirmasi dulu, lalu panggil Server Action.
import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { deleteProductAction } from "@/app/admin/(protected)/produk/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Hapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    startTransition(() => deleteProductAction(id));
  }

  return (
    <IconButton label="Hapus" variant="danger" onClick={handleDelete} disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </IconButton>
  );
}
