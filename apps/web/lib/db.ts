/**
 * Prisma Client 싱글톤
 *
 * Next.js 개발 시 hot reload에서 여러 인스턴스 생성 방지
 * DATABASE_URL 미설정 시 getPrismaClient() 호출 전에 isDatabaseConfigured() 확인 필요
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
