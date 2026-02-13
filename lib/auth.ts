import type { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

/**
 * 허용된 이메일 도메인 확인
 * ALLOWED_EMAIL_DOMAINS 환경변수: 쉼표로 구분 (예: hdec.co.kr,hyundaienc.com)
 */
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

export const authOptions: NextAuthOptions = {
  trustHost: true,
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
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
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  // localhost(http)에서는 Secure 쿠키 사용 불가 - 미설정 시 쿠키 미전송으로 getToken null 발생
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith("https://") ?? false,
};
