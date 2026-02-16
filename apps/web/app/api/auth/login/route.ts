import { NextResponse } from "next/server";

/**
 * DEV 로그인 API
 * 
 * 개발/테스트용 간단 로그인
 * 쿼리: ?user=EMP001&next=/community
 * 
 * ⚠️ 프로덕션에서는 사용 금지!
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/playground";
  const user = url.searchParams.get("user") || "EMP001";

  // 최소 user id만 있어도 됨 (사번/이메일 중 택1)
  const sessionUser = {
    id: user,
    email: `${user.toLowerCase()}@company.com`,
    name: `사용자 ${user}`,
  };

  const res = NextResponse.redirect(new URL(next, url.origin));
  
  // 세션 쿠키 설정
  res.cookies.set("session_user", JSON.stringify(sessionUser), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8시간
  });
  
  return res;
}
