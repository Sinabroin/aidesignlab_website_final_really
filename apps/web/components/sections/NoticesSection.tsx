import { notices } from '@/data/mockData';

export default function NoticesSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-light tracking-[0.08em] text-[#111] mb-2">
          공지사항
        </h1>
        <p className="text-sm text-[#6B6B6B]">AI 디자인랩의 모든 공지사항을 확인하세요</p>
      </div>

      <div className="space-y-3">
        {notices.map((notice, index) => (
          <div
            key={index}
            className="bg-white border border-[#D9D6D3] rounded-none p-5 cursor-pointer transition-all duration-200 hover:border-[#6B6B6B] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-[10px] text-white px-2.5 py-0.5 rounded-none bg-[#111] shrink-0 mt-0.5">
                  {notice.badge}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-normal text-[#111] mb-1">{notice.title}</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    {notice.badge === '필독' && 'AI 디자인랩을 이용하시기 전에 반드시 읽어주세요.'}
                    {notice.badge === '공지' && '3월 PlayDay 일정이 확정되었습니다. 많은 참여 부탁드립니다.'}
                    {notice.badge === '모집' && 'ACE 2기 멤버를 모집합니다. 관심 있으신 분들은 신청해주세요.'}
                    {notice.badge === '이벤트' && 'AI 프롬프트 경진대회에 참가하여 상금을 받아보세요.'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#6B6B6B] shrink-0 ml-4">{notice.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
