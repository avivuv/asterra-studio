// Service Setting — logika toko (RULES §1.3). Jaga singleton via upsert.
import { settingRepository } from "@/lib/repositories/settingRepository";
import type { SettingInput } from "@/lib/validations/setting";

export const settingService = {
  get: () => settingRepository.get(),

  update: (input: SettingInput) =>
    settingRepository.upsert({
      storeName: input.storeName,
      waNumber: input.waNumber,
      messageTemplate: input.messageTemplate,
    }),
};
