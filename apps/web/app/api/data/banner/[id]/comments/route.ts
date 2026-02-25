/** 배너 댓글 CRUD API */
import { NextResponse } from "next/server";
import { getBannerComments, createBannerComment } from "@/lib/data/repository";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await getBannerComments(id);
    return NextResponse.json(comments);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "FetchFailed", message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const content = (body.content as string)?.trim();
    if (!content) {
      return NextResponse.json({ error: "ContentRequired" }, { status: 400 });
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'banner/[id]/comments/route.ts:POST',message:'createComment attempt',data:{bannerId:id,author:user.name??user.email,contentLen:content.length},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    const comment = await createBannerComment({
      bannerId: id,
      author: user.name ?? user.email ?? "익명",
      content,
    });
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'banner/[id]/comments/route.ts:POST',message:'createComment success',data:{commentId:comment.id},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "CreateFailed", message }, { status: 500 });
  }
}
