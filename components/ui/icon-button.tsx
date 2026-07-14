// Tombol aksi ikon konsisten untuk tabel admin (Edit/Hapus). Varian: netral & danger.
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const base =
  "inline-flex size-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-50";
const variants = {
  neutral: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/40",
};

type Variant = keyof typeof variants;

export function IconLink({
  href,
  label,
  variant = "neutral",
  children,
}: {
  href: string;
  label: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} title={label} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}

export function IconButton({
  label,
  variant = "neutral",
  children,
  ...props
}: {
  label: string;
  variant?: Variant;
  children: ReactNode;
} & ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`${base} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
