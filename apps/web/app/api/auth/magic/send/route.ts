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

async function sendEmail(to: string, url: string): Promise<void> {
  const { createTransport } = await import("nodemailer") as typeof import("nodemailer");
  const port = Number(process.env.EMAIL_SERVER_PORT ?? 587);
  const isSecurePort = port === 465;
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'magic/send:smtp-config',message:'SMTP config',data:{host:process.env.EMAIL_SERVER_HOST,port,secure:isSecurePort,user:process.env.EMAIL_SERVER_USER},timestamp:Date.now(),hypothesisId:'I',runId:'post-fix2'})}).catch(()=>{});
  // #endregion
  const transport = createTransport({
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'magic/send:entry',message:'POST /api/auth/magic/send called',data:{},timestamp:Date.now(),hypothesisId:'verify',runId:'post-fix'})}).catch(()=>{});
  // #endregion
  try {
    const body = await req.json() as { email?: string; callbackUrl?: string };
    const email = body.email?.trim().toLowerCase();
    const callbackUrl = body.callbackUrl ?? "/";

    if (!email || !isAllowedEmail(email)) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'magic/send:validate',message:'Email domain rejected',data:{email},timestamp:Date.now(),hypothesisId:'verify',runId:'post-fix'})}).catch(()=>{});
      // #endregion
      return NextResponse.json({ error: "허용되지 않은 이메일 도메인입니다." }, { status: 400 });
    }

    const token = createMagicToken(email);
    const baseUrl = getBaseUrl(req);
    const verifyUrl = `${baseUrl}/auth/verify?token=${token}&callbackUrl=${encodeURIComponent(callbackUrl)}`;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'magic/send:sending',message:'Sending email',data:{email,verifyUrl},timestamp:Date.now(),hypothesisId:'verify',runId:'post-fix'})}).catch(()=>{});
    // #endregion

    await sendEmail(email, verifyUrl);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'magic/send:success',message:'Email sent OK',data:{email},timestamp:Date.now(),hypothesisId:'I',runId:'post-fix2'})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ ok: true });
  } catch (error) {
    const errObj = error as Record<string, unknown>;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'magic/send:error',message:'Send failed',data:{error:error instanceof Error ? error.message : String(error),code:errObj?.code,command:errObj?.command,responseCode:errObj?.responseCode,response:errObj?.response},timestamp:Date.now(),hypothesisId:'I',runId:'post-fix2'})}).catch(()=>{});
    // #endregion
    console.error("[Magic Send]", error);
    return NextResponse.json({ error: "이메일 전송 중 오류가 발생했습니다." }, { status: 500 });
  }
}
