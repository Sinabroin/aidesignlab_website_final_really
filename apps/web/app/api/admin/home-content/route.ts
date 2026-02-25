/** 운영자 홈 콘텐츠 관리 API + 감사 로그 */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import { logAuditEvent } from "@/lib/audit";
import {
  createHomeBanner,
  createHomePlaydayGuide,
  createNotice,
  deleteHomeBanner,
  deleteHomePlaydayGuide,
  deleteNoticeById,
  getAdminHomeBanners,
  getAdminHomePlaydayGuides,
  getAdminNotices,
} from "@/lib/data/repository";

type ContentType = "banner" | "notice" | "playday-guide";

function badRequest(message: string) {
  return NextResponse.json({ error: "BadRequest", message }, { status: 400 });
}

function ensureDatabase() {
  if (process.env.DATABASE_URL) return null;
  return NextResponse.json(
    { error: "DBNotConfigured", message: "DATABASE_URL이 설정되지 않았습니다." },
    { status: 400 }
  );
}

function requireOperator(user: Awaited<ReturnType<typeof getCurrentUser>>) {
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", message: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  if (!hasRole(user, "operator")) {
    return NextResponse.json(
      { error: "Forbidden", message: "운영자만 접근할 수 있습니다." },
      { status: 403 }
    );
  }
  return null;
}

export async function GET() {
  try {
    const dbError = ensureDatabase();
    if (dbError) return dbError;
    const authError = requireOperator(await getCurrentUser());
    if (authError) return authError;
    const [banners, notices, playdayGuides] = await Promise.all([
      getAdminHomeBanners(),
      getAdminNotices(),
      getAdminHomePlaydayGuides(),
    ]);
    return NextResponse.json({ banners, notices, playdayGuides });
  } catch (error) {
    console.error("[home-content:GET] error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "LoadFailed", message }, { status: 500 });
  }
}

async function handleCreateByType(
  contentType: ContentType,
  body: Record<string, unknown>
) {
  if (contentType === "banner") {
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const content = String(body.content ?? "").trim();
    const href = String(body.href ?? "").trim();
    const thumbnail = typeof body.thumbnail === "string" ? body.thumbnail.trim() : undefined;
    const attachments = Array.isArray(body.attachments) ? body.attachments : undefined;
    if (!title) return badRequest("배너 제목은 필수입니다.");
    const item = await createHomeBanner({ title, description, content, href, thumbnail, attachments });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  }
  if (contentType === "notice") {
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const content = String(body.content ?? "").trim();
    const badge = String(body.badge ?? "").trim() || "공지";
    if (!title) return badRequest("공지 제목은 필수입니다.");
    const item = await createNotice({ title, description, content, badge });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  }
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  if (!title || !description) return badRequest("안내 제목/설명은 필수입니다.");
  const item = await createHomePlaydayGuide({ title, description });
  return NextResponse.json({ ok: true, item }, { status: 201 });
}

export async function POST(req: Request) {
  try {
    const dbError = ensureDatabase();
    if (dbError) return dbError;
    const authError = requireOperator(await getCurrentUser());
    if (authError) return authError;

    const body = (await req.json()) as Record<string, unknown>;
    const contentType = body.contentType as ContentType;
    if (!contentType) return badRequest("contentType은 필수입니다.");
    if (!["banner", "notice", "playday-guide"].includes(contentType)) {
      return badRequest("지원하지 않는 contentType입니다.");
    }
    return await handleCreateByType(contentType, body);
  } catch (error) {
    console.error("[home-content:POST] error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "CreateFailed", message }, { status: 500 });
  }
}

async function handleDeleteByType(contentType: ContentType, id: string) {
  if (contentType === "banner") await deleteHomeBanner(id);
  else if (contentType === "notice") await deleteNoticeById(id);
  else await deleteHomePlaydayGuide(id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  try {
    const dbError = ensureDatabase();
    if (dbError) return dbError;
    const user = await getCurrentUser();
    const authError = requireOperator(user);
    if (authError) return authError;

    const body = (await req.json()) as { id?: string; contentType?: ContentType };
    const id = body.id?.trim();
    const contentType = body.contentType;
    if (!id || !contentType) return badRequest("id와 contentType은 필수입니다.");
    if (!["banner", "notice", "playday-guide"].includes(contentType)) {
      return badRequest("지원하지 않는 contentType입니다.");
    }

    const result = await handleDeleteByType(contentType, id);

    if (user) {
      logAuditEvent({
        email: user.email ?? user.id,
        userName: user.name,
        action: "content_delete",
        path: "/api/admin/home-content",
        metadata: { contentType, contentId: id },
      });
    }

    return result;
  } catch (error) {
    console.error("[home-content:DELETE] error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "DeleteFailed", message }, { status: 500 });
  }
}
