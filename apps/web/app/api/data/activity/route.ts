/** Activity API (공개 조회) */
import { NextResponse } from "next/server";
import { getActivityData } from "@/lib/data/repository";

export async function GET() {
  const data = await getActivityData();
  return NextResponse.json(data);
}
