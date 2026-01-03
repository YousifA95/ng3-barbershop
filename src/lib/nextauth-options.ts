import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

const allowed = new Set(
  (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour server session (idle timeout handled client-side)
  },
  callbacks: {
    async signIn({ user }) {
      const email = (user.email || "").toLowerCase();
      return allowed.has(email);
    },
  },
};
