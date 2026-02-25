/** 게시글 저장 API — GalleryItem 테이블에 신규 항목 생성 */
import { NextResponse } from "next/server";
import { createGalleryItem } from "@/lib/data/repository";
import { getCurrentUser } from "@/lib/auth/session";
import {
  canWriteCommunity,
  canWritePlaybook,
  canWritePlayday,
} from "@/lib/auth/rbac";

const PLAYBOOK_CATEGORIES = new Set([
  "usecase",
  "trend",
  "prompt",
  "hai",
  "teams",
  "interview",
]);

function resolveSection(section: string, category: string): string {
  if (section === "playbook" && PLAYBOOK_CATEGORIES.has(category)) {
    return `playbook_${category}`;
  }
  return section;
}

function validatePayload(payload: {
  section?: string;
  category?: string;
  title?: string;
}) {
  return Boolean(payload.section && payload.category && payload.title);
}

function canWriteSection(
  section: string,
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
) {
  if (section === "playday") return canWritePlayday(user);
  if (section === "activity") return canWriteCommunity(user);
  if (section.startsWith("playbook_")) return canWritePlaybook(user);
  return false;
}

function getDeniedMessage(section: string) {
  if (section === "playday") return "PlayDay 작성 권한이 없습니다.";
  if (section === "activity") return "ACE 커뮤니티 작성 권한이 없습니다.";
  if (section.startsWith("playbook_")) return "Playbook 작성은 운영진만 가능합니다.";
  return "허용되지 않은 작성 섹션입니다.";
}

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ error: "DB not configured" }, { status: 400 });
    }

    const body = (await req.json()) as {
      section: string;
      category: string;
      title: string;
      description: string;
      tags?: string[];
      thumbnailBase64?: string;
      attachments?: { name: string; url: string; size: string; type: string }[];
    };
    if (!validatePayload(body)) {
      return NextResponse.json(
        { error: "section, category, title은 필수입니다." },
        { status: 422 }
      );
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const resolvedSection = resolveSection(body.section, body.category);
    if (!canWriteSection(resolvedSection, user)) {
      return NextResponse.json(
        { error: getDeniedMessage(resolvedSection) },
        { status: 403 }
      );
    }

    // #region agent log
    console.log('[DEBUG posts API] attachments received:', JSON.stringify({ count: body.attachments?.length ?? 0, names: body.attachments?.map((a) => a.name) }));
    // #endregion
    const item = await createGalleryItem({
      section: resolvedSection,
      title: body.title,
      description: body.description ?? "",
      author: user.name ?? user.email ?? user.id,
      category: body.category,
      tags: body.tags,
      thumbnail: body.thumbnailBase64,
      attachments: body.attachments,
    });
    // #region agent log
    console.log('[DEBUG posts API] item created with attachments:', JSON.stringify({ attachments: item.attachments }));
    // #endregion
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/data/posts]", message);
    return NextResponse.json({ error: `서버 오류: ${message}` }, { status: 500 });
  }
}
