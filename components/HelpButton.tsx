'use client';

import { useState } from 'react';

interface HelpButtonProps {
  onClick: () => void;
}

/**
 * 도와줘요 ACE! 플로팅 버튼
 * 
 * 오른쪽 상단에 둥실둥실 떠다니는 구름 모양 버튼
 */
export default function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={onClick}
        className="fixed top-24 right-8 z-50 group"
        aria-label="도와줘요 ACE!"
      >
        {/* 구름 모양 컨테이너 */}
        <div className="relative">
          {/* 메인 구름 */}
          <div className="relative bg-gradient-to-br from-[#87CEEB] to-[#B0E0E6] rounded-full px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-float">
            <span className="text-[#2C5F6F] font-bold text-sm whitespace-nowrap flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              도와줘요 ACE!
            </span>
          </div>
          
          {/* 구름 장식 원들 */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-[#B0E0E6] rounded-full opacity-60 animate-float-delay-1"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#A0D8E1] rounded-full opacity-50 animate-float-delay-2"></div>
        </div>

        {/* 툴팁 */}
        <div className="absolute right-0 top-full mt-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          AI에게 질문하거나 도움을 요청하세요
          <div className="absolute -top-1 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      </button>

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delay-1 {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes float-delay-2 {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-3px) translateX(2px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float-delay-1 3s ease-in-out infinite 0.5s;
        }

        .animate-float-delay-2 {
          animation: float-delay-2 3s ease-in-out infinite 1s;
        }
      `}</style>
    </>
  );
}
