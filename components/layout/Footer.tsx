// Footer publik — async Server Component. Anchor #kontak berisi tautan WhatsApp toko dari Setting.
import { MessageCircle } from "lucide-react";
import { settingRepository } from "@/lib/repositories/settingRepository";
import { whatsappService } from "@/lib/services/whatsappService";

export async function Footer() {
  const year = new Date().getFullYear();
  const setting = await settingRepository.get();
  const storeName = setting?.storeName ?? "Asterra Studio";
  const waLink = setting?.waNumber
    ? whatsappService.buildWaLink(setting.waNumber, `Halo ${storeName}, saya mau tanya produk.`)
    : null;

  return (
    <footer id="kontak" className="mt-auto scroll-mt-20 border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <p className="font-heading text-foreground text-lg font-semibold">{storeName}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Katalog aksesoris HP &amp; gantungan (kunci/tas).
        </p>

        <div className="mt-5">
          <p className="text-sm font-medium">Kontak</p>
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="size-4" />
              Chat WhatsApp
            </a>
          ) : (
            <p className="text-muted-foreground mt-2 text-sm">
              Nomor WhatsApp belum diatur admin.
            </p>
          )}
        </div>

        <p className="text-muted-foreground mt-8 text-sm">© {year} {storeName}.</p>
      </div>
    </footer>
  );
}
