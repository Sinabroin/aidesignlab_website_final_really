import { NextResponse } from "next/server";
import { getPlaydayData } from "@/lib/data/repository";

/**
 * PlayDay 갤러리 데이터 API
 * GET /api/data/playday
 */
export async function GET() {
  const data = await getPlaydayData();
  return NextResponse.json(data);
}
