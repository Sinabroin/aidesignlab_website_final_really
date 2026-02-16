import { getAllowlistsSync } from "@/lib/data/allowlists";

/**
 * 고정 운영자 이메일 (삭제 불가, 항상 operator 권한)
 */
export const FIXED_OPERATOR_EMAIL = "2501034@hdec.co.kr";

/**
 * 역할(Role) 정의
 * - employee: 현대건설 임직원 (로그인만 되면 부여)
 * - community: ACE 커뮤니티 접근 가능자 (ACE 30명 + 운영진)
 * - operator: 운영진 (/admin 접근 및 권한 부여 가능)
 */
export type Role = "employee" | "community" | "operator";

/**
 * 사용자 정보 타입
 */
export type User = {
  id: string; // 사번 또는 이메일 (SSO에서 받는 고유 식별자)
  name?: string;
  email?: string;
};

function normalizeId(id: string): string {
  return id.trim().toLowerCase();
}

/**
 * 사용자의 역할 목록 조회
 *
 * 로직:
 * 1. 로그인만 되어 있으면 "employee" 부여
 * 2. 고정 운영자(2501034@hdec.co.kr)이면 "community" + "operator"
 * 3. operator allowlist에 있으면 "community" + "operator"
 * 4. community allowlist에만 있으면 "community"
 */
export function getRolesForUser(user: User): Role[] {
  const roles: Role[] = ["employee"];

  const email = user.email ? normalizeId(user.email) : null;
  const id = normalizeId(user.id);

  const { operators, community } = getAllowlistsSync();
  const operatorSet = new Set(operators.map(normalizeId));
  const communitySet = new Set(community.map(normalizeId));

  const isFixedOperator =
    email === FIXED_OPERATOR_EMAIL || id === FIXED_OPERATOR_EMAIL;
  const isInOperatorList =
    (email && operatorSet.has(email)) || operatorSet.has(id);
  const isInCommunityList =
    (email && communitySet.has(email)) || communitySet.has(id);

  if (isFixedOperator || isInOperatorList) {
    roles.push("community");
    roles.push("operator");
  } else if (isInCommunityList) {
    roles.push("community");
  }

  return roles;
}

/**
 * 사용자가 특정 역할을 가지고 있는지 확인
 */
export function hasRole(user: User, role: Role): boolean {
  return getRolesForUser(user).includes(role);
}

/**
 * 여러 역할 중 하나라도 가지고 있는지 확인
 */
export function hasAnyRole(user: User, roles: Role[]): boolean {
  const userRoles = getRolesForUser(user);
  return roles.some((r) => userRoles.includes(r));
}

/**
 * 모든 역할을 가지고 있는지 확인
 */
export function hasAllRoles(user: User, roles: Role[]): boolean {
  const userRoles = getRolesForUser(user);
  return roles.every((r) => userRoles.includes(r));
}
