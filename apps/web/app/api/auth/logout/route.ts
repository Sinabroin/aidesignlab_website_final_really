import { NextResponse } from "next/server";

/**
 * 로그아웃 API
 * 
 * 세션 쿠키 삭제 후 홈으로 리다이렉트
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const res = NextResponse.redirect(new URL("/", url.origin));
  
  // 세션 쿠키 삭제
  res.cookies.delete("session_user");
  
  return res;
}
