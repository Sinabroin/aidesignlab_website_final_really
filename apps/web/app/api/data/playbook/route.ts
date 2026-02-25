import { NextResponse } from "next/server";
import {
  getAllPlaybook,
  getPlaybookByCategory,
  type PlaybookCategory,
} from "@/lib/data/repository";

const VALID_CATEGORIES: PlaybookCategory[] = [
  "usecase",
  "collaboration",
  "weekly_card",
];

/**
 * PlayBook 데이터 API (공개 조회)
 * GET /api/data/playbook?category=all|usecase|collaboration|weekly_card
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const categoryParam = url.searchParams.get("category") || "usecase";

  if (categoryParam === "all") {
    const data = await getAllPlaybook();
    return NextResponse.json(data);
  }

  const category = VALID_CATEGORIES.includes(categoryParam as PlaybookCategory)
    ? (categoryParam as PlaybookCategory)
    : "usecase";

  const data = await getPlaybookByCategory(category);
  return NextResponse.json(data);
}
