import { NextResponse, type NextRequest } from "next/server";

/**
 * 인증 미들웨어
 * 
 * 역할:
 * 1. 임직원 로그인 필요 영역 보호 (playground, community 등)
 * 2. 로그인 안 된 경우 로그인 페이지로 리다이렉트
 * 
 * 권한 체크는 페이지 레벨에서 수행 (community page에서 role 체크)
 */

// 환경 변수에서 인증 방식 가져오기
const AUTH_PROVIDER = (process.env.AUTH_PROVIDER || "dev").toLowerCase();

/**
 * 임직원 로그인이 필요한 경로인지 확인
 */
function isEmployeeArea(pathname: string): boolean {
  return (
    pathname.startsWith("/playground") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/admin")
  );
}

/**
 * 제외할 경로 (인증 불필요)
 */
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 공개 경로는 바로 통과
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 임직원 로그인 필요 영역
  if (isEmployeeArea(pathname)) {
    // Dev Provider: 쿠키 기반 세션 체크
    if (AUTH_PROVIDER === "dev") {
      const session = req.cookies.get("session_user")?.value;
      
      if (!session) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/api/auth/login";
        loginUrl.searchParams.set("next", pathname);
        loginUrl.searchParams.set("user", "EMP001"); // 테스트용
        return NextResponse.redirect(loginUrl);
      }
    }
    
    // Proxy Header Provider: 헤더 기반 인증 체크
    else if (AUTH_PROVIDER === "proxy_header") {
      const empId = req.headers.get("x-employee-id");
      
      if (!empId) {
        const unauthorized = req.nextUrl.clone();
        unauthorized.pathname = "/unauthorized";
        unauthorized.searchParams.set("reason", "missing_proxy_auth");
        unauthorized.searchParams.set("next", pathname);
        return NextResponse.redirect(unauthorized);
      }
    }
    
    // OIDC Provider: Entra ID 로그인 URL로 리다이렉트
    else if (AUTH_PROVIDER === "oidc") {
      const session = req.cookies.get("session_user")?.value;
      
      if (!session) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/api/auth/oidc/login";
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

// 미들웨어 적용 경로
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
