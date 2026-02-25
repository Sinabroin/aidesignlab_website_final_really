/** Marquee 쇼케이스용 통합 데이터 API (공개 조회) */
import { NextResponse } from "next/server";
import { getMarqueeData } from "@/lib/data/repository";

export async function GET() {
  try {
    const data = await getMarqueeData();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "MarqueeFetchFailed", message },
      { status: 500 }
    );
  }
}
