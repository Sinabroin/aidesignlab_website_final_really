'use client';

import NoticeBanner from '@/components/NoticeBanner';
import MarqueeShowcase from '@/components/MarqueeShowcase';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { useHomeContent, useSchedules, useQuickLinks } from '@/hooks/useData';

interface HomeSectionProps {
  onNavigate: (tab: string) => void;
}

export default function HomeSection({ onNavigate }: HomeSectionProps) {
  const { banners, notices, playdayGuides } = useHomeContent();
  const { data: schedules } = useSchedules();
  const { data: quickLinks } = useQuickLinks();
  const guideSubtitle = playdayGuides[0]?.description ?? '최근 PlayDay 안내를 확인해보세요';

  const previews = [
    {
      title: 'PlayBook',
      subtitle: 'AI를 활용한 업무 혁신 사례',
      items: [
        { title: '우수 활용 사례', subtitle: 'AI를 활용한 업무 혁신 사례' },
        { title: 'AI Trend', subtitle: '최신 AI 기술 트렌드' },
      ],
      tab: 'playbook',
    },
    {
      title: 'PlayDay',
      subtitle: 'AI로 프로필만들기',
      items: [
        { title: '이번 회 이벤트', subtitle: guideSubtitle },
        { title: '지난 활동', subtitle: '이전 PlayDay 아카이브' },
      ],
      tab: 'playday',
    },
  ];

  const handleBannerClick = () => {
    onNavigate('notices');
  };

  return (
    <div className="space-y-12">
      {/* 배너 */}
      <NoticeBanner onNoticeClick={handleBannerClick} banners={banners} />

      {/* 마키 쇼케이스 */}
      <MarqueeShowcase />

      {/* 공지사항 */}
      <section className="bg-white border border-[#D9D6D3] rounded-none overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D9D6D3]">
          <h2 className="text-lg font-normal text-[#111]">공지사항</h2>
        </div>
        <div className="divide-y divide-[#D9D6D3]">
          {notices.slice(0, 5).map((notice, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#FAFBFC]"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-[10px] text-white px-2.5 py-0.5 rounded-none bg-[#111] shrink-0">
                  {notice.badge}
                </span>
                <h3 className="text-sm font-normal text-[#111]">{notice.title}</h3>
              </div>
              <span className="text-xs text-[#6B6B6B] shrink-0 ml-4">{notice.date}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end px-6 py-3 border-t border-[#D9D6D3]">
          <button
            onClick={() => onNavigate('notices')}
            className="relative overflow-visible text-xs font-normal text-[#6B6B6B] hover:text-[#0057FF] flex items-center gap-1 transition-colors"
          >
            <GlowingEffect disabled={false} spread={14} movementDuration={1.5} inactiveZone={0.4} borderWidth={2} proximity={10} />
            <span className="relative z-10">MORE</span>
            <svg className="w-3 h-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* PlayDay 안내 */}
      <section className="bg-white border border-[#D9D6D3] rounded-none overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D9D6D3]">
          <h2 className="text-lg font-normal text-[#111]">PlayDay 안내</h2>
        </div>
        <div className="divide-y divide-[#D9D6D3]">
          {playdayGuides.slice(0, 3).map((guide) => (
            <div key={guide.id} className="px-6 py-4 hover:bg-[#FAFBFC] transition-colors">
              <h3 className="text-sm font-normal text-[#111]">{guide.title}</h3>
              <p className="text-xs text-[#6B6B6B] mt-1">{guide.description}</p>
            </div>
          ))}
          {playdayGuides.length === 0 && (
            <div className="px-6 py-6 text-sm text-[#6B6B6B]">
              등록된 PlayDay 안내가 없습니다.
            </div>
          )}
        </div>
      </section>

      {/* Quick Info — 12-column grid */}
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 bg-white border border-[#D9D6D3] rounded-none p-6">
          <h3 className="text-sm font-normal text-[#111] mb-4 tracking-[0.08em] uppercase">이번 주 일정</h3>
          <ul className="space-y-3 text-sm text-[#6B6B6B]">
            {schedules.map((schedule, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-none bg-[#D9D6D3] mt-2 shrink-0" />
                <span><strong className="text-[#111]">{schedule.date}</strong> — {schedule.event}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 md:col-span-6 bg-white border border-[#D9D6D3] rounded-none p-6">
          <h3 className="text-sm font-normal text-[#111] mb-4 tracking-[0.08em] uppercase">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="text-[#6B6B6B] hover:text-[#0057FF] transition-colors">
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 섹션 프리뷰 카드 — 12-column Bento grid */}
      <section className="grid grid-cols-12 gap-6">
        {previews.map((preview, idx) => (
          <button
            type="button"
            key={idx}
            className="col-span-12 md:col-span-6 group bg-white border border-[#D9D6D3] rounded-none overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-[#6B6B6B] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] cursor-pointer text-left w-full"
            onClick={() => onNavigate(preview.tab)}
          >
            {/* 이미지 영역 — hover 시 내부 확대 효과 유지 */}
            <div className="aspect-[16/10] bg-gradient-to-br from-white to-[#EEF4FF] flex items-center justify-center overflow-hidden">
              <div className="text-center group-hover:scale-105 transition-transform duration-300">
                <h2 className="text-3xl md:text-4xl font-light tracking-[0.08em] text-[#111]">
                  {preview.title}
                </h2>
                <p className="text-sm text-[#6B6B6B] mt-2">{preview.subtitle}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {preview.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-normal text-[#111]">{item.title}</h3>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{item.subtitle}</p>
                    </div>
                    <svg className="w-4 h-4 text-[#D9D6D3] group-hover:text-[#0057FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#D9D6D3] flex justify-end">
                <span className="relative overflow-visible text-xs font-normal text-[#6B6B6B] group-hover:text-[#0057FF] flex items-center gap-1 transition-colors">
                  <GlowingEffect disabled={false} spread={14} movementDuration={1.5} inactiveZone={0.4} borderWidth={2} proximity={10} />
                  <span className="relative z-10">전체보기</span>
                  <svg className="w-3 h-3 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}
