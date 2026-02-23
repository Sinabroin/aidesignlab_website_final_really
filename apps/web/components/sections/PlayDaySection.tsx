import { useState, useMemo } from 'react';
import GalleryCard from '@/components/GalleryCard';
import SectionHeader from '@/components/common/SectionHeader';
import WriteButton from '@/components/common/WriteButton';
import FilterButton from '@/components/common/FilterButton';
import { usePlayday } from '@/hooks/useData';
import type { GalleryItem } from '@/types';

type PlaydayView = 'latest' | 'archive';

interface PlayDaySectionProps {
  onWriteClick: (section: string) => void;
  onCardClick: (items: GalleryItem[], index: number) => void;
}

export default function PlayDaySection({ onWriteClick, onCardClick }: PlayDaySectionProps) {
  const [view, setView] = useState<PlaydayView>('latest');
  const { data: playdayData, isLoading, error } = usePlayday();

  const { latestData, archiveData } = useMemo(() => {
    const latest = playdayData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date('2024-03-01');
    });
    const archive = playdayData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate < new Date('2024-03-01');
    });
    return { latestData: latest, archiveData: archive };
  }, [playdayData]);

  const currentData = view === 'latest' ? latestData : archiveData;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <SectionHeader
          title="PlayDay"
          action={<WriteButton onClick={() => onWriteClick('playday')} />}
        />

        <div className="flex flex-wrap gap-2 mt-6">
          <FilterButton active={view === 'latest'} onClick={() => setView('latest')}>
            최신 내역
          </FilterButton>
          <FilterButton active={view === 'archive'} onClick={() => setView('archive')}>
            이전 내역 보러가기
          </FilterButton>
        </div>
      </div>

      {/* 12-column grid */}
      <div className="grid grid-cols-12 gap-6">
        {isLoading ? (
          <div className="col-span-12 py-12 text-center text-[#6B6B6B]">로딩 중...</div>
        ) : (
        currentData.map((item, index) => {
          const colClass =
            index === 0
              ? 'col-span-12 md:col-span-8'
              : index === 1
              ? 'col-span-12 md:col-span-4'
              : 'col-span-12 md:col-span-4';
          return (
            <div key={index} className={colClass}>
              <GalleryCard
                {...item}
                onClick={() => onCardClick(currentData, index)}
              />
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
