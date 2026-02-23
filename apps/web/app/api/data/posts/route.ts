/** 게시글 저장 API — GalleryItem 테이블에 신규 항목 생성 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createGalleryItem } from "@/lib/data/repository";

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

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DB not configured" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { section, category, title, description, tags, thumbnailBase64 } = body as {
      section: string;
      category: string;
      title: string;
      description: string;
      tags?: string[];
      thumbnailBase64?: string;
    };

    if (!section || !category || !title) {
      return NextResponse.json(
        { error: "section, category, title은 필수입니다." },
        { status: 422 }
      );
    }

    const session = await getServerSession(authOptions);
    const author = session?.user?.name ?? session?.user?.email ?? "익명";

    const item = await createGalleryItem({
      section: resolveSection(section, category),
      title,
      description: description ?? "",
      author,
      category,
      tags,
      thumbnail: thumbnailBase64,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/data/posts]", message);
    return NextResponse.json(
      { error: `서버 오류: ${message}` },
      { status: 500 }
    );
  }
}
