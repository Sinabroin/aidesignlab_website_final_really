/**
 * ACE 커뮤니티 접근 가능자 목록 (ACE 30명 + AI디자인랩 5명 = 총 35명)
 * 
 * 사번(employee_id) 또는 회사 이메일로 관리
 * 나중에 DB 테이블로 이관 가능
 * 
 * 사용 예시:
 * - "EMP001" (사번)
 * - "hong.gildong@hdec.co.kr" (회사 이메일)
 */
export const COMMUNITY_ALLOWLIST = new Set<string>([
  // === AI 디자인랩 운영진 (5명) ===
  "lab001@hdec.co.kr",
  "lab002@hdec.co.kr",
  "lab003@hdec.co.kr",
  "lab004@hdec.co.kr",
  "lab005@hdec.co.kr",

  // === ACE 멤버 (30명) ===
  // 예시: 실제 사번이나 이메일로 교체 필요
  "ace001@hdec.co.kr",
  "ace002@hdec.co.kr",
  "ace003@hdec.co.kr",
  // ... 나머지 27명 추가
  
  // 개발/테스트용
  "EMP001",
  "test@company.com",
]);

/**
 * allowlist에 사용자 추가 (런타임)
 */
export function addToAllowlist(identifier: string) {
  COMMUNITY_ALLOWLIST.add(identifier);
}

/**
 * allowlist에서 사용자 제거 (런타임)
 */
export function removeFromAllowlist(identifier: string) {
  COMMUNITY_ALLOWLIST.delete(identifier);
}

/**
 * allowlist 전체 목록 조회 (관리자용)
 */
export function getAllowlistMembers(): string[] {
  return Array.from(COMMUNITY_ALLOWLIST);
}
