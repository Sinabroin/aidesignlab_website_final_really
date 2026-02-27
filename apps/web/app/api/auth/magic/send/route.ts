/** 매직링크 이메일 발송 API — DB 없이 서명된 토큰을 이메일로 전송 */
import { NextRequest, NextResponse } from "next/server";
import { createMagicToken } from "@/lib/auth/magic-token";

function getAllowedDomains(): string[] {
  return (process.env.ALLOWED_EMAIL_DOMAINS ?? "hdec.co.kr")
    .split(",")
    .map((d) => d.trim().toLowerCase());
}

function isAllowedEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? getAllowedDomains().includes(domain) : false;
}

function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get("host") ?? "localhost:3001";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

function buildHtml(url: string): string {
  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827;">
    <h1 style="font-size:22px;margin:0 0 16px;">AI 디자인랩</h1>
    <p style="margin:0 0 10px;">아래 버튼을 눌러 본인 확인을 완료해 주세요. 링크는 24시간 내에 만료됩니다.</p>
    <a href="${url}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 18px;text-decoration:none;border-radius:6px;font-weight:600;">본인 인증 완료하기</a>
    <p style="margin:22px 0 8px;font-size:13px;color:#6b7280;">버튼이 동작하지 않으면 아래 주소를 복사해 브라우저에 붙여넣어 주세요.</p>
    <p style="word-break:break-all;font-size:13px;color:#334155;margin:0 0 22px;">${url}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 14px;" />
    <p style="font-size:12px;color:#6b7280;">© AI 디자인랩. 본 메일은 발신 전용입니다.</p>
  </div>`;
}

type MailTransporter = {
  sendMail: (mail: { to: string; from: string; subject: string; text: string; html: string }) => Promise<unknown>;
};

function createMailTransporter(): MailTransporter {
  const port = Number(process.env.EMAIL_SERVER_PORT ?? 587);
  const isSecurePort = port === 465;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createTransport } = require("nodemailer") as {
    createTransport: (config: Record<string, unknown>) => MailTransporter;
  };
  return createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port,
    auth: { user: process.env.EMAIL_SERVER_USER, pass: process.env.EMAIL_SERVER_PASSWORD },
    secure: isSecurePort,
    requireTLS: !isSecurePort,
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: false },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

async function sendEmail(to: string, url: string): Promise<void> {
  const transport = createMailTransporter();
  const localPart = to.split("@")[0] ?? "고객";
  await transport.sendMail({
    to,
    from: `선윤성 (AI 디자인랩) <${process.env.EMAIL_SERVER_USER}>`,
    subject: `${localPart}님, 요청하신 인증 정보를 확인해 주세요`,
    text: `AI 디자인랩 인증 링크: ${url}\n\n링크는 24시간 내에 만료됩니다.`,
    html: buildHtml(url),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; callbackUrl?: string };
    const email = body.email?.trim().toLowerCase();
    const callbackUrl = body.callbackUrl ?? "/";

    if (!email || !isAllowedEmail(email)) {
      return NextResponse.json({ error: "허용되지 않은 이메일 도메인입니다." }, { status: 400 });
    }

    const token = createMagicToken(email);
    const baseUrl = getBaseUrl(req);
    const verifyUrl = `${baseUrl}/auth/verify?token=${token}&callbackUrl=${encodeURIComponent(callbackUrl)}`;

    // 개발 환경: SMTP 대신 인증 URL을 응답에 포함해 즉시 이동 (사내망 SMTP 차단 우회)
    if (process.env.NODE_ENV === "development") {
      console.log("\n🔗 [Dev Mode] 매직링크 인증 URL:\n", verifyUrl, "\n");
      return NextResponse.json({ ok: true, devUrl: verifyUrl });
    }

    await sendEmail(email, verifyUrl);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Magic Send]", error);
    return NextResponse.json({ error: "이메일 전송 중 오류가 발생했습니다." }, { status: 500 });
  }
}
