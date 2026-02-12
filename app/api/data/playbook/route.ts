import { NextResponse } from "next/server";
import {
  getPlaybookByCategory,
  type PlaybookCategory,
} from "@/lib/data/repository";

const VALID_CATEGORIES: PlaybookCategory[] = [
  "usecase",
  "trend",
  "prompt",
  "hai",
  "teams",
];

/**
 * PlayBook 데이터 API
 * GET /api/data/playbook?category=usecase|trend|prompt|hai|teams
 * category 없으면 usecase 기본
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryParam = url.searchParams.get("category") || "usecase";
  const category = VALID_CATEGORIES.includes(categoryParam as PlaybookCategory)
    ? (categoryParam as PlaybookCategory)
    : "usecase";

  const data = await getPlaybookByCategory(category);
  return NextResponse.json(data);
}
