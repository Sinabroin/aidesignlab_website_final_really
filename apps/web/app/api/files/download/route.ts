/** File download API with authentication check */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * 파일 다운로드 API
 * 
 * 인증된 사용자만 파일 다운로드 가능
 * 비로그인 사용자는 401 반환
 */
export async function GET(req: NextRequest) {
  try {
    // 인증 확인
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized", message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json(
        { error: "Bad Request", message: "파일 URL이 필요합니다." },
        { status: 400 }
      );
    }

    // 외부 URL에서 파일 다운로드
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "File Not Found", message: "파일을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const fileBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition") || 
      `attachment; filename="${fileUrl.split('/').pop()}"`;

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("File download error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "파일 다운로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
