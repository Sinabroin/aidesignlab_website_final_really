'use client';

import { useState } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import Link from 'next/link';

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
import { GalleryItem } from '@/data/mockData';

type Tab = 'home' | 'playbook' | 'playday' | 'notices';

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [writeSection, setWriteSection] = useState<string>('');

  // Preview carousel (1단계)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState<GalleryItem[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Detail modal (2단계)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<GalleryItem[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

  const openPreview = (items: GalleryItem[], index: number) => {
    setPreviewItems(items);
    setCurrentPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  const openDetailFromPreview = (index: number) => {
    setIsPreviewOpen(false);
    setModalItems(previewItems);
    setCurrentModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleWriteClick = (section: string) => {
    setWriteSection(section);
    setShowWriteModal(true);
  };

  return (
    <div className="min-h-screen bg-white hero-tone-level6">
      {/* 운영자 페이지 버튼 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => window.location.href = '/admin'}
          className="relative overflow-visible flex items-center gap-2 bg-white/90 backdrop-blur border border-line rounded-none px-4 py-2 text-sm text-ink hover:border-muted transition-colors shadow-soft"
        >
          <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="relative z-10 font-normal">운영자 페이지</span>
        </button>
      </div>

      {/* 히어로 헤더 — 청량한 블루 그라데이션 */}
      <div
        className="bg-hero min-h-[28vh] flex items-end cursor-pointer transition-opacity hover:opacity-95"
        onClick={() => setActiveTab('home')}
      >
        <div className="max-w-6xl mx-auto px-6 w-full pb-10">
          <h1 className="text-5xl md:text-6xl font-light tracking-[0.08em] text-ink">
            PLAYGROUND
          </h1>
          <p className="text-lg mt-2 text-muted">
            Connect AI to your work
          </p>
        </div>
      </div>

      {/* 네비게이션 바 */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8 items-center">
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
              className="group relative overflow-visible px-2 py-4 font-normal text-sm text-muted hover:text-[#0057FF] transition-colors flex items-center gap-2"
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
              <span className="relative z-10 text-[10px] text-white px-2 py-0.5 rounded-none bg-ink">
                권한 필요
              </span>
            </Link>
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
        />
      )}

      {/* 컨텐츠 영역 */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {activeTab === 'home' && <HomeSection onNavigate={(tab) => setActiveTab(tab as Tab)} />}
        {activeTab === 'playbook' && <PlayBookSection onWriteClick={handleWriteClick} onCardClick={openPreview} />}
        {activeTab === 'playday' && <PlayDaySection onWriteClick={handleWriteClick} onCardClick={openPreview} />}
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
      />
    </div>
  );
}
