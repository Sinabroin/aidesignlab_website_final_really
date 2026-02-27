/** NextAuth 설정 — DB 없는 Stateless 매직링크 인증 (HMAC-signed JWT) */
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyMagicToken } from "@/lib/auth/magic-token";

function buildCredentialsProvider() {
  return CredentialsProvider({
    id: "magic-link",
    name: "Magic Link",
    credentials: { token: { label: "Token", type: "text" } },
    async authorize(credentials) {
      const email = verifyMagicToken(credentials?.token ?? "");
      if (!email) return null;
      const name = email.split("@")[0] ?? email;
      return { id: email, email, name };
    },
  });
}

export const authOptions: NextAuthOptions = {
  providers: [buildCredentialsProvider()],
  logger: {
    error(code, metadata) { console.error("[NextAuth]", code, metadata); },
    warn() {},
    debug() {},
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      if (user?.name) token.name = user.name;
      return token;
    },
    async session({ session, token }) {
      if (!session.user) return session;
      session.user.name = (token.name as string | undefined) ?? session.user.name;
      session.user.email = (token.email as string | undefined) ?? session.user.email;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-do-not-use-in-production",
};
