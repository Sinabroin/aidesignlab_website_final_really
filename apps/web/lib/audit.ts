/** 서버사이드 감사 로그 기록 유틸리티 */
import { getPrismaClient } from "@/lib/db";

export type AuditAction =
  | "page_view"
  | "login"
  | "logout"
  | "download"
  | "click"
  | "post_delete"
  | "post_edit"
  | "content_delete"
  | "content_hide"
  | "comment_delete";

interface AuditEventParams {
  email: string;
  userName?: string | null;
  action: AuditAction;
  path?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  try {
    if (!process.env.DATABASE_URL) return;
    const prisma = getPrismaClient();
    await prisma.accessLog.create({
      data: {
        email: params.email,
        userName: params.userName ?? null,
        action: params.action,
        path: params.path ?? null,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    console.error("[audit] Failed to log event:", error);
  }
}

export function extractIpFromHeaders(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
