import { NextResponse } from "next/server";
import { getNotices } from "@/lib/data/repository";

/**
 * 공지사항 API
 * GET /api/data/notices
 */
export async function GET() {
  const data = await getNotices();
  return NextResponse.json(data);
}
