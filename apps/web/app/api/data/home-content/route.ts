/** 공개 홈 콘텐츠 API (배너/공지/PlayDay 안내) */
import { NextResponse } from "next/server";
import {
  getHomeBanners,
  getHomePlaydayGuides,
  getNotices,
} from "@/lib/data/repository";

export async function GET() {
  try {
    const [banners, notices, playdayGuides] = await Promise.all([
      getHomeBanners(),
      getNotices(),
      getHomePlaydayGuides(),
    ]);
    return NextResponse.json({ banners, notices, playdayGuides });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "HomeContentFetchFailed", message },
      { status: 500 }
    );
  }
}
