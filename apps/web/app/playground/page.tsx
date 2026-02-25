'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import Link from 'next/link';
import {
  canWritePlaybook,
  canWritePlayday,
  hasRole,
  type User,
} from '@/lib/auth/rbac';

const RAINBOW_GRADIENT =
  'linear-gradient(90deg, #dd7bbb, #d79f1e, #5a922c, #4c7894, #dd7bbb)';
import GalleryModal from '@/components/GalleryModal';
import PreviewCarousel from '@/components/PreviewCarousel';
import HelpButton from '@/components/HelpButton';
import HelpModal from '@/components/HelpModal';
import WritePost from '@/components/WritePost';
import TabButton from '@/components/common/TabButton';
import HomeSection from '@/components/sections/HomeSection';
import PlayBookSection from '@/components/sections/PlayBookSection';
import PlayDaySection from '@/components/sections/PlayDaySection';
import NoticesSection from '@/components/sections/NoticesSection';
import type { GalleryItem } from '@/types';

type Tab = 'home' | 'playbook' | 'playday' | 'notices';

export default function PlaygroundPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeSection, setWriteSection] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  const currentUser: User | null = session?.user?.email
    ? {
        id: session.user.email,
        email: session.user.email,
        name: session.user.name ?? undefined,
      }
    : null;
  const canWritePlaydayPost = canWritePlayday(currentUser);
  const canWritePlaybookPost = canWritePlaybook(currentUser);
  const showAdminButton =
    status === 'authenticated' && currentUser != null && hasRole(currentUser, 'operator');

  // Preview carousel (1단계)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState<GalleryItem[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Detail modal (2단계)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<GalleryItem[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);
  const [modalSection, setModalSection] = useState<string>('playbook');

  const openPreview = (items: GalleryItem[], index: number) => {
    setPreviewItems(items);
    setCurrentPreviewIndex(index);
    setIsPreviewOpen(true);
    setModalSection(activeTab === 'playday' ? 'playday' : 'playbook');
  };

  const openDetailFromPreview = (index: number) => {
    setIsPreviewOpen(false);
    setModalItems(previewItems);
    setCurrentModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDeletePost = () => {
    setIsModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleWriteClick = (section: string) => {
    if (section === 'playbook' && !canWritePlaybookPost) {
      alert('Playbook 작성은 운영진만 가능합니다.');
      return;
    }
    if (section === 'playday' && !canWritePlaydayPost) {
      alert('PlayDay 작성 권한이 없습니다.');
      return;
    }
    setWriteSection(section);
    setShowWriteModal(true);
  };

  return (
    <div className="min-h-screen bg-white hero-tone-level6">
      {/* 운영자 페이지 버튼 - 관리자만 표시 */}
      {showAdminButton && (
        <div className="fixed top-3 md:top-4 left-3 md:left-4 z-50">
          <Link
            href="/admin"
            className="relative overflow-visible flex items-center gap-1.5 md:gap-2 bg-white/90 backdrop-blur border border-line rounded-none px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-ink hover:border-muted transition-colors shadow-soft"
          >
            <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="relative z-10 font-normal hidden sm:inline">운영자 페이지</span>
            <span className="relative z-10 font-normal sm:hidden">관리</span>
          </Link>
        </div>
      )}

      {/* 히어로 헤더 — 청량한 블루 그라데이션 */}
      <div
        className="bg-hero min-h-[28vh] flex items-end cursor-pointer transition-opacity hover:opacity-95 pt-16 md:pt-0"
        onClick={() => setActiveTab('home')}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full pb-6 md:pb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.08em] text-ink">
            PLAYGROUND
          </h1>
          <p className="text-base md:text-lg mt-2 text-muted">
            Connect AI to your work
          </p>
        </div>
      </div>

      {/* 네비게이션 바 */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex gap-2 md:gap-4 lg:gap-8 items-center overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'home'} onClick={() => setActiveTab('home')}>
              Home
            </TabButton>
            <TabButton active={activeTab === 'playbook'} onClick={() => setActiveTab('playbook')}>
              PlayBook
            </TabButton>
            <TabButton active={activeTab === 'playday'} onClick={() => setActiveTab('playday')}>
              PlayDay
            </TabButton>

            {/* ACE 커뮤니티 */}
            <Link
              href="/community"
              className="group relative overflow-visible px-2 py-4 font-normal text-xs md:text-sm text-muted hover:text-[#0057FF] transition-colors flex items-center gap-1 md:gap-2 whitespace-nowrap flex-shrink-0"
            >
              <GlowingEffect
                disabled={false}
                spread={12}
                movementDuration={1.5}
                inactiveZone={0.4}
                borderWidth={2}
                proximity={8}
              />
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: RAINBOW_GRADIENT }}
                aria-hidden
              />
              <span className="relative z-10">ACE 커뮤니티</span>
              <span className="relative z-10 text-[9px] md:text-[10px] text-white px-1.5 md:px-2 py-0.5 rounded-none bg-ink">
                권한 필요
              </span>
            </Link>

            {/* 로그인/로그아웃 — 우측 정렬 */}
            <div className="ml-auto flex-shrink-0">
              <AuthButton status={status} userEmail={session?.user?.email} />
            </div>
          </div>
        </div>
      </nav>

      {/* 도와줘요 ACE! */}
      <HelpButton onClick={() => setShowHelpModal(true)} />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <WritePost
          onClose={() => setShowWriteModal(false)}
          section={writeSection}
          onPublished={() => setRefreshKey((k) => k + 1)}
        />
      )}

      {/* 컨텐츠 영역 */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {activeTab === 'home' && <HomeSection onNavigate={(tab) => setActiveTab(tab as Tab)} />}
        {activeTab === 'playbook' && (
          <PlayBookSection
            key={`playbook-${refreshKey}`}
            onWriteClick={handleWriteClick}
            onCardClick={openPreview}
            showWriteButton={canWritePlaybookPost}
          />
        )}
        {activeTab === 'playday' && (
          <PlayDaySection
            key={`playday-${refreshKey}`}
            onWriteClick={handleWriteClick}
            onCardClick={openPreview}
            showWriteButton={canWritePlaydayPost}
          />
        )}
        {activeTab === 'notices' && <NoticesSection />}
      </div>

      {/* 푸터 */}
      <footer className="border-t border-line py-12 text-center text-muted text-sm">
        © 2025 AI Design Lab
      </footer>

      {/* 프리뷰 캐러셀 (1단계) */}
      <PreviewCarousel
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        items={previewItems}
        currentIndex={currentPreviewIndex}
        onNavigate={setCurrentPreviewIndex}
        onDetailClick={openDetailFromPreview}
      />

      {/* 갤러리 모달 (2단계) */}
      <GalleryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        items={modalItems}
        currentIndex={currentModalIndex}
        onNavigate={setCurrentModalIndex}
        section={modalSection}
        onDelete={handleDeletePost}
      />
    </div>
  );
}

function AuthButton({ status, userEmail }: { status: string; userEmail?: string | null }) {
  if (status === 'loading') return null;

  if (status === 'authenticated') {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/playground' })}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm text-muted hover:text-ink transition-colors whitespace-nowrap"
      >
        <span className="hidden sm:inline text-xs text-gray-400 truncate max-w-[120px]">
          {userEmail}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>로그아웃</span>
      </button>
    );
  }

  return (
    <Link
      href="/login?callbackUrl=/playground"
      className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs md:text-sm rounded-none hover:bg-gray-800 transition-colors whitespace-nowrap"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      <span>로그인</span>
    </Link>
  );
}
