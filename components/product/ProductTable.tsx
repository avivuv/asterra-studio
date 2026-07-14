"use client";

// Tabel produk admin (DataTable: search/sort/paging). Terima baris ringkas dari Server Component.
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { IconLink } from "@/components/ui/icon-button";
import { DeleteProductButton } from "@/components/product/DeleteProductButton";
import { formatIDR } from "@/lib/format";

export type ProductRow = {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
};

const columns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "code",
    header: "Kode",
    meta: { width: 120 },
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">{row.original.code}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama",
    // tanpa meta.width → melar mengisi sisa lebar tabel
    cell: ({ row }) => <span className="block truncate font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "category",
    header: "Kategori",
    meta: { width: 160 },
    cell: ({ row }) => <span className="block truncate">{row.original.category}</span>,
  },
  {
    accessorKey: "price",
    header: "Harga",
    meta: { width: 130, align: "right" },
    cell: ({ row }) => <span className="tabular-nums">{formatIDR(row.original.price)}</span>,
  },
  {
    accessorKey: "stock",
    header: "Stok",
    meta: { width: 90, align: "right" },
    cell: ({ row }) => <span className="tabular-nums">{row.original.stock}</span>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    meta: { width: 110 },
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="text-brand-deep font-medium">Aktif</span>
      ) : (
        <span className="text-muted-foreground">Nonaktif</span>
      ),
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    meta: { width: 100, align: "right" },
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <IconLink href={`/admin/produk/${row.original.id}`} label="Edit">
          <Pencil className="size-4" />
        </IconLink>
        <DeleteProductButton id={row.original.id} name={row.original.name} />
      </div>
    ),
  },
];

export function ProductTable({ data }: { data: ProductRow[] }) {
  return <DataTable columns={columns} data={data} searchPlaceholder="Cari produk…" />;
}
