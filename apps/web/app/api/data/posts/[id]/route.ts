/** 게시글 수정/삭제 API — 작성자 본인 또는 운영자만 가능 */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import {
  getGalleryItemById,
  deleteGalleryItemById,
  updateGalleryItem,
} from "@/lib/data/repository";

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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const canEdit = isAuthorOf(item, user) || hasRole(user, "operator");
    if (!canEdit) {
      return NextResponse.json({ error: "수정 권한이 없습니다." }, { status: 403 });
    }

    const body = (await req.json()) as {
      title?: string;
      description?: string;
      category?: string;
      tags?: string[];
      thumbnailBase64?: string;
      attachments?: { name: string; url: string; size: string; type: string }[];
    };

    const updated = await updateGalleryItem(id, {
      title: body.title,
      description: body.description,
      category: body.category,
      tags: body.tags,
      thumbnail: body.thumbnailBase64,
      attachments: body.attachments,
    });

    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[PUT /api/data/posts/[id]]", message);
    return NextResponse.json({ error: `서버 오류: ${message}` }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
