import { useState, useMemo } from 'react';
import GalleryCard from '@/components/GalleryCard';
import SectionHeader from '@/components/common/SectionHeader';
import WriteButton from '@/components/common/WriteButton';
import FilterButton from '@/components/common/FilterButton';
import { GalleryItem, playdayData } from '@/data/mockData';

type PlaydayView = 'latest' | 'archive';

interface PlayDaySectionProps {
  onWriteClick: (section: string) => void;
  onCardClick: (items: GalleryItem[], index: number) => void;
}

export default function PlayDaySection({ onWriteClick, onCardClick }: PlayDaySectionProps) {
  const [view, setView] = useState<PlaydayView>('latest');

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
  }, []);

  const currentData = view === 'latest' ? latestData : archiveData;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-12">
        <SectionHeader
          title="PlayDay"
          action={<WriteButton onClick={() => onWriteClick('playday')} />}
        />

        <div className="flex flex-wrap gap-3">
          <FilterButton active={view === 'latest'} onClick={() => setView('latest')}>
            최신 내역
          </FilterButton>
          <FilterButton active={view === 'archive'} onClick={() => setView('archive')}>
            이전 내역 보러가기
          </FilterButton>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {currentData.map((item, index) => (
          <GalleryCard
            key={index}
            {...item}
            onClick={() => onCardClick(currentData, index)}
          />
        ))}
      </div>
    </div>
  );
}
