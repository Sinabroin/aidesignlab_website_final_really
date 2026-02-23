/** Marquee 쇼케이스용 통합 데이터 API (공개 조회) */
import { NextResponse } from "next/server";
import { getMarqueeData } from "@/lib/data/repository";

export async function GET() {
  const data = await getMarqueeData();
  return NextResponse.json(data);
}
