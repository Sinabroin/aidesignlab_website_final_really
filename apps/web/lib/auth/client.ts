/** Client-side authentication utilities */

import { Session } from "next-auth";

/**
 * 관리자 이메일 목록 (클라이언트에서 사용)
 * 사번@hdec.co.kr, 이름@hdec.co.kr 두 형식 모두 등록하여 로그인 방식과 무관하게 매칭
 * allowlists.json과 동기화 필요
 */
const ADMIN_EMAILS = new Set([
  "2501034@hdec.co.kr",
  "1306635@hdec.co.kr",
  "jihoon_kim@hdec.co.kr",
  "1100305@hdec.co.kr",
  "jungho.do@hdec.co.kr",
  "1700161@hdec.co.kr",
  "ww.do@hdec.co.kr",
  "2213183@hdec.co.kr",
  "kknoh@hdec.co.kr",
].map((email) => email.trim().toLowerCase()));

/**
 * 클라이언트 컴포넌트에서 사용자가 관리자인지 확인
 * 
 * @param session - NextAuth 세션 객체
 * @returns 관리자 여부
 */
export function isAdmin(session: Session | null): boolean {
  if (!session?.user?.email) {
    return false;
  }

  const email = session.user.email.trim().toLowerCase();
  return ADMIN_EMAILS.has(email);
}
