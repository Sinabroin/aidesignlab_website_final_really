/** 게시글 삭제 API — 작성자 본인 또는 운영자만 삭제 가능 */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import { getGalleryItemById, deleteGalleryItemById } from "@/lib/data/repository";

function isAuthorOf(
  item: { author: string },
  user: { id: string; name?: string; email?: string }
): boolean {
  return (
    item.author === user.name ||
    item.author === user.email ||
    item.author === user.id
  );
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'build-type-fix',hypothesisId:'H2',location:'app/api/data/posts/[id]/route.ts:DELETE',message:'delete route invoked',data:{hasId:!!id},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DB not configured" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const item = await getGalleryItemById(id);
    if (!item) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다." }, { status: 404 });
    }

    const canDelete = isAuthorOf(item, user) || hasRole(user, "operator");
    if (!canDelete) {
      return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
    }

    await deleteGalleryItemById(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[DELETE /api/data/posts/[id]]", message);
    return NextResponse.json({ error: `서버 오류: ${message}` }, { status: 500 });
  }
}
