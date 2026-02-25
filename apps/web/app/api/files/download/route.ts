/** 파일 다운로드 API — 로그인 및 섹션별 권한 검사 후 파일 제공 */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getRolesForUser } from "@/lib/auth/rbac";

function buildUser(token: Awaited<ReturnType<typeof getToken>>) {
  return {
    id: (token?.sub ?? token?.email ?? "") as string,
    email: token?.email as string | undefined,
  };
}

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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
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

    const roles = getRolesForUser(buildUser(token));
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
