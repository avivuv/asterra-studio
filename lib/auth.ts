// Konfigurasi Auth.js (NextAuth v5) — credentials provider untuk admin.
// authorize() memanggil authService (verifikasi hash bcrypt). Session strategy: JWT.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authService } from "@/lib/services/authService";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;
        return authService.verifyCredentials(email, password);
      },
    }),
  ],
});
