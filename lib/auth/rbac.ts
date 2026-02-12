import { COMMUNITY_ALLOWLIST } from "@/lib/data/community-allowlist";

/**
 * 역할(Role) 정의
 * - employee: 현대건설 임직원 (로그인만 되면 부여)
 * - community: ACE 커뮤니티 접근 가능자 (35명)
 */
export type Role = "employee" | "community";

/**
 * 사용자 정보 타입
 */
export type User = {
  id: string; // 사번 또는 이메일 (SSO에서 받는 고유 식별자)
  name?: string;
  email?: string;
};

/**
 * 사용자의 역할 목록 조회
 * 
 * @param user - 사용자 정보
 * @returns 역할 배열
 * 
 * 로직:
 * 1. 로그인만 되어 있으면 "employee" 부여
 * 2. allowlist에 있으면 "community" 추가
 */
export function getRolesForUser(user: User): Role[] {
  const roles: Role[] = ["employee"];

  // allowlist 체크 (사번 또는 이메일)
  if (
    COMMUNITY_ALLOWLIST.has(user.id) ||
    (user.email && COMMUNITY_ALLOWLIST.has(user.email))
  ) {
    roles.push("community");
  }

  return roles;
}

/**
 * 사용자가 특정 역할을 가지고 있는지 확인
 * 
 * @param user - 사용자 정보
 * @param role - 확인할 역할
 * @returns 역할 보유 여부
 */
export function hasRole(user: User, role: Role): boolean {
  return getRolesForUser(user).includes(role);
}

/**
 * 여러 역할 중 하나라도 가지고 있는지 확인
 * 
 * @param user - 사용자 정보
 * @param roles - 확인할 역할 배열
 * @returns 역할 보유 여부
 */
export function hasAnyRole(user: User, roles: Role[]): boolean {
  const userRoles = getRolesForUser(user);
  return roles.some((role) => userRoles.includes(role));
}

/**
 * 모든 역할을 가지고 있는지 확인
 * 
 * @param user - 사용자 정보
 * @param roles - 확인할 역할 배열
 * @returns 모든 역할 보유 여부
 */
export function hasAllRoles(user: User, roles: Role[]): boolean {
  const userRoles = getRolesForUser(user);
  return roles.every((role) => userRoles.includes(role));
}
