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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // AUTH_BYPASS_MIDDLEWARE=true 시 미들웨어 인증 검사 우회 (개발 시 선택적 사용)
  if (shouldBypassMiddleware()) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedPath(pathname)) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // /login으로 리다이렉트 (실제 렌더링되는 페이지 - 302 루프 방지)
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
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
