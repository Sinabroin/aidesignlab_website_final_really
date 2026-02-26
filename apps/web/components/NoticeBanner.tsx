/** 홈 배너 캐러셀 — 반응형 비율, 흰색 배경 contain / cover 모드, 접근성 */
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { extractPosterEmbed, buildPosterSrcDoc } from '@/lib/utils/poster-embed';
import { WormLoader } from '@/components/common/WormLoader';
import type { HomeBanner } from '@/types';

type BannerAttachment = { name: string; type: string; size: number; data: string };

interface BannerItem {
  id: number | string;
  title: string;
  description: string;
  content?: string;
  href?: string;
  thumbnail?: string;
  attachments?: BannerAttachment[];
}

interface NoticeBannerProps {
  onNoticeClick?: (noticeIndex: number) => void;
  banners?: HomeBanner[];
  loading?: boolean;
}

/* ── Utilities ── */

function extractSingleImageSrc(content?: string): string | null {
  if (!content) return null;
  if (content.includes('data-type="poster-embed"')) return null;
  const matches = [...content.matchAll(/<img\s[^>]*src=["']([^"']+)["'][^>]*\/?>/g)];
  if (matches.length !== 1) return null;
  const stripped = content
    .replace(/<img\s[^>]*\/?>/g, '')
    .replace(/<\/?(?:p|div|br|span)\s*\/?>/gi, '')
    .trim();
  return stripped.length === 0 ? matches[0][1] : null;
}

function hasRichMedia(content?: string): boolean {
  if (!content) return false;
  return /<img\s|<video\s|<iframe\s|<table\s/.test(content);
}

/* ── Carousel hook ── */

function useCarousel(length: number) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (length <= 1 || paused) return;
    const id = setInterval(() => setCurrent((p) => (p + 1) % length), 5000);
    return () => clearInterval(id);
  }, [length, paused]);

  const go = useCallback(
    (dir: -1 | 1) => setCurrent((p) => (p + dir + length) % length),
    [length],
  );

  return { current, setCurrent, paused, setPaused, go };
}

/* ── Main Carousel ── */

export default function NoticeBanner({ onNoticeClick, banners = [], loading }: NoticeBannerProps) {
  const items = useMemo<BannerItem[]>(
    () =>
      banners.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        content: b.content,
        href: b.href,
        thumbnail: b.thumbnail,
        attachments: b.attachments,
      })),
    [banners],
  );

  const { current, setCurrent, setPaused, go } = useCarousel(items.length);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    },
    [go],
  );

  if (loading) return <BannerSkeleton />;
  if (items.length === 0) return <BannerSkeleton empty />;

  return (
    <div
      className="relative w-full overflow-hidden border border-[#D9D6D3] bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="캐러셀"
      aria-label="홈 배너"
    >
      <SlideTrack items={items} current={current} onNoticeClick={onNoticeClick} />
      {items.length > 1 && (
        <>
          <NavArrow direction="left" onClick={() => go(-1)} />
          <NavArrow direction="right" onClick={() => go(1)} />
          <DotIndicators total={items.length} current={current} onSelect={setCurrent} />
        </>
      )}
    </div>
  );
}

/* ── Slide Track (aspect-ratio container, lazy rendering) ── */

function SlideTrack({ items, current, onNoticeClick }: { items: BannerItem[]; current: number; onNoticeClick?: (i: number) => void }) {
  const len = items.length;
  const visible = useMemo(() => {
    if (len <= 3) return new Set(items.map((_, i) => i));
    const s = new Set<number>();
    s.add((current - 1 + len) % len);
    s.add(current);
    s.add((current + 1) % len);
    return s;
  }, [current, len, items]);

  return (
    <div
      className="relative w-full aspect-[4/5] md:aspect-[16/9] overflow-hidden"
      style={{ maxHeight: 'min(90vh, 800px)' }} // Adjusted height to make the blue section larger
    >
      {items.map((banner, idx) => {
        if (!visible.has(idx)) return null;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              idx === current
                ? 'opacity-100 translate-x-0 z-[1]'
                : idx < current
                  ? 'opacity-0 -translate-x-full z-0'
                  : 'opacity-0 translate-x-full z-0'
            }`}
            role="group"
            aria-roledescription="슬라이드"
            aria-label={`${idx + 1} / ${items.length}: ${banner.title}`}
            aria-hidden={idx !== current}
          >
            <BannerSlide banner={banner} onNoticeClick={onNoticeClick} />
          </div>
        );
      })}
    </div>
  );
}

/* ── Utilities (attachments) ── */

function getImageAttachments(attachments?: BannerAttachment[]): string[] {
  if (!attachments?.length) return [];
  return attachments
    .filter((a) => a.type.startsWith('image/'))
    .map((a) => `data:${a.type};base64,${a.data}`);
}

/* ── Slide Router — 콘텐츠 유형별 렌더러 분기 ── */

function BannerSlide({ banner, onNoticeClick }: { banner: BannerItem; onNoticeClick?: (i: number) => void }) {
  const [posterData, setPosterData] = useState<{ html: string; css: string } | null>(null);

  useEffect(() => {
    setPosterData(extractPosterEmbed(banner.content));
  }, [banner.content]);

  const imageSrc = useMemo(
    () => (!posterData ? extractSingleImageSrc(banner.content) : null),
    [banner.content, posterData],
  );

  const attachmentImages = useMemo(
    () => getImageAttachments(banner.attachments),
    [banner.attachments],
  );

  if (banner.thumbnail) {
    return <BannerMedia bannerId={banner.id} src={banner.thumbnail} title={banner.title} />;
  }
  if (posterData) {
    return <RichBannerSlide bannerId={banner.id} srcDoc={buildPosterSrcDoc(posterData.html, posterData.css, { fit: true })} title={banner.title} />;
  }
  if (imageSrc) {
    return <BannerMedia bannerId={banner.id} src={imageSrc} title={banner.title} />;
  }
  if (attachmentImages.length > 0) {
    return <BannerMedia bannerId={banner.id} src={attachmentImages[0]} title={banner.title} />;
  }
  if (hasRichMedia(banner.content)) {
    return <RichBannerSlide bannerId={banner.id} srcDoc={buildPosterSrcDoc(banner.content!, '', { fit: true })} title={banner.title} />;
  }
  return <TextBannerSlide banner={banner} onNoticeClick={onNoticeClick} />;
}

/* ── Image Banner — 흰색 배경, object-contain 중앙 정렬 ── */

function BannerMedia({ bannerId, src, title }: { bannerId: number | string; src: string; title: string }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  if (imgError) return <FallbackSlide title={title} bannerId={bannerId} />;

  return (
    <div className="relative w-full h-full bg-white cursor-pointer group" onClick={() => router.push(`/banner/${bannerId}`)}>
      <img
        src={src}
        alt={title}
        className="w-full h-full object-contain"
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
      />
      <HoverOverlay />
    </div>
  );
}

/* ── Rich HTML / Poster — iframe 렌더링 ── */

function RichBannerSlide({ bannerId, srcDoc, title }: { bannerId: string | number; srcDoc: string; title: string }) {
  const router = useRouter();
  return (
    <div className="relative w-full h-full cursor-pointer group" onClick={() => router.push(`/banner/${bannerId}`)}>
      <iframe
        srcDoc={srcDoc}
        sandbox="allow-same-origin allow-scripts"
        title={title}
        className="w-full h-full border-0 bg-white pointer-events-none"
        scrolling="no"
      />
      <HoverOverlay />
    </div>
  );
}

/* ── Text-only 배너 ── */

function TextBannerSlide({ banner, onNoticeClick }: { banner: BannerItem; onNoticeClick?: (i: number) => void }) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const hasContent = !!banner.content && banner.content !== '<p></p>';

  const handleClick = () => {
    // Prevent duplicate navigation
    if (hasContent) {
      if (pathname !== `/banner/${banner.id}`) {
        router.push(`/banner/${banner.id}`);
      }
      return;
    }
    if (banner.href) {
      if (pathname !== banner.href) {
        router.push(banner.href);
      }
      return;
    }
    onNoticeClick?.(0);
  };

  return (
    <button
      type="button"
      className="h-full w-full flex flex-col justify-center items-center text-center cursor-pointer transition-colors hover:bg-[#FAFBFC] px-8 border-none"
      style={{ background: 'linear-gradient(135deg, #FFFFFF, #EEF4FF)' }}
      onClick={handleClick}
      onTouchStart={(e) => e.stopPropagation()} // Debugging for touch devices
    >
      <h2 className="text-2xl md:text-3xl font-light tracking-[0.08em] text-[#111] mb-3">{banner.title}</h2>
      {hasContent ? (
        <div className="text-sm md:text-base text-[#6B6B6B] prose prose-sm max-w-2xl" dangerouslySetInnerHTML={{ __html: banner.content! }} />
      ) : (
        <p className="text-sm md:text-base text-[#6B6B6B]">{banner.description}</p>
      )}
    </button>
  );
}

/* ── Shared sub-components ── */

function HoverOverlay() {
  return (
    <div className="absolute inset-0 z-[3] bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-center pb-8">
      <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm text-sm text-gray-700 px-4 py-2 rounded-full shadow-sm">
        자세히 보기
      </span>
    </div>
  );
}

function FallbackSlide({ title, bannerId }: { title: string; bannerId: number | string }) {
  const router = useRouter();
  return (
    <div
      className="h-full w-full flex flex-col justify-center items-center text-center cursor-pointer bg-gradient-to-br from-neutral-100 to-neutral-200"
      onClick={() => router.push(`/banner/${bannerId}`)}
    >
      <svg className="w-12 h-12 text-neutral-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h2 className="text-xl font-light text-neutral-600">{title}</h2>
    </div>
  );
}

/* ── Navigation ── */

function NavArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const isLeft = direction === 'left';
  return (
    <div className={`absolute ${isLeft ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 z-10`}>
      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        aria-label={isLeft ? '이전 배너' : '다음 배너'}
        className="relative overflow-visible w-9 h-9 bg-white/80 backdrop-blur-sm border border-[#D9D6D3] rounded-full flex items-center justify-center hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        <GlowingEffect disabled={false} spread={12} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={10} />
        <svg className="w-4 h-4 text-[#111] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isLeft ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
        </svg>
      </button>
    </div>
  );
}

function DotIndicators({ total, current, onSelect }: { total: number; current: number; onSelect: (i: number) => void }) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`배너 ${i + 1}번으로 이동`}
          aria-current={i === current ? 'true' : undefined}
          className={`h-1.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
            i === current ? 'bg-[#111] w-6' : 'bg-[#D9D6D3] w-1.5 hover:bg-[#6B6B6B]'
          }`}
        />
      ))}
    </div>
  );
}

/* ── Skeleton (loading / empty) ── */

function BannerSkeleton({ empty }: { empty?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden border border-[#D9D6D3]" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #96C2FF 100%)' }}>
      <div
        className="aspect-[4/5] md:aspect-[16/9] flex items-center justify-center"
        style={{ maxHeight: 'min(80vh, 700px)' }}
      >
        {empty ? (
          <p className="text-sm text-gray-400">등록된 배너가 없습니다</p>
        ) : (
          <WormLoader />
        )}
      </div>
    </div>
  );
}
