/** 관리자용 접속 로그 조회 API */
import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";

const ONLINE_THRESHOLD_MS = 5 * 60 * 1000;
const DEFAULT_PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasRole(user, "operator")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const params = req.nextUrl.searchParams;
    const mode = params.get("mode") ?? "logs";

    if (mode === "online") {
      return handleOnlineUsers();
    }
    return handleLogsList(params);
  } catch (error) {
    console.error("[admin/access-logs] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handleOnlineUsers() {
  const prisma = getPrismaClient();
  const threshold = new Date(Date.now() - ONLINE_THRESHOLD_MS);

  const recentLogs = await prisma.accessLog.findMany({
    where: { createdAt: { gte: threshold } },
    orderBy: { createdAt: "desc" },
  });

  const onlineMap = new Map<string, OnlineUser>();
  for (const log of recentLogs) {
    if (!onlineMap.has(log.email)) {
      onlineMap.set(log.email, {
        email: log.email,
        userName: log.userName,
        lastAction: log.action,
        lastPath: log.path,
        lastSeen: log.createdAt.toISOString(),
        ipAddress: log.ipAddress,
      });
    }
  }

  return NextResponse.json({
    onlineUsers: Array.from(onlineMap.values()),
    totalOnline: onlineMap.size,
    threshold: ONLINE_THRESHOLD_MS,
  });
}

interface OnlineUser {
  email: string;
  userName: string | null;
  lastAction: string;
  lastPath: string | null;
  lastSeen: string;
  ipAddress: string | null;
}

async function handleLogsList(params: URLSearchParams) {
  const prisma = getPrismaClient();
  const page = Math.max(1, Number(params.get("page") ?? "1"));
  const size = Math.min(100, Math.max(1, Number(params.get("size") ?? DEFAULT_PAGE_SIZE)));
  const action = params.get("action");
  const actions = params.get("actions");
  const email = params.get("email");
  const dateFrom = params.get("dateFrom");
  const dateTo = params.get("dateTo");

  const where = buildWhereClause(action, actions, email, dateFrom, dateTo);

  const [logs, total] = await Promise.all([
    prisma.accessLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.accessLog.count({ where }),
  ]);

  return NextResponse.json({
    logs: logs.map(formatLog),
    total,
    page,
    size,
    totalPages: Math.ceil(total / size),
  });
}

function buildWhereClause(
  action: string | null,
  actions: string | null,
  email: string | null,
  dateFrom: string | null,
  dateTo: string | null,
) {
  const where: Record<string, unknown> = {};
  if (actions) {
    where.action = { in: actions.split(",") };
  } else if (action) {
    where.action = action;
  }
  if (email) where.email = { contains: email };
  if (dateFrom || dateTo) {
    const createdAt: Record<string, Date> = {};
    if (dateFrom) createdAt.gte = new Date(dateFrom);
    if (dateTo) createdAt.lte = new Date(dateTo);
    where.createdAt = createdAt;
  }
  return where;
}

function formatLog(log: {
  id: string;
  email: string;
  userName: string | null;
  action: string;
  path: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  metadata: string | null;
  createdAt: Date;
}) {
  return {
    id: log.id,
    email: log.email,
    userName: log.userName,
    action: log.action,
    path: log.path,
    userAgent: log.userAgent,
    ipAddress: log.ipAddress,
    metadata: log.metadata ? JSON.parse(log.metadata) : null,
    createdAt: log.createdAt.toISOString(),
  };
}
