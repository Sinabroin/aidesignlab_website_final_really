/** 서버 전용 - fs 사용, API 라우트에서만 import */
import { readFile, writeFile } from "fs/promises";
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

export async function getAllowlists(): Promise<AllowlistsData> {
  return load();
}

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
