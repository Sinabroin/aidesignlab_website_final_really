/** 파일 다운로드 API — 로그인 및 섹션별 권한 검사 후 파일 제공 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getRolesForUser } from "@/lib/auth/rbac";

function canDownloadSection(roles: string[], section: string): boolean {
  if (roles.includes("operator") || roles.includes("community")) return true;
  return section !== "activity";
}

function getDeniedMessage(section: string): string {
  if (section === "activity") return "ACE 커뮤니티 첨부파일은 ACE 멤버 및 운영진만 다운로드 가능합니다.";
  return "다운로드 권한이 없습니다.";
}

async function proxyExternalFile(fileUrl: string, fileName: string): Promise<NextResponse> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    return NextResponse.json({ error: "파일을 찾을 수 없습니다." }, { status: 404 });
  }
  const fileBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") ?? "application/octet-stream";
  const safeFileName = encodeURIComponent(fileName);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename*=UTF-8''${safeFileName}`,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { searchParams } = req.nextUrl;
    const fileUrl = searchParams.get("url");
    const section = searchParams.get("section") ?? "";
    const fileName = searchParams.get("name") ?? "download";

    if (!fileUrl) {
      return NextResponse.json({ error: "파일 URL이 필요합니다." }, { status: 400 });
    }

    const roles = getRolesForUser(user);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'session-fix',hypothesisId:'D2',location:'api/files/download/route.ts',message:'download auth via getServerSession',data:{userId:user.id,roles,section,allowed:canDownloadSection(roles,section)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!canDownloadSection(roles, section)) {
      return NextResponse.json(
        { error: "Forbidden", message: getDeniedMessage(section) },
        { status: 403 }
      );
    }

    return await proxyExternalFile(fileUrl, fileName);
  } catch (error) {
    console.error("File download error:", error);
    return NextResponse.json({ error: "파일 다운로드 중 오류가 발생했습니다." }, { status: 500 });
  }
}
