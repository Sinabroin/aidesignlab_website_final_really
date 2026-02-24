import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * 인증 미들웨어 - NextAuth + Microsoft Entra ID
 *
 * 역할:
 * 1. 보호된 경로 접근 시 세션 확인
 * 2. 미인증 사용자는 /login 으로 리다이렉트 (302 루프 방지)
 */

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/community") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/help-requests")
  );
}

function shouldBypassMiddleware(): boolean {
  return process.env.AUTH_BYPASS_MIDDLEWARE === "true";
}

function isPublicPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/favicon") ||
    pathname === "/" ||
    pathname.startsWith("/login")
  );
}

function getSessionStrategy(): "database" | "jwt" {
  const strategy = process.env.NEXTAUTH_SESSION_STRATEGY?.toLowerCase();
  if (strategy === "database") return "database";
  return "jwt";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSessionCookie =
    Boolean(req.cookies.get("next-auth.session-token")?.value) ||
    Boolean(req.cookies.get("__Secure-next-auth.session-token")?.value) ||
    Boolean(req.cookies.get("authjs.session-token")?.value) ||
    Boolean(req.cookies.get("__Secure-authjs.session-token")?.value);
  const hasCsrfCookie =
    Boolean(req.cookies.get("next-auth.csrf-token")?.value) ||
    Boolean(req.cookies.get("__Host-next-auth.csrf-token")?.value);

  // AUTH_BYPASS_MIDDLEWARE=true 시 미들웨어 인증 검사 우회 (개발 시 선택적 사용)
  if (shouldBypassMiddleware()) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedPath(pathname)) {
    const sessionStrategy = getSessionStrategy();
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"mw-debug-1",hypothesisId:"M1-M4",location:"middleware.ts:protected-entry",message:"protected path middleware entry",data:{pathname,hasSessionCookie,hasCsrfCookie,hasNextAuthSecret:!!process.env.NEXTAUTH_SECRET,sessionStrategy},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (sessionStrategy === "database") {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"mw-debug-1",hypothesisId:"M1",location:"middleware.ts:database-strategy-check",message:"database strategy auth check",data:{pathname,hasSessionCookie},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (!hasSessionCookie) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        loginUrl.searchParams.set("mw", "missing_db_cookie");
        loginUrl.searchParams.set("mws", sessionStrategy);
        // #region agent log
        fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"mw-debug-1",hypothesisId:"M1-M3",location:"middleware.ts:redirect-login-db",message:"redirecting to login due to missing db session cookie",data:{pathname,redirectPath:loginUrl.pathname,hasSessionCookie},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    let token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName:
          process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token",
      });
    }
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"mw-debug-1",hypothesisId:"M1-M4",location:"middleware.ts:getToken-result",message:"middleware getToken result",data:{pathname,tokenExists:!!token,tokenSub:token?.sub??null},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!token) {
      // /login으로 리다이렉트 (실제 렌더링되는 페이지 - 302 루프 방지)
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("mw", "missing_jwt_token");
      loginUrl.searchParams.set("mws", sessionStrategy);
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"mw-debug-1",hypothesisId:"M1-M4",location:"middleware.ts:redirect-login",message:"redirecting to login due to missing token",data:{pathname,redirectPath:loginUrl.pathname,hasSessionCookie},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/community/:path*",
    "/admin/:path*",
    "/help-requests/:path*",
  ],
};
