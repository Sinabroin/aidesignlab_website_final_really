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
  "interview",
];

/**
 * PlayBook 데이터 API (공개 조회)
 * GET /api/data/playbook?category=usecase|trend|prompt|hai|teams|interview
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
