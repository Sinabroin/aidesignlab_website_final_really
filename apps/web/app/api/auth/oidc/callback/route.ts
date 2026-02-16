import { NextResponse } from "next/server";
import { getSecret } from "@/lib/config/secrets";

/**
 * OIDC / Entra ID 로그인 콜백
 *
 * Authorization Code → 토큰 교환 → 세션 쿠키 설정
 * AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID 미설정 시 501 반환
 *
 * TODO: Azure 승인 후 next-auth 또는 @azure/msal-node로 토큰 교환 및 사용자 정보 추출
 */
export async function GET(req: Request) {
  const clientId = getSecret("AZURE_AD_CLIENT_ID");
  const clientSecret = getSecret("AZURE_AD_CLIENT_SECRET");
  const tenantId = getSecret("AZURE_AD_TENANT_ID");

  if (!clientId || !clientSecret || !tenantId) {
    return NextResponse.json(
      {
        error: "OIDC not configured",
        message: "AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID required",
      },
      { status: 501 }
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  let nextPath = "/playground";
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
      if (decoded.next) nextPath = decoded.next;
    } catch {
      // ignore
    }
  }

  if (!code) {
    const redirect = new URL("/unauthorized", url.origin);
    redirect.searchParams.set("reason", "oidc_callback_no_code");
    redirect.searchParams.set("next", nextPath);
    return NextResponse.redirect(redirect.toString());
  }

  // TODO: 토큰 엔드포인트로 code 교환 → id_token에서 사용자 정보 추출
  // const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  // ... fetch token, decode JWT, set session_user cookie

  const redirect = new URL(nextPath, url.origin);
  const res = NextResponse.redirect(redirect.toString());

  // 스텁: 실제 연동 시 세션 쿠키 설정
  res.cookies.set("session_user", JSON.stringify({ id: "oidc-pending", email: "", name: "" }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return res;
}
