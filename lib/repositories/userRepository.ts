// Repository User — satu-satunya tempat query Prisma untuk User (RULES §1.2).
import { prisma } from "@/lib/prisma";

export const userRepository = {
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
};
