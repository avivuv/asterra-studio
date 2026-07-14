// Hero beranda — async Server Component. Gradient pastel (ikut skin) + tombol chat WhatsApp toko.
import { settingRepository } from "@/lib/repositories/settingRepository";
import { whatsappService } from "@/lib/services/whatsappService";

export async function Hero() {
  const setting = await settingRepository.get();
  // Chat umum/custom (bukan checkout keranjang) — pesan sapaan default.
  const waLink = setting?.waNumber
    ? whatsappService.buildWaLink(
        setting.waNumber,
        "Halo Asterra Studio, saya mau tanya-tanya / pesan custom.",
      )
    : null;

  return (
    <section
      className="relative overflow-hidden rounded-3xl px-8 py-12 md:px-12"
      style={{
        background:
          "linear-gradient(135deg, var(--hero-a) 0%, var(--hero-b) 55%, var(--hero-c) 100%)",
      }}
    >
      {/* Blob dekoratif */}
      <span className="bg-brand absolute -top-8 right-12 size-32 rounded-full opacity-70 blur-[2px]" />
      <span className="bg-brand-2 absolute -bottom-6 right-40 size-24 rounded-full opacity-70 blur-[2px]" />

      <div className="relative max-w-xl">
        <h1
          className="font-heading text-3xl font-semibold leading-tight md:text-5xl"
          style={{ color: "#4a3b42" }}
        >
          Teman Kecil untuk Harimu yang Manis ✿
        </h1>
        <p className="mt-3 max-w-md text-base" style={{ color: "#6b5560" }}>
          Koleksi gantungan HP, gantungan tas, dan gelang handmade penuh warna. Buat gaya unikmu
          sendiri dengan pesan custom sekarang!
        </p>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4a3b42] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Pesan via WhatsApp
          </a>
        )}
      </div>
    </section>
  );
}
