import { notices } from '@/data/mockData';

export default function NoticesSection() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">공지사항</h1>
        <p className="text-gray-600">AI 디자인랩의 모든 공지사항을 확인하세요</p>
      </div>

      <div className="space-y-4">
        {notices.map((notice, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <span className={`${notice.badgeColor} text-white text-xs font-bold px-3 py-1 rounded shrink-0`}>
                  {notice.badge}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{notice.title}</h3>
                  <p className="text-sm text-gray-600">
                    {notice.badge === '필독' && 'AI 디자인랩을 이용하시기 전에 반드시 읽어주세요.'}
                    {notice.badge === '공지' && '3월 PlayDay 일정이 확정되었습니다. 많은 참여 부탁드립니다.'}
                    {notice.badge === '모집' && 'ACE 2기 멤버를 모집합니다. 관심 있으신 분들은 신청해주세요.'}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500 shrink-0 ml-4">{notice.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
