import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { User } from "@/lib/auth/rbac";

/**
 * 현재 로그인한 사용자 정보 가져오기
 * 
 * NextAuth (Azure AD) 세션 기반.
 * Server Component 또는 Server Action에서 사용.
 * 
 * @returns 사용자 정보 또는 null (미로그인)
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const u = session.user;
  return {
    id: u.email ?? u.name ?? "unknown",
    name: u.name ?? undefined,
    email: u.email ?? undefined,
  };
}

/**
 * 로그인 필수 체크 (사용자 없으면 throw)
 * 
 * @throws Error 로그인되지 않은 경우
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized: Login required");
  }
  
  return user;
}

/**
 * 로그인 여부 확인
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
