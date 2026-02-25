/** 사용자 접속·활동 로그 기록 API */
import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";

const VALID_ACTIONS = ["page_view", "login", "logout", "download", "click"] as const;
type LogAction = (typeof VALID_ACTIONS)[number];

interface AccessLogBody {
  action: LogAction;
  path?: string;
  metadata?: Record<string, unknown>;
}

function extractIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isValidAction(action: unknown): action is LogAction {
  return typeof action === "string" && VALID_ACTIONS.includes(action as LogAction);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.email) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as AccessLogBody;
    if (!isValidAction(body.action)) {
      return NextResponse.json({ ok: false, message: "Invalid action" }, { status: 400 });
    }

    const prisma = getPrismaClient();
    await prisma.accessLog.create({
      data: {
        email: user.email,
        userName: user.name ?? null,
        action: body.action,
        path: body.path ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
        ipAddress: extractIp(req),
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[access-log] Failed to create log:", error);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
