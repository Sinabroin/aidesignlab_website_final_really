import { useState } from 'react';
import GalleryCard from '@/components/GalleryCard';
import SectionHeader from '@/components/common/SectionHeader';
import WriteButton from '@/components/common/WriteButton';
import FilterButton from '@/components/common/FilterButton';
import { usePlaybook } from '@/hooks/useData';
import type { GalleryItem } from '@/types';

type PlaybookCategory = 'all' | 'usecase' | 'collaboration' | 'weekly_card';

interface PlayBookSectionProps {
  onWriteClick: (section: string) => void;
  onCardClick: (items: GalleryItem[], index: number) => void;
  showWriteButton?: boolean;
}

const categoryLabels: Record<PlaybookCategory, string> = {
  all: '전체보기',
  usecase: '활용사례 (use case)',
  collaboration: '사내 협업툴',
  weekly_card: 'Weekly Card',
};

export default function PlayBookSection({
  onWriteClick,
  onCardClick,
  showWriteButton = true,
}: PlayBookSectionProps) {
  const [category, setCategory] = useState<PlaybookCategory>('all');
  const { data: currentData, isLoading, error } = usePlaybook(category);

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
          title="PlayBook"
          action={showWriteButton ? <WriteButton onClick={() => onWriteClick('playbook')} /> : null}
        />

        <div className="flex flex-wrap gap-2 mt-6">
          {(Object.keys(categoryLabels) as PlaybookCategory[]).map((cat) => (
            <FilterButton
              key={cat}
              active={category === cat}
              onClick={() => setCategory(cat)}
            >
              {categoryLabels[cat]}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* 12-column grid: equal size cards (2 per row on md) */}
      <div className="grid grid-cols-12 gap-6">
        {isLoading ? (
          <div className="col-span-12 py-12 text-center text-[#6B6B6B]">로딩 중...</div>
        ) : (
        currentData.map((item, index) => (
          <div key={index} className="col-span-12 md:col-span-6">
            <GalleryCard
              {...item}
              onClick={() => onCardClick(currentData, index)}
            />
          </div>
        ))
        )}
      </div>
    </div>
  );
}
