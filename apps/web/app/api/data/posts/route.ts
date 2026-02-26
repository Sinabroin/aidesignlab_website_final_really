/** 게시글 저장 API — GalleryItem 테이블에 신규 항목 생성 */
import { NextResponse } from "next/server";
import { createGalleryItem } from "@/lib/data/repository";
import { getCurrentUser } from "@/lib/auth/session";

export const maxDuration = 30;

export const dynamic = "force-dynamic";
import {
  canWriteCommunity,
  canWritePlaybook,
  canWritePlayday,
} from "@/lib/auth/rbac";

const PLAYBOOK_CATEGORIES = new Set([
  "usecase",
  "collaboration",
  "weekly_card",
]);

function resolveSection(section: string, category: string): string {
  const primary = category.split(",")[0];
  if (section === "playbook" && primary && PLAYBOOK_CATEGORIES.has(primary)) {
    return `playbook_${primary}`;
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
      /** Vercel Blob URL (구 thumbnailBase64 대체) */
      thumbnail?: string;
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

    const item = await createGalleryItem({
      section: resolvedSection,
      title: body.title,
      description: body.description ?? "",
      author: user.name ?? user.email ?? user.id,
      category: body.category,
      tags: body.tags,
      thumbnail: body.thumbnail,
      attachments: body.attachments,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/data/posts]", message);
    return NextResponse.json({ error: `서버 오류: ${message}` }, { status: 500 });
  }
}
