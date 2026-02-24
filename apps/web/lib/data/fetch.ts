/**
 * Next.js API 기반 데이터 페칭
 * /api/data/* 엔드포인트 호출 (동일 오리진, credentials 포함)
 */

import type { GalleryItem, HomeBanner, HomePlaydayGuide, Notice } from "@/types";

const API_BASE = "/api/data";

async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchPlaybook(category: string): Promise<GalleryItem[]> {
  return fetchApi<GalleryItem[]>(`${API_BASE}/playbook?category=${category}`);
}

export async function fetchPlayday(): Promise<GalleryItem[]> {
  return fetchApi<GalleryItem[]>(`${API_BASE}/playday`);
}

export async function fetchNotices(): Promise<Notice[]> {
  return fetchApi<Notice[]>(`${API_BASE}/notices`);
}

export async function fetchSchedules(): Promise<{ date: string; event: string }[]> {
  return fetchApi<{ date: string; event: string }[]>(`${API_BASE}/schedules`);
}

export async function fetchQuickLinks(): Promise<{ text: string; href: string }[]> {
  return fetchApi<{ text: string; href: string }[]>(`${API_BASE}/quick-links`);
}

export async function fetchActivity(): Promise<GalleryItem[]> {
  return fetchApi<GalleryItem[]>(`${API_BASE}/activity`);
}

export async function fetchMarquee(): Promise<{
  topRow: GalleryItem[];
  bottomRow: GalleryItem[];
}> {
  return fetchApi<{ topRow: GalleryItem[]; bottomRow: GalleryItem[] }>(
    `${API_BASE}/marquee`
  );
}

export async function fetchAdminContent(): Promise<
  Array<GalleryItem & { section: string }>
> {
  return fetchApi<Array<GalleryItem & { section: string }>>(
    "/api/admin/content"
  );
}

export async function fetchHomeContent(): Promise<{
  banners: HomeBanner[];
  notices: Notice[];
  playdayGuides: HomePlaydayGuide[];
}> {
  return fetchApi<{
    banners: HomeBanner[];
    notices: Notice[];
    playdayGuides: HomePlaydayGuide[];
  }>(`${API_BASE}/home-content`);
}
