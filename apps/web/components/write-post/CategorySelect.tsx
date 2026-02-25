/** 게시글 카테고리 다중 선택 토글 */

import { GlowingEffect } from '@/components/common/GlowingEffect';

const CATEGORIES: Record<string, { value: string; label: string }[]> = {
  playbook: [
    { value: 'usecase', label: '활용사례' },
    { value: 'trend', label: 'AI Trend' },
    { value: 'prompt', label: '프롬프트' },
    { value: 'hai', label: 'HAI' },
    { value: 'teams', label: 'Teams' },
    { value: 'interview', label: 'AI 활용 인터뷰' },
  ],
  playday: [
    { value: 'workshop', label: '워크샵' },
    { value: 'seminar', label: '세미나' },
    { value: 'contest', label: '콘테스트' },
    { value: 'networking', label: '네트워킹' },
  ],
  activity: [
    { value: 'safety', label: '안전' },
    { value: 'planning', label: '일정관리' },
    { value: 'ai', label: 'AI 시스템' },
    { value: 'design', label: '디자인' },
  ],
};

interface CategorySelectProps {
  section: string;
  value: string;
  onChange: (value: string) => void;
}

function parseCategories(csv: string): string[] {
  return csv ? csv.split(',').filter(Boolean) : [];
}

export default function CategorySelect({ section, value, onChange }: CategorySelectProps) {
  const options = CATEGORIES[section] ?? [];
  const selected = parseCategories(value);

  const toggle = (cat: string) => {
    const next = selected.includes(cat)
      ? selected.filter((c) => c !== cat)
      : [...selected, cat];
    onChange(next.join(','));
  };

  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
        카테고리 <span className="text-red-500">*</span>
        <span className="ml-2 text-xs text-gray-400 font-normal">(여러 개 선택 가능)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`relative overflow-visible px-4 py-2 text-sm font-normal transition-all duration-200 rounded-none ${
                active
                  ? 'bg-[#111] text-white'
                  : 'bg-white text-[#6B6B6B] border border-[#D9D6D3] hover:border-[#6B6B6B] hover:text-[#111]'
              }`}
            >
              <GlowingEffect
                disabled={false}
                spread={16}
                movementDuration={1.5}
                inactiveZone={0.35}
                borderWidth={2}
                proximity={10}
              />
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
