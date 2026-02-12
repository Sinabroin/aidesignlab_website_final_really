import NoticeBanner from '@/components/NoticeBanner';
import { notices, schedules, quickLinks } from '@/data/mockData';

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
}

export default function HomeSection({ onNavigate }: HomeSectionProps) {
  const previews = [
    {
      icon: '📚',
      title: 'PlayBook',
      subtitle: 'AI를 활용한 업무 혁신 사례',
      items: [
        { icon: '📚', title: '우수 활용 사례', subtitle: 'AI를 활용한 업무 혁신 사례' },
        { icon: '📈', title: 'AI Trend', subtitle: '최신 AI 기술 트렌드' }
      ],
      tab: 'playbook'
    },
    {
      icon: '🎨',
      title: 'PlayDay',
      subtitle: 'AI로 프로필만들기',
      items: [
        { icon: '🎨', title: '이번 회 이벤트', subtitle: '3월 PlayDay 안내' },
        { icon: '🎯', title: '지난 활동', subtitle: '이전 PlayDay 아카이브' }
      ],
      tab: 'playday'
    }
  ];

  const handleBannerClick = (noticeIndex: number) => {
    // 공지사항 페이지로 이동하면서 특정 공지사항 하이라이트
    onNavigate('notices');
  };

  return (
    <div className="space-y-6">
      <NoticeBanner onNoticeClick={handleBannerClick} />

      {/* 공지사항 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#87CEEB] to-[#B0E0E6] p-4">
          <h2 className="text-2xl font-bold text-white">📢 공지사항</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {notices.map((notice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className={`${notice.badgeColor} text-white text-xs font-bold px-3 py-1 rounded`}>
                    {notice.badge}
                  </span>
                  <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                </div>
                <span className="text-sm text-gray-500">{notice.date}</span>
              </div>
            ))}
          </div>
          
          {/* MORE 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => onNavigate('notices')}
              className="text-sm text-[#87CEEB] hover:text-[#77BED5] font-semibold flex items-center gap-1 transition-colors"
            >
              MORE
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#E8F6F8]/80 to-white rounded-lg border border-[#C1E7ED] p-6">
          <h3 className="text-lg font-bold text-[#87CEEB] mb-3">📅 이번 주 일정</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {schedules.map((schedule, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#87CEEB] mt-1">•</span>
                <span><strong>{schedule.date}</strong> - {schedule.event}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-[#C1E7ED]/80 to-white rounded-lg border border-[#87CEEB] p-6">
          <h3 className="text-lg font-bold text-[#87CEEB] mb-3">🎯 Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-[#87CEEB] hover:text-[#77BED5] hover:underline font-medium">
                  → {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {previews.map((preview, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{preview.title}</h2>
            <button
              onClick={() => onNavigate(preview.tab)}
              className="text-sm text-[#87CEEB] hover:text-[#77BED5] font-semibold flex items-center gap-1 transition-colors"
            >
              전체보기
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {preview.items.map((item, i) => (
              <div
                key={i}
                onClick={() => onNavigate(preview.tab)}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-[#E8F6F8]/80 to-[#B0E0E6]/80 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4A90A4] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
