import { useState } from 'react';
import GalleryCard from '@/components/GalleryCard';
import SectionHeader from '@/components/common/SectionHeader';
import WriteButton from '@/components/common/WriteButton';
import FilterButton from '@/components/common/FilterButton';
import { GalleryItem, playbookUsecases, playbookTrends, playbookPrompts, playbookHAI, playbookTeams } from '@/data/mockData';

type PlaybookCategory = 'usecase' | 'trend' | 'prompt' | 'hai' | 'teams';

interface PlayBookSectionProps {
  onWriteClick: (section: string) => void;
  onCardClick: (items: GalleryItem[], index: number) => void;
}

const categoryData: Record<PlaybookCategory, GalleryItem[]> = {
  usecase: playbookUsecases,
  trend: playbookTrends,
  prompt: playbookPrompts,
  hai: playbookHAI,
  teams: playbookTeams,
};

const categoryLabels: Record<PlaybookCategory, string> = {
  usecase: '활용사례 (use case)',
  trend: 'AI Trend',
  prompt: 'Prompt 사례',
  hai: 'HAI',
  teams: 'Teams',
};

export default function PlayBookSection({ onWriteClick, onCardClick }: PlayBookSectionProps) {
  const [category, setCategory] = useState<PlaybookCategory>('usecase');
  const currentData = categoryData[category];

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

      {/* 12-column grid: first row 8+4, then 4x3 */}
      <div className="grid grid-cols-12 gap-6">
        {currentData.map((item, index) => {
          // First item gets 8 cols, second gets 4 cols, rest get 4 cols each
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
        })}
      </div>
    </div>
  );
}
