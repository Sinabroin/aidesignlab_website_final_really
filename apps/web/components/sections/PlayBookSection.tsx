import { useState } from 'react';
import GalleryCard from '@/components/GalleryCard';
import SectionHeader from '@/components/common/SectionHeader';
import WriteButton from '@/components/common/WriteButton';
import FilterButton from '@/components/common/FilterButton';
import { usePlaybook } from '@/hooks/useData';
import type { GalleryItem } from '@/types';

type PlaybookCategory = 'usecase' | 'trend' | 'prompt' | 'hai' | 'teams' | 'interview';

interface PlayBookSectionProps {
  onWriteClick: (section: string) => void;
  onCardClick: (items: GalleryItem[], index: number) => void;
}

const categoryLabels: Record<PlaybookCategory, string> = {
  usecase: '활용사례 (use case)',
  trend: 'AI Trend',
  prompt: 'Prompt 사례',
  hai: 'HAI',
  teams: 'Teams',
  interview: 'AI 활용 인터뷰',
};

export default function PlayBookSection({ onWriteClick, onCardClick }: PlayBookSectionProps) {
  const [category, setCategory] = useState<PlaybookCategory>('usecase');
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
          action={<WriteButton onClick={() => onWriteClick('playbook')} />}
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
