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

function formatTodayDot(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, ".");
}

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

async function safeDb<T>(dbFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await dbFn();
  } catch {
    return fallback;
  }
}

export async function getNotices(): Promise<Notice[]> {
  if (!isDatabaseConfigured()) return mockNotices as Notice[];
  return safeDb(
    async () => {
      const db = getPrismaClient();
      const rows = await db.notice.findMany({ orderBy: { date: "desc" } });
      return rows.map((r) => ({
        title: r.title,
        date: r.date,
        badge: r.badge,
        badgeColor: r.badgeColor,
      }));
    },
    mockNotices as Notice[]
  );
}

export type AdminNoticeItem = Notice & { id: string };

export async function getAdminNotices(): Promise<AdminNoticeItem[]> {
  if (!isDatabaseConfigured()) return [];
  return safeDb(
    async () => {
      const db = getPrismaClient();
      const rows = await db.notice.findMany({ orderBy: { date: "desc" } });
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.date,
        badge: r.badge,
        badgeColor: r.badgeColor,
      }));
    },
    []
  );
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
  return safeDb(() => getGalleryBySection("playday"), playdayData);
}

export async function getPlaybookUsecases(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookUsecases;
  return safeDb(() => getGalleryBySection("playbook_usecase"), playbookUsecases);
}

export async function getPlaybookTrends(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookTrends;
  return safeDb(() => getGalleryBySection("playbook_trend"), playbookTrends);
}

export async function getPlaybookPrompts(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookPrompts;
  return safeDb(() => getGalleryBySection("playbook_prompt"), playbookPrompts);
}

export async function getPlaybookHAI(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookHAI;
  return safeDb(() => getGalleryBySection("playbook_hai"), playbookHAI);
}

export async function getPlaybookTeams(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookTeams;
  return safeDb(() => getGalleryBySection("playbook_teams"), playbookTeams);
}

export async function getPlaybookInterview(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return playbookInterview;
  return safeDb(() => getGalleryBySection("playbook_interview"), playbookInterview);
}

export async function getActivityData(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return activityData;
  return safeDb(() => getGalleryBySection("activity"), activityData);
}

export async function getSchedules(): Promise<{ date: string; event: string }[]> {
  if (!isDatabaseConfigured()) return mockSchedules;
  return safeDb(
    async () => {
      const db = getPrismaClient();
      const rows = await db.schedule.findMany({ orderBy: { date: "asc" } });
      return rows.map((r) => ({ date: r.date, event: r.event }));
    },
    mockSchedules
  );
}

export async function getQuickLinks(): Promise<{ text: string; href: string }[]> {
  if (!isDatabaseConfigured()) return mockQuickLinks;
  return safeDb(
    async () => {
      const db = getPrismaClient();
      const rows = await db.quickLink.findMany();
      return rows.map((r) => ({ text: r.text, href: r.href }));
    },
    mockQuickLinks
  );
}

export type HomeBannerItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomePlaydayGuideItem = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
};

function mapHomeBanner(row: {
  id: string;
  title: string;
  description: string;
  href: string | null;
  isActive: boolean;
  sortOrder: number;
}): HomeBannerItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    href: row.href ?? undefined,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

function mapPlaydayGuide(row: {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}): HomePlaydayGuideItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

async function queryHomeBanners(activeOnly: boolean): Promise<HomeBannerItem[]> {
  if (!isDatabaseConfigured()) return [];
  return safeDb(async () => {
    const db = getPrismaClient();
    const rows = await db.homeBanner.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.map(mapHomeBanner);
  }, []);
}

async function queryPlaydayGuides(activeOnly: boolean): Promise<HomePlaydayGuideItem[]> {
  if (!isDatabaseConfigured()) return [];
  return safeDb(async () => {
    const db = getPrismaClient();
    const rows = await db.homePlaydayGuide.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.map(mapPlaydayGuide);
  }, []);
}

export const getHomeBanners = () => queryHomeBanners(true);
export const getAdminHomeBanners = () => queryHomeBanners(false);
export const getHomePlaydayGuides = () => queryPlaydayGuides(true);
export const getAdminHomePlaydayGuides = () => queryPlaydayGuides(false);

export async function createHomeBanner(data: {
  title: string;
  description: string;
  href?: string;
}): Promise<HomeBannerItem> {
  const db = getPrismaClient();
  const row = await db.homeBanner.create({
    data: {
      title: data.title,
      description: data.description,
      href: data.href?.trim() || null,
    },
  });
  return mapHomeBanner(row);
}

export async function createHomePlaydayGuide(data: {
  title: string;
  description: string;
}): Promise<HomePlaydayGuideItem> {
  const db = getPrismaClient();
  const row = await db.homePlaydayGuide.create({
    data: { title: data.title, description: data.description },
  });
  return mapPlaydayGuide(row);
}

export async function createNotice(data: {
  title: string;
  badge: string;
  badgeColor?: string;
}): Promise<Notice> {
  const db = getPrismaClient();
  const row = await db.notice.create({
    data: {
      title: data.title,
      date: formatTodayDot(),
      badge: data.badge,
      badgeColor: data.badgeColor ?? "bg-gray-700",
    },
  });
  return {
    title: row.title,
    date: row.date,
    badge: row.badge,
    badgeColor: row.badgeColor,
  };
}

export async function deleteHomeBanner(id: string): Promise<void> {
  const db = getPrismaClient();
  await db.homeBanner.delete({ where: { id } });
}

export async function deleteHomePlaydayGuide(id: string): Promise<void> {
  const db = getPrismaClient();
  await db.homePlaydayGuide.delete({ where: { id } });
}

export async function deleteNoticeById(id: string): Promise<void> {
  const db = getPrismaClient();
  await db.notice.delete({ where: { id } });
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

export async function createGalleryItem(data: {
  section: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags?: string[];
  thumbnail?: string;
}): Promise<GalleryItem> {
  const db = getPrismaClient();
  const today = formatTodayDot();
  const row = await db.galleryItem.create({
    data: {
      section: data.section,
      title: data.title,
      description: data.description,
      author: data.author,
      date: today,
      category: data.category,
      tags: data.tags && data.tags.length > 0 ? JSON.stringify(data.tags) : null,
      thumbnail: data.thumbnail ?? null,
    },
  });
  return mapDbToGalleryItem(row);
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
