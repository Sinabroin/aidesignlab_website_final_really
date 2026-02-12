import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasRole } from "@/lib/auth/rbac";
import ACECommunitySection from "@/components/sections/ACECommunitySection";
import { useState } from "react";
import GalleryModal from "@/components/GalleryModal";
import { GalleryItem } from "@/data/mockData";

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
    redirect("/api/auth/login?next=/community&user=lab001@hdec.co.kr");
  }

  // community 권한 체크
  if (!hasRole(user, "community")) {
    redirect("/unauthorized?reason=community_only");
  }

  // 권한 있음 - 커뮤니티 페이지 렌더링
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#C1E7ED] to-[#87CEEB] text-white pt-12 pb-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                ACE 커뮤니티
              </h1>
              <p className="text-lg mt-2">ACE & AI디자인랩 운영진 전용</p>
            </div>
            
            {/* 사용자 정보 & 로그아웃 */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-right">
                <p className="font-semibold">{user.name || user.id}</p>
                <p className="text-sm opacity-90">{user.email}</p>
              </div>
              <a
                href="/api/auth/logout"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold"
              >
                로그아웃
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex gap-8">
            <a
              href="/playground"
              className="px-4 py-4 text-gray-600 hover:text-[#87CEEB] transition-colors"
            >
              ← Playground로 돌아가기
            </a>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <CommunitySectionWrapper />
      </div>
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
