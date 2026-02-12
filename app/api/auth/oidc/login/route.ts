import { NextResponse } from "next/server";
import { getSecret } from "@/lib/config/secrets";

/**
 * OIDC / Entra ID 로그인 진입점
 *
 * AZURE_AD_CLIENT_ID, AZURE_AD_TENANT_ID 미설정 시 501 반환
 * 설정 시 Entra ID authorization URL로 리다이렉트 (연동 구현 후)
 */
export async function GET(req: Request) {
  const clientId = getSecret("AZURE_AD_CLIENT_ID");
  const tenantId = getSecret("AZURE_AD_TENANT_ID");

  if (!clientId || !tenantId) {
    return NextResponse.json(
      { error: "OIDC not configured", message: "AZURE_AD_CLIENT_ID, AZURE_AD_TENANT_ID required" },
      { status: 501 }
    );
  }

  const url = new URL(req.url);
  const nextPath = url.searchParams.get("next") || "/playground";
  const baseUrl = url.origin;
  const redirectUri = `${baseUrl}/api/auth/oidc/callback`;
  const state = Buffer.from(JSON.stringify({ next: nextPath })).toString("base64url");

  const authUrl = new URL(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`
  );
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "openid profile email");
  authUrl.searchParams.set("response_mode", "query");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
