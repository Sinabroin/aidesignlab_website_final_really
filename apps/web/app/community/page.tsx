import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import LogoutButton from "@/components/common/LogoutButton";

// 동적 렌더링 강제 (cookies 사용하기 때문에)
export const dynamic = 'force-dynamic';

/**
 * ACE 커뮤니티 페이지
 * 
 * 접근 권한: ACE 30명 + AI디자인랩 5명 (총 35명)
 * 
 * 권한 체크 순서:
 * 1. middleware에서 로그인 확인 (임직원 인증)
 * 2. 이 페이지에서 community 역할 확인
 * 3. 권한 없으면 /unauthorized로 리다이렉트
 */
export default async function CommunityPage() {
  // 현재 로그인한 사용자 가져오기
  const user = await getCurrentUser();
  
  // 로그인 안 됨 (middleware에서 걸러야 하지만 이중 체크)
  if (!user) {
    redirect("/login?callbackUrl=/community");
  }

  // community 권한 체크
  if (!hasRole(user, "community")) {
    redirect("/unauthorized?reason=community_only");
  }

  // 권한 있음 - 커뮤니티 페이지 렌더링 (Playground와 동일한 디자인 톤)
  return (
    <div className="min-h-screen bg-white hero-tone-level6">
      {/* 히어로 헤더 — Playground와 동일한 청량한 블루 그라데이션 */}
      <div className="bg-hero min-h-[28vh] flex items-end pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full pb-6 md:pb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.08em] text-ink">
                ACE 커뮤니티
              </h1>
              <p className="text-base md:text-lg mt-2 text-muted">
                ACE & AI디자인랩 운영진 전용
              </p>
            </div>
            {/* 사용자 정보 & 로그아웃 */}
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur border border-line rounded-none px-4 py-2.5 shadow-soft">
              <div className="text-right min-w-0">
                <p className="font-normal tracking-tight text-ink truncate text-sm">{user.name || user.id}</p>
                <p className="text-xs text-muted truncate max-w-[180px] sm:max-w-none">{user.email}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 — Playground 스타일 통일 */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center">
            <a
              href="/playground"
              className="py-3 md:py-4 px-2 font-normal text-xs md:text-sm text-muted hover:text-[#0057FF] transition-colors"
            >
              ← Playground로 돌아가기
            </a>
          </div>
        </div>
      </nav>

      {/* 컨텐츠 */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <CommunitySectionWrapper />
      </div>

      {/* 푸터 — Playground와 동일 */}
      <footer className="border-t border-line py-12 text-center text-muted text-sm">
        © 2025 AI Design Lab
      </footer>
    </div>
  );
}

/**
 * Client Component Wrapper
 * (ACECommunitySection이 클라이언트 컴포넌트라서)
 */
async function CommunitySectionWrapper() {
  const ACECommunitySectionClient = (await import('./client')).default;
  return <ACECommunitySectionClient />;
}
