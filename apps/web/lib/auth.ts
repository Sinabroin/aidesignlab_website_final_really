/** NextAuth 매직 링크 인증 설정 */
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getPrismaClient } from "@/lib/db";

const EMAIL_FROM = "선윤성 (AI 디자인랩) <sinabroysun@gmail.com>";

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

function buildVerificationHtml(url: string): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827;">
    <h1 style="font-size:22px;margin:0 0 16px;">AI 디자인랩</h1>
    <p style="margin:0 0 10px;">안녕하세요. 현대건설 AI 디자인랩 인증을 요청하셨습니다.</p>
    <p style="margin:0 0 10px;">본 메일은 사내 보안 가이드에 따라 발송된 인증 메일입니다.</p>
    <p style="margin:0 0 10px;">아래 버튼을 눌러 본인 확인을 완료해 주세요. 링크는 24시간 내에 만료됩니다.</p>
    <p style="margin:0 0 22px;">요청하지 않았다면 본 메일을 무시하시고 보안 담당자에게 알려주세요.</p>
    <a href="${url}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;font-weight:600;">본인 인증 완료하기</a>
    <p style="margin:22px 0 8px;font-size:13px;color:#6b7280;">버튼이 동작하지 않으면 아래 주소를 복사해 브라우저에 붙여넣어 주세요.</p>
    <p style="word-break:break-all;font-size:13px;color:#334155;margin:0 0 22px;">${url}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 14px;" />
    <p style="font-size:12px;color:#6b7280;margin:0;">© AI 디자인랩. 본 메일은 발신 전용입니다.</p>
  </div>`;
}

function buildVerificationText(url: string): string {
  return [
    "AI 디자인랩 본인 인증 안내",
    "",
    "본 메일은 사내 보안 가이드에 따라 발송된 인증 메일입니다.",
    "아래 링크를 통해 본인 인증을 완료해 주세요. 링크는 24시간 내에 만료됩니다.",
    "요청하지 않은 경우 본 메일을 무시하고 보안 담당자에게 문의해 주세요.",
    "",
    `인증 링크: ${url}`,
    "",
    "© AI 디자인랩. 본 메일은 발신 전용입니다.",
  ].join("\n");
}

function buildVerificationSubject(identifier: string): string {
  const localPart = identifier.split("@")[0]?.trim();
  const displayName = localPart && localPart.length > 0 ? localPart : "고객";
  return `${displayName}님, 요청하신 인증 정보를 확인해 주세요`;
}

/** /api/auth/callback/email URL → /auth/verify 중간 확인 페이지 URL로 변환 */
function toVerifyPageUrl(callbackUrl: string): string {
  try {
    const src = new URL(callbackUrl);
    const token = src.searchParams.get("token");
    const email = src.searchParams.get("email");
    const cb = src.searchParams.get("callbackUrl") ?? "/";
    const verifyUrl = new URL("/auth/verify", src.origin);
    if (token) verifyUrl.searchParams.set("token", token);
    if (email) verifyUrl.searchParams.set("email", email);
    verifyUrl.searchParams.set("callbackUrl", cb);
    return verifyUrl.toString();
  } catch {
    return callbackUrl;
  }
}

async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  provider: { server: Record<string, unknown> };
}): Promise<void> {
  // 보안 스캐너 토큰 소진 방지: 중간 확인 페이지 URL로 변환
  const verifyUrl = toVerifyPageUrl(params.url);
  const { createTransport } = require("nodemailer") as {
    createTransport: (server: unknown) => {
      sendMail: (mail: {
        to: string;
        from: string;
        subject: string;
        text: string;
        html: string;
      }) => Promise<unknown>;
    };
  };
  const transport = createTransport(params.provider.server);
  try {
    await transport.sendMail({
      to: params.identifier,
      from: EMAIL_FROM,
      subject: buildVerificationSubject(params.identifier),
      text: buildVerificationText(verifyUrl),
      html: buildVerificationHtml(verifyUrl),
    });
  } catch (error) {
    throw error;
  }
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
    from: EMAIL_FROM,
    sendVerificationRequest,
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
  logger: {
    error(code, metadata) {
      console.error("[NextAuth]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth]", code);
    },
    debug() {},
  },
  callbacks: {
    async signIn({ user, email }) {
      const isVerificationRequest = email?.verificationRequest === true;
      const targetEmail = resolveSignInEmail(user?.email, email);
      if (!isVerificationRequest) return true;
      if (isAllowedEmailDomain(targetEmail)) return true;
      return "/login?error=InvalidDomain";
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      if (user?.name) token.name = user.name;
      return token;
    },
    async session({ session, token }) {
      if (!session.user) return session;
      session.user.name = token.name ?? session.user.name;
      session.user.email = token.email ?? session.user.email;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login?status=link-sent",
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
