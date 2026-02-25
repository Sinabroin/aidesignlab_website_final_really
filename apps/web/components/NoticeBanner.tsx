/** 홈 배너 슬라이더 - 텍스트/리치콘텐츠/포스터 임베드 지원 */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { extractPosterEmbed, buildPosterSrcDoc } from '@/lib/utils/poster-embed';
import type { HomeBanner } from '@/types';

interface BannerItem {
  id: number | string;
  title: string;
  description: string;
  content?: string;
  href?: string;
  noticeIndex?: number;
}

interface NoticeBannerProps {
  onNoticeClick?: (noticeIndex: number) => void;
  banners?: HomeBanner[];
}

const FALLBACK_BANNERS: BannerItem[] = [
  { id: 1, title: 'AI 디자인랩 정식 오픈!', description: '현대건설 임직원 여러분의 AI 활용을 지원합니다', noticeIndex: 0 },
  { id: 2, title: 'PlayDay 3월 일정 안내', description: '3월 15일 (금) 14:00 \u2014 AI 트렌드 세미나', noticeIndex: 1 },
  { id: 3, title: 'ACE 2기 모집 중', description: '2월 28일까지 지원하세요! 선착순 20명', noticeIndex: 2 },
  { id: 4, title: 'AI 활용 우수 사례 공모전', description: '최우수상 100만원! 3월 31일까지', noticeIndex: 6 },
];

export default function NoticeBanner({ onNoticeClick, banners = [] }: NoticeBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const resolvedBanners = useMemo<BannerItem[]>(
    () =>
      banners.length > 0
        ? banners.map((item) => ({ id: item.id, title: item.title, description: item.description, content: item.content, href: item.href }))
        : FALLBACK_BANNERS,
    [banners]
  );

  const hasAnyPoster = useMemo(
    () => resolvedBanners.some((b) => b.content?.includes('data-type="poster-embed"')),
    [resolvedBanners]
  );

  useEffect(() => {
    if (resolvedBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % resolvedBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [resolvedBanners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + resolvedBanners.length) % resolvedBanners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % resolvedBanners.length);
  };

  const containerHeight = hasAnyPoster ? 'h-[640px] md:h-[780px]' : 'h-48 md:h-56';

  return (
    <div className="relative w-full rounded-none overflow-hidden border border-[#D9D6D3] bg-white">
      <div className={`relative ${containerHeight} transition-all duration-300`}>
        {resolvedBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-500 ${
              index === currentIndex
                ? 'opacity-100 translate-x-0'
                : index < currentIndex
                ? 'opacity-0 -translate-x-full'
                : 'opacity-0 translate-x-full'
            }`}
          >
            <BannerSlide banner={banner} onNoticeClick={onNoticeClick} />
          </div>
        ))}
      </div>

      <NavArrow direction="left" onClick={goToPrevious} />
      <NavArrow direction="right" onClick={goToNext} />

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {resolvedBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`배너 ${index + 1}번으로 이동`}
            className={`h-1.5 rounded-none transition-all ${
              index === currentIndex
                ? 'bg-[#111] w-6'
                : 'bg-[#D9D6D3] w-1.5 hover:bg-[#6B6B6B]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function NavArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const isLeft = direction === 'left';
  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? '이전 배너' : '다음 배너'}
      className={`absolute ${isLeft ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 relative overflow-visible w-9 h-9 bg-white/80 backdrop-blur-sm border border-[#D9D6D3] rounded-none flex items-center justify-center hover:border-[#6B6B6B] transition-colors z-10`}
    >
      <GlowingEffect disabled={false} spread={12} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
      <svg className="w-4 h-4 text-[#111] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isLeft ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  );
}

function hasRichMedia(content?: string): boolean {
  if (!content) return false;
  return /<img\s|<video\s|<iframe\s|<table\s/.test(content);
}

function BannerSlide({ banner, onNoticeClick }: { banner: BannerItem; onNoticeClick?: (i: number) => void }) {
  const [posterData, setPosterData] = useState<{ html: string; css: string } | null>(null);

  useEffect(() => {
    setPosterData(extractPosterEmbed(banner.content));
  }, [banner.content]);

  if (posterData) {
    return <RichBannerSlide bannerId={banner.id} srcDoc={buildPosterSrcDoc(posterData.html, posterData.css)} title={banner.title} />;
  }

  if (hasRichMedia(banner.content)) {
    const srcDoc = buildPosterSrcDoc(banner.content!, '');
    return <RichBannerSlide bannerId={banner.id} srcDoc={srcDoc} title={banner.title} />;
  }

  return <TextBannerSlide banner={banner} onNoticeClick={onNoticeClick} />;
}

function RichBannerSlide({ bannerId, srcDoc, title }: { bannerId: string | number; srcDoc: string; title: string }) {
  const router = useRouter();
  return (
    <div className="relative w-full h-full cursor-pointer group" onClick={() => router.push(`/banner/${bannerId}`)}>
      <iframe
        srcDoc={srcDoc}
        sandbox="allow-same-origin"
        title={title}
        className="w-full h-full border-0 bg-white pointer-events-none"
        scrolling="no"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-center pb-8">
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-sm text-gray-700 px-4 py-2 rounded-full shadow-sm">
          자세히 보기
        </span>
      </div>
    </div>
  );
}

function TextBannerSlide({ banner, onNoticeClick }: { banner: BannerItem; onNoticeClick?: (i: number) => void }) {
  const router = useRouter();
  const hasBannerContent = !!banner.content && banner.content !== '<p></p>';

  const handleClick = () => {
    if (hasBannerContent) { router.push(`/banner/${banner.id}`); return; }
    if (banner.href) { router.push(banner.href); return; }
    if (banner.noticeIndex !== undefined) onNoticeClick?.(banner.noticeIndex);
  };

  return (
    <button
      type="button"
      className="h-full w-full flex flex-col justify-center items-center text-center cursor-pointer transition-colors hover:bg-[#FAFBFC] px-8 border-none overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFFFFF, #EEF4FF)' }}
      onClick={handleClick}
    >
      <h2 className="text-2xl md:text-3xl font-light tracking-[0.08em] text-[#111] mb-3">
        {banner.title}
      </h2>
      {hasBannerContent ? (
        <div className="text-sm md:text-base text-[#6B6B6B] prose prose-sm max-w-2xl" dangerouslySetInnerHTML={{ __html: banner.content! }} />
      ) : (
        <p className="text-sm md:text-base text-[#6B6B6B]">{banner.description}</p>
      )}
    </button>
  );
}
