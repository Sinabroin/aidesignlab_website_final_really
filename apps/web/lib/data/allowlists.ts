/** 클라이언트 안전 - fs 미사용, RBAC 등에서 사용 */
import allowlistsData from "@/data/allowlists.json";

export type AllowlistRole = "operator" | "community";

export interface AllowlistsData {
  operators: string[];
  community: string[];
}

/**
 * 동기 조회 (RBAC 등 클라이언트/서버 공통)
 * 빌드 시점 JSON 사용 - fs 없음
 */
export function getAllowlistsSync(): AllowlistsData {
  const data = allowlistsData as AllowlistsData;
  return {
    operators: Array.isArray(data.operators) ? data.operators : [],
    community: Array.isArray(data.community) ? data.community : [],
  };
}
