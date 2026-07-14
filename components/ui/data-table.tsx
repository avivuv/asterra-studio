"use client";

// DataTable reusable (TanStack Table + shadcn) — search global, sorting, pagination client-side.
// Cocok untuk data kecil (<100 baris). Dipakai admin produk/kategori.
import { useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Meta kolom: width tetap (px) — tak diisi = melar mengisi sisa; align isi sel.
export type ColumnMeta = { width?: number; align?: "left" | "right" | "center" };

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  pageSize?: number;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Cari…",
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Search global */}
      <div className="relative w-full max-w-xs">
        <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Cari di tabel"
          className="border-border bg-card focus:ring-brand w-full rounded-full border py-2 pl-9 pr-4 text-sm outline-none focus:ring-2"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          {/* Width tetap dari columnDef.size; kolom tanpa size → auto (melar isi sisa). */}
          <colgroup>
            {table.getAllLeafColumns().map((column) => {
              const width = (column.columnDef.meta as ColumnMeta | undefined)?.width;
              return <col key={column.id} style={width ? { width: `${width}px` } : undefined} />;
            })}
          </colgroup>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const align = (header.column.columnDef.meta as ColumnMeta | undefined)?.align;
                  return (
                    <TableHead key={header.id} className={align ? alignClass[align] : undefined}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="hover:text-foreground inline-flex items-center gap-1"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <ArrowUpDown className="size-3.5 opacity-60" />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const align = (cell.column.columnDef.meta as ColumnMeta | undefined)?.align;
                    return (
                      <TableCell key={cell.id} className={align ? alignClass[align] : undefined}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {totalRows} baris · halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount() || 1}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="size-4" /> Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Berikutnya <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
