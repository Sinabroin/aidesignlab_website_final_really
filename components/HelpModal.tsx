'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlowingEffect } from '@/components/common/GlowingEffect';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AI 관련 SOS 모달
 * 
 * 도와줘요 ACE! 버튼 클릭 시 표시되는 질문/도움 요청 모달
 */
export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [recentHelps, setRecentHelps] = useState([
    {
      title: "계약서 분석 자동화",
      category: "문서 분석",
      author: "김민수",
      date: "2026.02.10"
    },
    {
      title: "프로젝트 일정 예측 모델",
      category: "데이터 분석",
      author: "이지은",
      date: "2026.02.09"
    }
  ]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 실제 제출 로직 구현
    console.log({ title, category, content });
    alert('질문이 접수되었습니다!');
    setTitle('');
    setCategory('');
    setContent('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-none shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-none flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-normal tracking-tight text-white">도와줘요 ACE!</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  router.push('/help-requests');
                  onClose();
                }}
                className="relative overflow-visible px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-normal tracking-tight rounded-none transition-colors flex items-center gap-2"
              >
                <GlowingEffect disabled={false} spread={16} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
                <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="relative z-10">신청 목록</span>
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-none bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-normal tracking-tight text-gray-300 mb-2">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 계약서 분석 자동화"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-none text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
              required
            />
          </div>

          {/* 희망 분야/분야 */}
          <div>
            <label className="block text-sm font-normal tracking-tight text-gray-300 mb-2">
              희망 분야/분야
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-none text-white focus:outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer"
              required
            >
              <option value="">선택해주세요</option>
              <option value="자연어처리">자연어처리</option>
              <option value="이미지생성">이미지 생성</option>
              <option value="데이터분석">데이터 분석</option>
              <option value="자동화">업무 자동화</option>
              <option value="챗봇">챗봇 개발</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-normal tracking-tight text-gray-300 mb-2">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="AI 적용이 필요한 업무와 기대효과"
              rows={6}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-none text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors resize-none"
              required
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
              className="relative overflow-visible w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-normal tracking-tight rounded-none transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <GlowingEffect disabled={false} spread={20} movementDuration={1.5} inactiveZone={0.3} borderWidth={2} proximity={15} />
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="relative z-10">신청하기</span>
          </button>
        </form>

        {/* 최근 신청 */}
        <div className="border-t border-gray-700 p-6 bg-gray-800/50">
          <h3 className="text-lg font-normal tracking-tight text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            최근 신청
          </h3>
          <div className="space-y-3">
            {recentHelps.map((help, index) => (
              <div
                key={index}
                className="p-4 bg-gray-900/50 border border-gray-700 rounded-none hover:border-gray-500 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-normal tracking-tight rounded-none">
                        {help.category}
                      </span>
                    </div>
                    <h4 className="font-normal tracking-tight text-white mb-1">{help.title}</h4>
                    <p className="text-sm text-gray-400">
                      {help.author} · {help.date}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
