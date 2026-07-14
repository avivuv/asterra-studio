"use client";

// Tabel kategori admin (DataTable: search/sort/paging) + aksi ikon Edit/Hapus.
import { useTransition } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { IconLink, IconButton } from "@/components/ui/icon-button";
import { deleteCategoryAction } from "@/app/admin/(protected)/kategori/actions";

export type CategoryRow = { id: string; name: string; slug: string };

function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      // Kategori terpakai tak bisa dihapus — tampilkan alasannya.
      if (!result.ok) alert(result.error);
    });
  }

  return (
    <IconButton label="Hapus" variant="danger" onClick={handleDelete} disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </IconButton>
  );
}

const columns: ColumnDef<CategoryRow>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    // tanpa size → melar mengisi sisa lebar tabel
    cell: ({ row }) => <span className="block truncate font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    meta: { width: 220 },
    cell: ({ row }) => (
      <span className="text-muted-foreground block truncate">/{row.original.slug}</span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    meta: { width: 100, align: "right" },
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <IconLink href={`/admin/kategori/${row.original.id}`} label="Edit">
          <Pencil className="size-4" />
        </IconLink>
        <DeleteCategoryButton id={row.original.id} name={row.original.name} />
      </div>
    ),
  },
];

export function CategoryTable({ data }: { data: CategoryRow[] }) {
  return <DataTable columns={columns} data={data} searchPlaceholder="Cari kategori…" />;
}
