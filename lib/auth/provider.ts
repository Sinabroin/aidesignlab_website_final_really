import { cookies, headers } from "next/headers";

/**
 * 지원하는 인증 Provider 타입
 * - dev: 개발/테스트용 간단 로그인
 * - proxy_header: 사내 프록시/게이트웨이 헤더 기반
 * - oidc: OAuth 2.0 / OpenID Connect
 * - saml: SAML 2.0
 */
export type AuthProviderName = "dev" | "proxy_header" | "oidc" | "saml";

/**
 * 세션 사용자 정보
 */
export type SessionUser = {
  id: string; // 사번 또는 이메일 (고유 식별자)
  name?: string;
  email?: string;
};

/**
 * 인증 Provider 인터페이스
 * 
 * SSO 방식이 확정되면 이 인터페이스를 구현하는
 * 새로운 Provider를 추가하기만 하면 됨
 */
export interface AuthProvider {
  name: AuthProviderName;
  getUser(): Promise<SessionUser | null>;
  signInRedirectUrl(currentPath: string): string;
  signOutRedirectUrl(): string;
}

/**
 * 환경 변수에서 Provider 이름 가져오기
 */
function getProviderName(): AuthProviderName {
  const v = process.env.AUTH_PROVIDER?.toLowerCase();
  if (v === "proxy_header" || v === "oidc" || v === "saml") return v as AuthProviderName;
  return "dev";
}

/**
 * DEV Provider
 * 
 * 개발/테스트용 간단한 쿠키 기반 로그인
 * /api/auth/login?user=EMP001 형태로 로그인 흉내
 * 
 * 프로덕션에서는 절대 사용하지 말 것!
 */
const devProvider: AuthProvider = {
  name: "dev",
  
  async getUser() {
    const c = cookies().get("session_user")?.value;
    if (!c) return null;
    
    try {
      return JSON.parse(c) as SessionUser;
    } catch {
      return null;
    }
  },
  
  signInRedirectUrl(currentPath: string) {
    return `/api/auth/login?next=${encodeURIComponent(currentPath)}&user=EMP001`;
  },
  
  signOutRedirectUrl() {
    return `/api/auth/logout`;
  },
};

/**
 * PROXY HEADER Provider
 * 
 * 사내 프록시/게이트웨이가 인증된 사용자 정보를
 * HTTP 헤더로 전달하는 경우 사용
 * 
 * 예상 헤더:
 * - x-employee-id: 사번
 * - x-email: 회사 이메일
 * - x-name: 이름
 */
const proxyHeaderProvider: AuthProvider = {
  name: "proxy_header",
  
  async getUser() {
    const h = headers();
    const id = h.get("x-employee-id");
    
    if (!id) return null;
    
    return {
      id,
      email: h.get("x-email") ?? undefined,
      name: h.get("x-name") ?? undefined,
    };
  },
  
  signInRedirectUrl(currentPath: string) {
    // 프록시 인증 실패 시 안내 페이지로
    return `/unauthorized?reason=missing_proxy_auth&next=${encodeURIComponent(currentPath)}`;
  },
  
  signOutRedirectUrl() {
    // 프록시 로그아웃 URL (IT 부서에서 제공)
    return process.env.PROXY_LOGOUT_URL || "/";
  },
};

/**
 * OIDC Provider (OAuth 2.0 / OpenID Connect)
 * 
 * TODO: AUTOWAY가 OIDC를 지원하는 경우 구현
 * NextAuth.js 같은 라이브러리 사용 권장
 */
const oidcProvider: AuthProvider = {
  name: "oidc",
  
  async getUser() {
    // TODO: OIDC 토큰 검증 및 사용자 정보 추출
    console.warn("OIDC provider not implemented yet");
    return null;
  },
  
  signInRedirectUrl(currentPath: string) {
    // TODO: OIDC authorization endpoint로 리다이렉트
    return `/api/auth/oidc/login?next=${encodeURIComponent(currentPath)}`;
  },
  
  signOutRedirectUrl() {
    // TODO: OIDC logout endpoint
    return `/api/auth/oidc/logout`;
  },
};

/**
 * SAML Provider
 * 
 * TODO: AUTOWAY가 SAML 2.0을 사용하는 경우 구현
 */
const samlProvider: AuthProvider = {
  name: "saml",
  
  async getUser() {
    // TODO: SAML assertion 검증 및 사용자 정보 추출
    console.warn("SAML provider not implemented yet");
    return null;
  },
  
  signInRedirectUrl(currentPath: string) {
    // TODO: SAML SSO endpoint로 리다이렉트
    return `/api/auth/saml/login?next=${encodeURIComponent(currentPath)}`;
  },
  
  signOutRedirectUrl() {
    // TODO: SAML logout endpoint
    return `/api/auth/saml/logout`;
  },
};

/**
 * 현재 설정된 Auth Provider 가져오기
 * 
 * 환경 변수 AUTH_PROVIDER에 따라 자동 선택
 */
export function getAuthProvider(): AuthProvider {
  const name = getProviderName();
  
  switch (name) {
    case "proxy_header":
      return proxyHeaderProvider;
    case "oidc":
      return oidcProvider;
    case "saml":
      return samlProvider;
    default:
      return devProvider;
  }
}
