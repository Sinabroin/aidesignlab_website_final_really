import { NextResponse } from "next/server";
import { getSecret } from "@/lib/config/secrets";

/**
 * OIDC / Entra ID 로그아웃
 *
 * AZURE_AD_TENANT_ID 미설정 시 501 반환
 * 설정 시 Entra ID logout URL로 리다이렉트 (세션 쿠키 삭제 후)
 */
export async function GET(req: Request) {
  const tenantId = getSecret("AZURE_AD_TENANT_ID");

  if (!tenantId) {
    return NextResponse.json(
      { error: "OIDC not configured", message: "AZURE_AD_TENANT_ID required" },
      { status: 501 }
    );
  }

  const url = new URL(req.url);
  const baseUrl = url.origin;
  const postLogoutRedirect = `${baseUrl}/`;

  const logoutUrl = new URL(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout`
  );
  logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirect);

  const res = NextResponse.redirect(logoutUrl.toString());
  res.cookies.delete("session_user");

  return res;
}
