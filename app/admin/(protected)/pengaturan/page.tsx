// Pengaturan toko (Controller). Ambil Setting → form → Action update.
import { settingService } from "@/lib/services/settingService";
import { SettingForm } from "@/components/setting/SettingForm";
import { updateSettingAction } from "./actions";

export default async function AdminPengaturanPage() {
  const setting = await settingService.get();

  return (
    <div>
      <h1 className="font-heading mb-2 text-2xl font-semibold tracking-tight">Pengaturan Toko</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Nama toko, nomor WhatsApp, dan template pesan checkout.
      </p>
      <SettingForm
        setting={{
          storeName: setting?.storeName ?? "Asterra Studio",
          waNumber: setting?.waNumber ?? "",
          messageTemplate: setting?.messageTemplate ?? "Halo, saya mau pesan:\n{items}\nTotal: {total}",
        }}
        action={updateSettingAction}
      />
    </div>
  );
}
