'use client';

import { GlowingEffect } from '@/components/common/GlowingEffect';

interface HelpButtonProps {
  onClick: () => void;
}

export default function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className="fixed top-24 md:top-20 right-4 md:right-6 z-50 group"
        aria-label="도와줘요 ACE!"
      >
        <div className="relative">
          <div className="relative overflow-visible bg-white border border-[#D9D6D3] hover:border-[#6B6B6B] rounded-none px-3 py-2 md:px-5 md:py-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 animate-float">
            <GlowingEffect
              disabled={false}
              spread={20}
              movementDuration={1.5}
              inactiveZone={0.3}
              borderWidth={2}
              proximity={15}
            />
            <span className="relative z-10 text-[#111] font-normal text-xs md:text-sm whitespace-nowrap flex items-center gap-1.5 md:gap-2">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">도와줘요 ACE!</span>
              <span className="sm:hidden">도움</span>
            </span>
          </div>
        </div>

        {/* 툴팁 */}
        <div className="absolute right-0 top-full mt-2 bg-[#111] text-white text-xs rounded-none px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          AI에게 질문하거나 도움을 요청하세요
          <div className="absolute -top-1 right-6 w-2 h-2 bg-[#111] transform rotate-45" />
        </div>
      </button>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
