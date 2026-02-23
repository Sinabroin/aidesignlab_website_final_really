import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPrismaClient } from "@/lib/db";

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

function getAdapter() {
  if (!process.env.DATABASE_URL) return undefined;
  return PrismaAdapter(getPrismaClient());
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
        allowDangerousEmailAccountLinking: true,
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
  adapter: getAdapter(),
  providers: buildProviders(),
  callbacks: {
    async signIn({ user }) {
      if (!process.env.AZURE_AD_CLIENT_ID) return true;
      if (!user?.email) return false;
      if (isAllowedEmailDomain(user.email)) return true;
      return "/unauthorized?reason=email_domain_not_allowed";
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-do-not-use-in-production",
  debug: process.env.NODE_ENV === "development",
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
};
