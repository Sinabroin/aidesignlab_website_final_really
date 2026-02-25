import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import { FIXED_OPERATOR_EMAIL } from "@/lib/auth/rbac";
import {
  getAllowlists,
  addToAllowlist,
  removeFromAllowlist,
  type AllowlistRole,
} from "@/lib/data/allowlists.server";

function requireOperator() {
  return async () => {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }
    if (!hasRole(user, "operator")) {
      return NextResponse.json(
        { error: "Forbidden", message: "운영자만 접근할 수 있습니다." },
        { status: 403 }
      );
    }
    return null;
  };
}

/**
 * GET: 운영진·ACE 목록 조회 (고정 운영자 포함)
 */
export async function GET() {
  const err = await requireOperator()();
  if (err) return err;

  const data = await getAllowlists();
  const operators = data.operators.includes(FIXED_OPERATOR_EMAIL)
    ? data.operators
    : [FIXED_OPERATOR_EMAIL, ...data.operators];
  return NextResponse.json({
    operators: [...new Set(operators)],
    community: data.community,
  });
}

/**
 * POST: 목록에 추가
 * body: { email: string, role: "operator" | "community" }
 */
export async function POST(req: Request) {
  const err = await requireOperator()();
  if (err) return err;

  let body: { email?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Bad Request", message: "JSON body가 필요합니다." },
      { status: 400 }
    );
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const role = body.role === "operator" || body.role === "community" ? body.role : null;

  if (!email) {
    return NextResponse.json(
      { error: "Bad Request", message: "email이 필요합니다." },
      { status: 400 }
    );
  }
  if (!role) {
    return NextResponse.json(
      { error: "Bad Request", message: "role은 'operator' 또는 'community'여야 합니다." },
      { status: 400 }
    );
  }

  const normalized = email.toLowerCase();
  if (!normalized.includes("@")) {
    return NextResponse.json(
      { error: "Bad Request", message: "올바른 이메일 형식이어야 합니다." },
      { status: 400 }
    );
  }

  try {
    await addToAllowlist(normalized, role as AllowlistRole);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", message: "권한 저장에 실패했습니다." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, email: normalized, role });
}

/**
 * DELETE: 목록에서 제거
 * body: { email: string, role: "operator" | "community" } 또는 query
 */
export async function DELETE(req: Request) {
  const err = await requireOperator()();
  if (err) return err;

  const url = new URL(req.url);
  let email: string | null =
    url.searchParams.get("email")?.trim() || null;
  let role: AllowlistRole | null =
    (url.searchParams.get("role") as AllowlistRole) || null;

  if (!email || !role) {
    try {
      const body = await req.json();
      email = body?.email?.trim() || null;
      role = body?.role === "operator" || body?.role === "community" ? body.role : null;
    } catch {
      // no body
    }
  }

  if (!email || !role) {
    return NextResponse.json(
      { error: "Bad Request", message: "email과 role이 필요합니다." },
      { status: 400 }
    );
  }

  const result = await removeFromAllowlist(email.toLowerCase(), role);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Forbidden", message: result.error ?? "제거할 수 없습니다." },
      { status: 403 }
    );
  }
  return NextResponse.json({ ok: true });
}
