/** 감사 로그 엑셀 내보내기 API */
import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import * as XLSX from "xlsx";

const ACTION_LABELS: Record<string, string> = {
  page_view: "페이지 방문",
  login: "로그인",
  logout: "로그아웃",
  download: "다운로드",
  click: "클릭",
  post_delete: "게시글 삭제",
  post_edit: "게시글 수정",
  content_delete: "콘텐츠 삭제",
  content_hide: "콘텐츠 숨김",
  comment_delete: "댓글 삭제",
};

const LOG_TYPE_CONFIG: Record<string, { actions: string[]; sheetName: string }> = {
  access: {
    actions: ["page_view", "login", "logout", "click"],
    sheetName: "접속 로그",
  },
  download: {
    actions: ["download"],
    sheetName: "다운로드 로그",
  },
  moderation: {
    actions: ["post_delete", "post_edit", "content_delete", "content_hide", "comment_delete"],
    sheetName: "삭제_숨김 로그",
  },
};

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasRole(user, "operator")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const params = req.nextUrl.searchParams;
    const logType = params.get("logType") ?? "access";
    const dateFrom = params.get("dateFrom");
    const dateTo = params.get("dateTo");

    const config = LOG_TYPE_CONFIG[logType] ?? LOG_TYPE_CONFIG.access;
    const rows = await fetchLogs(config.actions, dateFrom, dateTo);
    const buffer = buildExcel(rows, logType, config.sheetName);

    const today = formatDateForFile(new Date());
    const fileName = `AI디자인랩_${config.sheetName}_${today}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    console.error("[access-logs/export] Error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

interface RawLog {
  id: string;
  email: string;
  userName: string | null;
  action: string;
  path: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  metadata: string | null;
  createdAt: Date;
}

async function fetchLogs(actions: string[], dateFrom: string | null, dateTo: string | null) {
  const prisma = getPrismaClient();
  const where: Record<string, unknown> = { action: { in: actions } };

  if (dateFrom || dateTo) {
    const createdAt: Record<string, Date> = {};
    if (dateFrom) createdAt.gte = new Date(dateFrom);
    if (dateTo) createdAt.lte = new Date(`${dateTo}T23:59:59.999Z`);
    where.createdAt = createdAt;
  }

  return prisma.accessLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10000,
  }) as Promise<RawLog[]>;
}

function buildExcel(rows: RawLog[], logType: string, sheetName: string) {
  const data = rows.map((r) => formatRow(r, logType));
  const headers = getHeaders(logType);

  const ws = XLSX.utils.json_to_sheet(data, { header: headers.map((h) => h.key) });
  applyHeaderNames(ws, headers);
  applyColumnWidths(ws, headers);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

type HeaderDef = { key: string; label: string; width: number };

function getHeaders(logType: string): HeaderDef[] {
  const common: HeaderDef[] = [
    { key: "일시", label: "일시", width: 22 },
    { key: "사용자", label: "사용자", width: 20 },
    { key: "이메일", label: "이메일", width: 28 },
    { key: "작업", label: "작업", width: 16 },
  ];

  if (logType === "download") {
    return [
      ...common,
      { key: "파일명", label: "파일명", width: 35 },
      { key: "섹션", label: "섹션", width: 15 },
      { key: "IP", label: "IP", width: 18 },
    ];
  }
  if (logType === "moderation") {
    return [
      ...common,
      { key: "대상", label: "대상", width: 30 },
      { key: "상세", label: "상세", width: 25 },
      { key: "IP", label: "IP", width: 18 },
    ];
  }
  return [
    ...common,
    { key: "페이지", label: "페이지", width: 35 },
    { key: "IP", label: "IP", width: 18 },
    { key: "브라우저", label: "브라우저", width: 30 },
  ];
}

function formatRow(log: RawLog, logType: string): Record<string, string> {
  const meta = parseMetadata(log.metadata);
  const base: Record<string, string> = {
    "일시": formatDateTime(log.createdAt),
    "사용자": log.userName ?? log.email.split("@")[0],
    "이메일": log.email,
    "작업": ACTION_LABELS[log.action] ?? log.action,
  };

  if (logType === "download") {
    return {
      ...base,
      "파일명": (meta?.fileName as string) ?? "-",
      "섹션": (meta?.section as string) ?? "-",
      "IP": log.ipAddress ?? "-",
    };
  }
  if (logType === "moderation") {
    return {
      ...base,
      "대상": (meta?.title as string) ?? (meta?.contentType as string) ?? "-",
      "상세": (meta?.section as string) ?? (meta?.reason as string) ?? "-",
      "IP": log.ipAddress ?? "-",
    };
  }
  return {
    ...base,
    "페이지": log.path ?? "-",
    "IP": log.ipAddress ?? "-",
    "브라우저": shortenUserAgent(log.userAgent),
  };
}

function parseMetadata(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function formatDateTime(date: Date): string {
  const d = new Date(date);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function formatDateForFile(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}`;
}

function shortenUserAgent(ua: string | null): string {
  if (!ua) return "-";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return ua.slice(0, 40);
}

function applyHeaderNames(ws: XLSX.WorkSheet, headers: HeaderDef[]) {
  headers.forEach((h, i) => {
    const cell = XLSX.utils.encode_cell({ r: 0, c: i });
    if (ws[cell]) ws[cell].v = h.label;
  });
}

function applyColumnWidths(ws: XLSX.WorkSheet, headers: HeaderDef[]) {
  ws["!cols"] = headers.map((h) => ({ wch: h.width }));
}
