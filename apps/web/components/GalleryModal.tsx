'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { extractPosterEmbed, buildPosterSrcDoc } from '@/lib/utils/poster-embed';

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
  section?: string;
  onDelete?: () => void;
  onEdit?: (item: GalleryItem) => void;
}

export default function GalleryModal({
  isOpen,
  onClose,
  items,
  currentIndex,
  section,
  onDelete,
  onEdit,
}: GalleryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(600);
  const iframeRef = useRef<HTMLIFrameElement>(null);
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
  const canEdit   = (isAuthor || isOperator) && !!currentItem?.id;

  /* iframe postMessage 높이 조정 (배너 페이지와 동일한 방식) */
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'iframe-resize' && typeof e.data.height === 'number') {
        const h = Math.min(6000, Math.max(400, e.data.height + 40));
        setIframeHeight(h);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  /* 게시글 바뀔 때마다 높이 리셋 */
  useEffect(() => {
    setIframeHeight(600);
  }, [currentIndex]);

  /* ESC 닫기 + body scroll lock */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

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

  if (!isOpen || !currentItem) return null;

  /* 포스터 embed 여부 판단 */
  const posterEmbed = extractPosterEmbed(currentItem.description);
  const srcDoc = posterEmbed
    ? buildPosterSrcDoc(posterEmbed.html, posterEmbed.css, { resize: true })
    : null;

  return (
    /* 오버레이 — 스크롤 가능하도록 overflow-y-auto */
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      {/* 콘텐츠 래퍼 */}
      <div
        className="relative w-full max-w-4xl mx-auto my-10 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute -top-8 right-4 w-10 h-10 rounded-none bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 아티클 카드 (배너 페이지와 동일한 구조) */}
        <article className="bg-white border border-gray-200 shadow-2xl overflow-hidden">

          {/* 헤더 */}
          <div className="px-8 py-6 border-b border-gray-200">
            {/* 카테고리 배지 */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {currentItem.category.split(',').filter(Boolean).map((cat) => (
                <span key={cat} className="px-3 py-1 bg-gray-900 text-white text-sm font-normal tracking-tight">
                  {cat.trim()}
                </span>
              ))}
              {currentItem.session && (
                <span className="px-3 py-1 bg-gray-700 text-white text-sm font-normal tracking-tight flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {currentItem.session}회차
                </span>
              )}
            </div>
            {/* 제목 */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">{currentItem.title}</h1>
            {/* 작성자 & 날짜 */}
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{currentItem.author}</span>
              <span>·</span>
              <span>{currentItem.date}</span>
            </div>
          </div>

          {/* 본문 — 포스터 embed면 iframe, 아니면 RichTextEditor */}
          <div className="w-full">
            {srcDoc ? (
              <iframe
                ref={iframeRef}
                srcDoc={srcDoc}
                title={currentItem.title}
                sandbox="allow-same-origin allow-popups allow-top-navigation allow-scripts"
                className="w-full border-0 bg-white block"
                style={{ height: iframeHeight }}
                scrolling="no"
              />
            ) : (
              <div className="px-8 py-6">
                <RichTextEditor content={currentItem.description} editable={false} minHeight="300px" />
              </div>
            )}
          </div>

          {/* 상세 설명 */}
          {currentItem.fullDescription && (
            <div className="px-8 py-6 border-t border-gray-100">
              <RichTextEditor content={currentItem.fullDescription} editable={false} minHeight="200px" />
            </div>
          )}

          {/* 해시태그 */}
          {currentItem.tags && currentItem.tags.length > 0 && (
            <div className="px-8 py-5 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">해시태그</p>
              <div className="flex flex-wrap gap-2">
                {currentItem.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 첨부파일 */}
          {currentItem.attachments && currentItem.attachments.length > 0 && (
            <div className="px-8 py-5 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">첨부파일 ({currentItem.attachments.length})</p>
              <div className="space-y-2">
                {currentItem.attachments.map((file, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleFileDownload(file.url, file.name, e)}
                    disabled={!downloadPerm.allowed && !isRolesLoading}
                    className={`flex items-center justify-between w-full px-4 py-3 bg-gray-50 border border-gray-200 text-left transition-all group ${
                      downloadPerm.allowed || isRolesLoading ? 'hover:shadow-sm cursor-pointer' : 'opacity-60 cursor-not-allowed'
                    }`}
                    title={downloadPerm.allowed || isRolesLoading ? '' : downloadPerm.message}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-800">{file.name}</span>
                      <span className="text-xs text-gray-400">{file.size}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="px-8 py-5 border-t border-gray-200 flex flex-wrap gap-3">
            <button className="relative overflow-visible flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
              <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              <span className="relative z-10">좋아요</span>
            </button>
            <button className="relative overflow-visible flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm">
              <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="relative z-10">공유하기</span>
            </button>
            <button className="relative overflow-visible flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm">
              <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="relative z-10">저장하기</span>
            </button>

            {canEdit && (
              <button
                onClick={() => { onEdit?.(currentItem); onClose(); }}
                className="relative overflow-visible flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors text-sm"
              >
                <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="relative z-10">수정하기</span>
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="relative overflow-visible flex items-center gap-2 px-5 py-2.5 bg-white border border-red-400 text-red-500 hover:bg-red-50 transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="relative z-10">{isDeleting ? '삭제 중...' : '삭제하기'}</span>
              </button>
            )}
          </div>

        </article>
      </div>
    </div>
  );
}

/* ── 헬퍼 훅 / 함수 ── */

function useUserRoles(isAuthenticated: boolean): { roles: string[]; isLoading: boolean } {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { setRoles([]); setIsLoading(false); return; }
    setIsLoading(true);
    fetch('/api/auth/roles', { credentials: 'include' })
      .then((r) => r.json())
      .then((data: { roles?: string[] }) => { setRoles(data.roles ?? []); setIsLoading(false); })
      .catch(() => { setRoles([]); setIsLoading(false); });
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
