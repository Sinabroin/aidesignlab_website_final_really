/** QuickLinks API (공개 조회) */
import { NextResponse } from "next/server";
import { getQuickLinks } from "@/lib/data/repository";

export async function GET() {
  const data = await getQuickLinks();
  return NextResponse.json(data);
}
