/**
 * Prisma 시드 스크립트
 * mockData를 DB에 삽입 (Azure SQL 연결 후 실행)
 *
 * 실행: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import {
  activityData,
  notices,
  playbookHAI,
  playbookInterview,
  playbookPrompts,
  playbookTeams,
  playbookTrends,
  playbookUsecases,
  playdayData,
  quickLinks,
  schedules,
} from "../data/mockData";

const prisma = new PrismaClient();

function toGalleryRows(
  items: Array<{
    title: string;
    description: string;
    author: string;
    date: string;
    category: string;
    thumbnail?: string;
    fullDescription?: string;
    tags?: string[];
    attachments?: { name: string; url: string; size: string; type: string }[];
    session?: number;
  }>,
  section: string
) {
  return items.map((item) => ({
    title: item.title,
    description: item.description,
    author: item.author,
    date: item.date,
    category: item.category,
    thumbnail: item.thumbnail ?? null,
    fullDescription: item.fullDescription ?? null,
    tags: item.tags ? JSON.stringify(item.tags) : null,
    attachments: item.attachments?.length
      ? JSON.stringify(item.attachments)
      : null,
    session: item.session ?? null,
    section,
  }));
}

async function main() {
  const galleryRows = [
    ...toGalleryRows(playbookUsecases, "playbook_usecase"),
    ...toGalleryRows(playbookTrends, "playbook_trend"),
    ...toGalleryRows(playbookPrompts, "playbook_prompt"),
    ...toGalleryRows(playbookHAI, "playbook_hai"),
    ...toGalleryRows(playbookTeams, "playbook_teams"),
    ...toGalleryRows(playbookInterview, "playbook_interview"),
    ...toGalleryRows(playdayData, "playday"),
    ...toGalleryRows(activityData, "activity"),
  ];

  await prisma.galleryItem.createMany({ data: galleryRows });

  await prisma.notice.createMany({
    data: notices.map((n) => ({
      title: n.title,
      date: n.date,
      badge: n.badge,
      badgeColor: n.badgeColor,
    })),
  });

  await prisma.schedule.createMany({ data: schedules });
  await prisma.quickLink.createMany({ data: quickLinks });

  console.log("Seed 완료: gallery_items, notices, schedules, quick_links");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
