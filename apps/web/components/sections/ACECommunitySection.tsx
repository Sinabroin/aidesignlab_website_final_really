import { useState } from 'react';
import GalleryCard from '@/components/GalleryCard';
import SectionHeader from '@/components/common/SectionHeader';
import WriteButton from '@/components/common/WriteButton';
import FilterButton from '@/components/common/FilterButton';
import { GalleryItem, activityData } from '@/data/mockData';

type ActivityCategory = 'safety' | 'planning' | 'ai' | 'design' | 'all';

interface ACECommunitySectionProps {
  onWriteClick: (section: string) => void;
  onCardClick: (items: GalleryItem[], index: number) => void;
}

const categoryLabels: Record<ActivityCategory, string> = {
  all: '전체보기',
  safety: '안전',
  planning: '일정관리',
  ai: 'AI 시스템',
  design: '디자인'
};

export default function ACECommunitySection({ onWriteClick, onCardClick }: ACECommunitySectionProps) {
  const [category, setCategory] = useState<ActivityCategory>('all');

  const filteredData = category === 'all'
    ? activityData
    : activityData.filter(item => {
        const categoryMap: Record<string, ActivityCategory> = {
          'Safety': 'safety',
          'Planning': 'planning',
          'AI System': 'ai',
          'Design': 'design'
        };
        return categoryMap[item.category] === category;
      });

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
        {filteredData.map((item, index) => (
          <GalleryCard
            key={index}
            {...item}
            onClick={() => onCardClick(filteredData, index)}
          />
        ))}
      </div>
    </div>
  );
}
