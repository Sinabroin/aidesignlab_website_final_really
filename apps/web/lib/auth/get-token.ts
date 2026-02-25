/** NextAuth JWT 토큰 조회 헬퍼 — 커스텀 쿠키 이름 사용 */
import { getToken as _getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

/** authOptions.cookies.sessionToken.name 과 동일하게 유지해야 함 */
const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === 'production'
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token';

export async function getAuthToken(req: NextRequest) {
  return _getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: SESSION_COOKIE_NAME,
  });
}
