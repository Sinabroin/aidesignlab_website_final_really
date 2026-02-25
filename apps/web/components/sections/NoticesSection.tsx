'use client';

import { useState } from 'react';
import { useNotices } from '@/hooks/useData';
import type { Notice } from '@/types';

function NoticeDescription({ notice }: { notice: Notice }) {
  if (notice.description) return <>{notice.description}</>;
  if (notice.badge === '필독') return <>AI 디자인랩을 이용하시기 전에 반드시 읽어주세요.</>;
  if (notice.badge === '공지') return <>3월 PlayDay 일정이 확정되었습니다. 많은 참여 부탁드립니다.</>;
  if (notice.badge === '모집') return <>ACE 2기 멤버를 모집합니다. 관심 있으신 분들은 신청해주세요.</>;
  if (notice.badge === '이벤트') return <>AI 프롬프트 경진대회에 참가하여 상금을 받아보세요.</>;
  return null;
}

function NoticeCard({ notice, index }: { notice: Notice; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasContent = !!notice.content && notice.content !== '<p></p>';

  return (
    <div
      className="bg-white border border-[#D9D6D3] rounded-none p-5 transition-all duration-200 hover:border-[#6B6B6B] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
    >
      <div
        className={`flex items-start justify-between ${hasContent ? 'cursor-pointer' : ''}`}
        onClick={() => hasContent && setExpanded((v) => !v)}
      >
        <div className="flex items-start gap-3 flex-1">
          <span className="text-[10px] text-white px-2.5 py-0.5 rounded-none bg-[#111] shrink-0 mt-0.5">
            {notice.badge}
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-normal text-[#111] mb-1">
              {notice.title}
              {hasContent && (
                <span className="ml-2 text-[10px] text-[#6B6B6B]">
                  {expanded ? '▼' : '▶'}
                </span>
              )}
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              <NoticeDescription notice={notice} />
            </p>
          </div>
        </div>
        <span className="text-xs text-[#6B6B6B] shrink-0 ml-4">{notice.date}</span>
      </div>

      {expanded && hasContent && (
        <div className="mt-4 pt-4 border-t border-[#D9D6D3]">
          <div
            className="prose prose-sm max-w-none text-[#333] prose-headings:text-[#111] prose-a:text-blue-600"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>
      )}
    </div>
  );
}

export default function NoticesSection() {
  const { data: notices, isLoading, error } = useNotices();

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-light tracking-[0.08em] text-[#111] mb-2">
          공지사항
        </h1>
        <p className="text-sm text-[#6B6B6B]">AI 디자인랩의 모든 공지사항을 확인하세요</p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-[#6B6B6B]">로딩 중...</div>
        ) : (
          notices.map((notice, index) => (
            <NoticeCard key={index} notice={notice} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
