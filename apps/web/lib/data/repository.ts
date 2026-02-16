/**
 * 데이터 저장소 추상화
 *
 * 브라우저 ↔ API(서버) ↔ DB 패턴의 서버 측 데이터 접근 계층
 * DATABASE_URL 미설정 시 mockData 반환, 설정 시 DB 쿼리 (TODO)
 */

import { getSecret } from "@/lib/config/secrets";
import type { GalleryItem, Notice } from "@/types";
import {
  activityData,
  notices as mockNotices,
  playbookHAI,
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

export async function getNotices(): Promise<Notice[]> {
  if (!isDatabaseConfigured()) {
    return mockNotices as Notice[];
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  // const db = await getDbClient();
  // return db.query('SELECT * FROM notices ORDER BY date DESC');
  return mockNotices as Notice[];
}

export async function getPlaydayData(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) {
    return playdayData;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return playdayData;
}

export async function getPlaybookUsecases(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) {
    return playbookUsecases;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return playbookUsecases;
}

export async function getPlaybookTrends(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) {
    return playbookTrends;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return playbookTrends;
}

export async function getPlaybookPrompts(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) {
    return playbookPrompts;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return playbookPrompts;
}

export async function getPlaybookHAI(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) {
    return playbookHAI;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return playbookHAI;
}

export async function getPlaybookTeams(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) {
    return playbookTeams;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return playbookTeams;
}

export async function getActivityData(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) {
    return activityData;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return activityData;
}

export async function getSchedules(): Promise<{ date: string; event: string }[]> {
  if (!isDatabaseConfigured()) {
    return mockSchedules;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return mockSchedules;
}

export async function getQuickLinks(): Promise<{ text: string; href: string }[]> {
  if (!isDatabaseConfigured()) {
    return mockQuickLinks;
  }
  // TODO: Azure PostgreSQL 연동 시 DB 쿼리
  return mockQuickLinks;
}

export type PlaybookCategory = "usecase" | "trend" | "prompt" | "hai" | "teams";

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
    default:
      return [];
  }
}
