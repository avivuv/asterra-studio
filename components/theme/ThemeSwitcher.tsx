"use client";

// Kontrol tema: pilih warna (skin) + terang/gelap. Simpan pilihan ke localStorage.
import { useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Mode = "light" | "dark";
type Skin = "pink" | "lavender" | "mint";

const skins: { value: Skin; label: string; color: string }[] = [
  { value: "pink", label: "Pink", color: "#f7a8b8" },
  { value: "lavender", label: "Lavender", color: "#c8b6e2" },
  { value: "mint", label: "Mint", color: "#b8e0d2" },
];

function readAttr<T extends string>(name: string, fallback: T): T {
  if (typeof document === "undefined") return fallback;
  return (document.documentElement.getAttribute(name) as T) ?? fallback;
}

// true hanya di client setelah mount — server & first client render mengembalikan false,
// jadi keduanya sepakat (tak ada hydration mismatch). Tanpa setState-in-effect.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client
    () => false, // server
  );
}

export function ThemeSwitcher() {
  const mounted = useMounted();
  const [mode, setMode] = useState<Mode>(() => readAttr("data-theme", "light"));
  const [skin, setSkin] = useState<Skin>(() => readAttr("data-skin", "pink"));

  function applyMode(next: Mode) {
    setMode(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("asterra-theme", next);
  }

  function applySkin(next: Skin) {
    setSkin(next);
    document.documentElement.setAttribute("data-skin", next);
    localStorage.setItem("asterra-skin", next);
  }

  // Sebelum mount: placeholder berukuran sama → SSR & hydrate cocok, baru isi kontrol asli.
  if (!mounted) return <div className="h-8 w-[120px]" aria-hidden />;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5" role="group" aria-label="Pilih warna">
        {skins.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => applySkin(s.value)}
            aria-label={`Warna ${s.label}`}
            aria-pressed={skin === s.value}
            className={`size-5 rounded-full transition-transform hover:scale-110 ${
              skin === s.value ? "ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""
            }`}
            style={{ backgroundColor: s.color }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => applyMode(mode === "dark" ? "light" : "dark")}
        aria-label={mode === "dark" ? "Ganti ke terang" : "Ganti ke gelap"}
        className="text-muted-foreground hover:text-foreground grid size-8 place-items-center rounded-full transition-colors"
      >
        {mode === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </button>
    </div>
  );
}
