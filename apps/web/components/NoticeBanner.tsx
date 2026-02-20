'use client';

import { useState, useEffect } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';

interface BannerItem {
  id: number;
  title: string;
  description: string;
  noticeIndex?: number;
}

interface NoticeBannerProps {
  onNoticeClick?: (noticeIndex: number) => void;
}

export default function NoticeBanner({ onNoticeClick }: NoticeBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners: BannerItem[] = [
    {
      id: 1,
      title: 'AI 디자인랩 정식 오픈!',
      description: '현대건설 임직원 여러분의 AI 활용을 지원합니다',
      noticeIndex: 0,
    },
    {
      id: 2,
      title: 'PlayDay 3월 일정 안내',
      description: '3월 15일 (금) 14:00 — AI 트렌드 세미나',
      noticeIndex: 1,
    },
    {
      id: 3,
      title: 'ACE 2기 모집 중',
      description: '2월 28일까지 지원하세요! 선착순 20명',
      noticeIndex: 2,
    },
    {
      id: 4,
      title: 'AI 활용 우수 사례 공모전',
      description: '최우수상 100만원! 3월 31일까지',
      noticeIndex: 6,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full rounded-none overflow-hidden border border-[#D9D6D3] bg-white">
      {/* 배너 슬라이드 */}
      <div className="relative h-48 md:h-56">
        {banners.map((banner, index) => (
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
            <div
              className="h-full flex flex-col justify-center items-center text-center cursor-pointer transition-colors hover:bg-[#FAFBFC] px-8"
              style={{ background: 'linear-gradient(135deg, #FFFFFF, #EEF4FF)' }}
              onClick={() => banner.noticeIndex !== undefined && onNoticeClick?.(banner.noticeIndex)}
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.08em] text-[#111] mb-3">
                {banner.title}
              </h2>
              <p className="text-sm md:text-base text-[#6B6B6B]">
                {banner.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 좌측 화살표 */}
      <button
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 -translate-y-1/2 relative overflow-visible w-9 h-9 bg-white/80 backdrop-blur-sm border border-[#D9D6D3] rounded-none flex items-center justify-center hover:border-[#6B6B6B] transition-colors"
      >
        <GlowingEffect disabled={false} spread={12} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
        <svg className="w-4 h-4 text-[#111] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 우측 화살표 */}
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 relative overflow-visible w-9 h-9 bg-white/80 backdrop-blur-sm border border-[#D9D6D3] rounded-none flex items-center justify-center hover:border-[#6B6B6B] transition-colors"
      >
        <GlowingEffect disabled={false} spread={12} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
        <svg className="w-4 h-4 text-[#111] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
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
