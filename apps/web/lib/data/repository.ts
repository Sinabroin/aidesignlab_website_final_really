/**
 * 데이터 저장소 추상화
 *
 * 브라우저 ↔ API(서버) ↔ DB 패턴의 서버 측 데이터 접근 계층
 * DATABASE_URL 미설정 시 mockData 반환, 설정 시 Azure SQL Database(Prisma) 쿼리
 */

import { getSecret } from "@/lib/config/secrets";
import { getPrismaClient } from "@/lib/db";
import type { GalleryItem, Notice } from "@/types";
import {
  activityData,
  notices as mockNotices,
  playbookHAI,
  playbookInterview,
  playbookPrompts,
  playbookTeams,
  playbookTrends,
  playbookUsecases,
  playdayData,
  quickLinks as mockQuickLinks,
  schedules as mockSchedules,
} from "@/data/mockData";

const isDatabaseConfigured = (): boolean => {
  return !!getSecret("DATABASE_URL");
};

function mapDbToGalleryItem(row: {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  thumbnail: string | null;
  fullDescription: string | null;
  tags: string | null;
  attachments: string | null;
  session: number | null;
}): GalleryItem {
  return {
    title: row.title,
    description: row.description,
    author: row.author,
    date: row.date,
    category: row.category,
    thumbnail: row.thumbnail ?? undefined,
    fullDescription: row.fullDescription ?? undefined,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : undefined,
    attachments: row.attachments
      ? (JSON.parse(row.attachments) as GalleryItem["attachments"])
      : undefined,
    session: row.session ?? undefined,
  };
}

export async function getNotices(): Promise<Notice[]> {
  if (!isDatabaseConfigured()) {
    return mockNotices as Notice[];
  }
  const db = getPrismaClient();
  const rows = await db.notice.findMany({ orderBy: { date: "desc" } });
  return rows.map((r) => ({
    title: r.title,
    date: r.date,
    badge: r.badge,
    badgeColor: r.badgeColor,
  }));
}

async function getGalleryBySection(section: string): Promise<GalleryItem[]> {
  const db = getPrismaClient();
  const rows = await db.galleryItem.findMany({
    where: { section },
    orderBy: { date: "desc" },
  });
  return rows.map(mapDbToGalleryItem);
}

export async function getPlaydayData(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playdayData;
  return getGalleryBySection("playday");
}

export async function getPlaybookUsecases(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookUsecases;
  return getGalleryBySection("playbook_usecase");
}

export async function getPlaybookTrends(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookTrends;
  return getGalleryBySection("playbook_trend");
}

export async function getPlaybookPrompts(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookPrompts;
  return getGalleryBySection("playbook_prompt");
}

export async function getPlaybookHAI(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookHAI;
  return getGalleryBySection("playbook_hai");
}

export async function getPlaybookTeams(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookTeams;
  return getGalleryBySection("playbook_teams");
}

export async function getPlaybookInterview(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookInterview;
  return getGalleryBySection("playbook_interview");
}

export async function getActivityData(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return activityData;
  return getGalleryBySection("activity");
}

export async function getSchedules(): Promise<{ date: string; event: string }[]> {
  if (!isDatabaseConfigured()) return mockSchedules;
  const db = getPrismaClient();
  const rows = await db.schedule.findMany({ orderBy: { date: "asc" } });
  return rows.map((r) => ({ date: r.date, event: r.event }));
}

export async function getQuickLinks(): Promise<{ text: string; href: string }[]> {
  if (!isDatabaseConfigured()) return mockQuickLinks;
  const db = getPrismaClient();
  const rows = await db.quickLink.findMany();
  return rows.map((r) => ({ text: r.text, href: r.href }));
}

export type PlaybookCategory = "usecase" | "trend" | "prompt" | "hai" | "teams" | "interview";

export async function getPlaybookByCategory(
  category: PlaybookCategory
): Promise<GalleryItem[]> {
  switch (category) {
    case "usecase":
      return getPlaybookUsecases();
    case "trend":
      return getPlaybookTrends();
    case "prompt":
      return getPlaybookPrompts();
    case "hai":
      return getPlaybookHAI();
    case "teams":
      return getPlaybookTeams();
    case "interview":
      return getPlaybookInterview();
    default:
      return [];
  }
}

/** 운영자 콘텐츠 관리용 통합 데이터 */
export async function getAdminContent(): Promise<
  Array<GalleryItem & { section: string }>
> {
  const [playday, usecase, trend, prompt, hai, teams, interview, activity] =
    await Promise.all([
      getPlaydayData(),
      getPlaybookUsecases(),
      getPlaybookTrends(),
      getPlaybookPrompts(),
      getPlaybookHAI(),
      getPlaybookTeams(),
      getPlaybookInterview(),
      getActivityData(),
    ]);
  return [
    ...playday.map((item) => ({ ...item, section: "PlayDay" })),
    ...usecase.map((item) => ({ ...item, section: "Playbook 활용사례" })),
    ...trend.map((item) => ({ ...item, section: "Playbook 트렌드" })),
    ...prompt.map((item) => ({ ...item, section: "Playbook 프롬프트" })),
    ...hai.map((item) => ({ ...item, section: "Playbook HAI" })),
    ...teams.map((item) => ({ ...item, section: "Playbook Teams" })),
    ...interview.map((item) => ({ ...item, section: "Playbook 인터뷰" })),
    ...activity.map((item) => ({ ...item, section: "ACE 커뮤니티" })),
  ];
}

/** 마키 쇼케이스용 통합 데이터 */
export async function getMarqueeData(): Promise<{
  topRow: GalleryItem[];
  bottomRow: GalleryItem[];
}> {
  const [playday, usecase, hai, teams, interview, trend, prompt, activity] =
    await Promise.all([
      getPlaydayData(),
      getPlaybookUsecases(),
      getPlaybookHAI(),
      getPlaybookTeams(),
      getPlaybookInterview(),
      getPlaybookTrends(),
      getPlaybookPrompts(),
      getActivityData(),
    ]);
  return {
    topRow: [...playday, ...usecase, ...hai, ...teams, ...interview],
    bottomRow: [...trend, ...prompt, ...activity],
  };
}
