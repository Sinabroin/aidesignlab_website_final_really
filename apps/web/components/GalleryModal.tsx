'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { extractPosterEmbed, type PosterEmbedData } from '@/lib/utils/poster-embed';
import PosterPreviewFrame from '@/components/editor/PosterEmbed/PosterPreviewFrame';

const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), { ssr: false });

interface GalleryItem {
  id?: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  thumbnail?: string;
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
  /** 게시글 섹션: 'playbook' | 'playday' | 'activity' — 다운로드 권한 결정에 사용 */
  section?: string;
  /** 게시글 삭제 성공 시 호출 — 부모가 모달 닫기 + 새로고침 처리 */
  onDelete?: () => void;
  /** 게시글 수정 버튼 클릭 시 호출 — 부모가 편집 모달을 열어줌 */
  onEdit?: (item: GalleryItem) => void;
}

/**
 * 갤러리 상세보기 모달
 * 
 * - 어두운 배경 오버레이
 * - 좌우 화살표로 이전/다음 탐색
 * - 모바일 스와이프 지원
 * - Neutral gray 에디토리얼 스타일
 */
export default function GalleryModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
  section,
  onDelete,
  onEdit,
}: GalleryModalProps) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const { roles: userRoles, isLoading: isRolesLoading } = useUserRoles(isAuthenticated);

  const currentItem = items[currentIndex];
  const downloadPerm = getDownloadPermission(userRoles, section, isAuthenticated);

  const isAuthor = !!(
    (session?.user?.name && currentItem?.author === session.user.name) ||
    (session?.user?.email && currentItem?.author === session.user.email)
  );
  const isOperator = userRoles.includes('operator');
  const canDelete = (isAuthor || isOperator) && !!currentItem?.id;
  const canEdit = (isAuthor || isOperator) && !!currentItem?.id;

  const handleDelete = async () => {
    if (!currentItem?.id) return;
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/data/posts/${currentItem.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        alert(data.error || '삭제에 실패했습니다.');
        return;
      }
      onDelete?.();
      onClose();
    } catch {
      alert('삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileDownload = async (fileUrl: string, fileName: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('파일 다운로드는 로그인이 필요합니다.');
      window.location.href = '/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
      return;
    }
    if (!downloadPerm.allowed) {
      alert(downloadPerm.message);
      return;
    }
    triggerDownload(fileUrl, fileName, section);
  };

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
        className="relative w-full max-w-[95vw] mx-2 md:mx-4 flex flex-col"
        style={{ maxHeight: 'calc(100vh - 40px)' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 w-12 h-12 md:w-14 md:h-14 rounded-none bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 카드 컨텐츠 */}
        <div className="bg-white border border-gray-200 rounded-none shadow-2xl flex flex-col overflow-hidden flex-1 min-h-0">
          {/* 정보 영역 - 스크롤 가능 */}
          <div className="p-8 md:p-12 lg:p-16 overflow-y-auto flex-1 min-h-0">
            {/* 카테고리 배지 & 회차 정보 */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {currentItem.category.split(',').filter(Boolean).map((cat) => (
                <span key={cat} className="px-5 py-2 bg-gray-900 text-white text-base md:text-lg font-normal tracking-tight rounded-none">
                  {cat.trim()}
                </span>
              ))}
              {currentItem.session && (
                <span className="px-5 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-base md:text-lg font-normal tracking-tight rounded-none flex items-center gap-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {currentItem.session}회차
                </span>
              )}
            </div>

            {/* 타이틀 */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-gray-900 mb-4">
              {currentItem.title}
            </h2>

            {/* 작성자 & 날짜 */}
            <div className="flex items-center gap-4 mb-6 text-gray-600 text-lg md:text-xl">
              <span className="font-normal tracking-tight">작성자: {currentItem.author}</span>
              <span className="w-1.5 h-1.5 rounded-none bg-gray-400"></span>
              <span>{currentItem.date}</span>
            </div>

            {/* 설명 */}
            <div className="mb-8">
              <RichTextEditor content={currentItem.description} editable={false} minHeight="600px" />
            </div>

            {/* 상세 설명 */}
            {currentItem.fullDescription && (
              <div className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                <RichTextEditor content={currentItem.fullDescription} editable={false} minHeight="400px" />
              </div>
            )}

            {/* 해시태그 + 키워드 */}
            {currentItem.tags && currentItem.tags.length > 0 && (
              <div className="mb-8">
                <h4 className="text-base md:text-lg font-normal tracking-tight text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  해시태그 + 키워드
                </h4>
                <div className="flex flex-wrap gap-3">
                  {currentItem.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-5 py-2 bg-gray-100 text-gray-900 text-base md:text-lg font-normal tracking-tight rounded-none border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 첨부파일 다운로드 */}
            {currentItem.attachments && currentItem.attachments.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl md:text-2xl font-normal tracking-tight text-gray-900 mb-5 flex items-center gap-3">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  첨부파일
                </h3>
                <div className="space-y-4">
                  {currentItem.attachments.map((file, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleFileDownload(file.url, file.name, e)}
                      disabled={!downloadPerm.allowed && !isRolesLoading}
                      className={`relative flex items-center justify-between p-5 md:p-6 bg-gray-50 border border-gray-200 rounded-none transition-all group w-full text-left ${
                        downloadPerm.allowed || isRolesLoading
                          ? 'hover:shadow-md cursor-pointer'
                          : 'opacity-60 cursor-not-allowed'
                      }`}
                      title={downloadPerm.allowed || isRolesLoading ? '' : downloadPerm.message}
                    >
                      <div className="flex items-center gap-4">
                        {/* 파일 타입 아이콘 */}
                        <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gray-900 rounded-none flex items-center justify-center">
                          {file.type === 'pdf' && (
                            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
                            </svg>
                          )}
                          {(file.type === 'docx' || file.type === 'doc') && (
                            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 2h8l4 4v12H4V2zm2 2v12h8V7h-3V4H6z" />
                            </svg>
                          )}
                          {(file.type === 'pptx' || file.type === 'ppt') && (
                            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 3h14v14H3V3zm2 2v10h10V5H5z" />
                            </svg>
                          )}
                          {(file.type === 'xlsx' || file.type === 'xls') && (
                            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 3h14v14H3V3zm4 4H5v2h2V7zm4 0H9v2h2V7zm4 0h-2v2h2V7z" />
                            </svg>
                          )}
                          {file.type === 'zip' && (
                            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 2h12v16H4V2zm4 2v2h2V4H8zm0 4v2h2V8H8zm0 4v2h2v-2H8z" />
                            </svg>
                          )}
                        </div>
                        
                        {/* 파일 정보 */}
                        <div>
                          <p className="text-base md:text-lg font-normal tracking-tight text-gray-900 group-hover:text-gray-900 transition-colors">
                            {file.name}
                          </p>
                          <p className="text-sm md:text-base text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      
                      {/* 다운로드 버튼 */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-900 rounded-none flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                          <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      </div>
                      {!downloadPerm.allowed && !isRolesLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-none">
                          <span className="text-sm text-gray-600 font-normal">{downloadPerm.message}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="relative overflow-visible flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-none hover:bg-gray-50 transition-colors font-normal tracking-tight text-base md:text-lg">
                <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
                <svg className="w-6 h-6 md:w-7 md:h-7 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="relative z-10">좋아요</span>
              </button>
              <button className="relative overflow-visible flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-none hover:bg-gray-800 transition-colors font-normal tracking-tight text-base md:text-lg">
                <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
                <svg className="w-6 h-6 md:w-7 md:h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="relative z-10">공유하기</span>
              </button>
              <button className="relative overflow-visible flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-none hover:bg-gray-50 transition-colors font-normal tracking-tight text-base md:text-lg">
                <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
                <svg className="w-6 h-6 md:w-7 md:h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="relative z-10">저장하기</span>
              </button>

              {/* 수정 버튼 — 작성자 본인 또는 운영자에게만 표시 */}
              {canEdit && (
                <button
                  onClick={() => { onEdit?.(currentItem); onClose(); }}
                  className="relative overflow-visible flex items-center gap-3 px-8 py-4 bg-white border-2 border-blue-500 text-blue-500 rounded-none hover:bg-blue-50 transition-colors font-normal tracking-tight text-base md:text-lg"
                >
                  <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
                  <svg className="w-6 h-6 md:w-7 md:h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span className="relative z-10">수정하기</span>
                </button>
              )}

              {/* 삭제 버튼 — 작성자 본인 또는 운영자에게만 표시 */}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="relative overflow-visible flex items-center gap-3 px-8 py-4 bg-white border-2 border-red-500 text-red-500 rounded-none hover:bg-red-50 transition-colors font-normal tracking-tight text-base md:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
                  <svg className="w-6 h-6 md:w-7 md:h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="relative z-10">{isDeleting ? '삭제 중...' : '삭제하기'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 이전 버튼 - 데스크탑 */}
        <button
          onClick={goToPrevious}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-14 h-14 md:w-16 md:h-16 rounded-none bg-white/10 hover:bg-white/20 backdrop-blur-sm items-center justify-center transition-colors"
        >
          <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 다음 버튼 - 데스크탑 */}
        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-14 h-14 md:w-16 md:h-16 rounded-none bg-white/10 hover:bg-white/20 backdrop-blur-sm items-center justify-center transition-colors"
        >
          <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 이전/다음 버튼 - 모바일 (하단) */}
        <div className="md:hidden absolute -bottom-24 left-1/2 -translate-x-1/2 flex gap-6">
          <button
            onClick={goToPrevious}
            className="w-14 h-14 rounded-none bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="w-14 h-14 rounded-none bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 페이지 인디케이터 */}
        <div className="absolute -bottom-14 md:-bottom-14 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-none">
          <span className="text-white text-base md:text-lg font-normal tracking-tight">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        {/* 모바일 스와이프 힌트 */}
        {showSwipeHint && (
          <div className="md:hidden absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-none flex items-center gap-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span className="text-white text-base">좌우로 스와이프</span>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** 현재 로그인 사용자의 역할 목록을 비동기로 가져오는 훅 */
function useUserRoles(isAuthenticated: boolean): { roles: string[]; isLoading: boolean } {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setRoles([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch('/api/auth/roles', { credentials: 'include' })
      .then((r) => r.json())
      .then((data: { roles?: string[] }) => {
        setRoles(data.roles ?? []);
        setIsLoading(false);
      })
      .catch(() => {
        setRoles([]);
        setIsLoading(false);
      });
  }, [isAuthenticated]);

  return { roles, isLoading };
}

type DownloadPerm = { allowed: boolean; message: string };

function getDownloadPermission(roles: string[], section?: string, isAuthenticated?: boolean): DownloadPerm {
  if (!roles.length && !isAuthenticated) return { allowed: false, message: '로그인 필요' };
  if (roles.includes('operator') || roles.includes('community')) return { allowed: true, message: '' };
  if (section === 'activity') return { allowed: false, message: 'ACE 멤버 및 운영진만 다운로드 가능' };
  if (isAuthenticated) return { allowed: true, message: '' };
  return { allowed: false, message: '로그인 필요' };
}

function triggerDownload(fileUrl: string, fileName: string, section?: string) {
  if (fileUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }
  const params = new URLSearchParams({ url: fileUrl, name: fileName, section: section ?? '' });
  const link = document.createElement('a');
  link.href = `/api/files/download?${params}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const CATEGORY_EMOJI: Record<string, string> = {
  Workshop: '🎨', Seminar: '💡', Contest: '🏆', Networking: '🤝',
  Safety: '🛡️', Planning: '📊', 'AI System': '🤖', Design: '✨',
  Data: '📈', Training: '🎓',
};

interface ModalTopAreaProps {
  thumbnail?: string;
  description: string;
  category: string;
  title: string;
}

function ModalTopArea({ thumbnail, description, category, title }: ModalTopAreaProps) {
  const [posterEmbed, setPosterEmbed] = useState<PosterEmbedData | null>(null);

  useEffect(() => {
    if (!thumbnail) setPosterEmbed(extractPosterEmbed(description));
    else setPosterEmbed(null);
  }, [description, thumbnail]);

  if (thumbnail) {
    const isDataUrl = thumbnail.startsWith('data:');
    return (
      <div className="aspect-[16/5] relative overflow-hidden border-b-2 border-gray-200">
        {isDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={title} src={thumbnail} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Image alt={title} src={thumbnail} fill className="object-cover" />
        )}
      </div>
    );
  }

  if (posterEmbed) {
    return (
      <div className="aspect-[16/5] border-b-2 border-gray-200 overflow-hidden">
        <PosterPreviewFrame html={posterEmbed.html} css={posterEmbed.css} />
      </div>
    );
  }

  // 썸네일도 포스터도 없으면 빈 상단 영역 표시 (빨간색 영역)
  return (
    <div className="aspect-[16/5] border-b-2 border-gray-200 overflow-hidden bg-black/5">
      {/* 빈 상단 영역 */}
    </div>
  );
}
