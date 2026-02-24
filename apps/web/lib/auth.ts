/** NextAuth 매직 링크 인증 설정 */
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getPrismaClient } from "@/lib/db";

function getAllowedDomains(): string[] {
  return (process.env.ALLOWED_EMAIL_DOMAINS ?? "hdec.co.kr")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
}

function isAllowedEmailDomain(email: string | null | undefined): boolean {
  if (!email) return false;
  const userDomain = email.split("@")[1]?.toLowerCase();
  if (!userDomain) return false;
  return getAllowedDomains().includes(userDomain);
}

function getEmailProvider() {
  // 포트 번호를 숫자로 변환 (기본값 465)
  const port = Number(process.env.EMAIL_SERVER_PORT ?? 465);
  
  return EmailProvider({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: port,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      // Cursor 조언: 465 포트일 때만 SSL(secure)을 true로 설정
      secure: port === 465,
    },
    from: process.env.EMAIL_FROM,
  });
}

function resolveSignInEmail(
  userEmail: string | null | undefined,
  emailPayload: unknown
): string | null {
  if (userEmail) return userEmail;
  if (!emailPayload || typeof emailPayload !== "object") return null;
  const payload = emailPayload as Record<string, unknown>;
  return typeof payload.email === "string" ? payload.email : null;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(getPrismaClient()),
  providers: [getEmailProvider()],
  callbacks: {
    async signIn({ user, email }) {
      const isVerificationRequest = email?.verificationRequest === true;
      const targetEmail = resolveSignInEmail(user?.email, email);
      if (!isVerificationRequest) return true;
      if (isAllowedEmailDomain(targetEmail)) return true;
      return "/login?error=InvalidDomain";
    },
    async session({ session, user }) {
      if (!session.user) return session;
      session.user.name = user.name ?? session.user.name;
      session.user.email = user.email ?? session.user.email;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login?status=link-sent",
    error: "/login",
  },
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 8,
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-do-not-use-in-production",
};
