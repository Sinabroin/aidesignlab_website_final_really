/** 배너 단일 조회 API */
import { NextResponse } from "next/server";
import { getHomeBannerById } from "@/lib/data/repository";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'banner/[id]/route.ts:GET',message:'getBannerById called',data:{id},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    const banner = await getHomeBannerById(id);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'banner/[id]/route.ts:GET',message:'getBannerById result',data:{found:!!banner,title:banner?.title},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    if (!banner) {
      return NextResponse.json({ error: "NotFound" }, { status: 404 });
    }
    return NextResponse.json(banner);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "FetchFailed", message }, { status: 500 });
  }
}
