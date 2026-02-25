/** 배너 단일 조회 API */
import { NextResponse } from "next/server";
import { getHomeBannerById } from "@/lib/data/repository";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const banner = await getHomeBannerById(id);
    if (!banner) {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    return NextResponse.json(banner);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "FetchFailed", message }, { status: 500 });
  }
}
