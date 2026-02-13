'use client';

import { useState } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import GalleryModal from '@/components/GalleryModal';
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
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<GalleryItem[]>([]);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);

  const openModal = (items: GalleryItem[], index: number) => {
    setModalItems(items);
    setCurrentModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleWriteClick = (section: string) => {
    setWriteSection(section);
    setShowWriteModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 운영자 페이지 버튼 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => window.location.href = '/admin'}
          className="relative overflow-visible px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-normal tracking-tight rounded-none shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="relative z-10">운영자 페이지</span>
        </button>
      </div>

      {/* 페이지 헤더 */}
      <div 
        className="bg-gray-900 text-white pt-12 pb-12 cursor-pointer hover:bg-gray-800 transition-all"
        onClick={() => setActiveTab('home')}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <h1 className="text-5xl md:text-6xl font-normal tracking-tight">
            PLAYGROUND
          </h1>
          <p className="text-lg mt-2">Connect ai to your work</p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
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
            
            {/* ACE 커뮤니티 - 별도 페이지로 이동 (호버 시 무지개만, 클릭 후 검은선 없음) */}
            <a
              href="/community"
              className="group relative px-2 py-4 text-gray-600 hover:text-gray-900 font-normal tracking-tight text-base transition-colors flex items-center gap-2"
            >
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(90deg, #dd7bbb, #d79f1e, #5a922c, #4c7894, #dd7bbb)',
                }}
                aria-hidden
              />
              ACE 커뮤니티
              <span className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-none font-normal tracking-tight">
                권한 필요
              </span>
            </a>
          </div>
        </div>
      </div>

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
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        {activeTab === 'home' && <HomeSection onNavigate={(tab) => setActiveTab(tab as Tab)} />}
        {activeTab === 'playbook' && <PlayBookSection onWriteClick={handleWriteClick} onCardClick={openModal} />}
        {activeTab === 'playday' && <PlayDaySection onWriteClick={handleWriteClick} onCardClick={openModal} />}
        {activeTab === 'notices' && <NoticesSection />}
      </div>

      {/* 갤러리 모달 */}
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
