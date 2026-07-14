"use server";

// Server Action checkout — ambil Setting toko, susun pesan & link wa.me. Tipis: repo → service.
import { settingRepository } from "@/lib/repositories/settingRepository";
import { whatsappService } from "@/lib/services/whatsappService";
import type { CartItem } from "@/lib/cart";

export async function buildCheckoutLink(
  items: CartItem[],
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (items.length === 0) return { ok: false, error: "Keranjang kosong." };

  const setting = await settingRepository.get();
  if (!setting?.waNumber) {
    return { ok: false, error: "Nomor WhatsApp toko belum diatur." };
  }

  const message = whatsappService.buildOrderMessage(items, setting.messageTemplate);
  const url = whatsappService.buildWaLink(setting.waNumber, message);
  return { ok: true, url };
}
