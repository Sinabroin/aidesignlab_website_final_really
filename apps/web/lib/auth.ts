/** NextAuth 인증 설정 — JWT 세션 방식, PrismaAdapter 미사용 */
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type AuthProvider = NextAuthOptions["providers"][number];

function isAllowedEmailDomain(email: string | null | undefined): boolean {
  if (!email) return false;
  const domains = (process.env.ALLOWED_EMAIL_DOMAINS ?? "hdec.co.kr")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  if (domains.length === 0) return false;
  const userDomain = email.split("@")[1]?.toLowerCase();
  if (!userDomain) return false;
  return domains.some((d) => userDomain === d);
}

function buildProviders(): AuthProvider[] {
  const providers: AuthProvider[] = [];

  const { AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID } =
    process.env;

  if (AZURE_AD_CLIENT_ID && AZURE_AD_CLIENT_SECRET && AZURE_AD_TENANT_ID) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AzureADProvider = require("next-auth/providers/azure-ad").default;
    providers.push(
      AzureADProvider({
        clientId: AZURE_AD_CLIENT_ID,
        clientSecret: AZURE_AD_CLIENT_SECRET,
        tenantId: AZURE_AD_TENANT_ID,
        authorization: { params: { scope: "openid profile email" } },
      })
    );
  }

  if (providers.length === 0) {
    providers.push(
      CredentialsProvider({
        name: "Guest",
        credentials: {},
        async authorize() {
          return { id: "guest", name: "Guest", email: "guest@example.com" };
        },
      })
    );
  }

  return providers;
}

export const authOptions: NextAuthOptions = {
  providers: buildProviders(),
  callbacks: {
    async signIn({ user, account }) {
      // #region agent log
      console.log("[AUTH_DEBUG] signIn callback", {
        hasEmail: !!user?.email,
        emailDomain: user?.email?.split("@")[1],
        provider: account?.provider,
        hasAzureConfig: !!process.env.AZURE_AD_CLIENT_ID,
      });
      // #endregion
      if (!process.env.AZURE_AD_CLIENT_ID) return true;
      if (!user?.email) return false;
      if (isAllowedEmailDomain(user.email)) return true;
      // #region agent log
      console.log("[AUTH_DEBUG] domain not allowed:", user.email);
      // #endregion
      return "/unauthorized?reason=email_domain_not_allowed";
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.email = (profile as Record<string, string>).email ?? token.email;
        token.name = (profile as Record<string, string>).name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
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
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-do-not-use-in-production",
};
