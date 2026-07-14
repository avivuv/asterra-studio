// Repository Setting — satu-satunya tempat query Prisma untuk Setting (singleton id="default").
import { prisma } from "@/lib/prisma";

const SETTING_ID = "default";

type SettingData = { storeName: string; waNumber: string; messageTemplate: string };

export const settingRepository = {
  get: () => prisma.setting.findUnique({ where: { id: SETTING_ID } }),

  // Singleton: selalu satu baris (id tetap "default").
  upsert: (data: SettingData) =>
    prisma.setting.upsert({
      where: { id: SETTING_ID },
      update: data,
      create: { id: SETTING_ID, ...data },
    }),
};
