'use client';

import Marquee from '@/components/Marquee';
import MarqueeCard from '@/components/MarqueeCard';
import { useMarquee } from '@/hooks/useData';

export default function MarqueeShowcase() {
  const { topRow, bottomRow, isLoading, error } = useMarquee();

  if (isLoading) {
    return (
      <div className="py-8 text-center text-[#6B6B6B] text-sm">로딩 중…</div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500 text-sm">
        ACE 선정 게시물을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </div>
    );
  }

  if (topRow.length === 0 && bottomRow.length === 0) {
    return null;
  }

  return (
    <div className="relative space-y-4 py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

      {topRow.length > 0 && (
        <Marquee direction="left" speed={40}>
          {topRow.map((item, i) => (
            <MarqueeCard
              key={`top-${i}`}
              title={item.title}
              category={item.category}
              thumbnail={item.thumbnail}
            />
          ))}
        </Marquee>
      )}

      {bottomRow.length > 0 && (
        <Marquee direction="right" speed={45}>
          {bottomRow.map((item, i) => (
            <MarqueeCard
              key={`bottom-${i}`}
              title={item.title}
              category={item.category}
              thumbnail={item.thumbnail}
            />
          ))}
        </Marquee>
      )}
    </div>
  );
}
