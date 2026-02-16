import { readFile, writeFile } from "fs/promises";
import { readFileSync } from "fs";
import path from "path";

export type AllowlistRole = "operator" | "community";

export interface AllowlistsData {
  operators: string[];
  community: string[];
}

const ALLOWLISTS_PATH = path.join(process.cwd(), "data", "allowlists.json");

async function load(): Promise<AllowlistsData> {
  try {
    const raw = await readFile(ALLOWLISTS_PATH, "utf-8");
    const data = JSON.parse(raw) as AllowlistsData;
    return {
      operators: Array.isArray(data.operators) ? data.operators : [],
      community: Array.isArray(data.community) ? data.community : [],
    };
  } catch {
    return { operators: [], community: [] };
  }
}

async function save(data: AllowlistsData): Promise<void> {
  await writeFile(ALLOWLISTS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * 운영진·ACE 목록 전체 조회 (파일에서 읽기)
 */
export async function getAllowlists(): Promise<AllowlistsData> {
  return load();
}

/**
 * 운영진 이메일 목록 (캐시 없이 매번 파일 읽기)
 */
export async function getOperators(): Promise<string[]> {
  const data = await load();
  return data.operators;
}

/**
 * ACE(커뮤니티) 이메일 목록
 */
export async function getCommunityList(): Promise<string[]> {
  const data = await load();
  return data.community;
}

/**
 * 해당 identifier가 운영진 또는 community 목록에 있는지 동기적으로 확인해야 할 때
 * RBAC에서는 동기 함수가 필요하므로, allowlists를 동기로 읽는 방법이 필요함.
 * Node에서 동기 readFileSync 사용 모듈을 별도로 두거나, RBAC에서 비동기 getRolesForUser를 쓰게 할 수 있음.
 * Next.js 서버 컴포넌트/API는 async 가능하므로, getRolesForUser를 async로 바꾸면 allowlists.ts만 사용해도 됨.
 * 계획에서는 "getRolesForUser가 operators/community 목록과 JSON 파일을 사용"이라고 했고, RBAC은 보통 동기 호출로 쓰이므로
 * allowlists를 동기 로드하는 함수를 추가하거나, 매 요청 시 allowlists를 읽어서 Set으로 캐시하는 방식을 쓸 수 있음.
 * 가장 단순한 방법: allowlists.ts에 readFileSync로 동기 로드하는 함수를 두고, RBAC의 getRolesForUser에서 그걸 호출.
 */
function loadSync(): AllowlistsData {
  try {
    const raw = readFileSync(ALLOWLISTS_PATH, "utf-8");
    const data = JSON.parse(raw) as AllowlistsData;
    return {
      operators: Array.isArray(data.operators) ? data.operators : [],
      community: Array.isArray(data.community) ? data.community : [],
    };
  } catch {
    return { operators: [], community: [] };
  }
}

/**
 * 동기 조회 (RBAC 등에서 사용)
 */
export function getAllowlistsSync(): AllowlistsData {
  return loadSync();
}

/**
 * 목록에 추가 (operator | community)
 */
export async function addToAllowlist(
  identifier: string,
  role: AllowlistRole
): Promise<void> {
  const normalized = identifier.trim().toLowerCase();
  if (!normalized) return;
  const data = await load();
  const list = role === "operator" ? data.operators : data.community;
  if (list.includes(normalized)) return;
  list.push(normalized);
  await save(data);
}

/**
 * 목록에서 제거. 고정 운영자(2501034@hdec.co.kr)는 operator에서 제거 불가.
 */
export async function removeFromAllowlist(
  identifier: string,
  role: AllowlistRole
): Promise<{ ok: boolean; error?: string }> {
  const normalized = identifier.trim().toLowerCase();
  const FIXED_OPERATOR = "2501034@hdec.co.kr";
  if (role === "operator" && normalized === FIXED_OPERATOR) {
    return { ok: false, error: "고정 운영자는 제거할 수 없습니다." };
  }
  const data = await load();
  const list = role === "operator" ? data.operators : data.community;
  const idx = list.indexOf(normalized);
  if (idx === -1) return { ok: true };
  list.splice(idx, 1);
  await save(data);
  return { ok: true };
}
