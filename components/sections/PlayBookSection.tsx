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
  teams: playbookTeams
};

const categoryLabels: Record<PlaybookCategory, string> = {
  usecase: '활용사례 (use case)',
  trend: 'AI Trend',
  prompt: 'Prompt 사례',
  hai: 'HAI',
  teams: 'Teams'
};

export default function PlayBookSection({ onWriteClick, onCardClick }: PlayBookSectionProps) {
  const [category, setCategory] = useState<PlaybookCategory>('usecase');
  const currentData = categoryData[category];

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-12">
        <SectionHeader
          title="PlayBook"
          action={<WriteButton onClick={() => onWriteClick('playbook')} />}
        />

        <div className="flex flex-wrap gap-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
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
