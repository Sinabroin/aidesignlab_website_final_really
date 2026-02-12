'use client';

import { useEffect, useState } from 'react';

interface GalleryItem {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  fullDescription?: string;
  tags?: string[];
  attachments?: {
    name: string;
    url: string;
    size: string;
    type: string;
  }[];
  session?: number;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

/**
 * 갤러리 상세보기 모달
 * 
 * - 어두운 배경 오버레이
 * - 좌우 화살표로 이전/다음 탐색
 * - 모바일 스와이프 지원
 * - Sky Blue 색상 테마
 */
export default function GalleryModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate
}: GalleryModalProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  const currentItem = items[currentIndex];

  // 스와이프 힌트 숨기기
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 스와이프 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // 왼쪽으로 스와이프 - 다음
      goToNext();
    } else if (distance < -minSwipeDistance) {
      // 오른쪽으로 스와이프 - 이전
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    onNavigate(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 모달 컨텐츠 */}
      <div 
        className="relative w-full max-w-4xl mx-4 md:mx-8"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 카드 컨텐츠 */}
        <div className="bg-gradient-to-br from-[#aacae6] via-[#c8dff0] to-white rounded-2xl overflow-hidden shadow-2xl">
          {/* 이미지/아이콘 영역 */}
          <div className="aspect-video bg-white flex items-center justify-center relative overflow-hidden border-b-2 border-gray-200">
            {/* 배경 장식 - 매우 연한 원형 */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 bg-[#87CEEB] rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#B0E0E6] rounded-full blur-3xl"></div>
            </div>
            
            {/* 이모티콘 */}
            <div className="text-8xl md:text-9xl relative z-10 drop-shadow-sm">
              {currentItem.category === 'Workshop' && '🎨'}
              {currentItem.category === 'Seminar' && '💡'}
              {currentItem.category === 'Contest' && '🏆'}
              {currentItem.category === 'Networking' && '🤝'}
              {currentItem.category === 'Safety' && '🛡️'}
              {currentItem.category === 'Planning' && '📊'}
              {currentItem.category === 'AI System' && '🤖'}
              {currentItem.category === 'Design' && '✨'}
              {currentItem.category === 'Data' && '📈'}
              {currentItem.category === 'Training' && '🎓'}
              {!['Workshop', 'Seminar', 'Contest', 'Networking', 'Safety', 'Planning', 'AI System', 'Design', 'Data', 'Training'].includes(currentItem.category) && '✨'}
            </div>
          </div>

          {/* 정보 영역 */}
          <div className="p-8 md:p-12">
            {/* 카테고리 배지 & 회차 정보 */}
            <div className="mb-4 flex items-center gap-3">
              <span className="px-4 py-1.5 bg-[#00aad2] text-white text-sm font-bold rounded-full">
                {currentItem.category}
              </span>
              {currentItem.session && (
                <span className="px-4 py-1.5 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-sm font-bold rounded-full flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {currentItem.session}회차
                </span>
              )}
            </div>

            {/* 타이틀 */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentItem.title}
            </h2>

            {/* 작성자 & 날짜 */}
            <div className="flex items-center gap-4 mb-6 text-gray-600">
              <span className="font-medium">작성자: {currentItem.author}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span>{currentItem.date}</span>
            </div>

            {/* 설명 */}
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {currentItem.description}
            </p>

            {/* 상세 설명 */}
            {currentItem.fullDescription && (
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                {currentItem.fullDescription}
              </p>
            )}

            {/* 해시태그 + 키워드 */}
            {currentItem.tags && currentItem.tags.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#87CEEB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  해시태그 + 키워드
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentItem.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-1.5 bg-[#E8F6F8]/80 text-[#4A90A4] text-sm font-medium rounded-full border border-[#87CEEB]/30 hover:bg-[#D4EEF7]/80 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 첨부파일 다운로드 */}
            {currentItem.attachments && currentItem.attachments.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#00aad2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  첨부파일
                </h3>
                <div className="space-y-3">
                  {currentItem.attachments.map((file, index) => (
                    <a
                      key={index}
                      href={file.url}
                      download
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-[#e8f4f8] to-white border border-[#aacae6] rounded-lg hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        {/* 파일 타입 아이콘 */}
                        <div className="flex-shrink-0 w-10 h-10 bg-[#00aad2] rounded-lg flex items-center justify-center">
                          {file.type === 'pdf' && (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
                            </svg>
                          )}
                          {(file.type === 'docx' || file.type === 'doc') && (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 2h8l4 4v12H4V2zm2 2v12h8V7h-3V4H6z" />
                            </svg>
                          )}
                          {(file.type === 'pptx' || file.type === 'ppt') && (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 3h14v14H3V3zm2 2v10h10V5H5z" />
                            </svg>
                          )}
                          {(file.type === 'xlsx' || file.type === 'xls') && (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 3h14v14H3V3zm4 4H5v2h2V7zm4 0H9v2h2V7zm4 0h-2v2h2V7z" />
                            </svg>
                          )}
                          {file.type === 'zip' && (
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 2h12v16H4V2zm4 2v2h2V4H8zm0 4v2h2V8H8zm0 4v2h2v-2H8z" />
                            </svg>
                          )}
                        </div>
                        
                        {/* 파일 정보 */}
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-[#00aad2] transition-colors">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      
                      {/* 다운로드 버튼 */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-[#00aad2] rounded-full flex items-center justify-center group-hover:bg-[#008bb5] transition-colors">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#00aad2] text-[#00aad2] rounded-lg hover:bg-[#e8f4f8] transition-colors font-semibold">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                좋아요
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#00aad2] text-white rounded-lg hover:bg-[#008bb5] transition-colors font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                공유하기
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                저장하기
              </button>
            </div>
          </div>
        </div>

        {/* 이전 버튼 - 데스크탑 */}
        <button
          onClick={goToPrevious}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 다음 버튼 - 데스크탑 */}
        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 이전/다음 버튼 - 모바일 (하단) */}
        <div className="md:hidden absolute -bottom-20 left-1/2 -translate-x-1/2 flex gap-4">
          <button
            onClick={goToPrevious}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 페이지 인디케이터 */}
        <div className="absolute -bottom-12 md:-bottom-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-white text-sm font-semibold">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        {/* 모바일 스와이프 힌트 */}
        {showSwipeHint && (
          <div className="md:hidden absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span className="text-white text-sm">좌우로 스와이프</span>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
