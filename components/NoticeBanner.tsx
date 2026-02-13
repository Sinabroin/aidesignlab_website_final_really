'use client';

import { useState, useEffect } from 'react';
import { GlowingEffect } from '@/components/common/GlowingEffect';

interface BannerItem {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
  noticeIndex?: number; // 공지사항 인덱스 (0부터 시작)
}

interface NoticeBannerProps {
  onNoticeClick?: (noticeIndex: number) => void;
}

/**
 * 사내 소식 배너 컴포넌트
 * 
 * 슬라이더 형식으로 여러 배너를 자동으로 순환합니다.
 * 좌우 화살표로 수동 조작도 가능합니다.
 */
export default function NoticeBanner({ onNoticeClick }: NoticeBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 배너 데이터 (여기를 수정하면 배너 내용이 바뀝니다)
  const banners: BannerItem[] = [
    {
      id: 1,
      title: '🎉 AI 디자인랩 정식 오픈!',
      description: '현대건설 임직원 여러분의 AI 활용을 지원합니다',
      backgroundColor: 'from-gray-900 to-gray-800',
      textColor: 'text-white',
      icon: '🚀',
      noticeIndex: 0 // "[중요] AI 디자인랩 이용 안내"
    },
    {
      id: 2,
      title: '📅 PlayDay 3월 일정 안내',
      description: '3월 15일 (금) 14:00 - AI 트렌드 세미나',
      backgroundColor: 'from-gray-800 to-gray-700',
      textColor: 'text-white',
      icon: '📆',
      noticeIndex: 1 // "PlayDay 3월 일정 공지"
    },
    {
      id: 3,
      title: '🏆 ACE 2기 모집 중',
      description: '2월 28일까지 지원하세요! 선착순 20명',
      backgroundColor: 'from-gray-700 to-gray-600',
      textColor: 'text-gray-900',
      icon: '⭐',
      noticeIndex: 2 // "ACE 2기 모집 안내"
    },
    {
      id: 4,
      title: '💡 AI 활용 우수 사례 공모전',
      description: '최우수상 100만원! 3월 31일까지',
      backgroundColor: 'from-gray-800 to-gray-900',
      textColor: 'text-white',
      icon: '🎁',
      noticeIndex: 6 // "AI 프롬프트 경진대회 개최"
    }
  ];

  // 자동 슬라이드 (5초마다)
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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full rounded-none overflow-hidden shadow-2xl mb-8">
      {/* 배너 슬라이드 */}
      <div className="relative h-64 md:h-80">
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
              className={`h-full bg-gradient-to-r ${banner.backgroundColor} p-8 md:p-12 flex flex-col justify-center items-center text-center cursor-pointer hover:brightness-105 transition-all`}
              onClick={() => banner.noticeIndex !== undefined && onNoticeClick?.(banner.noticeIndex)}
            >
              <div className="text-6xl mb-4">{banner.icon}</div>
              <h2 className={`text-3xl md:text-5xl font-normal tracking-tight ${banner.textColor} mb-4`}>
                {banner.title}
              </h2>
              <p className={`text-lg md:text-xl ${banner.textColor} opacity-90`}>
                {banner.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 좌측 화살표 */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 relative overflow-visible w-12 h-12 bg-white/30 backdrop-blur-sm rounded-none flex items-center justify-center hover:bg-white/50 transition-colors"
      >
        <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 우측 화살표 */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 relative overflow-visible w-12 h-12 bg-white/30 backdrop-blur-sm rounded-none flex items-center justify-center hover:bg-white/50 transition-colors"
      >
        <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 인디케이터 점 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-none transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
