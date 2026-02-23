/** Schedules API (공개 조회) */
import { NextResponse } from "next/server";
import { getSchedules } from "@/lib/data/repository";

export async function GET() {
  const data = await getSchedules();
  return NextResponse.json(data);
}
