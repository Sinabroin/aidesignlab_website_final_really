/** 게시글 카테고리 선택 드롭다운 */

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

export default function CategorySelect({ section, value, onChange }: CategorySelectProps) {
  const options = CATEGORIES[section] ?? [];

  return (
    <div>
      <label className="block text-sm font-normal tracking-tight text-gray-700 mb-2">
        카테고리 <span className="text-red-500">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name="postCategory"
        className="w-full px-4 py-3 border border-gray-300 rounded-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none appearance-none cursor-pointer"
        required
      >
        <option value="">선택해주세요</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
