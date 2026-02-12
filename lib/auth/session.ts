import { getAuthProvider } from "@/lib/auth/provider";

/**
 * 현재 로그인한 사용자 정보 가져오기
 * 
 * Server Component 또는 Server Action에서 사용
 * 
 * @returns 사용자 정보 또는 null (미로그인)
 */
export async function getCurrentUser() {
  const provider = getAuthProvider();
  return provider.getUser();
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
