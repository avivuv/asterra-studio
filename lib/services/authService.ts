// Service auth — verifikasi kredensial (RULES §1.3). Bandingkan password dengan hash bcrypt.
import bcrypt from "bcryptjs";
import { userRepository } from "@/lib/repositories/userRepository";

export const authService = {
  // Kembalikan user (tanpa password) bila kredensial cocok, null bila tidak.
  async verifyCredentials(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    return { id: user.id, email: user.email, name: user.name };
  },
};
