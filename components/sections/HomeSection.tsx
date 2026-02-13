'use client';

import NoticeBanner from '@/components/NoticeBanner';
import { GlowingEffect } from '@/components/common/GlowingEffect';
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
      <div className="bg-white rounded-none border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 p-4">
          <h2 className="text-2xl font-normal tracking-tight text-white">📢 공지사항</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {notices.map((notice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-none hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className={`${notice.badgeColor} text-white text-xs font-normal tracking-tight px-3 py-1 rounded-none`}>
                    {notice.badge}
                  </span>
                  <h3 className="font-normal tracking-tight text-gray-900">{notice.title}</h3>
                </div>
                <span className="text-sm text-gray-500">{notice.date}</span>
              </div>
            ))}
          </div>
          
          {/* MORE 버튼 */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => onNavigate('notices')}
              className="relative overflow-visible text-sm text-gray-900 hover:text-gray-700 font-normal tracking-tight flex items-center gap-1 transition-colors"
            >
              <GlowingEffect disabled={false} spread={14} movementDuration={1.5} inactiveZone={0.4} borderWidth={2} proximity={10} />
              <span className="relative z-10">MORE</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-none border border-gray-200 p-6">
          <h3 className="text-lg font-normal tracking-tight text-gray-900 mb-3">📅 이번 주 일정</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {schedules.map((schedule, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-900 mt-1">•</span>
                <span><strong>{schedule.date}</strong> - {schedule.event}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 rounded-none border border-gray-200 p-6">
          <h3 className="text-lg font-normal tracking-tight text-gray-900 mb-3">🎯 Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-gray-900 hover:text-gray-700 hover:underline font-medium">
                  → {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {previews.map((preview, idx) => (
        <div key={idx} className="bg-white rounded-none border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-normal tracking-tight text-gray-900">{preview.title}</h2>
            <button
              onClick={() => onNavigate(preview.tab)}
              className="relative overflow-visible text-sm text-gray-900 hover:text-gray-700 font-normal tracking-tight flex items-center gap-1 transition-colors"
            >
              <GlowingEffect disabled={false} spread={14} movementDuration={1.5} inactiveZone={0.4} borderWidth={2} proximity={10} />
              <span className="relative z-10">전체보기</span>
              <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="aspect-[16/10] bg-gray-100 rounded-none mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-normal tracking-tight text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
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
