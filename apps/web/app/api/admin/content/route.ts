/** 운영자 콘텐츠 통합 API - Operator RBAC */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import { getAdminContent } from "@/lib/data/repository";

export async function GET() {
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
  const data = await getAdminContent();
  return NextResponse.json(data);
}
