import { useState } from 'react';
import GalleryCard from '@/components/GalleryCard';
import SectionHeader from '@/components/common/SectionHeader';
import WriteButton from '@/components/common/WriteButton';
import FilterButton from '@/components/common/FilterButton';
import { useActivity } from '@/hooks/useData';
import type { GalleryItem } from '@/types';

type ActivityCategory = 'all' | 'usecase' | 'collaboration' | 'weekly_card';

interface ACECommunitySectionProps {
  onWriteClick: (section: string) => void;
  onCardClick: (items: GalleryItem[], index: number) => void;
}

const categoryLabels: Record<ActivityCategory, string> = {
  all: '전체보기',
  usecase: '활용사례 (use case)',
  collaboration: '사내 협업툴',
  weekly_card: 'Weekly Card',
};

export default function ACECommunitySection({ onWriteClick, onCardClick }: ACECommunitySectionProps) {
  const [category, setCategory] = useState<ActivityCategory>('all');
  const { data: activityData, isLoading, error } = useActivity();

  const filteredData = category === 'all'
    ? activityData
    : activityData.filter(item => {
        const cats = item.category.split(',').map(c => c.trim());
        return cats.includes(category);
      });

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <SectionHeader
          title="ACE 커뮤니티"
          action={<WriteButton onClick={() => onWriteClick('activity')} />}
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {(Object.keys(categoryLabels) as ActivityCategory[]).map((cat) => (
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

      {/* 갤러리 */}
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-[#6B6B6B]">로딩 중...</div>
        ) : (
        filteredData.map((item, index) => (
          <GalleryCard
            key={index}
            {...item}
            onClick={() => onCardClick(filteredData, index)}
          />
        ))
        )}
      </div>
    </div>
  );
}
