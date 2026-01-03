import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowed = new Set(
  (process.env.ADMIN_ALLOWED_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    // Keep server session reasonable; client will enforce 5-min idle logout.
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async signIn({ user }) {
      const email = (user.email || "").toLowerCase();
      return allowed.has(email);
    },
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.email = token.email as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
